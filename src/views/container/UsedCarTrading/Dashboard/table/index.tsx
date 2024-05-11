import { EyeOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { styled } from 'styled-components';
import COLOR from '~/color';
import { DEFAULT_AVATAR } from '~/configs/default';
import { FILTER_AMOUNT_OPTIONS, FILTER_NUMBER_OPTIONS } from '~/configs/rangeNumberFilter';
import * as PATH from '~/configs/routesConfig';
import { renderUsedCarTradingStatus, USED_CAR_TRADING_STATUS } from '~/configs/status/used-car-trading/usedCarTradingStatus';
import { carTradingActions } from '~/state/ducks/usedCarTrading/carTrading';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
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

import { UsedCarTradingListResponseType, vehicleInfoResponseType } from '../../Types';

const BodyStyled = styled.div`
  .card.card-custom {
    box-shadow: none;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #fcfcfc;
  }

  .header-table {
    padding-top: 15px;
    padding-left: 30px;
    padding-right: 30px;
    margin-bottom: 0px;
    display: flex;
    justify-content: space-between;
  }
  .header-table span {
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .header-table a {
    color: ${COLOR.blue02};
  }
`;

type DashboardCarTradingManagementType = {
  getCarTrading: any;
};

const DashboardCarTradingManagement: React.FC<DashboardCarTradingManagementType> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();

  const [needLoadNewData, setNeedLoadNewData] = useState(true);

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
      dataField: 'id',
      text: t('code'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 0, 'center'),
      style: CustomFixedColumns(150, 150, 0, 'center'),
      formatter: (cell: string, row: UsedCarTradingListResponseType) => {
        return cell ? <Link to={PATH.USED_CAR_TRADING_EDIT_PATH.replace(':id', row.id.toString())}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'title',
      text: t('Title'),
      fixed: true,
      headerStyle: CustomFixedColumns(300, 300, 150, 'left'),
      style: CustomFixedColumns(300, 300, 150, 'left'),
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
            options={Object.keys(FILTER_AMOUNT_OPTIONS).map((o) => {
              return {
                value: FILTER_AMOUNT_OPTIONS[o],
                search: FILTER_AMOUNT_OPTIONS[o],
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

  //search+sort cho row phù hợp
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
    <BodyStyled>
      <TableBootstrapHook
        customHeader={
          <div className="header-table">
            <div>
              <span>{t('usedCarListingManagement')}</span>
            </div>
            <div>
              <a
                href="."
                onClick={(e) => {
                  e.preventDefault();
                  history.push(PATH.USED_CAR_TRADING_LIST_PATH);
                }}>
                {t('view_all')}
              </a>
            </div>
          </div>
        }
        columns={columnsArr}
        dataRangeKey="createdDate" // for data range filter
        isDateFilterReverse
        fixedColumns
        selectField="id"
        notSupportToggle
        notSupportStatistic
        notSupportPagination
        isDataRangeHidden
        searchPlaceholder={t('usedCarTrading_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getCarTrading}
        params={{}}
        isClearFilter={isClearFilter}
        buttons={[]}
      />
    </BodyStyled>
  );
};

export default connect(null, {
  getCarTrading: carTradingActions.getCarTrading
})(DashboardCarTradingManagement);
