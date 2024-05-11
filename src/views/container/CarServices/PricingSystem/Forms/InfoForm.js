import { CloseOutlined } from '@ant-design/icons';
import { Col, Form, Radio, Row, Tabs } from 'antd/es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { GUARANTEE_TYPE } from '~/configs';
import { PRICING_STEP, PRICING_UNIT } from '~/configs/status/car-services/pricingSystemStatus';
import { ACCEPT_IMAGE_UPLOAD } from '~/configs/upload';
import { itemsActions } from '~/state/ducks/items';
import { pricingSystemActions } from '~/state/ducks/mechanic/pricingSystem';
import Divider from '~/views/presentation/divider';
import { MCKEditor, MInput, MInputNumber } from '~/views/presentation/fields/input';
import MRadio from '~/views/presentation/fields/Radio';
import MSelect from '~/views/presentation/fields/Select';
import { MUploadImageCrop } from '~/views/presentation/fields/upload';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';

const { TabPane } = Tabs;

const MInputNumberStyled = styled(MInputNumber)`
  .ant-input-number-group-addon {
    border: none;
    padding: 0px;
  }

  .ant-input-number-group-addon:last-child {
    background-color: white;
  }

  .ant-form-item-has-feedback.ant-form-item-has-success .ant-form-item-children-icon {
    right: 79px;
  }
`;

const MAX_INPUT_NUMBER = 99999999;

const InfoForm = (props) => {
  const { t } = useTranslation();
  const [image, setImage] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [currencyValue, setCurrencyValue] = useState(PRICING_UNIT.DONG);

  const guaranteeCheckWatch = Form.useWatch('guaranteeCheck', props.form);

  //----------------------------------------------------------------
  // FOR API HANDLE
  //----------------------------------------------------------------
  const catchPromiseError = (err) => {
    setLoading(false);
    AMessage.error(t(err.message));
    console.error('trandev ~ file: InfoForm.js ~ line 31 ~ useEffect ~ err', err);
  };

  useEffect(() => {
    if (props.id) {
      setLoading(true);
      props
        .getPricingProductDetail(props.id)
        .then((res) => {
          const response = res?.content;

          props.form.setFieldsValue({
            ...response,
            guaranteeTime: response?.warrantyPolicy?.guaranteeTime,
            guaranteeKm: response?.warrantyPolicy?.guaranteeKm,
            guaranteeCheck: response?.warrantyPolicy?.guaranteeTime
              ? GUARANTEE_TYPE.GUARANTEE_TIME
              : response?.warrantyPolicy?.guaranteeKm
              ? GUARANTEE_TYPE.GUARANTEE_KM
              : GUARANTEE_TYPE.NONE_GUARANTEE
          });
          setDetails(response?.description);
          setImage(response?.image);
          props.setDirty(false);
          setLoading(false);
        })
        .catch((err) => {
          catchPromiseError(err);
        });
    } else props.form.setFieldsValue({ guaranteeCheck: GUARANTEE_TYPE.NONE_GUARANTEE });
  }, [props.id]);
  //----------------------------------------------------------------
  // FOR API HANDLE
  //----------------------------------------------------------------

  //----------------------------------------------------------------
  // FOR FORM SUBMIT
  //----------------------------------------------------------------
  const submitForm = (action, body, successMessage) => {
    action(body)
      .then((res) => {
        AMessage.success(t(successMessage));
        props.setNeedLoadNewData && props.setNeedLoadNewData(true);
        props.onOk();
        setSubmitting(false);
      })
      .catch((err) => {
        catchPromiseError(err);
        setSubmitting(false);
      });
  };

  const onFinish = (values) => {
    setSubmitting(true);
    const body = {
      name: values?.name,
      code: values?.code,
      description: values?.description,
      price: values?.price,
      salePrice: values?.salePrice,
      origin: values?.origin,
      image: values?.image,
      unit: values?.unit,
      warrantyPolicy: {
        guaranteeTime: values?.guaranteeTime || null,
        guaranteeKm: values?.guaranteeKm || null
      }
    };

    !props.id
      ? // create product
        submitForm(
          //
          props.createPricingProduct,
          body,
          'create_pricing_product_success'
        )
      : // update product
        submitForm(
          //
          props.updatePricingProduct,
          { id: props.id, body: { ...body, id: props.id } },
          'update_pricing_product_success'
        );
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };
  //----------------------------------------------------------------
  // FOR FORM SUBMIT
  //----------------------------------------------------------------

  const onDetailsChange = (data) => {
    props.setDirty(Boolean(data));
    props.form.setFieldsValue({ description: data });
  };

  const onImageChange = (file) => {
    props.setDirty(Boolean(file));
    props.form.setFieldsValue({ image: file });
  };

  const onFormChange = () => {
    setSubmitDisabled(!Boolean(props.form.getFieldValue('name')));
    props.setDirty(true);
  };

  return (
    <Form //
      {...ANT_FORM_SEP_LABEL_LAYOUT}
      scrollToFirstError={{
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always'
      }}
      requiredMark={false}
      form={props.form}
      onValuesChange={onFormChange}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}>
      <Row>
        <Col md={24} lg={15}>
          <MInput
            noLabel
            loading={loading}
            noPadding
            readOnly={!props.isEditing}
            label={t('product/service_name')}
            placeholder={t('enter_product_or_service_name')}
            name="name"
            maxLength={200}
            extra={<span style={{ fontSize: '11px' }}>{t('product/service_name_extra')}</span>}
            tooltip={{
              title: t('required_field'),
              icon: (
                <span>
                  (<ATypography type="danger">*</ATypography>)
                </span>
              )
            }}
          />
          <MInput
            noLabel
            loading={loading}
            require={false}
            mRules={[{ max: 30, message: t('max_length_30') }]}
            noPadding
            readOnly={!props.isEditing}
            label={t('product/service_code')}
            placeholder={t('enter_product_or_service_code')}
            name="code"
            extra={<span style={{ fontSize: '11px' }}>{t('product/service_code_extra')}</span>}
          />
          <MCKEditor //
            loading={loading}
            noPadding
            noLabel
            require={false}
            mRules={[{ max: 10000, message: t('max_length_10000') }]}
            name="description"
            label={t('product_or_service_details')}
            value={details}
            onChange={onDetailsChange}
          />

          <Tabs defaultActiveKey="1" type="line">
            <TabPane tab={t('generalSettings')} key="1">
              <Row>
                <Col sm={24} md={11} lg={11} className="w-100 mb-5">
                  <MInputNumberStyled
                    colon={false}
                    min={0}
                    loading={loading}
                    noLabel
                    noPadding
                    hasFeedback={false}
                    max={MAX_INPUT_NUMBER}
                    addonAfter={
                      <MRadio
                        noPadding
                        spaceSize={0}
                        label=""
                        options={[
                          { label: 'đ', value: PRICING_UNIT.DONG },
                          { label: '$', value: PRICING_UNIT.DOLLARS }
                        ]}
                        onChange={(e) => setCurrencyValue(e.target.value)}
                        defaultValue={currencyValue}
                        optionType="button"
                        buttonStyle="solid"
                      />
                    }
                    step={currencyValue === PRICING_UNIT.DONG ? PRICING_STEP.DONG : PRICING_STEP.DOLLARS}
                    readOnly={!props.isEditing}
                    label={t('regularPrice')}
                    placeholder={t('Ex') + ': 120'}
                    name="price"
                    tooltip={{
                      title: t('required_field'),
                      icon: (
                        <span>
                          (<ATypography type="danger">*</ATypography>)
                        </span>
                      )
                    }}
                  />
                </Col>

                <Col sm={24} md={2} lg={2}></Col>

                <Col sm={24} md={11} lg={11} className="w-100 mb-5">
                  <MInputNumberStyled //
                    colon={false}
                    hasFeedback={false}
                    min={0}
                    loading={loading}
                    noLabel
                    noPadding
                    max={MAX_INPUT_NUMBER}
                    addonAfter={
                      <MRadio
                        noPadding
                        spaceSize={0}
                        label=""
                        options={[
                          { label: 'đ', value: PRICING_UNIT.DONG },
                          { label: '$', value: PRICING_UNIT.DOLLARS }
                        ]}
                        onChange={(e) => setCurrencyValue(e.target.value)}
                        defaultValue={currencyValue}
                        optionType="button"
                        buttonStyle="solid"
                      />
                    }
                    step={currencyValue === PRICING_UNIT.DONG ? PRICING_STEP.DONG : PRICING_STEP.DOLLARS}
                    readOnly={!props.isEditing}
                    label={t('salePrice')}
                    placeholder={t('Ex') + ': 100'}
                    name="salePrice"
                    tooltip={{
                      title: t('required_field'),
                      icon: (
                        <span>
                          (<ATypography type="danger">*</ATypography>)
                        </span>
                      )
                    }}
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={t('detail')} key="2">
              <Row>
                <Col sm={24} md={11} lg={11} className="w-100 mb-5">
                  <MSelect
                    name="origin"
                    label={t('origin')}
                    placeholder={t('origin')}
                    noPadding
                    noLabel
                    require={false}
                    allowClear
                    fetchData={props.getCounties}
                    valueProperty="name"
                    labelProperty="name"
                  />
                </Col>

                <Col sm={24} md={2} lg={2}></Col>

                <Col sm={24} md={11} lg={11} className="w-100 mb-5">
                  <MInput noLabel loading={loading} require={false} noPadding label={t('unit')} placeholder={t('unit')} name="unit" />
                </Col>

                <Col sm={24} md={11} lg={11} className="w-100 mb-5">
                  <MRadio
                    name="guaranteeCheck"
                    label={t('warrantyPolicy')}
                    noLabel
                    noPadding
                    require={false}
                    direction="vertical"
                    spaceSize="middle"
                    value={guaranteeCheckWatch}
                    options={[
                      { value: GUARANTEE_TYPE.NONE_GUARANTEE, label: t('noWarranty') },
                      { value: GUARANTEE_TYPE.GUARANTEE_TIME, label: t('warrantyTime') },
                      { value: GUARANTEE_TYPE.GUARANTEE_KM, label: t('warrantyKm') }
                    ]}
                    className="mb-6"
                  />
                </Col>

                <Col sm={24} md={2} lg={2}></Col>

                <Col sm={24} md={11} lg={11} className="w-100 mb-5">
                  {guaranteeCheckWatch === GUARANTEE_TYPE.GUARANTEE_TIME && (
                    <MInputNumberStyled
                      className=" w-100"
                      require={true}
                      min={1}
                      colon={true}
                      labelAlign="left"
                      label={t('warrantyTime')}
                      noPadding
                      customLayout="w-100"
                      name="guaranteeTime"
                      hasFeedback={false}
                      formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
                      addonAfter={<span style={{ fontSize: '13px' }}>{t('month')}</span>}
                    />
                  )}

                  {guaranteeCheckWatch === GUARANTEE_TYPE.GUARANTEE_KM && (
                    <MInputNumberStyled
                      className=" w-100"
                      require={true}
                      min={1}
                      colon={true}
                      labelAlign="left"
                      label={t('warrantyKm')}
                      noPadding
                      customLayout="w-100"
                      name="guaranteeKm"
                      hasFeedback={false}
                      formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
                    />
                  )}
                </Col>

                {/* <MInputNumber
                    name="guaranteeTime"
                    label={t('guaranteeTime')}
                    placeholder={t('guaranteeTime')}
                    colon={true}
                    noLabel
                    noPadding
                    require={false}
                  /> */}
              </Row>
            </TabPane>
          </Tabs>
        </Col>

        <Col md={0} lg={2}></Col>

        <Col md={24} lg={7}>
          <MUploadImageCrop
            noLabel
            noPadding
            require={false}
            extra={t('best_display_with_1')}
            file={image}
            accept={ACCEPT_IMAGE_UPLOAD.join(', ')}
            onImageChange={onImageChange}
            label={t('thumbnail_image')}
            name="image"
            uploadText={t('upload_image')}
            aspect={1}
          />
        </Col>
      </Row>

      <Divider />
      <Form.Item>
        <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
          <BasicBtn
            size="large"
            htmlType="submit"
            disabled={submitDisabled}
            loading={submitting}
            type="primary"
            icon={props.submitIcon}
            title={props.submitText}
          />
          <BasicBtn
            size="large"
            type="ghost"
            onClick={() => {
              props.onCancel();
            }}
            icon={<CloseOutlined />}
            title={props.cancelText || t('close')}
          />
        </div>
      </Form.Item>
    </Form>
  );
};

export default connect(null, {
  getPricingProducts: pricingSystemActions.getPricingProducts,
  createPricingProduct: pricingSystemActions.createPricingProduct,
  updatePricingProduct: pricingSystemActions.updatePricingProduct,
  getPricingProductDetail: pricingSystemActions.getPricingProductDetail,
  getCounties: itemsActions.getCounties
})(InfoForm);
