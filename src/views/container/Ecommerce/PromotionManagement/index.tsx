import { EyeOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Segmented } from 'antd/es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import { PROMOTION_STATUS, renderPromotionStatus } from '~/configs/status/car-accessories/promotionStatus';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { PROMOTION_TYPE, renderPromotionType } from '~/configs/type/promotionType';
import { authSelectors } from '~/state/ducks/authUser';
import { promotionActions } from '~/state/ducks/promotion';
import { PromotionResponse } from '~/state/ducks/promotion/actions';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import DateRangeFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/DateRangeFilter';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import COLOR from '~/views/utilities/layout/color';

import ConfirmModal from '../../commons/ConfirmDeleteModal';
import ViewModal from './Modals/ViewModal';
import * as Types from './Type';

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

const ButtonStyled = styled(AButton)`
  .anticon {
    position: relative !important;
    bottom: 8px !important;
  }
`;

const MenuStyled = styled(Menu)`
  background-color: #000;
  padding: 16px 8px;
  border-radius: 5px;
  width: 200px;
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

  .ant-dropdown-menu-item {
    font-size: 12px;
    color: #fff;
  }
  .ant-dropdown-menu-item:hover {
    color: #000;
  }
`;

const SegmentedStyled: any = styled(Segmented)`
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';
  display: inline-block;
  padding: 2px;
  color: rgba(0, 0, 0, 0.65);
  background-color: #ffff !important;
  border-radius: 36px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  // ant custom design
  .ant-segmented {
    border-radius: 36px;
    background: rgba(32, 127, 167, 0.1);
  }

  .ant-segmented-item {
    color: ${COLOR.systemColor};
    border-radius: 36px;
    padding: 6px 16px 6px 16px;
    margin: -1px;
  }
  .ant-segmented-item-selected {
    background-color: ${COLOR.systemColor};
    color: ${COLOR.white};
  }
  .ant-segmented-thumb-motion {
    background-color: ${COLOR.systemColor};
    border-radius: 36px;
  }
  // ant custom design
`;

const PromotionGeneral = (props: {
  getPromotions: (params: { obj?: {}; startWith?: string }) => void;
  deletePromotion: (id: number) => void;
  getRoleBase: any;
}) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState<boolean>(true);
  const [confirmModalShow, setConfirmModalShow] = useState<boolean>(false);
  const [confirmData, setConfirmData] = useState<Types.confirmType[]>([]);
  const [viewModalShow, setViewModalShow] = useState<boolean>(false);
  const [PromotionDetail, setPromotionDetail] = useState<PromotionResponse>();
  const [viewEdit, setViewEdit] = useState<boolean>(false);
  const [params, setParams] = useState<Types.paramType>({
    sort: 'createdDate,desc'
  });
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);
  const items = [
    {
      value: 'DISCOUNT',
      label: t('discount')
      // className: 'ant-custom-segmented'
    },
    {
      value: PROMOTION_TYPE.COUPON_DISCOUNT,
      label: t('coupon')
      // className: 'ant-custom-segmented'
    }
  ];
  // ------------------------------
  // FOR ACTIONS
  // ------------------------------

  const actions = [
    {
      key: 'view_details',
      icon: <EyeOutlined />,
      label: t('view_details'),
      onClick: () => {
        setViewEdit(false);
        setViewModalShow(true);
      }
    },
    {
      key: 'delete_promotion',
      icon: <MinusCircleOutlined />,
      disabled: !fullAccessPage,
      label: t('delete'),
      onClick: () => {
        setConfirmModalShow(true);
      }
    }
  ];
  // ------------------------------
  // FOR ACTIONS
  // ------------------------------

  // ------------------------------
  // FOR COLUMN AND FILTER
  // ------------------------------
  const [isClearFilter, setIsClearFilter] = useState<boolean>(false);
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

  const columnsPromotion = [
    {
      dataField: 'code',
      text: t('promotion_code'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 35, 'center'),
      style: CustomFixedColumns(200, 200, 35, 'center'),
      formatter: (cell: string, row: PromotionResponse) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              setPromotionDetail(row || null);
              setViewModalShow(true);
              setViewEdit(false);
            }}>
            {cell}
          </AButton>
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'name',
      text: t('promotionName'),
      fixed: true,
      headerStyle: CustomFixedColumns(300, 300, 235, 'left'),
      style: CustomFixedColumns(300, 300, 235, 'left'),
      formatter: (cell: string, row: PromotionResponse) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              setPromotionDetail(row || null);
              setViewModalShow(true);
              setViewEdit(false);
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
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'createdDate',
      text: t('create_day'),
      formatter: (cell: Date) => {
        return cell ? <span>{UtilDate.toDateTimeLocal(cell)}</span> : '-';
      },
      csvFormatter: (cell: Date) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '-';
      },
      filterRenderer: (onFilter: boolean) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'startDate',
      text: t('start_day'),
      formatter: (cell: Date) => {
        return cell ? <span>{UtilDate.toDateTimeLocal(cell)}</span> : '-';
      },
      csvFormatter: (cell: Date) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '-';
      },
      filterRenderer: (onFilter: boolean) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'endDate',
      text: t('end_day'),
      formatter: (cell: Date, row: PromotionResponse) => {
        const unlimitTime = new Date(row?.endDate).getFullYear() === 9999 ? true : false;
        return !unlimitTime ? <span>{UtilDate.toDateTimeLocal(cell)}</span> : t('unlimited');
      },
      csvFormatter: (cell: Date, row: PromotionResponse) => {
        const unlimitTime = new Date(row?.endDate).getFullYear() === 9999 ? true : false;
        return !unlimitTime ? UtilDate.toDateTimeLocal(cell) : t('unlimited');
      },
      filterRenderer: (onFilter: boolean) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'promotionType',
      text: t('promotion_type'),
      formatter: (cell: string) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderPromotionType(cell, t(cell), 'tag')}</div>;
      },
      sort: null,
      csvFormatter: (cell: string) => {
        return cell ? t(cell) : '-';
      },
      filterRenderer: (onFilter: boolean, column: Types.columnType) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(PROMOTION_TYPE).map((o) => {
              return {
                key: PROMOTION_TYPE[o],
                value: PROMOTION_TYPE[o],
                search: t(PROMOTION_TYPE[o]),
                label: renderPromotionType(PROMOTION_TYPE[o], t(PROMOTION_TYPE[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'status',
      text: t('status'),
      formatter: (cell: string, row: any) => {
        let newStatus = row.status;
        if (newStatus && moment().isAfter(row.endDate)) {
          newStatus = PROMOTION_STATUS.EXPIRED;
        }
        return <div className="w-100 status_wrap-nononono">{newStatus && renderPromotionStatus(newStatus, t(newStatus), 'tag')}</div>;
      },
      sort: null,
      csvFormatter: (cell: string, row: any) => {
        let newStatus = row.status;
        if (newStatus && moment().isAfter(row.endDate)) {
          newStatus = PROMOTION_STATUS.EXPIRED;
        }
        return newStatus ? t(newStatus) : '-';
      },
      filterRenderer: (onFilter: boolean, column: Types.columnType) => {
        const { APPROVED, ...NEW_PROMOTION_STATUS } = PROMOTION_STATUS;
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(NEW_PROMOTION_STATUS).map((o) => {
              return {
                key: NEW_PROMOTION_STATUS[o],
                value: NEW_PROMOTION_STATUS[o],
                search: t(NEW_PROMOTION_STATUS[o]),
                label: renderPromotionStatus(NEW_PROMOTION_STATUS[o], t(NEW_PROMOTION_STATUS[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'quantityUsed',
      text: t('number_applied'),
      filter: '',
      filterRenderer: '',
      style: {
        minWidth: 170,
        textAlign: 'center'
      },
      formatter: (cell: number) => {
        return cell ? <span>{cell}</span> : '0';
      }
    },
    {
      dataField: 'action',
      text: t('actions'),
      sort: false,
      style: {
        minWidth: 130,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 130,
        textAlign: 'center'
      },
      csvExport: false,
      headerFormatter: ColumnFormat,
      formatter: (cell: any, row: PromotionResponse) => {
        const menu = <MenuStyled items={actions} />;
        return (
          <DropdownStyled overlay={menu} placement="bottom" trigger={['click']}>
            <ButtonStyled
              onClick={() => {
                setPromotionDetail(row || null);
                setConfirmData([{ type: 'delete', id: row.id } || null]);
              }}
              type="link"
              size="large"
              style={{ fontSize: '24px' }}
              icon={<SVG src={toAbsoluteUrl('/media/svg/icons/Tools/More.svg')} />}
            />
          </DropdownStyled>
        );
      },
      classes: 'text-center pr-0',
      headerClasses: 'ht-custom-header-table pr-3',
      filterRenderer: () => (
        <AButton
          onClick={handleResetFilters}
          className="btn btn-sm py-2 w-100"
          style={{
            borderRadius: '8px',
            background: COLOR.Primary,
            color: COLOR.White,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <span className="svg-icon svg-icon-md svg-icon-white">
            <SVG src={toAbsoluteUrl('/media/svg/icons/Tools/Trash.svg')} />
          </span>
          &nbsp;
          {t('clear_filter')}
        </AButton>
      )
    }
  ];

  const colunmsDiscount = [
    {
      dataField: 'code',
      text: t('promotion_code'),
      fixed: true,
      headerStyle: CustomFixedColumns(200, 200, 35, 'center'),
      style: CustomFixedColumns(200, 200, 35, 'center'),
      formatter: (cell: string, row: PromotionResponse) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              setPromotionDetail(row || null);
              setViewModalShow(true);
              setViewEdit(false);
            }}>
            {cell}
          </AButton>
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'name',
      text: t('promotionName'),
      fixed: true,
      headerStyle: CustomFixedColumns(300, 300, 235, 'left'),
      style: CustomFixedColumns(300, 300, 235, 'left'),
      formatter: (cell: string, row: PromotionResponse) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              setPromotionDetail(row || null);
              setViewModalShow(true);
              setViewEdit(false);
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
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'createdDate',
      text: t('create_day'),
      formatter: (cell: Date) => {
        return cell ? <span>{UtilDate.toDateTimeLocal(cell)}</span> : '-';
      },
      csvFormatter: (cell: Date) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '-';
      },
      filterRenderer: (onFilter: boolean) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'startDate',
      text: t('start_day'),
      formatter: (cell: Date) => {
        return cell ? <span>{UtilDate.toDateTimeLocal(cell)}</span> : '-';
      },
      csvFormatter: (cell: Date) => {
        return cell ? UtilDate.toDateTimeLocal(cell) : '-';
      },
      filterRenderer: (onFilter: boolean) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'endDate',
      text: t('end_day'),
      formatter: (cell: Date, row: PromotionResponse) => {
        const unlimitTime = new Date(row?.endDate).getFullYear() === 9999 ? true : false;
        return !unlimitTime ? <span>{UtilDate.toDateTimeLocal(cell)}</span> : t('unlimited');
      },
      csvFormatter: (cell: Date, row: PromotionResponse) => {
        const unlimitTime = new Date(row?.endDate).getFullYear() === 9999 ? true : false;
        return !unlimitTime ? UtilDate.toDateTimeLocal(cell) : t('unlimited');
      },
      filterRenderer: (onFilter: boolean) => {
        return <DateRangeFilter isClearFilter={isClearFilter} onFilter={onFilter} />;
      }
    },
    {
      dataField: 'status',
      text: t('status'),
      formatter: (cell: string, row: any) => {
        let newStatus = row.status;
        if (newStatus && moment().isAfter(row.endDate)) {
          newStatus = PROMOTION_STATUS.EXPIRED;
        }
        return <div className="w-100 status_wrap-nononono">{newStatus && renderPromotionStatus(newStatus, t(newStatus), 'tag')}</div>;
      },
      sort: null,
      csvFormatter: (cell: string, row: any) => {
        let newStatus = row.status;
        if (newStatus && moment().isAfter(row.endDate)) {
          newStatus = PROMOTION_STATUS.EXPIRED;
        }
        return newStatus ? t(newStatus) : '-';
      },
      filterRenderer: (onFilter: boolean, column: Types.columnType) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(PROMOTION_STATUS).map((o) => {
              return {
                key: PROMOTION_STATUS[o],
                value: PROMOTION_STATUS[o],
                search: t(PROMOTION_STATUS[o]),
                label: renderPromotionStatus(PROMOTION_STATUS[o], t(PROMOTION_STATUS[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'quantityUsed',
      text: t('number_applied'),
      filter: '',
      filterRenderer: '',
      style: {
        minWidth: 170,
        textAlign: 'center'
      },
      formatter: (cell: number) => {
        return cell ? <span>{cell}</span> : '0';
      }
    },
    {
      dataField: 'action',
      text: t('actions'),
      sort: false,
      style: {
        minWidth: 130,
        textAlign: 'center'
      },
      headerStyle: {
        minWidth: 130,
        textAlign: 'center'
      },
      csvExport: false,
      headerFormatter: ColumnFormat,
      formatter: (cell: any, row: PromotionResponse) => {
        const menu = <MenuStyled items={actions} />;
        return (
          <DropdownStyled overlay={menu} placement="bottom" trigger={['click']}>
            <ButtonStyled
              onClick={() => {
                setPromotionDetail(row || null);
                setConfirmData([{ type: 'delete', id: row.id } || null]);
              }}
              type="link"
              size="large"
              style={{ fontSize: '24px' }}
              icon={<SVG src={toAbsoluteUrl('/media/svg/icons/Tools/More.svg')} />}
            />
          </DropdownStyled>
        );
      },
      classes: 'text-center pr-0',
      headerClasses: 'ht-custom-header-table pr-3',
      filterRenderer: () => (
        <AButton
          onClick={handleResetFilters}
          className="btn btn-sm py-2 w-100"
          style={{
            borderRadius: '8px',
            background: COLOR.Primary,
            color: COLOR.White,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <span className="svg-icon svg-icon-md svg-icon-white">
            <SVG src={toAbsoluteUrl('/media/svg/icons/Tools/Trash.svg')} />
          </span>
          &nbsp;
          {t('clear_filter')}
        </AButton>
      )
    }
  ];

  const handleChangeTab = (e: any) => {
    setTimeout(() => {
      if (e === PROMOTION_TYPE.COUPON_DISCOUNT)
        setParams((pre) => {
          return {
            ...pre,
            promotionType: PROMOTION_TYPE.COUPON_DISCOUNT
          };
        });
      else {
        setParams({ size: 10, page: 0, sort: 'lastModifiedDate,desc' });
      }
      setIsClearFilter(true);
    }, 500);
  };
  //-------------------------
  // COMMON property column
  //-------------------------
  const newColumns = () => {
    const columns = params.promotionType !== PROMOTION_TYPE.COUPON_DISCOUNT ? columnsPromotion : colunmsDiscount;

    const returnColumns = columns.map((column: Types.columnType) => {
      return {
        headerStyle: {
          minWidth: 170,
          textAlign: 'center'
        },
        editable: false,
        sort: true,
        isClearFilter: isClearFilter,
        sortCaret: sortCaret,
        headerClasses: 'ht-custom-header-table',
        headerFormatter: ColumnFormat,
        filter: customFilter(),
        filterRenderer: (onFilter) => {
          return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
        },
        csvFormatter: (cell) => {
          return cell ? cell : '-';
        },
        style: {
          minWidth: 180,
          textAlign: 'center'
        },
        ...column
      };
    });
    return returnColumns;
  };

  //-------------------------
  // COMMON property column
  //-------------------------

  return (
    <React.Fragment>
      <TableBootstrapHook
        isDateFilterReverse
        supportEdit // for editable and save
        title={<SegmentedStyled defaultValue="DISCOUNT" size="large" onChange={(e) => handleChangeTab(e)} options={items} />}
        columns={newColumns()}
        dataRangeKey="createdDate" // for data range filter
        supportMultiDelete
        supportSelect
        supportSearch
        fixedColumns
        selectField="id"
        searchPlaceholder={t('promotion_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getPromotions}
        params={params}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: params.promotionType ? t('new_coupon') : t('new_promotion'),
            onClick: () => {
              if (params.promotionType) history.push(PATH.CAR_ACCESSORIES_COUPON_NEW_PATH);
              else history.push(PATH.CAR_ACCESSORIES_DISCOUNT_NEW_PATH);
            }
          },
          {
            type: 'hasData',
            text: t('delete'),
            icon: <i className="far fa-trash-alt" style={{ color: '#000' }}></i>,
            onClick: (selectedData) => {
              setConfirmModalShow(true);
              setConfirmData(
                selectedData.map((data: Types.confirmType) => {
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

      {/* MODALS */}

      <ViewModal //
        data={PromotionDetail}
        fullAccessPage={fullAccessPage}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
        isEditing={viewEdit}
        setViewEdit={setViewEdit}
      />

      <ConfirmModal
        text="promotion"
        setNeedLoadNewData={setNeedLoadNewData}
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        action={props.deletePromotion}
      />
      {/* MODALS */}
    </React.Fragment>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getPromotions: promotionActions.getPromotions,
    deletePromotion: promotionActions.deletePromotion
  }
)(PromotionGeneral);
