import React from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import Divider from '~/views/presentation/divider';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import COLOR from '~/views/utilities/layout/color';

function UIStatisticVer2(props) {
  const { data, hasBorderBottom } = props;
  const { t }: any = useTranslation();

  const WrapCard = styled.div`
    color: #666;
    border-bottom-style: solid;
    border-bottom-color: rgba(0, 0, 0, 0.1);
    border-bottom-width: ${hasBorderBottom ? '1px' : '0px'};
    .card-title {
      color: ${COLOR.Black};
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      display: flex;
      align-items: center;
      margin-bottom: 0;
      padding: 15px;
      background: #f8f8f8;
    }

    .statisitic-content {
      background-color: ${COLOR.White};
      padding: 15px;
    }
  `;

  const renderPercent = (percent) => {
    const compare = percent > 0 ? 'increase' : percent === 0 ? 'equal' : 'decrease';

    switch (compare) {
      case 'increase':
        return percent > 100 ? (
          <span style={{ color: COLOR.blue3, fontWeight: 'bold' }}>
            +{'>'}
            100%
          </span>
        ) : (
          <span style={{ color: COLOR.blue3, fontWeight: 'bold' }}>+{percent}%</span>
        );
      case 'decrease':
        return percent > 100 ? (
          <span style={{ color: COLOR.Red3, fontWeight: 'bold' }}>
            -{'<'}
            100%
          </span>
        ) : (
          <span style={{ color: COLOR.Red3, fontWeight: 'bold' }}>{percent}%</span>
        );
      case 'equal':
        return <span className="text-secondary">{percent}%</span>;
      default:
        return <span className="text-secondary">{percent}%</span>;
    }
  };

  return (
    <WrapCard>
      <div className="card-title">
        <span>{data?.subTitle}</span>
      </div>
      <div className="statisitic-content">
        <div className="d-flex flex-wrap numbers mt-0">
          <div>
            <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={1} className="mb-0">
              {numberFormatDecimal(data?.numbers, data.isPrice ? ' ₫' : '', '')}
            </ATypography>
          </div>
          {typeof data.percent === 'number' && (
            <div className="ml-3 pt-1">
              <div>
                {data.percent !== 0 && (
                  <span className="symbol-label">
                    <SVG
                      className="h-50 align-self-center"
                      src={toAbsoluteUrl(`/media/svg/icons/Tools/${data.percent > 0 ? 'ActionUp' : 'ActionDown'}.svg`)}></SVG>
                  </span>
                )}
              </div>

              {renderPercent(data.percent)}
            </div>
          )}
        </div>

        <div className="d-flex flex-wrap mt-3 justify-content-between">
          {data?.currentStatistic?.map((sub, i) => (
            <div className="mb-2" key={i} style={{ textAlign: 'center', width: `${100 / data.currentStatistic.length}%` }}>
              <span className={`${sub.color} f-20`}>{numberFormatDecimal(sub.value, data.isPrice ? ' đ' : '', '')}</span>
              <div className="sub-title">{sub.label}</div>
            </div>
          ))}
        </div>

        {data.hasPrevious && (
          <>
            <Divider style={{ backgroundColor: `rgba(0, 0, 0, 0.10)` }} />

            <div className="d-flex flex-wrap justify-content-between">
              <div className="d-flex mb-2">
                {data?.prevStatistic?.map((sub, i) => (
                  <div className="mr-20" key={i}>
                    <div className="numbers">
                      <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {numberFormatDecimal(sub.value, data.isPrice ? ' ₫' : '', '')}
                      </span>
                    </div>
                    <div className="sub-title">{sub.label}</div>
                  </div>
                ))}
              </div>

              {data?.hasTotal && (
                <div className="ml-auto w-100">
                  <div className="sub-title font-italic text-right">{data?.totalTitle || t('Total')}</div>
                  <div className="text-right numbers">
                    <ATypography style={{ fontSize: '20px', color: COLOR.green3, fontWeight: 'bold' }}>
                      {numberFormatDecimal(data?.totalNumbers, data.isPrice ? ' ₫' : '', '')}
                    </ATypography>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex flex-wrap mt-3 justify-content-between" style={{ textAlign: 'center' }}>
              {data?.prevStatisticFooter?.map((sub, i) => (
                <div className=" mb-2" key={i} style={{ textAlign: 'center', width: `${100 / data.currentStatistic.length}%` }}>
                  <span className={`${sub.color || 'color-grey'} f-20`}>
                    {numberFormatDecimal(sub.value, data.isPrice ? ' ₫' : '', '')}
                  </span>
                  <div className="sub-title">{sub.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </WrapCard>
  );
}

export default UIStatisticVer2;
