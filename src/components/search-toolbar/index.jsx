/* @flow */

/* External dependencies */
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

/* Internal dependencies */
import { primary1Color } from 'style/mui/palette';
import getRgbFromHex from 'lib/rgb-to-hex';

/* Types */
type DefaultProps = {
  isStandalone: boolean,
}

type Props = {
  handleSearchBoxChange: (event: Event, newValue: string) => void,
  children?: ?React.Element<*>,
  // If this value is false, don't show a box shadow and remove the
  // padding.
  isStandalone?: boolean,
};

/**
 * Sets the color and transparency of the IconButton inline.
 * @param {number} transparency Transparency value for the returned color.
 * @returns {Object} Object containing a "color" property with an RGB value.
 */
const getInlineStyle = (transparency?: number = 1): Object => {
  const { r, g, b } = getRgbFromHex(primary1Color);
  return {
    color: `rgba(${r},${g},${b},${transparency})`,
  };
};

/**
 * Toolbar for performing searching and filtering functions.
 * @param {Function} handleSearchBoxChange Action to perform when a value is
 *    entered in the Search box.
 * @param {Node} [children] Optional element to display at the end of
 *    the search bar.
 * @param {boolean} [isStandalone=true] Indicates if the toolbar is a separate
 *    entity or integrated into a form.
 */
class SearchToolbar extends Component<DefaultProps, Props, *> {
  props: Props;

  static defaultProps = {
    isStandalone: true,
  };

  /**
   * Changes the padding of the Toolbar component based on whether the
   *    rendered component has a Filter dropdown and if it is standalone
   *    or integrated into a form.
   * @returns {string|number} Padding to use for Toolbar.
   */
  getPaddingForToolbar = (): string | number => {
    const { children, isStandalone } = this.props;
    if (isStandalone) {
      return '0 24px';
    }

    if (children) {
      return 0;
    }

    return '0 8px 0 0';
  };

  render(): React.Element<*> {
    const {
      handleSearchBoxChange,
      children,
      isStandalone,
    } = this.props;

    return (
      <Toolbar
        className={(isStandalone) ? 'square-one-toolbar' : ''}
        style={{
          display: 'block',
          padding: this.getPaddingForToolbar(),
        }}
      >
        <ToolbarGroup
          style={{
            margin: 'auto',
            maxWidth: 1200,
          }}
        >
          <IconButton
            iconClassName="material-icons"
            iconStyle={getInlineStyle()}
          >
            search
          </IconButton>
          <TextField
            fullWidth={true}
            hintText="Search"
            hintStyle={getInlineStyle(0.5)}
            id="search-box"
            inputStyle={getInlineStyle()}
            onChange={handleSearchBoxChange}
          />
          {children}
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export default SearchToolbar;
