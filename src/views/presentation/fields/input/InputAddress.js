import { Form } from 'antd/es';
import { head } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { appDataActions } from '~/state/ducks/appData';
import ATypography from '~/views/presentation/ui/text/ATypography';

import MSelect from '../Select';
import MInput from './Input';

function MInputAddress(props) {
  const { t } = useTranslation();

  const [address1State, setAddress1State] = useState('');
  const [zipCodeState, setZipCodeState] = useState('');

  const [countryList, setCountryList] = useState([]);
  const [countryId, setCountryId] = useState(null);
  const [countryLoading, setCountryLoading] = useState(false);

  const [stateList, setStateList] = useState([]);
  const [stateId, setStateId] = useState(null);
  const [stateLoading, setStateLoading] = useState(false);

  const [provinceList, setProvinceList] = useState([]);
  const [provinceId, setProvinceId] = useState(null);
  const [provinceLoading, setProvinceLoading] = useState(false);

  const [districtList, setDistrictList] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [districtLoading, setDistrictLoading] = useState(false);

  const [wardList, setWardList] = useState([]);
  const [wardId, setWardId] = useState('');
  const [wardLoading, setWardLoading] = useState(false);

  const getData = (fetchData, setList, params, setLoading) => {
    setLoading(true);
    fetchData({ ...params, size: 999999999, page: 0 })
      .then((res) => {
        setList(
          res?.content.map((c) => {
            // "QUẬN TẦN BÌNH" => "Quận Tân Bình"

            const words = (c?.nativeName || c?.name).toLowerCase().trim().split(' ');
            const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));

            return { label: capitalizedWords.join(' '), value: c.id, search: capitalizedWords.join(' ') };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: InputPhone.js ~ line 25 ~ useEffect ~ err', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData(
      //
      props.getListCountry,
      setCountryList,
      {},
      setCountryLoading
    );
  }, []);

  useEffect(() => {
    if (countryId) {
      getData(
        //
        props.getListState,
        setStateList,
        { countryId },
        setStateLoading
      );
      if (countryId === 241) {
        getData(
          //
          props.getProvincesWithoutState,
          setProvinceList,
          { countryId: countryId },
          setProvinceLoading
        );
      } else {
        getData(
          //
          props.getProvinces,
          setProvinceList,
          { stateId: stateId, countryId: countryId },
          setProvinceLoading
        );
      }
    }
    if (provinceId) getData(props.getDistricts, setDistrictList, { provinceId }, setDistrictLoading);
    if (districtId) getData(props.getWards, setWardList, { districtId }, setWardLoading);
  }, [countryId, stateId, provinceId, districtId]);

  //------------------------------------------
  // LOAD INITIAL DATA
  //------------------------------------------
  useEffect(() => {
    if (Boolean(props.needLoadData)) {
      if (props.listName) {
        props.needLoadData?.map((needLoadData) => {
          getData(props.getListState, setStateList, { countryId: needLoadData.country }, setStateLoading);
          getData(props.getDistricts, setDistrictList, { provinceId: needLoadData.province }, setDistrictLoading);
          getData(props.getWards, setWardList, { districtId: needLoadData.district }, setWardLoading);

          setCountryId(needLoadData.country);
          setStateId(needLoadData.state);
          setProvinceId(needLoadData.province);
          setDistrictId(needLoadData.district);
          setWardId(needLoadData.ward);
          props.setNeedLoadData(null);
        });
      } else {
        getData(props.getListState, setStateList, { countryId: props.needLoadData.country }, setStateLoading);
        getData(props.getDistricts, setDistrictList, { provinceId: props.needLoadData.province }, setDistrictLoading);
        getData(props.getWards, setWardList, { districtId: props.needLoadData.district }, setWardLoading);

        setCountryId(props.needLoadData.country);
        setStateId(props.needLoadData.state);
        setProvinceId(props.needLoadData.province);
        setDistrictId(props.needLoadData.district);
        setWardId(props.needLoadData.ward);
        props.setNeedLoadData(null);
      }
    }
  }, [props.needLoadData]);
  //------------------------------------------
  // LOAD INITIAL DATA
  //------------------------------------------

  //------------------------------------------
  // HANDLE FULL ADDRESS
  //------------------------------------------
  const getLabel = (list, id) => {
    return head(list.filter((e) => e?.value === id))?.label;
  };

  useEffect(() => {
    const address1 = props.form.getFieldValue(props.listName ? [props.listName, props.itemIndex, 'address1'] : 'address1');
    const zipCode = props.form.getFieldValue(props.listName ? [props.listName, props.itemIndex, 'zipCode'] : 'zipCode');

    const fullInfo = {
      country: getLabel(countryList, countryId),
      state: getLabel(stateList, stateId),
      province: getLabel(provinceList, provinceId),
      district: getLabel(districtList, districtId),
      ward: getLabel(wardList, wardId)
    };

    props.form.setFieldValue(
      props.listName ? [props.listName, props.itemIndex, 'addressInfo'] : 'addressInfo',
      fullInfo.state
        ? [address1, fullInfo.province, fullInfo.state + (zipCode ? ` ${zipCode}` : ''), fullInfo.country]
        : [address1, fullInfo.ward, fullInfo.district, fullInfo.province + (zipCode ? ` ${zipCode}` : ''), fullInfo.state, fullInfo.country]
    );
  }, [
    address1State,
    countryList,
    countryId,
    stateList,
    stateId,
    provinceList,
    provinceId,
    wardList,
    wardId,
    districtList,
    districtId,
    zipCodeState
  ]);
  //------------------------------------------
  // HANDLE FULL ADDRESS
  //------------------------------------------

  return (
    <div
      style={props.style}
      className={
        props.className +
        ' ' +
        (props.noPadding ? 'px-0  ' : '') +
        (props.noLabel
          ? props.hasLayoutForm
            ? 'col-12 col-sm-12 col-md-12 col-lg-12 col-xl-10'
            : 'col-12'
          : props.oneLine
          ? 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'
          : props.customLayout
          ? props.customLayout
          : props.hasLayoutForm
          ? 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-5'
          : 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6')
      }>
      {props.copyBtn || <></>}
      <Form.Item
        label={props?.label || ''}
        validateFirst
        name={props.listName ? [props.itemIndex, props.name] : props?.name || ''}
        hasFeedback={props?.hasFeedback}
        tooltip={
          props.require && {
            title: t('required_field'),
            icon: (
              <span>
                (<ATypography type="danger">*</ATypography>)
              </span>
            )
          }
        }
        {...props}>
        <MInput //
          autoComplete="do-not-autofill"
          noLabel
          disabled={props.disabled}
          readOnly={props.readOnly}
          noPadding
          require={props.require || false}
          loading={false}
          className="w-100"
          placeholder={t('address')}
          name={props.listName ? [props.itemIndex, 'address1'] : 'address1'}
          label=""
          hasFeedback
          onChange={(value) => setAddress1State(value)}
        />

        <div className="w-100 mx-0 mt-3 row">
          <MSelect
            autoComplete="do-not-autofill"
            name={props.listName ? [props.itemIndex, 'country1'] : 'country1'}
            placeholder={t('country')}
            require={props.require || false}
            disabled={props.disabled}
            noPadding
            validateStatus={countryLoading ? 'loading' : undefined}
            onChange={(value) => {
              if (Number(value)) {
                setCountryId(value);
                props.form.setFieldsValue({
                  state: undefined,
                  province: undefined,
                  district: undefined,
                  ward: undefined
                });
              }
            }}
            options={countryList}
            customLayout={`col-12 ${props.hasRegisterLayout ? 'col-lg-6' : 'col-lg-4'} w-100`}
            label=""
          />
          {/* IF COUNTRY IS VIETNAM -> HIDE STATE FIELD */}
          {countryId !== 241 && (
            <MSelect
              autoComplete="do-not-autofill"
              name={props.listName ? [props.itemIndex, 'state'] : 'state'}
              placeholder={t('state')}
              noPadding
              require={props.require || false}
              disabled={props.disabled}
              validateStatus={stateLoading ? 'loading' : undefined}
              onChange={(value) => {
                if (Number(value)) {
                  setStateId(value);
                  props.form.setFieldsValue({
                    zipCode: undefined,
                    province: undefined,
                    district: undefined,
                    ward: undefined
                  });
                }
              }}
              options={stateList}
              customLayout={`col-12 ${props.hasRegisterLayout ? 'col-lg-6' : 'col-lg-4'} w-100 ${
                props.hasRegisterLayout ? 'pl-1 pr-0' : 'px-0'
              }`}
              label=""
            />
          )}
          {!props.hasRegisterLayout && (
            <MInput //
              autoComplete="do-not-autofill"
              customLayout="col-12 col-lg-4 w-100 px-0 pl-lg-1 pl-md-0"
              noPadding
              disabled={props.disabled}
              readOnly={props.readOnly}
              require={props.requireZipCode || false}
              loading={false}
              placeholder={t('code')}
              name={props.listName ? [props.itemIndex, 'zipCode'] : 'zipCode'}
              label=""
              hasFeedback
              style={props.codeInputStyle}
              onChange={(value) => setZipCodeState(value)}
            />
          )}
        </div>

        <div className="w-100 mx-0 row">
          <MSelect
            autoComplete="do-not-autofill"
            name={props.listName ? [props.itemIndex, 'province'] : 'province'}
            placeholder={t('city')}
            disabled={props.disabled}
            noPadding
            validateStatus={provinceLoading ? 'loading' : undefined}
            require={props.require || false}
            onChange={(value) => {
              if (Number(value)) {
                setProvinceId(value);
                props.form.setFieldsValue({ district: undefined, ward: undefined });
              }
            }}
            options={provinceList}
            customLayout={`col-12 ${props.hasRegisterLayout ? 'col-lg-6' : 'col-lg-4'} w-100 ${props.hasRegisterLayout ? 'pr-0' : 'px-0'}`}
            label=""
          />
          {props.hasRegisterLayout && (
            <MInput //
              autoComplete="do-not-autofill"
              customLayout={`col-12 ${props.hasRegisterLayout ? 'col-lg-6' : 'col-lg-4'} w-100 ${
                props.hasRegisterLayout ? 'pl-lg-1 pl-md-0 pr-0' : 'px-0'
              }`}
              noPadding
              disabled={props.disabled}
              readOnly={props.readOnly}
              loading={false}
              require={props.requireZipCode || false}
              placeholder={t('code')}
              name={props.listName ? [props.itemIndex, 'zipCode'] : 'zipCode'}
              label=""
              hasFeedback
              style={props.codeInputStyle}
              onChange={(value) => setZipCodeState(value)}
            />
          )}
          {countryId === 241 && (
            <>
              <MSelect
                autoComplete="do-not-autofill"
                name={props.listName ? [props.itemIndex, 'district'] : 'district'}
                placeholder={t('district')}
                require={props.require || false}
                noPadding
                disabled={props.disabled || countryId !== 241}
                validateStatus={districtLoading ? 'loading' : undefined}
                onChange={(value) => {
                  if (Number(value)) {
                    setDistrictId(value);
                    props.form.setFieldsValue({ ward: undefined });
                  }
                }}
                options={districtList}
                customLayout={`col-12 ${props.hasRegisterLayout ? 'col-lg-6' : 'col-lg-4'} w-100 px-0 ${
                  props.hasRegisterLayout ? 'pl-lg-0' : 'pl-lg-1'
                }`}
                label=""
              />
              <MSelect
                autoComplete="do-not-autofill"
                name={props.listName ? [props.itemIndex, 'ward'] : 'ward'}
                placeholder={t('ward')}
                disabled={props.disabled}
                require={props.require || false}
                noPadding
                validateStatus={wardLoading ? 'loading' : undefined}
                onChange={(value) => {
                  if (Number(value)) setWardId(value);
                }}
                options={wardList}
                customLayout={`col-12 ${props.hasRegisterLayout ? 'col-lg-6' : 'col-lg-4'} w-100 px-0 pl-lg-1`}
                label=""
              />
            </>
          )}
        </div>
      </Form.Item>
    </div>
  );
}

export default connect(null, {
  getListCountry: appDataActions.getListCountry,
  getProvincesWithoutState: appDataActions.getProvincesWithoutState,
  getListState: appDataActions.getListState,
  getProvinces: appDataActions.getProvinces,
  getDistricts: appDataActions.getDistricts,
  getWards: appDataActions.getWards
})(MInputAddress);
