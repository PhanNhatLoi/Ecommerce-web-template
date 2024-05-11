/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import styled from 'styled-components';
import { useWindowSize } from 'react-use';

const ToggleStyled = styled.a`
  @media (max-width: 375px) {
    font-size: 12px;
  }
  @media (max-width: 320px) {
    font-size: 11px;
    .ant-btn {
      font-size: 11px;
    }
  }
`;

export const DropdownCustomToggler = React.forwardRef((props, ref) => {
  const { width, height } = useWindowSize();
  return (
    <ToggleStyled
      ref={ref}
      className="btn btn-lg d-flex align-items-center justify-content-end py-0"
      style={{
        // borderLeft: width >= 768 ? '1px solid #000' : 'none',
        // borderRight: props.supportTop10 && width >= 768 ? '1px solid #000' : 'none',
        whiteSpace: 'nowrap'
      }}
      onClick={(e) => {
        e.preventDefault();
        props.onClick(e);
      }}>
      {props.children}
    </ToggleStyled>
  );
});
