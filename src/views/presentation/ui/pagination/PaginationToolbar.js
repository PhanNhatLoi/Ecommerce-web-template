/* eslint-disable no-unused-vars */
import React from 'react';
import { PaginationTotalStandalone } from 'react-bootstrap-table2-paginator';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { getPagesCount } from '~/views/utilities/helpers/TablePaginationHelpers';

const GoInput = styled.div`
  @media (max-width: 320px) {
    width: 60px !important;
  }

  width: 70px;

  .form-control {
    height: calc(1.35em + 1.1rem + 2px);
    border-radius: 8px;
    width: 76px;
  }
`;

export function PaginationToolbar(props) {
  const { t } = useTranslation();
  const { width, height } = useWindowSize();
  const { isLoading, paginationProps, setCurrentPage } = props;
  const { sizePerPageList, sizePerPage, totalSize, onSizePerPageChange } = paginationProps;
  const pagesCount = getPagesCount(totalSize, sizePerPage);
  const style = {
    width: '76px',
    borderRadius: '8px'
  };

  const onSizeChange = (event) => {
    const newSize = event.target.value;
    onSizePerPageChange(newSize);
  };

  const handleGoPage = ({ onPageChange }, event) => {
    if (event.keyCode === 13) {
      if (event.target.value > 0 && event.target.value <= pagesCount) {
        onPageChange(event.target.value);
        setCurrentPage(+event.target.value);
      } else {
        AMessage.error(t('errorPaginationNotFound'));
        onPageChange(1);
        setCurrentPage(1);
      }
      event.target.value = '';
    }
  };

  return (
    <div className="d-flex align-items-center py-3 flex-wrap">
      {width > 375 && <PaginationTotalStandalone className="text-muted" {...paginationProps} />}

      <div className="d-flex align-items-center ml-lg-5 ml-md-5 ml-sm-5">
        <span>{t('page_show')}</span>
        {isLoading && (
          <div className="d-flex align-items-center">
            <div className="ml-2 text-muted">{t('loading')}...</div>
            <div className="spinner spinner-primary mr-10"></div>
          </div>
        )}
        <select
          disabled={totalSize === 0}
          className={`form-control form-control-sm font-weight-bold ml-2 border-0 bg-light ${totalSize === 0 && 'disabled'}`}
          onChange={onSizeChange}
          defaultValue={sizePerPage}
          style={style}>
          {sizePerPageList.map((option) => {
            const isSelect = sizePerPage === `${option.page}`;
            return (
              <option key={option.text} value={option.page} className={`btn ${isSelect ? 'active' : ''}`}>
                {option.text}
              </option>
            );
          })}
        </select>
        <span className="ml-4">{t('go_to')}:</span>

        <GoInput className="input-group-solid ml-2">
          <input
            type="number"
            placeholder={t('page')}
            className="form-control  form-control-solid"
            onKeyDown={(e) => handleGoPage(paginationProps, e)}
            min={0}
            max={pagesCount}
          />
        </GoInput>
      </div>
    </div>
  );
}
