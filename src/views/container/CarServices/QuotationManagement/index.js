import { CloseCircleOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { FILTER_AMOUNT_OPTIONS } from '~/configs/rangeNumberFilter';
import { QUOTATION_STATUS, renderQuotationStatus } from '~/configs/status/car-services/quotationStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { quotationActions } from '~/state/ducks/mechanic/quotation';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import AddModal from './Modals/AddModal';
import ConfirmModal from './Modals/ConfirmModal';
import EditModal from './Modals/EditModal';
import ViewModal from './Modals/ViewModal';

const MechanicsManagement = (props) => {
  const { t } = useTranslation();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [addModalShow, setAddModalShow] = useState(false);

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);

  const [viewModalShow, setViewModalShow] = useState(false);
  const [viewId, setViewId] = useState(null);

  const [editModalShow, setEditModalShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const [params, setParams] = useState({});

  const location = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    let disable = false;
    switch (text) {
      case t('cancel_quotation'):
        disable = row.status !== 'WAITING_ACCEPT_BY_REQUESTER';
        break;
      // case t('update_quotation'):
      //   const validStatus = ['FIXING', 'WAITING_ACCEPT_BY_REQUESTER', 'UPDATED_QUOTATION'];
      //   disable = !validStatus.includes(row.status);
      //   break;
      default:
        disable = false;
        break;
    }
    return key === 'access' && fullAccessPage ? disable : !fullAccessPage;
  };

  const actions = [
    {
      icon: <EyeOutlined />,
      text: t('view_quotation'),
      onClick: (row) => {
        setViewModalShow(true);
        setViewId(row.repairId);
      }
    },
    {
      icon: <EditOutlined />,
      text: t('update_quotation'),
      key: 'access',
      onClick: (row) => {
        setEditModalShow(true);
        setEditId(row.repairId);
      }
    },
    {
      icon: <CloseCircleOutlined />,
      text: t('cancel_quotation'),
      key: 'access',
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'cancel', id: row.repairId, fullName: null }]);
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
      dataField: 'repairId',
      text: t('quotation_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setViewId(row.repairId);
            }}>
            {cell}
          </AButton>
        );
      }
    },
    {
      dataField: 'totalPrice',
      text: t('total_fee'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 185, 'center'),
      style: CustomFixedColumns(200, 200, 185, 'center'),
      formatter: (cell, row) => {
        return <span>{numberFormatDecimal(+cell, ' đ', '')}</span>;
      },
      csvFormatter: (cell, row) => {
        return numberFormatDecimal(+cell, '', '');
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
      dataField: 'createdQuotationFullname',
      text: t('quoted_by'),
      style: {
        minWidth: 170,
        textAlign: 'left'
      }
    },
    {
      dataField: 'createdDate',
      text: t('quoted_date'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateTimeLocal(cell)}</span>;
      },
      csvFormatter: (cell, row) => {
        return UtilDate.toDateTimeLocal(cell);
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      },
      onSort: (field, order) => {
        setParams({ sort: `createdDate,${order}` });
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
        return <div className="w-100 status_wrap-nononono">{cell ? renderQuotationStatus(cell, t(cell), 'tag') : t('deleted')}</div>;
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
            options={Object.keys(QUOTATION_STATUS).map((o) => {
              return {
                value: QUOTATION_STATUS[o],
                search: t(QUOTATION_STATUS[o]),
                label: renderQuotationStatus(QUOTATION_STATUS[o], t(QUOTATION_STATUS[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'request',
      text: t('service'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      }
    },
    {
      dataField: 'requesterName',
      text: t('requester'),
      style: {
        minWidth: 100,
        textAlign: 'left'
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
    //               {action.icon} &nbsp; {row.memberStatus === 'Blocked' ? (action.alterText ? action.alterText : action.text) : action.text}
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
        minWidth: 148
      },
      headerStyle: {
        minWidth: 170,
        textAlign: 'center'
      },
      filter: customFilter(),
      filterRenderer: (onFilter, col) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      align: column.align,
      headerAlign: column.align,
      footerAlign: column.align,
      formatter: (cell, row) => cell || '-',
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  return (
    <div>
      <TableBootstrapHook
        // mock
        actionColumn={{
          handleResetFilters: handleResetFilters,
          actions: actions || [],
          disableAction: disableAction
        }}
        supportEdit // for editable and save
        title={t('quotation_management')}
        description={t('quotation_des')}
        columns={columns}
        isDateFilterReverse
        isNumberRangeReverse
        dataRangeKey="createdDate" // for data range filter
        supportMultiDelete
        getStatistic={props.getQuotationStatistic} // for statistic API
        statisticProps={{
          // for statistic API params
          name: 'Quotation',
          key: 'uiStatus',
          valueSet: {
            // to map params with each filter button
            total: 'ALL',
            accepted: 'ACCEPTED',
            waitingAccept: 'WAITING_ACCEPT',
            rejected: 'REJECTED',
            canceled: 'CANCELED'
          }
        }}
        supportSelect
        selectField="repairId"
        supportSearch
        fixedColumns
        searchPlaceholder={t('quotation_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        deleteData={props.deleteMechanic}
        fetchData={props.getQuotations}
        params={{ sort: `lastModifiedDate,desc` }}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            onClick: () => {
              setAddModalShow(true);
            },
            icon: <i className="fas fa-file-invoice" style={{ color: '#000' }}></i>,
            text: ` ${t('quotation_new')}`
          },
          {
            type: 'hasData',
            text: t('cancel'),
            icon: <i className="far fa-times-circle" style={{ color: '#000' }}></i>,
            disable: (selectedData) => {
              return selectedData.some((item) => item?.status !== 'WAITING_ACCEPT_BY_REQUESTER') || selectedData?.length < 1;
            },
            onClick: (selectedData) => {
              const invalidStatus = [QUOTATION_STATUS.CANCELED, QUOTATION_STATUS.CLOSED, QUOTATION_STATUS.REJECTED];
              if (selectedData.every((item) => !invalidStatus.includes(item.status))) {
                setConfirmModalShow(true);
                setConfirmData(
                  selectedData.map((data) => {
                    return { type: 'cancel', id: data.repairId, fullName: data.fullName };
                  })
                );
              }
            }
          },
          // ENHANCE LATER
          // {
          //   type: 'hasData',
          //   text: t('delete'),
          //   icon: <i className="fas fa-trash-alt" style={{ color: '#000' }}></i>,
          //   onClick: (selectedData) => {
          //     setConfirmModalShow(true);
          //     setConfirmData(
          //       selectedData.map((data) => {
          //         return { type: 'delete', id: data.repairId, fullName: data.fullName };
          //       })
          //     );
          //   }
          // },
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
    getQuotations: quotationActions.getQuotations,
    getQuotationStatistic: quotationActions.getQuotationStatistic
  }
)(MechanicsManagement);
