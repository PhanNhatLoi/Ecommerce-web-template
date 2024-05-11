import { CheckOutlined, CloseOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { returnActions } from '~/state/ducks/return';
import Divider from '~/views/presentation/divider';
import { MInput } from '~/views/presentation/fields/input';
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

export const ACTION_TYPE = {
  BLOCK: 'block',
  UNBLOCK: 'unblock',
  DELETE: 'delete'
};

type ConfirmModalProps = {
  deleteReturn: any;
  data: any;
  setData: any;
  modalShow: boolean;
  setModalShow: (value: boolean) => void;
  setNeedLoadNewData: (value: boolean) => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const confirmAction = (values: { confirmId: string }, action: (id: string) => void) => {
    const confirmIds = values.confirmId.split(';').map((id) => id.trim());
    setLoading(true);
    Promise.all(
      confirmIds.map((id) => {
        return action(id);
      })
    )
      .then(() => {
        props.setNeedLoadNewData(true);
        AMessage.success(t(`${actionType}_return_success`));
        setLoading(false);
        handleCancel();
      })
      .catch((err) => {
        setLoading(false);
        console.error('chiendev ~ file: ConfirmModal.tsx: 57 ~ confirmAction ~ err', err);
        AMessage.error(t(err.message));
      });
  };

  const onFinish = (values: { confirmId: string }) => {
    switch (actionType) {
      case ACTION_TYPE.DELETE:
        confirmAction(values, props.deleteReturn);
        break;
      default:
        break;
    }
  };

  const renderActionIcon = () => {
    switch (actionType) {
      case ACTION_TYPE.BLOCK:
        return <StopOutlined />;
      case ACTION_TYPE.UNBLOCK:
        return <CheckOutlined />;
      case ACTION_TYPE.DELETE:
        return <DeleteOutlined />;
      default:
        break;
    }
  };

  const onFinishFailed = (err: any) => {
    console.error('chiendev ~ file: ConfirmModal.tsx: 92 ~ onFinishFailed ~ err', err);
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
    customerIds = customerIds.map((m: string) => Number.parseInt(m.trim()));
    let isSame = true;
    if (selectedIds === customerIds) isSame = true;
    else if (selectedIds === null || customerIds === null) isSame = false;
    else if (selectedIds.length !== customerIds.length) isSame = false;
    else
      for (var i = 0; i < selectedIds.length; ++i) {
        if (selectedIds[i] !== customerIds[i]) isSame = false;
      }
    setSubmitDisabled(!isSame);
  };
  // ----------------------------------------
  // FOR VALIDATE INPUT
  // ----------------------------------------

  return (
    <AntModal
      title={t(`${actionType}_return`)}
      description={t(`${actionType}_return_des`)}
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
        <ATypography className="mb-3">{t(`${actionType}_return_helper`)}</ATypography>
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
          placeholder={t('enter_return_id')}
          extra={<span style={{ fontSize: '11px' }}>{t('remove_return_extra')}</span>}
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
              icon={renderActionIcon()}>
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

export default connect(null, {
  deleteReturn: returnActions.deleteReturn
})(ConfirmModal);
