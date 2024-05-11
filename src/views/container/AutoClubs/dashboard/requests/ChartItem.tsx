import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import MultipleLineChart from '~/views/presentation/ui/chart/MultiLineChart';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import ATypography from '~/views/presentation/ui/text/ATypography';

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

const BodyStyled = styled.div`
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fcfcfc;
  padding: 15px;
  margin-top: 15px;
`;

type ChartItemProps = {
  data: any[];
  keys?: string[];
  params: any;
  label: string;
  position: string;
  color: string;
  isPrice?: boolean;
  loading?: boolean;
};

const ChartItem: React.FC<ChartItemProps> = (props) => {
  const { t }: any = useTranslation();

  return (
    <BodyStyled>
      <ASpinner spinning={props.loading}>
        <div className="mb-15">
          <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
            {t(props.label)}
          </ATypography>
        </div>
        <LineChartWrapperStyled>
          <MultipleLineChart
            data={props.data}
            keys={props.keys}
            params={props.params}
            label={props.label}
            position={props.position}
            color={props.color}
            isPrice={props.isPrice}
            xAxis="date"
            showLegend
          />
        </LineChartWrapperStyled>
      </ASpinner>
    </BodyStyled>
  );
};

export default ChartItem;
