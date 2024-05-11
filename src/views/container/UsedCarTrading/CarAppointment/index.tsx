import { CheckOutlined, CloseOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useLocation } from 'react-use';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { CustomFixedColumns } from '../../commons/customFixedColumns';
import { WrapTableStyled } from './components/Styles';
import { usedCarTradingAppointment } from '~/state/ducks/usedCarTrading/carAppointment';
import {
  renderUsedCarTradingAppointmentStatus,
  USED_CAR_TRADING_APPOINTMENT_STATUS
} from '~/configs/status/used-car-trading/usedCarAppointmentStatus';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import { carTradingAppointmentListResponseType } from '~/state/ducks/usedCarTrading/carAppointment/types';
import ConfirmModal from './Modals/ConfirmModal';
import UpdateAppointmentDate from './Modals/UpdateAppointmentDate';
// import UpdateAppointmentDate from './Modals/UpdateAppointmentDate';

type Props = {
  getUsedCarTradingAppointment: any; // danh sách lịch hẹn xem xe
  getRoleBase: any; // rolebase
};

const UsedCarAppointment = (props: Props) => {
  const { t }: any = useTranslation(); // const biến thư viện react-18next
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase); // hàm lấy phân quyền trang
  const [needLoadNewData, setNeedLoadNewData] = useState(true); // refresh dữ liệu table
  const [params, setParams] = useState<any>({ sort: 'approxStartDate,desc' }); // params truyền vào table

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState<any>([]);

  const [currentData, setCurrentData] = useState<carTradingAppointmentListResponseType>();
  const [updateDateModalShow, setUpdateDateModalShow] = useState(false);

  // ------------------------------
  // FOR VIDEO ACTIONS
  // ------------------------------

  const disableAction = (row: carTradingAppointmentListResponseType, text, key) => {
    let disable = false;
    switch (text) {
      case t('done'):
      case t('cancel'):
      case t('update_appointment_date'):
        disable = row.appointStatus !== USED_CAR_TRADING_APPOINTMENT_STATUS.NEW;
        break;
    }
    return key === 'access' && fullAccessPage ? disable : !fullAccessPage;
  };

  const actions = [
    {
      // hoàn thành
      icon: <CheckOutlined />,
      text: t('done'),
      key: 'access',
      onClick: (row: carTradingAppointmentListResponseType) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'done', id: row.id }]);
      }
    },
    {
      // Huỷ
      icon: <CloseOutlined />,
      text: t('cancel'),
      key: 'access',
      onClick: (row: carTradingAppointmentListResponseType) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'canceled', id: row.id }]);
      }
    },
    {
      // cập nhật lịch hẹn
      icon: <EditOutlined />,
      text: t('update_appointment_date'),
      key: 'access',
      onClick: (row: carTradingAppointmentListResponseType) => {
        setUpdateDateModalShow(true);
        setCurrentData(row);
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
      dataField: 'id',
      text: t('code'),
      fixed: true,
      headerStyle: CustomFixedColumns(180, 180, 35, 'center'),
      style: CustomFixedColumns(180, 180, 35, 'center')
    },
    {
      dataField: 'buyerName',
      text: t('requester_fix'),
      fixed: true,
      headerStyle: CustomFixedColumns(300, 300, 215, 'left'),
      style: CustomFixedColumns(300, 300, 215, 'left')
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
      dataField: 'carTradingId',
      text: t('car_appointment_id'),
      style: {
        minWidth: 220,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 220,
        textAlign: 'center'
      }
    },
    {
      dataField: 'carTradingName',
      text: t('car'),
      style: {
        minWidth: 220,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 220,
        textAlign: 'center'
      }
    },
    {
      dataField: 'approxStartDate',
      text: t('appointment_date_start'),
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
      dataField: 'approxEndDate',
      text: t('appointment_date_end'),
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
      dataField: 'appointStatus',
      text: t('status'),
      sort: false,
      headerStyle: {
        minWidth: 180,
        textAlign: 'center'
      },
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderUsedCarTradingAppointmentStatus(cell, t(cell), 'tag')}</div>;
      },
      filterRenderer: (onFilter: any, column: { text: string }) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(USED_CAR_TRADING_APPOINTMENT_STATUS).map((o) => {
              return {
                value: USED_CAR_TRADING_APPOINTMENT_STATUS[o],
                search: t(USED_CAR_TRADING_APPOINTMENT_STATUS[o]),
                label: renderUsedCarTradingAppointmentStatus(
                  USED_CAR_TRADING_APPOINTMENT_STATUS[o],
                  t(USED_CAR_TRADING_APPOINTMENT_STATUS[o]),
                  'tag'
                )
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
        title={t('car_appointment_managerment')}
        actionColumn={{
          handleResetFilters: handleResetFilters,
          actions: actions || [],
          disableAction: disableAction
        }}
        supportEdit // for editable and save
        columns={columnsArr}
        dataRangeKey="createdDate" // for data range filter
        isDateFilterReverse
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getUsedCarTradingAppointment}
        params={params}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'export',
            icon: <i className="fas fa-file-excel" style={{ color: '#000' }}></i>,
            text: t('export_excel'),
            t
          },
          {
            type: 'hasData',
            class: 'pl-0',
            disable: (selectedData) =>
              selectedData.some((item) => item?.appointStatus !== USED_CAR_TRADING_APPOINTMENT_STATUS.NEW) || selectedData?.length < 1,
            icon: <i className="fas fa-check" style={{ color: '#000' }}></i>,
            text: t('done'),
            onClick: (selectedData) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data) => {
                  return { type: 'done', id: data.id };
                })
              );
            }
          },
          {
            type: 'hasData',
            class: 'pl-0',
            disable: (selectedData) =>
              selectedData.some((item) => item?.appointStatus !== USED_CAR_TRADING_APPOINTMENT_STATUS.NEW) || selectedData?.length < 1,
            icon: <i className="fas fa-ban" style={{ color: '#000' }}></i>,
            text: t('cancel'),
            onClick: (selectedData) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data) => {
                  return { type: 'canceled', id: data.id };
                })
              );
            }
          }
        ]}
      />
      <ConfirmModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <UpdateAppointmentDate
        data={currentData}
        modalShow={updateDateModalShow}
        setData={setConfirmData}
        setModalShow={setUpdateDateModalShow}
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
    getUsedCarTradingAppointment: usedCarTradingAppointment.getUsedCarTradingAppointment
  }
)(UsedCarAppointment);
