import React from 'react';
import { PaginationLinks } from './PaginationLinks';
import { PaginationToolbar } from './PaginationToolbar';

export function Pagination(props) {
  const { children, isLoading, paginationProps } = props;
  return (
    <>
      {children}
      <div className="pagination-wrapper d-flex flex-row justify-content-between align-items-center flex-wrap">
        <PaginationToolbar isLoading={isLoading} paginationProps={paginationProps} />
        <PaginationLinks paginationProps={paginationProps} />
      </div>
    </>
  );
}
