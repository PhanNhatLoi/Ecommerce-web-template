import { EyeOutlined, MinusCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Menu } from 'antd/es';
import { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import * as PATH from '~/configs/routesConfig';
import {
  PROMOTION_SERVICE_DISCOUNT_TYPE,
  PROMOTION_SERVICE_UI_STATUS,
  renderPromotionServiceStatus
} from '~/configs/status/car-services/promotionServiceStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { servicePromotionActions } from '~/state/ducks/carServices/promotion';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import { CustomFixedColumns } from '../../commons/customFixedColumns';
import { ButtonStyled, DropdownStyled, MenuStyled, WrapTableStyled } from './components/Styles';
import ConfirmModal from './Modals/ConfirmModal';

type CarServicePromotionProps = {
  getServicePromotion: any;
  getRoleBase: any;
};

const CarServicePromotion = (props: CarServicePromotionProps) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [params, setParams] = useState<any>({});

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmData, setConfirmData] = useState<any>([]);

  // ------------------------------
  // FOR VIDEO ACTIONS
  // ------------------------------

  const actions: any = [
    {
      icon: <EyeOutlined />,
      text: t('view'),
      onClick: (row: any) => {
        history.push(PATH.SERVICE_PROMOTION_EDIT_PATH.replace(':id', row?.id));
      }
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('deleteServicePromotion'),
      onClick: (row: any) => {
        setConfirmModalShow(true);
        setConfirmData([{ type: 'delete', id: row.id, fullName: row.name }]);
      }
    }
  ];
  // ------------------------------
  // FOR VIDEO ACTIONS
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
      dataField: 'name',
      text: t('promotionName'),
      fixed: true,
      headerStyle: CustomFixedColumns(250, 250, 35, 'left'),
      style: CustomFixedColumns(250, 250, 35, 'left'),
      formatter: (cell: string, row: any) => {
        return cell ? <Link to={PATH.SERVICE_PROMOTION_EDIT_PATH.replace(':id', row?.id)}>{cell}</Link> : '-';
      }
    },
    {
      dataField: 'promotionType',
      text: t('promotion_type'),
      sort: false,
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 285, 'center'),
      style: CustomFixedColumns(200, 200, 285, 'center'),
      formatter: (cell: string) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderPromotionServiceStatus(cell, t(cell.toLowerCase()), 'tag')}</div>;
      },
      filterRenderer: (onFilter: any, column: { text: string }) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(PROMOTION_SERVICE_DISCOUNT_TYPE).map((o) => {
              return {
                value: PROMOTION_SERVICE_DISCOUNT_TYPE[o],
                search: t(PROMOTION_SERVICE_DISCOUNT_TYPE[o].toLowerCase()),
                label: renderPromotionServiceStatus(
                  PROMOTION_SERVICE_DISCOUNT_TYPE[o],
                  t(PROMOTION_SERVICE_DISCOUNT_TYPE[o].toLowerCase()),
                  'tag'
                )
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'startDate',
      text: t('start_day'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 200,
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return cell ? <span>{UtilDate.toDateTimeLocal(cell)}</span> : '-';
      },
      filterRenderer: (onFilter: any) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'endDate',
      text: t('end_day'),
      style: {
        minWidth: 200,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 200,
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return cell ? <span>{UtilDate.toDateTimeLocal(cell)}</span> : '-';
      },
      filterRenderer: (onFilter: any) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'uiStatus',
      text: t('status'),
      sort: false,
      headerStyle: {
        minWidth: 180,
        textAlign: 'center'
      },
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      formatter: (cell: string, row: any) => {
        return (
          <div className="w-100 status_wrap-nononono">{row.status && renderPromotionServiceStatus(row.status, t(row.status), 'tag')}</div>
        );
      },
      filterRenderer: (onFilter: any, column: { text: string }) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(PROMOTION_SERVICE_UI_STATUS).map((o) => {
              return {
                value: PROMOTION_SERVICE_UI_STATUS[o],
                search: t(PROMOTION_SERVICE_UI_STATUS[o]),
                label: renderPromotionServiceStatus(PROMOTION_SERVICE_UI_STATUS[o], t(PROMOTION_SERVICE_UI_STATUS[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'createdDate',
      text: t('create_day'),
      style: {
        minWidth: 220,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 220,
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return cell ? <span>{UtilDate.toDateLocal(cell)}</span> : '-';
      },
      filterRenderer: (onFilter: any) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'lastModifiedDate',
      text: t('lastModifiedDate'),
      style: {
        minWidth: 220,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 220,
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return cell ? <span>{UtilDate.toDateLocal(cell)}</span> : '-';
      },
      filterRenderer: (onFilter: any) => {
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
    //   headerStyle: {
    //     minWidth: 100,
    //     textAlign: 'center'
    //   },
    //   headerFormatter: ColumnFormat,
    //   formatter: (cell: any, row: any) => {
    //     const menu = (
    //       <MenuStyled>
    //         {actions.map((action: any) => (
    //           <Menu.Item>
    //             <AButton className="w-100 d-flex align-items-center" type="link" onClick={() => action.onClick(row)}>
    //               {row?.status === 'DEACTIVATED' ? (action.alterIcon ? action.alterIcon : action.icon) : action.icon} &nbsp;
    //               {row?.status === 'DEACTIVATED' ? (action.alterText ? action.alterText : action.text) : action.text}
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
    //   classes: 'text-center',
    //   headerClasses: 'ht-custom-header-table text-center',
    //   filterRenderer: () => (
    //     <AButton
    //       className="btn btn-sm mb-1 py-2 w-100"
    //       onClick={handleResetFilters}
    //       style={{ background: '#000', color: '#fff', position: 'relative', top: '2px' }}>
    //       {t('clear_filter')}
    //     </AButton>
    //   )
    // }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------
  const columnsArr = columns.map((column) => {
    return {
      editable: false,
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
      filter: customFilter({ type: FILTER_TYPES.TEXT }),
      filterRenderer: (onFilter: any) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search')} />;
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
    <WrapTableStyled>
      <TableBootstrapHook
        actionColumn={{
          handleResetFilters: handleResetFilters,
          actions: actions || []
          // disableAction: disableAction
        }}
        title={t('Promotions')}
        supportEdit // for editable and save
        columns={columnsArr}
        dataRangeKey="createdDate" // for data range filter
        isDateFilterReverse
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('promotion_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getServicePromotion}
        params={params}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('new_promotion'),
            onClick: () => {
              history.push(PATH.SERVICE_PROMOTION_NEW_PATH);
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
                  return { type: 'delete', id: data.id };
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

      <ConfirmModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
    </WrapTableStyled>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getServicePromotion: servicePromotionActions.getServicePromotion
  }
)(CarServicePromotion);
