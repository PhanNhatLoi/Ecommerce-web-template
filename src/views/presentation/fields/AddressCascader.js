import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Cascader, Form } from 'antd/es';
import { commonValidate } from '~/views/utilities/ant-validation';
import { connect } from 'react-redux';
import { appDataActions } from '~/state/ducks/appData';
import styled from 'styled-components';
import { findIndex } from 'lodash-es';

const CascaderStyled = styled(Cascader)`
  @media (min-width: 768px) {
    width: ${(props) => (props.fullWidth ? '100% !important' : '70% !important')};
  }
  @media (max-width: 426px) {
    width: 100% !important;
  }
`;

const InputStyled = styled(Input)`
  @media (min-width: 768px) {
    width: ${(props) => (props.fullWidth ? '100% !important' : '29% !important')};
    margin-left: ${(props) => (props.fullWidth ? '0 !important' : '1% !important')};
    margin-top: ${(props) => (props.fullWidth ? '16px !important' : '0 !important')};
  }
  @media (max-width: 426px) {
    width: 100% !important;
    margin-top: 16px !important;
  }
`;

function MAddressCascader(props) {
  const { t }= useTranslation();
  const [area, setArea] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllProvinces = useCallback(
    (params) => {
      if (!props.needLoadDefault) {
        setLoading(true);
        props
          .getProvinces(params)
          .then((res) => {
            setArea(
              res?.content.map((p) => {
                setLoading(false);
                return { value: p.id, label: p.name, type: 'province', isLeaf: false };
              })
            );
          })
          .catch((err) => {
            setLoading(false);
            console.error('trandev ~ file: index.js ~ line 17 ~ useEffect ~ err', err);
          });
      }
    },
    [props]
  );

  useEffect(() => {
    getAllProvinces();
  }, [getAllProvinces]);

  const loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    switch (targetOption.type) {
      case 'province':
        props
          .getDistricts(targetOption?.value)
          .then((res) => {
            targetOption?.loading = false;
            targetOption?.children = res?.content.map((d) => {
              return { value: d.id, label: d.name, type: 'district', isLeaf: false };
            });
            setArea([...area]);
          })
          .catch((err) => {
            console.error(`ithoangtan -  ~ file: AddressCascader.js ~ line 78 ~ loadData ~ err`, err);
          });
        break;
      case 'district':
        props
          .getWards(targetOption?.value)
          .then((res) => {
            targetOption?.loading = false;
            targetOption?.children = res?.content.map((w) => {
              return { value: w.id, label: w.name, type: 'ward' };
            });
            setArea([...area]);
          })
          .catch((err) => {
            console.error('file: AddressCascader.js ~ line 54 ~ loadData ~ err', err);
          });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    let area = [];
    if (props.valueAddress?.length === 3 && props.needLoadDefault) {
      setLoading(true);
      props
        .getProvinces()
        .then((provinces) => {
          area = Array.from(
            provinces?.data.map((p) => {
              return { value: p.id, label: p.name, type: 'province', isLeaf: false };
            })
          );
          if (Number(props.valueAddress[0]) > 0)
            props.getDistricts(props.valueAddress[0]).then((districts) => {
              const indexDistrict = findIndex(area, (p) => p.value === props.valueAddress[0]);
              if (indexDistrict > -1) {
                area[indexDistrict] = {
                  ...area[indexDistrict],
                  loading: false,
                  children: districts?.data.map((d) => {
                    return { value: d.id, label: d.name, type: 'district', isLeaf: false };
                  })
                };
                props.getWards(props.valueAddress[1]).then((wards) => {
                  const indexWards = findIndex(area[indexDistrict]?.children, (d) => d.value === props.valueAddress[1]);
                  if (indexWards > -1) {
                    area[indexDistrict].children[indexWards] = {
                      ...area[indexDistrict]?.children[indexWards],
                      loading: false,
                      children: wards?.data.map((w) => {
                        return { value: w.id, label: w.name, type: 'ward' };
                      })
                    };
                    setArea(area);
                    setLoading(false);
                  } else {
                    setArea(area);
                    setLoading(false);
                  }
                });
              } else {
                setArea(area);
                setLoading(false);
              }
            });
          else {
            setArea(area);
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error('file: index.js ~ line 152 ~ useEffect ~ err', err);
        });
    }
  }, [props.valueAddress?.length]);

  return (
    <Form.Item label={props?.label} validateStatus={props.validateStatus || loading ? 'validating' : undefined} hasFeedback>
      <div className="d-flex flex-wrap">
        <Form.Item name={'address'} noStyle rules={commonValidate()}>
          <CascaderStyled loadData={loadData} options={area} placeholder={t('select_address')} fullWidth={props.fullWidth} />
        </Form.Item>
        <Form.Item name={'address1'} noStyle>
          <InputStyled placeholder={t('input_street')} fullWidth={props.fullWidth} allowClear />
        </Form.Item>
      </div>
    </Form.Item>
  );
}
export default connect(null, {
  getProvinces: appDataActions.getProvinces,
  getDistricts: appDataActions.getDistricts,
  getWards: appDataActions.getWards
})(MAddressCascader);
