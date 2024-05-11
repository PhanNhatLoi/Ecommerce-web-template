import React, { useEffect } from 'react';
import { topMemberOptions } from '~/configs/selectOptions';
import { Card, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import TabsNav from '~/views/presentation/ui/tabs/TabsNav';
import MemberStatistic from './MemberStatistic';
import enhancer, { fetchMembers, fetchMembersChart } from './withEnhance';

function TopMembers(props) {
  const {  tabActive, handleChangeTab, t } = props;

  const topMembersTabs = topMemberOptions(t);

  useEffect(() => {
    fetchMembersChart(props);
    fetchMembers(props);
  }, [props.context.dates.type, props.context.dates.from, props.context.dates.to]);

  return (
    <Card className="w-100">
      <CardHeader titleHeader={t('topMembers')} className="border-0">
        <div className="card-toolbar">
          <TabsNav tabs={topMembersTabs} tab={tabActive} changeTab={handleChangeTab} />
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <MemberStatistic />
      </CardBody>
    </Card>
  );
}

export default enhancer(TopMembers);
