import { EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import * as PATH from '~/configs/routesConfig';
import { CUSTOMER_STATUS } from '~/configs/status/car-services/customerStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { CustomerListResponse, ParamsType } from '~/state/ducks/customer/actions';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import ConfirmModal from '../CustomerManagement/Modals/ConfirmModal';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { ButtonStyled, DropdownStyled, MenuStyled } from './components/Styles';
import { arInvoiceActions } from '~/state/ducks/ar_invoice';

type ARInvoiceManagementProps = {
  getArInvoice: (params: ParamsType) => void;
  getRoleBase: any;
};

const ARInvoiceManagement: React.FC<ARInvoiceManagementProps> = (props) => {
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
      disabled: true,
      onClick: (row) => {
        // setViewCustomerId({ code: row?.code.split('_')[1], profileId: row?.profileId.toString() });
      }
    },
    {
      icon: <EditOutlined />,
      text: t('edit_customer'),
      disabled: true,
      onClick: (row) => {
        // history.push(PATH.CAR_ACCESSORIES_CUSTOMER_EDIT_PATH.replace(':code/:profileId', `${row?.code.split('_')[1]}/${row?.profileId}`));
      }
    }
    // {
    //   icon: <MinusCircleOutlined />,
    //   text: t('delete_customer'),
    //   disabled: !fullAccessPage,
    //   onClick: (row) => {
    //     setConfirmModalShow(true);
    //     setConfirmData([{ type: ACTION_TYPE.DELETE, id: row.id, fullname: row.fullname }]);
    //   }
    // }
  ];
  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    return true;
  };
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
      text: t('arInvoiceCode'),
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 180
      },
      formatter: (cell: string) => {
        return cell ? <Link to={'#'}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'customerName',
      text: t('customer_name'),
      style: {
        minWidth: 250,
        textAlign: 'left'
      },
      headerStyle: {
        textAlign: 'left',
        minWidth: 250
      },
      formatter: (cell: string, row: CustomerListResponse) => {
        return cell ? <Link to={'#'}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'total',
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
      }
    },
    {
      dataField: 'createdDate',
      text: t('date_created'),
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 180
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
          actions: actions || [],
          disableAction: disableAction
        }}
        title={t('arInvoiceManagement')}
        description={t('arInvoiceManagementDes')}
        columns={columnsArr}
        dataRangeKey="createdDate" // for data range filter
        isDateFilterReverse
        supportMultiDelete
        supportSelect
        supportSearch
        selectField="id"
        searchPlaceholder={t('customer_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getArInvoice}
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
            text: t('createArInvoice'),
            onClick: () => {
              history.push(PATH.CAR_ACCESSORIES_AR_INVOICE_NEW_PATH);
            }
          },
          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
            onClick: (selectedData: any) => {
              // setConfirmModalShow(true);
              // setConfirmData(
              //   selectedData.map((data) => {
              //     return { type: ACTION_TYPE.DELETE, id: data.id, fullname: data.fullname };
              //   })
              // );
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
    getArInvoice: arInvoiceActions.getArInvoice
  }
)(ARInvoiceManagement);
