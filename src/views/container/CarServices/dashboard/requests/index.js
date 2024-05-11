import { LoadingOutlined } from '@ant-design/icons';
import { Empty, Progress, Tabs } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { dashboardActions } from '~/state/ducks/carServices/dashboard';
import { Card, CardBody } from '~/views/presentation/ui/card/Card';
import PieChart from '~/views/presentation/ui/chart/PieChart';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import ATypography from '~/views/presentation/ui/text/ATypography';

const ProgressStyled = styled(Progress)`
  .ant-progress-inner,
  .ant-progress-outer {
    width: 90% !important;
  }
`;

const ProgressItem = ({ label, percent, total, value }) => {
  return (
    <div className="row my-5">
      <div className="col-3">
        <ATypography>{label}</ATypography>
      </div>
      <div className="col-9">
        <ProgressStyled //
          success={{ pecent: 10000 }}
          strokeLinecap="square"
          strokeWidth={15}
          percent={percent}
          format={(percent) => `${value} / ${total}`}
        />
      </div>
    </div>
  );
};

function Requests(props) {
  const { t } = useTranslation();
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [cityDistribution, setCityDistribution] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  const fetch = (action, setData, setLoading) => {
    setLoading(true);
    action()
      .then((res) => {
        setLoading(false);
        setData(res?.content);
      })
      .catch((err) => {
        setLoading(false);
        console.error('trandev ~ file: index.js ~ line 34 ~ useEffect ~ err', err);
      });
  };

  useEffect(() => {
    fetch(props.getRequestCategory, setCategoryDistribution, setCategoryLoading);
    fetch(props.getRequestCity, setCityDistribution, setCityLoading);
  }, []);

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12 col-xl-8">
          <Card style={{ minHeight: 300 }}>
            <CardBody>
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
                {t('requests_repair')}
              </ATypography>
              <div className="row">
                <div className="col-12 col-xl-4 my-2">
                  <div className="text-center">
                    <ATypography strong>{t('repairs')}</ATypography>
                  </div>
                  <PieChart radius={0.5} height={250} offset={15} data={props.fixData} />
                </div>
                <div className="col-12 col-xl-4 my-2">
                  <div className="text-center">
                    <ATypography strong>{t('quotation')}</ATypography>
                  </div>
                  <PieChart radius={0.5} height={250} offset={15} data={props.quotationData} />
                </div>
                <div className="col-12 col-xl-4 my-2">
                  <div className="text-center">
                    <ATypography strong>{t('Cancelled')}</ATypography>
                  </div>
                  <PieChart radius={0.5} height={250} offset={15} data={props.cancelData} />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="col-12 col-xl-4">
          <Card style={{ minHeight: 300 }}>
            <CardBody>
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
                {t('request_distribution')}
              </ATypography>
              <Tabs type="card" className="mt-5">
                <Tabs.TabPane tab={t('by_category').toUpperCase()} key={1}>
                  {categoryLoading ? (
                    <div className="d-flex align-items-center justify-content-center w-100" style={{ minHeight: '200px' }}>
                      <ASpinner indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </div>
                  ) : categoryDistribution?.length > 0 ? (
                    categoryDistribution.map((item, i) => {
                      return (
                        <ProgressItem
                          key={i}
                          label={item?.categoryName === 'UNKNOWN' ? 'ALL' : item?.categoryName}
                          percent={Math.round((item?.totalRequest / props.totalRequest) * 100)}
                          total={props.totalRequest}
                          value={item?.totalRequest}
                        />
                      );
                    })
                  ) : (
                    <Empty className="mt-5" description={t('no_data')} />
                  )}
                </Tabs.TabPane>

                <Tabs.TabPane tab={t('by_city').toUpperCase()} key={2}>
                  {cityLoading ? (
                    <div className="d-flex align-items-center justify-content-center w-100" style={{ minHeight: '200px' }}>
                      <ASpinner indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </div>
                  ) : cityDistribution?.length > 0 ? (
                    cityDistribution.map((item, i) => {
                      return (
                        <ProgressItem
                          key={i}
                          label={item?.provinceName === 'UNKNOWN' ? 'ALL' : item?.provinceName}
                          percent={Math.round((item?.totalRequest / props.totalRequest) * 100)}
                          total={props.totalRequest}
                          value={item?.totalRequest}
                        />
                      );
                    })
                  ) : (
                    <Empty className="mt-5" description={t('no_data')} />
                  )}
                </Tabs.TabPane>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
}

export default connect(null, {
  getRequestCategory: dashboardActions.getRequestCategory,
  getRequestCity: dashboardActions.getRequestCity
})(Requests);
