import { CloseCircleOutlined, EyeOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd/es';
import { head } from 'lodash-es';
import { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { FILTER_AMOUNT_OPTIONS } from '~/configs/rangeNumberFilter';
import { renderRepairStatus, REPAIR_STATUS } from '~/configs/status/car-services/repairStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { repairActions } from '~/state/ducks/carServices/repair';
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

import AssignModal from './Modals/AssignModal';
import ConfirmModal from './Modals/ConfirmModal';
import ProceedModal from './Modals/ProceedModal';
import UpdateQuotationModal from './Modals/UpdateQuotationModal';
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

const CustomerManagement = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);

  const [viewModalShow, setViewModalShow] = useState(false);
  const [viewRepairId, setViewRepairId] = useState(null);

  const [proceedModalShow, setProceedModalShow] = useState(false);

  const [assignModalShow, setAssignModalShow] = useState(false);

  const [updateQuotationModalShow, setUpdateQuotationModalShow] = useState(false);
  const [proceedData, setProceedData] = useState([]);

  const location = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    if (key === 'access') return !fullAccessPage;
    const validUpdateCancelStatus = ['FIXING', 'WAITING_ACCEPT_BY_REQUESTER', 'UPDATED_QUOTATION'];
    switch (text) {
      case t('proceed_repair'):
        return row.status === 'CLOSED';
      case t('assign_advisor'):
        return row.status === 'CLOSED';
      case t('update_quotation'):
        return !validUpdateCancelStatus.includes(row.status);
      case t('cancel_repair'):
        return !validUpdateCancelStatus.includes(row.status);
      default:
        return false;
    }
  };

  const actions = [
    {
      icon: <EyeOutlined />,
      text: t('view_details'),
      onClick: (row) => {
        setViewModalShow(true);
        setViewRepairId(row.repairId);
      }
    },
    // TODO: ENHANCE LATER
    // {
    //   icon: <ArrowRightOutlined />,
    //   text: t('proceed_repair'),
    //   onClick: (row) => {
    //     setProceedModalShow(true);
    //   }
    // },
    // {
    //   icon: <IdcardOutlined />,
    //   text: t('assign_advisor'),
    //   onClick: (row) => {
    //     setAssignModalShow(true);
    //   }
    // },
    {
      icon: <FileDoneOutlined />,
      text: t('update_quotation'),
      onClick: (row) => {
        setViewRepairId(row.repairId);
        setUpdateQuotationModalShow(true);
      }
    },
    {
      icon: <CloseCircleOutlined />,
      text: t('cancel_repair'),
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'cancel', id: row.repairId, fullName: row.category }]);
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

  let columns = [
    {
      dataField: 'repairId',
      text: t('repair_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setViewRepairId(row.repairId);
            }}>
            {cell}
          </AButton>
        );
      }
    },
    {
      dataField: 'helperName',
      text: t('advisor'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 185, 'left'),
      style: CustomFixedColumns(200, 200, 185, 'left')
    },
    {
      dataField: 'quoteFee',
      text: t('service_fee'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 170
      },
      formatter: (cell, row) => {
        return cell ? <span>{numberFormatDecimal(+cell, ' đ', '')}</span> : '-';
      },
      csvFormatter: (cell, row) => {
        return cell ? numberFormatDecimal(+cell, '', '') : '-';
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
      dataField: 'startHelping',
      text: t('start_repair_date'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 100
      },
      formatter: (cell, row) => {
        return cell ? <span>{UtilDate.toDateLocal(cell)}</span> : '-';
      },
      csvFormatter: (cell, row) => {
        return cell ? UtilDate.toDateLocal(cell) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'endHelping',
      text: t('complete_repair'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 100
      },
      formatter: (cell, row) => {
        return cell ? <span>{UtilDate.toDateLocal(cell)}</span> : '-';
      },
      csvFormatter: (cell, row) => {
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
        textAlign: 'center',
        minWidth: 200
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 200
      },
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderRepairStatus(cell, t(cell), 'tag')}</div>;
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
            options={Object.keys(REPAIR_STATUS).map((o) => {
              return {
                value: REPAIR_STATUS[o],
                search: t(REPAIR_STATUS[o]),
                label: renderRepairStatus(REPAIR_STATUS[o], t(REPAIR_STATUS[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'category',
      text: t('service'),
      style: {
        textAlign: 'center',
        minWidth: 160
      }
    },
    {
      dataField: 'requesterName',
      text: t('requester'),
      align: 'center',
      style: {
        minWidth: 170,
        textAlign: 'left'
      }
    },
    {
      dataField: 'bookingDate',
      text: t('bookingDate'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 100
      },
      formatter: (cell, row) => {
        return cell ? <span>{cell ? UtilDate.toDateLocal(cell) : '-'}</span> : '-';
      },
      csvFormatter: (cell, row) => {
        return cell ? UtilDate.toDateLocal(cell) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
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
        minWidth: 170,
        textAlign: 'center'
      },
      filter: customFilter(),
      filterRenderer: (onFilter, col) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
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
        actionColumn={{
          handleResetFilters: handleResetFilters,
          actions: actions || [],
          disableAction: disableAction
        }}
        supportEdit // for editable and save
        isDateFilterReverse
        isNumberRangeReverse
        title={t('repair_management')}
        description={t('repair_management_des')}
        columns={columns}
        dataRangeKey="bookingDate" // for data range filter
        supportMultiDelete
        getStatistic={props.getRepairStatistic} // for statistic API
        statisticProps={{
          name: 'Repair',
          key: 'uiStatus',
          order: ['total', 'repairing', 'doneConfirmPending', 'paymentPending', 'done', 'canceled'],
          valueSet: {
            // to map params with each filter button
            total: 'ALL',
            repairing: 'REPAIRING',
            doneConfirmPending: 'DONE_CONFIRM_PENDING',
            paymentPending: 'PAYMENT_PENDING',
            done: 'DONE',
            canceled: 'CANCELED'
          }
        }}
        supportSelect
        supportSearch
        fixedColumns
        selectField="repairId"
        searchPlaceholder={t('repair_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getRepairs}
        params={{
          sort: 'bookingDate,desc'
          // status: 'REPAIRING'
        }}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          // TODO: ENHANCE LATER
          // {
          //   type: 'hasData',
          //   class: 'pl-0',
          //   icon: <i className="fas fa-arrow-right" style={{ color: '#000' }}></i>,
          //   text: t('repair_proceed'),
          //   onClick: (selectedData) => {
          //     if (selectedData.every((item) => item?.status !== 'CLOSED')) {
          //       setProceedModalShow(true);
          //       setProceedData(selectedData);
          //     }
          //   }
          // },
          // {
          //   type: 'hasData',
          //   icon: <i className="fas fa-address-card" style={{ color: '#000' }}></i>,
          //   text: t('assign_advisor'),
          //   onClick: (selectedData) => {
          //     if (selectedData.every((item) => item?.status !== 'CLOSED')) {
          //       setAssignModalShow(true);
          //     }
          //   }
          // },
          {
            type: 'hasData',
            icon: <i className="fas fa-file-invoice" style={{ color: '#000' }}></i>,
            text: t('update_quotation'),
            disable: (selectedData) => {
              const validStatus = ['FIXING', 'WAITING_ACCEPT_BY_REQUESTER', 'UPDATED_QUOTATION'];
              return selectedData.some((item) => !validStatus.includes(item?.status)) || selectedData?.length < 1;
            },
            onClick: (selectedData) => {
              setViewRepairId(head(selectedData).repairId);
              setUpdateQuotationModalShow(true);
            }
          },
          {
            type: 'hasData',
            icon: <i className="far fa-times-circle" style={{ color: '#000' }}></i>,
            text: t('cancel_repair'),
            disable: (selectedData) => {
              const validStatus = ['FIXING', 'WAITING_ACCEPT_BY_REQUESTER', 'UPDATED_QUOTATION'];
              return selectedData.some((item) => !validStatus.includes(item?.status)) || selectedData?.length < 1;
            },
            onClick: (selectedData) => {
              const validStatus = ['FIXING', 'WAITING_ACCEPT_BY_REQUESTER', 'UPDATED_QUOTATION'];
              if (selectedData.every((item) => validStatus.includes(item?.status))) {
                setConfirmModalShow(true);
                setConfirmData(
                  selectedData.map((data) => {
                    return { type: 'cancel', id: data.repairId, fullName: '' };
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
      <ViewModal //
        id={viewRepairId}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <ProceedModal //
        modalShow={proceedModalShow}
        setModalShow={setProceedModalShow}
        data={proceedData}
      />
      <AssignModal //
        modalShow={assignModalShow}
        setModalShow={setAssignModalShow}
      />
      <ConfirmModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <UpdateQuotationModal //
        id={viewRepairId}
        modalShow={updateQuotationModalShow}
        setModalShow={setUpdateQuotationModalShow}
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
    getRepairs: repairActions.getRepairs,
    getRepairStatistic: repairActions.getRepairStatistic
  }
)(CustomerManagement);
