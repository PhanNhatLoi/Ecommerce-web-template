import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Form, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { mechanicActions } from '~/state/ducks/mechanic';
import { requestActions } from '~/state/ducks/member/request';
import Divider from '~/views/presentation/divider';
import MInput from '~/views/presentation/fields/input/Input';
import MCKEditor from '~/views/presentation/fields/input/MyCKEditor';
import MSelect from '~/views/presentation/fields/Select';
import { MUploadImageCrop } from '~/views/presentation/fields/upload';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';

import VehicleForm from '../components/VehicleForm';

const InfoForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState({});
  const [expDescription, setExpDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formModalShow, setFormModalShow] = useState(false);
  const [requesterId, setRequesterId] = useState(null);

  useEffect(() => {
    if (props.id) {
    }
  }, [props.id]);

  const onFinish = (values) => {
    // console.log('trandev ~ file: InfoForm.js ~ line 42 ~ onFinish ~ values', values);
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  const onAvatarChange = (file) => {
    form.setFieldsValue({ avatar: file });
  };

  const onDescriptionChange = (data) => {
    form.setFieldsValue({ experience: data });
  };

  return (
    <Form //
      requiredMark={false}
      {...ANT_FORM_SEP_LABEL_LAYOUT}
      scrollToFirstError={{
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always'
      }}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}>
      <Row>
        <Col md={24} lg={12}>
          <MSelect //
            colon={false}
            label={t('select_problem_category')}
            labelAlign="left"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            name="problemCategory"
            noLabel
            fetchData={props.getProblemCategories}
            valueProperty="id"
            labelProperty="name"
            params={{ parentId: 1, lang: 'vi' }}
            placeholder={t('select_problem_category_placeholder')}
            extra={t('select_problem_category_extra')}
            require
          />

          <MInput //
            colon={false}
            label={t('what_is_problem')}
            labelAlign="left"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            name="problemName"
            noLabel
            maxLength={30}
            placeholder={t('what_is_problem_placeholder')}
            extra={t('what_is_problem_extra')}
            require
          />

          <MCKEditor //
            noLabel
            require
            name="problemDetail"
            label={t('problem_detail')}
            value={expDescription}
            onChange={onDescriptionChange}
          />

          <MUploadImageCrop //
            name="media"
            file={avatarFile}
            require={false}
            uploadText="Video/image"
            aspect={1}
            onImageChange={onAvatarChange}
          />

          <Row>
            <Col md={24} lg={12}>
              <MSelect //
                colon={false}
                label={t('select_requester')}
                labelAlign="left"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="requester"
                fetchData={props.getRequesters}
                valueProperty="profileId"
                labelProperty="fullname"
                onChange={(value) => setRequesterId(value)}
                noLabel
                placeholder={t('select_requester_placeholder')}
                require
              />
            </Col>
            <Col md={24} lg={12}>
              <MSelect //
                colon={false}
                label={t('assign_to_helper')}
                labelAlign="left"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="helper"
                noLabel
                fetchData={props.getMechanics}
                valueProperty="profileId"
                labelProperty="fullName"
                placeholder={t('assign_to_helper_placeholder')}
                require={false}
              />
            </Col>
          </Row>
        </Col>

        <Col md={0} lg={1}></Col>

        <Col md={24} lg={11}>
          <MInput //
            colon={false}
            label={t('request_location')}
            labelAlign="left"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            name="location"
            noLabel
            maxLength={30}
            placeholder={t('request_location_placeholder')}
            require
          />

          <MSelect //
            colon={false}
            label={t('select_vehicle')}
            labelAlign="left"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            name="vehicle"
            noLabel
            fetchData={props.getRequesterVehicles}
            valueProperty="id"
            labelProperty="license"
            params={{ memberId: requesterId }}
            placeholder={t('select_vehicle')}
            require={false}
          />

          <AButton
            style={{ verticalAlign: 'middle', minWidth: '200px' }}
            className="px-5 mt-5"
            size="large"
            loading={submitting}
            onClick={() => setFormModalShow(true)}
            type="primary"
            icon={<PlusOutlined />}>
            {t('add_new_vehicle')}
          </AButton>

          <VehicleForm modalShow={formModalShow} setModalShow={setFormModalShow} />
        </Col>
      </Row>

      <Divider />
      <Form.Item>
        <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
          <AButton
            style={{ verticalAlign: 'middle', minWidth: '200px' }}
            className="px-5"
            size="large"
            htmlType="submit"
            loading={submitting}
            type="primary"
            icon={props.submitIcon}>
            {props.submitText}
          </AButton>

          <AButton
            style={{ verticalAlign: 'middle', width: '200px' }}
            className="mt-3 mt-lg-0 ml-lg-3 px-5"
            size="large"
            type="ghost"
            onClick={() => {
              form.resetFields();
              props.onCancel();
            }}
            icon={<CloseOutlined />}>
            {props.cancelText || t('close')}
          </AButton>
        </div>
      </Form.Item>
    </Form>
  );
};

export default connect(null, {
  getMechanicDetail: mechanicActions.getMechanicDetail,
  getProblemCategories: requestActions.getProblemCategories,
  getRequesters: requestActions.getRequesters,
  getRequesterVehicles: requestActions.getRequesterVehicles,
  getMechanics: mechanicActions.getMechanics,
  createMechanic: mechanicActions.createMechanic,
  updateMechanic: mechanicActions.updateMechanic
})(InfoForm);
