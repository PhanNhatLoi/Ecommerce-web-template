import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import COLOR from '~/views/utilities/layout/color';
import { useTranslation } from 'react-i18next';
import DashboardChart from './chart';
import OrderList from './order';

const CardContent = styled.div`
  border-radius: 8px;
  background-color: ${COLOR.White};
  padding: 15px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .title {
    color: ${COLOR.Black};
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  .ant-card {
    border-radius: 8px;
  }
`;
type Props = {
  params: any;
};

const LeftContent = (props: Props) => {
  const { params } = props;
  const { t }: any = useTranslation();
  return (
    <CardContent>
      <div style={{ marginBottom: '30px', marginTop: '15px' }} className="w-100">
        <span className="title">{t('Statistics_chart').toUpperCase()}</span>
      </div>
      <DashboardChart params={params} />
      <div className="w-100">{<OrderList />}</div>
    </CardContent>
  );
};

export default connect(null, {})(LeftContent);
