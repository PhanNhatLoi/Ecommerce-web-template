import PropsType from 'prop-types';
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import { NoRecordsFoundMessage, PleaseWaitMessage } from '~/views/utilities/helpers/TablePaginationHelpers';
import { Pagination } from '../pagination/Pagination';

function UITable(props) {
  const { data, columns, paginationOptions, onChange, isLoading } = props;

  return (
    <PaginationProvider pagination={paginationFactory(paginationOptions)}>
      {({ paginationProps, paginationTableProps }) => {
        return (
          <Pagination isLoading={isLoading} paginationProps={paginationProps}>
            <BootstrapTable
              wrapperClasses="table-responsive"
              bordered={false}
              classes="table table-head-custom table-vertical-center overflow-hidden"
              bootstrap4
              remote
              keyField="id"
              data={data || []}
              columns={columns}
              // defaultSorted={uiHelpers.defaultSorted}
              onTableChange={onChange}
              // selectRow={getSelectRow({
              //   data,
              //   ids: customersUIProps.ids,
              //   setIds: customersUIProps.setIds
              // })}
              filter={filterFactory()}
              filterPosition="inline"
              {...paginationTableProps}></BootstrapTable>
            <PleaseWaitMessage loading={false} />
            <NoRecordsFoundMessage data={data} />
          </Pagination>
        );
      }}
    </PaginationProvider>
  );
}
UITable.defaultProps = {
  isLoading: false
};

UITable.propTypes = {
  data: PropsType.array.isRequired,
  columns: PropsType.array.isRequired,
  onChange: PropsType.func.isRequired,
  paginationOptions: PropsType.object.isRequired
};

export default UITable;
