import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import NewLineChart from '~/views/presentation/ui/chart/NewLineChart';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';

export const ChartWrapperStyled = styled.div`
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin: 15px 20px;
  background: #fcfcfc;
`;

export const LineChartWrapperStyled = styled.div`
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 5px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #e1e1e1;
  }
`;

type ChartItemProps = {
  data: any[];
  params: any;
  label: string;
  tooltipLabel: string;
  position: string;
  color: string;
  isPrice?: boolean;
  loading?: boolean;
};

const ChartItem: React.FC<ChartItemProps> = (props) => {
  const { t }: any = useTranslation();

  return (
    <ChartWrapperStyled>
      <ASpinner spinning={props.loading}>
        <div className="mb-15" style={{ fontSize: '16px', fontWeight: 700 }}>
          {t(props.label)}
        </div>
        <LineChartWrapperStyled>
          <NewLineChart
            data={props.data}
            params={props.params}
            label={props.tooltipLabel}
            position={props.position}
            color={props.color}
            isPrice={props.isPrice}
            xAxis="date"
          />
        </LineChartWrapperStyled>
      </ASpinner>
    </ChartWrapperStyled>
  );
};

export default ChartItem;
