import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { userSettingActions } from '~/state/ducks/settings/userSetting';
import Divider from '~/views/presentation/divider';
import MInput from '~/views/presentation/fields/input/Input';
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

interface ConfirmModalProps {
  deleteUserManagerment: any;
  data: Array<any>;
  modalShow: Boolean;
  setData: React.Dispatch<React.SetStateAction<Array<any>>>;
  setModalShow: React.Dispatch<React.SetStateAction<Boolean>>;
  setNeedLoadNewData: React.Dispatch<React.SetStateAction<Boolean>>;
}
const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
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
        AMessage.success(t(`${actionType}_user_success`));
        setLoading(false);
        handleCancel();
      })
      .catch((err) => {
        setLoading(false);
        console.error('🚀 ~ file: ConfirmModal.tsx ~ line 48 ~ confirmAction ~ err', err);
        AMessage.error(t(err.message));
      });
  };

  const onFinish = (values) => {
    switch (actionType) {
      case 'delete':
        confirmAction(values, props.deleteUserManagerment);
        break;
      default:
        break;
    }
  };

  const renderActionIcon = () => {
    switch (actionType) {
      case 'delete':
        return <DeleteOutlined />;
      default:
        break;
    }
  };

  const onFinishFailed = (err) => {
    console.error('🚀 ~ file: ConfirmModal.tsx ~ line 74 ~ onFinishFailed ~ err', err);
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
    let customerIds = form.getFieldValue('confirmId').split(';');
    customerIds = customerIds.map((m) => m.trim());
    let isSame = true;
    if (selectedIds == customerIds) isSame = true;
    else if (selectedIds == null || customerIds == null) isSame = false;
    else if (selectedIds.length !== customerIds.length) isSame = false;
    else
      for (var i = 0; i < selectedIds.length; ++i) {
        if (selectedIds[i] != customerIds[i]) isSame = false;
      }
    setSubmitDisabled(!isSame);
  };
  // ----------------------------------------
  // FOR VALIDATE INPUT
  // ----------------------------------------

  return (
    <AntModal
      title={t(`${actionType}_user`)}
      description={t(`${actionType}_user`)}
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
        <ATypography className="mb-3">{t(`${actionType}_user_helper`)}</ATypography>
        <div className="mb-3">
          {props.data.map((item, i) => (
            <ATypography strong>
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
          placeholder={t('enter_user(s)_id')}
          extra={<span style={{ fontSize: '11px' }}>{t('remove_user(s)_extra')}</span>}
        />

        <Divider />
        <Form.Item>
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <BasicBtn
              loading={loading}
              size="large"
              disabled={submitDisabled}
              htmlType="submit"
              type="primary"
              icon={renderActionIcon()}
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
  deleteUserManagerment: userSettingActions.deleteUserManagerment
})(ConfirmModal);
