import { CloseOutlined, DeleteOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { carTradingActions } from '~/state/ducks/usedCarTrading/carTrading';
import Divider from '~/views/presentation/divider';
import { MInput } from '~/views/presentation/fields/input';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ATypography from '~/views/presentation/ui/text/ATypography';

const MInputStyled = styled(MInput)`
  .ant-input-affix-wrapper {
    border: 1px solid #000 !important;
  }
`;

type ConfirmModalProps = {
  data: any;
  setData: any;
  setNeedLoadNewData: any;
  modalShow: boolean;
  setModalShow: any;
  updateStatusTrading: any;
};

const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [selectedIds, setSelectedIds] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<any>('');

  const confirmAction = async (values: any, action: any) => {
    const confirmIds = values.confirmId.split(';').map((id: any) => id.trim());
    setLoading(true);
    await Promise.all(
      confirmIds.map((id: any) => {
        return action(id, actionType.toUpperCase());
      })
    )
      .then((res) => {
        props.setNeedLoadNewData(true);
        AMessage.success(t(`${actionType}_post_for_sale_success`));
        setLoading(false);
        handleCancel();
      })
      .catch((err) => {
        setLoading(false);
        console.error('trandev ~ file: RemoveModal.js ~ line 41 ~ onFinish ~ err', err);
        AMessage.error(t(err.message));
      });
  };

  const onFinish = (values: any) => {
    confirmAction(values, props.updateStatusTrading);
  };

  const onFinishFailed = (err: any) => {
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
      props.data.map((d: any) => setSelectedIds((selectedIds: any) => [...selectedIds, d.id]));
      const newData: any = head(props.data);
      setActionType(newData?.type);
    }
  }, [props.data]);

  const onFormChange = () => {
    let mechanicIds = form.getFieldValue('confirmId').split(';');
    mechanicIds = mechanicIds.map((m: any) => m.trim());
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
      title={t(`${actionType}_post_for_sale`)}
      description={t(`${actionType}_post_for_sale_des`)}
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
        <ATypography className="mb-3">{t(`${actionType}_post_for_sale_helper`)}</ATypography>
        <div className="mb-3">
          {props.data.map((item: any, i: any) => (
            <ATypography strong>
              {item.id}{' '}
              <ATypography className="text-muted">
                {/* ({item.fullName}){`${i < props.data.length - 1 ? ';' : ''}`}{' '} */}
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
          placeholder={t('enter_post_for_sale_id')}
          extra={<span style={{ fontSize: '11px' }}>{t(`${actionType}_post_for_sale_extra`)}</span>}
        />

        <Divider />
        <Form.Item>
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <BasicBtn
              size="large"
              loading={loading}
              disabled={submitDisabled}
              htmlType="submit"
              type="primary"
              icon={actionType === 'delete' ? <DeleteOutlined /> : <EyeInvisibleOutlined />}
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
  updateStatusTrading: carTradingActions.updateStatusTrading
})(ConfirmModal);
