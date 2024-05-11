import { EyeOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import { DEFAULT_AVATAR } from '~/configs/default';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { bankingActions } from '~/state/ducks/settings/banking';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { API_URL } from '~/configs';

import AddModal from './Modals/AddModal';
import ConfirmModal from './Modals/ConfirmModal';
import EditModal from './Modals/EditModal';
import ViewModal from './Modals/ViewModal';

const BankingConfiguration = (props) => {
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
  const actions = [
    {
      icon: <EyeOutlined />,
      text: t('view_account'),
      disabled: false,
      onClick: (row) => {
        setViewModalShow(true);
        setViewId(row.id);
      }
    }
    // ENHANCE LATER
    // {
    //   icon: <MinusCircleOutlined />,
    //   text: t('delete_help'),
    //   disabled: false,
    //   onClick: (row) => {
    //     setConfirmModalShow(true);
    //     setConfirmData([{ type: 'delete', id: row.id, fullName: row.problem }]);
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
      dataField: 'logo',
      text: t('logo'),
      sort: false,
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      filter: '',
      filterRenderer: '',
      formatter: (cell) => {
        let src =
          cell && !cell?.includes(' ') //remove incorrect image url bug 4132
            ? firstImage(cell)
            : DEFAULT_AVATAR;
        return (
          <AuthImage
            preview={{
              mask: <EyeOutlined />
            }}
            notHaveBorder
            width={50}
            isAuth={true}
            src={src}
            // onClick={(e) => e.stopPropagation()}
          />
        );
      },
      csvFormatter: (cell) => {
        return cell ? firstImage(cell) : API_URL + DEFAULT_AVATAR;
      }
    },
    {
      dataField: 'bankName',
      text: t('bankName'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 185, 'left'),
      style: CustomFixedColumns(200, 200, 185, 'left')
    },
    {
      dataField: 'accountNumber',
      text: t('accountNumber'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setEditId(row.id);
              setEditModalShow(true);
            }}>
            {cell}
          </AButton>
        );
      }
    },
    {
      dataField: 'accountName',
      text: t('accountName'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      }
    },
    {
      dataField: 'lastModifiedDate',
      text: t('lastModifiedDate'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 200,
        textAlign: 'center'
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      },
      formatter: (cell) => {
        return cell ? UtilDate.toDateLocal(cell) : '';
      },
      csvFormatter: (cell) => {
        return cell ? UtilDate.toDateLocal(cell) : '';
      }
    }
    // {
    //   dataField: 'status',
    //   text: t('status'),
    //   sort: false,
    //   formatter: (cell) => {
    //     return <div className="w-100 status_wrap-nononono">{cell ? renderBankAccountStatus(cell, t(cell), 'tag') : 'no status'}</div>;
    //   },
    //   csvFormatter: (cell) => {
    //     return cell ? t(cell) : '-';
    //   },
    //   editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
    //     <SelectFilter
    //       autoFocus
    //       defaultOpen
    //       onFilter={editorProps?.onUpdate}
    //       placeholder={column?.text}
    //       options={Object.keys(BANK_ACCOUNT_STATUS).map((o) => {
    //         return {
    //           value: BANK_ACCOUNT_STATUS[o],
    //           search: t(BANK_ACCOUNT_STATUS[o]),
    //           label: renderBankAccountStatus(BANK_ACCOUNT_STATUS[o], t(BANK_ACCOUNT_STATUS[o]), 'tag')
    //         };
    //       })}
    //     />
    //   ),
    //   filterRenderer: (onFilter, column) => {
    //     return (
    //       <SelectFilter
    //         isClearFilter={isClearFilter}
    //         onFilter={onFilter}
    //         placeholder={column?.text}
    //         options={Object.keys(BANK_ACCOUNT_STATUS).map((o) => {
    //           return {
    //             value: BANK_ACCOUNT_STATUS[o],
    //             search: t(BANK_ACCOUNT_STATUS[o]),
    //             label: renderBankAccountStatus(BANK_ACCOUNT_STATUS[o], t(BANK_ACCOUNT_STATUS[o]), 'tag')
    //           };
    //         })}
    //       />
    //     );
    //   }
    // }
    // {
    //   dataField: 'action',
    //   text: t('actions'),
    //   classes: 'text-center pr-0',
    //   csvExport: false,
    //   headerClasses: 'ht-custom-header-table text-center pr-3',
    //   headerFormatter: ColumnFormat,
    //   style: {
    //     minWidth: 100,
    //     textAlign: 'center'
    //   },
    //   headerStyle: {
    //     minWidth: 100,
    //     textAlign: 'center'
    //   },
    //   sort: false,
    //   formatter: (cell, row, rowIndex) => {
    //     return <CustomMenu actions={actions} row={row} />;
    //   },
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
        minWidth: column.minWidth || 148,
        textAlign: column.textAlign || 'center'
      },
      headerStyle: {
        textAlign: column.textAlign || 'center',
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
          actions: actions || []
          // disableAction: disableAction
        }}
        columns={columns}
        dataRangeKey="lastModifiedDate" // for data range filter
        description={t('banking_management_des')}
        title={t('banking_management')}
        getStatistic={props.getHelpStatistic} // for statistic API
        isDateFilterReverse
        notSupportStatistic
        selectField="id"
        deleteData={props.deleteBankAccount}
        fetchData={props.getBankAccounts}
        isClearFilter={isClearFilter}
        needLoad={needLoadNewData}
        params={{ sort: 'lastModifiedDate,desc' }}
        searchPlaceholder={t('banking_management_search')}
        setNeedLoad={setNeedLoadNewData}
        supportEdit // for editable and save
        supportMultiDelete
        supportSearch
        supportSelect
        fixedColumns
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            text: t('bankAccountNew'),
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            onClick: () => {
              setAddModalShow(true);
            }
          },
          {
            type: 'hasData',
            text: t('remove'),
            disabled: false,
            icon: <i className="fas fa-close" style={{ color: '#000' }}></i>,
            onClick: (selectedData) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data) => {
                  return { type: 'delete', id: data.id, name: data.bankName };
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
      <ConfirmModal
        modalShow={confirmModalShow}
        setModalShow={setConfirmModalShow}
        data={confirmData}
        setData={setConfirmData}
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
    getBankAccounts: bankingActions.getBankAccounts,
    deleteBankAccount: bankingActions.deleteBankAccount
  }
)(BankingConfiguration);
