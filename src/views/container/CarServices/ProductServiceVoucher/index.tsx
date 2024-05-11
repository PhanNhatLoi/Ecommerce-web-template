import { CheckCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import {
  PRODUCT_SERVICE_VOUCHER_STATUS,
  renderProductServiceVoucherStatus
} from '~/configs/status/car-services/productServiceVoucherStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { serviceVoucherActions } from '~/state/ducks/carServices/voucher';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import { CustomFixedColumns } from '../../commons/customFixedColumns';
import { WrapTableStyled } from './components/Styles';
import ActionModal from './Modals/ActionModal';
import ProductServiceListModal from './Modals/ProductServiceModal';

type ProductServiceVoucherProps = {
  getServiceVoucher: any;
  getRoleBase: any;
};

const ProductServiceVoucher = (props: ProductServiceVoucherProps) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [params, setParams] = useState<any>({ sort: 'lastModifiedDate,desc' });

  const [actionModalShow, setActionModalShow] = useState(false);
  const [voucherId, setVoucherId] = useState('');
  const [currentVoucher, setCurrentVoucher] = useState<any>();

  const [productServiceModalShow, setProductServiceModalShow] = useState(false);

  // ------------------------------
  // FOR VIDEO ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    let disable = false;
    switch (text) {
      case t('approve'):
        // disable = ![MEMBER_STATUS.MEMBER_WARNING, MEMBER_STATUS.MEMBER_DANGER].includes(row.status);
        break;
      case t('reject'):
        // disable = ![MEMBER_STATUS.MEMBER_WARNING].includes(row.status);
        break;
      default:
        disable = false;
        break;
    }
    return key === 'access' && fullAccessPage ? disable : !fullAccessPage;
  };

  const actions: any = [
    // {
    //   icon: <EyeOutlined />,
    //   text: t('view'),
    //   onClick: (row: any) => {
    //     // history.push(PATH.SERVICE_PROMOTION_EDIT_PATH.replace(':id', row?.id));
    //   }
    // },
    {
      icon: <CheckCircleOutlined />,
      text: t('assignProduct'),
      key: 'access',
      onClick: (row: any) => {
        setCurrentVoucher(row);
        setActionModalShow(true);
        // history.push(PATH.GIFT_CARDS_EDIT_PATH.replace(':id', row.id));
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
      dataField: 'voucherId',
      text: t('voucherId'),
      sort: false,
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      formatter: (cell: any, row: any) => {
        return (
          <AButton
            style={{ whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'center' }}
            type="link"
            onClick={() => {
              setCurrentVoucher(row);
              setActionModalShow(true);
            }}>
            {row?.id || '-'}
          </AButton>
        );
      }
    },
    {
      dataField: 'name',
      text: t('voucherName'),
      fixed: true,
      headerStyle: CustomFixedColumns(250, 250, 185, 'left'),
      style: CustomFixedColumns(250, 250, 185, 'left'),
      formatter: (cell: any, row: any) => {
        return (
          <AButton
            style={{ whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'left' }}
            type="link"
            onClick={() => {
              setCurrentVoucher(row);
              setActionModalShow(true);
            }}>
            {cell || '-'}
          </AButton>
        );
      }
    },
    {
      dataField: 'startDate',
      text: t('start_day'),
      formatter: (cell: any) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '';
      },
      csvFormatter: (cell: any) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '';
      },
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 200, textAlign: 'center' },
      filterRenderer: (onFilter: any) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'expireDate',
      text: t('end_day'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 200, textAlign: 'center' },
      formatter: (cell: any) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '';
      },
      csvFormatter: (cell: any) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '';
      },
      filterRenderer: (onFilter: any) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'product',
      text: t('product'),
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 180, textAlign: 'center' },
      formatter: (cell: any, row: any) => {
        return row?.pricingSystemCaches ? (
          <AButton
            type="link"
            onClick={() => {
              setCurrentVoucher(row);
              setProductServiceModalShow(true);
            }}>
            {t('view_details')}
          </AButton>
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'approveStatus',
      text: t('status'),
      headerStyle: {
        textAlign: 'center',
        minWidth: 150
      },
      style: {
        textAlign: 'center',
        minWidth: 150
      },
      formatter: (cell: string) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderProductServiceVoucherStatus(cell, t(cell), 'tag')}</div>;
      },
      csvFormatter: (cell: string) => {
        return cell ? t(cell) : '-';
      },
      sort: null,
      filterRenderer: (onFilter: Boolean, column: any) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(PRODUCT_SERVICE_VOUCHER_STATUS).map((o: string) => {
              return {
                key: PRODUCT_SERVICE_VOUCHER_STATUS[o],
                value: PRODUCT_SERVICE_VOUCHER_STATUS[o],
                search: t(PRODUCT_SERVICE_VOUCHER_STATUS[o]),
                label: renderProductServiceVoucherStatus(PRODUCT_SERVICE_VOUCHER_STATUS[o], t(PRODUCT_SERVICE_VOUCHER_STATUS[o]), 'tag')
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
          actions: actions || [],
          disableAction: disableAction
        }}
        title={t('voucherManagement')}
        supportEdit // for editable and save
        columns={columnsArr}
        dataRangeKey="startDate" // for data range filter
        isDateFilterReverse
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('promotion_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getServiceVoucher}
        params={params}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'export',
            icon: <i className="fas fa-file-excel" style={{ color: '#000' }}></i>,
            text: t('export_excel'),
            t
          }
        ]}></TableBootstrapHook>

      <ActionModal
        id={voucherId}
        voucherProps={currentVoucher}
        setCurrentVoucher={setCurrentVoucher}
        modalShow={actionModalShow}
        setModalShow={setActionModalShow}
        fullAccessPage={fullAccessPage}
        setNeedLoad={setNeedLoadNewData}
      />

      <ProductServiceListModal
        voucher={currentVoucher}
        setVoucher={setCurrentVoucher}
        modalShow={productServiceModalShow}
        setModalShow={setProductServiceModalShow}
      />
    </WrapTableStyled>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getServiceVoucher: serviceVoucherActions.getServiceVoucher
  }
)(ProductServiceVoucher);
