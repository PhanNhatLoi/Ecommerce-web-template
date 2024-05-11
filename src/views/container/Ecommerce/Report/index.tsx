import { Button, Tabs } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TABS_REPORT } from '~/configs/const';
import { Card as BCard, CardBody, CardHeader, CardHeaderToolbar } from '~/views/presentation/ui/card/Card';

import ReportModal from './Components/ReportModal';
import CustomerForm from './Forms/CustomerForm';
import OrderForm from './Forms/OrderForm';
import ProductForm from './Forms/ProductForm';
import RevenueForm from './Forms/RevenueForm';
import ShippingForm from './Forms/ShippingForm';
import AButton from '~/views/presentation/ui/buttons/AButton';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

type EcommerceReportProps = {};

const { TabPane } = Tabs;

const EcommerceReport: React.FC<EcommerceReportProps> = () => {
  const { t }: any = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState(TABS_REPORT.REVENUE);

  const tabList = [
    { title: t('revenue'), key: TABS_REPORT.REVENUE, component: RevenueForm },
    { title: t('Orders'), key: TABS_REPORT.ORDER, component: OrderForm },
    { title: t('Products'), key: TABS_REPORT.PRODUCT, component: ProductForm },
    { title: t('shipping'), key: TABS_REPORT.SHIPPING, component: ShippingForm },
    { title: t('customers'), key: TABS_REPORT.CUSTOMER, component: CustomerForm }
  ];

  return (
    <WrapStyleForm>
      <BCard>
        <CardHeader titleHeader={t('statistic_report')}>
          {/* <CardHeaderToolbar>
            {
              <AButton type="link" onClick={() => setShowModal(true)} content={t('saved_reports')}/>
            }
          </CardHeaderToolbar> */}
        </CardHeader>
        <CardBody>
          <Tabs defaultActiveKey={TABS_REPORT.REVENUE} type="card" onChange={(key: string) => setCurrentTab(key)}>
            {tabList.map((tab) => (
              <TabPane tab={tab.title} key={tab.key}>
                <tab.component tab={currentTab} />
              </TabPane>
            ))}
          </Tabs>
        </CardBody>
      </BCard>

      {/* MODALS */}
      <ReportModal //
        modalShow={showModal}
        setModalShow={setShowModal}
      />
      {/* MODALS */}
    </WrapStyleForm>
  );
};

export default EcommerceReport;
