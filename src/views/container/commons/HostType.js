import { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import MSelect from '~/views/presentation/fields/Select';
import { GENERAL_TYPE } from '~/configs/const';
import { appDataActions } from '~/state/ducks/appData';

export const BUSINESS_TYPE_INCLUDES = [3, 9, 24, 23, 123];

const HostType = (props) => {
  const { t, i18n } = useTranslation();
  const [businessTypes, setBusinessTypes] = useState([]);

  useEffect(() => {
    props
      .getGeneralType({ type: GENERAL_TYPE.BUSINESS_TYPE })
      .then((businessType) => {
        setBusinessTypes(
          businessType.content
            .map((type) => {
              return {
                value: type.id,
                label: t(type.name)
              };
            })
            .filter((f) => BUSINESS_TYPE_INCLUDES.includes(f.value)) // in version 1.0.7 only use [Auto Repair Shop, Auto Club]
        );
      })
      .catch((err) => {
        console.error('trandev ~ file: HostType.js ~ line 16 ~ .then ~ err', err);
      });
  }, [i18n?.language]);

  const businessTypeIdParams = useMemo(() => ({ type: GENERAL_TYPE.BUSINESS_TYPE }), []);

  return (
    <>
      <MSelect
        name="businessTypeIds"
        noLabel
        noPadding
        label={t('')}
        placeholder={t('type')}
        mode="multiple"
        searchCorrectly={false}
        options={businessTypes}
        onChange={(businessType) => {
          props.form.setFieldValue('businessTypeIds', businessType);
        }}
        params={businessTypeIdParams}
        require
      />
    </>
  );
};

export default connect(null, {
  getGeneralType: appDataActions.getGeneralType
})(HostType);
