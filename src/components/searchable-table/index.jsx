/* @flow */

/* External dependencies */
import React from 'react';
import { List } from 'immutable';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';

/* Internal dependencies */
import { getSearchResults, getSortedData } from 'lib/query-actions';
import FilterMenu from 'components/filter-menu';
import SearchToolbar from 'components/search-toolbar';
import Table from './table';

/**
 * Column in the data table.
 * @typedef Column
 */
type Column = {
    key: string,
    label: string,
    sortable?: boolean,
    style: Object,
};

/**
 * Sorting parameters for the data table.
 * @typedef Sort
 */
export type Sort = {
    column: string,
    order: 'asc' | 'desc',
};

/**
 * Table with pagination, sorting, and filtering capabilities.
 * @param {Array} columns Columns to display in the table.
 * @param {List} data Data objects to display in the table.
 * @param {Function} handleAddTouchTap Action to perform when the Add button
 *      is pressed.
 * @param {Function} handleRowIconTouchTap Action to perform when the icon
 *      button associated with a specific row is pressed.
 * @param {Array} filterSelections Array of items to display in the Filter
 *      menu dropdown.
 * @param {Sort} [initialSort={}] Initial sorting to apply to the table data.
 * @param {Array} [searchFields=[]] Fields to include in the search.
 */
export default class SearchableTable extends React.Component {
    props: {
        columns: Array<Column>,
        data: List<*>,
        filterSelections: Array<string>,
        handleAddTouchTap: (event: Event) => void,
        handleRowIconTouchTap: (event: Event, row: Object) => void,
        initialSort?: Sort | Object,
        searchFields?: Array<string>,
    };

    state: {
        count: number,
        data: List<*>,
        page: number,
        rowSize: number,
    };

    static defaultProps = {
        filterSelections: [],
        initialSort: {},
        searchFields: [],
    };

    constructor(props: any): void {
        super(props);
        const { data } = (this.props: Object);
        this.state = {
            count: data.count(),
            data,
            page: 1,
            rowSize: 10,
        };
    }

    /**
     * Filters the data in the table based on the specified custom filter from
     *      the Filter Menu select field in the Search Toolbar.
     * @param {Event} event Event associated with the Filter Menu.
     * @param {string} value Value of the Filter Menu selection.
     */
    handleFilterMenuChange = (event: Event, key: string,
                              value: string): void => {
        // TODO: Write code to handle filter menu.
    };

    /**
     * Updates the table to display the next rows of data based on the page
     *      number and row size in state.
     */
    handleNextPageClick = (): void => {
        const { page } = this.state;
        const nextPage = (page + 1);
        this.setState({ page: nextPage });
    };

    /**
     * Updates the table to display the previous rows of data based on the page
     *      number and row size in state.
     */
    handlePreviousPageClick = (): void => {
        const { page } = this.state;
        const previousPage = (page === 1) ? 1 : page - 1;
        this.setState({ page: previousPage });
    };

    /**
     * Updates the table to display the specified amount of rows selected from
     *      the dropdown menu in the table footer.
     * @param {Event} event Event associated with the dropdown menu.
     * @param {number} key Key of the selected menu item.
     * @param {number} value Value of the selected menu item.
     */
    handleRowSizeChange = (event: Event, key?: number, value: number): void => {
        this.setState({ rowSize: value });
    };

    /**
     * Updates the table to only display rows with field values that include the
     *      text specified.
     * @param {Event} event Event associated with the Search Box.
     * @param {string} newValue Value of the Search Box.
     */
    handleSearchBoxChange = (event: Event, newValue: string): void => {
        const { data, searchFields } = this.props;
        const results = getSearchResults(data, newValue, searchFields);
        this.setState({
            count: results.count(),
            data: results,
        });
    };

    /**
     * Sorts the table by the specified column in the specified order.
     * @param {string} key Name of the column to sort by.
     * @param {string} order Order to sort by (<tt>asc</tt> or <tt>desc</tt>).
     */
    handleSortOrderChange = (key: string, order: string): void => {
        const { data } = this.props;
        const results = getSortedData(data, key, order);
        this.setState({
            count: results.count(),
            data: results,
        });
    };

    render(): React.Element<*> {
        const {
            columns,
            handleAddTouchTap,
            handleRowIconTouchTap,
            filterSelections,
            initialSort,
        } = this.props;

        const {
            count,
            data,
            page,
            rowSize,
        } = this.state;

        const startOfData = ((page * rowSize) - rowSize);
        const endOfData = (startOfData + rowSize);
        const paginatedData = data.slice(startOfData, endOfData);

        return (
            <div>
                <SearchToolbar
                    handleSearchBoxChange={this.handleSearchBoxChange}
                    isStandalone={true}
                >
                    <FilterMenu
                        handleFilterMenuChange={this.handleFilterMenuChange}
                        filterSelections={filterSelections}
                    />
                </SearchToolbar>
                <Paper
                    style={{
                        margin: '24px auto',
                        maxWidth: 1200,
                        padding: 0,
                        top: 0,
                        width: '95%',
                    }}
                >
                    <Table
                        columns={columns}
                        count={count}
                        data={paginatedData}
                        fixedHeader={true}
                        fixedFooter={true}
                        handleNextPageClick={this.handleNextPageClick}
                        handlePreviousPageClick={this.handlePreviousPageClick}
                        handleRowIconTouchTap={handleRowIconTouchTap}
                        handleRowSizeChange={this.handleRowSizeChange}
                        handleSortOrderChange={this.handleSortOrderChange}
                        initialSort={initialSort}
                        page={page}
                        recordCount={count}
                        rowSize={rowSize}
                        showRowHover={true}
                    />
                </Paper>
                <FloatingActionButton
                    onTouchTap={handleAddTouchTap}
                    secondary={true}
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                    }}
                >
                    <FontIcon
                        className="material-icons"
                        style={{ fontSize: 32 }}
                    >
                        add
                    </FontIcon>
                </FloatingActionButton>
            </div>
        );
    }
}
