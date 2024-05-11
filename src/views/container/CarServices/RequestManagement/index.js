import { CheckCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd/es';
import objectPath from 'object-path';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { DEFAULT_AVATAR } from '~/configs/default';
import { renderRequestStatus, REQUEST_STATUS, BOOKING_TYPE } from '~/configs/status/car-services/mechanicRequestStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { mechanicActions } from '~/state/ducks/mechanic';
import { requestActions } from '~/state/ducks/mechanic/request';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import MapModal from '~/views/container/commons/MapModal';
import MediaModal from '~/views/container/commons/MediaModal';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { API_URL } from '~/configs';

import AddModal from './Modals/AddModal';
import ConfirmModal from './Modals/ConfirmModal';
import EditModal from './Modals/EditModal';
import QuotationViewModal from './Modals/QuotationViewModal';
import SendQuotationModal from './Modals/SendQuotationModal';
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
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [addModalShow, setAddModalShow] = useState(false);

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);

  const [viewModalShow, setViewModalShow] = useState(false);
  const [viewRequestId, setViewRequestId] = useState(null);
  const [mediaModal, setMediaModal] = useState(null);

  const [quotationViewModalShow, setQuotationViewModalShow] = useState(false);
  const [quotationViewId, setQuotationViewId] = useState(null);

  const [editModalShow, setEditModalShow] = useState(false);
  const [editMechanicId, setEditMechanicId] = useState(null);

  const [sendQuotationModalShow, setSendQuotationModalShow] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState(null);

  const [mapModal, setMapModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');

  const location = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR TOTAL REQUEST STATISTIC
  // ------------------------------
  const [totalRequestCount, setTotalRequestCount] = useState(0);
  const fetchRequestStatistic = () => {
    props
      .getRequests({
        isOrderByDistance: true,
        lng: '105.46792907927248', // Hard code vì chưa có API lẩy vị trí
        lat: '9.818933529749497' // Hard code vì chưa có API lẩy vị trí
      })
      .then((res) => {
        setTotalRequestCount(parseInt(objectPath.get(res?.headers, 'x-total-count', 0)));
      })
      .catch((err) => {
        console.error('trandev ~ file: index.js ~ line 132 ~ useEffect ~ err', err);
      });
  };
  useEffect(() => {
    fetchRequestStatistic();
  }, [needLoadNewData]);
  // ------------------------------
  // FOR TOTAL REQUEST STATISTIC
  // ------------------------------

  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    if (key === 'access') return !fullAccessPage;
    switch (text) {
      case t('approve_join'):
        if (row.memberStatus !== 'InActive') return true;
        return false;
      case t('edit_mechanic'):
        if (row.memberStatus === 'InActive') return true;
        return false;
      default:
        return false;
    }
  };

  const actions = [
    {
      icon: <EyeOutlined />,
      key: 'view',
      text: t('view_request'),
      onClick: (row) => {
        setViewModalShow(true);
        setViewRequestId(row.id);
      }
    },
    {
      icon: <CheckCircleOutlined />,
      key: 'access',
      text: t('send_a_quotation'),
      onClick: (row) => {
        setSendQuotationModalShow(true);
        setSelectedProblems([row]);
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
      dataField: 'id',
      text: t('request_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setViewRequestId(row.id);
            }}>
            {cell}
          </AButton>
        );
      }
    },
    {
      dataField: 'category',
      text: t('service'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 300, 185, 'center'),
      style: CustomFixedColumns(200, 300, 185, 'center'),
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setViewRequestId(row.id);
            }}>
            <span
              style={{
                maxWidth: 300,
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
      dataField: 'bookingType',
      text: t('bookingType'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderRequestStatus(cell, t(cell), 'tag')}</div>;
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
            options={Object.keys(BOOKING_TYPE).map((key) => {
              return {
                value: key,
                search: t(BOOKING_TYPE[key]),
                label: renderRequestStatus(BOOKING_TYPE[key], t(BOOKING_TYPE[key]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'media',
      text: t('media'),
      sort: false,
      style: {
        minWidth: 50,
        textAlign: 'center'
      },
      filter: '',
      filterRenderer: '',
      formatter: (cell, row) => {
        const media = cell?.concat(row?.descriptionAudio || []);
        return Boolean(media) && media.length > 0 ? (
          <AButton type="link" onClick={() => setMediaModal(media)}>
            {t('view_media')}
          </AButton>
        ) : (
          <span>{t('no_media')}</span>
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
        textAlign: 'center'
      }
    },
    {
      dataField: 'fullAddress',
      text: t('location'),
      sort: false,
      filter: '',
      filterRenderer: '',
      style: {
        minWidth: 200
      },
      formatter: (cell, row) => {
        return (
          <>
            <div>{cell}</div>
            <AButton
              className="pl-0"
              type="link"
              onClick={() => {
                setMapModal(true);
                setCurrentAddress(cell);
              }}>
              {t('view_full_map')}
            </AButton>
          </>
        );
      }
    },
    {
      dataField: 'time',
      text: t('booking_date'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{cell ? UtilDate.toDateTimeLocal(cell) : '-'}</span>;
      },
      csvFormatter: (cell, row) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'appointmentBookingDate',
      text: t('appointment_date'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{cell ? UtilDate.toDateTimeLocal(cell) : '-'}</span>;
      },
      csvFormatter: (cell, row) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '-';
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'status',
      text: t('request_status'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderRequestStatus(cell, t(cell), 'tag')}</div>;
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
            options={Object.keys(REQUEST_STATUS).map((key) => {
              return {
                value: key,
                search: t(REQUEST_STATUS[key]),
                label: renderRequestStatus(REQUEST_STATUS[key], t(REQUEST_STATUS[key]), 'tag')
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
        actionColumn={{
          handleResetFilters: handleResetFilters,
          actions: actions || [],
          disableAction: disableAction
        }}
        isDateFilterReverse
        supportReload
        supportEdit // for editable and save
        title={t('nearby_request_management')}
        description={t('new_request_management_des')}
        columns={columns}
        dataRangeKey="bookingDate" // for data range filter
        getStatistic={props.getRequestStatistic} // for statistic API
        statisticProps={{
          mockData: {
            total: totalRequestCount
          },
          // for statistic API params
          name: 'MechanicRequest',
          key: 'status',
          valueSet: {
            // to map params with each filter button
            totalRequests: undefined,
            newRequests: 'NEW',
            fixingRequests: 'FIXING',
            doneRequests: 'REPAIRED',
            cancelRequests: 'CANCELED'
          }
        }}
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('request_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        deleteData={props.deleteMechanic}
        fetchData={props.getRequests}
        params={{
          sort: 'time,desc',
          isOrderByDistance: true
        }}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          // TODO: ENHANCE LATER
          // {
          //   type: 'create',
          //   class: 'pl-0',
          //   icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
          //   text: t('new_request'),
          //   onClick: () => {
          //     setAddModalShow(true);
          //   }
          // },
          {
            type: 'hasData',
            disable: false,
            text: t('send_a_quotation'),
            icon: <i className="fas fa-receipt" style={{ color: '#000' }}></i>,
            onClick: (selectedData) => {
              setSendQuotationModalShow(true);
              setSelectedProblems(selectedData);
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
      <QuotationViewModal //
        id={quotationViewId}
        modalShow={quotationViewModalShow}
        setModalShow={setQuotationViewModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <EditModal //
        id={editMechanicId}
        modalShow={editModalShow}
        setModalShow={setEditModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <SendQuotationModal //
        modalShow={sendQuotationModalShow}
        setModalShow={setSendQuotationModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
        selectedProblems={selectedProblems}
      />

      <MediaModal //
        modalShow={Boolean(mediaModal)}
        onCancel={() => setMediaModal(null)}
        data={mediaModal}
      />

      <MapModal //
        title={t('full_map')}
        description={''}
        modalShow={mapModal}
        setModalShow={setMapModal}
        address={currentAddress}
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
