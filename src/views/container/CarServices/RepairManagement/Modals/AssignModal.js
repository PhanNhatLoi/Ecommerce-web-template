import { CheckOutlined, CloseOutlined, DeleteOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { requestActions } from '~/state/ducks/member/request';
import Divider from '~/views/presentation/divider';
import MInput from '~/views/presentation/fields/input/Input';
import MTextArea from '~/views/presentation/fields/input/TextArea';
import MSelect from '~/views/presentation/fields/Select';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { AList, AListItem, AListItemMeta } from '~/views/presentation/ui/list/AList';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ATypography from '~/views/presentation/ui/text/ATypography';

const MTextAreaStyled = styled(MTextArea)`
  .ant-input-affix-wrapper {
    border: 1px solid #000 !important;
  }
  .ant-form-item-label {
    text-align: left;
  }
  .ant-input {
    border: 1px solid #000 !important;
  }
`;

const AssignModal = (props) => {
  const { modalShow, setModalShow, data, setData } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [listLoading, setListLoading] = useState(false);
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    form.setFieldsValue({ currentState: 'Elon Musk' });
  }, []);

  const onFinish = (values) => {
    setTimeout(() => {
      AMessage.error('Waiting for api!');
    }, 500);
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
  };

  const handleCancel = () => {
    form.resetFields();
    setSubmitDisabled(true);
    setModalShow(false);
    // setData([]);
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

  const removeRequest = (id) => {
    const newRequestList = requestList.filter((request) => request?.requestId !== id);
    setRequestList(newRequestList);
  };

  const onFormChange = (changeFields, allFields) => {
    const changeField = head(changeFields);
    if (head(changeField?.name) === 'request') {
      addRequest(changeField?.value);
      form.setFieldsValue({ request: '' });
    }
  };

  return (
    <AntModal
      title={t('change_advisor')}
      description={t('change_advisor_des')}
      width={1000}
      modalShow={modalShow}
      destroyOnClose
      onOk={onFinish}
      onCancel={handleCancel}>
      <Form //
        {...ANT_FORM_SEP_LABEL_LAYOUT}
        form={form}
        onFinish={onFinish}
        onFieldsChange={onFormChange}
        onFinishFailed={onFinishFailed}>
        <MSelect
          name="request"
          noLabel
          noPadding
          label={t('select_repair_id')}
          placeholder={t('search_repair_id')}
          fetchData={props.getRequests}
          searchCorrectly={false}
          valueProperty="requestId"
          labelProperty="category"
          tooltip={{
            title: t('required_field'),
            icon: (
              <span>
                (<ATypography type="danger">*</ATypography>)
              </span>
            )
          }}
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
                    <AButton type="link">{t('view_full_map')} </AButton>
                  </div>
                }
              />
              <div>
                <AButton type="link" onClick={() => removeRequest(item?.requestId)} icon={<DeleteOutlined style={{ color: '#000' }} />} />
              </div>
            </AListItem>
          )}
        />
        <div className="row">
          <div className="col-5">
            <MInput
              noLabel
              loading={false}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              disabled={true}
              require={false}
              readOnly={!props.isEditing}
              name="currentState"
              label={t('current_advisor')}
            />
          </div>
          <div className="col-2 d-flex align-items-center justify-content-center">
            <DoubleRightOutlined />
          </div>
          <div className="col-5">
            <MSelect //
              colon={false}
              label={t('next_advisor')}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="nextState"
              noLabel
              options={[{ value: 1, label: 'Jeff Bezos' }]}
              placeholder={t('select_advisor')}
            />
          </div>
        </div>
        <MTextAreaStyled //
          rows={6}
          require={false}
          noLabel
          name="notes"
          label={t('notes')}
          placeholder={t('repair_advisor_note_placeholder')}
        />
        <Divider />
        <Form.Item>
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <AButton
              style={{ verticalAlign: 'middle', minWidth: '200px' }}
              className="px-5"
              loading={loading}
              size="large"
              disabled={submitDisabled}
              htmlType="submit"
              type="primary"
              icon={<CheckOutlined />}>
              {t('done')}
            </AButton>
            <AButton
              style={{ verticalAlign: 'middle', width: '200px' }}
              className="mt-3 mt-lg-0 ml-lg-3 px-5"
              size="large"
              type="ghost"
              onClick={handleCancel}
              icon={<CloseOutlined />}>
              {t('close')}
            </AButton>
          </div>
        </Form.Item>
      </Form>
    </AntModal>
  );
};

export default connect(null, {
  getRequests: requestActions.getRequests,
  getRequestDetail: requestActions.getRequestDetail
})(AssignModal);
