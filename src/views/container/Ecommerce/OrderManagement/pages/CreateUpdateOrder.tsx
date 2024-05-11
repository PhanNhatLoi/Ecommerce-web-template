import { Col, Form, Skeleton } from 'antd/es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt, useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useBeforeUnload, useWindowSize } from 'react-use';
import { CUSTOMER_BUSINESS_TYPE } from '~/configs';
import * as PATH from '~/configs/routesConfig';
import { SALE_ORDER_STATUS, SALE_ORDER_STATUS_RES, STATUS_ORDER } from '~/configs/status/car-accessories/saleOrderStatus';
import { CUSTOMER_STATUS } from '~/configs/status/car-services/customerStatus';
import { orderActions } from '~/state/ducks/carAccessories/order';
import { customerActions } from '~/state/ducks/customer';
import { promotionActions } from '~/state/ducks/promotion';
import { tradingProductActions } from '~/state/ducks/tradingProduct';
import { unitActions } from '~/state/ducks/units';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import { MInput } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import { BackBtn, CancelBtn, EditBtn, ResetBtn, SaveAndPrintBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card as Card, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { UtilDate } from '~/views/utilities/helpers';

import CustomerInfo from '../components/CustomerInfo';
import OrderInfo from '../components/OrderInfo';
import OrderProgress from '../components/OrderProgress';
import PaymentInfo from '../components/PaymentInfo';
import ProductTable from '../components/ProductTable';
import ProductTableView from '../components/ProductTableView';
import PrintModal from '../Modals/PrintModal';
import WarningModal from '../Modals/WarningModal';
import { AddressNeedLoadType, Customer, CustomerInfoOrderDetail, OrderInfoDetail, PAYMENT_TYPE } from '../Types';

interface OrderPageProps {
  createSaleOrder: any;
  updateSaleOrder: any;
  getOrderDetail: any;
  getCustomers: any;
  getCustomerDetail: any;
  getTradingProduct: any;
  getUnits: any;
  updateStatusSaleOrder: any;
  getPromotions: any;
}

const OrderPage: React.FC<OrderPageProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const [submitting, setSubmitting] = useState<Boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [dirty, setdirty] = useState(false);
  const { width, height } = useWindowSize();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [dataOrder, setDataOrder] = useState<Array<any>>();
  const [dataInit, setdataInit] = useState<Array<any>>([{ key: 1 }]);
  const [dataTableView, setDataTableView] = useState<Array<any>>();
  const [pageLoading, setPageLoading] = useState(false);
  const [dataPayment, setDataPaymet] = useState<String>(PAYMENT_TYPE.TYPE_SUCCESS);
  const [shippingAddressId, setShippingAddressId] = useState<String>();
  const [addressNeedLoad, setAddressNeedLoad] = useState<AddressNeedLoadType>();
  const [customerInfoByOrderDetail, setCustomerInfoByOrderDetail] = useState<CustomerInfoOrderDetail>();
  const [customerInfoByProfileId, setCustomerInfoByProfileId] = useState<Customer>();
  const [customerList, setCustomerList] = useState<Array<Customer>>();
  const [tradingProducts, setTradingProducts] = useState<any>(undefined);
  const [units, setUnits] = useState<any>(undefined);
  const [printModalShow, setPrintModalShow] = useState<Boolean>(false);

  const [orderStatus, setOrderStatus] = useState<String>(STATUS_ORDER[0]);
  const [showNote, setShowNote] = useState<Boolean>(false);
  const [notAllowEditInfo, setNotAllowEditInfo] = useState<Boolean>(false);
  const [orderCreateOnApp, setOrderCreateOnApp] = useState<Boolean>(false);
  //Những trạng thái có thể khi tạo mới 1 đơn hàng
  const [actionValid, setActionValid] = useState([
    SALE_ORDER_STATUS.WAITING,
    SALE_ORDER_STATUS.ACCEPTED,
    SALE_ORDER_STATUS.PACKAGED,
    SALE_ORDER_STATUS.SHIPPING,
    // SALE_ORDER_STATUS.DELIVERED
    SALE_ORDER_STATUS.DONE
  ]);
  const [orderInfoDetail, setOrderInfoDetail] = useState<OrderInfoDetail>();
  const [disableEdit, setDisableEdit] = useState<Boolean>(false);
  const id = new URLSearchParams(location.search).get('id');
  const [viewPage, setViewPage] = useState<Boolean>(false);
  const [refeshCustomer, setRefeshCustomer] = useState<boolean>(true);
  const [couponCodeList, setCouponCodeList] = useState<any>([]);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [promotionDiscount, setPromotionDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  useBeforeUnload(dirty, t('leave_confirm'));

  function onValuesChange(value) {
    setdirty(true);

    if (!isNaN(value.shippingFee)) setShippingFee(value.shippingFee);
  }

  function leaveConfirm() {
    if (!dirty) setdirty(false);
  }

  function resetField() {
    form.resetFields();
    setdataInit([]);
    setDataPaymet(PAYMENT_TYPE.TYPE_SUCCESS);
    setShippingFee(0);
    setSubtotal(0);
    setTotal(0);
  }

  function isUpdatePage(): Boolean {
    return location.pathname === PATH.CAR_ACCESSORIES_UPDATE_SALES_ORDERS_PATH && id ? true : false;
  }

  function isViewPage(): Boolean {
    return location.pathname === PATH.CAR_ACCESSORIES_VIEW_SALES_ORDERS_PATH && id ? true : false;
  }

  /**
   * @param {string} profileId Profile ID
   * @returns {void} Set thông tin khách hàng vào customerInfo
   */
  function fetchAndSetCustomerInfo(profileId: String): void {
    props
      .getCustomerDetail(profileId)
      .then((res) => {
        const info = res.content;
        setShippingAddressId(info.address?.id);
        setCustomerInfoByProfileId(info);
      })
      .catch((err) => {
        console.error('🚀 ~ file: CustomerInfo.tsx ~ line 43 ~ getCustomerInfo ~ err', err);
      });
  }

  function handleSelectStatus(value: string): void {
    if (value === SALE_ORDER_STATUS.REJECTED) setShowNote(true);
    else setShowNote(false);
    setOrderStatus(value);
  }

  function updateSaleOrderStatus(payload: { id: String; status: String; note?: String }, msg: String) {
    props
      .updateStatusSaleOrder(payload)
      .then((_: unknown) => {
        setSubmitting(false);
        resetField();
        AMessage.success(t(`${msg}`));
        setdirty(false);
        history.push(PATH.CAR_ACCESSORIES_SALES_ORDERS_PATH);
      })
      .catch((err: any): void => {
        console.error('🚀 ~ file: UpdateOrder.tsx ~ line 218 ~ cập nhật trạng thái không thành công ~ err', err);
        setSubmitting(false);
        AMessage.error(err.message);
      });
  }

  /**
   * @param {string} status Trạng thái của đơn hàng hiện tại
   * @returns {Array<string>} Những trạng mà đơn hàng có thể cập nhật
   */
  function getActionListByStatus(status: string): Array<string> {
    const action = {
      WAITING: [
        SALE_ORDER_STATUS.ACCEPTED,
        SALE_ORDER_STATUS.REJECTED
        // SALE_ORDER_STATUS.PACKAGED,
        // SALE_ORDER_STATUS.SHIPPING,
        // SALE_ORDER_STATUS.DELIVERED,
        // SALE_ORDER_STATUS.DONE
      ],
      PAYMENT_RECEIVED_BY_ECARAID: [
        SALE_ORDER_STATUS.ACCEPTED,
        SALE_ORDER_STATUS.REJECTED
        // SALE_ORDER_STATUS.PACKAGED,
        // SALE_ORDER_STATUS.SHIPPING,
        // SALE_ORDER_STATUS.DELIVERED,
        // SALE_ORDER_STATUS.DONE
      ],
      ACCEPTED_BY_VENDOR: [
        // SALE_ORDER_STATUS.ACCEPTED,
        // SALE_ORDER_STATUS.REJECTED,
        SALE_ORDER_STATUS.PACKAGED
        // SALE_ORDER_STATUS.SHIPPING,
        // SALE_ORDER_STATUS.DELIVERED,
        // SALE_ORDER_STATUS.DONE
      ],
      ACCEPTED: [
        SALE_ORDER_STATUS.PACKAGED
        // SALE_ORDER_STATUS.SHIPPING, SALE_ORDER_STATUS.DELIVERED, SALE_ORDER_STATUS.DONE
      ],
      REJECTED: [],
      DONE: []
      // PACKAGED: [SALE_ORDER_STATUS.SHIPPING, SALE_ORDER_STATUS.DELIVERED, SALE_ORDER_STATUS.DONE],
      // SHIPPING: [SALE_ORDER_STATUS.DELIVERED, SALE_ORDER_STATUS.DONE],
      // DELIVERED: [SALE_ORDER_STATUS.DONE]
    };

    return action[status];
  }

  /**
   * @param {string} status trạng thái của đơn hàng
   * @returns {void} Chuyển hướng trang với những trạng thái không được cập nhât, disable nút chỉnh sửa, disable chỉnh sửa thông tin
   */
  function handleActionInvalid(status: string): void {
    //các trạng thái không được bấm nút edit: DONE, REJECTED, CANCELED, DELETED, PACKAGED, VIETTEL_POST_PENDING, SHIPPING
    const disableEditStatus = [
      SALE_ORDER_STATUS.REJECTED,
      SALE_ORDER_STATUS.CANCELED,
      SALE_ORDER_STATUS.VIETTEL_POST_PENDING,
      SALE_ORDER_STATUS.PACKAGED,
      SALE_ORDER_STATUS.SHIPPING,
      SALE_ORDER_STATUS.DONE,
      SALE_ORDER_STATUS.DELETED
    ];
    if (disableEditStatus.includes(status) && isUpdatePage()) history.push(PATH.CAR_ACCESSORIES_SALES_ORDERS_PATH);

    disableEditStatus.includes(status) && setDisableEdit(true);

    // Được chỉnh sửa trạng thái nhưng không được chỉnh sửa thông tin:Shipping, Delivered, DONE, CANCELED
    // const notAllowEditInfoStatus = [
    // SALE_ORDER_STATUS.SHIPPING,
    // SALE_ORDER_STATUS.DELIVERED
    // SALE_ORDER_STATUS.DONE,
    // SALE_ORDER_STATUS.CANCELED
    // ];
    // notAllowEditInfoStatus.includes(status) && setNotAllowEditInfo(true);
  }

  function getDataProductTable(saleOrderDetail: any) {
    const products = saleOrderDetail?.orderDetails?.map((item) => {
      const tradingProductId = item.tradingProductCache.id;
      const tradingProduct = tradingProducts.find((item) => item.id === Number(tradingProductId));
      const unitInfo = units.find((f: any) => f.id === tradingProduct?.unitId) as any;

      return {
        tradingProductId,
        discount: item.discount,
        unit: unitInfo?.name || '-',
        quantityOrder: item.quantity,
        price: item.unitPrice,
        subtotal: item.total
      };
    });
    return products;
  }
  //get trading product list && units list && coupon list
  useEffect(() => {
    props
      .getTradingProduct({ size: 99999 })
      .then((res) => {
        setTradingProducts(res?.content);
      })
      .catch((ex) => console.error(ex));

    props
      .getUnits({ size: 99999 })
      .then((res) => setUnits(res?.content))
      .catch((err) => console.error('err effect line 22', err));

    props
      .getPromotions({ size: 99999, promotionType: 'COUPON_DISCOUNT', sort: 'createdDate,desc' })
      .then((res) => {
        // const response = res?.content?.filter((value) => moment().isBefore(value?.endDate));
        const couponList = res?.content?.reduce((acc, item) => {
          if (item.coupons.length > 0) {
            acc.push(item.coupons[0]);
          }
          return acc;
        }, []);
        setCouponCodeList(couponList);
      })
      .catch((err) => console.error('err effect line 22', err));
  }, []);

  // get Customer List
  useEffect(() => {
    if (refeshCustomer) {
      setRefeshCustomer(false);
      props
        .getCustomers({ size: 100000, businessType: CUSTOMER_BUSINESS_TYPE.SUPPLIER })
        .then((res: any) => {
          const data: Array<Customer> = res.content?.filter((item: Customer) => item.status === CUSTOMER_STATUS.SUCCESS);
          setCustomerList(data);
        })
        .catch((err: any) => console.error(err));
    }
  }, [refeshCustomer]);

  //isViewPage();
  useEffect(() => {
    if (isViewPage()) setViewPage(true);
  }, [id]);

  // fetch data when page is updatePage or viewPage
  useEffect(() => {
    if (isUpdatePage() || isViewPage()) {
      setPageLoading(true);
      props
        .getOrderDetail(id)
        .then((res) => {
          const saleOrderDetail = res?.content;
          const stt: string = saleOrderDetail.status;
          const auditInfo = saleOrderDetail?.audit;
          const actionList = getActionListByStatus(stt);
          setOrderCreateOnApp(saleOrderDetail.buyerId ? true : false);
          setActionValid(actionList);
          handleActionInvalid(stt);
          setCurrentStep(
            auditInfo?.doneDate
              ? 4
              : auditInfo?.shippingDate
              ? 3
              : auditInfo?.packagedDate
              ? 2
              : auditInfo?.acceptedDate || auditInfo?.rejectedDate
              ? 1
              : 0
          );
          setSubtotal(saleOrderDetail.subTotal);
          // setTotal(saleOrderDetail.total);

          setOrderStatus(stt);

          setShippingAddressId(saleOrderDetail.shippingAddressId);
          setDataPaymet(saleOrderDetail.paymentGateway || 'CASH');
          setCustomerInfoByOrderDetail({
            addressInfo: saleOrderDetail.shippingAddress,
            customerName: saleOrderDetail.shippingAddress?.fullName,
            buyerProfileId: saleOrderDetail.buyerProfileId
          });
          fetchAndSetCustomerInfo(saleOrderDetail.buyerProfileId);
          // fill data for table trading product
          if (tradingProducts.length && units.length) {
            const tableProduct = getDataProductTable(saleOrderDetail);
            setdataInit(tableProduct);

            setDataTableView(tableProduct);
          }

          let newStatus = '';
          if (saleOrderDetail.status !== SALE_ORDER_STATUS.PAYMENT_RECEIVED_BY_ECARAID) newStatus = saleOrderDetail.status;
          else {
            newStatus =
              saleOrderDetail.paymentGateway === 'CASH' ? SALE_ORDER_STATUS.WAITING : SALE_ORDER_STATUS.PAYMENT_RECEIVED_BY_ECARAID;
          }

          // data for order info component
          setOrderInfoDetail({
            orderCode: saleOrderDetail.code,
            orderTime: UtilDate.toDateTimeLocal(saleOrderDetail.createdDate),
            status: t(SALE_ORDER_STATUS_RES[newStatus]),
            statusRes: saleOrderDetail.status,
            note: saleOrderDetail.note ? (saleOrderDetail.note === 'undefined' ? '-' : saleOrderDetail.note) : '-',
            cancelReason: saleOrderDetail.cancelReason || '-',
            paymentTime: UtilDate.toDateTimeLocal(saleOrderDetail.audit.paymentDate) || '-',
            shipTime: UtilDate.toDateTimeLocal(saleOrderDetail.audit.shippingDate) || '-',
            doneTime: UtilDate.toDateTimeLocal(saleOrderDetail.audit.doneDate) || '-'
          });
          setPromotionDiscount(saleOrderDetail?.invoiceDiscount || 0);
          setCouponDiscount(saleOrderDetail?.couponDiscount || 0);
          // setDiscountPrice(saleOrderDetail?.discount); // enhance later
          setShippingFee(saleOrderDetail.shippingFee);
          // set value for status and fill customer data

          form.setFieldsValue({
            statusOrder: t(SALE_ORDER_STATUS_RES[newStatus]),
            couponCode: saleOrderDetail?.couponDiscountCache?.couponCode,
            shippingFee: saleOrderDetail.shippingFee
          });

          if (moment().diff(saleOrderDetail.audit.acceptedDate, 'days') >= 1 && [SALE_ORDER_STATUS.ACCEPTED].includes(stt) && isViewPage())
            setShowWarningModal(true);

          setPageLoading(false);
        })
        .catch((err) => {
          setdirty(false);

          console.error(err.message);
          // history.push(PATH.CAR_ACCESSORIES_SALES_ORDERS_PATH);
        });
    }

    if ((!isUpdatePage() === !isViewPage()) === !(location.pathname === PATH.CAR_ACCESSORIES_CREATE_SALES_ORDERS_PATH)) {
      setdirty(false);
      history.push(PATH.CAR_ACCESSORIES_SALES_ORDERS_PATH);
    }
  }, [id, tradingProducts, units]);

  //======== FORM ============//
  const handleSumitForm = (action: any, body, msg: String) => {
    const status =
      orderStatus === SALE_ORDER_STATUS.REJECTED ? 'reject' : orderStatus === SALE_ORDER_STATUS.ACCEPTED ? 'accept' : orderStatus;
    //nếu mua bằng app thì chỉ được cập nhật trạng thái không được cập nhật thông tin
    if (orderCreateOnApp && isUpdatePage()) {
      const idOrder = id?.toString();
      const payload: any = { status, id: idOrder, rejectNote: body.rejectNote || '' };
      if (orderStatus !== SALE_ORDER_STATUS.WAITING && orderStatus !== SALE_ORDER_STATUS.ACCEPTED_BY_VENDOR) {
        updateSaleOrderStatus(payload, msg);
      }
    } else {
      action(body)
        .then((res) => {
          const idOrder = isUpdatePage() ? id : res.content?.id;
          const payload = { status, id: idOrder, rejectNote: body.rejectNote || '' };
          // tạo xong update trạng thái hoặc update thông tin sau đó update trạng thái
          if (orderStatus !== SALE_ORDER_STATUS.WAITING && orderStatus !== SALE_ORDER_STATUS.ACCEPTED_BY_VENDOR)
            updateSaleOrderStatus(payload, msg);
          else {
            setSubmitting(false);
            resetField();
            AMessage.success(t(`${msg}`));
            setdirty(false);
            history.push(PATH.CAR_ACCESSORIES_SALES_ORDERS_PATH);
          }
        })
        .catch((err) => {
          console.error('🚀 ~ file: CreateUpdateOrder.tsx ~ line 231 ~ handleSumitForm ~ err', err);
          setSubmitting(false);
          AMessage.error(t(err.message));
        });
    }
  };

  const onFinish = (values) => {
    setSubmitting(true);

    const body: any = { ...values };
    const addressSplit = body?.address1?.split(' ');
    const newCouponCode = body?.couponCode;
    body.subTotal = subtotal || 0;
    body.total = total || 0;
    body.shippingMethodId = 1;
    body.shippingAddressId = shippingAddressId;
    body.paymentGateway = dataPayment;
    body.shippingFee = shippingFee || 0;
    body.couponCode = newCouponCode || undefined;

    body.customer = {
      id: Number(body.customerId),
      code: body.code,
      phone: body.phone,
      phoneNumber: body.phone,
      email: body.email,
      address1: body.address1,
      country1: body.country1,
      zipCode: body.zipCode,
      province: body.province,
      district: body.district,
      ward: body.ward,
      countryId: body.country1,
      address: {
        address: addressSplit[0], // house number
        districtId: body.district,
        fullAddress: addressSplit.slice(1).join(' '), // street name
        provinceId: body.province,
        wardsId: body.ward,
        countryId: body.country1,
        zipCode: body.zipCode || ''
      }
    };
    //get data from trading product table

    if (notAllowEditInfo || orderCreateOnApp) {
      const orderDetails = dataTableView?.map((item) => {
        return {
          productTradingId: item.tradingProductId,
          quantity: item.quantityOrder,
          discount: item.discount,
          unitPrice: item.price
        };
      });
      body.orderDetails = orderDetails;
    } else if (dataOrder && dataOrder.length > 0 && dataPayment) {
      const orderDetails = dataOrder.map((item) => {
        return {
          productTradingId: item.tradingProductId,
          quantity: item.quantityOrder,
          discount: item.discount,
          unitPrice: item.price
        };
      });
      body.orderDetails = orderDetails;
    } else {
      setSubmitting(false);
      AMessage.error(t('no_data_trading'));
    }

    isUpdatePage()
      ? handleSumitForm(props.updateSaleOrder, { ...body, id: Number(id) }, 'Update Success')
      : handleSumitForm(props.createSaleOrder, { ...body }, 'Create Success');
  };
  const onFinishFailed = (err) => {
    console.error('khangnguyen ~ file: CreateProductTrading.js ~ line 238 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  //======== FORM ============//
  return (
    <HOC>
      <Card>
        <CardHeader
          titleHeader={t('create_sales_orders')}
          btn={
            <div>
              <BackBtn
                onClick={() => {
                  leaveConfirm();
                  history.push(`${PATH.CAR_ACCESSORIES_SALES_ORDERS_PATH}`);
                }}
              />
              {/* disable nút edit nếu và page view và với những trạng thái không được edit */}
              {isViewPage() && disableEdit === false && (
                <EditBtn
                  onClick={() => {
                    history.push(`${PATH.CAR_ACCESSORIES_UPDATE_SALES_ORDERS_PATH}?id=${id}`);
                  }}
                />
              )}
              {isViewPage() && <SaveAndPrintBtn label="print" onClick={() => setPrintModalShow(true)} htmlType="button" />}
              {!isViewPage() && <SubmitBtn loading={submitting} onClick={() => form.submit()} />}
            </div>
          }></CardHeader>
        <CardBody>
          <Form //
            requiredMark={false}
            {...ANT_FORM_SEP_LABEL_LAYOUT}
            scrollToFirstError={{
              behavior: 'smooth',
              block: 'center',
              inline: 'center',
              scrollMode: 'always'
            }}
            onValuesChange={onValuesChange}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            <Prompt when={dirty} message={t('leave_confirm')} />
            <Skeleton loading={pageLoading} active>
              <OrderProgress width={width} status={orderStatus} currentStep={currentStep} />
              <Divider />
              {isViewPage() && <OrderInfo orderInfoDetail={orderInfoDetail} />}

              <CustomerInfo
                viewPage={viewPage}
                isUpdatePage={isUpdatePage}
                isViewPage={isViewPage}
                notAllowEditInfo={notAllowEditInfo}
                fetchAndSetCustomerInfo={fetchAndSetCustomerInfo}
                setRefeshCustomer={setRefeshCustomer}
                customerList={customerList}
                addressNeedLoad={addressNeedLoad}
                setAddressNeedLoad={setAddressNeedLoad}
                orderCreateOnApp={orderCreateOnApp}
                customerInfoByProfileId={customerInfoByProfileId}
                customerInfoByOrderDetail={customerInfoByOrderDetail}
                form={form}
              />

              <Divider />

              {isViewPage() || notAllowEditInfo || orderCreateOnApp ? (
                <ProductTableView data={dataTableView} />
              ) : (
                <ProductTable
                  viewPage={viewPage}
                  notAllowEditInfo={notAllowEditInfo}
                  setSubtotal={setSubtotal}
                  orderCreateOnApp={orderCreateOnApp}
                  dataInit={dataInit}
                  setdataInit={setdataInit}
                  data={[]}
                  setDataOrder={setDataOrder}
                  subtotal={subtotal}
                />
              )}

              <Divider />
              <PaymentInfo
                form={form}
                viewPage={viewPage}
                notAllowEditInfo={notAllowEditInfo}
                setDataPaymet={setDataPaymet}
                dataPayment={dataPayment}
                total={total}
                orderCreateOnApp={orderCreateOnApp}
                setTotal={setTotal}
                subtotal={subtotal}
                dataInit={dataInit}
                dataOrder={dataOrder}
                promotionDiscount={promotionDiscount}
                couponDiscount={couponDiscount}
                setCouponDiscount={setCouponDiscount}
                shippingFee={shippingFee}
                setShippingFee={setShippingFee}
                couponCodeList={couponCodeList}
              />
              <Divider />
              <Form.Item className="mt-5">
                <div className="d-flex flex-wrap justify-content-center align-items-end">
                  <>
                    <Col xs={12} sm={12} md={7} lg={7}>
                      {/* view page chỉ được xem */}
                      {isViewPage() && (
                        <MSelect
                          noLabel
                          labelAlign="left"
                          require
                          noPadding
                          name="statusOrder"
                          disabled
                          loading={false}
                          placeholder={t('select_status')}
                        />
                      )}
                      {/* page update và page create được select chỉ được xem */}
                      {!isViewPage() && (
                        <>
                          {/* check lại */}
                          <MSelect
                            noLabel
                            labelAlign="left"
                            require
                            noPadding
                            name="statusOrder"
                            onChange={handleSelectStatus}
                            options={actionValid?.map((status) => {
                              return {
                                // value: status === SALE_ORDER_STATUS.DONE ? SALE_ORDER_STATUS_FULFILLED : status,
                                value: status,
                                label: t(SALE_ORDER_STATUS_RES[status])
                              };
                            })}
                            loading={false}
                            placeholder={t('select_status')}
                          />
                          {showNote && (
                            <MInput
                              labelAlign="left"
                              placeholder={t('rejected_note')}
                              noLabel
                              noPadding
                              require={true}
                              controls={false}
                              name="rejectNote"
                            />
                          )}
                        </>
                      )}
                    </Col>
                  </>

                  {/* disable nút edit nếu và page view và với những trạng thái không được edit */}
                  {isViewPage() && disableEdit === false && (
                    <>
                      <EditBtn
                        onClick={() => {
                          history.push(`${PATH.CAR_ACCESSORIES_UPDATE_SALES_ORDERS_PATH}?id=${id}`);
                        }}
                      />
                    </>
                  )}

                  {isViewPage() && <SaveAndPrintBtn label="print" onClick={() => setPrintModalShow(true)} htmlType="button" />}

                  {isViewPage() && (
                    <BackBtn
                      onClick={() => {
                        leaveConfirm();
                        history.push(`${PATH.CAR_ACCESSORIES_SALES_ORDERS_PATH}`);
                      }}
                    />
                  )}

                  {!isViewPage() && (
                    <>
                      <SubmitBtn loading={submitting} />
                      <ResetBtn onClick={() => resetField()} />
                      <CancelBtn
                        onClick={() => {
                          leaveConfirm();
                          history.push(`${PATH.CAR_ACCESSORIES_SALES_ORDERS_PATH}`);
                        }}
                      />
                    </>
                  )}
                </div>
              </Form.Item>
            </Skeleton>
          </Form>
        </CardBody>

        <WarningModal modalShow={showWarningModal} setModalShow={setShowWarningModal}></WarningModal>

        <PrintModal orderId={id} modalShow={printModalShow} setModalShow={setPrintModalShow} />
      </Card>
    </HOC>
  );
};

export default connect(null, {
  createSaleOrder: orderActions.createSaleOrder,
  updateSaleOrder: orderActions.updateSaleOrder,
  getTradingProduct: tradingProductActions.getTradingProduct,
  getUnits: unitActions.getUnits,
  getOrderDetail: orderActions.getOrderDetail,
  getCustomers: customerActions.getCustomers,
  getCustomerDetail: customerActions.getCustomerDetail,
  updateStatusSaleOrder: orderActions.updateStatusSaleOrder,
  getPromotions: promotionActions.getPromotions
})(OrderPage);
