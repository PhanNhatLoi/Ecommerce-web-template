import { Rate } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { authSelectors } from '~/state/ducks/authUser';
import { ratingActions } from '~/state/ducks/ratings';
import Divider from '~/views/presentation/divider';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { firstImage } from '~/views/utilities/helpers/utilObject';

type VendorInfoProps = {
  getAuthUser: any;
  getVendorRatings: any;
};

const VendorInfo: React.FC<VendorInfoProps> = (props) => {
  const { t }: any = useTranslation();
  const [user, setUser] = useState<any>();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    props
      .getVendorRatings()
      .then((res) => {
        setRating(+res?.content?.rating);
      })
      .catch((err) => {
        AMessage.error(t(err.message));
        console.error('trandev ~ file: PersonaInformation.js ~ line 30 ~ useEffect ~ err', err);
      });
  }, []);

  useEffect(() => {
    if (props.getAuthUser) {
      const profiles = props.getAuthUser;

      setUser({
        avatar: firstImage(profiles?.avatar),
        fullName: profiles?.fullName
      });
    }
  }, [props.getAuthUser]);

  return (
    <div className="d-flex flex-column align-items-center pt-2 pb-8">
      <AuthAvatar className="mr-5" size={109} isAuth src={user?.avatar} />
      <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
        {user?.fullName}
      </ATypography>
      <Rate className="mb-5" disabled={true} value={rating || 0} />
      <div className="row text-center w-100">
        <div className="col-5">
          <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
            {0}
          </ATypography>
          <div>{t('employees')}</div>
        </div>
        <div className="col-2">
          <Divider type="vertical" style={{ height: '50%', margin: '15px 0', backgroundColor: 'rgba(0, 0, 0, 0.10)' }} />
        </div>
        <div className="col-5">
          <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
            {0}
          </ATypography>
          <div>{t('members')}</div>
        </div>
      </div>
    </div>
  );
};

export default connect(
  (state: any) => ({
    getAuthUser: authSelectors.getAuthUser(state)
  }),
  { getVendorRatings: ratingActions.getVendorRatings }
)(VendorInfo);
