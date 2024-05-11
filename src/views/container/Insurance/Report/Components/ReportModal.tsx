import { EyeOutlined, MinusCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd/es';
import React, { useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { reportActions } from '~/state/ducks/carAccessories/report';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import { UtilDate } from '~/views/utilities/helpers';

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

type Action = {
  icon: JSX.Element;
  text: string;
  onClick: (row: any) => void;
  alterText?: string;
  alterIcon?: any;
  style?: any;
};

type ReportModalProps = {
  getMockTable: any;
  modalShow: boolean;
  setModalShow: (value: boolean) => void;
};

const ReportModal: React.FC<ReportModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);

  // ------------------------------
  // FOR REPORT ACTIONS
  // ------------------------------

  const actions: Action[] = [
    {
      icon: <EyeOutlined />,
      text: t('view_customer'),
      onClick: (row) => {}
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('delete_customer'),
      onClick: (row) => {}
    }
  ];
  // ------------------------------
  // FOR REPORT ACTIONS
  // ------------------------------

  let columns = [
    {
      dataField: 'date',
      text: t('date'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell) => {
        return cell ? <span>{UtilDate.toDateLocal(cell)}</span> : '-';
      }
    },
    {
      dataField: 'customerName',
      text: t('report_name'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return cell ? cell : '-';
      }
    },
    {
      dataField: 'action',
      text: t('actions'),
      sort: false,
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell: any, row: any) => {
        const menu = (
          <MenuStyled>
            {actions.map((action) => (
              <Menu.Item>
                <AButton className="w-100 d-flex  align-items-center" type="link" onClick={() => action.onClick(row)}>
                  {action.icon} &nbsp; {action.text}
                </AButton>
              </Menu.Item>
            ))}
          </MenuStyled>
        );

        return (
          <DropdownStyled overlay={menu} placement="bottomCenter" trigger={['click']}>
            <ButtonStyled type="link" size="large" style={{ fontSize: '24px' }} icon={<MoreOutlined />} />
          </DropdownStyled>
        );
      }
    }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------
  let columnsArr = columns.map((column) => {
    return {
      editable: false,
      sort: false,
      filter: customFilter(),
      filterRenderer: () => {},
      csvFormatter: (cell: any) => {
        return cell ? cell : '-';
      },
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  const handleCancel = () => {
    props.setModalShow(false);
  };

  const onFinish = () => {};

  return (
    <AntModal
      title={t('saved_reports')}
      // description={t('customer_detail_des')}
      width={800}
      destroyOnClose
      modalShow={props.modalShow}
      onOk={onFinish}
      onCancel={handleCancel}>
      <TableBootstrapHook
        mock
        columns={columnsArr}
        dataRangeKey="createdDate" // for data range filter
        isDateFilterReverse
        supportSearch={false}
        noPadding
        isDataRangeHidden
        notSupportPagination
        notSupportToggle
        notSupportStatistic
        selectField="id"
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getMockTable}
        params={{ sort: 'lastModifiedDate,desc' }}
        buttons={[]}></TableBootstrapHook>
    </AntModal>
  );
};

export default connect(null, {
  getMockTable: reportActions.getMockTable
})(ReportModal);
