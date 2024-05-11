import { PlusOutlined } from '@ant-design/icons';
import { Form, FormInstance } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MInput } from '~/views/presentation/fields/input';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import COLOR from '~/views/utilities/layout/color';

import VehicleCheckItem from './VehicleCheckItem';
import { BasicBtn } from '~/views/presentation/ui/buttons';

const VehicleOtherStyled = styled.div`
  .ant-input-group-addon {
    padding-right: 0;
    border: none;
  }
`;

type VehicleOtherProps = {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
  flagSuccess: boolean;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
  registerForm?: boolean;
  fullAccessPage: boolean;
};

const VehicleOther: React.FC<VehicleOtherProps> = ({ form, onFinish, flagSuccess, setDirty, fullAccessPage, registerForm }) => {
  const { t }: any = useTranslation();

  const [suggestVehicleBrands, setSuggestCatalogs] = useState<string[]>([]);

  const handleAddSuggestCatalog = () => {
    setDirty(true);
    const newSuggest = form.getFieldValue('suggestVehicleBrand');
    if (!newSuggest) return;

    setSuggestCatalogs((prev) => [...new Set([...prev, newSuggest])]);

    form.setFieldsValue({ suggestVehicleBrand: '' });
  };

  useEffect(() => {
    if (flagSuccess) setSuggestCatalogs([]);
  }, [flagSuccess]);

  return (
    <VehicleOtherStyled>
      <Form //
        {...ANT_FORM_SEP_LABEL_LAYOUT}
        scrollToFirstError={{
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
          scrollMode: 'always'
        }}
        requiredMark={false}
        form={form}
        onFinish={() => onFinish({ suggestVehicleBrands })}>
        {!registerForm && (
          <MInput //
            name="suggestVehicleBrand"
            extra={t('settings_vehicle_suggest_more_information')}
            noLabel
            require={false}
            hasFeedback={false}
            placeholder={t('settings_vehicle_other_placeholder')}
            inputProps={{
              addonAfter: fullAccessPage && (
                <BasicBtn
                  type="primary"
                  style={{ height: '35px', margin: 0 }}
                  onClick={handleAddSuggestCatalog}
                  icon={<PlusOutlined />}
                  title={t('submit_suggestion')}
                />
              )
            }}
          />
        )}
      </Form>
      {suggestVehicleBrands.map((suggest) => (
        <VehicleCheckItem
          noAction
          key={suggest}
          item={
            {
              id: suggest,
              name: suggest
            } as any
          }
          checked={true}
          handleChangeVehicle={() => {}}
        />
      ))}
    </VehicleOtherStyled>
  );
};

export default VehicleOther;
