import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import { FILTER_AMOUNT_OPTIONS } from '~/configs/rangeNumberFilter';
import * as PATH from '~/configs/routesConfig';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { insuranceProfileActions } from '~/state/ducks/insurance/insurance-profile';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import CreateModal from './Modals/CreateModal';
import CustomerModal from './Modals/CustomerModal';
import PackageModal from './Modals/PackageModal';
import AButton from '~/views/presentation/ui/buttons/AButton';

type InsuranceProfileProps = {
  getInsuranceProfile: any;
  getInsuranceProfileStatistic: any;
  getRoleBase: any;
};

const InsuranceProfile: React.FC<InsuranceProfileProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [confirmData, setConfirmData] = useState<any>([]);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [packageId, setPackageId] = useState<any>();
  const [packageModalShow, setPackageModalShow] = useState(false);
  const [customerId, setCustomerId] = useState<any>();
  const [customerModalShow, setCustomerModalShow] = useState(false);
  const [createModalShow, setCreateModalShow] = useState(false);
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);
  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------

  const actions: any = [
    {
      icon: <EyeOutlined />,
      text: t('view_order'),
      onClick: (row) => {
        history.push(PATH.INSURANCE_PROFILE_EDIT_PATH.replace(':id', row.id));
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
      dataField: 'id',
      text: t('id'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      formatter: (cell: string, row: any) => {
        return cell ? <Link to={PATH.INSURANCE_PROFILE_EDIT_PATH.replace(':id', row.id)}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'customerName',
      text: t('customer_name'),
      headerStyle: CustomFixedColumns(250, 250, 185, 'left'),
      style: CustomFixedColumns(250, 250, 185, 'left'),
      formatter: (cell: string, row: any) => {
        return cell ? <Link to={PATH.INSURANCE_PROFILE_EDIT_PATH.replace(':id', row.id)}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'vehicleNumberPlate',
      text: t('vehicle'),
      headerStyle: {
        minWidth: 180,
        textAlign: 'center'
      },
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      formatter: (cell: string, row: any) => {
        return cell ? <Link to={PATH.INSURANCE_PROFILE_EDIT_PATH.replace(':id', row.id)}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'insurancePackageName',
      text: t('package_insurance'),
      headerStyle: {
        minWidth: 250,
        textAlign: 'center'
      },
      style: {
        minWidth: 250,
        textAlign: 'center'
      },
      formatter: (cell: string, row: any) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              setPackageId(row?.insurancePackageId);
              setPackageModalShow(true);
            }}>
            {cell}
          </AButton>
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'createdDate',
      text: t('date_created'),
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
      dataField: 'total',
      text: t('total'),
      headerStyle: {
        minWidth: 70,
        textAlign: 'center'
      },
      style: {
        minWidth: 70,
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
        title={t('insurance_profile')}
        description={t('insurance_profile_des')}
        columns={columnsArr}
        dataRangeKey="createdDate" // for data range filter
        isDateFilterReverse
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('insurance_profile_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getInsuranceProfile}
        params={{ sort: 'lastModifiedDate,desc' }}
        isClearFilter={isClearFilter}
        // getStatistic={props.getInsuranceProfileStatistic} // for statistic API
        // statisticProps={{
        //   // for statistic API params
        //   name: 'Order',
        //   key: 'status',
        //   valueSet: {
        //     // to map params with each filter button
        //     totalPackage: undefined,
        //     activated: INSURANCE_PROFILE_STATUS.ACTIVATED,
        //     deactivated: INSURANCE_PROFILE_STATUS.DEACTIVATED
        //   }
        // }}
        fullAccessPage={fullAccessPage}
        buttons={[
          // {
          //   type: 'create',
          //   class: 'pl-0',
          //   icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
          //   text: t('add_insurance_profile'),
          //   onClick: () => {
          //     setCreateModalShow(true);
          //   }
          // },
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
          //   // selectedData.some((item) => item?.status !== INSURANCE_PROFILE_STATUS.ACTIVATED) || selectedData?.length < 1,
          //   onClick: (selectedData: any) => {
          //     // if (selectedData.every((item) => item.status === INSURANCE_PROFILE_STATUS.ACTIVATED)) {
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
          //   // selectedData.some((item) => item?.status !== INSURANCE_PROFILE_STATUS.DEACTIVATED) || selectedData?.length < 1,
          //   onClick: (selectedData: any) => {
          //     // if (selectedData.every((item) => item.status === INSURANCE_PROFILE_STATUS.DEACTIVATED)) {
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

      <CreateModal modalShow={createModalShow} setModalShow={setCreateModalShow} />

      <PackageModal packageId={packageId} modalShow={packageModalShow} setModalShow={setPackageModalShow} />

      <CustomerModal customerId={customerId} modalShow={customerModalShow} setModalShow={setCustomerModalShow} />

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
    getInsuranceProfile: insuranceProfileActions.getInsuranceProfile,
    getInsuranceProfileStatistic: insuranceProfileActions.getInsuranceProfileStatistic
  }
)(InsuranceProfile);
