import { EditOutlined, EyeOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import { DELIVERY_ODER_STATUS, renderDeliveryOderStatus } from '~/configs/status/car-accessories/deliveryOderStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { deliveryOrdersActions } from '~/state/ducks/carAccessories/deliveryOrders';
import { DeliveryBodyResponse, DeliveryFromResponse, DeliveryToResponse } from '~/state/ducks/carAccessories/deliveryOrders/actions';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import COLOR from '~/views/utilities/layout/color';

import ConfirmDeleteModal from '../../commons/ConfirmDeleteModal';
import ViewModal from './Modals/ViewModal';
import * as Types from './Type';

const DropdownStyled = styled(Dropdown)`
  .ant-dropdown {
    background-color: #000 !important;
    border-radius: 5px !important;
    padding: 16px 8px !important;
  }
  .ant-dropdown-arrow {
    background-color: #000 !important;
  }
`;

const ButtonStyled = styled(AButton)`
  .anticon {
    position: relative !important;
    bottom: 8px !important;
  }
`;
const SpanStyled = styled.span`
  text-align: left;
`;

const MenuStyled = styled(Menu)`
  background-color: #000;
  padding: 16px 8px;
  border-radius: 5px;
  width: 200px;
  ::before {
    content: ' ';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid black;
    position: absolute;
    top: -8px;
    right: 35%;
  }
  .ant-dropdown-menu-item {
    color: #fff;
    font-size: 12px;
  }
  .ant-dropdown-menu-item:hover {
    color: #000;
  }
`;

const OrderManagement = (props: Props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState<boolean>(true);
  const [confirmModalShow, setConfirmModalShow] = useState<boolean>(false);
  const [confirmData, setConfirmData] = useState<Types.confirmType[]>([]);
  const [viewModalShow, setViewModalShow] = useState<boolean>(false);
  const [viewEdit, setViewEdit] = useState<boolean>(false);

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryBodyResponse>();
  const [params, setParams] = useState<{
    sort?: string;
    page?: number;
  }>({
    sort: 'createdDate,desc'
  });
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR ACTIONS
  // ------------------------------

  const actions = [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: t('view_details'),
      onClick: () => {
        setViewEdit(false);
        setViewModalShow(true);
      }
    },

    {
      key: 'edit',
      icon: <EditOutlined />,
      label: t('edit'),
      disabled: !fullAccessPage,
      onClick: () => {
        setViewEdit(true);
        setViewModalShow(true);
      }
    },
    {
      key: 'delete',
      disabled: !fullAccessPage,
      icon: <MinusCircleOutlined />,
      label: t('delete'),
      onClick: () => {
        setConfirmModalShow(true);
      }
    }
  ];
  // ------------------------------
  // FOR ACTIONS
  // ------------------------------

  // ------------------------------
  // FOR COLUMN AND FILTER
  // ------------------------------
  const [isClearFilter, setIsClearFilter] = useState<boolean>(false);
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
      dataField: 'gdnNo',
      text: t('gdn_no'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 35, 'center'),
      style: CustomFixedColumns(200, 200, 35, 'center'),
      formatter: (cell: string, row: DeliveryBodyResponse) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              setDeliveryDetails(row || null);
              setViewModalShow(true);
              setViewEdit(false);
            }}>
            {cell}
          </AButton>
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'code',
      text: t('so_no'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 235, 'center'),
      style: CustomFixedColumns(200, 200, 235, 'center')
    },
    {
      dataField: 'createdDate',
      text: t('created_date'),
      formatter: (cell: Date) => {
        return cell ? <span>{UtilDate.toDateLocal(cell)}</span> : '-';
      },
      csvFormatter: (cell: Date) => {
        return cell ? UtilDate.toDateLocal(cell) : '-';
      },
      filterRenderer: (onFilter: boolean) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'deliveryFrom',
      text: t('delivery_from'),
      formatter: (cell: DeliveryFromResponse) => {
        return cell ? <span>{`${cell?.deliver} + ${cell?.code === 241 ? '84' : '  '} ${cell?.phoneNumberDeliver || ' - '}`}</span> : '-';
      },
      csvFormatter: (cell: DeliveryFromResponse) => {
        return cell ? `${cell?.deliver} + ${cell?.code === 241 ? '84' : '  '} ${cell?.phoneNumberDeliver || ' - '}` : '-';
      },
      sort: false,
      filter: '',
      filterRenderer: ''
    },
    {
      dataField: 'deliveryTo',
      text: t('delivery_to'),
      align: 'left',
      formatter: (cell: DeliveryToResponse) => {
        return cell ? (
          <SpanStyled className="text-wrap text-start">{`${cell?.customer?.fullName || ' '} - ${cell?.fullAddress || ' - '}`}</SpanStyled>
        ) : (
          '-'
        );
      },
      csvFormatter: (cell: DeliveryToResponse) => {
        return cell ? `${cell?.customer?.fullName || ' '} - ${cell?.fullAddress || ' - '}` : '-';
      },
      filter: '',
      sort: false,
      filterRenderer: ''
    },
    {
      dataField: 'date',
      text: t('delivery_date'),
      formatter: (cell: Date) => {
        return cell ? <span>{UtilDate.toDateLocal(cell)}</span> : '-';
      },
      csvFormatter: (cell: Date) => {
        return cell ? UtilDate.toDateLocal(cell) : '-';
      },
      filterRenderer: (onFilter: boolean) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'status',
      text: t('status'),
      sort: false,
      formatter: (cell: string) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderDeliveryOderStatus(cell, t(cell), 'tag')}</div>;
      },
      csvFormatter: (cell: string) => {
        return cell ? t(cell) : '-';
      },
      filterRenderer: (onFilter: boolean, column: Types.columnType) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(DELIVERY_ODER_STATUS).map((o: string) => {
              return {
                key: DELIVERY_ODER_STATUS[o],
                value: DELIVERY_ODER_STATUS[o],
                search: t(DELIVERY_ODER_STATUS[o]),
                label: renderDeliveryOderStatus(DELIVERY_ODER_STATUS[o], t(DELIVERY_ODER_STATUS[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'note',
      text: t('note'),
      style: {
        minWidth: 230,
        textAlign: 'center'
      }
    },
    {
      dataField: 'action',
      text: t('actions'),
      sort: false,
      style: {
        minWidth: 130,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 130,
        textAlign: 'center'
      },
      csvExport: false,
      headerFormatter: ColumnFormat,
      formatter: (cell: null, row: DeliveryBodyResponse) => {
        const menu = <MenuStyled items={actions} />;
        return (
          <DropdownStyled overlay={menu} placement="bottom" trigger={['click']}>
            <ButtonStyled
              onClick={() => {
                setDeliveryDetails(row || null);
                setConfirmData([{ type: 'delete', id: row.id }]);
              }}
              type="link"
              size="large"
              style={{ fontSize: '24px' }}
              icon={<SVG src={toAbsoluteUrl('/media/svg/icons/Tools/More.svg')} />}
            />
          </DropdownStyled>
        );
      },
      classes: 'text-center pr-0',
      headerClasses: 'ht-custom-header-table pr-3',
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
  const afterColumns = columns.map((column) => {
    return {
      headerStyle: {
        minWidth: 170,
        textAlign: 'center'
      },
      editable: false,
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
      filter: customFilter(),
      filterRenderer: (onFilter: boolean) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      csvFormatter: (cell: string) => {
        return cell ? cell : '-';
      },
      formatter: (cell: string) => {
        return cell ? <span>{cell}</span> : '-';
      },
      style: {
        minWidth: 180,
        textAlign: 'center'
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
        isDateFilterReverse
        title={t('delivery_order')}
        columns={afterColumns}
        dataRangeKey="createdDate" // for data range filter
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('delivery_order_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getDeliveryOrders}
        params={params}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('new_delivery_order'),
            onClick: () => {
              history.push(PATH.CAR_ACCESSORIES_DELIVERY_ODER_NEW_PATH);
            }
          },
          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
            onClick: (selectedData) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data: DeliveryBodyResponse) => {
                  return { type: 'delete', id: data.id };
                })
              );
            }
          },
          {
            type: 'export',
            icon: <i className="fas fa-file-excel" style={{ color: '#000' }}></i>,
            text: t('export_excel'),
            t
          }
        ]}></TableBootstrapHook>

      {/* MODALS */}

      <ViewModal //
        fullAccessPage={fullAccessPage}
        data={deliveryDetails}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
        isEditing={viewEdit}
        setViewEdit={setViewEdit}
      />

      <ConfirmDeleteModal
        text="deliveryOrder"
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
        action={props.deleteDeliveries}
      />
      {/* MODALS */}
    </div>
  );
};

type Props = {
  getDeliveryOrders: any;
  deleteDeliveries: any;
  getRoleBase: any;
};
export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getDeliveryOrders: deliveryOrdersActions.getDeliveryOrders,
    deleteDeliveries: deliveryOrdersActions.deleteDeliveryOrder
  }
)(OrderManagement);
