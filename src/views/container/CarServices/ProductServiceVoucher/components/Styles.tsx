import { Dropdown, Menu } from 'antd/es';
import styled from 'styled-components';
import { MInput } from '~/views/presentation/fields/input';
import { MUploadImageNoCropMultiple } from '~/views/presentation/fields/upload';
import AButton from '~/views/presentation/ui/buttons/AButton';

export const WrapTableStyled = styled.div`
  .status_wrap {
    padding: 2px;
    border: 1px dashed transparent;
    border-radius: 4px;
    cursor: pointer;
    :hover {
      border: 1px dashed;
    }
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
`;

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

export const AButtonStyled = styled(AButton)`
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

export const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

export const MInputStyled = styled(MInput)`
  .ant-input-input-wrap {
    display: block;
  }

  .ant-input-group-addon {
    border: none;
    padding: 0px;
  }

  .ant-input-group-addon .ant-radio-button-wrapper-checked.ant-radio-button-wrapper-disabled {
    color: #fff;
    background: #3699ff;
    border-color: #3699ff;
  }

  .ant-form-item-has-feedback.ant-form-item-has-success .ant-form-item-children-icon {
    right: 79px;
  }
`;

export const MUploadImageNoCropMultipleStyled = styled(MUploadImageNoCropMultiple)`
  .ant-upload.ant-upload-select {
    display: none;
  }
`;
