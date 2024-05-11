import { EyeOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import { FILTER_NUMBER_OPTIONS } from '~/configs/rangeNumberFilter';
import * as PATH from '~/configs/routesConfig';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { usedCarTradingCustomerActions } from '~/state/ducks/usedCarTrading/customer';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { CustomFixedColumns } from '../../commons/customFixedColumns';
import { WrapTableStyled } from './components/Styles';
import ConfirmModal from './Modals/ConfirmModal';
import { CUSTOMER_STATUS, renderCustomerStatus } from '~/configs/status/car-services/customerStatus';
import { CUSTOMER_BUSINESS_TYPE } from '~/configs';
import { customerActions } from '~/state/ducks/customer';

type CustomerManagementProps = {
  getUsedCarTradingCustomer: any;
  getRoleBase: any;
};

const CustomerManagement = (props: CustomerManagementProps) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [params, setParams] = useState<any>({
    businessType: CUSTOMER_BUSINESS_TYPE.USED_CAR_DEALERSHIP
  });

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState<any>([]);

  // ------------------------------
  // FOR VIDEO ACTIONS
  // ------------------------------

  const actions: any = [
    {
      icon: <EyeOutlined />,
      text: t('view'),
      onClick: (row: any) => {
        history.push(PATH.USED_CAR_TRADING_CUSTOMER_EDIT_PATH.replace(':id', row?.profileId));
      }
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('delete'),
      onClick: (row: any) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'delete', id: row.id }]);
      }
    }
  ];
  // ------------------------------
  // FOR VIDEO ACTIONS
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
      headerStyle: CustomFixedColumns(180, 180, 35, 'center'),
      style: CustomFixedColumns(180, 180, 35, 'center'),
      formatter: (cell: string, row: any) => {
        return cell ? <Link to={PATH.USED_CAR_TRADING_CUSTOMER_EDIT_PATH.replace(':id', row?.profileId)}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'fullname',
      text: t('fullName'),
      fixed: true,
      headerStyle: CustomFixedColumns(300, 300, 215, 'left'),
      style: CustomFixedColumns(300, 300, 215, 'left'),
      formatter: (cell: string, row: any) => {
        return cell ? <Link to={PATH.USED_CAR_TRADING_CUSTOMER_EDIT_PATH.replace(':id', row?.profileId)}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'phone',
      text: t('phone_number'),
      sort: false,
      style: {
        minWidth: 170,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 170,
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return cell ? formatPhoneWithCountryCode(cell, cell?.startsWith('84') ? 'VN' : cell?.startsWith('1') ? 'US' : 'VN') : '-';
      }
    },
    {
      dataField: 'totalCarsPurchased',
      text: t('totalCarsPurchased'),
      style: {
        minWidth: 220,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 220,
        textAlign: 'center'
      },
      formatter: (cell: any) => {
        return numberFormatDecimal(cell ? cell : 0, '', '');
      },
      filter: customFilter({ type: FILTER_TYPES.SELECT }),
      filterRenderer: (onFilter: any, column: any) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(FILTER_NUMBER_OPTIONS)?.map((o) => {
              return {
                value: FILTER_NUMBER_OPTIONS[o],
                search: FILTER_NUMBER_OPTIONS[o],
                label: o
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'lastModifiedDate',
      text: t('lastModifiedDate'),
      style: {
        minWidth: 220,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 220,
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return cell ? <span>{UtilDate.toDateLocal(cell)}</span> : '-';
      },
      filterRenderer: (onFilter: any) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
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
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderCustomerStatus(cell, t(cell), 'tag')}</div>;
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
            options={Object.keys(CUSTOMER_STATUS).map((o) => {
              return {
                value: CUSTOMER_STATUS[o],
                search: t(CUSTOMER_STATUS[o]),
                label: renderCustomerStatus(CUSTOMER_STATUS[o], t(CUSTOMER_STATUS[o]), 'tag')
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
  const columnsArr = columns.map((column) => {
    return {
      editable: false,
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
      filter: customFilter({ type: FILTER_TYPES.TEXT }),
      filterRenderer: (onFilter: any) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search')} />;
      },
      csvFormatter: (cell: string) => {
        return cell ? cell : '-';
      },
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  return (
    <WrapTableStyled>
      <TableBootstrapHook
        actionColumn={{
          handleResetFilters: handleResetFilters,
          actions: actions || []
          // disableAction: disableAction
        }}
        title={t('customer_list_lowercase')}
        supportEdit // for editable and save
        columns={columnsArr}
        dataRangeKey="createdDate" // for data range filter
        isDateFilterReverse
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('customer_management')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getUsedCarTradingCustomer}
        params={params}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('new_customer'),
            onClick: () => {
              history.push(PATH.USED_CAR_TRADING_CUSTOMER_NEW_PATH);
            }
          },
          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
            onClick: (selectedData) => {
              setConfirmData(
                selectedData.map((data) => {
                  return { type: 'delete', id: data.id };
                })
              );
              setConfirmModalShow(true);
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
    </WrapTableStyled>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getUsedCarTradingCustomer: usedCarTradingCustomerActions.getUsedCarTradingCustomer
  }
)(CustomerManagement);
