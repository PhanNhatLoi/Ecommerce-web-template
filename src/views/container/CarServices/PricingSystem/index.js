import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, EyeOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { DEFAULT_AVATAR } from '~/configs/default';
import { FILTER_AMOUNT_OPTIONS } from '~/configs/rangeNumberFilter';
import { PRICING_SYSTEM_STATUS, renderPricingSystemStatus } from '~/configs/status/car-services/pricingSystemStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { pricingSystemActions } from '~/state/ducks/mechanic/pricingSystem';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { API_URL } from '~/configs';

import AddModal from './Modals/AddModal';
import ConfirmModal from './Modals/ConfirmModal';
import EditModal from './Modals/EditModal';
import ViewModal from './Modals/ViewModal';

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

const PricingSystem = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [addModalShow, setAddModalShow] = useState(false);

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);

  const [viewModalShow, setViewModalShow] = useState(false);
  const [viewRequestId, setViewId] = useState(null);

  const [editModalShow, setEditModalShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const location = useLocation();
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

  const actions = [
    {
      icon: <CheckCircleOutlined />,
      alterIcon: <CloseCircleOutlined />,
      key: 'access',
      text: t('activate'),
      alterText: t('deactivate'),
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: row.status === 'ACTIVATED' ? 'deactivate' : 'activate', id: row.id, fullName: row.name }]);
      }
    },
    {
      icon: <EyeOutlined />,
      text: t('view_details'),
      onClick: (row) => {
        setViewModalShow(true);
        setViewId(row.id);
      }
    },
    {
      icon: <EditOutlined />,
      text: t('edit'),
      key: 'access',
      onClick: (row) => {
        setEditModalShow(true);
        setEditId(row.id);
      }
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('delete_product/service'),
      key: 'access',
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'delete', id: row.id, fullName: row.name }]);
      }
    }
  ];
  // ------------------------------
  // FOR ACTIONS
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

  let columns = [
    {
      dataField: 'productId',
      text: t('product_service_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(220, 220, 35, 'center'),
      style: CustomFixedColumns(220, 220, 35, 'center'),
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setViewId(row.id);
            }}>
            {row?.id || '-'}
          </AButton>
        );
      },
      csvFormatter: (cell, row) => row?.id || '-'
    },
    {
      dataField: 'productName',
      text: t('product/service'),
      fixed: true,
      headerStyle: CustomFixedColumns(300, 300, 255, 'left'),
      style: CustomFixedColumns(300, 300, 255, 'left'),
      formatter: (cell, row) => {
        return (
          <AButton
            style={{ whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'left' }}
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setViewId(row.id);
            }}>
            {row?.name || '-'}
          </AButton>
        );
      },
      csvFormatter: (cell, row) => row?.name || '-'
    },
    {
      dataField: 'image',
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
      formatter: (cell) => {
        if (cell) {
          let src = !cell.includes('http') ? firstImage(cell) : cell || DEFAULT_AVATAR;
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
        } else return <span>-</span>;
      },
      csvFormatter: (cell) => {
        return cell ? firstImage(cell) : API_URL + DEFAULT_AVATAR;
      }
    },
    {
      dataField: 'price',
      text: t('originalPrice'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return cell ? numberFormatDecimal(+cell, ' đ', '') : '0 đ';
      },
      csvFormatter: (cell) => {
        return cell ? numberFormatDecimal(+cell, '', '') : '0';
      },
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
      }
    },
    {
      dataField: 'salePrice',
      text: t('sale_price'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return cell ? numberFormatDecimal(+cell, ' đ', '') : '0 đ';
      },
      csvFormatter: (cell) => {
        return cell ? numberFormatDecimal(+cell, '', '') : '0';
      },
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
      }
    },
    {
      dataField: 'createdDate',
      text: t('created_at'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateLocal(cell)}</span>;
      },
      csvFormatter: (cell, row) => {
        return UtilDate.toDateLocal(cell);
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'lastModifiedDate',
      text: t('updated_at'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{cell ? UtilDate.toDateLocal(cell) : '-'}</span>;
      },
      csvFormatter: (cell, row) => {
        return cell ? UtilDate.toDateLocal(cell) : '-';
      },
      filterRenderer: (onFilter, column) => {
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
        return <div className="w-100 status_wrap-nononono">{cell && renderPricingSystemStatus(cell, t(cell), 'tag')}</div>;
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
            options={Object.keys(PRICING_SYSTEM_STATUS).map((o) => {
              return {
                value: PRICING_SYSTEM_STATUS[o],
                search: t(PRICING_SYSTEM_STATUS[o]),
                label: renderPricingSystemStatus(PRICING_SYSTEM_STATUS[o], t(PRICING_SYSTEM_STATUS[o]), 'tag')
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
    //   headerFormatter: ColumnFormat,
    //   formatter: (cell, row, rowIndex) => {
    //     const menu = (
    //       <MenuStyled>
    //         {actions.map((action) => (
    //           <Menu.Item>
    //             <AButton
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
    //       <DropdownStyled overlay={menu} placement="bottomCenter" trigger="click">
    //         <ButtonStyled type="link" size="large" style={{ fontSize: '24px' }} icon={<MoreOutlined />} />
    //       </DropdownStyled>
    //     );
    //   },
    //   classes: 'text-center pr-0',
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
  columns = columns.map((column) => {
    return {
      editable: false,
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
      style: {
        minWidth: 148,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 170
      },
      filter: customFilter(),
      filterRenderer: (onFilter, col) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      csvFormatter: (cell) => cell || '-',
      align: column.align,
      headerAlign: column.align,
      footerAlign: column.align,
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
        actionColumn={{
          handleResetFilters: handleResetFilters,
          actions: actions || [],
          disableAction: disableAction
        }}
        supportEdit // for editable and save
        isDateFilterReverse
        isNumberRangeReverse
        title={t('pricing_system')}
        description={t('pricing_system_des')}
        columns={columns}
        dataRangeKey="createdDate" // for data range filter
        supportMultiDelete
        getStatistic={props.getPricingProductStatistic} // for statistic API
        statisticProps={{
          // for statistic API params
          name: 'Product/service',
          key: 'status',
          order: ['countAll', 'activatedStatus', 'deactivatedStatus'],
          valueSet: {
            // to map params with each filter button
            countAll: undefined,
            activatedStatus: 'ACTIVATED',
            deactivatedStatus: 'DEACTIVATED'
          }
        }}
        supportSelect
        supportSearch
        fixedColumns
        // selectField={'profileId'}
        searchPlaceholder={t('request_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        deleteData={props.deleteMechanic}
        fetchData={props.getPricingProducts}
        params={{ sort: 'lastModifiedDate,desc' }}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('create_a_new_product/service'),
            onClick: () => {
              setAddModalShow(true);
            }
          },
          // TODO: ENHANCE LATER
          // {
          //   type: 'extra',
          //   text: t('import'),
          //   icon: <i className="fas fa-download" style={{ color: '#000' }}></i>,
          //   onClick: () => {}
          // },
          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
            onClick: (selectedData) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data) => {
                  return { type: 'delete', id: data.id, fullName: data.name };
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
      <AddModal //
        modalShow={addModalShow}
        setModalShow={setAddModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <ConfirmModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <ViewModal //
        id={viewRequestId}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <EditModal //
        id={editId}
        modalShow={editModalShow}
        setModalShow={setEditModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      {/* MODALS */}
    </div>
  );
};

export default connect(
  (state) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getPricingProducts: pricingSystemActions.getPricingProducts,
    getPricingProductStatistic: pricingSystemActions.getPricingProductStatistic
  }
)(PricingSystem);
