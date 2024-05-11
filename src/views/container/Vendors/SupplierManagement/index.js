import { EditOutlined, EyeOutlined, MinusCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { renderSupplierStatus, SUPPLIER_STATUS } from '~/configs/status/vendors/supplierStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { supplierActions } from '~/state/ducks/vendors/supplier';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

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

const SupplierManagement = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [addModalShow, setAddModalShow] = useState(false);

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);

  const [viewModalShow, setViewModalShow] = useState(false);
  const [viewId, setViewId] = useState(null);

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
      icon: <EyeOutlined />,
      text: t('view_supplier'),
      onClick: (row) => {
        setViewModalShow(true);
        setViewId(row.id);
      }
    },
    {
      icon: <EditOutlined />,
      text: t('edit_supplier'),
      key: 'access',
      onClick: (row) => {
        setEditModalShow(true);
        setEditId(row.id);
      }
    },
    {
      icon: <StopOutlined />,
      text: t('block_supplier'),
      key: 'access',
      alterText: t('unblock_supplier'),
      onClick: (row) => {
        if (row.status === SUPPLIER_STATUS.BLOCKED) {
          setConfirmModalShow(true);
          setConfirmData([{ type: 'unblock', id: row.id, fullName: row.name }]);
        } else {
          setConfirmModalShow(true);
          setConfirmData([{ type: 'block', id: row.id, fullName: row.name }]);
        }
      }
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('delete_supplier'),
      key: 'access',
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'delete', id: row.id, code: row.code }]);
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
      dataField: 'id',
      text: t('supplier_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setViewId(row.id);
            }}>
            {cell}
          </AButton>
        );
      }
    },
    {
      dataField: 'name',
      text: t('supplier_name'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 185, 'center'),
      style: CustomFixedColumns(200, 200, 185, 'center'),
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setViewId(row.id);
            }}>
            {cell}
          </AButton>
        );
      }
    },
    {
      dataField: 'phone',
      text: t('phone_number'),
      style: {
        minWidth: 170,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return (
          <span>{cell ? formatPhoneWithCountryCode(cell, cell?.startsWith('84') ? 'VN' : cell?.startsWith('1') ? 'US' : 'VN') : '-'}</span>
        );
      },
      csvFormatter: (cell, row) => {
        return cell ? formatPhoneWithCountryCode(cell, cell?.startsWith('84') ? 'VN' : cell?.startsWith('1') ? 'US' : 'VN') : '-';
      }
    },
    {
      dataField: 'email',
      text: t('email_address'),
      style: {
        minWidth: 200
      },
      formatter: (cell, row) => {
        return cell ? (
          <AButton type="link" onClick={() => {}}>
            {cell}
          </AButton>
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'fullAddress',
      text: t('address'),
      sort: false,
      style: {
        minWidth: 250,
        textAlign: 'center'
      },
      filter: '',
      filterRenderer: '',
      formatter: (cell) => <span>{cell || '-'}</span>
    },
    {
      dataField: 'createdDate',
      text: t('created_date'),
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
      dataField: 'lastModifiedDate',
      text: t('updated_date'),
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
        return <div className="w-100 status_wrap-nononono">{cell && renderSupplierStatus(cell, t(cell), 'tag')}</div>;
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
            options={Object.keys(SUPPLIER_STATUS).map((o) => {
              return {
                value: SUPPLIER_STATUS[o],
                search: t(SUPPLIER_STATUS[o]),
                label: renderSupplierStatus(SUPPLIER_STATUS[o], t(SUPPLIER_STATUS[o]), 'tag')
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
    //             <Button
    //               disabled={disableAction(row, action.text, action.key)}
    //               className="w-100 d-flex align-items-center"
    //               type="link"
    //               onClick={() => action.onClick(row)}>
    //               {row.status === SUPPLIER_STATUS.BLOCKED ? (action.alterIcon ? action.alterIcon : action.icon) : action.icon} &nbsp;
    //               {row.status === SUPPLIER_STATUS.BLOCKED ? (action.alterText ? action.alterText : action.text) : action.text}
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
      filter: customFilter(),
      filterRenderer: (onFilter, col) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      headerStyle: {
        minWidth: 170,
        textAlign: 'center'
      },
      footerAlign: column.align,
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
        isDateFilterReverse
        supportEdit // for editable and save
        title={t('supplier_management')}
        description={t('supplier_management_des')}
        columns={columns}
        dataRangeKey="createdDate" // for data range filter
        supportMultiDelete
        getStatistic={props.getSupplierStatistic} // for statistic API
        statisticProps={{
          // for statistic API params
          name: 'Suppliers',
          key: 'status',
          order: ['countAll', 'countActivated', 'countDeActivated'],
          valueSet: {
            // to map params with each filter button
            countAll: undefined,
            countRejected: 'REJECTED',
            countActivated: 'ACTIVATED',
            countDeActivated: 'DEACTIVATED'
          }
        }}
        supportSelect
        supportSearch
        fixedColumns
        // selectField="id"
        searchPlaceholder={t('search_supplier')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        deleteData={props.deleteMechanic}
        fetchData={props.getSuppliers}
        params={{ sort: 'lastModifiedDate,desc' }}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('add_new_supplier'),
            onClick: () => {
              setAddModalShow(true);
            }
          },
          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="fas fa-user-times" style={{ color: '#000' }}></i>,
            onClick: (selectedData) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data) => {
                  return { type: 'delete', id: data.id, code: data.code };
                })
              );
            }
          },
          {
            type: 'hasData',
            text: t('block'),
            icon: <i className="fas fa-ban" style={{ color: '#000' }}></i>,
            disable: (selectedData) => {
              return selectedData.some((item) => item?.status !== 'ACTIVATED') || selectedData?.length < 1;
            },
            onClick: (selectedData) => {
              if (selectedData.every((item) => item.status === 'ACTIVATED')) {
                setConfirmModalShow(true);
                setConfirmData(
                  selectedData.map((data) => {
                    return { type: 'block', id: data.id, code: data.name };
                  })
                );
              }
            }
          },
          {
            type: 'hasData',
            text: t('unblock'),
            icon: <i className="fas fa-check" style={{ color: '#000' }}></i>,
            disable: (selectedData) => {
              return selectedData.some((item) => item?.status !== 'DEACTIVATED') || selectedData?.length < 1;
            },
            onClick: (selectedData) => {
              if (selectedData.every((item) => item.status === 'DEACTIVATED')) {
                setConfirmModalShow(true);
                setConfirmData(
                  selectedData.map((data) => {
                    return { type: 'unblock', id: data.id, code: data.name };
                  })
                );
              }
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
        id={viewId}
        fullAccessPage={fullAccessPage}
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
    getSuppliers: supplierActions.getSuppliers,
    getSupplierStatistic: supplierActions.getSupplierStatistic
  }
)(SupplierManagement);
