import { EyeOutlined, MinusCircleOutlined, MoreOutlined, TrademarkOutlined } from '@ant-design/icons';
import { Button, Dropdown, Image, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { DEFAULT_AVATAR } from '~/configs/default';
import * as PATH from '~/configs/routesConfig';
import { renderItemsFind } from '~/configs/status/car-accessories/itemListUnit';
import { APPROVE_STATUS, renderItemsType } from '~/configs/status/car-accessories/itemsType';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { itemsActions } from '~/state/ducks/items';
import { ParamsType, Unit } from '~/state/ducks/items/actions';
import { unitActions } from '~/state/ducks/units';
import { Category } from '~/views/container/CarAccessories/ProductTrading/Types';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import { Card as BCard } from '~/views/presentation/ui/card/Card';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import ConfirmModal from '../Modals/ConfirmModal';

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

const ButtonStyled = styled(Button)`
  .anticon {
    position: relative !important;
    bottom: 8px !important;
  }
`;

const MenuStyled = styled(Menu)`
  background-color: #000;
  padding: 16px 8px;
  border-radius: 5px;
  width: 250px;
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
type ItemListProps = {
  getItems: (params: ParamsType) => void;
  deleteItem: any;
  getCategories: any;
  getUnits: any;
  getRoleBase: any;
  getCounties: any;
};

const ItemList: React.FC<ItemListProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState<boolean>(true);
  const [unitData, setUnitData] = useState<Unit[]>([]);
  const [confirmModalShow, setConfirmModalShow] = useState<boolean>(false);
  const [confirmData, setConfirmData] = useState<Array<{ type; id; name? }>>([]);
  const [itemsData, setItemsData] = useState<Category[]>([]);
  const location = useLocation().search;
  const [params, setParams] = useState({ sort: 'lastModifiedDate,desc' });
  // const [viewModalShow, setViewModalShow] = useState(false);
  // const [viewRequestId, setViewId] = useState(null);
  const tab = new URLSearchParams(location).get('tab');
  const location2: any = useLocation();
  const fullAccessPage = actionForPage(location2.pathname, props.getRoleBase);

  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    if (key === 'access') return !fullAccessPage;
    switch (text) {
      default:
        return false;
    }
  };

  interface Action {
    icon: JSX.Element;
    text: string;
    onClick: (row: any) => void;
    alterIcon?: any;
    alterText?: any;
    style?: any;
    key?: string;
  }

  const actions: Array<Action> = [
    {
      icon: <EyeOutlined />,
      text: t('view_customer'),
      onClick: (row) => {
        // setViewModalShow(true);
        // setViewId(row.id);
        history.push(PATH.CAR_ACCESSORIES_ITEMS_EDIT_PATH.replace(':id', row.id));
      }
    },
    // {
    //   icon: <EditOutlined />,
    //   text: t('edit_customer'),
    //   onClick: (row) => {
    //     setEditModalShow(true);
    //     setIsEditModal(true);
    //     setEditItemId(row.id);
    //   }
    // },
    {
      icon: <TrademarkOutlined />,
      text: t('trade_goods'),
      alterText: '',
      key: 'access',
      alterIcon: <TrademarkOutlined />,
      onClick: (row) => {
        history.push(`${PATH.CAR_ACCESSORIES_CREATE_PRODUCT_TRADING}?productId=${row.id}`);
      }
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('delete_goods'),
      key: 'access',
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'delete', id: row.id }]);
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
  // FOR COLUMN AND FILTER
  // ------------------------------

  let columns: any = [
    {
      dataField: 'code',
      text: t('item_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 35, 'center'),
      style: CustomFixedColumns(200, 200, 35, 'center'),
      formatter: (cell, row) => {
        return (
          <Link className="text-wrap text-start" to={PATH.CAR_ACCESSORIES_ITEMS_EDIT_PATH.replace(':id', row.id)}>
            {cell}
          </Link>
        );
      }
    },
    {
      dataField: 'name',
      text: t('item_name'),
      fixed: true,
      headerStyle: CustomFixedColumns(300, 300, 235, 'left'),
      style: CustomFixedColumns(300, 300, 235, 'left'),
      formatter: (cell, row) => {
        return (
          <Link className="text-wrap text-start" to={PATH.CAR_ACCESSORIES_ITEMS_EDIT_PATH.replace(':id', row.id)}>
            {cell}
          </Link>
        );
      }
    },
    {
      dataField: 'mainMedia',
      text: t('item_image'),
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
      formatter: (cell) => {
        if (cell) {
          let image = cell.map((item) => item.url);
          let src = !image[0]?.includes('http') ? firstImage(image[0]) : image[0] || DEFAULT_AVATAR;
          return image.includes('http') ? (
            <div className="d-flex justify-content-center">
              <Image
                preview={{
                  mask: <EyeOutlined />
                }}
                width={50}
                height={40}
                src={src}
                style={{ objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <AuthImage
                preview={{
                  mask: <EyeOutlined />
                }}
                width={50}
                isAuth={true}
                src={src}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          );
        } else return <span></span>;
      },
      csvFormatter: (cell) => {
        let image = cell.map((item) => item.url);
        return !image[0]?.includes('http') ? firstImage(image[0]) : image[0] || DEFAULT_AVATAR;
      }
    },
    {
      dataField: 'upcCode',
      text: t('barcode'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      }
    },
    {
      dataField: 'oldCode',
      text: t('old_item_id'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      }
    },
    {
      dataField: 'unitId',
      text: t('Unit'),
      sort: false,
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => row?.unit?.name && renderItemsFind(row?.unit?.name, t(row?.unit?.name), 'tag'),
      csvFormatter: (cell, row) => {
        return row?.unit?.name ? row?.unit?.name : '-';
      },
      filter: customFilter(),
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            fetchData={props.getUnits}
            valueProperty="id"
            labelProperty="name"
            searchCorrectly={false}
          />
        );
      }
    },
    {
      dataField: 'keywords',
      text: t('item_key_word'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      }
    },
    {
      dataField: 'categoryNames',
      text: t('commodity_group'),
      sort: false,
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      formatter: (cell, row) => row?.categories?.map((category) => category?.name).join(' - '),
      csvFormatter: (cell, row) => row?.categories?.map((category) => category?.name).join(' - ')
    },
    {
      dataField: 'origin',
      text: t('origin'),
      style: {
        minWidth: 120,
        textAlign: 'center'
      },
      filter: customFilter(),
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            fetchData={props.getCounties}
            valueProperty="name"
            labelProperty="name"
            searchCorrectly={false}
          />
        );
      }
    },
    {
      dataField: 'approveStatus',
      text: t('status'),
      sort: false,
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      filter: customFilter(),
      formatter: (cell, row) => {
        return <div className="w-100 status_wrap-nononono">{renderItemsType(APPROVE_STATUS[cell], t(APPROVE_STATUS[cell]), 'tag')}</div>;
      },
      csvFormatter: (cell) => {
        return cell ? t(APPROVE_STATUS[cell]) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(APPROVE_STATUS).map((o) => {
              return {
                value: o,
                search: t(APPROVE_STATUS[o]),
                label: renderItemsType(APPROVE_STATUS[o], t(APPROVE_STATUS[o]), 'tag')
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
    //     const menu = (
    //       <MenuStyled>
    //         {actions.map((action) => (
    //           <Menu.Item>
    //             <Button
    //               disabled={disableAction(row, action.text, action.key)}
    //               className="w-100 d-flex align-items-center"
    //               type="link"
    //               onClick={() => action.onClick(row)}>
    //               {row.status === 'ACTIVATED' ? (action.alterIcon ? action.alterIcon : action.icon) : action.icon} &nbsp;
    //               {row.status === 'ACTIVATED' ? (action.alterText ? action.alterText : action.text) : action.text}
    //             </AButton>
    //           </Menu.Item>
    //         ))}
    //       </MenuStyled>
    //     );

    //     return (
    //       <DropdownStyled overlay={menu} placement="bottomCenter">
    //         <ButtonStyled type="link" size="large" style={{ fontSize: '24px' }} icon={<MoreOutlined />} />
    //       </DropdownStyled>
    //     );
    //   },
    //   headerClasses: 'ht-custom-header-table pr-3',
    //   filterRenderer: (onFilter, column) => (
    //     <button
    //       className="btn btn-sm mb-1 py-2 w-100"
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
  let myColumns = columns.map((column) => {
    return {
      editable: false,
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      filter: customFilter(),
      filterRenderer: (onFilter, col) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      csvFormatter: (cell) => {
        return cell ? cell : '-';
      },
      // onSort : (field ,order) => {
      //   setParams({sort : `${column.dataField}, ${order}`})
      // },
      headerStyle: {
        textAlign: 'center',
        minWidth: 180
      },
      footerAlign: 'center',
      formatter: (cell) => cell || '-',
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  return (
    <div>
      <div className="col-12">
        <TableBootstrapHook
          actionColumn={{
            handleResetFilters: handleResetFilters,
            actions: actions || [],
            disableAction: disableAction
          }}
          supportEdit // for editable and save
          title={t('goods_items')}
          description={t('item_management_des')}
          columns={myColumns}
          dataRangeKey="" // for data range filter
          supportMultiDelete
          isDataRangeHidden={true}
          supportSelect
          fixedColumns
          // supportSearch
          selectField="id"
          searchPlaceholder={t('customer_search')}
          needLoad={needLoadNewData}
          setNeedLoad={setNeedLoadNewData}
          deleteData={props.deleteItem}
          fetchData={props.getItems}
          params={params}
          isClearFilter={isClearFilter}
          fullAccessPage={fullAccessPage}
          buttons={[
            {
              type: 'create',
              class: 'pl-0',
              icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
              text: t('new_good_item'),
              onClick: () => {
                history.push(PATH.CAR_ACCESSORIES_ITEMS_FORM_PATH);
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
      </div>

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
    getItems: itemsActions.getItems,
    deleteItem: itemsActions.deleteItem,
    getCategories: itemsActions.getCategories,
    getUnits: unitActions.getUnits,
    getCounties: itemsActions.getCounties
  }
)(ItemList);
