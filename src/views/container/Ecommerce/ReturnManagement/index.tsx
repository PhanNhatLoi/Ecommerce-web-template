import { EyeOutlined, MinusCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import * as PATH from '~/configs/routesConfig';
import { CUSTOMER_STATUS } from '~/configs/status/car-services/customerStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { CustomerListResponse } from '~/state/ducks/customer/actions';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { Link } from 'react-router-dom';

import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { ButtonStyled, DropdownStyled, MenuStyled } from './components/Styles';
import { returnActions } from '~/state/ducks/return';
import { FILTER_AMOUNT_OPTIONS } from '~/configs/rangeNumberFilter';
import ConfirmModal, { ACTION_TYPE } from './Modals/ConfirmModal';

type ReturnManagementProps = {
  getReturns: any;
  getRoleBase: any;
};

const ReturnManagement: React.FC<ReturnManagementProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState<any>([]);
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);
  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------

  const actions: any = [
    {
      icon: <EyeOutlined />,
      text: t('view_customer'),
      onClick: (row: any) => {
        history.push(PATH.CAR_ACCESSORIES_RETURN_EDIT_PATH.replace(':id', row?.id));
      }
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('deleteReturn'),
      disabled: !fullAccessPage,
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: ACTION_TYPE.DELETE, id: row.id }]);
      }
    }
  ];
  // ------------------------------
  // FOR MECHANIC ACTIONS
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
      text: t('orderCode'),
      fixed: true,
      headerStyle: CustomFixedColumns(180, 180, 35, 'center'),
      style: CustomFixedColumns(180, 180, 35, 'center'),
      formatter: (cell: string, row: any) => {
        return cell ? <Link to={PATH.CAR_ACCESSORIES_RETURN_EDIT_PATH.replace(':id', row?.id)}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'createdDate',
      text: t('date_created'),
      fixed: true,
      headerStyle: CustomFixedColumns(180, 180, 215, 'center'),
      style: CustomFixedColumns(180, 180, 215, 'center'),
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
      text: t('customer_name'),
      style: {
        minWidth: 250,
        textAlign: 'left'
      },
      headerStyle: {
        textAlign: 'left',
        minWidth: 250
      },
      formatter: (cell: string, row: any) => {
        return row?.customerInfo?.buyerName ? (
          <Link to={PATH.CAR_ACCESSORIES_RETURN_EDIT_PATH.replace(':id', row?.id)}>{row?.customerInfo?.buyerName}</Link>
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'refundAmount',
      text: t('total_amount'),
      style: {
        minWidth: 170,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 170
      },
      formatter: (cell: string) => {
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
    //   formatter: (cell: any, row: CustomerListResponse) => {
    //     const menu = (
    //       <MenuStyled>
    //         {actions.map((action) => (
    //           <Menu.Item>
    //             <Button
    //               className="w-100 d-flex  align-items-center"
    //               type="link"
    //               onClick={() => action.onClick(row)}
    //               disabled={action.disabled}>
    //               {row.status === CUSTOMER_STATUS.DANGER ? (action.alterIcon ? action.alterIcon : action.icon) : action.icon} &nbsp;
    //               {row.status === CUSTOMER_STATUS.DANGER ? (action.alterText ? action.alterText : action.text) : action.text}
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
        title={t('returnManagement')}
        description={t('returnManagementDes')}
        columns={columnsArr}
        dataRangeKey="createdDate" // for data range filter
        isDateFilterReverse
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('customer_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getReturns}
        params={{ sort: 'createdDate,desc' }}
        isClearFilter={isClearFilter}
        // getStatistic={props.getCustomerStatistic} // for statistic API
        // statisticProps={{
        //   // for statistic API params
        //   name: 'Customer',
        //   key: 'status',
        //   valueSet: {
        //     // to map params with each filter button
        //     totalCustomer: undefined,
        //     activated: CUSTOMER_STATUS.SUCCESS,
        //     deactivated: CUSTOMER_STATUS.DANGER
        //   }
        // }}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('createReturn'),
            onClick: () => {
              history.push(PATH.CAR_ACCESSORIES_RETURN_NEW_PATH);
            }
          },
          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
            onClick: (selectedData: any) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data) => {
                  return { type: ACTION_TYPE.DELETE, id: data.id };
                })
              );
            }
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
    </div>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getReturns: returnActions.getReturns
  }
)(ReturnManagement);
