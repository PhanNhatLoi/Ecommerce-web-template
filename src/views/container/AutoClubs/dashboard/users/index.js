import React, { useEffect } from 'react';
import { userDistributionOptions } from '~/configs/selectOptions';
import { Card, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import PieChart from '~/views/presentation/ui/chart/PieChart';
import TabsNav from '~/views/presentation/ui/tabs/TabsNav';
import UserDistribution from './UserDistribution';
import enhancer, { fetchMembers, fetchMembersChart } from './withEnhance';

function Users(props) {
  const { dataChart, tabActive, handleChangeTab, t } = props;

  const userOptions = userDistributionOptions(t);

  useEffect(() => {
    fetchMembersChart(props);
    fetchMembers(props);
  }, [props.context.dates.type, props.context.dates.from, props.context.dates.to]);

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-lg-6 d-flex">
          <Card className="w-100">
            <CardHeader titleHeader={t('users')} className="border-0"></CardHeader>
            <CardBody>
              <div className="row">
                <div className="col-md-4">
                  <PieChart dataChart={dataChart} title={t('active')} />
                </div>
                <div className="col-md-4">
                  <PieChart dataChart={dataChart} title={t('inActive')} />
                </div>
                <div className="col-md-4">
                  <PieChart dataChart={dataChart} title={t('block')} />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="col-lg-6 d-flex">
          <Card className="w-100">
            <CardHeader titleHeader={t('userDistribution')} className="border-0">
              <div className="card-toolbar">
                <TabsNav tabs={userOptions} tab={tabActive} changeTab={handleChangeTab} />
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <UserDistribution />
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
}

export default enhancer(Users);
