// @flow
/* External dependencies */
import React from 'react';
import styled from 'styled-components';

/**
 * Styled container for the column.
 */
const Container = styled.div`
    flex: 1 400px;
    margin: 0 auto;
    min-width: 0px;
`;

/**
 * Adds the inline style based on the column index.  A left column (with
 *      index of 0) has right padding.  A right column (with index of 1) has
 *      left padding.
 */
const getInlineStyle = (columnIndex: number) => {
    if (columnIndex === 0) {
        return { paddingRight: 8 };
    }
    return { paddingLeft: 8 };
};

/**
 * Column on a two-column form.
 */
const FormColumn = ({
    columnIndex,
    children,
}: {
    columnIndex: number,
    children?: React.Element<*>
}): React.Element<*> => (
    <Container
        style={getInlineStyle(columnIndex)}
    >
        {children}
    </Container>
);

export default FormColumn;