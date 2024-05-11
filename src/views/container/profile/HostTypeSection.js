import { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import MSelect from '~/views/presentation/fields/Select';
import { BUSINESS_TYPES, GENERAL_TYPE } from '~/configs/const';
import { appDataActions } from '~/state/ducks/appData';
import { BUSINESS_TYPE_INCLUDES } from '../commons/HostType';

const HostType = (props) => {
  const { t } = useTranslation();
  const [businessTypes, setBusinessTypes] = useState([]);

  useEffect(() => {
    props
      .getGeneralType({ type: GENERAL_TYPE.BUSINESS_TYPE })
      .then((businessType) =>
        setBusinessTypes(
          businessType.content
            .map((type) => {
              return {
                value: type.id,
                label: t(type.name)
              };
            })
            .filter((f) => BUSINESS_TYPE_INCLUDES.includes(f.value)) // in version 1.0.7 only use [Auto Repair Shop, Auto Club]
        )
      )
      .catch((err) => {
        console.error('trandev ~ file: HostTypeSection.js ~ line 16 ~ .then ~ err', err);
      });
  }, []);

  const handleSelected = (businessType) => {
    const finalChange = {};
    if (businessType.includes(BUSINESS_TYPES.AUTO_REPAIR_SHOP) && businessType.includes(BUSINESS_TYPES.AUTO_CLUB)) {
      return;
    } else if (businessType.includes(BUSINESS_TYPES.AUTO_REPAIR_SHOP)) {
      finalChange.memberSizeId = undefined;
    } else if (businessType.includes(BUSINESS_TYPES.AUTO_CLUB)) {
      finalChange.technicianSizeId = undefined;
    } else {
      finalChange = { memberSizeId: undefined, technicianSizeId: undefined };
    }
    props.form.setFieldsValue(finalChange);
  };

  const businessTypeIdParams = useMemo(() => ({ type: GENERAL_TYPE.BUSINESS_TYPE }), []);

  return (
    <>
      <div className="form-group row">
        <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('type')}</label>
        <div className="col-lg-9 col-xl-7 d-flex align-items-center">
          <MSelect
            name="businessTypeIds"
            noLabel
            noPadding
            mode="multiple"
            label={t('')}
            placeholder={t('type')}
            searchCorrectly={false}
            onChange={(businessType) => {
              props.form.setFieldValue('businessTypeIds', businessType);
              handleSelected(businessType);
            }}
            options={businessTypes}
            params={businessTypeIdParams}
            require
          />
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getGeneralType: appDataActions.getGeneralType
})(HostType);
