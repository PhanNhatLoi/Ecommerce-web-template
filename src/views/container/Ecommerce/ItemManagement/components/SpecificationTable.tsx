import { EyeOutlined, MinusCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { customerActions } from '~/state/ducks/customer';
import { specificationActions } from '~/state/ducks/specification';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { Card as BCard } from '~/views/presentation/ui/card/Card';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import ConfirmSpecificationModal from '../Modals/ConfirmSpecificationModal';
import EditSpecificationModal from '../Modals/EditSpecificationModal';
import ViewSpecificationModal from '../Modals/ViewSpecificationModal';

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

const SpecificationTable = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState<Boolean>(true);
  const [confirmModalShow, setConfirmModalShow] = useState<Boolean>(false);
  const [confirmData, setConfirmData] = useState<Array<{ type; id; name? }>>([]);

  const [viewModalShow, setViewModalShow] = useState<Boolean>(false);
  const [renderModal, setRenderModal] = useState(0);
  const [viewSpecificationId, setViewSpecificationId] = useState(null);

  const [editModalShow, setEditModalShow] = useState<Boolean>(false);
  const [editItemId, setEditItemId] = useState(null);

  const [customerOrderId, setCustomerOrderId] = useState(null);
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  // const [params, setParams] = useState({});

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

  const actions = [
    {
      icon: <EyeOutlined />,
      text: t('view_customer'),
      onClick: (row) => {
        history.push(PATH.CAR_ACCESSORIES_SPECIFICATION_EDIT_PATH.replace(':id', row.id));
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

  let columns = [
    {
      dataField: 'id',
      text: 'id',
      hidden: true,
      style: {
        minWidth: 100,
        textAlign: 'center'
      }
    },
    {
      dataField: 'specificationCode',
      text: t('specification_code')
      // sort : true,
    },
    {
      dataField: 'specificationName',
      text: t('specification_name'),
      // sort: false,
      style: {
        textAlign: 'center',
        minWidth: 80
      }
    },
    {
      dataField: 'exchangeValue',
      text: t('specification_exchange_value'),
      filter: '',
      filterRenderer: ''
    },
    {
      dataField: 'exchangeUnit',
      text: t('specification_exchange_unit'),
      filter: '',
      filterRenderer: ''
    },

    {
      dataField: 'action',
      text: t('item_action'),
      sort: false,
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      csvText: ``,
      csvFormatter: () => ``,
      formatter: (cell, row, rowIndex) => {
        const menu = (
          <MenuStyled>
            {actions.map((action) => (
              <Menu.Item>
                <AButton
                  disabled={disableAction(row, action.text, action.key)}
                  className="w-100 d-flex align-items-center"
                  type="link"
                  onClick={() => action.onClick(row)}>
                  {action.icon} &nbsp;
                  {action.text}
                </AButton>
              </Menu.Item>
            ))}
          </MenuStyled>
        );

        return (
          <DropdownStyled overlay={menu} placement="bottomCenter">
            <ButtonStyled type="link" size="large" style={{ fontSize: '24px' }} icon={<MoreOutlined />} />
          </DropdownStyled>
        );
      },
      classes: 'text-center pr-0',
      headerClasses: 'ht-custom-header-table pr-3',
      filterRenderer: (onFilter, column) => (
        <AButton
          className="btn btn-sm mb-1 float-right py-2"
          onClick={handleResetFilters}
          style={{ background: '#000', color: '#fff', position: 'relative', top: '2px' }}>
          {t('clear_filter')}
        </AButton>
      )
    }
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
      style: {
        minWidth: 148,
        textAlign: 'center'
      },
      filter: customFilter(),
      filterRenderer: (onFilter, col) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      headerStyle: {
        textAlign: 'center',
        maxWidth: 170
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
      <BCard>
        <TableBootstrapHook
          supportEdit // for editable and save
          title={t('specification')}
          // description={t('customer_management_des')}
          columns={myColumns}
          dataRangeKey="joinedDate" // for data range filter
          supportMultiDelete
          // getStatistic={props.getCustomerStatistic} // for statistic API
          // statisticProps={{
          //   // for statistic API params
          //   name: 'Customer',
          //   key: 'status',
          //   valueSet: {
          //     // to map params with each filter button
          //     total: undefined,
          //     activated: 'ACTIVATED',
          //     deactivated: 'DEACTIVATED'
          //   }
          // }}
          supportSelect
          // supportSearch
          selectField="id"
          // searchPlaceholder={t('customer_search')}
          needLoad={needLoadNewData}
          setNeedLoad={setNeedLoadNewData}
          // setNeedLoad = {false}
          deleteData={props.deleteItem}
          fetchData={props.getSpecification}
          mock
          // params={{ sort: 'lastModifiedDate,desc', ...params }}
          isClearFilter={isClearFilter}
          fullAccessPage={fullAccessPage}
          buttons={[
            {
              type: 'create',
              class: 'pl-0',
              icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
              text: t('new_specification'),
              onClick: () => {
                history.push(PATH.CAR_ACCESSORIES_SPECIFICATION_FORM_PATH);
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
      </BCard>

      <ConfirmSpecificationModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
      <ViewSpecificationModal //
        id={viewSpecificationId}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
        customerOrderId={customerOrderId}
      />
      <EditSpecificationModal //
        id={editItemId}
        modalShow={editModalShow}
        setModalShow={setEditModalShow}
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
    getSpecification: specificationActions.getSpecification,
    getCustomerStatistic: customerActions.getCustomerStatistic,
    deleteSpecification: specificationActions.deleteSpecification
  }
)(SpecificationTable);
