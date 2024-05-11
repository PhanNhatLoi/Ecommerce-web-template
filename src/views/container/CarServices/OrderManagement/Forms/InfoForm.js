import { CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Descriptions, Form, Radio, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TYPOGRAPHY_TYPE } from '~/configs';
import * as PATH from '~/configs/routesConfig';
import { mechanicActions } from '~/state/ducks/mechanic';
import Divider from '~/views/presentation/divider';
import MDatePicker from '~/views/presentation/fields/DatePicker';
import { MCKEditor, MInputNumber } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import { MUploadImageNoCropMultiple } from '~/views/presentation/fields/upload';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import ATypography from '~/views/presentation/ui/text/ATypography';

const InfoForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [problemDescription, setProblemDescription] = useState('');
  const [quotationFile, setQuotaionFile] = useState([]);

  const ORDER_OPTIONS = {
    EXIST_REQUEST: 'existRequest',
    NEW_REQUEST: 'newRequest'
  };
  const [newOrderOption, setNewOrderOption] = useState(ORDER_OPTIONS.EXIST_REQUEST);

  useEffect(() => {
    if (props.id) {
    }
  }, [props.id]);

  const onFinish = (values) => {};

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
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
      <div className="d-flex justify-content-between flex-wrap mb-5">
        <div>
          <AlignedDescription
            column={1}
            labelStyle={{ color: 'rgba(0,0,0,0.5)', width: '120px', verticalAlign: 'top', fontSize: '16px' }}
            contentStyle={{ fontSize: '18px' }}
            colon={false}
            bordered>
            <Descriptions.Item label={`${t('order_id')}`}>
              <b>184654652</b>
              <br />
              <span style={{ fontSize: '14px' }}>
                <b>Order date: Jun 25, 2021 13:00</b>
              </span>
            </Descriptions.Item>
          </AlignedDescription>
        </div>
        <MSelect //
          colon={false}
          label={t('status')}
          labelAlign="left"
          labelCol={{ offset: 12, span: 4 }}
          wrapperCol={{ span: 8 }}
          name="status"
          // noLabel
          options={[
            { value: 'NEW', label: 'New' },
            { value: 'PROCESSING', label: 'Processing' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELED', label: 'Cancel' }
          ]}
          placeholder={t('select_status')}
        />
      </div>

      <Radio.Group className="d-block" onChange={(e) => setNewOrderOption(e.target.value)} value={newOrderOption}>
        <Radio style={{ marginLeft: '24px' }} value={ORDER_OPTIONS.EXIST_REQUEST}>
          {t('select_exist_request')}
        </Radio>
        <div className="row">
          <div className="col-12 col-lg-6">
            <MSelect //
              colon={false}
              label={t('.')}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="request"
              noLabel
              options={[
                { value: 'NEW', label: '9846546 - Tires broken' },
                { value: 'PROCESSING', label: '98462162 - Tires broken' }
              ]}
              placeholder={t('select_request')}
            />
          </div>
          <div className="col-12 col-lg-6">
            <MSelect //
              colon={false}
              label={t('customer')}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="customer"
              noLabel
              options={[
                { value: 'NEW', label: 'Elon Musk' },
                { value: 'PROCESSING', label: 'Bill Clinton' }
              ]}
              placeholder={t('select_customer')}
              tooltip={{
                title: t('required_field'),
                icon: (
                  <span>
                    (<ATypography type="danger">*</ATypography>)
                  </span>
                )
              }}
            />
          </div>
        </div>
        {newOrderOption === ORDER_OPTIONS.EXIST_REQUEST && (
          <>
            <Row style={{ marginTop: '40px' }}>
              <Col md={24} lg={7}>
                <AlignedDescription
                  column={1}
                  labelStyle={{ color: 'rgba(0,0,0,0.5)', width: '150px', verticalAlign: 'top' }}
                  colon={false}
                  bordered>
                  <Descriptions.Item label={t('picked_up_by')}>David Ward</Descriptions.Item>
                  <Descriptions.Item label={t('quotation')}>
                    <AButton type="link" className="pl-0">
                      9845951219
                    </AButton>
                  </Descriptions.Item>
                </AlignedDescription>
              </Col>
              <Col md={24} lg={8}>
                <AlignedDescription
                  column={1}
                  labelStyle={{
                    color: 'rgba(0,0,0,0.5)',
                    width: '200px',
                    verticalAlign: 'top'
                  }}
                  colon={false}
                  contentStyle={{ padding: 0 }}
                  bordered>
                  <Descriptions.Item label={t('picked_up_date')}>Jun 26, 2021 13:45</Descriptions.Item>
                  <Descriptions.Item label={`${t('total_fee')}`}>$7,800.00</Descriptions.Item>
                </AlignedDescription>
              </Col>
              <Col md={24} lg={9}>
                <AlignedDescription
                  column={1}
                  labelStyle={{
                    color: 'rgba(0,0,0,0.5)',
                    width: '240px',
                    verticalAlign: 'top'
                  }}
                  colon={false}
                  contentStyle={{ padding: 0 }}
                  bordered>
                  <Descriptions.Item label={t('accept_date')}>Jun 26, 2021 13:45</Descriptions.Item>
                  <Descriptions.Item label={t('quotation_accept_date')}>Jun 26, 2021 13:45</Descriptions.Item>
                </AlignedDescription>
              </Col>
            </Row>

            <Divider />

            <Form.Item>
              <div className="mb-5" style={{ border: '1px solid #000', overflow: 'auto' }}>
                <div className="row" style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '8px 16px' }}>
                  <div className="col-1">
                    <ATypography>ITEM</ATypography>
                  </div>
                  <div className="col-5"></div>
                  <div className="col-2">COST</div>
                  <div className="col-2">QUANTITY</div>
                  <div className="col-2">TOTAL</div>
                </div>
                <div className="row" style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '8px 16px' }}>
                  <div className="col-1">image</div>
                  <div className="col-5">
                    <AButton type="link" className="pl-0">
                      Maxis tires 650 R
                    </AButton>
                    <p>SKU: MOJ9039</p>
                  </div>
                  <div className="col-2">$350.00</div>
                  <div className="col-2">x2</div>
                  <div className="col-2">$700.00</div>
                </div>
                <div className="row" style={{ padding: '8px 16px' }}>
                  <div className="col-1"></div>
                  <div className="col-5">
                    <p>Come to check car issue</p>
                  </div>
                  <div className="col-2">$20.00</div>
                  <div className="col-2">x1</div>
                  <div className="col-2">$20.00</div>
                </div>
              </div>
              <div className="row mt-5 mb-3">
                <div className="col-1"></div>
                <div className="col-5"></div>
                <div className="col-2">
                  <h3>Items subtotal:</h3>
                </div>
                <div className="col-2"></div>
                <div className="col-2">
                  <h4>$720.00</h4>
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-1"></div>
                <div className="col-5"></div>
                <div className="col-2">
                  <h3>Order total:</h3>
                </div>
                <div className="col-2"></div>
                <div className="col-2">
                  <h3>
                    <b>$720.00</b>
                  </h3>
                </div>
              </div>
            </Form.Item>
          </>
        )}

        <Divider />

        <Radio style={{ marginLeft: '24px' }} className="mb-4" value={ORDER_OPTIONS.NEW_REQUEST}>
          {t('create_new_request')}
        </Radio>

        {newOrderOption === ORDER_OPTIONS.NEW_REQUEST && (
          <>
            <Row style={{ marginLeft: '24px' }}>
              <Col md={24} lg={11}>
                <MSelect //
                  colon={false}
                  label={t('car_problem')}
                  labelAlign="left"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  name="requestId"
                  noLabel
                  options={[
                    { value: 'NEW', label: '9846546 - Tires broken' },
                    { value: 'PROCESSING', label: '98462162 - Tires broken' }
                  ]}
                  placeholder={t('select_request')}
                />
                <MCKEditor //
                  noPadding
                  noLabel
                  require={false}
                  name="problemDescripiton"
                  label={t('problem_description')}
                  value={problemDescription}
                  onChange={(data) => {
                    form.setFieldsValue({ problemDescripiton: data });
                  }}
                />
                <MSelect //
                  colon={false}
                  label={t('customer')}
                  labelAlign="left"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  name="customerId"
                  noLabel
                  options={[
                    { value: 'NEW', label: 'Elon Musk' },
                    { value: 'PROCESSING', label: 'Bill Clinton' }
                  ]}
                  placeholder={t('select_customer')}
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
              <Col md={24} lg={1} />
              <Col md={24} lg={12}>
                <Form.Item label={t('quotation')}>
                  <Form.List name="quotation">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <div key={key} className="row mb-5">
                            <div className="col-11">
                              <div style={{ border: '0.5px solid #000' }} className="p-2 mr-2">
                                <MSelect //
                                  colon={false}
                                  label={undefined}
                                  labelAlign="left"
                                  wrapperCol={{ span: 24 }}
                                  name={[name, 'workItem']}
                                  noLabel
                                  options={[
                                    { value: 'NEW', label: '9846546 - Tires broken' },
                                    { value: 'PROCESSING', label: '98462162 - Tires broken' }
                                  ]}
                                  placeholder={t('working_item')}
                                />
                                <MInputNumber //
                                  fullWidth
                                  require
                                  noLabel
                                  label={undefined}
                                  placeholder={t('price')}
                                  name={[name, 'price']}
                                />
                                <MUploadImageNoCropMultiple //
                                  noLabel
                                  fileList={quotationFile}
                                  name={[name, 'quotationFile']}
                                  require={false}
                                  label={t('upload_image/video')}
                                  onImageChange={(file) => {
                                    form.setFieldsValue({ certificates: file });
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-1 d-flex align-items-center">
                              <Form.Item>
                                <DeleteOutlined style={{ fontSize: '18px' }} onClick={() => remove(name)} />
                              </Form.Item>
                            </div>
                          </div>
                        ))}
                        <Form.Item>
                          <AButton type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            {t('add_work_item')}
                          </AButton>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                  <Divider />
                  <Form.Item>
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <ATypography>{t('total_fee')}:</ATypography>
                      <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
                        $2,020.00
                      </ATypography>
                    </div>
                  </Form.Item>
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Row>
              <Col md={24} lg={12}>
                <MSelect //
                  colon={false}
                  label={t('mechanic')}
                  labelAlign="left"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  name="mechanic"
                  noLabel
                  options={[
                    { value: 'NEW', label: 'Jon Snow' },
                    { value: 'PROCESSING', label: 'Justin Timberlake' }
                  ]}
                  placeholder={t('select_mechanic')}
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
              <Col md={24} lg={12}>
                <MDatePicker noLabel label={t('repaired_date')} placeholder={t('select_due_date')} name="dueDate" />
              </Col>
            </Row>
          </>
        )}

        <Divider />
      </Radio.Group>

      <Form.Item>
        {props.isPage ? (
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <AButton
              style={{ verticalAlign: 'middle', width: '250px' }}
              className="px-5"
              size="large"
              htmlType="submit"
              loading={submitting}
              type="primary"
              icon={props.submitIcon}>
              {props.submitText}
            </AButton>
            <AButton
              style={{ verticalAlign: 'middle', width: '250px' }}
              className="mt-3 mt-lg-0 ml-lg-3 px-5"
              size="large"
              loading={submitting}
              onClick={() => {
                form.submit();
                history.push(PATH.CAR_SERVICES_CUSTOMER_LIST_PATH);
              }}
              icon={props.submitIcon}>
              {props.secondarySubmitText}
            </AButton>
          </div>
        ) : (
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <AButton
              style={{ verticalAlign: 'middle', width: '250px' }}
              className="px-5"
              size="large"
              htmlType="submit"
              loading={submitting}
              type="primary"
              icon={props.submitIcon}>
              {props.submitText}
            </AButton>
            <AButton
              style={{ verticalAlign: 'middle', width: '250px' }}
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
        )}
      </Form.Item>
    </Form>
  );
};

export default connect(null, {
  getMechanicDetail: mechanicActions.getMechanicDetail,
  createMechanic: mechanicActions.createMechanic,
  updateMechanic: mechanicActions.updateMechanic
})(InfoForm);
