import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { usedCarTradingAppointment } from '~/state/ducks/usedCarTrading/carAppointment';
import { carTradingAppointmentListResponseType } from '~/state/ducks/usedCarTrading/carAppointment/types';
import Divider from '~/views/presentation/divider';
import MDatePicker from '~/views/presentation/fields/DatePicker';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AntModal from '~/views/presentation/ui/modal/AntModal';

type ConfirmModalProps = {
  data?: carTradingAppointmentListResponseType;
  setData: any;
  setNeedLoadNewData: any;
  modalShow: boolean;
  setModalShow: any;
  UpdateAppointmentDate: any;
};

const UpdateAppointmentDate: React.FC<ConfirmModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { data, setData, setNeedLoadNewData, modalShow, setModalShow } = props;

  useEffect(() => {
    if (data && modalShow) {
      form.setFieldsValue({
        appointmentDate: moment(data.appointmentDate)
      });
    }
  }, [modalShow]);

  const onFinish = (values: any) => {
    setLoading(true);
    props
      .UpdateAppointmentDate({ id: data?.id, appointmentDate: values.appointmentDate })
      .then(() => {
        setLoading(false);
        AMessage.success(t(`update_date_cartrading_appointment_success`));
        setNeedLoadNewData(true);
        setModalShow(false);
        setData([]);
      })
      .catch((err) => {
        setLoading(false);
        setData([]);
        AMessage.error(t(err.message));
      });
  };

  const onFinishFailed = (err: any) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
  };

  const handleCancel = () => {
    form.resetFields();
    setSubmitDisabled(true);
    props.setModalShow(false);
    props.setData([]);
  };

  // ----------------------------------------
  // FOR VALIDATE INPUT
  // ----------------------------------------

  const onFormChange = () => {};
  // ----------------------------------------
  // FOR VALIDATE INPUT
  // ----------------------------------------

  return (
    <AntModal
      title={t(`update_date_cartrading_appointment`)}
      description={t(`update_date_cartrading_appointment_des`)}
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
        <MDatePicker noPadding hasLayoutForm label={t('appointment_date')} name="appointmentDate" placeholder={t('appointment_date')} />

        <Divider />
        <Form.Item>
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <BasicBtn
              loading={loading}
              size="large"
              htmlType="submit"
              type="primary"
              icon={<DeleteOutlined />}
              title={t(`confirm_update_date`)}
            />
            <BasicBtn size="large" type="ghost" onClick={handleCancel} icon={<CloseOutlined />} title={t('close')} />
          </div>
        </Form.Item>
      </Form>
    </AntModal>
  );
};

export default connect(null, {
  UpdateAppointmentDate: usedCarTradingAppointment.UpdateAppointmentDate
})(UpdateAppointmentDate);
