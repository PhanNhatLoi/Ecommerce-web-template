import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd/es';
import React from 'react';
import styled from 'styled-components';
import AButton from '~/views/presentation/ui/buttons/AButton';

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

const CustomMenu = (props) => {
  const menu = (
    <MenuStyled>
      {(props.actions || []).map((action) => (
        <Menu.Item>
          <AButton
            disabled={action.disabled}
            className="w-100 d-flex align-items-center"
            type="link"
            onClick={() => action.onClick(props.row)}>
            {action.icon} &nbsp; {action.text}
          </AButton>
        </Menu.Item>
      ))}
    </MenuStyled>
  );

  return (
    <DropdownStyled overlay={menu} placement="bottomCenter" trigger="click">
      <ButtonStyled type="link" size="large" style={{ fontSize: '24px' }} icon={<MoreOutlined />} />
    </DropdownStyled>
  );
};

export default CustomMenu;
