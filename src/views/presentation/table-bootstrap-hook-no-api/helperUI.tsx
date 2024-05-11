import styled from 'styled-components';
import XLSX from 'xlsx/dist/xlsx.mini.min.js';
import { data, downloadFileName, exportHeaders } from '~/configs/const';

type ButtonStyledProps = {
  hasBorder: boolean;
};

type ButtonProps = {
  props?: any;
  disable?: any;
  selectedData?: any;
  type?: any;
  class?: string;
  onClick?: any;
  icon?: any;
  text?: string;
  exportCount?: any;
  t?: any;
};

const ButtonStyled = styled.button<ButtonStyledProps>`
  border-right: ${(props) => (props.hasBorder ? '1px solid #000' : 'none')};
  font-size: 16px;
  min-width: fit-content;
`;

const exportToExcel = () => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([exportHeaders, ...data]);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, downloadFileName);
};

export const renderButtons = (buttons: Array<ButtonProps> = []) => {
  return (
    <>
      {buttons.map((button, i) => {
        if (button.type === 'download') {
          return (
            <ButtonStyled
              {...button?.props}
              type="button"
              disabled={
                button?.disable
                  ? button?.disable(button?.selectedData)
                  : ['hasData', 'export'].includes(button?.type) && button?.selectedData?.length === 0
              }
              className={'btn btn-lg py-0 ' + button?.class}
              onClick={exportToExcel}
              hasBorder={i !== buttons?.length - 1}>
              <span className="svg-icon svg-icon-md svg-icon">
                {button?.icon}
                {` `}
                {button?.text} {` `}
                {button?.type === 'export' &&
                  `${
                    button?.exportCount > 0
                      ? button?.exportCount > 1
                        ? `(${button?.exportCount} ${button?.t('rows')})`
                        : `(${button?.exportCount} ${button?.t('row')})`
                      : ''
                  }`}
              </span>
            </ButtonStyled>
          );
        } else {
          return (
            <ButtonStyled
              {...button?.props}
              type="button"
              disabled={
                button?.disable
                  ? button?.disable(button?.selectedData)
                  : ['hasData', 'export'].includes(button?.type) && button?.selectedData?.length === 0
              }
              className={'btn btn-lg py-0' + button?.class}
              onClick={() => button?.onClick(button?.selectedData)}
              hasBorder={i !== buttons?.length - 1}>
              <span className="svg-icon svg-icon-md svg-icon">
                {button?.icon}
                {` `}
                {button?.text} {` `}
                {button?.type === 'export' &&
                  `${
                    button?.exportCount > 0
                      ? button?.exportCount > 1
                        ? `(${button?.exportCount} ${button?.t('rows')})`
                        : `(${button?.exportCount} ${button?.t('row')})`
                      : ''
                  }`}
              </span>
            </ButtonStyled>
          );
        }
      })}
    </>
  );
};

export const ANT_FORM_MODAL_LAYOUT = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 12 },
    md: { span: 24 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
    md: { span: 24 },
    lg: { span: 14 },
    xl: { span: 14 },
    xxl: { span: 14 }
  }
};

export const ANT_FORM_PAGE_LAYOUT = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 12 },
    md: { span: 24 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
    md: { span: 24 },
    lg: { span: 14 },
    xl: { span: 14 },
    xxl: { span: 14 }
  }
};

export const ANT_FORM_SEP_LABEL_LAYOUT = {
  labelCol: {
    span: 24
  },
  wrapperCol: {
    span: 24
  }
};
