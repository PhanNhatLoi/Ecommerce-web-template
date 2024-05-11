import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Dropdown, Button, Menu } from 'antd/es';
import { EyeOutlined, MoreOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import * as PATH from '~/configs/routesConfig';
import TableBootstrap from '~/views/presentation/table-bootstrap-hook';
import { roleBaseAccessControlActions } from '~/state/ducks/settings/roleAndPermission';
import ConfirmModal from './Modals/ConfirmModal';
import { useLocation } from 'react-use';
import { authSelectors } from '~/state/ducks/authUser';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import AButton from '~/views/presentation/ui/buttons/AButton';

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
  getRoleBase: any;
  deleteRoleBase: any;
  getRoleBaseAccess: any;
};

const RoleBaseManagerment = (props: Props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState<{ type: 'remove'; id: string }[]>([]);
  const [params, setParams] = useState({ sort: 'lastModifiedDate,desc' });
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBaseAccess);
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

  type actionType = {
    key: string;
    icon: React.ReactNode;
    alterIcon?: React.ReactNode;
    text: string;
    alterText?: string;
    onClick: () => void;
  };

  const actionView = (action: actionType, status: string): React.ReactNode => {
    return (
      <div>
        {action.icon}&nbsp;{action.text}
      </div>
    );
  };

  const actions = [
    {
      key: 'view_detail',
      icon: <EyeOutlined />,
      text: t('view_detail/edit'),
      onClick: (row: any) => {
        history.push(PATH.SETTINGS_VIEW_ROLES_AND_PERMISSION_PATH.replace(':id', String(row.id)));
      }
    },
    {
      key: 'access',
      icon: <MinusCircleOutlined />,
      text: t('remove'),
      onClick: (row: any) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'remove', id: row.id }]);
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

  const handleSort = (field: string, sort: string) => {
    setParams({ sort: `${field},${sort}` });
  };

  let columns = [
    {
      dataField: 'id',
      text: t('id'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      filter: '',
      filterRenderer: ''
    },
    {
      dataField: 'name',
      text: t('role_name'),
      filter: '',
      filterRenderer: '',
      formatter: (cell: string, row: any) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              history.push(PATH.SETTINGS_VIEW_ROLES_AND_PERMISSION_PATH.replace(':id', String(row.id)));
            }}>
            {cell}
          </AButton>
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'description',
      text: t('description'),
      filter: '',
      filterRenderer: '',
      style: {
        minWidth: 100,
        textAlign: 'left'
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
    //   csvText: ``,
    //   csvFormatter: () => ``,
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
      headerStyle: {
        textAlign: 'center'
      },
      editable: false,
      headerClasses: 'ht-custom-header-table',
      formatter: (cell: string) => {
        return cell ? <span>{cell}</span> : '-';
      },
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      onSort: handleSort,
      headerFormatter: ColumnFormat,
      // filter: customFilter({}),

      csvFormatter: (cell: string) => {
        return cell ? cell : '-';
      },
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  return (
    <div>
      <TableBootstrap
        actionColumn={{
          handleResetFilters: handleResetFilters,
          actions: actions || [],
          disableAction: disableAction
        }}
        isDateFilterReverse
        supportEdit // for editable and save
        title={t('role_base')}
        description={t('role_base_des')}
        columns={newColumns}
        dataRangeKey="createdDate" // for data range filter
        supportMultiDelete
        supportSelect
        supportSearch
        selectField="id"
        isDataRangeHidden={true}
        searchPlaceholder={t('role_base_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getRoleBase}
        params={params}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            text: t('create_role_base'),
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            onClick: () => {
              history.push(PATH.SETTINGS_NEW_ROLES_AND_PERMISSION_PATH);
            }
          },
          {
            type: 'hasData',
            text: t('delete'),
            disabled: false,
            icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
            onClick: (selectedData) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data: any) => {
                  return { type: 'remove', id: data.id };
                })
              );
            }
          }
          // {
          //   type: 'hasData',
          //   text: t('remove'),
          //   disabled: false,
          //   icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
          //   onClick: (selectedData: any) => {
          //     setConfirmModalShow(true);
          //     setConfirmData(
          //       selectedData.map((data: any) => {
          //         return { type: 'remove', id: data.id };
          //       })
          //     );
          //   }
          // }
        ]}></TableBootstrap>

      {/* MODALS */}

      <ConfirmModal
        text="role_base_access_control"
        setNeedLoadNewData={setNeedLoadNewData}
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        action={props.deleteRoleBase}
      />
      {/* MODALS */}
    </div>
  );
};

export default connect(
  (state: any) => ({
    getRoleBaseAccess: authSelectors.getRoleBase(state)
  }),
  {
    getRoleBase: roleBaseAccessControlActions.getRoleBaseAccessControls,
    deleteRoleBase: roleBaseAccessControlActions.deleteRoleBaseAccessControl
  }
)(RoleBaseManagerment);

// TableBootstrap
//SETTINGS_VIEW_ROLES_AND_PERMISSION_PATH

//SETTINGS_NEW_ROLES_AND_PERMISSION_PATH
