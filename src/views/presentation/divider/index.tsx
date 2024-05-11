import React from 'react';
import { Divider as AntDivider, DividerProps as AntDividerProps } from 'antd/es';
import styled from 'styled-components';

type DividerProps = AntDividerProps & {
  margin?: 'small' | 'middle' | 'large' | undefined;
};
const DividerStyled = styled(AntDivider)<DividerProps>`
  margin: ${({ margin }) => {
    switch (margin) {
      case 'small':
        return '0.5rem 0';
      case 'middle':
        return '1rem 0';
      case 'large':
        return '2rem 0';
      default:
        return '0';
    }
  }};
`;

const Divider: React.FC<DividerProps> = ({ margin = 'large', ...props }) => {
  return <DividerStyled margin={margin} {...props} />;
};

export default Divider;
