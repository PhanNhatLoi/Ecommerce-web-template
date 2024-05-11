import { EditOutlined, EyeOutlined, MinusCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Image, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { DEFAULT_AVATAR } from '~/configs/default';
import * as PATH from '~/configs/routesConfig';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { roleBaseAccessControlActions } from '~/state/ducks/settings/roleAndPermission';
import { userSettingActions } from '~/state/ducks/settings/userSetting';
import { UserManagermentResponse } from '~/state/ducks/settings/userSetting/actions';
import { ActionType, ColumnType } from '~/types';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import ConfirmModal from './Modals/ConfirmModal';
import AButton from '~/views/presentation/ui/buttons/AButton';
import {
  ApproveBtn,
  BackBtn,
  CancelBtn,
  DeclineBtn,
  EditBtn,
  NextBtn,
  PrevBtn,
  ResetBtn,
  SaveAndPrintBtn,
  SubmitBtn
} from '~/views/presentation/table-bootstrap-hook/ActionBtn';

const DropdownStyled: any = styled(Dropdown)`
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

type Props = {
  getUsermanagement: any;
  deleteUsermanagement: any;
  getRoleBase: any;
  getRoleBaseAccessControls: any;
};

const UserManagerment = (props: Props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState<Boolean>(true);
  const [confirmModalShow, setConfirmModalShow] = useState<Boolean>(false);
  const [confirmData, setConfirmData] = useState<{ type: string; id: number }[]>([]);
  const [params, setParams] = useState<{ page?: number; sort?: string }>({ page: 0 });
  const [userDetail, setUserDetail] = useState<UserManagermentResponse>();

  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);
  // ------------------------------
  // FOR ACTIONS
  // ------------------------------

  const disableAction = (row: any, key: string) => {
    if (key === 'access') return !fullAccessPage;
    switch (key) {
      default:
        return false;
    }
  };

  const actionView = (action: ActionType, status: string): React.ReactNode => {
    return (
      <div>
        {action.icon}&nbsp;{action.text}
      </div>
    );
  };

  const actions = [
    {
      key: 'view_details',
      icon: <EyeOutlined />,
      text: t('view_details'),
      onClick: (row: UserManagermentResponse) => {
        history.push(PATH.SETTINGS_ACTIONS_USERS_PATH.replace(':id', `${row.employerUserId}`).replace(':action', 'view'));
      }
    },
    {
      key: 'access',
      text: t('edit'),
      icon: <EditOutlined />,
      onClick: (row: UserManagermentResponse) => {
        history.push(PATH.SETTINGS_ACTIONS_USERS_PATH.replace(':id', `${row.employerUserId}`).replace(':action', 'edit'));
      }
    },
    {
      key: 'access',
      icon: <MinusCircleOutlined />,
      text: t('remove'),
      onClick: (row: UserManagermentResponse) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'delete', id: row.profileId }]);
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

  const formatAddress = (address: string): string => {
    const newAddress = address.split(', ');
    let result: string = '';
    newAddress.forEach((f: string) => {
      if (f !== 'undefined' && f) {
        result += result === '' ? f : ', ' + f;
      }
    });

    return result === '' ? '-' : result;
  };
  // ------------------------------
  // FOR COLUMN AND FILTER
  // ------------------------------

  const handleSort = (field: string, sort: string) => {
    setParams({ sort: `${field},${sort}` });
  };

  let columns = [
    {
      dataField: 'profileId',
      text: t('profile_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 35, 'center'),
      style: CustomFixedColumns(150, 150, 35, 'center'),
      formatter: (cell: string, row: UserManagermentResponse) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              history.push(PATH.SETTINGS_ACTIONS_USERS_PATH.replace(':action/:id', `view/${row.employerUserId}`));
            }}>
            {cell}
          </AButton>
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'email',
      text: t('email'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 185, 'center'),
      style: CustomFixedColumns(200, 200, 185, 'center'),
      formatter: (cell: string, row: UserManagermentResponse) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              history.push(PATH.SETTINGS_ACTIONS_USERS_PATH.replace(':action/:id', `view/${row.employerUserId}`));
            }}>
            {cell}
          </AButton>
        ) : (
          '-'
        );
      }
    },
    // {
    //   dataField: 'employerUserId',
    //   text: t('employer_user_id'),
    //   fixed: true
    // },
    // {
    //   dataField: 'vendorUserId',
    //   text: t('vendor_user_id'),
    //   fixed: true
    // },
    {
      dataField: 'code',
      text: t('user_code'),
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 180, textAlign: 'center' }
    },
    {
      dataField: 'fullName',
      text: t('fullName'),
      formatter: (cell: string) => {
        return cell ? cell : '-';
      },
      style: {
        minWidth: 200,
        textAlign: 'left'
      },
      headerStyle: { minWidth: 200, textAlign: 'left' }
    },
    {
      dataField: 'avatar',
      text: t('avatar'),
      filter: '',
      filterRenderer: '',
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 150, textAlign: 'center' },
      csvFormatter: () => '',
      sort: false,
      formatter: (cell: string) => {
        if (cell) {
          let src = !cell.includes('http') ? firstImage(cell) : cell || DEFAULT_AVATAR;
          return cell.includes('http') ? (
            <div className=" d-flex justify-content-center">
              <Image
                preview={{
                  mask: <EyeOutlined />
                }}
                width={50}
                src={src}
                style={{ objectFit: 'contain' }}
              />
            </div>
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
        } else return '-';
      }
    },
    {
      dataField: 'rolePageId',
      text: t('role_name'),
      sort: false,
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 150, textAlign: 'center' },
      formatter: (cell, row) => {
        return row?.rolePageName || '-';
      },
      filter: customFilter(),
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            fetchData={props.getRoleBaseAccessControls}
            valueProperty="id"
            labelProperty="name"
            searchCorrectly={false}
          />
        );
      }
    },
    {
      dataField: 'phone',
      text: t('phone'),
      formatter: (cell: string) => {
        return cell ? cell : '-';
      },
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 150, textAlign: 'center' }
    },
    {
      dataField: 'address',
      text: t('address'),
      sort: false,
      formatter: (cell: string) => {
        return cell ? formatAddress(cell) : '-';
      },
      style: {
        minWidth: 200,
        textAlign: 'left'
      },
      headerStyle: { minWidth: 200, textAlign: 'left' },
      filter: '',
      filterRenderer: ''
    },
    {
      dataField: 'joinDate',
      text: t('join_date'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 150, textAlign: 'center' },
      formatter: (cell: Date) => {
        return cell ? <span>{UtilDate.toDateTimeLocal(cell)}</span> : '-';
      },
      csvFormatter: (cell: Date) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '-';
      },
      filterRenderer: (onFilter: boolean) => {
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
    //   headerStyle: { minWidth: 100, textAlign: 'center' },
    //   csvExport: false,
    //   headerFormatter: ColumnFormat,
    //   formatter: (cell: string, row: any) => {
    //     const menu = (
    //       <MenuStyled>
    //         {actions.map((action: any) => (
    //           <Menu.Item>
    //             <Button
    //               disabled={disableAction(row, action.key)}
    //               className="w-100 d-flex align-items-center"
    //               type="link"
    //               onClick={() => action.onClick(row)}>
    //               {actionView(action, row.status)}
    //             </AButton>
    //           </Menu.Item>
    //         ))}
    //       </MenuStyled>
    //     );
    //     return (
    //       <DropdownStyled overlay={menu} placement="bottomCenter" trigger={['click']}>
    //         <ButtonStyled type="link" size="large" style={{ fontSize: '24px' }} icon={<MoreOutlined />} />
    //       </DropdownStyled>
    //     );
    //   },
    //   classes: 'text-center pr-0',
    //   headerClasses: 'ht-custom-header-table pr-3',
    //   filterRenderer: () => (
    //     <button
    //       className="btn btn-sm mb-1 py-2"
    //       onClick={handleResetFilters}
    //       style={{ background: '#000', color: '#fff', position: 'relative', top: '2px' }}>
    //       {t('clear_filter').toString()}
    //     </button>
    //   )
    // }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------
  const newColumns = columns.map((column) => {
    return {
      editable: false,
      headerClasses: 'ht-custom-header-table',
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      onSort: handleSort,
      headerFormatter: ColumnFormat,
      filter: customFilter({}),
      filterRenderer: (onFilter: Boolean, column: ColumnType) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      csvFormatter: (cell: string) => {
        return cell ? cell : '-';
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
        title={t('user_management')}
        description={t('user_management_des')}
        columns={newColumns}
        dataRangeKey="joinDate" // for data range filter
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="employerUserId"
        searchPlaceholder={t('user_management_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getUsermanagement}
        params={params}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('create_new_user'),
            onClick: () => {
              history.push(PATH.SETTINGS_NEW_USERS_PATH);
            }
          },
          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
            onClick: (selectedData: UserManagermentResponse[]) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data: UserManagermentResponse) => {
                  return { type: 'delete', id: data.profileId };
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

      <ConfirmModal
        setNeedLoadNewData={setNeedLoadNewData}
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
      />
      {/* MODALS */}
    </div>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getUsermanagement: userSettingActions.getUserManagerment,
    deleteUsermanagement: userSettingActions.deleteUserManagerment,
    getRoleBaseAccessControls: roleBaseAccessControlActions.getRoleBaseAccessControls
  }
)(UserManagerment);
