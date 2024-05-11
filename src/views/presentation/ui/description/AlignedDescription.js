import React from 'react';
import { Descriptions } from 'antd/es';
import styled from 'styled-components';

const DescriptionStyled = styled(Descriptions)`
  table,
  tbody,
  tr,
  th,
  td {
    border-color: transparent !important;
  }
  .ant-descriptions-item-label,
  .ant-descriptions-item-content {
    background-color: white;
    font-size: 12px;
  }
  .ant-descriptions-view {
    border-color: transparent !important;
  }
  @media (max-width: 768px) {
    .ant-descriptions-view {
      overflow: scroll;
    }
  }
`;

const AlignedDescription = (props) => {
  return (
    <DescriptionStyled
      contentStyle={{ fontWeight: '500', paddingLeft: '10px', verticalAlign: 'top', ...props.contentStyle }}
      column={props.column || 1}
      labelStyle={{
        color: 'rgba(0,0,0,0.4)',
        paddingRight: '0px',
        width: props.labelWidth || '150px',
        verticalAlign: 'top',
        ...props.labelStyle
      }}
      colon={false}
      layout={props.layout}
      bordered>
      {props.children}
    </DescriptionStyled>
  );
};

export default AlignedDescription;
