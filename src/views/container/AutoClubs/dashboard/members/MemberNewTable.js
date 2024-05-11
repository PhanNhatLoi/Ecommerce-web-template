import React from 'react';
import UITable from '~/views/presentation/ui/table/UITable';
import { UtilDate } from '~/views/utilities/helpers';
import { headerColumnFormatter } from '~/views/utilities/helpers/TableHeaderConlumnHelpers';
import { sizePerPageList } from '~/views/utilities/helpers/TablePaginationHelpers';
import { headerSortingClasses, sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

function MemberNewTable(props) {
  const {
    reducer: { data, loading, query, total },
    handleTableChange,
    t
  } = props;

  const columns = [
    {
      dataField: 'createdDate',
      text: t('join_date'),
      sort: true,
      sortCaret: sortCaret,
      formatter: (cellContent, row, rowIndex) => {
        return <span> {UtilDate.toDateLocal(cellContent)}</span>;
      }
    },
    {
      dataField: 'fullName',
      text: t('fullName'),
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: 'phone',
      text: t('phone'),
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses
    },
    {
      dataField: 'totalRequest',
      text: t('total_incidents'),
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: 'totalHelp',
      text: t('total_helps'),
      sort: true,
      sortCaret: sortCaret
    },

    {
      dataField: 'ximAmount',
      text: t('xim_coin'),
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: 'total_charge',
      text: t('total_charge'),
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: 'note',
      text: t('note')
    }
  ];

  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: total,
    sizePerPageList: sizePerPageList,
    sizePerPage: query?.size,
    page: query?.page + 1
  };
  const columnsTable = columns?.map((col) => {
    return { isClearFilter: isClearFilter, sortCaret: sortCaret, headerFormatter: headerColumnFormatter, ...col };
  });

  return (
    <UITable
      data={data || []}
      columns={columnsTable}
      onChange={handleTableChange}
      paginationOptions={paginationOptions}
      isLoading={loading}
    />
  );
}

export default MemberNewTable;
