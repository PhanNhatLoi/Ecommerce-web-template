import { Col, Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import { useBeforeUnload } from 'react-use';
import styled from 'styled-components';
import { ITEMS_LIST_FIND } from '~/configs/status/car-accessories/itemListUnit';
import { TEXT_AREA_ROWS } from '~/configs/status/car-accessories/itemsType';
import { specificationActions } from '~/state/ducks/specification';
import Divider from '~/views/presentation/divider';
import { MInput, MTextArea } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import LayoutForm from '~/views/presentation/layout/forForm';
import { BackBtn, CancelBtn, EditBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';

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

const SpecificationInfoForm = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [form] = Form.useForm();
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [dirty, setDirty] = useState(false);

  useBeforeUnload(dirty, t('leave_confirm'));
  const onFormChange = () => {
    const values = form.getFieldsValue(true);
    setDirty(!!(values.specificationCode || values.specificationName || values.exchangeUnit || values.exchangeValue || values.note));
  };

  const leaveConfirm = () => {
    if (!dirty) setDirty(false);
  };

  //----------------------------------------------------------------
  // FOR API HANDLE
  //----------------------------------------------------------------
  const catchPromiseError = (err) => {
    setLoading(false);
    AMessage.error(t(err.message));
    console.error('trandev ~ file: SpecificationInfoForm.js ~ line 31 ~ useEffect ~ err', err);
  };

  useEffect(() => {
    if (params?.id) {
      setLoading(true);
      props
        .getSpecificationDetail(params?.id)
        .then((res) => {
          setLoading(false);
          const response = res?.content;
          form.setFieldsValue({
            specificationCode: response?.specificationCode,
            specificationName: response?.specificationName,
            note: response?.note,
            exchangeUnit: response?.exchangeUnit,
            exchangeValue: response?.exchangeValue
          });
          setNote(res?.content?.note);
        })
        .catch((err) => {
          catchPromiseError(err);
        });
    } else {
      setIsEditing(true);
    }
  }, [params?.id]);
  //----------------------------------------------------------------
  // FOR API HANDLE
  //----------------------------------------------------------------

  //----------------------------------------------------------------
  // FOR FORM SUBMIT
  //----------------------------------------------------------------
  const submitForm = (action, body, successMessage) => {
    action(body)
      .then((res) => {
        setDirty(false);
        setSubmitting(false);
        form.resetFields();
        AMessage.success(t(successMessage));
        props.setNeedLoadNewData && props.setNeedLoadNewData(true);
        props.onCancel(true);
        history.push('/car-accessories/master-data/items/?tab=2');
      })
      .catch((err) => {
        catchPromiseError(err);
        setDirty(false);
        history.push('/car-accessories/master-data/items/?tab=2');
      });
  };

  const onFinish = (values) => {
    setSubmitting(true);
    const body = {
      specificationCode: values?.specificationCode || '',
      specificationName: values?.specificationName || '',
      exchangeValue: values?.exchangeValue || '',
      exchangeUnit: values?.exchangeUnit || '',
      note: values?.note || ''
    };

    !params?.id
      ? // create product
        submitForm(
          //
          props.createSpecification,
          body,
          'create_specification_success'
        )
      : // update product
        submitForm(
          //
          props.updateSpecification,
          { id: params?.id, body: { ...body, id: params?.id } },
          'update_specification_success'
        );
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };
  //----------------------------------------------------------------
  // FOR FORM SUBMIT
  //----------------------------------------------------------------

  // Before unload

  return (
    <BCard>
      <CardHeader
        titleHeader={isEditing ? t('goods_new') : t('view_edit_item')}
        btn={
          <div>
            <BackBtn
              onClick={() => {
                leaveConfirm();
                history.push('/car-accessories/master-data/items/?tab=2');
              }}
            />
          </div>
        }></CardHeader>
      <CardBody>
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
          onFinish={onFinish}
          onChange={onFormChange}
          onFinishFailed={onFinishFailed}>
          <Prompt when={dirty} message={t('leave_confirm')} />
          <Col md={24} lg={24}>
            <LayoutForm title={t('specification_info')}>
              <MInput
                noLabel
                loading={loading}
                noPadding
                require
                readOnly={!isEditing}
                label={t('specification_code')}
                placeholder={t('insert_specification_code')}
                name="specificationCode"
              />
              <MInput
                noLabel
                loading={loading}
                noPadding
                readOnly={!isEditing}
                label={t('specification_exchange_value')}
                placeholder={t('insert_specification_exchange_value')}
                name="exchangeValue"
              />
              <MInput
                noLabel
                loading={loading}
                require
                noPadding
                readOnly={!isEditing}
                label={t('specification_name')}
                placeholder={t('insert_specification_name')}
                name="specificationName"
              />
              <MSelect
                noPadding
                noLabel
                require
                disabled={!isEditing}
                name="exchangeUnit"
                label={t('specification_exchange_unit')}
                placeholder={t('specification_exchange_unit')}
                showSearch
                options={Object.keys(ITEMS_LIST_FIND).map((type) => {
                  return {
                    value: ITEMS_LIST_FIND[type],
                    label: t(type)
                    // search:
                  };
                })}
                formatter></MSelect>
              <MTextAreaStyled //
                loading={loading}
                disabled={!isEditing}
                noPadding
                noLabel
                read
                rows={TEXT_AREA_ROWS.MEDIUM}
                require={false}
                name="note"
                label={t('note')}
              />
            </LayoutForm>
          </Col>
          <Divider />
          <Form.Item>
            {params?.id ? (
              isEditing ? (
                <SubmitBtn loading={submitting} />
              ) : (
                <EditBtn loading={submitting} onClick={() => setIsEditing(true)} />
              )
            ) : (
              <SubmitBtn loading={submitting} />
            )}
            <CancelBtn
              onClick={() => {
                leaveConfirm();
                history.push('/car-accessories/master-data/items?tab=2');
              }}
            />
          </Form.Item>
        </Form>
      </CardBody>
    </BCard>
  );
};

export default connect(null, {
  getSpecification: specificationActions.getSpecification,
  createSpecification: specificationActions.createSpecification,
  updateSpecification: specificationActions.updateSpecification,
  getSpecificationDetail: specificationActions.getSpecificationDetail
})(SpecificationInfoForm);
