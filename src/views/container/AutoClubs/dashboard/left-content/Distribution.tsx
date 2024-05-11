import { Empty, Progress, Tabs } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import ATypography from '~/views/presentation/ui/text/ATypography';
import COLOR from '~/views/utilities/layout/color';

const BodyStyled = styled.div`
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fcfcfc;
  padding: 15px;
  height: 100%;
  .ant-progress-text {
    color: ${COLOR.Black};
  }
`;

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
        <ProgressStyled percent={percent} strokeColor={'#198EFD'} format={(percent) => `${value} / ${total}`} />
      </div>
    </div>
  );
};

type Props = {
  label: string;
  summary: any;
  distributionList: any[];
  valueKey: string;
};
function Distribution(props: Props) {
  const { label, summary, distributionList = [], valueKey = '' } = props;
  const { t }: any = useTranslation();

  return (
    <BodyStyled>
      <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
        {t(label)}
      </ATypography>
      <Tabs centered className="mt-5">
        {distributionList.map((value) => (
          <Tabs.TabPane tab={value.tabTitle} key={value.key}>
            {value?.dataChart?.length > 0 ? (
              value.dataChart.map((item, i) => {
                return (
                  <ProgressItem
                    key={i}
                    label={item?.[value.itemLabel] === 'UNKNOWN' ? t('all') : item?.[value.itemLabel]}
                    percent={item && summary && Math.round((item[valueKey] / summary[valueKey] || 1) * 100)}
                    total={(summary && summary[valueKey]) || 1}
                    value={item[valueKey]}
                  />
                );
              })
            ) : (
              <Empty className="mt-5" description={t('no_data')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </BodyStyled>
  );
}

export default connect(null, {})(Distribution);
