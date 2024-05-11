import { DollarOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CUSTOMER_BUSINESS_TYPE, TYPOGRAPHY_TYPE } from '~/configs';
import { carTradingActions } from '~/state/ducks/usedCarTrading/carTrading';
import { usedCarTradingCustomerActions } from '~/state/ducks/usedCarTrading/customer';
import Divider from '~/views/presentation/divider';
import MCheckbox from '~/views/presentation/fields/Checkbox';
import { MInput } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { BasicBtn, CancelBtn } from '~/views/presentation/ui/buttons';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';

type Props = {
  modalShow: boolean;
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  data: { type: string; id: number }[];
  setData: any;
  setNeedLoadNewData: React.Dispatch<React.SetStateAction<boolean>>;
  markedSoldTrading: any;
  getUsedCarTradingCustomer: any;
};

function SaleCar(props: Props) {
  const { t } = useTranslation(); // react-18next
  const { modalShow, setModalShow = () => {}, data, setData } = props; // props params
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [customerList, setCustomerList] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<any>([]);
  const [actionType, setActionType] = useState<any>('');

  useEffect(() => {
    //get list customer
    if (data?.length > 0) {
      setLoading(true);
      props
        .getUsedCarTradingCustomer({ businessType: CUSTOMER_BUSINESS_TYPE.USED_CAR_DEALERSHIP })
        .then((res) => {
          setCustomerList(res.content);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          data.map((d: any) => setSelectedIds((selectedIds: any) => [...selectedIds, d.id]));
          const newData: any = head(data);
          setActionType(newData?.type);
          setLoading(false);
        });
    }
  }, [data]);

  const handleCancel = () => {
    form.resetFields();
    setData([]);
    setSelectedIds([]);
    setModalShow(false);
    setSubmitDisabled(true);
  };

  const confirmAction = async (confirmId: string, body: any) => {
    setLoading(true);

    const confirmIds = confirmId.split(';').map((id: any) => id.trim());
    await Promise.all(
      confirmIds.map((id) => {
        return props.markedSoldTrading({ ...body, carTradingId: id });
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

  const onFinish = (values) => {
    const body = {
      customerId: values.profileId,
      transferred: (values.transferred?.length && values.transferred[0]) || false,
      profileInfoCache: {} // BE response 500 if missing this field
    };
    confirmAction(values.confirmId, body);
  };

  const onFormChange = (vales) => {
    let mechanicIds = form.getFieldValue('confirmId')?.split(';');
    if (mechanicIds?.length > 0) {
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
    }
  };

  return (
    <AntModal
      title={t('usedCarSold')}
      width={1000}
      destroyOnClose
      modalShow={modalShow}
      setModalShow={setModalShow}
      onCancel={handleCancel}>
      <Form {...ANT_FORM_SEP_LABEL_LAYOUT} form={form} name={'create'} onChange={onFormChange} onFinish={onFinish}>
        <div className="mb-3">
          <ATypography>{t('choose_old_customer')}</ATypography>
        </div>
        <MSelect
          name="profileId"
          noLabel
          noPadding
          allowClear
          label={t('')}
          placeholder={t('select_customer')}
          require={false}
          searchCorrectly={false}
          validateStatus={loading}
          options={customerList?.map((user: any) => {
            return {
              value: user?.profileId,
              search: user?.fullname + user?.phone,
              label: (
                <div className="d-flex align-items-center" style={{ lineHeight: 'initial' }}>
                  {/* <div>
                      <AuthAvatar isAuth size={24} src={user?.avatar || DEFAULT_AVATAR} className="mr-4" />
                    </div> */}
                  <div>
                    <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5} className="my-0">
                      {user?.fullname} - {formatPhoneWithCountryCode(user?.phone)}
                    </ATypography>
                  </div>
                </div>
              ),
              children: (
                <div className="d-flex align-items-center" style={{ lineHeight: 'initial' }}>
                  {/* <div>
                      <AuthAvatar isAuth size={24} src={user?.avatar || DEFAULT_AVATAR} className="mr-4" />
                    </div> */}
                  <div>
                    <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5} className="my-0">
                      {user?.fullname}
                    </ATypography>
                    <ATypography className="my-0">{formatPhoneWithCountryCode(user?.phone)}</ATypography>
                  </div>
                </div>
              )
            };
          })}
        />
        <MCheckbox name="transferred" noLabel noPadding options={[{ label: t('contract_procedures_change_ownership'), value: true }]} />

        <div className="mt-8">
          <ATypography>{t(`${actionType}_post_for_sale_helper`)}</ATypography>
        </div>
        <div className="my-3">
          {data?.map((item: any, i: any) => (
            <ATypography strong>
              {item.id} <ATypography className="text-muted">{`${i < data?.length - 1 ? ';' : ''}`} </ATypography>
            </ATypography>
          ))}
        </div>
        <MInput
          noLabel
          noPadding
          label=""
          name="confirmId"
          placeholder={t('enter_post_for_sale_id')}
          extra={<span style={{ fontSize: '11px' }}>{t(`${actionType}_post_for_sale_extra`)}</span>}
        />

        <Divider />

        <BasicBtn
          loading={loading}
          disabled={submitDisabled}
          icon={<DollarOutlined />}
          htmlType="submit"
          style={{ margin: '15px 0px 0px 0px' }}
          title="confirm"
          type="primary"
        />
        <CancelBtn htmlType="submit" style={{ margin: '15px 0px 0px 0px' }} title="confirm" type="primary" onClick={handleCancel} />
      </Form>
    </AntModal>
  );
}

export default connect(null, {
  markedSoldTrading: carTradingActions.markedSoldTrading,
  getUsedCarTradingCustomer: usedCarTradingCustomerActions.getUsedCarTradingCustomer
})(SaleCar);
