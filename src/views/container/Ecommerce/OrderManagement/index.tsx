import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileDoneOutlined,
  PrinterOutlined,
  SendOutlined
} from '@ant-design/icons';
import { Menu } from 'antd/es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { ORDER_TYPE } from '~/configs';
import { FILTER_AMOUNT_OPTIONS } from '~/configs/rangeNumberFilter';
import * as ROUTES from '~/configs/routesConfig';
import { renderSaleOrderStatus, SALE_ORDER_STATUS, SALE_ORDER_STATUS_RES } from '~/configs/status/car-accessories/saleOrderStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { orderActions } from '~/state/ducks/carAccessories/order';
import { customerActions } from '~/state/ducks/customer';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import COLOR from '~/views/utilities/layout/color';

import { ButtonStyled, DropdownStyled, MenuStyled } from './components/styled';
import ConfirmModal from './Modals/ConfirmModal';
import OrderProcessingModal from './Modals/OrderProcessingModal';
import PrintModal from './Modals/PrintModal';
import RejectModal from './Modals/RejectModal';
import { Action } from './Types';

const LinkStyled = styled(Link)`
  color: ${(props) => props.color};
  :hover {
    color: ${(props) => props.colorHover};
  }
`;

interface OrderManagementProps {
  getSalesOrders: any;
  deleteSaleOrder: any;
  updateSaleOrder: any;
  updateStatusSaleOrder: any;
  getCustomerDetail: any;
  getRoleBase: any;
}

const OrderManagement: React.FC<OrderManagementProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState<Boolean>(true);
  const [confirmModalShow, setConfirmModalShow] = useState<Boolean>(false);
  const [printModalShow, setPrintModalShow] = useState<Boolean>(false);
  const [orderId, setOrderId] = useState<any>();
  const [confirmData, setConfirmData] = useState<Array<any>>([]);
  const [rejectModalShow, setRejectModalShow] = useState<Boolean>(false);
  const [rejectData, setDataReject] = useState<any>();
  const [orderModalShow, setOrderModalShow] = useState<Boolean>(false);
  const [orderProcessData, setOrderProcessData] = useState<Array<any>>([]);
  const [params, setParams] = useState({ sort: 'lastModifiedDate,desc', type: ORDER_TYPE.PRODUCT });
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    if (key === 'access') return !fullAccessPage;
    switch (text) {
      default:
        return false;
    }
  };

  const actionItem = {
    view: {
      icon: <EyeOutlined />,
      text: t('view_order'),
      onClick: (row) => {
        history.push(`${ROUTES.CAR_ACCESSORIES_VIEW_SALES_ORDERS_PATH}?id=${row.id}`);
      }
    },
    delete: {
      icon: <DeleteOutlined />,
      text: t('delete'),
      key: 'access',
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'delete', id: row.id }]);
      }
    },
    accept: {
      icon: <CheckOutlined />,
      text: t('action_accept'),
      key: 'access',
      onClick: (row) => {
        setOrderModalShow(true);
        setOrderProcessData([{ type: 'accept', id: row.id }]);
      }
    },
    reject: {
      icon: <CloseOutlined />,
      text: t('reject'),
      key: 'access',
      onClick: (row) => {
        setRejectModalShow(true);
        setDataReject({ status: 'reject', id: row.id });
      }
    },
    package: {
      icon: <FileDoneOutlined />,
      text: t('action_package'),
      key: 'access',
      onClick: (row) => {
        setOrderModalShow(true);
        setOrderProcessData([{ type: SALE_ORDER_STATUS.PACKAGED, id: row.id }]);
      }
    },
    shipping: {
      icon: <SendOutlined />,
      text: t('action_shipping'),
      key: 'access',
      onClick: (row) => {
        setOrderModalShow(true);
        setOrderProcessData([{ type: SALE_ORDER_STATUS.SHIPPING, id: row.id }]);
      }
    }
    // delivery: {
    //   icon: <CheckSquareOutlined />,
    //   text: t('action_diliveri'),
    //   key: 'access',
    //   onClick: (row) => {
    //     setOrderModalShow(true);
    //     setOrderProcessData([{ type: SALE_ORDER_STATUS.DELIVERED, id: row.id }]);
    //   }
    // },
    // fulfilled: {
    //   icon: <CheckCircleOutlined />,
    //   text: t('action_done'),
    //   key: 'access',
    //   onClick: (row) => {
    //     setOrderModalShow(true);
    //     setOrderProcessData([{ type: SALE_ORDER_STATUS_FULFILLED, id: row.id }]);
    //   }
    // }
  };
  // mỗi status sẽ có những action khác nhau
  const actionByStatus = {
    [SALE_ORDER_STATUS.WAITING]: [actionItem.accept, actionItem.reject],
    [SALE_ORDER_STATUS.PAYMENT_RECEIVED_BY_ECARAID]: [actionItem.accept, actionItem.reject],
    [SALE_ORDER_STATUS.ACCEPTED_BY_VENDOR]: [actionItem.accept, actionItem.reject],
    [SALE_ORDER_STATUS.ACCEPTED]: [actionItem.package]
    // [SALE_ORDER_STATUS.PACKAGED]: [actionItem.shipping]
    // [SALE_ORDER_STATUS.SHIPPING]: [actionItem.delivery],
    // [SALE_ORDER_STATUS.DELIVERED]: [actionItem.fulfilled],
    // [SALE_ORDER_STATUS.DONE]: [actionItem.delete]
  };

  //action mặc định
  const actionDefault: Array<Action> = [actionItem.view];
  // ------------------------------
  // FOR ACTIONS
  // ------------------------------

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
        to={`${ROUTES.CAR_ACCESSORIES_VIEW_SALES_ORDERS_PATH}?id=${row.id}`}>
        {cell ? cell : '-'}
      </LinkStyled>
    );
  };

  let columns: any = [
    {
      dataField: 'code',
      text: t('orderCode'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 35, 'center'),
      style: CustomFixedColumns(200, 200, 35, 'center'),
      formatter: (cell, row) => LinkComponent(cell, row)
    },
    {
      dataField: 'shippingCode',
      text: t('blCode'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 235, 'center'),
      style: CustomFixedColumns(200, 200, 235, 'center'),
      formatter: (cell, row) => LinkComponent(cell, row)
    },
    {
      dataField: 'shippingAddress',
      text: t('address_order'),
      sort: false,
      filter: '',
      filterRenderer: '',
      style: {
        textAlign: 'left',
        minWidth: 250
      },
      formatter: (cell, row) => {
        if (!cell) return '-';
        const address = `${cell?.address || ''} ${cell?.fullAddress || ''}, ${cell?.wards?.name || ''}, ${cell?.district?.name || ''}, ${
          cell?.province?.name || ''
        } ${cell?.zipCode || ''}, ${cell?.country?.nativeName || ''}`;
        return address
          .split(',')
          .map((segment) => segment.trim())
          .join(', ');
      },
      csvFormatter: (cell: any) => {
        if (!cell) return '-';
        const address = `${cell?.address || ''} ${cell?.fullAddress || ''}, ${cell?.wards?.name || ''}, ${cell?.district?.name || ''}, ${
          cell?.province?.name || ''
        } ${cell?.zipCode || ''}, ${cell?.country?.nativeName || ''}`;
        return address
          .split(',')
          .map((segment) => segment.trim())
          .join(', ');
      }
    },
    {
      dataField: 'id',
      text: t('billCode'),
      style: {
        textAlign: 'center',
        minWidth: 100
      },
      formatter: (cell, row) => LinkComponent(cell, row)
    },
    {
      dataField: 'createdDate',
      text: t('created_date'),
      style: {
        textAlign: 'center',
        minWidth: 100
      },
      csvFormatter: (cell) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '-';
      },
      formatter: (cell, row) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'lastModifiedDate',
      text: t('last_update_date'),
      style: {
        textAlign: 'center',
        minWidth: 100
      },
      csvFormatter: (cell) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '-';
      },
      formatter: (cell, row) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'buyerName',
      text: t('customer'),
      sort: false,
      formatter: (cell, row) => {
        return row?.shippingAddress?.fullName ? row.shippingAddress.fullName : '-';
      },
      style: {
        textAlign: 'left',
        minWidth: 150
      }
    },
    {
      dataField: 'orderDetails',
      text: t('productNumber'),
      sort: false,
      filter: '',
      filterRenderer: '',
      csvFormatter: (cell) => {
        return cell ? cell.length : 0;
      },
      formatter: (cell, row) => {
        return cell ? cell.length : 0;
      },
      style: {
        textAlign: 'center',
        minWidth: 100
      }
    },
    {
      dataField: 'total',
      text: t('totalMoney'),
      style: {
        textAlign: 'center',
        minWidth: 100
      },
      csvFormatter: (cell, row) => {
        return cell ? numberFormatDecimal(cell, '', '') : '-';
      },
      formatter: (cell, row) => {
        return cell ? numberFormatDecimal(cell, ' đ', '') : '0 đ';
      },
      filter: customFilter({ type: FILTER_TYPES.SELECT }),
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(FILTER_AMOUNT_OPTIONS).map((o) => {
              return {
                value: FILTER_AMOUNT_OPTIONS[o],
                search: FILTER_AMOUNT_OPTIONS[o],
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
    },
    {
      dataField: 'action',
      text: t('actions'),
      sort: false,
      style: {
        minWidth: 130,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 130,
        textAlign: 'center'
      },
      csvExport: false,
      headerFormatter: ColumnFormat,
      formatter: (cell, row, rowIndex) => {
        const actionStatus = actionByStatus[row.status] ? actionByStatus[row.status] : [];
        const actions: Array<Action> = [...actionDefault, ...actionStatus];
        const menu = (
          <MenuStyled>
            {actions.map((action) => (
              <Menu.Item>
                <AButton
                  disabled={disableAction(row, action.text, action.key)}
                  className="w-100 d-flex align-items-center"
                  type="link"
                  onClick={() => action.onClick(row)}>
                  {row.status === 'ACTIVE' ? (action.alterIcon ? action.alterIcon : action.icon) : action.icon} &nbsp;
                  {row.status === 'ACTIVE' ? (action.alterText ? action.alterText : action.text) : action.text}
                </AButton>
              </Menu.Item>
            ))}
          </MenuStyled>
        );

        return (
          <DropdownStyled overlay={menu} placement="bottomCenter" trigger={['click']}>
            <ButtonStyled
              type="link"
              size="large"
              style={{ fontSize: '24px' }}
              icon={<SVG src={toAbsoluteUrl('/media/svg/icons/Tools/More.svg')} />}
            />
          </DropdownStyled>
        );
      },
      classes: 'text-center pr-0',
      headerClasses: 'ht-custom-header-table pr-3',
      filterRenderer: (onFilter, column) => (
        <AButton
          onClick={handleResetFilters}
          className="btn btn-sm py-2 w-100"
          style={{
            borderRadius: '8px',
            background: COLOR.Primary,
            color: COLOR.White,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <span className="svg-icon svg-icon-md svg-icon-white">
            <SVG src={toAbsoluteUrl('/media/svg/icons/Tools/Trash.svg')} />
          </span>
          &nbsp;
          {t('clear_filter')}
        </AButton>
      )
    }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------

  columns = columns.map((column) => {
    return {
      editable: false,
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
      style: {
        minWidth: 148,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 170,
        textAlign: 'center'
      },
      filter: customFilter(),
      filterRenderer: (onFilter, col) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      csvFormatter: (cell) => {
        return cell ? cell : '-';
      },
      align: column.align,
      headerAlign: column.align,
      footerAlign: column.align,
      formatter: (cell) => cell || '-',
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  return (
    <div>
      <TableBootstrapHook
        isDateFilterReverse
        isNumberRangeReverse
        supportEdit // for editable and save
        title={t('order_management')}
        description={t('order_management_des')}
        columns={columns}
        dataRangeKey="createdDate" // for data range filter
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('order_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        deleteData={props.deleteSaleOrder}
        fetchData={props.getSalesOrders}
        params={params}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('Create order'),
            onClick: () => {
              history.push(ROUTES.CAR_ACCESSORIES_CREATE_SALES_ORDERS_PATH);
            }
          },
          // {
          //   type: 'hasData',
          //   text: t('delete'),
          //   icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
          //   onClick: (selectedData) => {
          //     setConfirmModalShow(true);
          //     setConfirmData(
          //       selectedData.map((data) => {
          //         return { type: 'delete', id: data.id };
          //       })
          //     );
          //   }
          // },
          {
            type: 'hasData',
            text: t('print'),
            icon: <PrinterOutlined />,
            disable: (selectedData) => {
              return selectedData.length > 1 || selectedData.length === 0;
            },
            onClick: (selectedData) => {
              setOrderId(selectedData[0]?.id);
              setPrintModalShow(true);
            }
          },
          {
            type: 'export',
            icon: <i className="fas fa-file-excel" style={{ color: '#000' }}></i>,
            text: t('export_excel'),
            t
          }
        ]}></TableBootstrapHook>

      {/* MODALS */}

      <ConfirmModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />

      <OrderProcessingModal
        data={orderProcessData}
        modalShow={orderModalShow}
        setData={setOrderProcessData}
        setModalShow={setOrderModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />

      <RejectModal
        data={rejectData}
        modalShow={rejectModalShow}
        setData={setDataReject}
        setModalShow={setRejectModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />

      <PrintModal orderId={orderId} modalShow={printModalShow} setModalShow={setPrintModalShow} />
      {/* MODALS */}
    </div>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getSalesOrders: orderActions.getSalesOrders,
    updateSaleOrder: orderActions.updateSaleOrder,
    deleteSaleOrder: orderActions.deleteSaleOrder,
    updateStatusSaleOrder: orderActions.updateStatusSaleOrder,
    getCustomerDetail: customerActions.getCustomerDetail
  }
)(OrderManagement);
