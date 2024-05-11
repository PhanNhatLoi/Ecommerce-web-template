/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from 'react';
import styled from 'styled-components';
import { getPages, getPagesCount } from '~/views/utilities/helpers/TablePaginationHelpers';
import COLOR from '~/views/utilities/layout/color';

const BtnWrapStyled = styled.a`
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? COLOR.Primary : '#f1f1f1')};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.active ? COLOR.White : COLOR.Primary)};
  :hover {
    background-color: ${COLOR.Primary};
    color: ${COLOR.White};
    i {
      color: ${COLOR.White};
    }
  }
  i {
    color: ${COLOR.Primary};
  }

  @media (max-width: 425px) {
    width: 24px !important;
    height: 24px !important;
  }
  @media (max-width: 320px) {
    width: 16px !important;
    height: 16px !important;
  }
`;

export function PaginationLinks({ paginationProps, ...props }) {
  const { totalSize, sizePerPage, paginationSize, page } = paginationProps;
  const pagesCount = getPagesCount(totalSize, sizePerPage);
  const pages = getPages(page, pagesCount, paginationSize);

  const handleFirstPage = ({ onPageChange }) => {
    onPageChange(1);
  };

  const handlePrevPage = ({ onPageChange }) => {
    onPageChange(page - 1);
  };

  const handleNextPage = ({ onPageChange }) => {
    if (page < pagesCount) {
      onPageChange(page + 1);
    }
  };

  const handleLoadMoreNextPages = ({ onPageChange }) => {
    let nextPage = page + paginationSize;
    nextPage = nextPage > pagesCount ? pagesCount : nextPage;
    onPageChange(nextPage);
  };

  const handleLoadMorePrevPages = ({ onPageChange }) => {
    let prevPage = page - paginationSize;
    prevPage = prevPage === 0 ? 1 : prevPage;
    onPageChange(prevPage);
  };

  const handleSelectedPage = ({ onPageChange }, pageNum) => {
    onPageChange(pageNum);
  };

  const disabledClass = pagesCount > 1 ? '' : 'disabled';
  return (
    <>
      {pagesCount < 2 && <></>}
      {pagesCount > 1 && (
        <>
          <div className="d-flex flex-column flex-sm-row align-items-start justify-content-sm-start align-items-center">
            <div className={`d-flex py-2 mr-0 mr-sm-3 ${disabledClass}`}>
              {page > 1 && (
                <BtnWrapStyled onClick={() => handlePrevPage(paginationProps)} className="mr-2 my-1">
                  <i className="ki ki-bold-arrow-back icon-xs" />
                </BtnWrapStyled>
              )}

              <BtnWrapStyled
                key={1}
                active={page === 1}
                onClick={() => handleFirstPage(paginationProps)}
                className={`${page === 1 ? 'select' : ''} mr-2 my-1`}>
                {1}
              </BtnWrapStyled>

              {page >= 5 && (
                <a className="btn mr-2 my-1" onClick={() => handleLoadMorePrevPages(paginationProps)}>
                  ...
                </a>
              )}

              {pages.map((p) => (
                <BtnWrapStyled
                  key={p}
                  active={page === p}
                  onClick={() => handleSelectedPage(paginationProps, p)}
                  className={`${page === p ? 'select' : ''} mr-2 my-1`}>
                  {p}
                </BtnWrapStyled>
              ))}

              {page + 2 < pagesCount && pagesCount > paginationSize && (
                <a className="btn mr-2 my-1" onClick={() => handleLoadMoreNextPages(paginationProps)}>
                  ...
                </a>
              )}
              {page <= pagesCount && (
                <BtnWrapStyled
                  key={pagesCount}
                  active={page === pagesCount}
                  onClick={() => handleSelectedPage(paginationProps, pagesCount)}
                  className={`${page === pagesCount ? 'select' : ''} mr-2 my-1`}>
                  {pagesCount}
                </BtnWrapStyled>
              )}

              {page < pagesCount && (
                <BtnWrapStyled onClick={() => handleNextPage(paginationProps)} className="mr-2 my-1">
                  <i className="ki ki-bold-arrow-next icon-xs"></i>
                </BtnWrapStyled>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
