import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Col, Descriptions, Row, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { notificationActions } from '~/state/ducks/notification';
import Divider from '~/views/presentation/divider';
import { BasicBtn, CancelBtn } from '~/views/presentation/ui/buttons';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import { AList, AListItem, AListItemMeta } from '~/views/presentation/ui/list/AList';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const ViewForm = (props) => {
  const { t } = useTranslation();
  const [notificationDetail, setNotificationDetail] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [userIds, setUserIds] = useState([]);
  const [receiverLoading, setReceiverLoading] = useState(false);
  const [receiverProfiles, setReceiverProfiles] = useState([]);

  useEffect(() => {
    if (Boolean(props.id)) {
      setPageLoading(true);
      props
        .getNotificationDetail(props.id)
        .then((res) => {
          const response = res?.content;
          setNotificationDetail(response);
          setUserIds(JSON.parse(response?.pushToUsers).map((id) => id?.toString()));
          props.setNotificationStatus(response?.status);
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
      setReceiverLoading(true);
      props
        .getReceiverProfiles({ userIds: userIds })
        .then((res) => {
          setReceiverProfiles(res?.content);
          setReceiverLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 79 ~ props.getReceiverProfiles ~ err', err);
          AMessage.error(t(err.message));
        });
    }
  }, [userIds]);

  return (
    <>
      <Skeleton loading={pageLoading} active>
        <Row>
          <Col lg={15} md={24}>
            <AlignedDescription
              contentStyle={{ fontWeight: '500', paddingLeft: '0px', maxWidth: '300px' }}
              column={1}
              labelStyle={{ color: 'rgba(0,0,0,0.4)', width: '200px', verticalAlign: 'top' }}
              bordered>
              <Descriptions.Item className="pb-2" label={t('message')}>
                {notificationDetail?.message}
              </Descriptions.Item>
              <Descriptions.Item className="pb-2" label={t('sending_date')}>
                {UtilDate.toLocalDateTimeString(notificationDetail?.sendingDate)}
              </Descriptions.Item>
              <Descriptions.Item className="pb-2" label={t('message_type')}>
                <span className="py-2 px-5" style={{ backgroundColor: '#ebebeb', borderRadius: '5px' }}>
                  {notificationDetail?.messageType}
                </span>
              </Descriptions.Item>
              <Descriptions.Item style={{ paddingTop: '40px' }} label={t('content')} labelStyle={{ verticalAlign: 'top' }}>
                <div dangerouslySetInnerHTML={{ __html: notificationDetail?.content }}></div>
              </Descriptions.Item>
            </AlignedDescription>
          </Col>
          <Col lg={9} md={24}>
            <ATypography style={{ color: 'rgba(0,0,0,0.4)' }}>{t('sent_to_receivers')}</ATypography>
            <div style={{ maxHeight: 300, overflowY: 'scroll' }}>
              <AList
                itemLayout="horizontal"
                dataSource={receiverProfiles}
                loading={receiverLoading}
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
          </Col>
        </Row>
      </Skeleton>

      <Divider />
      <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
        <BasicBtn title={props.cancelText || t('close')} size="large" type="ghost" onClick={props.onCancel} icon={<CloseOutlined />} />
      </div>
    </>
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
)(ViewForm);
