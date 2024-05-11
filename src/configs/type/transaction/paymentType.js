import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';
import styled from 'styled-components';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import COLOR from '~/views/utilities/layout/color';
const StatusStyled = styled.div`
  width: 135px;
  margin: auto;
  height: 30px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => props.color};
  color: ${(props) => props.color};
`;

export const PAYMENT_TYPE = {
  TYPE_PRIMARY: 'PAYPAL',
  TYPE_INFO: 'BANK_TRANSFER',
  // TYPE_WARNING: 'CHECKBOX',
  TYPE_SUCCESS: 'CASH'
  // TYPE_DANGER: 'OTHER'
};

/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: ithoangtan@gmail.com
 * @Date: 2021-06-05 16:04:14
 */
export const renderPaymentType = (status, localize, type = 'string') => {
  let color = '';
  let icon = '';
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case PAYMENT_TYPE.TYPE_PRIMARY:
        color = COLOR.Secondary2;
        icon = 'paypal';
        break;
      case PAYMENT_TYPE.TYPE_INFO:
        color = COLOR.purple;
        icon = 'bank';
        break;
      case PAYMENT_TYPE.TYPE_SUCCESS:
        color = COLOR.green2;
        icon = 'cash';
        break;

      default:
        break;
    }
    return (
      <StatusStyled color={color}>
        {icon && <SVG src={toAbsoluteUrl(`/media/svg/icons/Tools/${icon}.svg`)} style={{ marginRight: '3px' }} />} {localize}
      </StatusStyled>
    );
  }
};
