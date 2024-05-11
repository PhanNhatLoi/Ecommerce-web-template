import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { authActions, authSelectors } from '~/state/ducks/authUser';
import { DeliveryBodyResponse } from '~/state/ducks/carAccessories/deliveryOrders/actions';
import { orderActions } from '~/state/ducks/carAccessories/order';
import { tradingProductActions } from '~/state/ducks/carAccessories/ProductTrading';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import LayoutForm from '~/views/presentation/layout/forForm';
import { SaveAndPrintBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import AuthFile from '~/views/presentation/ui/file/AuthFile';
import AntTable from '~/views/presentation/ui/table/AntTable';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import * as Types from '../Type';

const InputStyled = styled.div`
  align-content: space-between;
  .top-content {
    width: 100%;
    border-bottom: 1px solid;
    font-size: 12px;
    margin: 15px 0 10px 0;
    padding: 5px;
  }
  .text-area {
    border: 1px solid;
    border-radius: 7px;
    padding: 5px;
    min-height: 100px;
  }
`;

export const ViewForm = (props: Props) => {
  const { t }: any = useTranslation();
  const [companyInfor, setCompanyInfor] = useState<Types.companyInforType>();
  const [tradingProducts, setTradingProducts] = useState([]);
  const [orderCode, setOrderCode] = useState<String>();

  const Sign = (props: { role: string }) => {
    return (
      <div>
        <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
          {t(props.role)}
        </ATypography>
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} type="secondary">
          {t('signature')}
        </ATypography>
        <div style={{ borderBottom: '3px dotted #b5b5c3', height: 20 }}></div>
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} type="secondary">
          {t('full_name')}
        </ATypography>
        <div style={{ borderBottom: '3px dotted #b5b5c3', height: 20 }}></div>
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} type="secondary">
          {t('Date')}
        </ATypography>
        <div style={{ borderBottom: '3px dotted #b5b5c3', height: 20 }}></div>
      </div>
    );
  };

  useEffect(() => {
    props
      .getUser()
      .then((res) => {
        const response = res?.content;
        const formatPhone = response?.phone
          ? formatPhoneWithCountryCode(
              response?.phone,
              response?.phone?.startsWith('84') ? 'VN' : response?.phone?.startsWith('1') ? 'US' : 'VN'
            )
          : '';

        setCompanyInfor({ ...res?.content, phone: formatPhone });
      })
      .catch((err) => {
        console.error(err);
      });
    props
      .getTradingProducts()
      .then((res) => {
        setTradingProducts(res.content);
      })
      .catch((err) => {
        console.error(err);
      });
    props
      .getOderDetail(props?.data?.orderId)
      .then((res) => {
        setOrderCode(res.content.code);
      })
      .catch((err) => console.error(err));
  }, []);

  const columns = [
    {
      title: t('product_name'),
      dataIndex: 'productName',
      width: '180px',
      align: 'center'
    },
    {
      title: t('item_code'),
      dataIndex: 'tradingProductId',
      width: '180px',
      align: 'center',
      render: (cell) => {
        const itemcode: any = tradingProducts.find((f: any) => Number(f.id) === cell);
        return itemcode ? <span>{itemcode.itemCode}</span> : '-';
      }
    },
    {
      title: t('unit'),
      dataIndex: 'unit',
      align: 'center',
      width: '180px'
    },

    {
      title: t('quantity_order'),
      dataIndex: 'orderedQuantity',
      width: '180px',
      align: 'center'
    },
    {
      title: t('quantity_real'),
      dataIndex: 'deliveriedQuantity',
      width: '180px',
      align: 'center'
    },
    {
      title: t('variance'),
      width: '180px',
      align: 'center',
      render(cell, row) {
        return row.orderedQuantity && row.orderedQuantity ? Math.abs(row.orderedQuantity - row.deliveriedQuantity) : '-';
      }
    },
    {
      title: t('note'),
      dataIndex: 'note',
      width: '280px',
      align: 'center'
    }
  ];

  const columnsNew = columns.map((column) => {
    return {
      headerClasses: 'ht-custom-header-table',
      headerStyle: {
        textAlign: 'center'
      },
      render: (cell, row) => {
        return cell ? <span>{cell}</span> : '-';
      },
      ...column
    };
  });

  return (
    <HOC>
      <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5} style={{ textAlign: 'center' }}>
        {t('GOODS_DELIVERY_NOTE')}
      </ATypography>
      <LayoutForm title={t('license_code')} description={t('license_code_des')}>
        <div className="row justify-content-end">
          <div className="right-content col-8 col-lg-4 col-md-4">
            <InputStyled>
              <div>{t('date')}</div>
              <div className="top-content">{UtilDate.toDateLocal(props?.data?.createdDate)}</div>
              <div>{t('gdn_no')}</div>
              <div className="top-content">{props?.data?.gdnNo}</div>
              <div>{t('so_no')}</div>
              <div className="top-content">{orderCode}</div>
            </InputStyled>
          </div>
        </div>
      </LayoutForm>
      <LayoutForm data-aos="fade-right" data-aos-delay="300" title={t('delivery_infomation')} description={t('delivery_infomation_des')}>
        <div className="row">
          <div className="delivery-content col-lg-6 col-md-6">
            <div className="p-2" style={{ border: '1px solid', height: '100%' }}>
              <Divider orientation="left">{t('delivery_from')}</Divider>
              <div className="row p-5">
                <div className="col-12 mb-20">
                  <div className="row">
                    <div className="col-12">
                      <span>{t('company')} </span>
                      <span style={{ fontSize: '17px' }}>{companyInfor?.fullName}</span>
                      <p />
                      <span>
                        {t('address')} : {companyInfor?.address?.fullAddress}
                      </span>
                      <p />
                      <span>
                        {t('phone_number')} : {companyInfor?.phone}
                      </span>
                      <p />
                    </div>
                  </div>
                </div>
                <InputStyled className="col-12">
                  <div className="row">
                    <div className="col-12 col-sm-6">
                      <div>{t('deliver')}</div>
                      <div className="top-content">{props?.data?.deliveryFrom?.deliver}</div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div>{t('vehicle')}</div>
                      <div className="top-content">{props?.data?.deliveryFrom?.vehicleFrom || t('no_data')}</div>
                    </div>
                  </div>
                </InputStyled>
                <InputStyled className="col-12">
                  <div className="row">
                    <div className="col-12 col-sm-6">
                      <div>{t('phone_number')}</div>
                      <div className="top-content">
                        {props?.data?.deliveryFrom?.phoneNumberDeliver
                          ? formatPhoneWithCountryCode(
                              props?.data?.deliveryFrom?.phoneNumberDeliver,
                              props?.data?.deliveryFrom?.phoneNumberDeliver?.startsWith('84')
                                ? 'VN'
                                : props?.data?.deliveryFrom?.phoneNumberDeliver?.startsWith('1')
                                ? 'US'
                                : 'VN'
                            )
                          : ''}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div>{t('email')}</div>
                      <div className="top-content">{props?.data?.deliveryFrom?.emailFrom || t('no_data')}</div>
                    </div>
                  </div>
                </InputStyled>
              </div>
            </div>
          </div>
          <div className="delivery-content col-lg-6 col-md-6 mt-lg-0 mt-1">
            <div className="p-2" style={{ border: '1px solid', height: '100%' }}>
              <Divider orientation="left">{t('delivery_to')}</Divider>
              <div className="row p-5">
                <InputStyled className="col-12">
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <div>{t('customer_name')}</div>
                      <div className="top-content">{props?.data?.deliveryTo?.customer?.fullName}</div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div>{t('customer_code')}</div>
                      <div className="top-content">{props?.data?.deliveryTo?.customer?.code}</div>
                    </div>
                  </div>
                </InputStyled>
                <InputStyled className="col-12 pt-15 pb-15">
                  <div>{t('address')}</div>
                  <div className="top-content">{props?.data?.deliveryTo?.fullAddress}</div>
                </InputStyled>
                <InputStyled className="col-12">
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <div>{t('phone_number')}</div>
                      <div className="top-content">
                        {props?.data?.deliveryTo?.phoneNumberTo
                          ? formatPhoneWithCountryCode(
                              props?.data?.deliveryTo?.phoneNumberTo,
                              props?.data?.deliveryTo?.phoneNumberTo?.startsWith('84')
                                ? 'VN'
                                : props?.data?.deliveryTo?.phoneNumberTo?.startsWith('1')
                                ? 'US'
                                : 'VN'
                            )
                          : ''}
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div>{t('email')}</div>
                      <div className="top-content">{props?.data?.deliveryTo?.emailTo || t('no_data')}</div>
                    </div>
                  </div>
                </InputStyled>
              </div>
            </div>
          </div>
        </div>
      </LayoutForm>
      <Divider />
      <div>
        <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
          {t('table_delivery')}
        </ATypography>
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} type="secondary">
          {t('table_delivery_des')}
        </ATypography>
        <AntTable columns={columnsNew} data={props?.data?.deliveryDetails || []} />
      </div>
      <Divider />
      <div className="d-print-none">
        <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
          {t('note_delivery')}
        </ATypography>
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} type="secondary">
          {t('note_delivery_des')}
        </ATypography>
      </div>
      <div className="row">
        <div className="d-print-none col-3">{t('license')}</div>
        <div className="d-print-none col-9">
          {props?.data?.media ? (
            <AuthFile isAuth src={firstImage(props?.data?.media)}>
              {t('license_file')}
            </AuthFile>
          ) : (
            t('no_license_file')
          )}
          <Divider />
        </div>
      </div>
      <InputStyled className="row">
        <div className="col-3">{t('note')}</div>
        <div className="col-6 text-area">{props?.data?.note}</div>
      </InputStyled>
      <Divider />
      <div className="d-print-block d-none">
        <div className="row sign">
          <div className="col-4">
            <Sign role="delivery_creator" />
          </div>
          <div className="col-2"></div>
          <div className="col-3">
            <Sign role="deliver" />
          </div>
          <div className="col-3">
            <Sign role="receiver" />
          </div>
        </div>
      </div>
      <div className="d-print-none">
        <SaveAndPrintBtn
          label="print"
          onClick={() => {
            window.print();
          }}
        />
      </div>
    </HOC>
  );
};

type Props = {
  getAuthUser: any;
  getUser: any;
  getTradingProducts: any;
  getOderDetail: any;
  data?: DeliveryBodyResponse;
};

export default connect(
  (state: any) => ({
    getAuthUser: authSelectors.getAuthUser(state)
  }),
  {
    getUser: authActions.getUser,
    getTradingProducts: tradingProductActions.getTradingProductList,
    getOderDetail: orderActions.getOrderDetail
  }
)(ViewForm);
