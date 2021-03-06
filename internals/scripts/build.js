/* External dependencies */
const { blue, cyan, green, red, yellow } = require('chalk');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

/* Internal dependencies */
const config = require('../webpack/webpack.prod.js');

/**
 * Copies the favicon.ico to the client directory.  This is done because the
 *    Webpack file-loader function copies it into the client directory with
 *    an incorrect name.
 */
const copyFavicon = () => {
  console.log(blue('Copying favicon.ico to client directory...'));

  return new Promise((resolve) => {
    const sourcePath = path.join(process.cwd(), 'src/www/favicon.ico');
    const targetPath = path.join(process.cwd(), 'client/favicon.ico');
    fs
      .createReadStream(sourcePath)
      .pipe(fs.createWriteStream(targetPath));

    console.log(green('File write sucessful for favicon.ico.'));

    resolve();
  });
};

/**
 * Creates a JSON file with Webpack statistics so the bundle details can be
 *    viewed using a visualizer.
 * @param {Object} stats Stats object from Webpack.
 */
const createStatsJson = (stats) => new Promise((resolve, reject) => {
  const jsonStats = stats.toJson();

  // Print any errors to the console.
  if (jsonStats.hasErrors) {
    console.log(yellow('Webpack encountered these errors: '));
    return jsonStats.errors.map(error => console.log(red(error)));
  }

  // Print any warnings to the console.
  if (jsonStats.hasWarnings) {
    console.log(yellow('Webpack generated these warnings: '));
    jsonStats.warnings.map(warning => console.log(yellow(warning)));
  }

  console.log(blue('Writing stats to file.'));
  const statsPath = path.join(process.cwd(), 'stats.json');
  fs.writeFile(statsPath, JSON.stringify(jsonStats), (error) => {
    if (error) {
      console.log(red(error));
      reject();
    }
    console.log(green('Stats successfully written.'));
    resolve();
  });
});

/**
 * Generates the Webpack bundles and copies them to the client directory.  It
 *    also writes the stats to a JSON file for evaluation.
 */
const generateBundles = () => {
  console.log(blue('Generating minified Webpack bundle.  Please wait...'));

  return new Promise((resolve, reject) => {
    let compiler = webpack(config);

    // Show percentage completed on the console.
    compiler.apply(new ProgressPlugin((percentage, message) => {
      const percentageText = (percentage * 100).toFixed(2) + '%';
      console.log(cyan(percentageText, message));
    }));

    const generateStats = (process.argv.slice(2).toString() === 'true');

    compiler.run((error, stats) => {
      // Fatal error occurred. Stop here.
      if (error) {
        reject(`Webpack error: ${error}`);
      }

      if (generateStats) {
        createStatsJson(stats)
          .then(() => resolve())
          .catch(() => reject());
      } else {
        resolve();
      }
    });
  });
};

/**
 * Deletes any ".map" files in the client directory.
 */
const deleteUnneededFiles = () => new Promise((resolve) => {
  const clientDir = path.join(process.cwd(), 'client');
  shell.cd(clientDir);
  const mapFiles = shell.find('.').filter(file => file.match(/\.map$/));
  if (mapFiles.length) {
    shell.rm(mapFiles);
  }
  resolve();
});

copyFavicon()
  .then(generateBundles)
  .then(deleteUnneededFiles)
  .catch(error => console.log(red(error)));
