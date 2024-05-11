import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  StopOutlined,
  WechatOutlined
} from '@ant-design/icons';
import { Image } from 'antd/es';
import { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useLocation } from 'react-use';
import { DEFAULT_AVATAR } from '~/configs/default';
import { MEMBER_STATUS, renderMemberStatus } from '~/configs/status/auto-clubs/memberStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { memberActions } from '~/state/ducks/member';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import AddModal from './Modals/AddModal';
import ChatPermissionModal from './Modals/ChatPermissionModal';
import ConfirmModal from './Modals/ConfirmModal';
import EditModal from './Modals/EditModal';
import InviteModal from './Modals/InviteModal';
import TopMemberModal from './Modals/TopMemberModal';
import ViewModal from './Modals/ViewModal';

const MemberManagement = (props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [addModalShow, setAddModalShow] = useState(false);

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);

  const [chatRoleModalShow, setChatRoleModalShow] = useState(false);
  const [chatRoleData, setChatRoleData] = useState();

  const [viewModalShow, setViewModalShow] = useState(false);
  const [viewRequestId, setViewRequestId] = useState(null);
  const [memberUserId, setMemberUserId] = useState(null);

  const [editModalShow, setEditModalShow] = useState(false);
  const [editMechanicId, setEditMechanicId] = useState(null);

  const [inviteModalShow, setInviteModalShow] = useState(false);
  const [topMemberShow, setTopMemberShow] = useState(false);
  const location = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  const toggleConfirmModal = (type, data, action) => {
    if (['approve'].includes(type)) {
      setLoading(true);
      Promise.all(data.map((item) => action(item?.profileId)))
        .then((res) => {
          setLoading(false);
          setNeedLoadNewData(true);
          AMessage.success(t(`${type}_member_success`));
        })
        .catch((err) => {
          console.error('trandev ~ file: RemoveModal.js ~ line 41 ~ onFinish ~ err', err);
          AMessage.error(t(err.message));
          setLoading(false);
        });
    } else {
      setConfirmModalShow(true);
      setConfirmData(
        data.map((item) => {
          return { type, id: item['profileId'], fullName: item['fullname'] };
        })
      );
    }
  };

  // ------------------------------
  // FOR ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    let disable = false;
    switch (text) {
      case t('approve'):
        disable = ![MEMBER_STATUS.MEMBER_WARNING, MEMBER_STATUS.MEMBER_DANGER].includes(row.status);
        break;
      case t('reject'):
        disable = ![MEMBER_STATUS.MEMBER_WARNING].includes(row.status);
        break;
      case t('block_member'):
        disable = ![MEMBER_STATUS.MEMBER_SUCCESS].includes(row.status);
        break;
      case t('chatRole'):
        disable = ![MEMBER_STATUS.MEMBER_SUCCESS].includes(row.status);
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
      key: 'access',
      text: t('approve'),
      onClick: (row) => toggleConfirmModal('approve', [row], props.approveMember)
    },
    {
      icon: <CloseCircleOutlined />,
      key: 'access',
      text: t('reject'),
      onClick: (row) => toggleConfirmModal('reject', [row], props.rejectMember)
    },
    {
      icon: <EyeOutlined />,
      text: t('view_member'),
      onClick: (row) => {
        setViewModalShow(true);
        setViewRequestId(row.profileId);
        setMemberUserId(row.memberUserId);
      }
    },
    // ENHANCE LATER
    // {
    //   icon: <EditOutlined />,
    //   text: t('edit_member'),
    //   onClick: (row) => {
    //     setEditModalShow(true);
    //     setEditMechanicId(row.profileId);
    //   }
    // },
    {
      icon: <StopOutlined />,
      text: t('block_member'),
      alterText: t('unblock_member'),
      key: 'access',
      onClick: (row) => {
        if (row.status === 'BLOCKED') {
          toggleConfirmModal('unblock', [row]);
        } else {
          toggleConfirmModal('block', [row]);
        }
      }
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('delete_member'),
      key: 'access',
      onClick: (row) => toggleConfirmModal('delete', [row])
    },
    {
      icon: <WechatOutlined />,
      text: t('chatRole'),
      key: 'access',
      onClick: (row) => {
        setChatRoleData([
          {
            ...row,
            chatRole: {
              role: row.memberRole === 'GC_ADMIN',
              allowPublish: false,
              allowUserAction: false
            }
          }
        ]);
        setChatRoleModalShow(true);
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
      dataField: 'text',
      text: t('validate'),
      fixed: true,
      sort: false,
      csvExport: false,
      headerStyle: CustomFixedColumns(200, 200, 35, 'center'),
      style: CustomFixedColumns(200, 200, 35, 'center'),
      filter: '',
      filterRenderer: '',
      formatter: (cell, row) => {
        const buttonItem = [
          {
            label: t('approve'),
            className: 'bg-primary',
            disabled: disableAction(row, t('approve'), 'access'),
            action: () => toggleConfirmModal('approve', [row], props.approveMember)
          },
          {
            label: t('reject'),
            className: 'bg-danger',
            disabled: disableAction(row, t('reject'), 'access'),
            action: () => toggleConfirmModal('reject', [row], props.rejectMember)
          }
        ];
        return (
          <>
            {buttonItem.map((item) => (
              <AButton
                className={`${item.disabled ? '' : item?.className + ' text-white'} rounded mx-1`}
                disabled={item.disabled}
                onClick={item.action}>
                {item.label}
              </AButton>
            ))}
          </>
        );
      }
    },
    {
      dataField: 'profileId',
      text: t('member_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 235, 'center'),
      style: CustomFixedColumns(150, 150, 235, 'center'),
      formatter: (cell, row) => (
        <AButton
          type="link"
          onClick={() => {
            setViewModalShow(true);
            setViewRequestId(row.profileId);
            setMemberUserId(row.memberUserId);
          }}>
          {cell}
        </AButton>
      ),
      csvFormatter: (cell) => {
        return cell;
      }
    },
    {
      dataField: 'fullname',
      text: t('fullName'),
      fixed: true,
      headerStyle: CustomFixedColumns(300, 300, 385, 'left'),
      style: CustomFixedColumns(300, 300, 385, 'left'),
      formatter: (cell, row) => (
        <AButton
          type="link"
          onClick={() => {
            setViewModalShow(true);
            setViewRequestId(row.profileId);
            setMemberUserId(row.memberUserId);
          }}>
          <span
            style={{
              maxWidth: 250,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>
            {cell}
          </span>
        </AButton>
      ),
      csvFormatter: (cell) => {
        return cell;
      }
    },
    {
      dataField: 'phoneNumber',
      text: t('phone_number'),
      style: {
        minWidth: 200
      },
      align: 'center',
      formatter: (cell, row) => {
        return <span>{formatPhoneWithCountryCode(cell)}</span>;
      },
      csvFormatter: (cell) => {
        return formatPhoneWithCountryCode(cell);
      }
    },
    {
      dataField: 'avatar',
      text: t('profile_picture'),
      sort: false,
      style: {
        minWidth: 50,
        justifyContent: 'center'
      },
      align: 'center',
      filter: '',
      filterRenderer: '',
      formatter: (cell) => {
        let src = !cell?.includes('http') ? firstImage(cell) : cell || DEFAULT_AVATAR;
        return (
          cell && (
            <div style={{ justifyContent: 'center', display: 'flex' }}>
              {cell.includes('http') ? (
                <Image
                  preview={{
                    mask: <EyeOutlined />
                  }}
                  width={32}
                  src={src}
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <AuthImage
                  preview={{
                    mask: <EyeOutlined />
                  }}
                  width={32}
                  isAuth={true}
                  src={src}
                  // onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          )
        );
      },
      csvFormatter: (cell) => {
        return cell ? firstImage(cell) : t('no_avatar');
      }
    },
    {
      dataField: 'joinedDate',
      text: t('joined_date'),
      style: {
        minWidth: 100
      },
      align: 'center',
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateTimeLocal(cell)}</span>;
      },
      filterRenderer: (onFilter, column) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      },
      csvFormatter: (cell) => {
        return UtilDate.toDateTimeLocal(cell);
      }
    },
    {
      dataField: 'status',
      text: t('status'),
      sort: false,
      style: {
        minWidth: 100
      },
      align: 'center',
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderMemberStatus(cell, t(cell), 'tag')}</div>;
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
            options={Object.keys(MEMBER_STATUS).map((o) => {
              return {
                value: MEMBER_STATUS[o],
                search: t(MEMBER_STATUS[o]),
                label: renderMemberStatus(MEMBER_STATUS[o], t(MEMBER_STATUS[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'totalRequests',
      text: t('total_requests'),
      style: {
        minWidth: 190
      },
      align: 'center',
      formatter: (cell, row) => {
        return numberFormatDecimal(cell, '', '');
      },
      csvFormatter: (cell) => {
        return cell;
      }
    },
    {
      dataField: 'totalHelps',
      text: t('total_helps'),
      style: {
        minWidth: 170
      },
      align: 'center',
      formatter: (cell, row) => {
        return numberFormatDecimal(cell, '', '');
      },
      csvFormatter: (cell) => {
        return cell;
      }
    },
    {
      dataField: 'totalXims',
      text: t('total_xims'),
      style: {
        minWidth: 150
      },
      align: 'center',
      formatter: (cell, row) => {
        return numberFormatDecimal(cell, '', '');
      },
      csvFormatter: (cell) => {
        return cell;
      }
    }
    // {
    //   dataField: 'action',
    //   text: t('actions'),
    //   style: {
    //     minWidth: 100,
    //     textAlign: 'center'
    //   },
    //   headerStyle: {
    //     minWidth: 100,
    //     textAlign: 'center'
    //   },
    //   sort: false,
    //   align: 'center',
    //   csvExport: false,
    //   headerFormatter: ColumnFormat,
    //   formatter: (cell, row, rowIndex) => {
    //     const menu = (
    //       <MenuStyled>
    //         {actions.map((action) => (
    //           <Menu.Item>
    //             <AButton
    //               disabled={disableAction(row, action.text, action.key)}
    //               className="w-100 d-flex align-items-center"
    //               type="link"
    //               onClick={() => action.onClick(row)}>
    //               {action.icon} &nbsp; {row.status === 'BLOCKED' ? (action.alterText ? action.alterText : action.text) : action.text}
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
        minWidth: 140,
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
        isDateFilterReverse
        title={t('member_management')}
        description={t('member_des')}
        columns={columns}
        dataRangeKey="joinedDate" // for data range filter
        supportMultiDelete
        // for top members
        supportTop10
        onClickTop10={() => setTopMemberShow(true)}
        top10Title={t('top_members')}
        // for top members
        selectField="profileId"
        getStatistic={props.getMemberStatistic} // for statistic API
        statisticProps={{
          // for statistic API params
          name: 'Member',
          key: 'status',
          order: ['total', 'totalActive', 'totalPending', 'totalBlocked'],
          valueSet: {
            // to map params with each filter button
            total: undefined,
            totalActive: 'APPROVED',
            totalBlocked: 'REJECTED',
            totalPending: 'WAITING_FOR_APPROVAL'
          }
        }}
        loading={loading}
        supportSelect
        supportSearch
        fixedColumns
        searchPlaceholder={t('member_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        deleteData={props.deleteMember}
        fetchData={props.getMembers}
        isClearFilter={isClearFilter}
        params={{
          memberRole: 'ROLE_CONSUMER',
          sort: 'lastModifiedDate,desc'
        }}
        fullAccessPage={fullAccessPage}
        buttons={[
          // ENHANCE LATER
          // {
          //   type: 'create',
          //   class: 'pl-0',
          //   icon: <i className="fas fa-user-plus" style={{ color: '#000' }}></i>,
          //   text: t('new_member'),
          //   onClick: () => {
          //     setAddModalShow(true);
          //   }
          // },
          // {
          //   type: 'extra',
          //   text: t('invite_member'),
          //   icon: <i className="far fa-envelope-open" style={{ color: '#000' }}></i>,
          //   onClick: () => {
          //     setInviteModalShow(true);
          //   }
          // },
          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="fas fa-user-times" style={{ color: '#000' }}></i>,
            disable: (selectedData) => selectedData?.length < 1,
            onClick: (selectedData) => {
              toggleConfirmModal('delete', selectedData);
            }
          },
          {
            type: 'hasData',
            text: t('block'),
            icon: <i className="fas fa-ban" style={{ color: '#000' }}></i>,
            disable: (selectedData) =>
              selectedData.some((item) => ![MEMBER_STATUS.MEMBER_SUCCESS].includes(item?.status)) || selectedData?.length < 1,
            onClick: (selectedData) => {
              toggleConfirmModal('block', selectedData);
            }
          },
          {
            type: 'hasData',
            text: t('approve'),
            icon: <i className="far fa-check-circle" style={{ color: '#000' }}></i>,
            disable: (selectedData) =>
              selectedData.some((item) => ![MEMBER_STATUS.MEMBER_WARNING, MEMBER_STATUS.MEMBER_DANGER].includes(item?.status)) ||
              selectedData?.length < 1,
            onClick: (selectedData) => {
              toggleConfirmModal('approve', selectedData, props.approveMember);
            }
          },
          {
            type: 'hasData',
            text: t('reject'),
            icon: <i className="far fa-times-circle" style={{ color: '#000' }}></i>,
            disable: (selectedData) =>
              selectedData.some((item) => ![MEMBER_STATUS.MEMBER_WARNING].includes(item?.status)) || selectedData?.length < 1,
            onClick: (selectedData) => {
              toggleConfirmModal('reject', selectedData, props.rejectMember);
            }
          },
          // {
          //   type: 'hasData',
          //   text: t('chatRole'),
          //   icon: <i className="far fa-comments" style={{ color: '#000' }}></i>,
          //   disable: (selectedData) =>
          //     selectedData.some((item) => ![MEMBER_STATUS.MEMBER_SUCCESS].includes(item?.status)) || selectedData?.length < 1,
          //   onClick: (selectedData) => {
          //     setConfirmData(selectedData);
          //     setChatPermissionModalShow(true);
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
      <InviteModal //
        modalShow={inviteModalShow}
        setModalShow={setInviteModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <TopMemberModal //
        modalShow={topMemberShow}
        setModalShow={setTopMemberShow}
      />
      <ConfirmModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <ChatPermissionModal
        data={chatRoleData}
        setData={setChatRoleData}
        modalShow={chatRoleModalShow}
        setModalShow={setChatRoleModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <ViewModal //
        id={viewRequestId}
        modalShow={viewModalShow}
        memberUserId={memberUserId}
        setModalShow={setViewModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
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
    getMembers: memberActions.getMembers,
    getMemberStatistic: memberActions.getMemberStatistic,
    approveMember: memberActions.approveMember,
    rejectMember: memberActions.rejectMember,
    deleteMember: memberActions.deleteMember
  }
)(MemberManagement);
