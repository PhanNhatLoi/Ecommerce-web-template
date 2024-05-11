import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined, EditOutlined, EyeOutlined, MinusCircleOutlined, StopOutlined } from '@ant-design/icons';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useLocation } from 'react-use';
import { CUSTOMER_BUSINESS_TYPE } from '~/configs';
import { CUSTOMER_STATUS, renderCustomerStatus } from '~/configs/status/car-services/customerStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { customerActions } from '~/state/ducks/customer';
import { mechanicActions } from '~/state/ducks/mechanic';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import AddModal from './Modals/AddModal';
import ConfirmModal from './Modals/ConfirmModal';
import EditModal from './Modals/EditModal';
import ViewModal from './Modals/ViewModal';

const CustomerManagement = (props) => {
  const { t } = useTranslation();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [addModalShow, setAddModalShow] = useState(false);

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);

  const [viewModalShow, setViewModalShow] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [viewCustomerId, setViewCustomerId] = useState(null);

  const [editModalShow, setEditModalShow] = useState(false);
  const [editMechanicId, setEditMechanicId] = useState(null);

  const [customerOrderId, setCustomerOrderId] = useState(null);

  const [params, setParams] = useState({
    sort: 'lastModifiedDate,desc',
    businessType: CUSTOMER_BUSINESS_TYPE.AUTO_REPAIR_SHOP
  });

  const location = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------
  const disableAction = (row, key) => {
    switch (key) {
      case 'access':
        return !fullAccessPage;
      default:
        return false;
    }
  };

  const actions = [
    {
      icon: <EyeOutlined />,
      key: 'view',
      text: t('view_customer'),
      onClick: (row) => {
        setViewModalShow(true);
        setCustomerOrderId(row.userId || null);
        setViewCustomerId(row.profileId);
      }
    },
    {
      icon: <EditOutlined />,
      key: 'access',
      text: t('edit_customer'),
      onClick: (row) => {
        setViewModalShow(true);
        setIsEditModal(true);
        setCustomerOrderId(row.userId || null);
        setViewCustomerId(row.profileId);
      }
    },
    {
      icon: <StopOutlined />,
      text: t('block_customer'),
      key: 'access',
      alterText: t('unblock_customer'),
      alterIcon: <CheckCircleOutlined />,
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: row.status === 'ACTIVATED' ? 'block' : 'unblock', id: row.id, fullName: row.fullName }]);
      }
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('delete_customer'),
      key: 'access',
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'delete', id: row.id, fullName: row.fullName }]);
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
      dataField: 'code',
      text: t('customer_code'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      formatter: (cell, row) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              setViewCustomerId(row.profileId);
              setCustomerOrderId(row.userId || null);
              setViewModalShow(true);
            }}>
            {cell}
          </AButton>
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'fullname',
      text: t('fullname'),
      fixed: true,
      headerStyle: CustomFixedColumns(250, 250, 185, 'left'),
      style: CustomFixedColumns(250, 250, 185, 'left'),
      formatter: (cell, row) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              setViewCustomerId(row.profileId);
              setCustomerOrderId(row.userId || null);
              setViewModalShow(true);
            }}>
            <span
              style={{
                maxWidth: 200,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
              {cell}
            </span>
          </AButton>
        ) : (
          '-'
        );
      },
      onSort: (field, order) => {
        setParams({ sort: `fullname,${order}` });
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
        return cell ? formatPhoneWithCountryCode(cell, cell?.startsWith('84') ? 'VN' : cell?.startsWith('1') ? 'US' : 'VN') : '-';
      },
      csvFormatter: (cell, row) => {
        return cell ? formatPhoneWithCountryCode(cell, cell?.startsWith('84') ? 'VN' : cell?.startsWith('1') ? 'US' : 'VN') : '-';
      }
    },
    {
      dataField: 'email',
      text: t('email_address'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 100
      },
      formatter: (cell, row) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              setViewCustomerId(row.profileId);
              setCustomerOrderId(row.userId || null);
              setViewModalShow(true);
            }}>
            {cell}
          </AButton>
        ) : (
          `-`
        );
      }
    },
    {
      dataField: 'totalOrder',
      text: t('total_orders'),
      sort: false,
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 150,
        textAlign: 'center'
      },
      formatter: (cell, row) => (cell ? numberFormatDecimal(+cell, '', '') : '-'),
      csvFormatter: (cell, row) => (cell ? numberFormatDecimal(+cell, '', '') : '-')
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
        return <div className="w-100 status_wrap-nononono">{cell && renderCustomerStatus(cell, t(cell), 'tag')}</div>;
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
            options={Object.keys(CUSTOMER_STATUS).map((o) => {
              return {
                value: CUSTOMER_STATUS[o],
                search: t(CUSTOMER_STATUS[o]),
                label: renderCustomerStatus(CUSTOMER_STATUS[o], t(CUSTOMER_STATUS[o]), 'tag')
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
        isDataRangeHidden
        title={t('customer_management')}
        description={t('customer_management_des')}
        columns={columns}
        dataRangeKey="joinedDate" // for data range filter
        supportMultiDelete
        getStatistic={props.getCustomerStatistic} // for statistic API
        statisticProps={{
          // for statistic API params
          name: 'Customer',
          key: 'status',
          params: { businessType: CUSTOMER_BUSINESS_TYPE.AUTO_REPAIR_SHOP },
          order: ['totalCustomer', 'activated', 'deactivated'],
          valueSet: {
            // to map params with each filter button
            total: undefined,
            activated: 'ACTIVATED',
            deactivated: 'DEACTIVATED'
          }
        }}
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('customer_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        deleteData={props.deleteMechanic}
        fetchData={props.getCustomers}
        params={params}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('new_customer'),
            onClick: () => {
              setAddModalShow(true);
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
                  return { type: 'delete', id: data.id, fullName: data.fullname };
                })
              );
            }
          },
          {
            type: 'hasData',
            text: t('block'),
            icon: <i className="fas fa-ban" style={{ color: '#000' }}></i>,
            disable: (selectedData) => selectedData.some((item) => item?.status !== 'ACTIVATED') || selectedData?.length < 1,
            onClick: (selectedData) => {
              if (selectedData.every((item) => item.status === 'ACTIVATED')) {
                setConfirmModalShow(true);
                setConfirmData(
                  selectedData.map((data) => {
                    return { type: 'block', id: data.id, fullName: data.fullname };
                  })
                );
              }
            }
          },
          {
            type: 'hasData',
            text: t('unblock'),
            icon: <i className="fas fa-check" style={{ color: '#000' }}></i>,
            disable: (selectedData) => selectedData.some((item) => item?.status !== 'DEACTIVATED') || selectedData?.length < 1,
            onClick: (selectedData) => {
              if (selectedData.every((item) => item.status === 'DEACTIVATED')) {
                setConfirmModalShow(true);
                setConfirmData(
                  selectedData.map((data) => {
                    return { type: 'unblock', id: data.id, fullName: data.fullname };
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
        id={viewCustomerId}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
        customerOrderId={customerOrderId}
        isEditModal={isEditModal}
        setIsEditModal={setIsEditModal}
      />
      <EditModal //
        id={editMechanicId}
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
    getCustomers: customerActions.getCustomers,
    getCustomerStatistic: customerActions.getCustomerStatistic,
    deleteMechanic: mechanicActions.deleteMechanic
  }
)(CustomerManagement);
