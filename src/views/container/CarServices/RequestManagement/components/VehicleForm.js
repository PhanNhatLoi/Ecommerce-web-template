import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FUEL_TYPE, GEARBOX_TYPES, LOAD_CAPACITY, MODEL_TYPES, VEHICLE_BRANDS, VEHICLE_TYPES } from '~/configs';
import Divider from '~/views/presentation/divider';
import MSelect from '~/views/presentation/fields/Select';
import { ANT_FORM_PAGE_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import CarForm from './CarForm';
import TruckForm from './TruckForm';

const VehicleForm = (props) => {
  const { t } = useTranslation();
  const { modalShow, setModalShow } = props;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState(VEHICLE_TYPES.CAR);

  useEffect(() => {
    form.setFieldsValue({ vehicleTypeId: VEHICLE_TYPES.CAR });
  }, []);

  const getKeyFromValue = (refValue, dictionary) => {
    let result;
    Object.keys(dictionary).forEach((key) => {
      if (dictionary[key] === refValue) result = key;
    });
    return result;
  };

  const onFinish = (values) => {
    props.setVehicleList([
      ...props.vehicleList,
      {
        ...values,
        key: Date.now().toString(36) + Math.random().toString(36).substr(2),
        modelName: getKeyFromValue(values.modelId, MODEL_TYPES),
        brandName: getKeyFromValue(values.brandId, VEHICLE_BRANDS),
        gearBoxName: getKeyFromValue(values.gearboxTypeId, GEARBOX_TYPES),
        fuelTypeName: getKeyFromValue(values.fuelTypeId, FUEL_TYPE),
        loadCapacityName: getKeyFromValue(values.loadCapacity, LOAD_CAPACITY),
        demention: [values?.width, values?.height, values?.length].join('x')
      }
    ]);
    form.resetFields();
    props.setModalShow(false);
  };

  const onFinishFailed = (error) => {
    console.error('trandev ~ file: VehicleForm.js ~ line 19 ~ onFinishFailed ~ error', error);
  };

  const renderForm = () => {
    if (type === VEHICLE_TYPES.CAR) {
      return <CarForm />;
    } else if (type === VEHICLE_TYPES.TRUCK) {
      return <TruckForm />;
    }
  };

  return (
    <AntModal //
      title={t('add_new_vehicle')}
      description=""
      width={700}
      modalShow={modalShow}
      destroyOnClose
      onCancel={() => setModalShow(false)}>
      <Form //
        {...ANT_FORM_PAGE_LAYOUT}
        requiredMark={false}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <MSelect //
          allowClear={false}
          label={t('vehicle_type')}
          labelAlign="left"
          name="vehicleTypeId"
          noLabel
          value={type}
          onChange={(value) => setType(value)}
          options={Object.keys(VEHICLE_TYPES).map((type) => {
            return {
              value: VEHICLE_TYPES[type],
              label: t(type)
            };
          })}
          placeholder={t('vehicle_type_placeholder')}
        />
        {renderForm()}
        <Divider />
        <Form.Item>
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <AButton
              style={{ verticalAlign: 'middle', width: '150px' }}
              className="px-5"
              size="large"
              htmlType="submit"
              loading={submitting}
              type="primary"
              icon={<PlusOutlined />}>
              {t('add')}
            </AButton>
            <AButton
              style={{ verticalAlign: 'middle', width: '150px' }}
              className="mt-3 mt-lg-0 ml-lg-3 px-5"
              size="large"
              type="ghost"
              onClick={() => {
                form.resetFields();
                setModalShow(false);
              }}
              icon={<CloseOutlined />}>
              {props.cancelText || t('close')}
            </AButton>
          </div>
        </Form.Item>
      </Form>
    </AntModal>
  );
};

export default VehicleForm;
