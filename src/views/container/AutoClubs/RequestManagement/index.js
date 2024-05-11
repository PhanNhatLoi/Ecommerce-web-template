import { EyeOutlined } from '@ant-design/icons';
import { Button, Dropdown, Image, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { DEFAULT_AVATAR } from '~/configs/default';
import { renderRequestStatus, REQUEST_STATUS } from '~/configs/status/auto-clubs/memberRequestStatus';
import { HELP_STATUS, renderRequestToStatus } from '~/configs/status/auto-clubs/requestToStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { mechanicActions } from '~/state/ducks/mechanic';
import { requestActions } from '~/state/ducks/member/request';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import MapModal from '~/views/container/commons/MapModal';
import MediaModal from '~/views/container/commons/MediaModal';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { API_URL } from '~/configs';

import AddModal from './Modals/AddModal';
import AssignModal from './Modals/AssignModal';
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

const RequestManagement = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [addModalShow, setAddModalShow] = useState(false);

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);

  const [viewModalShow, setViewModalShow] = useState(false);
  const [viewRequestId, setViewRequestId] = useState(null);

  const [editModalShow, setEditModalShow] = useState(false);
  const [editMechanicId, setEditMechanicId] = useState(null);

  const [mediaModal, setMediaModal] = useState(null);

  const [assignModalShow, setAssignModalShow] = useState(false);

  const [mapModal, setMapModal] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);

  const [resetFilter, setResetFilter] = useState(false);
  const location = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    if (key === 'access') return !fullAccessPage;
    switch (text) {
      // case t('approve_join'):
      //   if (row.memberStatus !== 'InActive') return true;
      //   return false;
      // case t('edit_mechanic'):
      //   if (row.memberStatus === 'InActive') return true;
      //   return false;
      default:
        return false;
    }
  };

  const actions = [
    {
      icon: <EyeOutlined />,
      text: t('view_request'),
      onClick: (row) => {
        setViewModalShow(true);
        setViewRequestId(row.requestId);
      }
    }
    // ENHANCE LATER
    // {
    //   icon: <EditOutlined />,
    //   text: t('edit_request'),
    //   onClick: (row) => {
    //     // setConfirmModalShow(true);
    //     // setConfirmData([{ type: 'approve', id: row.profileId, fullName: row.fullName }]);
    //   }
    // },
    // {
    //   icon: <UserSwitchOutlined />,
    //   text: t('assign_helper'),
    //   onClick: (row) => {
    //     // setConfirmModalShow(true);
    //     // setConfirmData([{ type: 'delete', id: row.profileId, fullName: row.fullName }]);
    //   }
    // }
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
      dataField: 'requestId',
      text: t('request_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 0, 'center'),
      style: CustomFixedColumns(150, 150, 0, 'center'),
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setViewRequestId(row.requestId);
            }}>
            {cell}
          </AButton>
        );
      }
    },
    {
      dataField: 'category',
      text: t('incident'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 300, 150, 'left'),
      style: CustomFixedColumns(200, 300, 150, 'left'),
      formatter: (cell, row) => {
        return (
          <AButton
            className="pl-0"
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setViewRequestId(row.requestId);
            }}>
            {' '}
            <span
              style={{
                maxWidth: 260,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
              {cell}
            </span>
          </AButton>
        );
      }
    },
    {
      dataField: 'media',
      text: t('visual_media'),
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
      formatter: (cell, row) => {
        const media = cell?.concat(row?.descriptionAudio).filter(Boolean);
        return Boolean(media) && media.length > 0 ? (
          <AButton type="link" onClick={() => setMediaModal(media)}>
            {t('view_media')}
          </AButton>
        ) : (
          <Image
            preview={{
              mask: <EyeOutlined />
            }}
            width={50}
            src={DEFAULT_AVATAR}
            style={{ objectFit: 'contain' }}
          />
        );
      },
      csvFormatter: (cell) => {
        return cell ? firstImage(cell) : API_URL + DEFAULT_AVATAR;
      }
    },
    {
      dataField: 'requesterName',
      text: t('requester'),
      style: {
        minWidth: 200,
        textAlign: 'left'
      },
      headerStyle: {
        minWidth: 200,
        textAlign: 'left'
      }
    },
    {
      dataField: 'fullAddress',
      text: t('location'),
      sort: false,
      style: {
        minWidth: 250,
        textAlign: 'left'
      },
      headerStyle: {
        minWidth: 250,
        textAlign: 'left'
      },
      filter: '',
      filterRenderer: '',
      formatter: (cell, row) => {
        return (
          <>
            <p>{cell}</p>
            <AButton
              type="link"
              className="pl-0"
              onClick={() => {
                if (cell) {
                  setMapModal(true);
                  setMapLocation(cell);
                } else AMessage.error(t('errorAddressNotFound'));
              }}>
              {t('view_map')}
            </AButton>
          </>
        );
      }
    },
    {
      dataField: 'bookingDate',
      text: t('booking_date'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 150,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateTimeLocal(cell)}</span>;
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'requestTo',
      text: t('book_to'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 150,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderRequestToStatus(cell, t(cell), 'tag')}</div>;
      },
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            resetFilter={resetFilter}
            setResetFilter={setResetFilter}
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(HELP_STATUS).map((o) => {
              return {
                value: HELP_STATUS[o],
                search: t(HELP_STATUS[o]),
                label: renderRequestToStatus(HELP_STATUS[o], t(HELP_STATUS[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'helperName',
      text: t('fixed_by'),
      style: {
        minWidth: 200,
        textAlign: 'left'
      },
      headerStyle: {
        minWidth: 200,
        textAlign: 'left'
      }
    },
    {
      dataField: 'uiStatus',
      text: t('status'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 150,
        textAlign: 'center'
      },
      sort: false,
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderRequestStatus(cell, t(cell), 'tag')}</div>;
      },
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            resetFilter={resetFilter}
            setResetFilter={setResetFilter}
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(REQUEST_STATUS).map((o) => {
              return {
                value: REQUEST_STATUS[o],
                search: t(REQUEST_STATUS[o]),
                label: renderRequestStatus(REQUEST_STATUS[o], t(REQUEST_STATUS[o]), 'tag')
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
    //   headerClasses: 'ht-custom-header-table',
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
        isDateFilterReverse
        supportEdit // for editable and save
        title={t('request_management')}
        description={t('request_des')}
        columns={columns}
        dataRangeKey="bookingDate" // for data range filter
        supportMultiDelete
        getStatistic={props.getRequestStatistic} // for statistic API
        statisticProps={{
          // for statistic API params
          order: ['totalRequests', 'newRequests', 'fixingRequests', 'doneRequests', 'cancelRequests'],
          name: 'MemberRequest',
          key: 'uiStatus',
          valueSet: {
            // to map params with each filter button
            totalRequests: 'ALL',
            newRequests: 'NEW',
            fixingRequests: 'FIXING',
            doneRequests: 'DONE',
            cancelRequests: 'CANCELED'
          }
        }}
        supportSearch
        fixedColumns
        selectField={'requestId'}
        searchPlaceholder={t('problem_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        deleteData={props.deleteMechanic}
        fetchData={props.getRequests}
        params={{ sort: 'bookingDate,desc' }}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        setResetFilter={setResetFilter}
        buttons={
          [
            // ENHANCE LATER
            // {
            //   type: 'create',
            //   class: 'pl-0',
            //   icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            //   text: t('new_request'),
            //   onClick: () => {
            //     setAddModalShow(true);
            //   }
            // },
            // {
            //   type: 'extra',
            //   icon: <i className="fas fa-child" style={{ color: '#000' }}></i>,
            //   text: t('assign_helper'),
            //   onClick: () => setAssignModalShow(true)
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
        id={editMechanicId}
        modalShow={editModalShow}
        setModalShow={setEditModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />

      <AssignModal //
        modalShow={assignModalShow}
        setModalShow={setAssignModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />

      <MediaModal //
        modalShow={Boolean(mediaModal)}
        onCancel={() => setMediaModal(null)}
        data={mediaModal}
      />

      <MapModal //
        title={t('location')}
        description={mapLocation}
        modalShow={mapModal}
        setModalShow={setMapModal}
        address={mapLocation}
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
    getRequests: requestActions.getRequests,
    updateMechanic: mechanicActions.updateMechanic,
    getRequestStatistic: requestActions.getRequestStatistic,
    approveMechanic: mechanicActions.approveMechanic,
    blockMechanic: mechanicActions.blockMechanic,
    rejectMechanic: mechanicActions.rejectMechanic,
    deleteMechanic: mechanicActions.deleteMechanic
  }
)(RequestManagement);
