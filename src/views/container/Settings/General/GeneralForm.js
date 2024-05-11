import { SaveOutlined } from '@ant-design/icons';
import { Col, Form, message, Row } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { settingActions } from '~/state/ducks/settings';
import Divider from '~/views/presentation/divider';
import MInputNumber from '~/views/presentation/fields/input/InputNumber';
import MRadio from '~/views/presentation/fields/Radio';
import LayoutForm from '~/views/presentation/layout/forForm';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';

const GeneralForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [distanceType, setDistanceType] = useState('wholeCountry');
  const [configKeyList, setConfigKeyList] = useState({});

  const getConfig = (list, value) => {
    return head(list.filter((item) => item.configKey === value));
  };

  useEffect(() => {
    props
      .getCurrentSettings()
      .then((res) => {
        const ALLOW_WHOLE_COUNTRY = getConfig(res?.content, 'ALLOW_WHOLE_COUNTRY');
        const ALLOW_REQUEST_FROM_MEMBER = getConfig(res?.content, 'ALLOW_REQUEST_FROM_MEMBER');
        const NOTIFICATION = getConfig(res?.content, 'NOTIFICATION');
        const MAX_DISTANCE_TO_REQUESTER = getConfig(res?.content, 'MAX_DISTANCE_TO_REQUESTER');
        setConfigKeyList({
          ALLOW_WHOLE_COUNTRY: ALLOW_WHOLE_COUNTRY,
          ALLOW_REQUEST_FROM_MEMBER: ALLOW_REQUEST_FROM_MEMBER,
          NOTIFICATION: NOTIFICATION,
          MAX_DISTANCE_TO_REQUESTER: MAX_DISTANCE_TO_REQUESTER
        });
        setDistanceType(ALLOW_WHOLE_COUNTRY?.stringValue === 'true' ? 'wholeCountry' : 'configure');
        form.setFieldsValue({
          distanceType: ALLOW_WHOLE_COUNTRY?.stringValue === 'true' ? 'wholeCountry' : 'configure',
          distance: MAX_DISTANCE_TO_REQUESTER?.stringValue,
          problems: ALLOW_REQUEST_FROM_MEMBER?.stringValue === 'true' ? 'fromMember' : 'all'
        });
      })
      .catch((err) => {
        console.error('trandev ~ file: GeneralForm.js ~ line 21 ~ useEffect ~ err', err);
      });
  }, []);

  const onFinish = (values) => {
    setSubmitting(true);
    let finalSettings = [
      {
        id: configKeyList.ALLOW_WHOLE_COUNTRY.id,
        stringValue: values.distanceType === 'wholeCountry' ? 'true' : 'false'
      },
      {
        id: configKeyList.MAX_DISTANCE_TO_REQUESTER.id,
        stringValue: values.distanceType === 'configure' ? values.distance : 'false'
      },
      {
        id: configKeyList.ALLOW_REQUEST_FROM_MEMBER.id,
        stringValue: values.problems === 'fromMember' ? 'true' : 'false'
      }
    ];
    props
      .updateSettings(finalSettings)
      .then((res) => {
        AMessage.success(t('update_setting_success'));
        setSubmitting(false);
      })
      .catch((err) => {
        AMessage.error(t(err.message));
        setSubmitting(false);
      });
    setDirty(false);
  };

  const onFinishFailed = (error) => {
    console.debug('trandev ~ file: GeneralForm.js ~ line 7 ~ onFinish ~ error', error);
  };

  const handleValuesChange = () => setDirty(true);

  return (
    <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} onValuesChange={handleValuesChange}>
      <Prompt when={dirty} message={t('leave_confirm')} />

      <LayoutForm title={t('distance_to_request_location')} description={''}>
        <Row className="d-flex flex-column">
          <Col lg={24} md={24} sm={24}>
            <MRadio
              colon={false}
              value={distanceType}
              onChange={(e) => setDistanceType(e.target.value)}
              require={false}
              label={''}
              name="distanceType"
              customLayout="w-100"
              options={[
                { value: 'wholeCountry', label: t('whole_country') },
                { value: 'configure', label: t('configure_distance') }
              ]}
            />
          </Col>

          {distanceType === 'configure' && (
            <Col lg={12} md={12} sm={12} className="ml-4 mt-6">
              <MInputNumber //
                name="distance"
                prefix={t('kilometers')}
                // addonAfter={t('kilometers')}
                hasFeedback={false}
                allowClear={false}
                controls={false}
                customLayout="w-100"
              />
            </Col>
          )}
        </Row>
      </LayoutForm>

      <Divider />

      <LayoutForm title={t('receive_problems')} description={''}>
        <Col lg={24} md={24} sm={24}>
          <MRadio
            colon={false}
            require={false}
            label={''}
            name="problems"
            customLayout="w-100"
            options={[
              { value: 'fromMember', label: t('only_requests_from_members') },
              { value: 'all', label: t('all') }
            ]}
          />
        </Col>
      </LayoutForm>

      <Divider />

      <Form.Item>
        <AButton
          style={{ verticalAlign: 'middle', width: '250px' }}
          className="px-5"
          size="large"
          htmlType="submit"
          loading={submitting}
          type="primary"
          icon={<SaveOutlined />}>
          {t('save')}
        </AButton>
      </Form.Item>
    </Form>
  );
};

export default connect(null, {
  getCurrentSettings: settingActions.getCurrentSettings,
  updateSettings: settingActions.updateSettings
})(GeneralForm);
