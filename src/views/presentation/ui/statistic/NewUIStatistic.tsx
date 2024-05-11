import { Tooltip } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
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
  const { t }: any = useTranslation();

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

        <div className="d-flex flex-wrap justify-content-between numbers">
          <div>
            <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={1} className="mb-0">
              {numberFormatDecimal(data?.numbers, data.isPrice ? ' đ' : '', '')}
            </ATypography>
            <span className="sub-title color-grey">{data?.subTitle}</span>
          </div>
          {typeof data.percent === 'number' && (
            <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4} className="mt-0">
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i> {renderPercent(data.percent)}
            </ATypography>
          )}
        </div>

        <div className="d-flex flex-wrap mt-3">
          {data?.currentStatistic?.map((sub, i) => (
            <div className="mr-8 mb-2" key={i}>
              <div className="sub-title color-grey">{sub.label}</div>
              <span className={`${sub.color} f-20`}>{numberFormatDecimal(sub.value, data.isPrice ? ' đ' : '', '')}</span>
            </div>
          ))}
        </div>

        {data.hasPrevious && (
          <>
            <Divider />

            <div className="d-flex flex-wrap justify-content-between">
              <div className="d-flex mb-2">
                {data?.prevStatistic?.map((sub, i) => (
                  <div className="mr-20" key={i}>
                    <div className="numbers">
                      <ATypography style={{ fontSize: '20px' }}>{numberFormatDecimal(sub.value, data.isPrice ? ' đ' : '', '')}</ATypography>
                    </div>
                    <div className="sub-title color-grey font-italic">{sub.label}</div>
                  </div>
                ))}
              </div>

              {data?.hasTotal && (
                <div className="ml-auto">
                  <div className="text-right numbers">
                    <ATypography style={{ fontSize: '20px' }}>
                      {numberFormatDecimal(data?.totalNumbers, data.isPrice ? ' đ' : '', '')}
                    </ATypography>
                  </div>
                  <div className="sub-title color-grey font-italic text-right">{data?.totalTitle || t('Total')}</div>
                </div>
              )}
            </div>

            <div className="d-flex flex-wrap mt-3">
              {data?.prevStatisticFooter?.map((sub, i) => (
                <div className="mr-8 mb-2" key={i}>
                  <div className="sub-title color-grey">{sub.label}</div>
                  <span className={`${sub.color || 'color-grey'} f-20`}>
                    {numberFormatDecimal(sub.value, data.isPrice ? ' đ' : '', '')}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardBody>
    </WrapCard>
  );
}

export default UIStatistic;
