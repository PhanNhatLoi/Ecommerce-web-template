import React from 'react';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import ATypography from '~/views/presentation/ui/text/ATypography';

const WrapLayoutFormStyled: any = styled.div`
  max-width: ${(props: any) => (props.maxWidth ? props.maxWidth : '100%')};
`;

/**
 *
 * @param {*} title
 * @param {*} description
 * @param {*} extra
 * @returns
 */
const LayoutForm = (props) => {
  const titleClass = props.titleClass ? props.titleClass : 'col-lg-3 col-xl-3';
  const childrenClass = props.childrenClass ? props.childrenClass : 'col-lg-9 col-xl-9';

  return (
    <WrapLayoutFormStyled className={`row mb-5 ${props.className}`} data-aos={props['data-aos']}>
      <div className={`d-print-none col-sm-12 col-md-12 ${titleClass} d-flex flex-column`}>
        <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
          {props.title}
        </ATypography>
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} type="secondary">
          {props.description}
        </ATypography>
        {props.extra}
      </div>
      <div className={`col-sm-12 col-md-12 ${childrenClass} `}>{props.children}</div>
    </WrapLayoutFormStyled>
  );
};
export default LayoutForm;
