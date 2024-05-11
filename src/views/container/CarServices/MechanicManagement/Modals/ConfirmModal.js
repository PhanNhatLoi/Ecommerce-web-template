import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { mechanicActions } from '~/state/ducks/mechanic';
import Divider from '~/views/presentation/divider';
import MInput from '~/views/presentation/fields/input/Input';
import MTextArea from '~/views/presentation/fields/input/TextArea';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ATypography from '~/views/presentation/ui/text/ATypography';

const MInputStyled = styled(MInput)`
  .ant-input-affix-wrapper {
    border: 1px solid #000 !important;
  }
`;

const MTextAreaStyled = styled(MTextArea)`
  textarea.ant-input {
    border: 1px solid #000 !important;
  }
`;

const ConfirmModal = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState('');

  const confirmAction = (values, action) => {
    const confirmIds = values.confirmId.split(';').map((id) => id.trim());
    setLoading(true);
    for (const id of confirmIds) {
      action(id)
        .then((res) => {
          props.setNeedLoadNewData(true);
          AMessage.success(t(`${actionType}_mechanic_success`));
          setLoading(false);
          handleCancel();
        })
        .catch((err) => {
          setLoading(false);
          console.error('trandev ~ file: RemoveModal.js ~ line 41 ~ onFinish ~ err', err);
          AMessage.error(t(err.message));
        });
    }
  };

  const onFinish = (values) => {
    switch (actionType) {
      case 'approve':
        confirmAction(values, props.approveMechanic);
        break;
      case 'block':
        confirmAction(values, props.blockMechanic);
        break;
      case 'unblock':
        confirmAction(values, props.approveMechanic);
        break;
      case 'delete':
        confirmAction(values, props.deleteMechanic);
        break;
      case 'reject':
        confirmAction(values, props.rejectMechanic);
        break;
      default:
        break;
    }
  };

  const renderSubmitIcon = () => {
    switch (actionType) {
      case 'approve':
        return <CheckCircleOutlined />;
      case 'block':
        return <StopOutlined />;
      case 'unblock':
        return <CheckCircleOutlined />;
      case 'delete':
        return <DeleteOutlined />;
      case 'reject':
        return <CloseCircleOutlined />;
      default:
        break;
    }
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
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
      props.data.map((d) => setSelectedIds((selectedIds) => [...selectedIds, d.id]));
      setActionType(head(props.data)?.type);
    }
  }, [props.data]);

  const onFormChange = () => {
    let mechanicIds = form.getFieldValue('confirmId').split(';');
    mechanicIds = mechanicIds.map((m) => m.trim());
    let isSame = true;
    if (selectedIds == mechanicIds) isSame = true;
    else if (selectedIds == null || mechanicIds == null) isSame = false;
    else if (selectedIds.length !== mechanicIds.length) isSame = false;
    else
      for (var i = 0; i < selectedIds.length; ++i) {
        if (selectedIds[i] != mechanicIds[i]) isSame = false;
      }
    setSubmitDisabled(!isSame);
  };
  // ----------------------------------------
  // FOR VALIDATE INPUT
  // ----------------------------------------

  return (
    <AntModal
      title={t(`${actionType}_mechanic`)}
      description={t(`${actionType}_mechanic_des`)}
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
        <ATypography className="mb-3">{t(`${actionType}_mechanic_helper`)}</ATypography>
        <div className="mb-3">
          {props.data.map((item, i) => (
            <ATypography strong>
              {item.id}{' '}
              <ATypography className="text-muted">
                ({item.fullName}){`${i < props.data.length - 1 ? ';' : ''}`}{' '}
              </ATypography>
            </ATypography>
          ))}
        </div>

        <MInputStyled //
          noLabel
          noPadding
          label=""
          name="confirmId"
          placeholder={t('enter_mechanic_id')}
          extra={<span style={{ fontSize: '11px' }}>{t('remove_mechanic_extra')}</span>}
        />

        {actionType === 'reject' && (
          <MTextAreaStyled //
            noLabel
            noPadding
            rows={5}
            require={false}
            label={t('reject_note_label')}
            name="rejectNotes"
            placeholder={t('reject_note_placeholder')}
          />
        )}

        <Divider />
        <Form.Item>
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <BasicBtn
              loading={loading}
              size="large"
              disabled={submitDisabled}
              htmlType="submit"
              type="primary"
              icon={renderSubmitIcon()}
              title={t(`confirm_${actionType}`)}
            />
            <BasicBtn size="large" type="ghost" onClick={handleCancel} icon={<CloseOutlined />} title={t('close')} />
          </div>
        </Form.Item>
      </Form>
    </AntModal>
  );
};

export default connect(null, {
  deleteMechanic: mechanicActions.deleteMechanic,
  approveMechanic: mechanicActions.approveMechanic,
  blockMechanic: mechanicActions.blockMechanic,
  rejectMechanic: mechanicActions.rejectMechanic
})(ConfirmModal);
