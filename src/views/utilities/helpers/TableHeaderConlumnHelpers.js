import React from 'react';

export const headerColumnFormatter = (column, colIndex, components) => {
  return (
    <div className="d-flex flex-column">
      <div className="mb-2">
        {column.text}
        {components.sortElement}
      </div>
      {components.filterElement}
    </div>
  );
};
