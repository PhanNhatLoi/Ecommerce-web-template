import React from 'react';
import UITable from '~/views/presentation/ui/table/UITable';
import { UtilDate } from '~/views/utilities/helpers';
import { headerColumnFormatter } from '~/views/utilities/helpers/TableHeaderConlumnHelpers';
import { sizePerPageList } from '~/views/utilities/helpers/TablePaginationHelpers';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

function IncidentWaittingTable(props) {
  const {
    reducer: { data, loading, query, total },
    handleTableChange,
    t
  } = props;

  const columns = [
    {
      dataField: 'createdDate',
      text: t('date_happen'),
      sort: true,
      sortCaret: sortCaret,
      formatter: (cellContent, row, rowIndex) => {
        return <span> {UtilDate.toDateLocal(cellContent)}</span>;
      }
    },
    {
      dataField: 'incident',
      text: t('incident'),
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: 'requester',
      text: t('requester'),
      sort: true,
      sortCaret: sortCaret
    },

    {
      dataField: 'place',
      text: t('place'),
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: 'status',
      text: t('status'),
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: 'fullName',
      text: t('technician'),
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: 'repair_money',
      text: t('repair_money'),
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

export default IncidentWaittingTable;
