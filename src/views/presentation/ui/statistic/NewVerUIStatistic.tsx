import { CaretDownOutlined, CaretUpOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Divider from '~/views/presentation/divider';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

import AButton from '../buttons/AButton';

const WrapCard = styled.div`
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin: 15px 20px;
  background: #fcfcfc;

  .title {
    font-size: 16px;
    font-weight: 700;
  }

  .numbers {
    font-size: 40px;
    font-weight: 700;
  }

  .sub-numbers {
    font-size: 24px;
    font-weight: 700;
  }

  .percent {
    font-size: 20px;
    font-weight: 700;
  }

  .sub-title {
    font-size: 15px;
  }

  .color-grey {
    color: ##666;
  }
`;

function UIStatistic({ data, ...rest }) {
  const { t }: any = useTranslation();

  const renderPercent = (percent) => {
    const compare = percent > 0 ? 'increase' : percent === 0 ? 'equal' : 'decrease';

    switch (compare) {
      case 'increase':
        return percent > 100 ? (
          <>
            <div>
              <CaretUpOutlined />
            </div>
            <span className="text-primary">
              +{'>'}
              100%
            </span>
          </>
        ) : (
          <>
            <div>
              <CaretUpOutlined />
            </div>
            <span className="text-primary">+{percent}%</span>
          </>
        );
      case 'decrease':
        return percent > 100 ? (
          <>
            <div>
              <CaretDownOutlined />
            </div>
            <span className="text-danger">
              -{'<'}
              100%
            </span>
          </>
        ) : (
          <>
            <div>
              <CaretDownOutlined />
            </div>
            <span className="text-danger">{percent}%</span>
          </>
        );
      case 'equal':
        return <span className="text-secondary">{percent}%</span>;
      default:
        return <span className="text-secondary">{percent}%</span>;
    }
  };

  return (
    <WrapCard {...rest}>
      <div className="title mb-4">{data?.title}</div>

      <div className="row">
        <div className={`${data.noDivider ? 'col-12' : 'col-12 col-lg-5 col-xl-5'}`}>
          <div className="d-flex flex-wrap">
            <span className="numbers">{numberFormatDecimal(data?.numbers, data.isPrice ? ' đ' : '', '')}</span>
            {typeof data.percent === 'number' && (
              <div className="d-flex flex-column justify-content-center p-3 sub-title">{renderPercent(data.percent)}</div>
            )}
          </div>
          <div className="sub-title color-grey">{data?.subTitle}</div>
        </div>

        {!data.noDivider && (
          <>
            <div className="col-12 col-lg-1 col-xl-1">
              <Divider
                className="d-none d-lg-block d-xl-block"
                type="vertical"
                style={{ height: '100%', width: '1%', backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
              />

              <Divider className="d-block d-lg-none" style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }} />
            </div>

            <div className="col-12 col-lg-6 col-xl-6 text-center align-self-end">
              {data.hasCurrent && !data.isReverse && (
                <div className="d-flex flex-wrap justify-content-end">
                  {data?.currentStatistic?.map((sub, i) => (
                    <div className="p-5" key={i}>
                      <span className={`${sub.color} percent`}>{numberFormatDecimal(sub.value, data.isPrice ? ' đ' : '', '')}</span>
                      <div className="sub-title color-grey">{sub.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {data.hasPrevious && data.isReverse && (
                <div className="d-flex flex-wrap justify-content-end">
                  {data?.prevStatistic?.map((sub, i) => (
                    <div className="p-5" key={i}>
                      <div className="sub-numbers">{numberFormatDecimal(sub.value, data.isPrice ? ' đ' : '', '')}</div>
                      <div className="sub-title color-grey">{sub.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="d-flex justify-content-between mt-10">
        <AButton type="link" className="align-self-end pl-0 pb-0" onClick={data.viewAll}>
          {t('view_all')} &nbsp; <RightOutlined />
        </AButton>

        {data.hasPrevious && !data.isReverse && (
          <div className={`d-flex flex-wrap justify-content-end ${data.noDivider ? 'text-end' : 'text-center'}`}>
            {data?.prevStatistic?.map((sub, i) => (
              <div className="p-5" key={i}>
                <div className="sub-numbers">{numberFormatDecimal(sub.value, data.isPrice ? ' đ' : '', '')}</div>
                <div className="sub-title color-grey">{sub.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WrapCard>
  );
}

export default UIStatistic;
