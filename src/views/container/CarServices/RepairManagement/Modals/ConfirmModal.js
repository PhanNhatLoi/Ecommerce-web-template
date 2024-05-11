/* eslint-disable eqeqeq */
import { CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { repairActions } from '~/state/ducks/carServices/repair';
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
          AMessage.success(t(`${actionType}_repair_success`));
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
      case 'cancel':
        confirmAction(values, props.cancelRepair);
        break;
      default:
        break;
    }
  };

  const renderActionIcon = () => {
    switch (actionType) {
      case 'cancel':
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
      title={t(`${actionType}_repair`)}
      description={t(`${actionType}_repair_des`)}
      width={1000}
      modalShow={props.modalShow}
      onOk={onFinish}
      onCancel={handleCancel}>
      <Form //
        {...ANT_FORM_SEP_LABEL_LAYOUT}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onChange={onFormChange}>
        <ATypography className="mb-3">{t(`${actionType}_repair_helper`)}</ATypography>
        <div className="mb-3">
          {props.data.map((item, i) => (
            <ATypography strong>
              {item.id}{' '}
              <ATypography className="text-muted">
                {item.fullName && `(${item.fullName})`}
                {`${i < props.data.length - 1 ? ';' : ''}`}{' '}
              </ATypography>
            </ATypography>
          ))}
        </div>

        <MInputStyled //
          noLabel
          noPadding
          label=""
          name="confirmId"
          placeholder={t('enter_repair_id')}
          extra={<span style={{ fontSize: '11px' }}>{t('remove_repair_extra')}</span>}
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
  cancelRepair: repairActions.cancelRepair
})(ConfirmModal);
