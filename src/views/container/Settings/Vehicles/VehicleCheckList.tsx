import { SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect, useDispatch } from 'react-redux';
import { Prompt } from 'react-router';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { settingActions } from '~/state/ducks/settings';
import {
  getSettingVehicles,
  getVendorSupportedVehicles,
  SettingVehicleResponse,
  updateSettingVehicle,
  VEHICLE_TYPES
} from '~/state/ducks/settings/actions';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { replaceVniToEng } from '~/views/utilities/helpers/string';

import VehicleCheckItem from './VehicleCheckItem';
import VehicleOther from './VehicleOther';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { BasicBtn } from '~/views/presentation/ui/buttons';

const VehicleCheckListStyled: any = styled.div`
  max-width: ${(props: any) => (props.registerForm ? '100%' : '360px')};

  .check_list {
    max-height: calc(100vh - 400px);
    overflow-y: auto;
  }

  .all_vehicle_item {
    position: sticky;
    top: 0;
    background: #eee;
    z-index: 2;
  }
`;

const ITEM_ALL = (t) => ({
  icon: '',
  id: -1,
  index: -1,
  isDefault: false,
  name: t('all')
});

type VehicleCheckListProps = {
  /* Use for register form */
  registerForm?: boolean;
  setBodyRequest?: any;
  updateProfile?: any;
  /* Use for register form */
  getRoleBase: any;
  getSettingVehicles: any;
  getVendorSupportedVehicles: any;
};

const VehicleCheckList: React.FC<VehicleCheckListProps> = (props) => {
  const { t }: any = useTranslation();
  const dispatch = useDispatch();

  const [initial, setInitial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [vehicles, setVehicles] = useState<Array<SettingVehicleResponse>>([]);
  const [vehiclesFilter, setVehiclesFilter] = useState<Array<SettingVehicleResponse>>();

  // Checked list
  const [vehicleBrandIds, setVehicleBrandIds] = useState<Array<number>>([]);
  const [vehicleBrandIdsTemp, setVehicleBrandIdsTemp] = useState<Array<number>>([]);
  const [vehicleBrandIdsMatch, setVehicleBrandIdsMatch] = useState<Array<number>>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [flagSuccess, setFlagSuccess] = useState(false);
  const [type, setType] = useState<(typeof VEHICLE_TYPES)[keyof typeof VEHICLE_TYPES]>(VEHICLE_TYPES.CAR);
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  const [form] = Form.useForm();

  const fetchData = async (type) => {
    setLoading(true);

    let vehiclesIdsRes: any = [];
    await dispatch(getSettingVehicles({ type })).then((res) => {
      vehiclesIdsRes = res?.content?.map((vehicle) => vehicle.id) || [];
      setVehicles(res?.content || []);
    });

    if (!props.registerForm) {
      await dispatch(getVendorSupportedVehicles({ type })).then((res) => {
        const vehicleBrandIds = res?.content?.vehicleBrandIds || [];
        const vehicleBrandIdsMatch = res?.content?.vehicleBrandIds?.filter((item) => vehiclesIdsRes.includes(item)) || []; // get all id match vehicle response

        setVehicleBrandIds(vehicleBrandIds || []);
        setVehicleBrandIdsTemp(vehicleBrandIds || []);
        setVehicleBrandIdsMatch(vehicleBrandIdsMatch || []);

        if (vehicleBrandIdsMatch.length && vehicleBrandIdsMatch.length < vehiclesIdsRes.length) {
          if (!vehicleBrandIdsMatch.some((item) => vehiclesIdsRes.includes(item))) setIndeterminate(false);
          else setIndeterminate(true);
        } else setIndeterminate(false);
      });
    }

    if (props.registerForm) {
      const vehicleBrandIdsMatch = vehicleBrandIds.filter((f) => vehiclesIdsRes.includes(f));

      setVehicleBrandIds(vehicleBrandIds || []);
      setVehicleBrandIdsTemp(vehicleBrandIds || []);
      setVehicleBrandIdsMatch(vehicleBrandIdsMatch || []);

      if (vehicleBrandIdsMatch.length && vehicleBrandIdsMatch.length < vehiclesIdsRes.length) {
        if (!vehicleBrandIdsMatch.some((item) => vehiclesIdsRes.includes(item))) setIndeterminate(false);
        else setIndeterminate(true);
      } else setIndeterminate(false);
    }

    setLoading(false);
    setInitial(true);
  };

  useEffect(() => {
    fetchData(type);
    return () => {
      setVehicles([]);
      setVehicleBrandIds([]);
      setVehiclesFilter(undefined);
      setLoading(false);
    };
  }, [type]);

  const onFinish = ({ suggestVehicleBrands }) => {
    setLoading(true);

    if (props.registerForm) {
      setDirty(false);
      props.updateProfile([...new Set([...vehicleBrandIdsTemp, ...vehicleBrandIds])]);
      setLoading(false);
    } else {
      dispatch(updateSettingVehicle({ vehicleBrandIds: [...new Set([...vehicleBrandIdsTemp, ...vehicleBrandIds])], suggestVehicleBrands }))
        .then(() => {
          setDirty(false);
          AMessage.success(t('update_setting_success'));
          setFlagSuccess(true);
          setTimeout(() => {
            setFlagSuccess(false);
          }, 10);
        })
        .catch((err) => AMessage.error(t(err.message)))
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleChangeVehicle = (vehicle: SettingVehicleResponse) => {
    setDirty(true);
    if (vehicle.id === -1) {
      // all service checked
      if (vehicleBrandIds.length >= vehicles?.length && vehicleBrandIdsMatch.length !== 0) {
        const vehicleIds = [...vehicles?.map((m) => m.id)];
        if (props.registerForm) {
          setVehicleBrandIds((prev) => prev.filter((item) => !vehicleIds.includes(item)));
          setVehicleBrandIdsMatch((prev) => prev.filter((item) => !vehicleIds.includes(item)));
        } else {
          setVehicleBrandIds([]);
          setVehicleBrandIdsMatch([]);
        }
        setVehicleBrandIdsTemp((prev) => prev.filter((item) => !vehicleIds.includes(item)));
      } else {
        setVehicleBrandIds((prev) => [...new Set([...prev, ...vehicles?.map((m) => m.id)])]);
        setVehicleBrandIdsMatch((prev) => [...new Set([...prev, ...vehicles?.map((m) => m.id)])]);
      }
      setIndeterminate(false);
      return;
    }

    setVehicleBrandIdsTemp((prev) => {
      let newVehicleBrandIds = [...prev];
      if (prev.includes(vehicle.id)) newVehicleBrandIds = prev.filter((item) => item !== vehicle.id);
      else newVehicleBrandIds = [...prev, vehicle.id];

      return newVehicleBrandIds;
    });

    setVehicleBrandIds((prev) => {
      const vehicleIds = vehicles.map((vehicle) => vehicle.id) || [];
      let newVehicleBrandIds = [...prev];
      if (prev.includes(vehicle.id)) newVehicleBrandIds = prev.filter((item) => item !== vehicle.id);
      else newVehicleBrandIds = [...prev, vehicle.id];

      const vehicleBrandIdsMatch = newVehicleBrandIds?.filter((item: any) => vehicleIds.includes(item)) || []; // get all id match vehicle
      if (vehicleBrandIdsMatch.length && vehicleBrandIdsMatch.length < vehicles.length) setIndeterminate(true);
      else setIndeterminate(false);
      return newVehicleBrandIds;
    });
  };

  const onChange = (e) => {
    const value = e.target.value;
    setVehiclesFilter(vehicles.filter((item) => replaceVniToEng(item.name.toLowerCase()).includes(replaceVniToEng(value.toLowerCase()))));
  };

  const renderSkeleton = () => {
    return [...new Array(20)].map((_, index) => {
      return <Skeleton key={index} className="py-3 w-100" paragraph={false} title={{ width: '100%' }} active />;
    });
  };

  return (
    <VehicleCheckListStyled className="d-flex flex-column gap-8" registerForm={props.registerForm}>
      {!props.registerForm && <Prompt when={dirty} message={t('leave_confirm')} />}
      <Select size="large" onChange={setType} value={type} className="w-100">
        {Object.keys(VEHICLE_TYPES).map((o) => (
          <Select.Option key={o} value={o}>
            {t(VEHICLE_TYPES[o])}
          </Select.Option>
        ))}
      </Select>

      <Input
        size="large"
        prefix={<SVG src={toAbsoluteUrl('/media/svg/icons/Tools/Search.svg')} />}
        placeholder={t('settings_vehicle_search_placeholder')}
        onChange={onChange}
        allowClear
      />

      <div className="d-flex flex-column gap-2 px-2 check_list">
        {initial ? (
          <>
            {!vehiclesFilter && (
              <VehicleCheckItem
                //
                className="all_vehicle_item"
                key="all"
                item={ITEM_ALL(t)}
                indeterminate={indeterminate}
                checked={!!vehicleBrandIdsMatch.length && !!vehicles.length && vehicleBrandIdsMatch.length >= vehicles.length}
                handleChangeVehicle={handleChangeVehicle}
              />
            )}
            {(vehiclesFilter || vehicles).map((item) => (
              <VehicleCheckItem
                //
                key={item.id}
                item={item}
                checked={vehicleBrandIds.includes(item.id)}
                handleChangeVehicle={handleChangeVehicle}
              />
            ))}
          </>
        ) : (
          renderSkeleton()
        )}
      </div>

      <VehicleOther
        form={form}
        onFinish={onFinish}
        flagSuccess={flagSuccess}
        fullAccessPage={fullAccessPage}
        setDirty={setDirty}
        registerForm={props.registerForm}
      />

      {(fullAccessPage || props.registerForm) && (
        <BasicBtn
          size="large"
          loading={loading}
          style={{ width: '100%', margin: 0 }}
          type="primary"
          icon={<SaveOutlined style={{ fontSize: 16 }} />}
          onClick={form.submit}
          title={t(props.registerForm ? 'done' : 'save')}
        />
      )}
    </VehicleCheckListStyled>
  );
};

export default connect(
  (state: any) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  { getSettingVehicles: settingActions.getSettingVehicles, getVendorSupportedVehicles: settingActions.getVendorSupportedVehicles }
)(VehicleCheckList);
