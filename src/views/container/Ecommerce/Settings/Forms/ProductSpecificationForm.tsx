import { Col, Form, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import { useBeforeUnload } from 'react-use';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import { TEXT_AREA_ROWS } from '~/configs/status/car-accessories/itemsType';
import { unitActions } from '~/state/ducks/units';
import { MInput, MTextArea } from '~/views/presentation/fields/input';
import LayoutForm from '~/views/presentation/layout/forForm';
import { BackBtn, CancelBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
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
type ProductSpecificationFormProps = {
  createUnit: any;
  updateUnit: any;
  getUnits: any;
  setNeedLoadNewData: any;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  id: string | number;
  form: any;
  submitIcon: JSX.Element;
  submitText: string;
  onCancel: (value?: boolean) => void;
};

const ProductSpecificationForm: React.FC<ProductSpecificationFormProps> = (props) => {
  const { t }: any = useTranslation();
  const params = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);

  const [oldName, setOldName] = useState<string>('');

  useBeforeUnload(dirty, t('leave_confirm'));
  const onValuesChange = () => {
    setDirty(true);
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
    console.error('trandev ~ file: InfoForm.js ~ line 31 ~ useEffect ~ err', err);
  };

  useEffect(() => {
    if (params?.id) {
      setLoading(false);
      props
        .getUnits(params?.id)
        .then((res) => {
          const response = res?.content;
          const dataFilter = response?.filter((unit: any) => unit.id == params?.id)[0];
          form.setFieldsValue({
            name: dataFilter?.name,
            shortName: dataFilter?.shortName || undefined,
            description: dataFilter?.description || undefined
          });
          setOldName(dataFilter?.name);
        })
        .catch((err) => {
          catchPromiseError(err);
        });
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
        form.resetFields();
        AMessage.success(t(successMessage));
        props.setNeedLoadNewData && props.setNeedLoadNewData(true);
        history.push(PATH.CAR_ACCESSORIES_PRODUCT_SPECIFICATIONS);
        setSubmitting(false);
      })
      .catch((err) => {
        catchPromiseError(err);
        setDirty(false);
        setSubmitting(false);
      });
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    const body = {
      name: values?.name || '',
      shortName: values?.shortName || '',
      description: values?.description || ''
    };
    !params?.id
      ? // create product
        submitForm(
          //
          await props.createUnit,
          body,
          'create_specification_success'
        )
      : // update product
        submitForm(
          //
          await props.updateUnit,
          { id: params?.id, body: { ...body, id: params?.id, name: values.name === oldName ? null : values.name } },
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
        titleHeader={isEditing ? t('product_specification_new') : t('view_edit_product_specification')}
        btn={
          <div>
            <BackBtn
              onClick={() => {
                leaveConfirm();
                history.push(PATH.CAR_ACCESSORIES_PRODUCT_SPECIFICATIONS);
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
          onValuesChange={onValuesChange}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}>
          <Prompt when={dirty} message={t('leave_confirm')} />
          <LayoutForm title={t('specification_info')}>
            <Row>
              <Col md={24} lg={11}>
                <MInput noLabel loading={loading} noPadding hasFeedback require label={t('Unit')} placeholder={t('Unit')} name="name" />
              </Col>
              <Col md={24} lg={2}></Col>
              <Col md={24} lg={11}>
                <MInput
                  noLabel
                  loading={loading}
                  noPadding
                  require={false}
                  hasFeedback
                  label={t('specification_des_name')}
                  placeholder={t('insert_specification_des_name')}
                  name="shortName"
                />
              </Col>
              <Col md={24} lg={24}>
                <MTextAreaStyled //
                  loading={loading}
                  noPadding
                  noLabel
                  read
                  rows={TEXT_AREA_ROWS.MEDIUM}
                  require={false}
                  name="description"
                  label={t('note')}
                />
              </Col>
            </Row>
          </LayoutForm>

          <Form.Item>
            <SubmitBtn loading={submitting} />
            <CancelBtn
              onClick={() => {
                leaveConfirm();
                history.push(PATH.CAR_ACCESSORIES_PRODUCT_SPECIFICATIONS);
              }}
            />
          </Form.Item>
        </Form>
      </CardBody>
    </BCard>
  );
};

export default connect(null, {
  createUnit: unitActions.createUnit,
  updateUnit: unitActions.updateUnit,
  getUnits: unitActions.getUnits
})(ProductSpecificationForm);
