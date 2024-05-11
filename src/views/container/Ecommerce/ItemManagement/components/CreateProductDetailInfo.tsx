import { Col, Row } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TEXT_AREA_ROWS } from '~/configs/status/car-accessories/itemsType';
import { itemsActions } from '~/state/ducks/items';
import { MCKEditor, MInput, MInputNumber, MTextArea } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import ATypography from '~/views/presentation/ui/text/ATypography';

const MTextAreaStyled = styled(MTextArea)`
  .ant-input-affix-wrapper {
    border: 1px solid #000 !important;
  }
  .ant-form-item-label {
    text-align: left;
  }
  .ant-input {
    border: 1px solid #000 !important;
  }
`;

const MInputNumberStyled = styled(MInputNumber)`
  font-size: 12px;
`;

type PropsType = {
  form: {
    setFieldsValue: (arg0: { description?: any; details?: any; specifications?: any }) => void;
    setFieldValue: (arg0: string, arg1: any) => void;
  };
  loading: boolean;
  isEditing: boolean;
  overview: string;
  detail: string;
  specifications: string;
  suppliers: any[];
  getSuppliers: any;
  getCounties: any;
};

function CreateProductDetailInfo(props: PropsType) {
  const { t }: any = useTranslation();
  const onOverviewChange = (data) => {
    props.form.setFieldsValue({ description: data });
  };
  const onDetailsChange = (data) => {
    props.form.setFieldsValue({ details: data });
  };
  const onSpecificationChange = (data) => {
    props.form.setFieldsValue({ specifications: data });
  };
  return (
    <div>
      <MInput
        noLabel
        className="pb-5"
        loading={props.loading}
        require={false}
        noPadding
        readOnly={!props.isEditing}
        label={t('tags')}
        placeholder={t('insert_tag')}
        name="tags"
      />
      <MCKEditor //
        loading={props.loading}
        noPadding
        noLabel
        require
        disabled={!props.isEditing}
        className="pb-5"
        mRules={[{ max: 10000, message: t('max_length_10000') }]}
        name="description"
        label={t('goods_detail')}
        tooltip={{
          title: t('required_field'),
          icon: (
            <span>
              (<ATypography type="danger">*</ATypography>)
            </span>
          )
        }}
        value={props.overview}
        onChange={onOverviewChange}
      />
      <MCKEditor //
        loading={props.loading}
        noPadding
        noLabel
        className="pb-5"
        disabled={!props.isEditing}
        mRules={[{ max: 10000, message: t('max_length_10000') }]}
        name="specifications"
        label={t('technical_parameter')}
        value={props.specifications}
        onChange={onSpecificationChange}
      />
      <MCKEditor //
        loading={props.loading}
        noPadding
        noLabel
        disabled={!props.isEditing}
        className="pb-5"
        mRules={[{ max: 10000, message: t('max_length_10000') }]}
        name="details"
        label={t('goods_overview')}
        value={props.detail}
        onChange={onDetailsChange}
      />
      <div className="mb-10">
        <MTextAreaStyled //
          loading={props.loading}
          noPadding
          noLabel
          read
          hasFeedback={false}
          disabled={!props.isEditing}
          rows={TEXT_AREA_ROWS.MEDIUM}
          require={false}
          name="note"
          label={t('note')}
        />
      </div>
      <div className="mb-10">
        <MSelect
          noPadding
          name="supplierId"
          noLabel
          require={false}
          labelAlign="left"
          disabled={!props.isEditing}
          label={t('suppliers_name')}
          placeholder={t('select_supplier_name')}
          searchCorrectly={false}
          fetchData={props.getSuppliers}
          valueProperty="id"
          labelCustom={(o) => `${o.id} - ${o.name}`}></MSelect>
      </div>
      <Row>
        <Col sm={24} md={11} lg={11} className="mb-10 w-100">
          <MSelect
            noPadding
            name="origin"
            noLabel
            require={false}
            size="large"
            disabled={!props.isEditing}
            label={t('origin')}
            placeholder={t('origin')}
            fetchData={props.getCounties}
            valueProperty="name"
            labelProperty="name"></MSelect>
        </Col>
        <Col sm={24} md={2} lg={2}></Col>
        <Col sm={24} md={11} lg={11} className="w-100">
          <MInputNumberStyled
            colon={true}
            noLabel
            noPadding
            name="guaranteeTime"
            require={false}
            disabled={!props.isEditing}
            placeholder={t('guaranteeTime')}
            label={t('guaranteeTime')}></MInputNumberStyled>
        </Col>
      </Row>
    </div>
  );
}

export default connect(null, {
  getSuppliers: itemsActions.getSuppliers,
  getCounties: itemsActions.getCounties
})(CreateProductDetailInfo);
