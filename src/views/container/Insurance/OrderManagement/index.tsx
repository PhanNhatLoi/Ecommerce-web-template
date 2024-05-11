import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import { ORDER_TYPE } from '~/configs';
import { FILTER_AMOUNT_OPTIONS } from '~/configs/rangeNumberFilter';
import * as PATH from '~/configs/routesConfig';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { orderActions } from '~/state/ducks/insurance/order';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import InsuranceBuyerModal from './Modals/InsuranceBuyerModal';
import InsuranceSubmissionModal from './Modals/InsuranceSubmissionModal';
import AButton from '~/views/presentation/ui/buttons/AButton';

type OrderManagementProps = {
  getInsuranceOrder: any;
  getInsuranceOrderStatistic: any;
  getRoleBase: any;
};

const OrderManagement: React.FC<OrderManagementProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [submissionModalShow, setSubmissionModalShow] = useState(false);
  const [buyerModalShow, setBuyerModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState<any>([]);
  const [submissionId, setSubmissionId] = useState<any>();
  const [buyerId, setBuyerId] = useState<any>();
  const [params, setParams] = useState({ sort: 'lastModifiedDate,desc', type: ORDER_TYPE.INSURANCE });
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

  const actions: any = [
    {
      icon: <EyeOutlined />,
      text: t('view_package'),
      onClick: (row) => {
        history.push(PATH.INSURANCE_ORDER_EDIT_PATH.replace(':id', row.id));
      }
    }
  ];

  const actionItem = {
    view: {
      icon: <EyeOutlined />,
      text: t('view_order'),
      onClick: (row) => {
        history.push(PATH.INSURANCE_ORDER_EDIT_PATH.replace(':id', row?.id));
      }
    },
    accept: {
      icon: <CheckCircleOutlined />,
      text: t('action_accept'),
      key: 'access',
      onClick: (row) => {
        // setOrderProcessData([{ type: 'accept', id: row.id }]);
        // setOrderModalShow(true);
      }
    },
    reject: {
      icon: <CloseCircleOutlined />,
      text: t('reject'),
      key: 'access',
      onClick: (row) => {
        // setDataReject({ status: 'reject', id: row.id });
        // setRejectModalShow(true);
      }
    }
  };

  const actionByStatus = {
    // [SALE_ORDER_STATUS.WAITING]: [actionItem.accept, actionItem.reject],
    // [SALE_ORDER_STATUS.PAYMENT_RECEIVED_BY_ECARAID]: [actionItem.accept, actionItem.reject],
    // [SALE_ORDER_STATUS.ACCEPTED_BY_VENDOR]: [actionItem.accept, actionItem.reject],
    // [SALE_ORDER_STATUS.ACCEPTED]: [actionItem.package]
  };

  //action mặc định
  const actionDefault = [actionItem.view];
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
  // ------------------------------
  // FOR COLUMN AND FILTER
  // ------------------------------

  let columns = [
    {
      dataField: 'code',
      text: t('order_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 35, 'center'),
      style: CustomFixedColumns(200, 200, 35, 'center'),
      formatter: (cell: string, row: any) => {
        return cell ? <Link to={PATH.INSURANCE_ORDER_EDIT_PATH.replace(':id', row?.id)}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'createdDate',
      text: t('date_created'),
      fixed: true,
      headerStyle: CustomFixedColumns(180, 'max-content', 235, 'center'),
      style: CustomFixedColumns(180, 'max-content', 235, 'center'),
      formatter: (cell: string) => {
        return <span>{UtilDate.toDateTimeLocal(cell) || '-'}</span>;
      },
      csvFormatter: (cell: string) => {
        return UtilDate.toDateTimeLocal(cell) || '-';
      },
      filterRenderer: (onFilter: any) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'lastModifiedDate',
      text: t('updated_at'),
      fixed: true,
      headerStyle: {
        minWidth: 180,
        textAlign: 'center'
      },
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return <span>{UtilDate.toDateTimeLocal(cell) || '-'}</span>;
      },
      csvFormatter: (cell: string) => {
        return UtilDate.toDateTimeLocal(cell) || '-';
      },
      filterRenderer: (onFilter: any) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'buyerName',
      text: t('buyerAccountName'),
      headerStyle: {
        minWidth: 250,
        textAlign: 'left'
      },
      style: {
        minWidth: 250,
        textAlign: 'left'
      },
      formatter: (cell: string, row: any) => {
        return row?.buyerProfileId ? (
          <AButton
            type="link"
            onClick={() => {
              setBuyerId(row?.buyerProfileId);
              setBuyerModalShow(true);
            }}>
            {cell}
          </AButton>
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'total',
      text: t('total'),
      headerStyle: {
        minWidth: 100,
        textAlign: 'center'
      },
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      csvFormatter: (cell, row) => {
        return cell ? numberFormatDecimal(cell, ' đ', '') : '0 đ';
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
      dataField: 'insuranceContractId',
      text: t('insurance_profile'),
      fixed: true,
      sort: false,
      headerStyle: {
        minWidth: 150,
        textAlign: 'center'
      },
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      filterRenderer: (onFilter: any) => {},
      formatter: (cell: string, row: any) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              setSubmissionId(cell);
              setSubmissionModalShow(true);
            }}>
            {cell}
          </AButton>
        ) : (
          '-'
        );
      }
    }
    // {
    //   dataField: 'action',
    //   text: t('actions'),
    //   sort: false,
    //   headerStyle: {
    //     minWidth: 100,
    //     textAlign: 'center'
    //   },
    //   style: {
    //     textAlign: 'center'
    //   },
    //   csvExport: false,
    //   headerFormatter: ColumnFormat,
    //   formatter: (cell: any, row: any) => {
    //     const actionStatus = actionByStatus[row.status] ? actionByStatus[row.status] : [];
    //     const actions = [...actionDefault, ...actionStatus];

    //     const menu = (
    //       <MenuStyled>
    //         {actions.map((action) => (
    //           <Menu.Item>
    //             <Button
    //               className="w-100 d-flex  align-items-center"
    //               type="link"
    //               onClick={() => action.onClick(row)}
    //               disabled={action.disabled}>
    //               {action.icon} &nbsp;
    //               {action.text}
    //             </AButton>
    //           </Menu.Item>
    //         ))}
    //       </MenuStyled>
    //     );

    //     return (
    //       <DropdownStyled overlay={menu} placement="bottomCenter" trigger={['click']}>
    //         <ButtonStyled type="link" size="large" style={{ fontSize: '24px' }} icon={<MoreOutlined />} />
    //       </DropdownStyled>
    //     );
    //   },
    //   filterRenderer: () => (
    //     <button
    //       className="btn btn-sm mb-1 float-right py-2"
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
  let columnsArr = columns.map((column) => {
    return {
      editable: false,
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
      filter: customFilter(),
      filterRenderer: (onFilter: any) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      csvFormatter: (cell: string) => {
        return cell || '-';
      },
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
          actions: actions || []
          // disableAction: disableAction
        }}
        title={t('package_order')}
        description={''}
        columns={columnsArr}
        dataRangeKey="createdDate" // for data range filter
        isDateFilterReverse
        isNumberRangeReverse
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('package_order_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getInsuranceOrder}
        params={params}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          // {
          //   type: 'hasData',
          //   text: t('delete'),
          //   icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
          //   onClick: (selectedData: any) => {
          //     // setConfirmModalShow(true);
          //     // setConfirmData(
          //     //   selectedData.map((data) => {
          //     //     return { type: ACTION_TYPE.DELETE, id: data.id, fullname: data.fullname };
          //     //   })
          //     // );
          //   }
          // },
          // {
          //   type: 'hasData',
          //   text: t('approve'),
          //   icon: <i className="fas fa-check" style={{ color: '#000' }}></i>,
          //   disable: (selectedData: any) => true,
          //   // selectedData.some((item) => item?.status !== ORDER_STATUS.ACTIVATED) || selectedData?.length < 1,
          //   onClick: (selectedData: any) => {
          //     // if (selectedData.every((item) => item.status === ORDER_STATUS.ACTIVATED)) {
          //     //   setConfirmModalShow(true);
          //     //   setConfirmData(
          //     //     selectedData.map((data) => {
          //     //       return { type: ACTION_TYPE.BLOCK, id: data.id, fullname: data.fullname };
          //     //     })
          //     //   );
          //     // }
          //   }
          // },
          // {
          //   type: 'hasData',
          //   text: t('reject'),
          //   icon: <i className="fas fa-times" style={{ color: '#000' }}></i>,
          //   disable: (selectedData: any) => true,
          //   // selectedData.some((item) => item?.status !== ORDER_STATUS.DEACTIVATED) || selectedData?.length < 1,
          //   onClick: (selectedData: any) => {
          //     // if (selectedData.every((item) => item.status === ORDER_STATUS.DEACTIVATED)) {
          //     //   setConfirmModalShow(true);
          //     //   setConfirmData(
          //     //     selectedData.map((data) => {
          //     //       return { type: ACTION_TYPE.UNBLOCK, id: data.id, fullname: data.fullname };
          //     //     })
          //     //   );
          //     // }
          //   }
          // },
          {
            type: 'export',
            icon: <i className="fas fa-file-csv" style={{ color: '#000' }}></i>,
            text: t('export_csv'),
            t
          }
        ]}></TableBootstrapHook>

      <InsuranceBuyerModal buyerId={buyerId} modalShow={buyerModalShow} setModalShow={setBuyerModalShow} />

      <InsuranceSubmissionModal submissionId={submissionId} modalShow={submissionModalShow} setModalShow={setSubmissionModalShow} />

      {/* <ConfirmModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      /> */}
    </div>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getInsuranceOrder: orderActions.getInsuranceOrder,
    getInsuranceOrderStatistic: orderActions.getInsuranceOrderStatistic
  }
)(OrderManagement);
