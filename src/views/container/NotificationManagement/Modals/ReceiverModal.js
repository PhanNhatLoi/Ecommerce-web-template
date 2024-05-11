import { EyeOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { notificationActions } from '~/state/ducks/notification';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import { AList, AListItem, AListItemMeta } from '~/views/presentation/ui/list/AList';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const ReceiverModal = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [receiverProfiles, setReceiverProfiles] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [userIds, setUserIds] = useState([]);

  const handleCancel = () => {
    form.resetFields();
    props.setModalShow(false);
  };

  useEffect(() => {
    if (Boolean(props.id)) {
      setPageLoading(true);
      props
        .getNotificationDetail(props.id)
        .then((res) => {
          setUserIds(JSON.parse(res?.content?.pushToUsers).map((id) => id?.toString()));
          setPageLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
          setPageLoading(false);
        });
    }
  }, [props.id]);

  useEffect(() => {
    if (userIds.length > 0) {
      setPageLoading(true);
      props
        .getReceiverProfiles({ userIds: userIds })
        .then((res) => {
          setReceiverProfiles(res?.content);
          setPageLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 79 ~ props.getReceiverProfiles ~ err', err);
          AMessage.error(t(err.message));
          setPageLoading(false);
        });
    }
  }, [userIds]);

  return (
    <AntModal
      title={t('receiver_list')}
      description={t('')}
      width={700}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      <div style={{ maxHeight: 500, overflowY: 'scroll' }}>
        <AList
          itemLayout="horizontal"
          dataSource={receiverProfiles}
          loading={pageLoading}
          renderItem={(item) => {
            return (
              <AListItem>
                <AListItemMeta
                  className="d-flex align-items-center"
                  avatar={
                    <AuthAvatar
                      preview={{
                        mask: <EyeOutlined />
                      }}
                      width={32}
                      isAuth
                      src={firstImage(item?.avatar)}
                    />
                  }
                  title={
                    <div className="d-flex justify-content-between">
                      <ATypography>{item.fullName}</ATypography>
                    </div>
                  }
                  description={formatPhoneWithCountryCode(item.phone)}
                />
              </AListItem>
            );
          }}
        />
      </div>
    </AntModal>
  );
};

export default connect(
  (state) => ({
    user: state['authUser'].user
  }),
  {
    getNotificationDetail: notificationActions.getNotificationDetail,
    getReceiverProfiles: notificationActions.getReceiverProfiles
  }
)(ReceiverModal);
