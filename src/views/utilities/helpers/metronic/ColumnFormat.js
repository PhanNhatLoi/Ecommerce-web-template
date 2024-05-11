import React from 'react';
import styled from 'styled-components';
const WrapColHeader = styled.div`
  .date-filter,
  .number-filter {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  }

  .date-filter-comparator {
    display: none;
  }
  .number-filter-comparator {
    display: none;
  }

  .filter-label {
    // display: none;
    // min-width: 72px;
  }
  height: ${(props) => (props.hasFilter ? '80px' : 'unset')};
`;

export function ColumnFormat(column, colIndex, { sortElement, filterElement }) {
  return (
    <WrapColHeader hasFilter={true} className="d-flex flex-column justify-content-between">
      <div className="mb-5 row">
        {column.text}
        {sortElement}
      </div>
      {filterElement}
    </WrapColHeader>
  );
}

export function ColumnFormatNoFilter(column, colIndex, { sortElement, filterElement }) {
  return (
    <WrapColHeader hasFilter={false} className="d-flex flex-column justify-content-between">
      <div className="mb-5">
        {column.text}
        {sortElement}
      </div>
      {filterElement}
    </WrapColHeader>
  );
}
