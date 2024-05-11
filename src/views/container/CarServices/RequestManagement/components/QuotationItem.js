import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { GUARANTEE_TYPE } from '~/configs';
import { itemsActions } from '~/state/ducks/items';
import { mechanicActions } from '~/state/ducks/mechanic';
import { quotationActions } from '~/state/ducks/mechanic/quotation';
import { requestActions } from '~/state/ducks/mechanic/request';
import { MInput, MInputNumber } from '~/views/presentation/fields/input';
import MRadio from '~/views/presentation/fields/Radio';
import MSelect from '~/views/presentation/fields/Select';
import AButton from '~/views/presentation/ui/buttons/AButton';

const MInputStyled = styled(MInput)`
  .ant-input[disabled] {
    background-color: transparent;
    border-bottom: 1px solid #000;
    color: rgba(0, 0, 0, 0.85);
  }
`;

const MInputNumberStyled = styled(MInputNumber)`
  .ant-input-number-disabled {
    background-color: transparent;
    border-bottom: 1px solid #000;
    color: rgba(0, 0, 0, 0.85);
  }

  .ant-input-number-group-addon {
    border: none;
    padding: 0px;
  }

  .ant-input-number-group-addon:last-child {
    background-color: white;
    padding-left: 2px;
  }

  .ant-form-item-has-feedback.ant-form-item-has-success .ant-form-item-children-icon {
    right: 79px;
  }
`;

const QuotationItem = (props) => {
  const { t } = useTranslation();

  const PricingSystemSelectButton = () => {
    return (
      <AButton //
        onClick={() => {
          props.setCurrentItemKey(props.name);
          props.setPricingSystemShow(true);
        }}
        type="default"
        size="small"
        icon={<PlusOutlined />}
      />
    );
  };

  return (
    <div className="d-flex align-items-center justify-content-between m-5">
      <div className="p-5" style={{ border: '1px solid #000' }}>
        <MInputStyled
          name={[props.name, 'name']}
          fieldKey={[props.fieldKey, 'name']}
          noLabel
          hasFeedback={false}
          noPadding
          readOnly={props.itemKeyFlag.includes(props.name)}
          label={t('product/service')}
          placeholder={t('search_product')}
          addonAfter={<PricingSystemSelectButton />}
          searchCorrectly={false}
          valueProperty="name"
          labelProperty="name"
        />
        <div className="row">
          <div className="col-12 col-lg-6">
            <MInputNumberStyled //
              label={t('price')}
              noPadding
              readOnly={props.itemKeyFlag.includes(props.name)}
              name={[props.name, 'price']}
              fieldKey={[props.fieldKey, 'price']}
              noLabel
              require={true}
              placeholder={t('price')}
            />
          </div>
          <div className="col-12 col-lg-6">
            <MInputNumber //
              noPadding
              noLabel
              min={1}
              require={true}
              label={t('quantity')}
              placeholder={t('quantity')}
              name={[props.name, 'quantity']}
              fieldKey={[props.fieldKey, 'quantity']}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6">
            <MSelect
              name={[props.name, 'origin']}
              label={t('origin')}
              placeholder={t('origin')}
              noPadding
              noLabel
              require={false}
              size="medium"
              fetchData={props.getCounties}
              valueProperty="name"
              labelProperty="name"
            />
          </div>
          <div className="col-12 col-lg-6">
            <MInput name={[props.name, 'unit']} label={t('unit')} placeholder={t('unit')} noPadding noLabel require={false} />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6">
            <MRadio
              name={[props.name, 'guaranteeCheck']}
              fieldKey={[props.fieldKey, 'guaranteeCheck']}
              label={t('warrantyPolicy')}
              noLabel
              noPadding
              require={false}
              direction="vertical"
              spaceSize="middle"
              value={props.form.getFieldValue([props.name, 'guaranteeCheck'])}
              defaultValue={GUARANTEE_TYPE.NONE_GUARANTEE}
              options={[
                { value: GUARANTEE_TYPE.NONE_GUARANTEE, label: t('noWarranty') },
                { value: GUARANTEE_TYPE.GUARANTEE_TIME, label: t('warrantyTime') },
                { value: GUARANTEE_TYPE.GUARANTEE_KM, label: t('warrantyKm') }
              ]}
            />
          </div>
          <div className="col-12 col-lg-6">
            {props.form.getFieldValue(['items', props.name, 'guaranteeCheck']) === GUARANTEE_TYPE.GUARANTEE_TIME && (
              <MInputNumberStyled
                className=" w-100"
                require={true}
                min={1}
                colon={true}
                labelAlign="left"
                label={t('warrantyTime')}
                noPadding
                customLayout="w-100"
                name={[props.name, 'guaranteeTime']}
                fieldKey={[props.fieldKey, 'guaranteeTime']}
                hasFeedback={false}
                formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
                addonAfter={<span style={{ fontSize: '13px' }}>{t('month')}</span>}
              />
            )}

            {props.form.getFieldValue(['items', props.name, 'guaranteeCheck']) === GUARANTEE_TYPE.GUARANTEE_KM && (
              <MInputNumberStyled
                className=" w-100"
                require={true}
                min={1}
                colon={true}
                labelAlign="left"
                label={t('warrantyKm')}
                noPadding
                customLayout="w-100"
                name={[props.name, 'guaranteeKm']}
                fieldKey={[props.fieldKey, 'guaranteeKm']}
                hasFeedback={false}
                formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
              />
            )}
          </div>
        </div>

        {/* ENHANCE LATER
        <div className="mt-5">
          <MUploadImageNoCropMultiple //
            noLabel
            noPadding
            fileList={mediaList}
            name={[props.name, 'media']}
            fieldKey={[props.fieldKey, 'media']}
            require={false}
            label={t('')}
            onImageChange={onMediaListChange}
          />
        </div> */}
      </div>
      <div className="ml-3">
        <DeleteOutlined style={{ color: '#000' }} onClick={() => props.remove(props.name)} />
      </div>
    </div>
  );
};

export default connect(null, {
  getMechanics: mechanicActions.getMechanics,
  getPricingSystems: quotationActions.getPricingSystems,
  getRequestDetail: requestActions.getRequestDetail,
  getCounties: itemsActions.getCounties
})(QuotationItem);
