import React, { useEffect } from 'react';
import { topTechnicianOptions } from '~/configs/selectOptions';
import { Card, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import TabsNav from '~/views/presentation/ui/tabs/TabsNav';
import TechnicianStatistic from './TechnicianStatistic';
import enhancer, { fetchMembers, fetchMembersChart } from './withEnhance';

function TopTechnicians(props) {
  const { tabActive, handleChangeTab, t } = props;

  const topTechnicianTabs = topTechnicianOptions(t);

  useEffect(() => {
    fetchMembersChart(props);
    fetchMembers(props);
  }, [props.context.dates.type, props.context.dates.from, props.context.dates.to]);

  return (
    <Card className="w-100">
      <CardHeader titleHeader={t('topTechnicians')} className="border-0">
        <div className="card-toolbar">
          <TabsNav tabs={topTechnicianTabs} tab={tabActive} changeTab={handleChangeTab} />
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <TechnicianStatistic />
      </CardBody>
    </Card>
  );
}

export default enhancer(TopTechnicians);
