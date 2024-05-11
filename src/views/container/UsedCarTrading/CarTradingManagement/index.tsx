import { DeleteFilled, DollarOutlined, EyeInvisibleOutlined, EyeOutlined, RollbackOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import { DEFAULT_AVATAR } from '~/configs/default';
import { FILTER_CAR_PRICE_OPTIONS, FILTER_NUMBER_OPTIONS } from '~/configs/rangeNumberFilter';
import * as PATH from '~/configs/routesConfig';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { renderUsedCarTradingStatus, USED_CAR_TRADING_STATUS } from '~/configs/status/used-car-trading/usedCarTradingStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { carTradingActions } from '~/state/ducks/usedCarTrading/carTrading';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { API_URL } from '~/configs';

import { CustomFixedColumns } from '../../commons/customFixedColumns';
import { UsedCarTradingListResponseType, vehicleInfoResponseType } from '../Types';
import { WrapTableStyled } from './components/Styles';
import ConfirmModal from './Modals/ConfirmModal';
import SaleCar from './Modals/SaleCar';

type CarTradingManagementProps = {
  getRoleBase: any;
  getCarTrading: (params: any) => any;
  getCarTradingStatistic: (params: any) => any;
};

const CarTradingManagement = (props: CarTradingManagementProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [params, setParams] = useState<any>({ sort: 'lastModifiedDate,desc' });

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState<any>([]);

  const [modalsSoldShow, setModalsSoldShow] = useState<boolean>(false);

  // ------------------------------
  // FOR VIDEO ACTIONS
  // ------------------------------

  const disableAction = (row, text, key) => {
    let disable = false;
    switch (text) {
      case t('sold'):
      case t('hideNews'):
        disable = row.status !== USED_CAR_TRADING_STATUS.APPROVED;
        break;
      case t('repost'):
        disable = row.status !== USED_CAR_TRADING_STATUS.HIDDEN;
        break;

      default:
        disable = false;
        break;
    }
    return key === 'access' && fullAccessPage ? disable : !fullAccessPage;
  };

  const actions: any = [
    {
      icon: <EyeOutlined />,
      text: t('detail'),
      onClick: (row: UsedCarTradingListResponseType) => {
        history.push(PATH.USED_CAR_TRADING_EDIT_PATH.replace(':id', row.id.toString()));
      }
    },
    {
      icon: <DollarOutlined />,
      text: t('sold'),
      key: 'access',
      onClick: (row: UsedCarTradingListResponseType) => {
        setModalsSoldShow(true);
        setConfirmData([{ type: 'sold', id: row.id }]);
      }
    },
    {
      icon: <EyeInvisibleOutlined />,
      text: t('hideNews'),
      key: 'access',
      onClick: (row: UsedCarTradingListResponseType) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'hidden', id: row.id }]);
      }
    },
    {
      icon: <RollbackOutlined />,
      text: t('repost'),
      key: 'access',
      onClick: (row: UsedCarTradingListResponseType) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'approved', id: row.id }]);
      }
    },
    {
      icon: <DeleteFilled />,
      text: t('delete'),
      key: 'access',
      onClick: (row: UsedCarTradingListResponseType) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'deleted', id: row.id }]);
      }
    }
    // {
    //   icon: <MinusCircleOutlined />,
    //   text: t('delete'),
    //   key: 'access',
    //   onClick: (row: UsedCarTradingListResponseType) => {
    //     setConfirmModalShow(true);
    //     setConfirmData([{ type: 'delete', id: row.id }]);
    //   }
    // }
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
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      formatter: (cell: string, row: UsedCarTradingListResponseType) => {
        return cell ? <Link to={PATH.USED_CAR_TRADING_EDIT_PATH.replace(':id', row.id.toString())}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'title',
      text: t('Title'),
      fixed: true,
      headerStyle: CustomFixedColumns(300, 300, 185, 'left'),
      style: CustomFixedColumns(300, 300, 185, 'left'),
      formatter: (cell: string, row: UsedCarTradingListResponseType) => {
        return cell ? <Link to={PATH.USED_CAR_TRADING_EDIT_PATH.replace(':id', row.id.toString())}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'vehicleInfo',
      text: t('image'),
      sort: false,
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 150,
        textAlign: 'center'
      },
      filter: '',
      filterRenderer: '',
      formatter: (cell: vehicleInfoResponseType) => {
        if (cell) {
          const image = cell.media.filter((f) => f?.type === 'IMAGE')?.[0].url || '';
          let src = !image.includes('http') ? firstImage(image) : image || DEFAULT_AVATAR;
          return (
            <div className="d-flex justify-content-center">
              <AuthImage
                preview={{
                  mask: <EyeOutlined />
                }}
                width={50}
                isAuth={true}
                src={src}
                // onClick={(e) => e.stopPropagation()}
              />
            </div>
          );
        } else return <></>;
      },
      csvFormatter: (cell) => {
        return cell ? firstImage(cell) : API_URL + DEFAULT_AVATAR;
      }
    },
    {
      dataField: 'createdDate',
      text: t('create_day'),
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
      dataField: 'price',
      text: t('price'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 200
      },
      headerStyle: { textAlign: 'center', minWidth: 200 },
      filter: customFilter({ type: FILTER_TYPES.SELECT }),
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(FILTER_CAR_PRICE_OPTIONS).map((o) => {
              return {
                value: FILTER_CAR_PRICE_OPTIONS[o],
                search: FILTER_CAR_PRICE_OPTIONS[o],
                label: o
              };
            })}
          />
        );
      },
      formatter: (cell) => {
        return numberFormatDecimal(+cell, ' đ', '');
      },
      csvFormatter: (cell) => {
        return numberFormatDecimal(+cell, '', '');
      }
    },
    {
      dataField: 'viewCount',
      text: t('views'),
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
      dataField: 'status',
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
        return <div className="w-100 status_wrap-nononono">{cell && renderUsedCarTradingStatus(cell, t(cell), 'tag')}</div>;
      },
      filterRenderer: (onFilter: any, column: { text: string }) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(USED_CAR_TRADING_STATUS).map((o) => {
              return {
                value: USED_CAR_TRADING_STATUS[o],
                search: t(USED_CAR_TRADING_STATUS[o]),
                label: renderUsedCarTradingStatus(USED_CAR_TRADING_STATUS[o], t(USED_CAR_TRADING_STATUS[o]), 'tag')
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
        title={t('usedCarListingManagement')}
        actionColumn={{
          handleResetFilters: handleResetFilters,
          actions: actions || [],
          disableAction: disableAction
        }}
        supportEdit // for editable and save
        columns={columnsArr}
        dataRangeKey="createdDate" // for data range filter
        isDateFilterReverse
        isNumberRangeReverse
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('usedCarTrading_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getCarTrading}
        params={params}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        getStatistic={props.getCarTradingStatistic} // for statistic API
        statisticProps={{
          // for statistic API params
          name: 'UsedCarTrading',
          key: 'status',
          order: ['totalCarTrading', 'totalApproved', 'totalReject', 'totalHidden', 'totalSold', 'totalWaitingForApproved'],
          valueSet: {
            // to map params with each filter button
            totalCarTrading: undefined,
            totalApproved: USED_CAR_TRADING_STATUS.APPROVED,
            totalReject: USED_CAR_TRADING_STATUS.REJECTED,
            totalHidden: USED_CAR_TRADING_STATUS.HIDDEN,
            totalSold: USED_CAR_TRADING_STATUS.SOLD,
            totalWaitingForApproved: USED_CAR_TRADING_STATUS.WAITING_FOR_APPROVAL
          }
        }}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('postCarForSale'),
            onClick: () => {
              history.push(PATH.USED_CAR_TRADING_NEW_PATH);
            }
          },
          {
            type: 'hasData',
            class: 'pl-0',
            icon: <i className="fas fa-check" style={{ color: '#000' }}></i>,
            text: t('sold'),
            disable: (selectedData) =>
              selectedData.some((item) => ![USED_CAR_TRADING_STATUS.APPROVED].includes(item?.status)) || selectedData?.length < 1,
            onClick: (selectedData) => {
              setConfirmData(
                selectedData.map((data) => {
                  return { type: 'sold', id: data.id };
                })
              );
              setModalsSoldShow(true);
            }
          },
          {
            type: 'hasData',
            class: 'pl-0',
            icon: <i className="fas fa-eye-slash" style={{ color: '#000' }}></i>,
            text: t('hideNews'),
            disable: (selectedData) =>
              selectedData.some((item) => ![USED_CAR_TRADING_STATUS.APPROVED].includes(item?.status)) || selectedData?.length < 1,
            onClick: (selectedData) => {
              setConfirmData(
                selectedData.map((data) => {
                  return { type: 'hidden', id: data.id };
                })
              );
              setConfirmModalShow(true);
            }
          },
          {
            type: 'hasData',
            text: t('repost'),
            disable: (selectedData) =>
              selectedData.some((item) => ![USED_CAR_TRADING_STATUS.HIDDEN].includes(item?.status)) || selectedData?.length < 1,
            icon: <i className="fa fa-repeat" aria-hidden="true" style={{ color: '#000' }}></i>,
            onClick: (selectedData) => {
              setConfirmData(
                selectedData.map((data) => {
                  return { type: 'approved', id: data.id };
                })
              );
              setConfirmModalShow(true);
            }
          },
          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
            onClick: (selectedData) => {
              setConfirmData(
                selectedData.map((data) => {
                  return { type: 'deleted', id: data.id };
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
          },
          {
            type: 'hasData',
            class: 'pl-0',
            disable: () => true, // disabled cho tới khi làm chức năng này
            icon: <i className="fas fa-dollar" style={{ color: '#000' }}></i>,
            text: t('revaluation'),
            onClick: () => {}
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

      <SaleCar
        setNeedLoadNewData={setNeedLoadNewData}
        data={confirmData}
        setData={setConfirmData}
        modalShow={modalsSoldShow}
        setModalShow={setModalsSoldShow}
      />
    </WrapTableStyled>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getCarTrading: carTradingActions.getCarTrading,
    getCarTradingStatistic: carTradingActions.getCarTradingStatistic
  }
)(CarTradingManagement);
