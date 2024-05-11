import { EyeOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { FILTER_AMOUNT_OPTIONS } from '~/configs/rangeNumberFilter';
import { ORDER_STATUS, renderOrderStatus } from '~/configs/status/car-services/orderStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { mechanicActions } from '~/state/ducks/mechanic';
import { orderActions } from '~/state/ducks/order';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import InputNumberFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputNumberFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

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

const OrderManagement = (props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [needLoadNewData, setNeedLoadNewData] = useState(true);

  const [viewModalShow, setViewModalShow] = useState(false);

  const [viewOrderId, setViewOrderId] = useState(null);

  const location = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    switch (text) {
      default:
        return false;
    }
  };

  const actions = [
    {
      icon: <EyeOutlined />,
      text: t('view_order'),
      onClick: (row) => {
        setViewModalShow(true);
        setViewOrderId(row.repairId);
      }
    }
    // ENHANCE LATER
    // {
    //   icon: <NodeExpandOutlined />,
    //   text: t('process_order'),
    //   onClick: (row) => {
    //     // setConfirmModalShow(true);
    //     // setConfirmData([{ type: 'delete', id: row.profileId, fullName: row.fullName }]);
    //   }
    // }
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
      dataField: 'repairId',
      text: t('order_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewOrderId(row.repairId);
              setViewModalShow(true);
            }}>
            {cell}
          </AButton>
        );
      },
      filterRenderer: (onFilter, col) => {
        return <InputNumberFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + col.text} />;
      }
    },
    {
      dataField: 'requesterId',
      text: t('request_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 185, 'center'),
      style: CustomFixedColumns(150, 150, 185, 'center')
    },
    {
      dataField: 'totalPrice',
      text: t('amount'),
      style: {
        minWidth: 170,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return cell ? numberFormatDecimal(+cell, ' đ', '') : '-';
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
      dataField: 'requesterName',
      text: t('customer'),
      sort: false,
      style: {
        textAlign: 'left',
        minWidth: 100
      }
    },
    {
      dataField: 'createdDate',
      text: t('created_date'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 100
      },
      formatter: (cell, row) => {
        return cell ? UtilDate.toDateLocal(cell) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'lastModifiedDate',
      text: t('updated_date'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 100
      },
      formatter: (cell, row) => {
        return cell ? UtilDate.toDateLocal(cell) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'uiStatus',
      text: t('status'),
      sort: false,
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderOrderStatus(cell, t(cell), 'tag')}</div>;
      },
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(ORDER_STATUS).map((o) => {
              return {
                value: ORDER_STATUS[o],
                search: t(ORDER_STATUS[o]),
                label: renderOrderStatus(ORDER_STATUS[o], t(ORDER_STATUS[o]), 'tag')
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
    //   csvText: ``,
    //   csvFormatter: () => ``,
    //   headerFormatter: ColumnFormat,
    //   formatter: (cell, row, rowIndex) => {
    //     const menu = (
    //       <MenuStyled>
    //         {actions.map((action) => (
    //           <Menu.Item>
    //             <Button
    //               disabled={disableAction(row, action.text)}
    //               className="w-100 d-flex align-items-center"
    //               type="link"
    //               onClick={() => action.onClick(row)}>
    //               {row.status === 'ACTIVE' ? (action.alterIcon ? action.alterIcon : action.icon) : action.icon} &nbsp;
    //               {row.status === 'ACTIVE' ? (action.alterText ? action.alterText : action.text) : action.text}
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
        title={t('order_management')}
        description={t('order_management_des')}
        columns={columns}
        dataRangeKey="createdDate" // for data range filter
        supportMultiDelete
        getStatistic={props.getOrderStatistic} // for statistic API
        statisticProps={{
          // for statistic API params
          name: '',
          key: 'uiStatus',
          valueSet: {
            // to map params with each filter button
            totalOrders: 'ALL',
            newOrders: 'NEW',
            processingOrders: 'PROCESSING',
            comepletedOrders: 'COMPLETED',
            cancelOrders: 'CANCELED'
          }
        }}
        supportSelect
        supportSearch
        fixedColumns
        selectField="repairId"
        searchPlaceholder={t('order_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        deleteData={props.deleteMechanic}
        fetchData={props.getOrders}
        params={{ sort: 'lastModifiedDate,desc' }}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={
          [
            // ENHANCE AFTER CREATE ORDER IS ADDED
            // {
            //   type: 'hasData',
            //   text: t('process_order'),
            //   icon: <i className="fas fa-arrow-right" style={{ color: '#000' }}></i>,
            //   onClick: (selectedData) => {}
            // },
            // {
            //   type: 'export',
            //   icon: <i className="fas fa-file-excel" style={{ color: '#000' }}></i>,
            //   text: t('export_excel'),
            //   t
            // }
          ]
        }></TableBootstrapHook>

      {/* MODALS */}
      <ViewModal //
        id={viewOrderId}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
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
    getOrders: orderActions.getOrders,
    getOrderStatistic: orderActions.getOrderStatistic,
    deleteMechanic: mechanicActions.deleteMechanic
  }
)(OrderManagement);
