import Icon, { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { memberActions } from '~/state/ducks/member';
import { requestActions } from '~/state/ducks/member/request';
import Divider from '~/views/presentation/divider';
import MSelect from '~/views/presentation/fields/Select';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { AList, AListItem, AListItemMeta } from '~/views/presentation/ui/list/AList';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';

const ShareIcon = () => {
  return <i className="fas fa-share"></i>;
};

const AssignForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    if (props.id) {
    }
  }, [props.id]);

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

  const onFinish = (values) => {
    // console.log('trandev ~ file: AssignForm.js ~ line 42 ~ onFinish ~ values', values);
    AMessage.error('Waiting for api!');
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  const onFormChange = (changeFields, allFields) => {
    const changeField = head(changeFields);
    if (head(changeField?.name) === 'request') {
      addRequest(changeField?.value);
      form.setFieldsValue({ request: '' });
    }
  };

  const removeRequest = (id) => {
    const newRequestList = requestList.filter((request) => request?.requestId !== id);
    setRequestList(newRequestList);
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
      onFieldsChange={onFormChange}
      onFinishFailed={onFinishFailed}>
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
              description={
                <div>
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {item?.fullAddress}
                  <AButton type="link">{t('view_full_map')}</AButton>
                </div>
              }
            />
            <div>
              <AButton type="link" onClick={() => removeRequest(item?.requestId)} icon={<DeleteOutlined style={{ color: '#000' }} />} />
            </div>
          </AListItem>
        )}
      />

      <MSelect
        name="helper"
        noLabel
        noPadding
        label={t('assign_to')}
        placeholder={t('select_helper')}
        fetchData={props.getMembers}
        searchCorrectly={false}
        valueProperty="profileId"
        labelProperty="fullName"
        require
      />

      <Divider />
      <Form.Item>
        <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
          <AButton
            style={{ verticalAlign: 'middle', width: '200px' }}
            className="px-5"
            size="large"
            htmlType="submit"
            loading={submitting}
            type="primary"
            icon={<Icon component={ShareIcon} />}>
            {t('assign')}
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
  getRequests: requestActions.getRequests,
  getMembers: memberActions.getMembers,
  getRequestDetail: requestActions.getRequestDetail
})(AssignForm);
