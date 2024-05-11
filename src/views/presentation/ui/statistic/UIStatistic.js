import { Tooltip } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Divider from '~/views/presentation/divider';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

import { Card, CardBody } from '../card/Card';

const WrapCard = styled(Card)`
  .card-body {
    padding: 1.5rem 2.25rem !important;
    font-size: 12px;

    .f-20 {
      font-size: 14px;
    }

    .title {
      text-transform: capitalize;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-weight: 600;
      font-size: 18px;
    }

    .numbers {
      font-size: 22px;
    }

    .sub-title {
      font-size: 15px;
    }

    span {
      font-weight: 500;
    }

    .prev-title {
      font-size: 18px;
    }

    .color-grey {
      color: #a39e9e;
    }
  }
`;

function UIStatistic({ data, ...rest }) {
  const { t } = useTranslation();

  const renderPercent = (percent) => {
    const compare = percent > 0 ? 'increase' : percent === 0 ? 'equal' : 'decrease';

    switch (compare) {
      case 'increase':
        return percent > 100 ? (
          <span className="text-primary">
            +{'>'}
            100%
          </span>
        ) : (
          <span className="text-primary">+{percent}%</span>
        );
      case 'decrease':
        return percent > 100 ? (
          <span className="text-danger">
            -{'<'}
            100%
          </span>
        ) : (
          <span className="text-danger">{percent}%</span>
        );
      case 'equal':
        return <span className="text-secondary">{percent}%</span>;
      default:
        return <span className="text-secondary">{percent}%</span>;
    }
  };

  return (
    <WrapCard {...rest}>
      <CardBody>
        <Tooltip title={data?.title} placement="topLeft">
          <div className="title">{data?.title}</div>
        </Tooltip>

        <div className="d-flex justify-content-between numbers">
          <ATypography strong>{numberFormatDecimal(data?.numbers, data.isPrice ? ' đ' : '', '')}</ATypography>
          {typeof data.percent === 'number' && (
            <span>
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i> {renderPercent(data.percent)}
            </span>
          )}
        </div>

        <div className="d-flex mt-3">
          {data?.currentStatistic?.map((sub, i) => (
            <div className="mr-5" key={i}>
              <div className="sub-title color-grey">{sub.label}</div>
              <span className={`${sub.color} f-20`}>{numberFormatDecimal(sub.value, data.isPrice ? ' đ' : '', '')}</span>
            </div>
          ))}
        </div>

        {data.hasPrevious && <Divider />}

        {data.hasPrevious && <div className="color-grey">{t('prev_period')}</div>}

        {data.hasPrevious && (
          <div className="d-flex justify-content-between numbers">
            <ATypography className="color-grey">{numberFormatDecimal(data?.prevNumbers, data.isPrice ? ' đ' : '', '')}</ATypography>
          </div>
        )}

        {data.hasPrevious && (
          <div className="d-flex mt-5">
            {data?.prevStatistic?.map((sub, i) => (
              <div className="mr-5" key={i}>
                <div className="sub-title color-grey">{sub.label}</div>
                <span className="color-grey f-20">{numberFormatDecimal(sub.value, data.isPrice ? ' đ' : '', '')}</span>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </WrapCard>
  );
}

export default UIStatistic;
