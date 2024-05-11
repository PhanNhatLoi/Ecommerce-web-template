import React from 'react';
import { useTranslation } from 'react-i18next';
import { MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import LayoutForm from '~/views/presentation/layout/forForm';

type SellerInfoProps = {
  form: any;
  allowEdit: boolean;
  loading: boolean;
  needLoadData: boolean;
  setNeedLoadData: any;
};

const SellerInfo: React.FC<SellerInfoProps> = (props) => {
  const { t }: any = useTranslation();

  return (
    <LayoutForm data-aos="fade-right" data-aos-delay="300" title={t('sellerInformation')} description={t('')}>
      <div className="row">
        <div className="col-12">
          <MInputPhone
            name="phone"
            countryPhone
            customLayout="w-100"
            noLabel
            noPadding
            label={t('phone')}
            placeholder={t('')}
            require={false}
            phoneTextTranslate="1px"
            disabled={!props.allowEdit}
          />
        </div>
        <div className="col-12">
          <MInputAddress //
            name="addressInfo"
            form={props.form}
            notRequireZipCode
            label={t('address')}
            customLayout="w-100"
            noLabel
            noPadding
            require={false}
            disabled={!props.allowEdit}
            needLoadData={props.needLoadData}
            setNeedLoadData={props.setNeedLoadData}
          />
        </div>
      </div>
    </LayoutForm>
  );
};

export default SellerInfo;
