import { Empty, Progress, Tabs } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { dashboardActions } from '~/state/ducks/autoClub/dashboard';
import { Card, CardBody } from '~/views/presentation/ui/card/Card';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import ATypography from '~/views/presentation/ui/text/ATypography';

import ChartItem from './ChartItem';

const ProgressStyled = styled(Progress)`
  .ant-progress-inner,
  .ant-progress-outer {
    width: 90% !important;
  }
`;

const ProgressItem = ({ label, percent, total, value }) => {
  return (
    <div className="row mt-4 mb-10">
      <div className="col-3">
        <ATypography>{label}</ATypography>
      </div>
      <div className="col-9">
        <ProgressStyled strokeLinecap="square" strokeWidth={15} percent={percent} format={(percent) => `${value} / ${total}`} />
      </div>
    </div>
  );
};

type MemberNewestProps = { params: any; getMemberChart: any; getMemberSummary: any; getMemberDistribution: any };

const MemberNewest: React.FC<MemberNewestProps> = (props) => {
  const { t }: any = useTranslation();

  const [loading, setLoading] = useState(false);
  const [dataChart, setDataChart] = useState([]);
  const [memberSummary, setMemberSummary] = useState<any>();
  const [userDistribution, setUserDistribution] = useState([]);

  const fetchData = (action: any, params: any, setData: any) => {
    const { timeBy, ...restParams } = params;
    setLoading(true);
    action({ ...restParams })
      .then((res) => {
        setData(res?.content);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('🚀chiendev ~ file: index.tsx:63 ~ fetchData ~ err:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(props.getMemberChart, props.params, setDataChart);
    fetchData(props.getMemberSummary, props.params, setMemberSummary);
    fetchData(props.getMemberDistribution, { ...props.params, page: 0, size: 5 }, setUserDistribution);
  }, [props.params]);

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-lg-7">
          <ChartItem label={t('members')} data={dataChart} position="date*count" color="type" params={props.params} loading={loading} />
        </div>
        <div className="col-lg-5">
          <Card style={{ minHeight: 385 }}>
            <CardBody>
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
                {t('user_distribution')}
              </ATypography>
              <Tabs type="card" className="mt-5">
                <Tabs.TabPane tab={t('by_city').toUpperCase()} key="1">
                  {userDistribution?.length > 0 ? (
                    userDistribution.map((item: any, i) => {
                      return (
                        <ASpinner spinning={loading}>
                          <ProgressItem
                            key={i}
                            label={item?.provinceName === 'UNKNOWN' ? t('all') : item?.provinceName}
                            percent={Math.round((item?.totalMember / memberSummary?.totalMember || 1) * 100)}
                            total={memberSummary?.totalMember || 1}
                            value={item?.totalMember}
                          />
                        </ASpinner>
                      );
                    })
                  ) : (
                    <Empty className="mt-5" description={t('no_data')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </Tabs.TabPane>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default connect(null, {
  getMemberChart: dashboardActions.getMemberChart,
  getMemberSummary: dashboardActions.getMemberSummary,
  getMemberDistribution: dashboardActions.getMemberDistribution
})(MemberNewest);
