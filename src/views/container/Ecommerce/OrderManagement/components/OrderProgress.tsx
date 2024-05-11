import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Steps } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { SALES_ORDER_PROCESS } from '~/configs/index';
import { useTranslation } from 'react-i18next';
import { StepStyled } from './styled';
import { SALE_ORDER_STATUS } from '~/configs/status/car-accessories/saleOrderStatus';

interface OrderProgressProps {
  width: number;
  currentStep: number & Number;
  status: String;
}
const OrderProgress: React.FC<OrderProgressProps> = (props) => {
  const { t }: any = useTranslation();
  const [process, setProcess] = useState(SALES_ORDER_PROCESS);
  useEffect(() => {
    if (props.status === SALE_ORDER_STATUS.REJECTED) {
      const newProcess = SALES_ORDER_PROCESS.filter((item, index) => item.text !== 'ACCEPTED_SALE_ORDER');
      setProcess(newProcess);
    } else {
      const newProcess = SALES_ORDER_PROCESS.filter((item, index) => item.text !== SALE_ORDER_STATUS.REJECTED);
      setProcess(newProcess);
    }
  }, [props.status]);
  return (
    <div style={{ height: 'max-content' }}>
      <StepStyled
        windowWidth={props.width}
        progressDot={(dot, { status, index }) => {
          return status === 'wait' ? (
            <span
              style={{
                width: '24px',
                height: '24px',
                position: 'relative',
                top: '-6px',
                right: '5px',
                border: '3px solid #f0f0f0',
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'inline-block'
              }}></span>
          ) : (props.status === SALE_ORDER_STATUS.REJECTED && index === 1) ||
            (props.status === SALE_ORDER_STATUS.CANCELED && index === props.currentStep) ? (
            <CloseCircleFilled
              style={{
                position: 'relative',
                top: '-12px',
                right: '14px',
                fontSize: '32px',
                color: index <= props.currentStep ? 'Red' : '#bbb'
              }}
            />
          ) : (
            <CheckCircleFilled
              style={{
                position: 'relative',
                top: '-12px',
                right: '14px',
                fontSize: '32px',
                color: index <= props.currentStep ? '#1a91ff' : '#bbb'
              }}
            />
          );
        }}
        labelPlacement="vertical"
        current={props.currentStep}>
        {process.map((status) => (
          <Steps.Step
            title={
              <div className="mt-3">
                <div>{t(status.text)}</div>
              </div>
            }
          />
        ))}
      </StepStyled>
    </div>
  );
};

export default OrderProgress;
