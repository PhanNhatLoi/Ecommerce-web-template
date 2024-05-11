import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Divider from '~/views/presentation/divider';
import MInput from '~/views/presentation/fields/input/Input';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ATypography from '~/views/presentation/ui/text/ATypography';

const MInputStyled = styled(MInput)`
  .ant-input-affix-wrapper {
    border: 1px solid #000 !important;
  }
`;

const ConfirmDeleteModal = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState('');

  const confirmAction = (values, action) => {
    const confirmIds = values.confirmId.split(';').map((id) => id.trim());
    setLoading(true);
    Promise.all(
      confirmIds.map((id) => {
        return action(id);
      })
    )
      .then((res) => {
        props.setNeedLoadNewData(true);
        AMessage.success(t(`${actionType}_${props.text}_success`));
        handleCancel();
        setLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: RemoveModal.js ~ line 41 ~ onFinish ~ err', err);
        AMessage.error(t(err.message));
        setLoading(false);
      });
  };

  const onFinish = (values) => {
    confirmAction(values, props.action);
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: ConfirmModal.tsx ~ line 54 ~ onFinishFailed ~ err', err);
  };

  const handleCancel = () => {
    form.resetFields();
    setSubmitDisabled(true);
    props.setModalShow(false);
    props.setData([]);
    setSelectedIds([]);
  };

  // ----------------------------------------
  // FOR VALIDATE INPUT
  // ----------------------------------------
  useEffect(() => {
    if (props.data) {
      props.data.map((d) => setSelectedIds((selectedIds): any => [...selectedIds, d.id]));
      setActionType(head(props.data)?.type);
    }
  }, [props.data]);

  const onFormChange = () => {
    let Ids = form.getFieldValue('confirmId').split(';');
    Ids = Ids.map((m) => m.trim());
    let isSame = true;
    if (selectedIds == Ids) isSame = true;
    else if (selectedIds == null || Ids == null) isSame = false;
    else if (selectedIds.length !== Ids.length) isSame = false;
    else
      for (var i = 0; i < selectedIds.length; ++i) {
        if (selectedIds[i] != Ids[i]) isSame = false;
      }
    setSubmitDisabled(!isSame);
  };
  // ----------------------------------------
  // FOR VALIDATE INPUT
  // ----------------------------------------

  return (
    <AntModal
      title={t(`${actionType}_${props.text}`)}
      description={t(`${actionType}_${props.text}_des`)}
      width={1000}
      modalShow={props.modalShow}
      destroyOnClose
      onOk={onFinish}
      onCancel={handleCancel}>
      <Form //
        {...ANT_FORM_SEP_LABEL_LAYOUT}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onChange={onFormChange}>
        <ATypography className="mb-3">{t(`${actionType}_${props.text}_helper`)}</ATypography>
        <div className="mb-3">
          {props.data.map((item, i) => (
            <ATypography strong key={i}>
              {item.id}
              {`${i < props.data.length - 1 ? ';' : ''}`}{' '}
            </ATypography>
          ))}
        </div>

        <MInputStyled //
          noLabel
          noPadding
          label=""
          name="confirmId"
          placeholder={t(`enter_${props.text}_id`)}
          extra={<span style={{ fontSize: '11px' }}>{t(`remove_${props.text}_extra`)}</span>}
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
              icon={<DeleteOutlined />}>
              {t(`confirm_${actionType}`)}
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

export default connect(null, {})(ConfirmDeleteModal);
