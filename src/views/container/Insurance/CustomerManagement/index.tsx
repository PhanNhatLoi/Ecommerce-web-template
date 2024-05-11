import { CheckCircleOutlined, EyeOutlined, MinusCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import { CUSTOMER_BUSINESS_TYPE } from '~/configs';
import * as PATH from '~/configs/routesConfig';
import { CUSTOMER_STATUS, renderCustomerStatus } from '~/configs/status/car-services/customerStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { customerActions } from '~/state/ducks/customer';
import { CustomerListResponse, ParamsType } from '~/state/ducks/customer/actions';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import COLOR from '~/views/utilities/layout/color';

import ConfirmModal, { ACTION_TYPE } from '../CustomerManagement/Modals/ConfirmModal';
import { ButtonStyled, DropdownStyled, MenuStyled } from './components/Styles';

type CustomerManagementProps = {
  getCustomers: (params: ParamsType) => void;
  getCustomerStatistic: (params: ParamsType) => void;
  getRoleBase: any;
};

const CustomerManagement: React.FC<CustomerManagementProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [params, setParams] = useState({
    sort: 'lastModifiedDate,desc',
    businessType: CUSTOMER_BUSINESS_TYPE.INSURANCE_COMPANY
  });
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [confirmModalShow, setConfirmModalShow] = useState(false);

  const [confirmData, setConfirmData] = useState<any[]>([]);

  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);
  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------

  const actions: any[] = [
    {
      icon: <EyeOutlined />,
      text: t('view_customer'),
      onClick: (row) => {
        history.push(PATH.INSURANCE_CUSTOMER_EDIT_PATH.replace(':id', row?.profileId?.toString()));
      }
    },
    {
      icon: <StopOutlined />,
      text: t('block_customer'),
      alterText: t('unblock_customer'),
      disabled: !fullAccessPage,
      alterIcon: <CheckCircleOutlined />,
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: row.status === CUSTOMER_STATUS.SUCCESS ? ACTION_TYPE.BLOCK : ACTION_TYPE.UNBLOCK, id: row.id }]);
      }
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('delete_customer'),
      disabled: !fullAccessPage,
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: ACTION_TYPE.DELETE, id: row.id, fullname: row.fullname }]);
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
      text: t('customer_code'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 35, 'center'),
      style: CustomFixedColumns(200, 200, 35, 'center'),
      formatter: (cell: string, row: CustomerListResponse) => {
        return cell ? <Link to={PATH.INSURANCE_CUSTOMER_EDIT_PATH.replace(':id', row?.profileId?.toString())}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'fullname',
      text: t('customer_name'),
      fixed: true,
      headerStyle: CustomFixedColumns(250, 300, 235, 'left'),
      style: CustomFixedColumns(250, 300, 235, 'left'),
      formatter: (cell: string, row: CustomerListResponse) => {
        return cell ? <Link to={PATH.INSURANCE_CUSTOMER_EDIT_PATH.replace(':id', row?.profileId?.toString())}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'phone',
      text: t('phone_number'),
      style: {
        minWidth: 170,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 170
      },
      formatter: (cell: string) => {
        return cell ? formatPhoneWithCountryCode(cell, cell?.startsWith('84') ? 'VN' : cell?.startsWith('1') ? 'US' : 'VN') : '-';
      },
      sort: false
    },
    {
      dataField: 'fullAddress',
      text: t('address'),
      sort: false,
      style: {
        minWidth: 250
      },
      headerStyle: { minWidth: 250 },
      filter: '',
      filterRenderer: '',
      formatter: (cell, row) => {
        return cell || '-';
      },
      csvFormatter: (cell: any) => {
        return cell || '-';
      }
    },
    {
      dataField: 'createdDate',
      text: t('date_created'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 100
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
      dataField: 'status',
      text: t('status'),
      headerStyle: {
        minWidth: 70,
        textAlign: 'center'
      },
      style: {
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderCustomerStatus(cell, t(cell), 'tag')}</div>;
      },
      csvFormatter: (cell: string) => {
        return cell ? t(cell) : '-';
      },
      filterRenderer: (onFilter: any, column: { text: string }) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(CUSTOMER_STATUS).map((o) => {
              return {
                value: CUSTOMER_STATUS[o],
                search: t(CUSTOMER_STATUS[o]),
                label: renderCustomerStatus(CUSTOMER_STATUS[o], t(CUSTOMER_STATUS[o]), 'tag')
              };
            })}
          />
        );
      },
      sort: false
    },
    {
      dataField: 'action',
      text: t('actions'),
      sort: false,
      headerStyle: {
        minWidth: 130,
        textAlign: 'center'
      },
      style: {
        textAlign: 'center'
      },
      csvExport: false,
      headerFormatter: ColumnFormat,
      formatter: (cell: any, row: CustomerListResponse) => {
        const menu = (
          <MenuStyled>
            {actions.map((action) => (
              <Menu.Item>
                <AButton
                  className="w-100 d-flex  align-items-center"
                  type="link"
                  onClick={() => action.onClick(row)}
                  disabled={action.disabled}>
                  {row.status === CUSTOMER_STATUS.DANGER ? (action.alterIcon ? action.alterIcon : action.icon) : action.icon} &nbsp;
                  {row.status === CUSTOMER_STATUS.DANGER ? (action.alterText ? action.alterText : action.text) : action.text}
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
      filterRenderer: () => (
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
        title={t('customer_list')}
        description={t('customer_management_des')}
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
        fetchData={props.getCustomers}
        params={params}
        isClearFilter={isClearFilter}
        getStatistic={props.getCustomerStatistic} // for statistic API
        statisticProps={{
          // for statistic API params
          name: 'Customer',
          key: 'status',
          params: { businessType: CUSTOMER_BUSINESS_TYPE.INSURANCE_COMPANY },
          order: ['totalCustomer', 'activated', 'deactivated'],
          valueSet: {
            // to map params with each filter button
            totalCustomer: undefined,
            activated: CUSTOMER_STATUS.SUCCESS,
            deactivated: CUSTOMER_STATUS.DANGER
          }
        }}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('add_customer_lowercase'),
            onClick: () => {
              history.push(PATH.INSURANCE_CUSTOMER_NEW_PATH);
            }
          },
          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
            onClick: (selectedData: any[]) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data) => {
                  return { type: ACTION_TYPE.DELETE, id: data.id };
                })
              );
            }
          },
          {
            type: 'hasData',
            text: t('block'),
            icon: <i className="fas fa-ban" style={{ color: '#000' }}></i>,
            disable: (selectedData: any[]) =>
              selectedData.some((item) => item?.status !== CUSTOMER_STATUS.SUCCESS) || selectedData?.length < 1,
            onClick: (selectedData: any[]) => {
              if (selectedData.every((item) => item.status === CUSTOMER_STATUS.SUCCESS)) {
                setConfirmModalShow(true);
                setConfirmData(
                  selectedData.map((data) => {
                    return { type: ACTION_TYPE.BLOCK, id: data.id };
                  })
                );
              }
            }
          },
          {
            type: 'hasData',
            text: t('unblock'),
            icon: <i className="fas fa-check" style={{ color: '#000' }}></i>,
            disable: (selectedData: any[]) =>
              selectedData.some((item) => item?.status !== CUSTOMER_STATUS.DANGER) || selectedData?.length < 1,
            onClick: (selectedData: any[]) => {
              if (selectedData.every((item) => item.status === CUSTOMER_STATUS.DANGER)) {
                setConfirmModalShow(true);
                setConfirmData(
                  selectedData.map((data) => {
                    return { type: ACTION_TYPE.UNBLOCK, id: data.id };
                  })
                );
              }
            }
          },
          {
            type: 'export',
            icon: <i className="fas fa-file-excel" style={{ color: '#000' }}></i>,
            text: t('export_excel'),
            t
          }
        ]}></TableBootstrapHook>

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
    getCustomers: customerActions.getCustomers,
    getCustomerStatistic: customerActions.getCustomerStatistic
  }
)(CustomerManagement);
