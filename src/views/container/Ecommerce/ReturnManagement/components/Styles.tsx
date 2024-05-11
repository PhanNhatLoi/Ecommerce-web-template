import { Button, Dropdown, Menu, Upload } from 'antd/es';
import styled from 'styled-components';
import { MInput, MInputNumber } from '~/views/presentation/fields/input';

export const DropdownStyled = styled(Dropdown)`
  .ant-dropdown {
    background-color: #000 !important;
    border-radius: 5px !important;
    padding: 16px 8px !important;
  }
  .ant-dropdown-arrow {
    background-color: #000 !important;
  }
`;

export const ButtonStyled = styled(Button)`
  .anticon {
    position: relative !important;
    bottom: 8px !important;
  }
`;

export const MenuStyled = styled(Menu)`
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
