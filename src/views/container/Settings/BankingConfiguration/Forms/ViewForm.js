import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Descriptions, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { renderBankAccountStatus } from '~/configs/status/settings/bankingStatus';
import { bankingActions } from '~/state/ducks/settings/banking';
import Divider from '~/views/presentation/divider';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const desStyle = { color: 'rgba(0,0,0,0.8)', fontSize: '12px', textAlign: 'right' };

const ViewForm = (props) => {
  const { t } = useTranslation();
  const [accountDetail, setAccountDetail] = useState({});
  const [pageLoading, setPageLoading] = useState(false);

  //-----------------------------------------
  // FETCH DATA
  //-----------------------------------------
  useEffect(() => {
    setPageLoading(true);
    props
      .getBankAccountDetail(props.id)
      .then((res) => {
        setAccountDetail(res?.content);
        setPageLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
        AMessage.error(t(err.message));
        setPageLoading(false);
      });
  }, [props.id]);
  //-----------------------------------------
  // FETCH DATA
  //-----------------------------------------

  return (
    <>
      <Skeleton loading={pageLoading} active>
        <div className="d-flex align-items-center justify-content-center">
          <AuthAvatar
            size={124}
            className="mb-3 mb-lg-0"
            preview={{
              mask: <EyeOutlined />
            }}
            width={32}
            isAuth={true}
            src={(accountDetail?.logo || '').includes('http') ? accountDetail?.logo : firstImage(accountDetail?.logo)}
            // onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="my-5 d-flex align-items-center justify-content-center">
          {accountDetail?.status && renderBankAccountStatus(accountDetail?.status, t(accountDetail?.status), 'tag')}
          {/* <span
            className={`label label-lg label-light-${
              accountDetail?.status === 'ACTIVATED' ? StatusCssClasses.success : StatusCssClasses.danger
            } label-inline text-nowrap`}>
            {accountDetail?.status}
          </span> */}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <AlignedDescription labelStyle={{ padding: '0px' }} contentStyle={{ paddingTop: '0px', paddingBottom: '16px' }}>
            <Descriptions.Item contentStyle={desStyle} className="pt-1" label={t('bank_name')}>
              {accountDetail?.bankName || '-'}
            </Descriptions.Item>
            <Descriptions.Item contentStyle={desStyle} className="pt-1" label={t('account_name')}>
              {accountDetail?.accountName || '-'}
            </Descriptions.Item>
            <Descriptions.Item contentStyle={desStyle} className="pt-1" label={t('account_number')}>
              {accountDetail?.accountNumber || '-'}
            </Descriptions.Item>
          </AlignedDescription>
        </div>
      </Skeleton>

      <Divider />
      <div className="d-flex align-items-center justify-content-center">
        <BasicBtn size="large" type="ghost" onClick={props.onCancel} icon={<CloseOutlined />} title={props.cancelText || t('close')} />
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    user: state['authUser'].user
  }),
  {
    getBankAccountDetail: bankingActions.getBankAccountDetail
  }
)(ViewForm);
