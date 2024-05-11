import { Button, Checkbox, Dropdown, Menu, Upload } from 'antd/es';
import styled from 'styled-components';
import MDatePicker from '~/views/presentation/fields/DatePicker';
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

export const MInputStyled = styled(MInput)`
  .ant-input-affix-wrapper {
    border: 1px solid #000 !important;
  }
`;

export const UploadStyled = styled(Upload)`
  .ant-upload-list-text-container div {
    margin: 0 0 8px 0;
  }
`;

export const MInputNumberStyled = styled(MInputNumber)`
  .ant-input-number-group-wrapper {
    display: block;
  }

  .ant-input-number-group-addon {
    border: none;
    padding: 0px;
  }

  .ant-form-item-has-feedback.ant-form-item-has-success .ant-form-item-children-icon {
    right: 79px;
  }
`;

export const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

export const descriptionLabelStyles = {
  color: 'rgba(0,0,0,0.5)',
  width: '80px !important',
  verticalAlign: 'top',
  fontSize: '12px',
  paddingBottom: '5px',
  paddingTop: '5px'
};

export const descriptionContentStyles = {
  fontSize: '12px',
  paddingBottom: '5px',
  paddingTop: '5px'
};

export const MDatePickerStyled = styled(MDatePicker)`
  .ant-picker {
    width: 100%;
    margin-top: 6px;
  }
`;

export const MInputNumberStep2Styled = styled(MInputNumber)`
  .ant-input-number-group-addon {
    border: none;
    padding: 0px;
  }
  .ant-input-number-group-addon:last-child {
    background-color: white;
    padding-left: 2px;
    // padding-top: 10px;
  }
  .ant-input-number-input {
    font-size: 12px;
  }

  .ant-form-item-has-feedback.ant-form-item-has-success .ant-form-item-children-icon {
    right: 79px;
  }
`;

export const MCheckboxStyled = styled(Checkbox.Group)`
  display: flex;
  flex-direction: column;

  .ant-checkbox-wrapper {
    margin-bottom: 15px;
  }
`;
