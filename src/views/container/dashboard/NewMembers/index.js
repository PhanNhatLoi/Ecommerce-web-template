import { CalendarFilled, EyeOutlined, PhoneOutlined, SettingOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { memberActions } from '~/state/ducks/member';
import ConfirmModal from '~/views/container/AutoClubs/MemberManagement/Modals/ConfirmModal';
import ViewModal from '~/views/container/AutoClubs/MemberManagement/Modals/ViewModal';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import { AList, AListItem, AListItemMeta } from '~/views/presentation/ui/list/AList';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';

function NewMembers(props) {
  const { t } = useTranslation();
  const [memberList, setMemberList] = useState([]);
  const [viewMemberShow, setViewMemberShow] = useState(false);
  const [confirmData, setConfirmData] = useState([]);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [viewUserObject, setViewUserObject] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    props
      .getMembers({
        status: 'WAITING_FOR_APPROVAL',
        memberRole: 'ROLE_CONSUMER'
      })
      .then((res) => {
        setMemberList(res?.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: index.js ~ line 25 ~ useEffect ~ err', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (needLoadNewData) {
      fetchData();
      setNeedLoadNewData(false);
    }
  }, [needLoadNewData]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <AList
        itemLayout="horizontal"
        dataSource={memberList}
        loading={loading}
        renderItem={(item) => (
          <AListItem>
            <AListItemMeta
              avatar={
                <AuthAvatar
                  size={40}
                  className="mr-5 mb-3 mb-lg-0"
                  preview={{
                    mask: <EyeOutlined />
                  }}
                  width={32}
                  isAuth={true}
                  src={(item?.avatar || '').includes('http') ? item?.avatar : firstImage(item?.avatar)}
                  // onClick={(e) => e.stopPropagation()}
                />
              }
              title={
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <p
                    className="mb-0"
                    style={{ color: '#000', cursor: 'pointer' }}
                    onClick={() => {
                      setViewMemberShow(true);
                      setViewUserObject(item);
                    }}>
                    {item.fullname}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center mr-5">
                      <SettingOutlined className="mr-2 text-muted" />
                      <ATypography className="text-muted">{numberFormatDecimal(+item.totalXims)}</ATypography>
                    </div>
                    <div className="d-flex align-items-center mr-5">
                      <CalendarFilled className="mr-2 text-muted" />
                      <ATypography className="text-muted">{UtilDate.toDateTimeLocal(item.joinedDate)}</ATypography>
                    </div>
                  </div>
                </div>
              }
              description={
                <div>
                  <div className="d-flex align-items-center">
                    <PhoneOutlined className="mr-2 text-muted" />
                    <ATypography className="text-muted">{formatPhoneWithCountryCode(item.phoneNumber)}</ATypography>
                  </div>
                  <div className="d-flex align-items-center">
                    <AButton
                      className="pl-0 py-0"
                      onClick={() => {
                        setViewMemberShow(true);
                        setViewUserObject(item);
                      }}
                      type="link"
                      style={{ borderRight: '1px solid #000', height: 'fit-content' }}>
                      {t('view_details')}
                    </AButton>
                    <AButton
                      className="py-0"
                      type="link"
                      onClick={() => {
                        setConfirmModalShow(true);
                        setConfirmData([{ type: 'approve', id: item.profileId, fullName: item.fullname }]);
                      }}
                      style={{ borderRight: '1px solid #000', height: 'fit-content' }}>
                      {t('approve')}
                    </AButton>
                    <AButton
                      className="py-0"
                      onClick={() => {
                        setConfirmModalShow(true);
                        setConfirmData([{ type: 'reject', id: item.profileId, fullName: item.fullname }]);
                      }}
                      type="link"
                      style={{ height: 'fit-content' }}>
                      {t('reject')}
                    </AButton>
                  </div>
                </div>
              }
            />
          </AListItem>
        )}
      />

      <ViewModal //
        id={viewUserObject?.profileId}
        memberUserId={viewUserObject?.memberUserId}
        modalShow={viewMemberShow}
        setModalShow={setViewMemberShow}
        setNeedLoadNewData={() => {}}
      />

      <ConfirmModal
        data={confirmData}
        modalShow={confirmModalShow}
        setData={setConfirmData}
        setModalShow={setConfirmModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
    </>
  );
}

export default connect(null, {
  getMembers: memberActions.getMembers
})(NewMembers);
