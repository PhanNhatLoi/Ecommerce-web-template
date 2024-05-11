import React, { useEffect } from 'react';
import UseHeightElement from '~/views/hooks/UseHeightElement';
import { Card, CardBody } from '~/views/presentation/ui/card/Card';
import BarChart from '~/views/presentation/ui/chart/BarChart';
import UIDivider from '~/views/presentation/ui/divider/UIDivider';
import IncidentWaittingTable from './IncidentWaittingTable';
import enhancer, { fetchIncidentsChart, fetchIncidents } from './withEnhance';

function IncidentsWaitting(props) {
  const { dataChart, t } = props;
  const [height, ref] = UseHeightElement();

  useEffect(() => {
    fetchIncidentsChart(props);
    fetchIncidents(props);
  }, [props.context.dates.type, props.context.dates.from, props.context.dates.to]);

  return (
    <React.Fragment>
      <UIDivider title={t('Incident_wait_tech')} />
      <div className="row">
        <div className="col-lg-5">
          <Card style={{ height: height }}>
            <CardBody>
              <BarChart dataChart={dataChart} label={t('incident')} />
            </CardBody>
          </Card>
        </div>
        <div className="col-lg-7">
          <Card ref={ref}>
            <CardBody>
              <IncidentWaittingTable {...props} />
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
}

export default enhancer(IncidentsWaitting);
