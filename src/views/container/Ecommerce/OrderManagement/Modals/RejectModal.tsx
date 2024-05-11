import { CloseOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { orderActions } from '~/state/ducks/carAccessories/order';
import Divider from '~/views/presentation/divider';
import { MTextArea } from '~/views/presentation/fields/input';
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

interface ConfirmModalProps {
  updateStatusSaleOrder: any;
  data: any;
  modalShow: Boolean;
  setData: React.Dispatch<React.SetStateAction<Array<any>>>;
  setModalShow: React.Dispatch<React.SetStateAction<Boolean>>;
  setNeedLoadNewData: React.Dispatch<React.SetStateAction<Boolean>>;
}
const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const onFinish = (values) => {
    setLoading(true);

    props
      .updateStatusSaleOrder({ id: props.data.id, status: props.data.status, rejectNote: values.rejectNote })
      .then((res) => {
        props.setNeedLoadNewData(true);
        AMessage.success(t('rejected_order'));
        setLoading(false);
        handleCancel();
      })
      .catch((err) => {
        console.error('🚀 ~ file: RejectModal.tsx ~ line 53 ~ onFinish ~ err', err);
        setLoading(false);
        AMessage.error(t(err.message));
      });
  };

  const onFinishFailed = (err) => {
    console.error('🚀 ~ file: ConfirmModal.tsx ~ line 74 ~ onFinishFailed ~ err', err);
  };

  const handleCancel = () => {
    form.resetFields();
    setSubmitDisabled(true);
    props.setModalShow(false);
    props.setData([]);
  };

  const checkCondition = (): boolean => {
    const values = form.getFieldsValue();
    if (!values.rejectNote) return true;
    if (!values.confirmId || values.confirmId.toString() !== props.data.id.toString()) return true;
    return false;
  };

  const onFormChange = () => {
    setSubmitDisabled(checkCondition);
  };

  // ----------------------------------------
  // FOR VALIDATE INPUT
  // ----------------------------------------

  return (
    <AntModal
      title={t('rejected_title')}
      description={t('')}
      width={1000}
      modalShow={props.modalShow}
      destroyOnClose
      onOk={onFinish}
      onCancel={handleCancel}>
      <Form //
        {...ANT_FORM_SEP_LABEL_LAYOUT}
        form={form}
        onFinish={onFinish}
        onChange={onFormChange}
        onFinishFailed={onFinishFailed}>
        <ATypography>{t('rejected_confirm_id')}</ATypography>
        <div>
          <ATypography strong>{props?.data?.id}</ATypography>
        </div>
        <MInputStyled //
          noLabel
          noPadding
          name="confirmId"
          placeholder={t('enter_goods_id')}
        />
        <ATypography className="mb-3">{t('rejected_confirm')}</ATypography>
        <MTextArea //
          noLabel
          className="mt-5"
          row={5}
          noPadding
          name="rejectNote"
          placeholder={t('enter_reason')}
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
              type="primary">
              {t('reject')}
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
  updateStatusSaleOrder: orderActions.updateStatusSaleOrder
})(ConfirmModal);
