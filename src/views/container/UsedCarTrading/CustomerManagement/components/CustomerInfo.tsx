import React from 'react';
import { useTranslation } from 'react-i18next';
import MCheckbox from '~/views/presentation/fields/Checkbox';
import { MInput, MInputPhone } from '~/views/presentation/fields/input';
import LayoutForm from '~/views/presentation/layout/forForm';

type CustomerInfoProps = {
  form: any;
  allowEdit: boolean;
  loading: boolean;
  content: string;
};

const CustomerInfo: React.FC<CustomerInfoProps> = (props) => {
  const { t }: any = useTranslation();

  return (
    <LayoutForm data-aos="fade-left" data-aos-delay="300" title={t('postInformation')} description={t('')}>
      <div className="row">
        {/* <div className="col-12 mb-4">
          <MCheckbox name="isGenuine" noLabel noPadding options={[{ label: t('isECaUser'), value: true }]} />
        </div> */}

        <div className="col-12 col-md-6">
          <MInput
            name="fullname"
            noLabel
            noPadding
            validateStatus={props.loading ? 'validating' : undefined}
            readOnly={!props.allowEdit}
            label={t('fullName')}
            placeholder={t('fullName')}
          />
        </div>

        <div className="col-12 col-md-6">
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
      </div>
    </LayoutForm>
  );
};

export default CustomerInfo;
