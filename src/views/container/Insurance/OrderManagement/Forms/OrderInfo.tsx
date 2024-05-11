import { Col, Descriptions, Row } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TYPOGRAPHY_TYPE } from '~/configs';
import MSelect from '~/views/presentation/fields/Select';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';

import { descriptionContentStyles, descriptionLabelStyles } from '../components/Styles';
import InsuranceBuyerModal from '../Modals/InsuranceBuyerModal';

type OrderInfoProps = { formValues: any };

const OrderInfo: React.FC<OrderInfoProps> = (props) => {
  const { t }: any = useTranslation();
  const params = useParams();
  const [buyerId, setBuyerId] = useState<any>();
  const [buyerModalShow, setBuyerModalShow] = useState(false);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap mb-5">
        <AlignedDescription
          column={1}
          labelStyle={{ color: 'rgba(0,0,0,0.5)', verticalAlign: 'top', fontSize: '16px' }}
          contentStyle={{ fontSize: '18px' }}
          colon={false}
          bordered>
          <Descriptions.Item label={`${t('order_id')}`}>
            <b>{props?.formValues?.code || t('no_data')}</b>
            <br />
            <span style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)' }}>
              <b>{UtilDate.toLocalDateTimeString(props?.formValues?.createdDate)}</b>
            </span>
          </Descriptions.Item>
        </AlignedDescription>

        <AlignedDescription
          column={1}
          labelStyle={{ color: 'rgba(0,0,0,0.5)', verticalAlign: 'top', fontSize: '16px' }}
          contentStyle={{ fontSize: '18px' }}
          colon={false}
          bordered>
          <Descriptions.Item label={`${t('status')}`}>
            <b>{t(props?.formValues?.status) || t('no_data')}</b>
          </Descriptions.Item>
        </AlignedDescription>

        {/* Enhance later */}
        {/* <MSelect
          disabled
          colon={false}
          label={t('status')}
          labelAlign="left"
          labelCol={{ offset: 12, span: 4 }}
          wrapperCol={{ span: 8 }}
          name="status"
          options={Object.keys(ORDER_STATUS).map((o) => {
            return {
              value: ORDER_STATUS[o],
              search: t(ORDER_STATUS[o]),
              label: t(ORDER_STATUS[o])
            };
          })}
          placeholder={t('select_status')}
        /> */}
      </div>

      {!params?.id && (
        <div className="row pl-2">
          <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5} className="col-12 col-md-2 col-lg-2 align-self-center">
            {t('selectInsuranceProfile')}:
          </ATypography>

          <div className="col-12 col-md-10 col-lg-10 w-100">
            <MSelect
              colon={false}
              label=""
              require={true}
              name="request"
              noLabel
              options={[
                { value: 'NEW', label: '9846546 - Tires broken' },
                { value: 'PROCESSING', label: '98462162 - Tires broken' }
              ]}
              placeholder={t('select_request')}
            />
          </div>
        </div>
      )}

      <Row style={{ marginTop: '40px' }}>
        <Col md={24} lg={8}>
          <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5} className="pl-2 pb-4">
            {t('general')}
          </ATypography>
          <AlignedDescription column={1} labelStyle={descriptionLabelStyles} contentStyle={descriptionContentStyles} colon={false} bordered>
            <Descriptions.Item label={t('customer')}>
              <AButton type="link" className="pl-0" onClick={() => {}}>
                {props.formValues?.insuranceContract?.buyer?.fullname || t('no_data')}
              </AButton>
            </Descriptions.Item>
            <Descriptions.Item label={t('vehicle')}>
              <AButton type="link" className="pl-0" onClick={() => {}}>
                {props.formValues?.insuranceContract?.vehicle?.numberPlate || t('no_data')}
              </AButton>
            </Descriptions.Item>
            <Descriptions.Item label={t('insurancePeriod')}>
              {`${props.formValues?.insuranceContract?.effectYear} ${t('year_period')}` || t('no_data')}
            </Descriptions.Item>
          </AlignedDescription>
        </Col>

        <Col md={24} lg={8}>
          <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5} className="pl-2">
            {t('billing')}
          </ATypography>
          <AlignedDescription
            column={1}
            layout="vertical"
            labelStyle={{
              color: 'rgba(0,0,0,1)',
              width: '150px',
              verticalAlign: 'top',
              paddingTop: '5px',
              paddingBottom: '5px'
            }}
            colon={false}
            contentStyle={{ padding: 0 }}
            bordered>
            <Descriptions.Item label="">
              <AButton
                type="link"
                className="pl-0"
                onClick={() => {
                  if (props.formValues?.buyerName && props.formValues?.buyerProfileId) {
                    setBuyerId(props.formValues?.buyerProfileId);
                    setBuyerModalShow(true);
                  }
                }}>
                {props.formValues?.buyerName || t('no_data')}
              </AButton>
            </Descriptions.Item>
            <Descriptions.Item label={`${t('email_address')}:`}>
              <AButton type="link" className="pl-0">
                {t('no_data')}
              </AButton>
            </Descriptions.Item>
            <Descriptions.Item label={`${t('phone')}:`}>
              <AButton type="link" className="pl-0">
                {t('no_data')}
              </AButton>
            </Descriptions.Item>
          </AlignedDescription>
        </Col>

        <Col md={24} lg={8}>
          <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5} className="pl-2 pb-4">
            {t('insuranceInfo')}
          </ATypography>
          <Row>
            <Col md={24} lg={12}>
              <AlignedDescription
                column={1}
                layout="vertical"
                labelStyle={{
                  color: '#000',
                  width: '150px',
                  verticalAlign: 'top'
                }}
                colon={false}
                contentStyle={{ color: 'rgba(0,0,0,0.3)', padding: 0 }}
                bordered>
                <Descriptions.Item label={`${t('contractNumber')}`}>
                  <AButton type="link" className="pl-0">
                    {t('no_data')}
                  </AButton>
                </Descriptions.Item>
                <Descriptions.Item label={`${t('certificateNumber')}`}>
                  <AButton type="link" className="pl-0" href={props.formValues?.insuranceContract?.contract?.CItoUrl}>
                    {props.formValues?.insuranceContract?.contract?.PolicyNo || t('no_data')}
                  </AButton>
                </Descriptions.Item>
              </AlignedDescription>
            </Col>
          </Row>
        </Col>
      </Row>

      <InsuranceBuyerModal buyerId={buyerId} modalShow={buyerModalShow} setModalShow={setBuyerModalShow} />
    </>
  );
};

export default connect(null, {})(OrderInfo);
