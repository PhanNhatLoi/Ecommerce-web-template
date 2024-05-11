import { EditOutlined, EyeOutlined, MinusCircleOutlined, SendOutlined, StopOutlined } from '@ant-design/icons';
import { Dropdown, Image, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { DEFAULT_AVATAR } from '~/configs/default';
import { FILTER_AMOUNT_OPTIONS } from '~/configs/rangeNumberFilter';
import * as ROUTES from '~/configs/routesConfig';
import {
  renderTradingProductApproveStatus,
  renderTradingProductStatus,
  TRADING_PRODUCT_APPROVAL_STATUS,
  TRADING_PRODUCT_STATUS,
  TRADING_PRODUCT_STATUS_RESPONSE
} from '~/configs/status/car-accessories/tradingProductStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { tradingProductActions } from '~/state/ducks/carAccessories/ProductTrading';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import COLOR from '~/views/utilities/layout/color';

import ConfirmModal from './Modals/ConfirmModal';
import ViewModal from './Modals/ViewModal';
import { ActionListType, ActionType, Media, Product } from './Types';
import { API_URL } from '~/configs';

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
  .ant-dropdown-menu-item button {
    color: #fff;
  }
  .ant-dropdown-menu-item button:hover {
    color: #000;
  }
`;

const ButtonLinkStyled: any = styled(AButton)`
  color: ${(props: any) => props.color};
  :hover {
    color: ${(props: any) => props.colorHover};
  }
  :focus {
    color: ${(props: any) => props.color};
  }
`;

interface ProductTradingProps {
  getTradingProductList: any;
  deleteTradingProductList: any;
  postForSaleTradingProduct: any;
  stopSellingTradingProduct: any;
  getRoleBase: any;
}

const ProductTrading: React.FC<ProductTradingProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();

  const [params, setParams] = useState({ sort: 'createdDate,desc' });
  const [needLoadNewData, setNeedLoadNewData] = useState<Boolean>(true);

  const [dataView, setDataView] = useState<Product>();
  const [viewModalShow, setViewModalShow] = useState<Boolean>(false);

  const [confirmModalShow, setConfirmModalShow] = useState<Boolean>(false);
  const [confirmData, setConfirmData] = useState<Array<{ type: String; id: String }>>([]);
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    if (key === 'access') return !fullAccessPage;
    switch (text) {
      default:
        return false;
    }
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

  // tất cả các action có thể có
  const actionList: ActionListType = {
    viewAction: {
      icon: <EyeOutlined />,
      stt: 'show',
      text: t('view'),
      onClick: (row: Product) => {
        setViewModalShow(true);
        setDataView(row);
      }
    },
    deleteAction: {
      icon: <MinusCircleOutlined />,
      text: t('delete_goods'),
      stt: 'show',
      key: 'access',
      onClick: (row: Product) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'delete', id: row.id }]);
      }
    },
    editAction: {
      icon: <EditOutlined />,
      text: t('edit'),
      key: 'access',
      onClick: (row: Product) => {
        history.push(`${ROUTES.CAR_ACCESSORIES_UPDATE_PRODUCT_TRADING}?id=${row.id}`);
      }
    },
    stopAction: {
      icon: <StopOutlined />,
      text: t('stop_selling'),
      key: 'access',
      onClick: (row: Product) => {
        stopSelling(row.id);
      }
    },
    sendAction: {
      icon: <SendOutlined />,
      text: t('post_for_sell'),
      key: 'access',
      onClick: (row: Product) => {
        postForSale(row.id);
      }
    }
  };

  // action mặc định cho tất cả trading product
  const actionsDefault: Array<ActionType> = [actionList.viewAction, actionList.deleteAction];

  function postForSale(id: any) {
    props
      .postForSaleTradingProduct(id)
      .then(() => {
        setNeedLoadNewData(true);
        AMessage.success(t('post_for_sale_success'));
      })
      .catch((err: any) => {
        console.error('🚀 ~ file: index.tsx ~ line 170 ~Update status failed ~ err', err);
        AMessage.error(t('post_for_sale_failed'));
      });
  }

  function stopSelling(id: any) {
    props
      .stopSellingTradingProduct(id)
      .then(() => {
        setNeedLoadNewData(true);
        AMessage.success(t('stop_selling_success'));
      })
      .catch((err: any) => {
        console.error('🚀 ~ file: index.tsx ~ line 170 ~Update status failed ~ err', err);
        AMessage.error(t('stop_selling_failed'));
      });
  }

  function getActionsByStatus(status: String, approveStatus: String): Array<ActionType> {
    const res = TRADING_PRODUCT_STATUS_RESPONSE;
    if (status === res.BLOCKED) return [];

    let action: Array<ActionType> = [actionList.editAction];

    const canStopSale = status === res.ACTIVATED && (approveStatus === res.WAITING_FOR_APPROVAL || approveStatus === res.APPROVED);
    const canPostSale = status === res.DEACTIVATED;

    action = canStopSale ? [...action, actionList.stopAction] : canPostSale ? [...action, actionList.sendAction] : [];

    return action;
  }

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

  const ButtonLinkComponent = (cell, row, style) => {
    const color = {
      color: row?.stockQuantity <= row?.lowStockThreshold ? '#dc3545' : '#3699FF',
      colorHover: row?.stockQuantity <= row?.lowStockThreshold ? '#b02a37' : '#0073e9'
    };
    return (
      <ButtonLinkStyled
        type="link"
        color={color.color}
        colorHover={color.colorHover}
        style={style}
        onClick={() => {
          setViewModalShow(true);
          setDataView(row);
        }}>
        {cell || '-'}
      </ButtonLinkStyled>
    );
  };

  let columns: any = [
    {
      dataField: 'media',
      text: t('images'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      filter: '',
      filterRenderer: '',
      sort: false,
      formatter: (cell: Array<Media>) => {
        if (cell && cell.length > 0) {
          let img = cell.filter((item: Media) => item.type === 'IMAGE')[0].url;
          if (img) {
            let src: string = (!img.includes('http') ? firstImage(img) : img || DEFAULT_AVATAR) as string;
            return img.includes('http') ? (
              <Image
                preview={{
                  mask: <EyeOutlined />
                }}
                width={50}
                src={src}
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <AuthImage
                preview={{
                  mask: <EyeOutlined />
                }}
                width={50}
                isAuth={true}
                src={src}
                // onClick={(e) => e.stopPropagation()}
              />
            );
          } else return <span></span>;
        } else return <span></span>;
      },
      csvFormatter: (cell) => {
        let img = cell.filter((item: Media) => item.type === 'IMAGE')[0].url;
        return cell && cell.length > 0 ? firstImage(img) : API_URL + DEFAULT_AVATAR;
      }
    },
    {
      dataField: 'itemCode',
      text: t('item_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(180, 180, 185, 'center'),
      style: CustomFixedColumns(180, 180, 185, 'center'),
      onSort: (field, order) => {
        setParams({ sort: `id,${order}` });
      },
      formatter: (cell: String, row: Product) => ButtonLinkComponent(cell, row, {}),
      csvFormatter: (cell: String) => cell
    },

    {
      dataField: 'name',
      text: t('item_name'),
      style: {
        textAlign: 'left',
        minWidth: 250
      },
      headerStyle: { textAlign: 'left', minWidth: 250 },
      onSort: (field, order) => {
        setParams({ sort: `name,${order}` });
      },
      formatter: (cell: String, row: Product) =>
        ButtonLinkComponent(cell, row, { whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'left' }),
      csvFormatter: (cell: String) => cell
    },
    {
      dataField: 'price',
      text: t('cost'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 200
      },
      headerStyle: { textAlign: 'center' },
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
        return cell ? numberFormatDecimal(+cell, ' đ', '') : t('Not_yet_set_up');
      },
      csvFormatter: (cell) => {
        return cell ? numberFormatDecimal(+cell, '', '') : '-';
      }
    },
    {
      dataField: 'quantityMin',
      text: t('min_value'),
      style: {
        textAlign: 'center',
        minWidth: 180
      },
      headerStyle: { textAlign: 'center', minWidth: 180 },
      formatter: (cell, row) => {
        return cell ? cell : t('Not_yet_set_up');
      },
      csvFormatter: (cell, row) => {
        return cell ? numberFormatDecimal(+cell, '', '') : '-';
      }
    },
    {
      dataField: 'stockQuantity',
      text: t('Stock_title'),
      style: {
        textAlign: 'center',
        minWidth: 180
      },
      headerStyle: { textAlign: 'center', minWidth: 180 },
      formatter: (cell, row) => {
        return numberFormatDecimal(+cell || 0, '', '');
      },
      csvFormatter: (cell, row) => {
        return numberFormatDecimal(+cell || 0, '', '');
      }
    },
    {
      dataField: 'prices',
      text: t('cost_qty'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 200
      },
      headerStyle: { textAlign: 'center' },
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
      formatter: (cell, row) => {
        const text = cell?.map((item) => {
          return <p>{`(${item?.fromValue} - ${item?.toValue}) ` + numberFormatDecimal(+item?.price, 'đ', '')}</p>;
        });

        return cell.length > 0 ? <div>{text}</div> : t('Not_yet_set_up');
      },
      csvFormatter: (cell, row) => {
        const text = cell?.map((item) => {
          return `(${item?.fromValue} - ${item?.toValue}) ` + numberFormatDecimal(+item?.price, 'đ', '');
        });

        return cell.length > 0 ? text : '-';
      }
    },

    {
      dataField: 'approveStatus',
      text: t('status_approve'),
      sort: false,
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      headerStyle: { textAlign: 'center', minWidth: 200 },
      formatter: (cell, row) => {
        const stt = TRADING_PRODUCT_APPROVAL_STATUS[cell];
        return <div className="w-100 status_wrap-nononono">{stt && renderTradingProductApproveStatus(stt, t(stt), 'tag')}</div>;
      },
      csvFormatter: (cell, row) => {
        const stt = TRADING_PRODUCT_APPROVAL_STATUS[cell];
        return stt ? t(stt) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(TRADING_PRODUCT_APPROVAL_STATUS).map((o) => {
              return {
                value: o,
                search: TRADING_PRODUCT_APPROVAL_STATUS[o],
                label: renderTradingProductApproveStatus(TRADING_PRODUCT_APPROVAL_STATUS[o], t(TRADING_PRODUCT_APPROVAL_STATUS[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'status',
      text: t('status_product'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      headerStyle: { textAlign: 'center', minWidth: 200 },
      sort: false,
      formatter: (cell, row) => {
        return (
          <div className="w-100 status_wrap-nononono">
            {TRADING_PRODUCT_STATUS[cell] &&
              renderTradingProductStatus(TRADING_PRODUCT_STATUS[cell], t(TRADING_PRODUCT_STATUS[cell]), 'tag')}
          </div>
        );
      },
      csvFormatter: (cell, row) => {
        return TRADING_PRODUCT_STATUS[cell] ? t(TRADING_PRODUCT_STATUS[cell]) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(TRADING_PRODUCT_STATUS).map((o) => {
              return {
                value: o,
                search: TRADING_PRODUCT_STATUS[o],
                label: renderTradingProductStatus(TRADING_PRODUCT_STATUS[o], t(TRADING_PRODUCT_STATUS[o]), 'tag')
              };
            })}
          />
        );
      }
    },
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
    //   formatter: (cell, row, rowIndex) => {
    //     const actionsByStatus = getActionsByStatus(row.status, row.approveStatus);
    //     const menu = (
    //       <MenuStyled>
    //         {[...actionsDefault, ...actionsByStatus].map((action) => {
    //           return (
    //             <Menu.Item>
    //               <Button
    //                 disabled={disableAction(row, action.text, action.key)}
    //                 className="w-100 d-flex align-items-center"
    //                 type="link"
    //                 onClick={() => action.onClick(row)}>
    //                 {action.icon} &nbsp;
    //                 {action.text}
    //               </AButton>
    //             </Menu.Item>
    //           );
    //         })}
    //       </MenuStyled>
    //     );

    //     return (
    //       <DropdownStyled overlay={menu} placement="bottomCenter" trigger={['click']}>
    //         <ButtonStyled type="link" size="large" style={{ fontSize: '24px' }} icon={<MoreOutlined />} />
    //       </DropdownStyled>
    //     );
    //   },
    //   classes: 'text-center pr-0',
    //   headerClasses: 'ht-custom-header-table text-center pr-3',
    //   filterRenderer: (onFilter, column) => (
    //     <button
    //       className="btn btn-sm mb-1 py-2 w-100"
    //       onClick={handleResetFilters}
    //       style={{ background: '#000', color: '#fff', position: 'relative', top: '2px' }}>
    //       {t('clear_filter')}
    //     </button>
    //   )
    // },
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
      formatter: (cell, row, rowIndex) => {
        const actionsByStatus = getActionsByStatus(row.status, row.approveStatus);
        const menu = (
          <MenuStyled>
            {[...actionsDefault, ...actionsByStatus].map((action) => {
              return (
                <Menu.Item>
                  <AButton
                    disabled={disableAction(row, action.text, action.key)}
                    className="w-100 d-flex align-items-center"
                    type="link"
                    onClick={() => action.onClick(row)}>
                    {action.icon} &nbsp;
                    {action.text}
                  </AButton>
                </Menu.Item>
              );
            })}
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

  columns = columns.map((column) => {
    return {
      editable: false,
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
      filter: customFilter(),
      filterRenderer: (onFilter, col) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      csvFormatter: (cell) => {
        return cell ? cell : '-';
      },
      formatter: (cell) => cell || '-',
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
        isNumberRangeReverse
        supportEdit // for editable and save
        title={t('list_product_trading')}
        description={t('product_trading_des')}
        columns={columns}
        dataRangeKey="createdDate" // for data range filter
        supportMultiDelete
        deleteData={props.deleteTradingProductList}
        supportSelect
        fixedColumns
        isDataRangeHidden={true}
        supportSearch
        selectField="id"
        searchPlaceholder={t('search_product_title')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getTradingProductList}
        params={params}
        fullAccessPage={fullAccessPage}
        isClearFilter={isClearFilter}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('Create_product_trading'),
            onClick: () => {
              history.push(ROUTES.CAR_ACCESSORIES_CREATE_PRODUCT_TRADING);
            }
          },

          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
            onClick: (selectedData) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data) => {
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
        data={dataView}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <ConfirmModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      {/* MODALS */}
    </div>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getTradingProductList: tradingProductActions.getTradingProductList,
    deleteTradingProductList: tradingProductActions.deleteTradingProductList,
    postForSaleTradingProduct: tradingProductActions.postForSaleTradingProduct,
    stopSellingTradingProduct: tradingProductActions.stopSellingTradingProduct
  }
)(ProductTrading);
