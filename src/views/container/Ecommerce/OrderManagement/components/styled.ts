import { Checkbox, Dropdown, Menu, Steps } from 'antd/es';
import styled from 'styled-components';
import { MInputNumber } from '~/views/presentation/fields/input';
import AButton from '~/views/presentation/ui/buttons/AButton';

import { StepStyledProps } from '../Types';

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

export const ButtonStyled = styled(AButton)`
  .anticon {
    position: relative !important;
    bottom: 8px !important;
  }
`;

export const MenuStyled = styled(Menu)`
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
  .ant-dropdown-menu-item button {
    color: #fff;
  }
  .ant-dropdown-menu-item button:hover {
    color: #000;
  }
`;

export const StepStyled: any = styled(Steps)`
  .ant-steps-label-vertical .ant-steps-item-content {
    margin-top: 14px !important;
  }
  height: ${(props: any) => (props.windowWidth > 574 ? '100px' : 'max-content')};
  position: relative;
  top: 16px;
  overflow-y: ${(props: any) => (props.windowWidth > 574 ? 'hidden' : 'scroll')};
  overflow-x: ${(props: any) => (props.windowWidth <= 574 ? 'hidden' : 'scroll')};
  .ant-steps-item {
    position: relative;
    left: ${(props: any) => (props.windowWidth <= 574 ? '16px' : '0px')};
    top: ${(props: any) => (props.windowWidth > 574 ? '16px' : '0px')};
  }
`;
export const MInputNumberStyled = styled(MInputNumber)`
  .ant-input-number-group-addon {
    border: none;
    padding: 0px;
  }
  .ant-input-number-group-addon:last-child {
    background-color: white;
    padding-left: 2px;
    padding-top: 10px;
  }

  .ant-form-item-has-feedback.ant-form-item-has-success .ant-form-item-children-icon {
    right: 79px;
  }
`;

export const CheckboxStyled = styled(Checkbox)`
  font-size: 12px !important;
  font-weight: normal;
  padding: 0 10px;
`;
