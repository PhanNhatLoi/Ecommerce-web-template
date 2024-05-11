import React from 'react';
import { useTranslation } from 'react-i18next';

export const getPagesCount = (totalSize, sizePerPage) => {
  return Math.ceil(totalSize / sizePerPage);
};

export const getPages = (page, pagesCount, paginationSize) => {
  const result = [];
  if (!page) {
    return result;
  }

  if (pagesCount < paginationSize + 1) {
    for (let i = 2; i < pagesCount; i++) {
      result.push(i);
    }
    return result;
  }

  if (page === 1) {
    for (let i = 2; i < paginationSize + 1; i++) {
      if (i < pagesCount) {
        result.push(i);
      }
    }
    return result;
  }

  if (page === pagesCount) {
    for (let i = pagesCount - paginationSize + 1; i < pagesCount; i++) {
      result.push(i);
    }
    return result;
  }

  const shiftCount = Math.floor(paginationSize / 2);
  if (shiftCount < 1) {
    result.push(page);
    return result;
  }

  if (page < shiftCount + 2) {
    for (let i = 2; i < paginationSize + 1; i++) {
      result.push(i);
    }
    return result;
  }

  if (page === pagesCount - 1) {
    result.push(page - shiftCount - 1);
  }

  for (let i = page - shiftCount; i <= page; i++) {
    if (i > 0) {
      result.push(i);
    }
  }

  for (let i = page + 1; i < page + shiftCount + 1; i++) {
    if (i + 1 < pagesCount || (i + 1 === pagesCount && page >= 4)) {
      result.push(i);
    }
  }

  return result;
};

export function getHandlerTableChange(setQueryParams) {
  return (type, { page, sizePerPage, sortField, sortOrder, data }) => {
    const pageNumber = page || 1;
    setQueryParams((prev) =>
      type === 'sort' ? { ...prev, sortOrder, sortField } : type === 'pagination' ? { ...prev, pageNumber, pageSize: sizePerPage } : prev
    );
  };
}

export function PleaseWaitMessage({ loading }) {
  const { t } = useTranslation();
  return <>{loading && <div>{t('please_wait')}...</div>}</>;
}

export function NoRecordsFoundMessage({ data }) {
  const { t } = useTranslation();
  const dataList = data ? data : [];
  return <>{dataList?.length === 0 && <div>{t('no_record_found')}</div>}</>;
}

export const sizePerPageList = [
  { text: '10', value: 10 },
  { text: '20', value: 20 },
  { text: '50', value: 50 },
  { text: '100', value: 100 },
  { text: '200', value: 200 },
  { text: '300', value: 300 },
  { text: '400', value: 400 }
];
