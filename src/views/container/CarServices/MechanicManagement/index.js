import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, EyeOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Image, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { DEFAULT_AVATAR } from '~/configs/default';
import { MECHANIC_STATUS, renderMechanicStatus } from '~/configs/status/car-services/mechanicStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { mechanicActions } from '~/state/ducks/mechanic';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import MapModal from '~/views/container/commons/MapModal';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { API_URL } from '~/configs';

import AddModal from './Modals/AddModal';
import ConfirmModal from './Modals/ConfirmModal';
import EditModal from './Modals/EditModal';
import InviteModal from './Modals/InviteModal';
import TopEmployeeModal from './Modals/TopEmployeeModal';
import ViewModal from './Modals/ViewModal';
import { Rate } from 'antd';

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
  width: 150px;
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

const MechanicsManagement = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [addModalShow, setAddModalShow] = useState(false);

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);

  const [viewModalShow, setViewModalShow] = useState(false);
  const [viewMechanicId, setViewMechanicId] = useState(null);

  const [editModalShow, setEditModalShow] = useState(false);
  const [editMechanicId, setEditMechanicId] = useState(null);

  const [inviteModalShow, setInviteModalShow] = useState(false);
  const [topEmployeeShow, setTopEmployeeShow] = useState(false);

  const [isActiveMember, setIsActiveMember] = useState(false);

  const [mapModal, setMapModal] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);

  const [params, setParams] = useState({ sort: 'joinedDate,desc' });

  const location = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    let disable = false;
    switch (text) {
      case t('approve_join'):
        disable = ![MECHANIC_STATUS.WAITING_FOR_APPROVAL].includes(row.memberStatus);
        break;
      case t('reject'):
        disable = ![MECHANIC_STATUS.WAITING_FOR_APPROVAL].includes(row.memberStatus);
        break;
      case t('edit_mechanic'):
        disable = [MECHANIC_STATUS.WAITING_FOR_APPROVAL, MECHANIC_STATUS.REJECTED].includes(row.memberStatus);
        break;
      default:
        disable = false;
        break;
    }
    return key === 'access' && fullAccessPage ? disable : !fullAccessPage;
  };

  const actions = [
    {
      icon: <CheckCircleOutlined />,
      text: t('approve_join'),
      key: 'access',
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'approve', id: row.profileId, fullName: row.fullName }]);
      }
    },
    {
      icon: <CloseCircleOutlined />,
      key: 'access',
      text: t('reject'),
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'reject', id: row.profileId, fullName: row.fullName }]);
      }
    },
    {
      icon: <EyeOutlined />,
      key: 'view',
      text: t('view_mechanic'),
      onClick: (row) => {
        setIsActiveMember(row.memberStatus === MECHANIC_STATUS.APPROVED);
        setViewMechanicId(row.memberId);
        setViewModalShow(true);
      }
    },
    {
      icon: <EditOutlined />,
      key: 'access',
      text: t('edit_mechanic'),
      onClick: (row) => {
        setEditModalShow(true);
        setEditMechanicId(row.memberId);
      }
    },
    {
      icon: <MinusCircleOutlined />,
      key: 'access',
      text: t('delete_mechanic'),
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'delete', id: row.profileId, fullName: row.fullName }]);
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
      text: t('mechanic_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      formatter: (_, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setIsActiveMember(row.memberStatus === MECHANIC_STATUS.APPROVED);
              setViewMechanicId(row.memberId);
              setViewModalShow(true);
            }}>
            {row.profileId}
          </AButton>
        );
      }
    },
    {
      dataField: 'fullName',
      text: t('fullname'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 185, 'left'),
      style: CustomFixedColumns(200, 200, 185, 'left'),
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setIsActiveMember(row.memberStatus === MECHANIC_STATUS.APPROVED);
              setViewMechanicId(row.memberId);
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
      headerStyle: {
        minWidth: 170,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{formatPhoneWithCountryCode(cell, row?.country?.code)}</span>;
      },
      csvFormatter: (cell, row) => formatPhoneWithCountryCode(cell, row?.country?.code)
    },
    {
      dataField: 'avatar',
      text: t('profile_picture'),
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
      formatter: (cell) => {
        if (cell) {
          let src = !cell.includes('http') ? firstImage(cell) : cell || DEFAULT_AVATAR;
          return cell.includes('http') ? (
            <Image
              preview={{
                mask: <EyeOutlined />
              }}
              width={50}
              src={src}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div className="d-flex justify-content-center">
              <AuthImage
                preview={{
                  mask: <EyeOutlined />
                }}
                width={50}
                isAuth={true}
                src={src}
                // onClick={(e) => e.stopPropagation()}
              />
            </div>
          );
        } else return <span></span>;
      },
      csvFormatter: (cell) => {
        return cell ? firstImage(cell) : API_URL + DEFAULT_AVATAR;
      }
    },
    {
      dataField: 'address',
      text: t('address'),
      sort: false,
      style: {
        minWidth: 250
      },
      filter: '',
      filterRenderer: '',
      formatter: (cell, row) => {
        if (!cell) return '-';
        const address = `${cell?.address || ''} ${cell?.fullAddress || ''}, ${cell?.wards?.name || ''}, ${cell?.district?.name || ''}, ${
          cell?.province?.name || ''
        } ${cell?.zipCode || ''}, ${cell?.country?.nativeName || ''}`
          .split(',')
          .map((segment) => segment.trim())
          .join(', ');
        return (
          <div>
            <p>{address}</p>
            <AButton
              type="link"
              className="pl-0"
              onClick={() => {
                setMapModal(true);
                setMapLocation(address || '');
              }}>
              {t('view_full_map')}
            </AButton>
          </div>
        );
      },
      csvFormatter: (cell) => {
        if (!cell) return '-';
        return `${cell?.address || ''} ${cell?.fullAddress || ''}, ${cell?.wards?.name || ''}, ${cell?.district?.name || ''}, ${
          cell?.province?.name || ''
        } ${cell?.zipCode || ''}, ${cell?.country?.nativeName || ''}`
          .split(',')
          .map((segment) => segment.trim())
          .join(', ');
      }
    },
    {
      dataField: 'joinedDate',
      text: t('joined_date'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateTimeLocal(row.joinedDate)}</span>;
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      },
      csvFormatter: (cell, row) => UtilDate.toDateTimeLocal(row.joinedDate)
    },
    {
      dataField: 'yearsOfExperience',
      text: t('yrs_of_exp'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      }
    },
    {
      dataField: 'raiting',
      sort: false,
      text: t('ratings'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <Rate disabled value={cell} />;
      },
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={[
              {
                value: 1,
                label: <Rate allowHalf disabled value={1} />
              },
              {
                value: 2,
                label: <Rate allowHalf disabled value={2} />
              },
              {
                value: 3,
                label: <Rate allowHalf disabled value={3} />
              },
              {
                value: 4,
                label: <Rate allowHalf disabled value={4} />
              },
              {
                value: 5,
                label: <Rate allowHalf disabled value={5} />
              }
            ]}
          />
        );
      }
    },
    {
      dataField: 'numOfHelps',
      text: t('Helps'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return numberFormatDecimal(cell || 0, '', '');
      }
    },
    {
      dataField: 'roles',
      text: t('position'),
      sort: false,
      style: {
        minWidth: 110,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return t('service_advisor');
      },
      csvFormatter: (cell) => t('service_advisor')
    },
    {
      dataField: 'memberStatus',
      sort: false,
      text: t('status'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderMechanicStatus(cell, t(cell), 'tag')}</div>;
      },
      csvFormatter: (cell) => (cell ? t(cell) : '-'),
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(MECHANIC_STATUS).map((o) => {
              return {
                value: MECHANIC_STATUS[o],
                search: t(MECHANIC_STATUS[o]),
                label: renderMechanicStatus(MECHANIC_STATUS[o], t(MECHANIC_STATUS[o]), 'tag')
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
    //   formatter: (cell, row) => {
    //     const menu = (
    //       <MenuStyled>
    //         {actions.map((action) => (
    //           <Menu.Item>
    //             <Button
    //               disabled={disableAction(row, action.text, action.key)}
    //               className="w-100 d-flex align-items-center"
    //               type="link"
    //               onClick={() => action.onClick(row)}>
    //               {action.icon} &nbsp;
    //               {action.text}
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
        title={t('mechanic_management')}
        description={t('mechanic_des')}
        columns={columns}
        dataRangeKey="joinedDate" // for data range filter
        supportMultiDelete
        getStatistic={props.getMechanicStatistic} // for statistic API
        statisticProps={{
          // for statistic API params
          name: 'Mechanic',
          key: 'memberStatus',
          order: ['total', 'totalActive', 'totalBlocked', 'totalPending'],
          valueSet: {
            // to map params with each filter button
            total: undefined,
            totalActive: MECHANIC_STATUS.APPROVED,
            totalBlocked: MECHANIC_STATUS.REJECTED,
            totalPending: MECHANIC_STATUS.WAITING_FOR_APPROVAL
          }
        }}
        supportSelect
        supportSearch
        // for top employees
        supportTop10
        fixedColumns
        onClickTop10={() => setTopEmployeeShow(true)}
        top10Title={t('top_employees')}
        // for top employees
        selectField={'profileId'}
        searchPlaceholder={t('mechanic_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        deleteData={props.deleteMechanic}
        fetchData={props.getMechanicsList}
        params={{ sort: 'joinedDate,desc', ...params }}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-user-plus" style={{ color: '#000' }}></i>,
            text: t('new_employee'),
            onClick: () => {
              setAddModalShow(true);
            }
          },
          // ENHANCE LATER
          // {
          //   type: 'extra',
          //   text: t('invite_employee'),
          //   icon: <i className="far fa-envelope-open" style={{ color: '#000' }}></i>,
          //   onClick: () => {
          //     setInviteModalShow(true);
          //   }
          // },
          {
            type: 'hasData',
            text: t('approve'),
            icon: <i className="far fa-check-circle" style={{ color: '#000' }}></i>,
            disable: (selectedData) =>
              selectedData.some((item) => item.memberStatus !== MECHANIC_STATUS.WAITING_FOR_APPROVAL) || selectedData.length < 1,
            onClick: (selectedData) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data) => {
                  return { type: 'approve', id: data.profileId, fullName: data.fullName };
                })
              );
            }
          },
          {
            type: 'hasData',
            text: t('reject'),
            icon: <i className="far fa-times-circle" style={{ color: '#000' }}></i>,
            disable: (selectedData) =>
              selectedData.some((item) => item.memberStatus !== MECHANIC_STATUS.WAITING_FOR_APPROVAL) || selectedData.length < 1,
            onClick: (selectedData) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data) => {
                  return { type: 'reject', id: data.profileId, fullName: data.fullName };
                })
              );
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
                  return { type: 'delete', id: data.profileId, fullName: data.fullName };
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
      <InviteModal //
        modalShow={inviteModalShow}
        setModalShow={setInviteModalShow}
      />
      <TopEmployeeModal //
        modalShow={topEmployeeShow}
        setModalShow={setTopEmployeeShow}
      />
      <ConfirmModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <ViewModal //
        id={viewMechanicId}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
        isActiveMember={isActiveMember}
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
    getMechanicsList: mechanicActions.getMechanicsList,
    updateMechanic: mechanicActions.updateMechanic,
    getMechanicStatistic: mechanicActions.getMechanicStatistic,
    approveMechanic: mechanicActions.approveMechanic,
    blockMechanic: mechanicActions.blockMechanic,
    rejectMechanic: mechanicActions.rejectMechanic,
    deleteMechanic: mechanicActions.deleteMechanic
  }
)(MechanicsManagement);
