import { EyeOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useLocation } from 'react-use';
import { HELP_STATUS, renderHelpStatus } from '~/configs/status/auto-clubs/helpStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { mechanicActions } from '~/state/ducks/mechanic';
import { helpActions } from '~/state/ducks/member/help';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import MapModal from '~/views/container/commons/MapModal';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AButton1 from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import AddModal from './Modals/AddModal';
import AssignModal from './Modals/AssignModal';
import ConfirmModal from './Modals/ConfirmModal';
import EditModal from './Modals/EditModal';
import ViewModal from './Modals/ViewModal';

const HelpManagement = (props) => {
  const { t } = useTranslation();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [addModalShow, setAddModalShow] = useState(false);

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);

  const [viewModalShow, setViewModalShow] = useState(false);
  const [viewRequestId, setViewRequestId] = useState(null);

  const [editModalShow, setEditModalShow] = useState(false);
  const [editMechanicId, setEditMechanicId] = useState(null);

  const [assignModalShow, setAssignModalShow] = useState(false);
  const [assignData, setAssignData] = useState([]);

  const [mapModal, setMapModal] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const location = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR ACTIONS
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
      text: t('view_help'),
      disabled: false,
      onClick: (row) => {
        setViewModalShow(true);
        setViewRequestId(row.repairId);
      }
    }
    // ENHANCE LATER
    // {
    //   icon: <PlusCircleOutlined />,
    //   text: t('assign_to_helper'),
    //   disabled: !fullAccessPage,
    //   onClick: (row) => {
    //     setAssignModalShow(true);
    //     setAssignData([row]);
    //   }
    // }
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
      dataField: 'repairId',
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
              setViewRequestId(cell);
            }}>
            {cell}
          </AButton>
        );
      },
      csvFormatter: (cell) => cell
    },
    {
      dataField: 'category',
      text: t('incident'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 300, 185, 'center'),
      style: CustomFixedColumns(200, 300, 185, 'center'),
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setViewRequestId(row.repairId);
            }}>
            <span
              style={{
                maxWidth: 280,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
              {cell}
            </span>
          </AButton>
        );
      },
      csvFormatter: (cell) => cell
    },
    {
      dataField: 'helperName',
      text: t('helper'),
      style: {
        minWidth: 200
      },
      headerStyle: { minWidth: 200 },
      csvFormatter: (cell) => cell
    },
    {
      dataField: 'fullAddress',
      text: t('location'),
      filter: '',
      sort: false,
      filterRenderer: '',
      style: {
        minWidth: 300
      },
      headerStyle: { minWidth: 300 },
      formatter: (cell, row) => {
        return (
          <div>
            <p>{cell}</p>
            <AButton
              type="link"
              className="pl-0"
              onClick={() => {
                setMapModal(true);
                setMapLocation(cell);
              }}>
              {t('view_full_map')}
            </AButton>
          </div>
        );
      },
      csvFormatter: (cell) => cell
    },
    {
      dataField: 'bookingDate',
      text: t('booking_date'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 200, textAlign: 'center' },
      formatter: (cell, row) => {
        return <span>{cell ? UtilDate.toDateTimeLocal(cell) : '-'}</span>;
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      },
      csvFormatter: (cell) => UtilDate.toDateTimeLocal(cell)
    },
    {
      dataField: 'startHelping',
      text: t('start_helping'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 200, textAlign: 'center' },
      formatter: (cell, row) => {
        return <span>{cell ? UtilDate.toDateTimeLocal(cell) : '-'}</span>;
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      },
      csvFormatter: (cell) => UtilDate.toDateTimeLocal(cell)
    },
    {
      dataField: 'endHelping',
      text: t('end_helping'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 200, textAlign: 'center' },
      formatter: (cell, row) => {
        return <span>{cell ? UtilDate.toDateTimeLocal(cell) : '-'}</span>;
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      },
      csvFormatter: (cell) => UtilDate.toDateTimeLocal(cell)
    },
    {
      dataField: 'uiStatus',
      text: t('status'),
      sort: false,
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 200, textAlign: 'center' },
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell ? renderHelpStatus(cell, t(cell), 'tag') : t('deleted')}</div>;
      },
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(HELP_STATUS).map((o) => {
              return {
                value: o,
                search: t(HELP_STATUS[o]),
                label: renderHelpStatus(HELP_STATUS[o], t(HELP_STATUS[o]), 'tag')
              };
            })}
          />
        );
      },
      csvFormatter: (cell) => (cell ? t(cell) : '-')
    }
    // {
    //   dataField: 'action',
    //   text: t('actions'),
    //   classes: 'text-center pr-0',
    //   csvExport: false,
    //   headerClasses: 'ht-custom-header-table pr-3',
    //   headerFormatter: ColumnFormat,
    //   sort: false,
    //   style: {
    //     minWidth: 100,
    //     textAlign: 'center'
    //   },
    //   headerStyle: {
    //     minWidth: 100,
    //     textAlign: 'center'
    //   },
    //   formatter: (cell, row, rowIndex) => {
    //     return <CustomMenu actions={actions} row={row} />;
    //   },
    //   filterRenderer: (onFilter, column) => (
    //     <AButton
    //       className="btn btn-sm mb-1 py-2 w-100"
    //       onClick={handleResetFilters}
    //       style={{ background: '#000', color: '#fff', position: 'relative', top: '2px' }}/>{t('clear_filter')}</AButton>
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
      csvFormatter: column.formatter,
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
        columns={columns}
        dataRangeKey="bookingDate" // for data range filter
        description={t('help_des')}
        getStatistic={props.getHelpStatistic} // for statistic API
        isDateFilterReverse
        selectField="repairId"
        statisticProps={{
          // for statistic API params
          name: 'Help',
          key: 'uiStatus',
          valueSet: {
            // to map params with filter buttons
            total: 'ALL',
            repairing: 'REPAIRING',
            repaired: 'REPAIRED',
            canceled: 'CANCELED'
          }
        }}
        deleteData={props.deleteHelp}
        fetchData={props.getHelps}
        isClearFilter={isClearFilter}
        needLoad={needLoadNewData}
        params={{ sort: 'bookingDate,desc' }}
        searchPlaceholder={t('help_search')}
        setNeedLoad={setNeedLoadNewData}
        supportEdit // for editable and save
        supportMultiDelete
        supportSearch
        supportSelect
        fixedColumns
        title={t('Helps')}
        fullAccessPage={fullAccessPage}
        buttons={[
          // ENHANCE LATER
          // {
          //   type: 'hasData',
          //   class: 'pl-0',
          //   text: t('assignment'),
          //   icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
          //   onClick: (selectedData) => {
          //     setAssignModalShow(true);
          //     setAssignData(selectedData);
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
      <AssignModal //
        modalShow={assignModalShow}
        setModalShow={setAssignModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
        data={assignData}
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
    getHelps: helpActions.getHelps,
    updateMechanic: mechanicActions.updateMechanic,
    getHelpStatistic: helpActions.getHelpStatistic,
    approveMechanic: mechanicActions.approveMechanic,
    blockMechanic: mechanicActions.blockMechanic,
    rejectMechanic: mechanicActions.rejectMechanic,
    deleteHelp: helpActions.deleteHelp
  }
)(HelpManagement);
