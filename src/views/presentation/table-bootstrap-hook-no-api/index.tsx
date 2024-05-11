import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import Divider from '~/views/presentation/divider';
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '~/views/presentation/ui/card/Card';
import BTableNoApi from '~/views/presentation/ui/table/BTableNoApi';
import { UtilDate } from '~/views/utilities/helpers';
import { sizePerPageList } from '~/views/utilities/helpers/TablePaginationHelpers';

import { renderButtons } from './helperUI';

type TableBootstrapHookStyledProps = {
  tableMaxHeight?: number;
  notSupportPagination?: boolean;
};

const TableBootstrapHookStyled = styled.div<TableBootstrapHookStyledProps>`
  // FOR FIELDS CLEAR CUSTOM FOR TABLE
  th {
    .ant-input-clear-icon {
      font-size: 21px;
    }
    .ant-picker-clear,
    .ant-select-clear {
      .anticon-close-circle {
        font-size: 21px;
      }
    }
    .ant-select-selection-placeholder {
      text-transform: initial;
      font-weight: normal;
      font-family: unset;
      letter-spacing: unset;
    }
    .ant-picker-range {
      .ant-picker-clear {
        right: 24px;
      }
    }
  }

  .ant-picker-panels {
    display: -ms-flexbox !important;
    display: -webkit-flex !important;
    display: flex !important;
    -webkit-flex-wrap: wrap !important;
    -ms-flex-wrap: wrap !important;
    flex-wrap: wrap !important;
  }

  .ht-custom-header-table {
    .filter-label {
      display: block;
      margin-bottom: 4px;
    }
  }

  .ht-select-table-checkbox {
    :hover {
      cursor: pointer;
      background-color: #f0f5ff;
    }
  }
  // FOR FIELDS CLEAR CUSTOM FOR TABLE

  .main-table {
    max-height: ${(props) => props.tableMaxHeight || ''};
    overflow: 'auto !important';
  }
  .pagination-wrapper {
    display: ${(props) => (props.notSupportPagination ? 'none !important' : '')};
  }
  .table {
    font-size: 12px;
  }
`;

const ButtonWrapStyled = styled.div`
  @media (max-width: 1024px) {
    max-width: 650px;
    overflow-x: scroll;
  }
`;

function TableBootstrap(props) {
  const { t }: any = useTranslation();
  const { width, height } = useWindowSize();
  const [data, setData] = useState(props.data || []);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState([]);
  const [currentQueries, setCurrentQueries] = useState({});
  const [loading, setLoading] = useState(true);
  const [paginationOptions, setPaginationOptions] = useState({
    totalSize: props.data?.length,
    sizePerPage: 10,
    page: 0,
    custom: true,
    sizePerPageList,
    paginationTotalRenderer: (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
        {t('showing')} {from} {t('to')} {to} {t('of')} {size} {t('results')}
      </span>
    )
  });

  useEffect(() => {
    setPaginationOptions({ ...paginationOptions, totalSize: props.data?.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data?.length]);

  // --------------------------------------
  // FOR ACTIONS
  // --------------------------------------
  const onTableChange = (type, newState) => {
    setPaginationOptions({ ...paginationOptions, sizePerPage: newState?.sizePerPage, page: newState?.page });
    let filters = newState?.filters || {};
    const keys = Object.keys(filters);
    const filtersData = {};
    keys.forEach((key) => {
      let value = filters[key]?.filterVal || undefined;

      if (filters[key]?.filterType === 'DATE') {
        filtersData[key] = value.comparator !== null ? UtilDate.toDateTimeUtc(moment(value?.date).startOf('day')) : undefined;
      } else {
        filtersData[key] = value;
      }
    });
    const sorter = { sort: newState?.sortField ? `${newState?.sortField},${newState?.sortOrder}` : undefined };
    const pagination = {
      page: newState?.page ? newState?.page - 1 : 0,
      limit: newState?.sizePerPage
    };

    setPaginationOptions({ ...paginationOptions, page: newState?.page ? newState?.page : 1 });
    setData(props.data.slice(newState?.page * 10, newState?.page * 10 + 10));
  };
  // --------------------------------------
  // FOR ACTIONS
  // --------------------------------------

  // --------------------------------------
  // FOR EXPORT SVC
  // --------------------------------------
  const [callExport, setCallExport] = useState(false);
  // --------------------------------------
  // FOR EXPORT SVC
  // --------------------------------------

  // --------------------------------------
  // FILTER SELECTED DATA
  // --------------------------------------
  useEffect(() => {
    setLoading(true);
    setSelectedData(
      data?.filter(function (item) {
        return selectedRows.includes(item.id);
      })
    );
    setLoading(false);
  }, [selectedRows, data]); // eslint-disable-line react-hooks/exhaustive-deps
  // --------------------------------------
  // FILTER SELECTED DATA
  // --------------------------------------

  return (
    <TableBootstrapHookStyled
      notSupportPagination={props.notSupportPagination}
      tableMaxHeight={props.tableMaxHeight}
      className={props.className}>
      <Card>
        {props.title && (
          <CardHeader
            className="d-flex flex-wrap w-100"
            titleHeader={
              <div className="d-flex flex-column mr-3 my-5 pb-5 pb-lg-1">
                <h2>{props.title}</h2>
                <div
                  className="text-muted"
                  style={{ fontSize: '14px', width: props.description ? (width >= 1025 ? 1000 : '100%') : '100%' }}>
                  {props.description}
                </div>
              </div>
            }>
            <CardHeaderToolbar>{props.customHeader}</CardHeaderToolbar>
          </CardHeader>
        )}
        <CardBody className={props.noPadding ? 'p-0' : 'pt-4'}>
          {Boolean(props.buttons) && props.buttons?.length > 0 && (
            <>
              <ButtonWrapStyled className="d-flex align-items-center mb-5">
                {renderButtons(
                  props.buttons.map((o) => {
                    if (o?.type === 'export') {
                      return {
                        ...o,
                        exportCount: selectedRows.length,
                        selectedData: selectedData,
                        onClick: () => setCallExport(true),
                        tooltip: t('issueExportCsv')
                      };
                    } else if (o?.type === 'hasData') {
                      return { ...o, selectedData: selectedData };
                    } else return o;
                  })
                )}
              </ButtonWrapStyled>
              <Divider />
            </>
          )}
          <BTableNoApi
            onClickCreateNew={props.onClickCreateNew}
            //
            notSupportPaginationToolbar={props.notSupportPaginationToolbar}
            notSupportPagination={props.notSupportPagination}
            notSupportToggle={props.notSupportToggle}
            supportSelect={props.supportSelect}
            fixedColumns={props.fixedColumns}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            callExport={callExport}
            setCallExport={setCallExport}
            data={props.data}
            columns={props.columns || []}
            onTableChange={onTableChange}
            paginationOptions={paginationOptions}
            isLoading={props.loading || loading}
          />
        </CardBody>
      </Card>
    </TableBootstrapHookStyled>
  );
}
export default TableBootstrap;
