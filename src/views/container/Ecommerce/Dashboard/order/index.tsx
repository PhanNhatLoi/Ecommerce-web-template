import moment from 'moment';
import { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ORDER_TYPE } from '~/configs';
import { FILTER_AMOUNT_OPTIONS } from '~/configs/rangeNumberFilter';
import * as PATH from '~/configs/routesConfig';
import { renderSaleOrderStatus, SALE_ORDER_STATUS, SALE_ORDER_STATUS_RES } from '~/configs/status/car-accessories/saleOrderStatus';
import { orderActions } from '~/state/ducks/carAccessories/order';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import COLOR from '~/views/utilities/layout/color';

const LinkStyled = styled(Link)`
  color: ${(props) => props.color};
  :hover {
    color: ${(props) => props.colorHover};
  }
`;

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

const LinkComponent = (cell, row) => {
  const acceptedDate = moment(row?.audit?.acceptedDate);
  const color = {
    color: moment().diff(acceptedDate, 'days') >= 1 && [SALE_ORDER_STATUS.ACCEPTED].includes(row.status) ? '#dc3545' : '#3699FF',
    colorHover: moment().diff(acceptedDate, 'days') >= 1 && [SALE_ORDER_STATUS.ACCEPTED].includes(row.status) ? '#b02a37' : '#0073e9'
  };
  return (
    <LinkStyled
      color={color.color}
      colorHover={color.colorHover}
      className="text-wrap text-start"
      to={`${PATH.CAR_ACCESSORIES_VIEW_SALES_ORDERS_PATH}?id=${row.id}`}>
      {cell ? cell : '-'}
    </LinkStyled>
  );
};

type OrderListType = {
  getSalesOrders: any;
};

const OrderList: React.FC<OrderListType> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();

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
      text: t('orderCode'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 150,
        textAlign: 'center'
      },
      formatter: (cell, row) => LinkComponent(cell, row)
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
      formatter: (cell) => {
        return cell || '-';
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
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: { textAlign: 'center' },
      sort: false,
      csvFormatter: (cell) => {
        const status = SALE_ORDER_STATUS_RES[cell];
        return t(status);
      },
      formatter: (cell, row) => {
        let status = SALE_ORDER_STATUS_RES[cell];

        if (cell === SALE_ORDER_STATUS.PAYMENT_RECEIVED_BY_ECARAID && row.paymentGateway === 'CASH') status = SALE_ORDER_STATUS_RES.WAITING;
        return <div className="w-100 status_wrap-nononono">{status && renderSaleOrderStatus(cell, t(status), 'tag')}</div>;
      },
      filterRenderer: (onFilter, column) => {
        const { DELETED, WAITING_BANK_TRANSFERRED_CONFIRM, WAITING_BANK_TRANSFER, WAITING, ...SELECT_STATUS } = SALE_ORDER_STATUS;
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(SELECT_STATUS).map((o) => {
              return {
                value: SELECT_STATUS[o],
                search: t(SELECT_STATUS[o]),
                label: renderSaleOrderStatus(SELECT_STATUS[o], t(SALE_ORDER_STATUS_RES[SELECT_STATUS[o]]), 'tag')
              };
            })}
          />
        );
      }
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
        // title={t('order_management')}
        customHeader={
          <div className="header-table">
            <div>
              <span>{t('order_management')}</span>
            </div>
            <div>
              <a
                href="."
                onClick={(e) => {
                  e.preventDefault();
                  history.push(PATH.CAR_ACCESSORIES_SALES_ORDERS_PATH);
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
        fetchData={props.getSalesOrders}
        params={{
          sort: 'createdDate,desc',
          type: ORDER_TYPE.PRODUCT
        }}
        isClearFilter={isClearFilter}
        buttons={[]}></TableBootstrapHook>
    </BodyStyled>
  );
};

export default connect(null, {
  getSalesOrders: orderActions.getSalesOrders
})(OrderList);
