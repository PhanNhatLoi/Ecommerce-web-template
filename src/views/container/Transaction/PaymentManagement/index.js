import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { FILTER_AMOUNT_OPTIONS } from '~/configs/rangeNumberFilter';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { PAYMENT_STATUS, renderPaymentStatus } from '~/configs/status/transaction/paymentStatus';
import { PAYMENT_TYPE, renderPaymentType } from '~/configs/type/transaction/paymentType';
import { authSelectors } from '~/state/ducks/authUser';
import { mechanicActions } from '~/state/ducks/mechanic';
import { paymentActions } from '~/state/ducks/transaction/payment';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import ConfirmModal from './Modals/ConfirmModal';
import ViewModal from './Modals/ViewModal';

const DropdownStyled = styled(Dropdown)`
  .ant-dropdown {
    background-color: #000 !important;
    border-radius: 5px !important;
    padding: 16px 8px !important;
  }
  .ant-dropdown-arrow {
    background-color: #000 !important;
  }
`;

const ButtonStyled = styled(Button)`
  .anticon {
    position: relative !important;
    bottom: 8px !important;
  }
`;

const PaymentManagement = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);

  const [viewModalShow, setViewModalShow] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [params, setParams] = useState({
    sort: 'lastModifiedDate,desc'
    // status: 'REPAIRING'
  });
  const [resetFilter, setResetFilter] = useState(false);
  const location = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR TRANSACTION ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    let disable = false;
    switch (text) {
      case t('approvePayment'):
      case t('rejectPayment'):
        disable = ![PAYMENT_STATUS.WAITING_CONFIRMATION].includes(row.status);
        break;
      default:
        break;
    }
    return key === 'access' && fullAccessPage ? disable : !fullAccessPage;
  };

  const actionMenu = [
    {
      icon: <CheckCircleOutlined />,
      text: t('approvePayment'),
      key: 'access',
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([
          {
            type: 'approve',
            id: row.orderId,
            fullName: row.transactionId,
            paymentType: row.paymentType,
            paymentGateway: row.paymentGateway
          }
        ]);
      }
    },
    {
      icon: <CloseCircleOutlined />,
      text: t('rejectPayment'),
      key: 'access',
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([
          {
            type: 'reject',
            id: row.id,
            fullName: row.transactionId,
            paymentType: row.paymentType,
            paymentGateway: row.paymentGateway
          }
        ]);
      }
    },
    {
      icon: <EyeOutlined />,
      text: t('viewPayment'),
      onClick: (row) => {
        setViewModalShow(true);
        setTransactionId(row.id);
      }
    }
  ];

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
      dataField: 'transactionId',
      text: t('transactionId'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 35, 'center'),
      style: CustomFixedColumns(200, 200, 35, 'center'),
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setTransactionId(row.id);
            }}>
            {cell}
          </AButton>
        );
      }
    },
    {
      dataField: 'date',
      text: t('trading_date'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 300, 235, 'center'),
      style: CustomFixedColumns(200, 300, 235, 'center'),
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateTimeLocal(cell)}</span>;
      },
      csvFormatter: (cell, row) => {
        return UtilDate.toDateTimeLocal(cell);
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'amount',
      text: t('trans_amount'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return numberFormatDecimal(+cell, ' đ', '');
      },
      csvFormatter: (cell) => {
        return numberFormatDecimal(+cell, '', '');
      },
      filter: customFilter({
        type: FILTER_TYPES.SELECT
      }),
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
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
      dataField: 'paymentGateway',
      text: t('paymentType'),
      sort: false,
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderPaymentType(cell, t(cell), 'tag')}</div>;
      },
      csvFormatter: (cell) => {
        return cell ? t(cell) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(PAYMENT_TYPE).map((o) => {
              return {
                value: PAYMENT_TYPE[o],
                search: t(PAYMENT_TYPE[o]),
                label: renderPaymentType(PAYMENT_TYPE[o], t(PAYMENT_TYPE[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'orderId',
      text: t('orderId'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              // setViewModalShow(true);
              // setViewId(row.id);
            }}>
            {cell}
          </AButton>
        );
      }
    },
    {
      dataField: 'payer',
      text: t('payer'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      }
    },
    {
      dataField: 'bankTransferCode',
      text: t('bankTransferCode'),
      style: {
        minWidth: 220,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return cell || '-';
      }
    },
    {
      dataField: 'status',
      text: t('status'),
      sort: false,
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderPaymentStatus(cell, t(cell), 'tag')}</div>;
      },
      csvFormatter: (cell) => {
        return cell ? t(cell) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            resetFilter={resetFilter}
            setResetFilter={setResetFilter}
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(PAYMENT_STATUS).map((o) => {
              return {
                value: PAYMENT_STATUS[o],
                search: t(PAYMENT_STATUS[o]),
                label: renderPaymentStatus(PAYMENT_STATUS[o], t(PAYMENT_STATUS[o]), 'tag')
              };
            })}
          />
        );
      }
    }
    // {
    //   dataField: 'action',
    //   text: t('actions'),
    //   sort: false,
    //   style: {
    //     minWidth: 100,
    //     textAlign: 'center'
    //   },
    //   headerStyle: {
    //     minWidth: 100,
    //     textAlign: 'center'
    //   },
    //   csvExport: false,
    //   headerFormatter: ColumnFormat,
    //   formatter: (cell, row, rowIndex) => {
    //     const menu = (
    //       <ActionMenu>
    //         {actionMenu.map((action, index) => {
    //           if (index <= 1 && (row.paymentGateway === PAYMENT_GATEWAY.CASH || row.status === PAYMENT_STATUS.PAYMENT_SUCCESS)) return null;
    //           return (
    //             <Menu.Item>
    //               <Button
    //                 disabled={disableAction(row, action.text, action.key)}
    //                 className="w-100 d-flex align-items-center"
    //                 type="link"
    //                 onClick={() => action.onClick(row)}>
    //                 {action.icon} &nbsp;{' '}
    //                 {row.memberStatus === 'Blocked' ? (action.alterText ? action.alterText : action.text) : action.text}
    //               </AButton>
    //             </Menu.Item>
    //           );
    //         })}
    //       </ActionMenu>
    //     );

    //     return (
    //       <DropdownStyled overlay={menu} placement="bottomCenter" trigger="click">
    //         <ButtonStyled type="link" size="large" style={{ fontSize: '24px' }} icon={<MoreOutlined />} />
    //       </DropdownStyled>
    //     );
    //   },
    //   classes: 'text-center pr-0',
    //   headerClasses: 'ht-custom-header-table pr-3',
    //   filterRenderer: (onFilter, column) => (
    //     <button
    //       className="btn btn-sm mb-1 py-2 w-100"
    //       onClick={handleResetFilters}
    //       style={{ background: '#000', color: '#fff', position: 'relative', top: '2px' }}>
    //       {t('clear_filter')}
    //     </button>
    //   )
    // }
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
        textAlign: 'center',
        minWidth: 170
      },
      filter: customFilter(),
      filterRenderer: (onFilter, col) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
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
        actionColumn={{
          handleResetFilters: handleResetFilters,
          actions: actionMenu || [],
          disableAction: disableAction
        }}
        supportEdit // for editable and save
        // isDateFilterReverse
        title={t('transaction_management')}
        description={t('transaction_management_des')}
        columns={columns}
        dataRangeKey="trading_date" // for data range filter
        supportMultiDelete
        getStatistic={props.getPaymentsStatistic} // for statistic API
        statisticProps={{
          order: ['totalTransaction', 'successTransaction', 'pendingTransaction', 'failedTransaction'],
          // for statistic API params
          name: 'Payment',
          key: 'status',
          valueSet: {
            // to map params with each filter button
            totalTransaction: undefined,
            successTransaction: 'SUCCESSED',
            pendingTransaction: 'IN_PROCCESS',
            failedTransaction: 'FAILED'
          }
        }}
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('transaction_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        deleteData={props.deleteMechanic}
        fetchData={props.getPayments}
        params={params}
        isClearFilter={isClearFilter}
        setResetFilter={setResetFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'export',
            icon: <i className="fas fa-file-excel" style={{ color: '#000' }}></i>,
            text: t('export_excel'),
            t
          }
        ]}
        customSortField={{
          date: 'lastModifiedDate',
          transactionId: 'orderId',
          amount: 'orderAmount',
          payer: 'fullname',
          status: 'paymentStatus'
        }}></TableBootstrapHook>

      {/* MODALS */}
      {/* <AddModal //
        modalShow={addModalShow}
        setModalShow={setAddModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      /> */}
      <ConfirmModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <ViewModal //
        id={transactionId}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      {/* <EditModal //
        id={editMechanicId}
        modalShow={editModalShow}
        setModalShow={setEditModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      /> */}
      {/* MODALS */}
    </div>
  );
};

export default connect(
  (state) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getPayments: paymentActions.getPayments,
    getPaymentsStatistic: paymentActions.getPaymentsStatistic,
    deleteMechanic: mechanicActions.deleteMechanic,

    approveBankRepairPayment: paymentActions.approveBankRepairPayment,
    approveBankOrderPayment: paymentActions.approveBankOrderPayment,
    getPaymentsDetail: paymentActions.getPaymentsDetail
  }
)(PaymentManagement);
