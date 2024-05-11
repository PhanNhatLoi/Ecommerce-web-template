import { Tooltip } from 'antd/es';
import React from 'react';
import styled from 'styled-components';
import { Card, CardBody } from '../card/Card';

const WrapCard = styled(Card)`
  .card-body {
    padding: 1.5rem 2.25rem !important;

    font-size: 16px;
    .title {
      text-transform: uppercase;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .statistic {
      font-size: 19px;
    }
    .sub-title {
      font-size: 15px;
      margin-top: 5px;
    }
    span {
      font-weight: 500;
    }
  }
`;

function UIStatistic(props) {
  const { title, subTitle, count = 0, percent = 0, subCount = 0, status = 'RIGHT', ...rest } = props;
  const renderIcon = (status) => {
    switch (status) {
      case 'UP':
        return <i className="fa fa-long-arrow-up" aria-hidden="true"></i>;
      case 'DOWN':
        return <i className="fa fa-long-arrow-down" aria-hidden="true"></i>;
      case 'RIGHT':
        return <i className="fa fa-long-arrow-right" aria-hidden="true"></i>;
      default:
        return <i className="fa fa-long-arrow-right" aria-hidden="true"></i>;
    }
  };

  return (
    <WrapCard {...rest}>
      <CardBody>
        <Tooltip title={title} placement="topLeft">
          <div className="title">{title}</div>
        </Tooltip>
        <div className="d-flex justify-content-between statistic">
          <span>{count}</span>
          <span>
            {renderIcon(status)} {percent}%
          </span>
        </div>
        <div className="sub-title">{subTitle}</div>
        <span>{subCount}</span>
      </CardBody>
    </WrapCard>
  );
}

export default UIStatistic;
