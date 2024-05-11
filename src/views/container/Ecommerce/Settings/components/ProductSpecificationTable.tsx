import { EditOutlined, EyeOutlined, MinusCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd/es';
import React, { ReactElement, useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import { unitActions } from '~/state/ducks/units';
import { UnitRespone } from '~/state/ducks/units/actions';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import { Card as BCard } from '~/views/presentation/ui/card/Card';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import ConfirmProductSpecificationModal from '../Modals/ConfirmProductSpecificationModal';
import ViewModalProductSpecification from '../Modals/ViewModalProductSpecification';
import { useLocation } from 'react-use';
import { authSelectors } from '~/state/ducks/authUser';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';

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

type ProductSpecificationProps = {
  getUnits: any;
  createUnit: any;
  deleteUnit: any;
  getRoleBase: any;
};

const ProductSpecification: React.FC<ProductSpecificationProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState<Boolean>(true);
  const [confirmModalShow, setConfirmModalShow] = useState<Boolean>(false);
  const [confirmData, setConfirmData]: any = useState<Array<{ type; id; name? }>>([]);

  const [viewModalShow, setViewModalShow] = useState<Boolean>(false);
  const [dataView, setDataView] = useState<Array<UnitRespone>>([]);

  interface Action {
    icon: JSX.Element;
    text: string;
    onClick: (row: any) => void;
    alterIcon?: any;
    alterText?: any;
    style?: any;
    key?: string;
  }

  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);
  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------
  const disableAction = (row, text, key) => {
    if (key === 'access') return !fullAccessPage;
    switch (text) {
      default:
        return false;
    }
  };

  const actions: Array<Action> = [
    {
      icon: <EyeOutlined />,
      text: t('view_customer'),
      onClick: (row) => {
        setViewModalShow(true);
        setDataView(row);
      }
    },
    {
      icon: <EditOutlined />,
      text: t('edit_customer'),
      key: 'access',
      onClick: (row) => {
        history.push(PATH.CAR_ACCESSORIES_PRODUCT_SPECIFICATION_EDIT.replace(':id', row.id));
      }
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('delete_specification'),
      key: 'access',
      onClick: (row) => {
        setConfirmModalShow(true);
        // setConfirmData([{ type: 'delete', id: row.id, fullName: row.name }]);
        setConfirmData([{ type: 'delete', id: row.id }]);
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
    // props.getSpecification().then((res) => setSpecificationData(res?.content))
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

  let columns: any = [
    {
      dataField: 'index',
      text: t('stt'),
      style: {
        textAlign: 'center',
        minWidth: 80
      },
      headerStyle: { textAlign: 'center', minWidth: 80 },
      sort: false,
      csvExport: false,
      filter: '',
      filterRenderer: '',
      formatter: (cell, row, index) => {
        return ++index;
      }
    },
    {
      dataField: 'name',
      text: t('Unit'),
      style: {
        textAlign: 'center',
        minWidth: 150
      },
      headerStyle: { textAlign: 'center', minWidth: 150 },
      formatter: (cell, row) => {
        return (
          <Link className="text-wrap text-start" to={PATH.CAR_ACCESSORIES_PRODUCT_SPECIFICATION_EDIT.replace(':id', row.id)}>
            {cell}
          </Link>
        );
      }
    },
    {
      dataField: 'shortName',
      text: t('specification_des_name'),
      style: {
        textAlign: 'center',
        minWidth: 180
      },
      headerStyle: { textAlign: 'center', minWidth: 180 }
    },
    {
      dataField: 'description',
      text: t('description'),
      filter: '',
      filterRenderer: '',
      style: {
        textAlign: 'left',
        minWidth: 250
      },
      headerStyle: { textAlign: 'left', minWidth: 250 }
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
    //   formatter: (cell, row, rowIndex) => {
    //     const menu = (
    //       <MenuStyled>
    //         {actions.map((action) => (
    //           <Menu.Item>
    //             <Button
    //               disabled={disableAction(row, action.key, action.key)}
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
    //       <DropdownStyled overlay={menu} placement="bottomCenter">
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
  let myColumns = columns.map((column) => {
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
      csvFormatter: (cell) => {
        return cell ? cell : '-';
      },
      footerAlign: 'center',
      formatter: (cell) => cell || '-',
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  return (
    <div>
      {/* <BCard className="h-100"> */}
      <TableBootstrapHook
        actionColumn={{
          handleResetFilters: handleResetFilters,
          actions: actions || [],
          disableAction: disableAction
        }}
        supportEdit // for editable and save
        title={t('product_specification')}
        columns={myColumns}
        dataRangeKey="joinedDate" // for data range filter
        supportMultiDelete
        supportSelect
        notSupportPagination
        isDataRangeHidden={true}
        selectField="id"
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        deleteData={props.deleteUnit}
        fetchData={props.getUnits}
        isClearFilter={isClearFilter}
        fullAccessPage={fullAccessPage}
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('new_product_specification'),
            onClick: () => {
              history.push(PATH.CAR_ACCESSORIES_PRODUCT_SPECIFICATION_FORM);
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
      {/* </BCard> */}
      <ViewModalProductSpecification //
        data={dataView}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <ConfirmProductSpecificationModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
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
    getUnits: unitActions.getUnits,
    createUnit: unitActions.createUnit,
    deleteUnit: unitActions.deleteUnit
  }
)(ProductSpecification);
