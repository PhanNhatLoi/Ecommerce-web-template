import { EyeOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useLocation } from 'react-use';
import { API_URL } from '~/configs';
import { DEFAULT_AVATAR } from '~/configs/default';
import { FILTER_AMOUNT_OPTIONS, FILTER_CAR_PRICE_OPTIONS } from '~/configs/rangeNumberFilter';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { usedCarTradingCustomerActions } from '~/state/ducks/usedCarTrading/customer';
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
import { vehicleInfoResponseType } from '../../Types';

type CarPurchasedTableProps = {
  getListCarTradingBuyByCustomer: any;
  getRoleBase: any;
  customerId?: number;
};

const CarPurchasedTable: React.FC<CarPurchasedTableProps> = (props) => {
  const { t }: any = useTranslation();
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);
  const { customerId } = props;
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [params, setParams] = useState<any>({});

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
      headerStyle: CustomFixedColumns(180, 180, 35, 'center'),
      style: CustomFixedColumns(180, 180, 35, 'center'),
      formatter: (cell: string, row: any) => {
        return cell || '-';
      }
    },
    {
      dataField: 'carTrading.title',
      text: t('Title'),
      fixed: true,
      headerStyle: CustomFixedColumns(300, 300, 215, 'left'),
      style: CustomFixedColumns(300, 300, 215, 'left'),
      formatter: (cell: string, row: any) => {
        return cell || '-';
      }
    },
    {
      dataField: 'carTrading.vehicleInfo',
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
      text: t('saleDate'),
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
      }
    },
    {
      dataField: 'carTrading.price',
      text: t('price'),
      style: {
        textAlign: 'center',
        minWidth: 200
      },
      headerStyle: { textAlign: 'center', minWidth: 200 },

      formatter: (cell) => {
        return numberFormatDecimal(+cell || 0, ' đ', '');
      },
      csvFormatter: (cell) => {
        return numberFormatDecimal(+cell || 0, '', '');
      }
    },
    {
      dataField: 'transferred',
      text: t('contract_procedures_change_ownership'),
      sort: false,
      style: {
        minWidth: 220,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 220,
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return cell ? t('YES') : t('NO');
      }
    }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------
  const columnsArr = columns.map((column) => {
    return {
      editable: false,
      sort: false,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
      filter: '',
      filterRenderer: '',
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
    <TableBootstrapHook
      title={t('listPurchasedCars')}
      supportEdit // for editable and save
      columns={columnsArr}
      dataRangeKey="createdDate" // for data range filter
      isDateFilterReverse
      supportMultiDelete
      supportSelect
      fixedColumns
      selectField="id"
      searchPlaceholder={t('promotion_search')}
      needLoad={needLoadNewData}
      setNeedLoad={setNeedLoadNewData}
      fetchData={props.getListCarTradingBuyByCustomer}
      params={params}
      paramsIdApi={customerId}
      isClearFilter={isClearFilter}
      fullAccessPage={fullAccessPage}
      buttons={[]}></TableBootstrapHook>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getListCarTradingBuyByCustomer: usedCarTradingCustomerActions.getListCarTradingBuyByCustomer
  }
)(CarPurchasedTable);
