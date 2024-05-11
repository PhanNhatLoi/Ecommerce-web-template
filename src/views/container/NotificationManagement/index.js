import React, { useEffect, useState } from 'react';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Menu } from 'antd/es';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { MESSAGE_TYPE, renderMessageType } from '~/configs/status/notification/messageType';
import { NOTIFICATION_STATUS, renderNotificationStatus } from '~/configs/status/notification/notificationStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { notificationActions } from '~/state/ducks/notification';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import AddModal from './Modals/AddModal';
import ConfirmModal from './Modals/ConfirmModal';
import EditModal from './Modals/EditModal';
import ReceiverModal from './Modals/ReceiverModal';
import ViewModal from './Modals/ViewModal';

const ButtonStyled = styled(AButton)`
  .anticon {
    position: relative !important;
    bottom: 8px !important;
  }
`;

const NotificationManagement = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [addModalShow, setAddModalShow] = useState(false);
  const [notificationId, setNotificationId] = useState(null);

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);

  const [viewModalShow, setViewModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);

  const [params, setParams] = useState({});

  const [receiverModalShow, setReceiverModalShow] = useState(false);

  const location = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------
  const disableAction = (row, text) => {
    switch (text) {
      case t('edit_notification'):
        return row?.status !== NOTIFICATION_STATUS.WAITING_FOR_APPROVAL;
      default:
        return false;
    }
  };

  const actions = [
    {
      icon: <EyeOutlined />,
      text: t('view_notification'),
      onClick: (row) => {
        setNotificationId(row.id);
        setViewModalShow(true);
      }
    },
    {
      icon: <EditOutlined />,
      text: t('edit_notification'),
      onClick: (row) => {
        setNotificationId(row.id);
        setEditModalShow(true);
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
      dataField: 'message',
      text: t('messages'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 35, 'left'),
      style: CustomFixedColumns(200, 200, 35, 'left'),
      formatter: (cell, row) => {
        return (
          <ButtonStyled
            type="link"
            onClick={() => {
              setNotificationId(row.id);
              setViewModalShow(true);
            }}>
            <span
              style={{
                maxWidth: 150,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
              {cell}
            </span>
          </ButtonStyled>
        );
      },
      csvFormatter: (cell) => cell
    },
    {
      dataField: 'createdDate',
      text: t('created_date'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 300, 235, 'center'),
      style: CustomFixedColumns(200, 300, 235, 'center'),
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateTimeLocal(cell)}</span>;
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      },
      onSort: (field, order) => {
        setParams({ sort: `m.sendingDate,${order}` });
      },
      csvFormatter: (cell) => UtilDate.toDateTimeLocal(cell)
    },
    {
      dataField: 'sendingDate',
      text: t('sending_date'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateTimeLocal(cell) || '-'}</span>;
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      },
      onSort: (field, order) => {
        setParams({ sort: `m.sendingDate,${order}` });
      },
      csvFormatter: (cell) => UtilDate.toDateTimeLocal(cell)
    },
    {
      dataField: 'pushToUsers',
      text: t('receivers'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      filter: '',
      filterRenderer: '',
      formatter: (cell, row) => {
        return Boolean(cell) ? (
          <AButton
            type="link"
            onClick={() => {
              setNotificationId(row.id);
              setReceiverModalShow(true);
            }}>
            {t('view_receivers')}
          </AButton>
        ) : (
          '-'
        );
      },
      csvFormatter: (cell) => cell
    },
    {
      dataField: 'messageType',
      text: t('message_type'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderMessageType(cell, t(cell), 'tag')}</div>;
      },
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(MESSAGE_TYPE).map((o) => {
              return {
                value: MESSAGE_TYPE[o],
                search: t(MESSAGE_TYPE[o]),
                label: renderMessageType(MESSAGE_TYPE[o], t(MESSAGE_TYPE[o]), 'tag')
              };
            })}
          />
        );
      },
      csvFormatter: (cell) => t(cell)
    },
    {
      dataField: 'status',
      text: t('status'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderNotificationStatus(cell, t(cell), 'tag')}</div>;
      },
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(NOTIFICATION_STATUS).map((o) => {
              return {
                value: NOTIFICATION_STATUS[o],
                search: t(NOTIFICATION_STATUS[o]),
                label: renderNotificationStatus(NOTIFICATION_STATUS[o], t(NOTIFICATION_STATUS[o]), 'tag')
              };
            })}
          />
        );
      },
      csvFormatter: (cell) => t(cell)
    }
    // {
    //   dataField: 'action',
    //   text: t('actions'),
    //   sort: false,
    //   style: {
    //     minWidth: 50,
    //     textAlign: 'center'
    //   },
    //   csvText: ``,
    //   csvExport: false,
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
    //       className="btn mb-1 py-2 w-100"
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
      sort: false,
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
        title={t('notification_management')}
        description={t('notification_des')}
        columns={columns}
        dataRangeKey="createdDate" // for data range filter
        supportMultiDelete
        getStatistic={props.getNotificationStatistic} // for statistic API
        statisticProps={{
          // for statistic API params
          name: 'Message',
          key: 'status',
          valueSet: {
            // to map params with each filter button
            total: undefined,
            successes: 'SUCCESSFULLY',
            failed: 'FAILURE'
          }
        }}
        supportSelect
        supportSearch
        fixedColumns
        // selectField={'profileId'}
        searchPlaceholder={t('notification_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getNotifications}
        params={{ sort: 'createdDate,desc', ...params }}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('new_message'),
            onClick: () => {
              setAddModalShow(true);
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
        id={notificationId}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <EditModal //
        id={notificationId}
        modalShow={editModalShow}
        setModalShow={setEditModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <ReceiverModal //
        id={notificationId}
        modalShow={receiverModalShow}
        setModalShow={setReceiverModalShow}
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
    getNotifications: notificationActions.getNotifications,
    getNotificationStatistic: notificationActions.getNotificationStatistic
  }
)(NotificationManagement);
