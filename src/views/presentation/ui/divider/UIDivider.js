import React from 'react';
import styled from 'styled-components';

const WrapperUI = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0px;

  .title {
    margin-right: 15px;
    font-size: 18px;
  }

  .line {
    height: 1px;
    background-color: #dbd6d6;
    flex-grow: 1;
  }
`;

function UIDivider({ title }) {
  return (
    <WrapperUI>
      <span className="title">{title}</span>
      <div className="line"></div>
    </WrapperUI>
  );
}

export default UIDivider;
