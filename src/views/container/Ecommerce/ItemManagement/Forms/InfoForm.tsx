import { Col, Form, FormInstance, Row } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { PRICING_UNIT } from '~/configs/status/car-services/pricingSystemStatus';
import { authActions } from '~/state/ducks/authUser';
import { itemsActions } from '~/state/ducks/items';
import { Category, getItemDetailType, MainMedia, ParamsType, Unit, UserType } from '~/state/ducks/items/actions';
import { unitActions } from '~/state/ducks/units';
import Divider from '~/views/presentation/divider';
import { BackBtn, CancelBtn, EditBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';

import CreateProductBasicInfo from '../components/CreateProductBasicInfo';
import CreateProductDetailInfo from '../components/CreateProductDetailInfo';
import CreateProductMediaInfo from '../components/CreateProductMediaInfo';

type InfoFormProps = {
  getItems: (params: ParamsType) => void;
  getUnits: any;
  createItem: any;
  updateItem: any;
  getItemsDetail: any;
  getCategories: any;
  getSuppliers: any;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  form: FormInstance<any>;
  getUser: any;
};

const InfoForm: React.FC<InfoFormProps> = (props) => {
  const { t }: any = useTranslation();
  const params = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [image, setImage] = useState<MainMedia[]>([]);
  const [subImage, setSubImage] = useState<MainMedia[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Array<number | string>>([]);
  const [detail, setDetail] = useState<string>('');
  const [overview, setOverview] = useState<string>('');
  const [specifications, setSpecifications] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);
  const [unitsData, setUnitsData] = useState<Unit[]>([]);
  const [suppliers, setSuppliers] = useState<Category[]>([]);
  const [treeValue, setTreeValue] = useState<Category[]>([]);
  const [userInfo, setUserInfo] = useState<UserType>();

  const [currencyValue, setCurrencyValue] = useState(PRICING_UNIT.DONG);

  //----------------------------------------------------------------
  // FOR API HANDLE
  //----------------------------------------------------------------
  const catchPromiseError = (err) => {
    setLoading(false);
    AMessage.error(t(err.message));
    console.error('trandev ~ file: InfoForm.js ~ line 31 ~ useEffect ~ err', err);
  };

  useEffect(() => {
    props.getSuppliers().then((res: { content: Category[] }) => {
      const response = res?.content;
      setSuppliers(response);
    });
    props.getCategories().then((res: { content: React.SetStateAction<Category[]> }) => setTreeValue(res?.content));
    props.getUnits().then((res: { content: React.SetStateAction<Unit[]> }) => setUnitsData(res?.content));
    props.getUser().then((res: { content: React.SetStateAction<itemsActions.UserType | undefined> }) => setUserInfo(res?.content));
    if (params?.id) {
      setLoading(true);
      props
        .getItemsDetail(params?.id)
        .then((res: { content: getItemDetailType }) => {
          const response = res?.content;
          const mainMediaUrl: any = (response?.mainMedia || []).map((a) => {
            if (a?.url !== null) return a?.url;
          });
          const categoriesId = (response?.categories || []).map((a) => a.id);

          form.setFieldsValue({
            code: response?.code,
            name: response?.name,
            oldCode: response?.oldCode,
            upcCode: response?.upcCode,
            origin: response?.origin,
            guaranteeTime: response?.guaranteeTime,
            supplierId: response?.supplierId,
            inStockPrice: response?.inStockPrice,
            tags: response?.tags,
            keywords: response?.keywords,
            mainMedia: response?.mainMedia,
            subMedia: response?.subMedia,
            shortName: response?.shortName,
            unit: response?.unit.id,
            note: response?.note,
            categoryIds: categoriesId,
            specifications: response?.specifications,
            isGenuine: [response?.isGenuine],
            vehicleBrandIds: head(response?.productOfBrands)?.id
          });
          setDetail(response?.details);
          setOverview(response?.description);
          setSpecifications(response?.specifications);
          setLoading(false);
          setImage(mainMediaUrl);
          setSubImage(response?.subMedia);
          setCheckedKeys(categoriesId);
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
        form.resetFields();
        AMessage.success(t(successMessage));
        history.push(PATH.CAR_ACCESSORIES_ITEMS_LIST_PATH);
        setSubmitting(false);
      })
      .catch((err) => {
        catchPromiseError(err);
        setSubmitting(false);
      });
  };

  const onFinish = (values) => {
    setSubmitting(true);
    const unit = unitsData.filter((item) => item?.id === values?.unit);
    const supplierData: any = suppliers.find((item) => item?.id === values?.supplierId);

    const body = {
      code: values?.code || '',
      name: values?.name || '',
      oldCode: values?.oldCode || '',
      upcCode: values?.upcCode || '',
      unit: {
        id: unit[0]?.id,
        name: unit[0]?.name,
        shortName: unit[0]?.shortName
      },
      inStockPrice: values?.inStockPrice || '',
      origin: values?.origin || '',
      supplierId: values?.supplierId,
      guaranteeTime: values?.guaranteeTime,
      tags: values?.tags || '',
      description: values?.description || '',
      details: values?.details || '',
      specifications: values?.specifications || '',
      keywords: values?.keywords || '',
      mainMedia: values?.mainMedia || [],
      subMedia: values?.subMedia || [],
      shortName: values?.shortName || '',
      note: values?.note || '',
      categoryIds: values?.categoryIds || [],
      sellerName: userInfo?.fullName,
      sellerId: userInfo?.userId,
      supplierName: supplierData?.name || '',
      isGenuine: values?.isGenuine?.length > 0 ? head(values?.isGenuine) : false,
      vehicleBrandIds: values?.vehicleBrandIds ? [values?.vehicleBrandIds] : null
    };

    if (!values.categoryIds || values.categoryIds.length <= 0) {
      AMessage.error(t('errCategory'));
      setSubmitting(false);
    } else {
      !params?.id
        ? // create product
          submitForm(props.createItem, body, 'create_goods_success')
        : // update product
          submitForm(props.updateItem, { id: params?.id, body: { ...body, id: params?.id } }, 'update_goods_success');
    }
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };
  //----------------------------------------------------------------
  // FOR FORM SUBMIT
  //----------------------------------------------------------------

  const onValuesChange = () => {
    isEditing && setDirty(true);
  };

  return (
    <BCard>
      <CardHeader
        titleHeader={isEditing ? t('goods_new') : t('view_edit_item')}
        btn={
          <div>
            <BackBtn
              onClick={() => {
                history.push(PATH.CAR_ACCESSORIES_ITEMS_LIST_PATH);
              }}
            />
            {params?.id ? (
              isEditing ? (
                <SubmitBtn
                  loading={submitting}
                  onClick={() => {
                    form.submit();
                  }}
                />
              ) : (
                <EditBtn loading={submitting} onClick={() => setIsEditing(true)} />
              )
            ) : (
              <SubmitBtn loading={submitting} onClick={() => form.submit()} />
            )}
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
          <Row>
            <Col md={24} lg={15}>
              <Row>
                <CreateProductBasicInfo
                  loading={loading}
                  isEditing={isEditing}
                  unitsData={unitsData}
                  form={form}
                  currencyValue={currencyValue}
                  setCurrencyValue={setCurrencyValue}
                />
              </Row>
              <Divider />
              <CreateProductDetailInfo
                loading={loading}
                isEditing={isEditing}
                overview={overview}
                detail={detail}
                specifications={specifications}
                suppliers={suppliers}
                form={form}
              />
            </Col>
            <Col md={0} lg={2}></Col>
            <Col md={24} lg={7}>
              <CreateProductMediaInfo
                isEditing={isEditing}
                loading={loading}
                treeValue={treeValue}
                checkedKeys={checkedKeys}
                setCheckedKeys={setCheckedKeys}
                form={form}
                image={image}
                subImage={subImage}
                setDirty={setDirty}
              />
            </Col>
          </Row>

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
                history.push(PATH.CAR_ACCESSORIES_ITEMS_LIST_PATH);
              }}
            />
          </Form.Item>
        </Form>
      </CardBody>
    </BCard>
  );
};

export default connect(null, {
  getItems: itemsActions.getItems,
  getUnits: unitActions.getUnits,
  createItem: itemsActions.createItem,
  updateItem: itemsActions.updateItem,
  getItemsDetail: itemsActions.getItemsDetail,
  getCategories: itemsActions.getCategories,
  getSuppliers: itemsActions.getSuppliers,
  getUser: authActions.getUser
})(InfoForm);
