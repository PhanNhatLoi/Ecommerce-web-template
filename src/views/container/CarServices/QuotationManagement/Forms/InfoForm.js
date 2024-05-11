import { CloseCircleOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Col, Form, Row } from 'antd/es';
import { head, last } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { GUARANTEE_TYPE, TYPOGRAPHY_TYPE } from '~/configs';
import { DEFAULT_AVATAR } from '~/configs/default';
import { MECHANIC_STATUS } from '~/configs/status/car-services/mechanicStatus';
import { ACCEPT_VIDEO_AND_IMAGE_UPLOAD } from '~/configs/upload';
import { mechanicActions } from '~/state/ducks/mechanic';
import { quotationActions } from '~/state/ducks/mechanic/quotation';
import { requestActions } from '~/state/ducks/mechanic/request';
import Divider from '~/views/presentation/divider';
import MTextArea from '~/views/presentation/fields/input/TextArea';
import MSelect from '~/views/presentation/fields/Select';
import { MUpload } from '~/views/presentation/fields/upload';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import { AList, AListItem, AListItemMeta } from '~/views/presentation/ui/list/AList';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import QuotationList from '../components/QuotationList';
import PricingSystemModal from '../Modals/PricingSystemModal';
import { BasicBtn } from '~/views/presentation/ui/buttons';

const InfoForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [pageLoading, setPageLoading] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quotationMoreDisable, setQuotationMoreDisable] = useState(false);
  const [pricingSystemShow, setPricingSystemShow] = useState(false);
  // for onclick the add button in quotation item to get pricing system data
  const [currentItemKey, setCurrentItemKey] = useState(null);
  const [itemKeyFlag, setItemKeyFlag] = useState([]);

  useEffect(() => {
    if (props.id) {
      setPageLoading(true);
      props
        .getQuotationDetail(props.id)
        .then((res) => {
          const response = res?.content;
          setRequestList([{ id: response?.requestId, category: response?.requestName }]);
          form.setFieldsValue({
            helperUserId: response?.helperUserId,
            media: response?.media,
            description: response?.description,
            items: response?.items?.map((item) => ({
              ...item,
              guaranteeTime: item?.warrantyPolicy?.guaranteeTime,
              guaranteeKm: item?.warrantyPolicy?.guaranteeKm,
              guaranteeCheck: item?.warrantyPolicy?.guaranteeTime
                ? GUARANTEE_TYPE.GUARANTEE_TIME
                : item?.warrantyPolicy?.guaranteeTime
                ? GUARANTEE_TYPE.GUARANTEE_KM
                : GUARANTEE_TYPE.NONE_GUARANTEE
            }))
          });
          setMediaList(response?.media);
          setTotalPrice(response?.totalPrice);
          setPageLoading(false);
        })
        .catch((err) => {
          setPageLoading(false);
          console.error('chiendev ~ file: InfoForm.js:60 ~ useEffect ~ err', err);
        });
    } else {
      form.setFieldsValue({
        items: [
          {
            key: 0,
            name: '',
            price: 0,
            quantity: 0,
            origin: '',
            unit: '',
            guaranteeTime: 0,
            guaranteeKm: 0,
            guaranteeCheck: GUARANTEE_TYPE.NONE_GUARANTEE
          }
        ]
      });
      setQuotationMoreDisable(true);
    }
  }, [props.id]);

  const onFinish = (values) => {
    if (requestList.length === 0) {
      return AMessage.error(t('require_request'));
    }
    if (values.items && values.items.length > 0) {
      if (values.items.some((value) => value.price < 0 || value.quantity <= 0))
        return AMessage.error(props.isEditing ? t('update_quotation_failed') : t('create_quotation_failed'));
    }

    setSubmitting(true);

    Promise.all(
      requestList.map((request) => {
        const items = values.items.map((item) => ({
          key: item.key,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          origin: item.origin,
          unit: item.unit,
          warrantyPolicy: {
            guaranteeTime: item.guaranteeCheck === GUARANTEE_TYPE.GUARANTEE_TIME ? item.guaranteeTime : null,
            guaranteeKm: item.guaranteeCheck === GUARANTEE_TYPE.GUARANTEE_KM ? item.guaranteeKm : null
          }
        }));

        const body = {
          ...values,
          totalPrice,
          requestId: request?.id,
          id: props.id,
          items
        };
        return props.isEditing ? props.updateQuotation(body) : props.createQuotation(body);
      })
    )
      .then((res) => {
        AMessage.success(props.isEditing ? t('update_quotation_success') : t('create_quotation_success'));
        props.onCancel();
        setSubmitting(false);
        props.setNeedLoadNewData(true);
      })
      .catch((err) => {
        AMessage.error(t(err.message));
        setSubmitting(false);
      });
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  const onMediaListChange = (fileList) => {
    form.setFieldsValue({
      media: (fileList || []).map((file) => {
        return file;
      })
    });
  };

  const removeRequest = (id) => {
    const newRequestList = requestList.filter((request) => request?.id !== id);
    setRequestList(newRequestList);
  };

  const addRequest = (id) => {
    const requestIds = requestList.map((request) => request.id);
    if (id && !requestIds?.includes(id)) {
      setListLoading(true);
      props
        .getRequestDetail(id)
        .then((res) => {
          setRequestList([...requestList, res?.content]);
          setListLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
          setListLoading(false);
        });
    }
  };

  const onFormChange = (changeFields, allFields) => {
    const changeField = head(changeFields);
    switch (head(changeField?.name)) {
      case 'request':
        addRequest(changeField?.value);
        form.setFieldsValue({ request: '' });
        break;
      case 'items':
        const items = form.getFieldValue('items');
        form.setFieldsValue({
          items: items.map((item, i) => {
            return { key: i, ...item };
          })
        });
        const lastItem = last(items);
        setQuotationMoreDisable(items?.length > 0 && !Boolean(lastItem?.name && lastItem?.price && lastItem?.quantity));
        let _totalPrice = 0;
        items.forEach((item) => {
          if (Boolean(item?.price) && Boolean(item?.quantity)) {
            _totalPrice += +item?.price * +item?.quantity;
          }
        });
        setTotalPrice(_totalPrice);
        break;
      default:
        break;
    }
  };

  //------------------------------------
  // FOR FILL IN QUOTATION ITEM INFO
  //------------------------------------
  const fillInItem = (item) => {
    const itemFields = form.getFieldValue('items');
    let selectedItem = head(itemFields.filter((item) => item?.key === currentItemKey));
    const notSelectedItems = itemFields.filter((item) => item?.key !== currentItemKey);
    selectedItem = {
      name: item?.name,
      price: +item?.price,
      origin: item?.origin,
      unit: item?.unit,
      quantity: 1,
      guaranteeTime: +item?.warrantyPolicy?.guaranteeTime,
      guaranteeKm: +item?.warrantyPolicy?.guaranteeKm,
      guaranteeCheck: item?.warrantyPolicy?.guaranteeTime
        ? GUARANTEE_TYPE.GUARANTEE_TIME
        : item?.warrantyPolicy?.guaranteeKm
        ? GUARANTEE_TYPE.GUARANTEE_KM
        : GUARANTEE_TYPE.NONE_GUARANTEE
    };
    form.setFieldsValue({ items: [...notSelectedItems, selectedItem] });
    // update total price
    const items = form.getFieldValue('items');
    let _totalPrice = 0;
    items.forEach((item) => {
      _totalPrice += +item?.price * +item?.quantity;
    });
    setTotalPrice(_totalPrice);
    setPricingSystemShow(false);
    setQuotationMoreDisable(false);
    setItemKeyFlag(itemFields.map((item) => item.key));
  };
  //------------------------------------
  // FOR FILL IN QUOTATION ITEM INFO
  //------------------------------------

  return (
    <Form //
      requiredMark={false}
      {...ANT_FORM_SEP_LABEL_LAYOUT}
      form={form}
      onFinish={onFinish}
      onFieldsChange={onFormChange}
      onFinishFailed={onFinishFailed}>
      <Row>
        <Col md={24} lg={11}>
          <MSelect
            name="request"
            noLabel
            tooltip={{
              title: t('required_field'),
              icon: (
                <span>
                  (<ATypography type="danger">*</ATypography>)
                </span>
              )
            }}
            noPadding
            loading={pageLoading}
            label={t('select_request')}
            placeholder={t('search_request')}
            fetchData={props.getRequests}
            params={{
              isOrderByDistance: true,
              lng: '105.46792907927248', // Hard code vì chưa có API lẩy vị trí
              lat: '9.818933529749497' // Hard code vì chưa có API lẩy vị trí
            }}
            searchCorrectly={false}
            valueProperty="id"
            labelProperty="category"
          />

          <AList //
            style={{ maxHeight: 300, overflowY: 'scroll' }}
            className="mb-3"
            bordered
            loading={listLoading || pageLoading}
            dataSource={requestList}
            renderItem={(item) => (
              <AListItem key={item?.id}>
                <AListItemMeta //
                  avatar={<ATypography strong>{item?.id}</ATypography>}
                  title={<ATypography>{item?.category}</ATypography>}
                  description=""
                />
                <div>
                  <AButton type="link" onClick={() => removeRequest(item?.id)} icon={<CloseCircleOutlined style={{ color: '#000' }} />} />
                </div>
              </AListItem>
            )}
          />

          <MSelect
            name="helperUserId"
            noLabel
            loading={pageLoading}
            noPadding
            label={t('quotation_service_advisor')}
            placeholder={t('quotation_service_advisor_placeholder')}
            fetchData={props.getMechanics}
            searchCorrectly={false}
            valueProperty="userId"
            labelProperty="fullName"
            params={{ sort: 'lastModifiedDate,desc', status: MECHANIC_STATUS.APPROVED }}
            renderOptions={(option) => {
              let src = !option?.avatar?.includes('http') ? firstImage(option?.avatar) : option?.avatar || DEFAULT_AVATAR;
              return (
                <div className="d-flex align-items-center" style={{ lineHeight: 'initial' }}>
                  <span>
                    <AuthAvatar
                      className="mr-3"
                      preview={{
                        mask: <EyeOutlined />
                      }}
                      width={32}
                      size={32}
                      isAuth={true}
                      src={src}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </span>
                  <span>
                    <strong>{option?.fullName}</strong>
                    <br />
                    {formatPhoneWithCountryCode(option?.phone, option?.country?.code)}
                  </span>
                </div>
              );
            }}
            require
          />
          <Divider />
          <MUpload //
            noLabel
            noPadding
            accept={ACCEPT_VIDEO_AND_IMAGE_UPLOAD.join(', ')}
            fileList={mediaList}
            maximumUpload={100}
            maxCount={100}
            name="media"
            require={false}
            label={t('quotation_media')}
            onImageChange={onMediaListChange}
          />
          <MTextArea //
            loading={loading}
            noPadding
            noLabel
            rows={5}
            require={false}
            name="description"
            label={t('quotation_notes')}
          />
        </Col>

        <Col md={0} lg={1}></Col>

        <Col md={24} lg={12}>
          <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
            {t('quotation_details')}
          </ATypography>
          <div className="p-5" style={{ border: '1px solid #f1f1f1' }}>
            <QuotationList //
              moreItemDisabled={quotationMoreDisable}
              setPricingSystemShow={setPricingSystemShow}
              setCurrentItemKey={setCurrentItemKey}
              itemKeyFlag={itemKeyFlag}
              form={form}
            />
            <Divider />
            <div className="d-flex justify-content-between align-items-center">
              <ATypography>{t('total_fee')}:</ATypography>
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
                {numberFormatDecimal(+totalPrice, ' đ', '')}
              </ATypography>
            </div>
          </div>
        </Col>
      </Row>

      <Divider />
      <Form.Item>
        <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
          <BasicBtn size="large" htmlType="submit" loading={submitting} type="primary" icon={props.submitIcon} title={props.submitText} />
          <BasicBtn
            size="large"
            type="ghost"
            onClick={() => {
              form.resetFields();
              props.onCancel();
            }}
            icon={<CloseOutlined />}
            title={props.cancelText || t('close')}
          />
        </div>
      </Form.Item>

      <PricingSystemModal //
        form={form}
        modalShow={pricingSystemShow}
        setModalShow={setPricingSystemShow}
        fillInItem={fillInItem}
      />
    </Form>
  );
};

export default connect(null, {
  getMechanics: mechanicActions.getMechanics,
  createQuotation: quotationActions.createQuotation,
  getRequests: requestActions.getRequests,
  getRequestDetail: requestActions.getRequestDetail,
  getQuotationDetail: quotationActions.getQuotationDetail,
  updateQuotation: quotationActions.updateQuotation
})(InfoForm);
