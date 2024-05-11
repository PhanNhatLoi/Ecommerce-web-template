import React, { useEffect } from 'react';
import UseHeightElement from '~/views/hooks/UseHeightElement';
import { Card, CardBody } from '~/views/presentation/ui/card/Card';
import BarChart from '~/views/presentation/ui/chart/BarChart';
import UIDivider from '~/views/presentation/ui/divider/UIDivider';
import IncidentFixingTable from './IncidentFixingTable';
import enhancer, { fetchIncidentFixingChart, fetchIncidentFixing } from './withEnhance';

function IncidentsFixing(props) {
  const { dataChart, t } = props;
  const [height, ref] = UseHeightElement();

  useEffect(() => {
    fetchIncidentFixingChart(props);
    fetchIncidentFixing(props);
  }, [props.context.dates.type, props.context.dates.from, props.context.dates.to]);

  return (
    <React.Fragment>
      <UIDivider title={t('Incident_fixing')} />
      <div className="row">
        <div className="col-lg-5 ">
          <Card style={{ height: height }}>
            <CardBody>
              <BarChart dataChart={dataChart} label={t('incident')} />
            </CardBody>
          </Card>
        </div>
        <div className="col-lg-7">
          <Card ref={ref}>
            <CardBody>
              <IncidentFixingTable {...props} />
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
}

export default enhancer(IncidentsFixing);
