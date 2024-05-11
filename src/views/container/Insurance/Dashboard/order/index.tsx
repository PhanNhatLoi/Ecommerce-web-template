import { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ORDER_TYPE } from '~/configs';
import { FILTER_AMOUNT_OPTIONS } from '~/configs/rangeNumberFilter';
import * as PATH from '~/configs/routesConfig';
import { ORDER_STATUS, renderOrderStatus } from '~/configs/status/Insurance/orderStatus';
import { orderActions } from '~/state/ducks/insurance/order';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import COLOR from '~/views/utilities/layout/color';

const BodyStyled = styled.div`
  .card.card-custom {
    box-shadow: none;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #fcfcfc;
  }

  .header-table {
    padding-top: 15px;
    padding-left: 30px;
    padding-right: 30px;
    margin-bottom: 0px;
    display: flex;
    justify-content: space-between;
  }
  .header-table span {
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .header-table a {
    color: ${COLOR.blue02};
  }
`;

type OrderListType = {
  getInsuranceOrder: any;
};

const OrderList: React.FC<OrderListType> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [params, setParams] = useState({
    sort: 'lastModifiedDate,desc',
    type: ORDER_TYPE.INSURANCE
  });
  const [needLoadNewData, setNeedLoadNewData] = useState(true);

  // ------------------------------
  // FOR COLUMN AND FILTER
  // ------------------------------
  const [isClearFilter, setIsClearFilter] = useState(false);
  const handleResetFilters = () => {
    setIsClearFilter(true);
  };

  useEffect(() => {
    if (isClearFilter) {
      setTimeout(() => {
        // this is resolve impact follow call API (multi call)
        // user can't filter again in 500ms-1000ms
        // this to fix user filter again bug
        setIsClearFilter(false);
      }, 500);
    }
  }, [isClearFilter]);
  // ------------------------------
  // FOR COLUMN AND FILTER
  // ------------------------------

  let columns = [
    {
      dataField: 'code',
      text: t('order_id'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 150,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return cell ? <Link to={PATH.INSURANCE_ORDER_EDIT_PATH.replace(':id', row?.id)}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'createdDate',
      text: t('created_date'),
      headerStyle: {
        textAlign: 'center'
      },
      style: {
        minWidth: 80,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return cell ? UtilDate.toTimeDateLocal(cell) : '-';
      },
      filterRenderer: (onFilter) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'lastModifiedDate',
      text: t('updated_date'),
      headerStyle: {
        textAlign: 'center'
      },
      style: {
        minWidth: 80,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return cell ? UtilDate.toTimeDateLocal(cell) : '-';
      },
      filterRenderer: (onFilter) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'buyerName',
      text: t('customer'),
      headerStyle: {
        textAlign: 'left',
        minWidth: 200
      },
      style: {
        textAlign: 'left',
        minWidth: 200
      },
      formatter: (cell, row) => {
        return cell ? <Link to={PATH.INSURANCE_CUSTOMER_EDIT_PATH.replace(':id', row?.buyerProfileId?.toString())}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'total',
      text: t('order_value'),
      sort: false,
      headerStyle: {
        textAlign: 'center',
        minWidth: 200
      },
      style: {
        textAlign: 'center',
        minWidth: 200
      },
      formatter: (cell) => {
        return cell ? numberFormatDecimal(+cell, ' đ', '') : '-';
      },
      filter: customFilter({ type: FILTER_TYPES.SELECT }),
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onClear={handleResetFilters}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(FILTER_AMOUNT_OPTIONS).map((o) => {
              return {
                value: FILTER_AMOUNT_OPTIONS[o],
                label: o
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'status',
      text: t('status'),
      headerStyle: {
        minWidth: 70,
        textAlign: 'center'
      },
      style: {
        minWidth: 70,
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderOrderStatus(cell, t(cell), 'tag')}</div>;
      },
      filterRenderer: (onFilter: any, column: { text: string }) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(ORDER_STATUS).map((o) => {
              return {
                value: ORDER_STATUS[o],
                search: t(ORDER_STATUS[o]),
                label: renderOrderStatus(ORDER_STATUS[o], t(ORDER_STATUS[o]), 'tag')
              };
            })}
          />
        );
      },
      sort: false
    }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------

  //search+sort cho row phù hợp
  const columnArray = columns.map((column) => {
    return {
      editable: false,
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
      filter: customFilter(),
      filterRenderer: (onFilter, col) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  return (
    <BodyStyled>
      <TableBootstrapHook
        customHeader={
          <div className="header-table">
            <div>
              <span>{t('package_order')}</span>
            </div>
            <div>
              <a
                href="."
                onClick={(e) => {
                  e.preventDefault();
                  history.push(PATH.INSURANCE_ORDER_LIST_PATH);
                }}>
                {t('view_all')}
              </a>
            </div>
          </div>
        }
        columns={columnArray}
        isDateFilterReverse
        notSupportToggle
        notSupportStatistic
        notSupportPagination
        isNumberRangeReverse
        dataRangeKey="createdDate" // for data range filter
        selectField="id"
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getInsuranceOrder}
        params={params}
        isClearFilter={isClearFilter}
        buttons={[]}></TableBootstrapHook>
    </BodyStyled>
  );
};

export default connect(null, {
  getInsuranceOrder: orderActions.getInsuranceOrder
})(OrderList);
