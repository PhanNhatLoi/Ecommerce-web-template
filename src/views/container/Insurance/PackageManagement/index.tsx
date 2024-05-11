import { CheckCircleOutlined, EyeOutlined, MinusCircleOutlined, MoreOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import * as PATH from '~/configs/routesConfig';
import { INSURANCE_PACKAGE_TYPE, PACKAGE_STATUS, renderPackageStatus } from '~/configs/status/Insurance/packageStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { packageActions } from '~/state/ducks/insurance/package';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import { ButtonStyled, DropdownStyled, MenuStyled } from './components/Styles';
import ConfirmModal, { ACTION_TYPE } from './Modals/ConfirmModal';

type PackageManagementProps = {
  getPackage: any;
  getPackageStatistic: any;
  getRoleBase: any;
};

const PackageManagement: React.FC<PackageManagementProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState<any>([]);

  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // ------------------------------
  // FOR ACTION
  // ------------------------------

  const disableAction = (row, text, key) => {
    let disable = false;
    switch (text) {
      case t('activate'):
        disable = ![PACKAGE_STATUS.DEACTIVATED].includes(row.status);
        break;
      case t('stop_providing'):
        disable = ![PACKAGE_STATUS.ACTIVATED].includes(row.status);
        break;
      default:
        break;
    }
    return key === 'access' && fullAccessPage ? disable : !fullAccessPage;
  };

  const actions: any = [
    {
      icon: <EyeOutlined />,
      text: t('view_package'),
      onClick: (row) => {
        history.push(PATH.INSURANCE_PACKAGE_VIEW_EDIT_PATH.replace(':id/:action', row.id + '/view'));
      }
    },
    {
      text: t('activate'),
      key: 'access',
      icon: <CheckCircleOutlined />,
      onClick: (row) => {
        setConfirmData([{ type: ACTION_TYPE.UNBLOCK, id: row.id }]);
        setConfirmModalShow(true);
      }
    },
    {
      text: t('stop_providing'),
      key: 'access',
      icon: <StopOutlined />,
      onClick: (row) => {
        setConfirmData([{ type: ACTION_TYPE.BLOCK, id: row.id }]);
        setConfirmModalShow(true);
      }
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('delete'),
      key: 'access',
      disabled: !fullAccessPage,
      onClick: (row) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: ACTION_TYPE.DELETE, id: row.id }]);
      }
    }
  ];
  // ------------------------------
  // FOR ACTION
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
  // ------------------------------
  // FOR COLUMN AND FILTER
  // ------------------------------

  let columns = [
    {
      dataField: 'id',
      text: t('package_id'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 35, 'center'),
      style: CustomFixedColumns(200, 200, 35, 'center'),
      formatter: (cell: string, row: any) => {
        return cell ? <Link to={PATH.INSURANCE_PACKAGE_VIEW_EDIT_PATH.replace(':id/:action', cell + '/view')}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'name',
      text: t('package_name'),
      fixed: true,
      headerStyle: CustomFixedColumns(250, 300, 235, 'left'),
      style: CustomFixedColumns(250, 300, 235, 'left'),
      formatter: (cell: string, row: any) => {
        return cell ? <Link to={PATH.INSURANCE_PACKAGE_VIEW_EDIT_PATH.replace(':id/:action', row.id + '/view')}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'createdDate',
      text: t('date_created'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 100
      },
      formatter: (cell: string) => {
        return <span>{UtilDate.toDateTimeLocal(cell) || '-'}</span>;
      },
      csvFormatter: (cell: string) => {
        return UtilDate.toDateTimeLocal(cell) || '-';
      },
      filterRenderer: (onFilter: any) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'lastModifiedDate',
      text: t('updated_at'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 100
      },
      formatter: (cell: string) => {
        return <span>{UtilDate.toDateTimeLocal(cell) || '-'}</span>;
      },
      csvFormatter: (cell: string) => {
        return UtilDate.toDateTimeLocal(cell) || '-';
      },
      filterRenderer: (onFilter: any) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'packageType',
      text: t('insurancePackageType'),
      headerStyle: {
        minWidth: 250,
        textAlign: 'center'
      },
      style: {
        minWidth: 250,
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderPackageStatus(cell, t(cell), 'tag')}</div>;
      },
      filterRenderer: (onFilter: any, column: { text: string }) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(INSURANCE_PACKAGE_TYPE).map((o) => {
              return {
                value: INSURANCE_PACKAGE_TYPE[o],
                search: t(INSURANCE_PACKAGE_TYPE[o]),
                label: renderPackageStatus(INSURANCE_PACKAGE_TYPE[o], t(INSURANCE_PACKAGE_TYPE[o]), 'tag')
              };
            })}
          />
        );
      },
      sort: false
    },
    {
      dataField: 'status',
      text: t('status'),
      headerStyle: {
        minWidth: 180,
        textAlign: 'center'
      },
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderPackageStatus(cell, t(cell), 'tag')}</div>;
      },
      filterRenderer: (onFilter: any, column: { text: string }) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(PACKAGE_STATUS).map((o) => {
              return {
                value: PACKAGE_STATUS[o],
                search: t(PACKAGE_STATUS[o]),
                label: renderPackageStatus(PACKAGE_STATUS[o], t(PACKAGE_STATUS[o]), 'tag')
              };
            })}
          />
        );
      },
      sort: false
    }
    // {
    //   dataField: 'action',
    //   text: t('actions'),
    //   sort: false,
    //   headerStyle: {
    //     minWidth: 100,
    //     textAlign: 'center'
    //   },
    //   style: {
    //     textAlign: 'center'
    //   },
    //   csvExport: false,
    //   headerFormatter: ColumnFormat,
    //   formatter: (cell: any, row: any) => {
    //     const menu = (
    //       <MenuStyled>
    //         {actions.map((action) => (
    //           <Menu.Item>
    //             <Button
    //               className="w-100 d-flex  align-items-center"
    //               type="link"
    //               onClick={() => action.onClick(row)}
    //               // disabled={disableAction(row?.status, action.text)}
    //             >
    //               {action.icon} &nbsp;
    //               {action.text}
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
    //   filterRenderer: () => (
    //     <button
    //       className="btn btn-sm mb-1 float-right py-2"
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
  let columnsArr = columns.map((column) => {
    return {
      editable: false,
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
      filter: customFilter(),
      filterRenderer: (onFilter: any) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      csvFormatter: (cell: string) => {
        return cell || '-';
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
        title={t('package_insurance')}
        description={''}
        columns={columnsArr}
        dataRangeKey="createdDate" // for data range filter
        isDateFilterReverse
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('package_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getPackage}
        params={{ sort: 'lastModifiedDate,desc' }}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('add_insurance_package'),
            onClick: () => {
              history.push(PATH.INSURANCE_PACKAGE_NEW_PATH);
            }
          },
          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
            onClick: (selectedData: any) => {
              setConfirmData(
                selectedData.map((data) => {
                  return { type: ACTION_TYPE.DELETE, id: data.id };
                })
              );
              setConfirmModalShow(true);
            }
          },
          {
            type: 'hasData',
            text: t('activate'),
            icon: <i className="fas fa-check" style={{ color: '#000' }}></i>,
            disable: (selectedData: any) =>
              selectedData.some((item) => item?.status !== PACKAGE_STATUS.DEACTIVATED) || selectedData?.length < 1,
            onClick: (selectedData: any) => {
              setConfirmData(
                selectedData.map((data) => {
                  return { type: ACTION_TYPE.UNBLOCK, id: data.id };
                })
              );
              setConfirmModalShow(true);
            }
          },
          {
            type: 'hasData',
            text: t('stop_providing'),
            icon: <i className="fas fa-ban" style={{ color: '#000' }}></i>,
            disable: (selectedData: any) =>
              selectedData.some((item) => item?.status !== PACKAGE_STATUS.ACTIVATED) || selectedData?.length < 1,
            onClick: (selectedData: any) => {
              setConfirmData(
                selectedData.map((data) => {
                  return { type: ACTION_TYPE.BLOCK, id: data.id };
                })
              );
              setConfirmModalShow(true);
            }
          },
          {
            type: 'export',
            icon: <i className="fas fa-file-csv" style={{ color: '#000' }}></i>,
            text: t('export_csv'),
            t
          }
        ]}></TableBootstrapHook>

      <ConfirmModal
        data={confirmData}
        setData={setConfirmData}
        modalShow={confirmModalShow}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
    </div>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getPackage: packageActions.getPackage,
    getPackageStatistic: packageActions.getPackageStatistic
  }
)(PackageManagement);
