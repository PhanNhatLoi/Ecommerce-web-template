import { CloseCircleOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Form, Row } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { mechanicActions } from '~/state/ducks/mechanic';
import { requestActions } from '~/state/ducks/mechanic/request';
import Divider from '~/views/presentation/divider';
import { MCKEditor, MInput, MInputNumber } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import { MUploadImageNoCropMultiple } from '~/views/presentation/fields/upload';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { AList, AListItem, AListItemMeta } from '~/views/presentation/ui/list/AList';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';

const QuotationItem = (props) => {
  const { t } = useTranslation();
  const [mediaList, setMediaList] = useState([]);
  const onMediaListChange = (file) => {};

  return (
    <div className="d-flex align-items-center justify-content-between m-5">
      <div className="p-5" style={{ border: '1px solid #000' }}>
        <MSelect
          name="request"
          noLabel
          noPadding
          label={t('select_request')}
          placeholder={t('search_request')}
          fetchData={props.getRequests}
          searchCorrectly={false}
          valueProperty="requestId"
          labelProperty="category"
        />
        <div className="row">
          <div className="col-6">
            <MInput //
              label={t('price')}
              labelAlign="left"
              noPadding
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="price"
              noLabel
              require={false}
              placeholder={t('price')}
            />
          </div>
          <div className="col-6">
            <MInputNumber //
              fullWidth
              noPadding
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              noLabel
              label={t('quantity')}
              placeholder={t('quantity')}
              name="quantity"
            />
          </div>
        </div>
        <div className="mt-5">
          <MUploadImageNoCropMultiple //
            noLabel
            noPadding
            fileList={mediaList}
            name="media"
            require={false}
            label={t('')}
            onImageChange={onMediaListChange}
          />
        </div>
      </div>
      <div className="ml-3">
        <DeleteOutlined style={{ color: '#000' }} />
      </div>
    </div>
  );
};

const QuotationInfoForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [quotationNote, setQuotationNote] = useState('');
  const [mediaList, setMediaList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {}, [props.id]);

  const onFinish = (values) => {};

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  const onQuotationNotesChange = (data) => {
    form.setFieldsValue({ quotationNote: data });
  };

  const onMediaListChange = (file) => {
    form.setFieldsValue({
      certificates: JSON.stringify(
        (file || []).map((cer) => {
          return {
            url: cer,
            type: 'IMAGE'
          };
        })
      )
    });
  };

  const removeRequest = (id) => {
    const newRequestList = requestList.filter((request) => request?.requestId !== id);
    setRequestList(newRequestList);
  };

  const addRequest = (id) => {
    const requestIds = requestList.map((request) => request.requestId);
    if (id && !requestIds?.includes(id)) {
      setListLoading(true);
      props
        .getRequestDetail(id)
        .then((res) => {
          setRequestList([...requestList, res?.content]);
          setListLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
          setListLoading(false);
        });
    }
  };

  const onFormChange = (changeFields, allFields) => {
    const changeField = head(changeFields);
    if (head(changeField?.name) === 'request') {
      addRequest(changeField?.value);
      form.setFieldsValue({ request: '' });
    }
  };

  return (
    <Form //
      requiredMark={false}
      {...ANT_FORM_SEP_LABEL_LAYOUT}
      form={form}
      onFinish={onFinish}
      onFieldsChange={onFormChange}
      onFinishFailed={onFinishFailed}>
      <Row>
        <Col md={24} lg={11}>
          <MSelect
            name="request"
            noLabel
            tooltip={{
              title: t('required_field'),
              icon: (
                <span>
                  (<ATypography type="danger">*</ATypography>)
                </span>
              )
            }}
            noPadding
            label={t('select_request')}
            placeholder={t('search_request')}
            fetchData={props.getRequests}
            searchCorrectly={false}
            valueProperty="requestId"
            labelProperty="category"
          />

          <AList //
            style={{ maxHeight: 300, overflowY: 'scroll' }}
            className="mb-3"
            bordered
            loading={listLoading}
            dataSource={requestList}
            renderItem={(item) => (
              <AListItem key={item?.requestId}>
                <AListItemMeta //
                  avatar={<ATypography strong>{item?.requestId}</ATypography>}
                  title={<ATypography>{item?.category}</ATypography>}
                  description=""
                />
                <div>
                  <AButton
                    type="link"
                    onClick={() => removeRequest(item?.requestId)}
                    icon={<CloseCircleOutlined style={{ color: '#000' }} />}
                  />
                </div>
              </AListItem>
            )}
          />
          <MSelect
            name="serviceAdvisor"
            noLabel
            noPadding
            label={t('quotation_service_advisor')}
            placeholder={t('quotation_service_advisor_placeholder')}
            fetchData={props.getMechanics}
            searchCorrectly={false}
            valueProperty="profileId"
            labelProperty="fullName"
            params={{}}
            require
          />
          <Divider />
          <MUploadImageNoCropMultiple //
            noLabel
            noPadding
            fileList={mediaList}
            name="media"
            require={false}
            label={t('quotation_media')}
            onImageChange={onMediaListChange}
          />
          <MCKEditor //
            loading={loading}
            noPadding
            noLabel
            require={false}
            name="quotationNote"
            label={t('quotation_notes')}
            value={quotationNote}
            onChange={onQuotationNotesChange}
          />
        </Col>

        <Col md={0} lg={1}></Col>

        <Col md={24} lg={12}>
          <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
            {t('quotation_details')}
          </ATypography>
          <div className="p-5" style={{ border: '1px solid #f1f1f1' }}>
            <QuotationItem />
            <AButton type="dashed" block icon={<PlusOutlined />}>
              {t('add_more_item')}
            </AButton>

            <Divider />
            <div className="d-flex justify-content-between align-items-center">
              <ATypography>{t('total_fee')}:</ATypography>
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
                $2,200.00
              </ATypography>
            </div>
          </div>
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
  getMechanics: mechanicActions.getMechanics,
  getRequests: requestActions.getRequests,
  getRequestDetail: requestActions.getRequestDetail
})(QuotationInfoForm);
