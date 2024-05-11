import 'moment/locale/vi';

import { Col, ConfigProvider } from 'antd/es';
import enUS from 'antd/es/locale/en_US';
import viVN from 'antd/es/locale/vi_VN';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TIME_UNITS, VEHICLE_BUSINESS_TYPE } from '~/configs';
import { vehicleActions } from '~/state/ducks/vehicle';
import MMultiSelect from '~/views/presentation/fields/MultiSelect';
import MRangePicker from '~/views/presentation/fields/RangePicker';

moment.locale('vi');

type VehicleSettingProps = {
  name: number;
  allowEdit: boolean;
  currentType: string;
  getVehicleBrand: any;
  getVehicleModel: any;
  locale: any;
};

const VehicleSetting: React.FC<VehicleSettingProps> = (props) => {
  const { t }: any = useTranslation();
  const [locale, setLocale] = useState(enUS);
  const [brandIds, setBrandIds] = useState<any>();

  useEffect(() => {
    setLocale(props.locale === 'vi' ? viVN : enUS);
  }, [props.locale]);

  const disabledDate = (current: any) => {
    return current && (current.year() < 1990 || current.year() > moment().year());
  };

  return (
    <>
      <Col span={24} md={11}>
        <MMultiSelect
          name={[props.name, `brands${props.currentType}`]}
          noLabel
          noPadding
          require={false}
          allowClear
          label={t('vehicleBrand')}
          placeholder={t('vehicleBrand')}
          disabled={!props.allowEdit}
          searchCorrectly={false}
          hasFeedback={false}
          fetchData={props.getVehicleBrand}
          params={{ type: 'CAR' }}
          customDataResponse={(o: any) => {
            return {
              value: `${o['id']} - ${o['name']}`,
              label: o['name'],
              search: o['name']
            };
          }}
          onChange={(value: any) => {
            if (value && value.length > 0) {
              const brandIds = value.map((value: string) => +value?.split(' - ')[0])?.join(',');
              setBrandIds(brandIds);
            }
          }}
        />
      </Col>
      <Col span={24} md={2}></Col>
      <Col span={24} md={11}>
        <MMultiSelect
          name={[props.name, `models${props.currentType}`]}
          noLabel
          noPadding
          require={false}
          allowClear
          label={t('vehicleModel')}
          placeholder={t('vehicleModel')}
          disabled={!props.allowEdit}
          searchCorrectly={false}
          hasFeedback={false}
          fetchData={props.getVehicleModel}
          params={{ brandIds }}
          customDataResponse={(o: any) => {
            return {
              value: `${o['id']} - ${o['name']}`,
              label: o['name'],
              search: o['name']
            };
          }}
        />
      </Col>

      <Col span={24} md={11}>
        <ConfigProvider locale={locale}>
          <MRangePicker
            name={[props.name, `producingYears${props.currentType}`]}
            noLabel
            noPadding
            label={t('yearOfManufacture')}
            require={false}
            disabledDate={disabledDate}
            allowClear={true}
            locale={locale}
            picker={TIME_UNITS.YEAR.toLowerCase()}
            format="YYYY"
            placeholder={[t('fromYear'), t('toYear')]}
            disabled={!props.allowEdit}
          />
        </ConfigProvider>
      </Col>
      <Col span={24} md={2}></Col>
      <Col span={24} md={11}>
        <MMultiSelect
          name={[props.name, `businessTypes${props.currentType}`]}
          noLabel
          noPadding
          require={false}
          allowClear
          label={t('vehicle_type')}
          placeholder={t('vehicle_type')}
          disabled={!props.allowEdit}
          searchCorrectly={false}
          hasFeedback={false}
          options={Object.keys(VEHICLE_BUSINESS_TYPE).map((o) => {
            return {
              value: VEHICLE_BUSINESS_TYPE[o],
              search: t(VEHICLE_BUSINESS_TYPE[o]),
              label: t(VEHICLE_BUSINESS_TYPE[o])
            };
          })}
        />
      </Col>
    </>
  );
};

export default connect(
  (state: any) => ({
    locale: state['appData']?.locale
  }),
  {
    getVehicleBrand: vehicleActions.getVehicleBrand,
    getVehicleModel: vehicleActions.getVehicleModel
  }
)(VehicleSetting);
