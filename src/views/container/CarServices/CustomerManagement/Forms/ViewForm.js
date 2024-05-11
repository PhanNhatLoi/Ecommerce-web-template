import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Avatar, Col, Descriptions, Row, Skeleton } from 'antd/es';
import objectPath from 'object-path';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { DEFAULT_AVATAR } from '~/configs/default';
import { renderOrderStatus } from '~/configs/status/car-services/orderStatus';
import { appDataActions } from '~/state/ducks/appData';
import { customerActions } from '~/state/ducks/customer';
import { mechanicActions } from '~/state/ducks/mechanic';
import ViewOrderModal from '~/views/container/CarServices/OrderManagement/Modals/ViewModal';
import MapModal from '~/views/container/commons/MapModal';
import Divider from '~/views/presentation/divider';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormatNoFilter } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { API_URL } from '~/configs';
import { BasicBtn } from '~/views/presentation/ui/buttons';

const ViewForm = (props) => {
  const { t } = useTranslation();
  const [customerDetail, setCustomerDetail] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [mapModal, setMapModal] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('');
  const [orderCount, setOrderCount] = useState(0);
  const [viewOrderId, setViewOrderId] = useState(null);
  const [viewOrderModalShow, setViewOrderModalShow] = useState(false);
  const [fullAddress, setFullAddress] = useState('');

  // ----------------------------------
  // FOR ORDER TABLE STATISTIC
  // ----------------------------------
  useEffect(() => {
    if (Boolean(props.customerOrderId)) {
      setNeedLoadNewData(true);
      setPageLoading(true);
      // Get customer info
      props
        .getCustomerOrders({ requesterId: props.customerOrderId })
        .then((res) => {
          setOrderCount(parseInt(objectPath.get(res?.headers, 'x-total-count', 0)));
          setPageLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
          setPageLoading(false);
        });
    }
  }, [props.customerOrderId]);
  // ----------------------------------
  // GET CUSTOMER INFO
  // ----------------------------------
  useEffect(() => {
    if (Boolean(props.id)) {
      setNeedLoadNewData(true);
      setPageLoading(true);
      // Get customer info
      props
        .getCustomerDetail(props.id)
        .then((res) => {
          const address = res?.content?.address;
          const fullAddress = `${address?.address || ''} ${address?.fullAddress || ''}, ${address?.wards?.name || ''}, ${
            address?.district?.name || ''
          }, ${address?.province?.name || ''} ${address?.zipCode || ''}, ${address?.country?.nativeName || ''}`;

          setFullAddress(
            fullAddress
              .split(',')
              .map((segment) => segment.trim())
              .join(', ')
          );
          setCustomerDetail(res?.content);
          // for avatar
          setAvatarSrc(
            res?.content?.avatar && !res?.content?.avatar?.includes('http')
              ? firstImage(res?.content?.avatar)
              : res?.content?.avatar || DEFAULT_AVATAR
          );
          setPageLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
          setPageLoading(false);
        });
    }
  }, [props.id]);

  let columns = [
    {
      dataField: 'repairId',
      text: t('order_id'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewOrderId(cell);
              setViewOrderModalShow(true);
            }}>
            {cell}
          </AButton>
        );
      }
    },
    {
      dataField: 'repairId',
      text: t('request_id'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewOrderId(cell);
              setViewOrderModalShow(true);
            }}>
            {cell}
          </AButton>
        );
      }
    },
    {
      dataField: 'totalPrice',
      text: t('amount'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell) => {
        return cell ? numberFormatDecimal(+cell, ' đ', '') : '-';
      }
    },
    {
      dataField: 'createdDate',
      text: t('created_date'),
      sort: false,
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateLocal(cell)}</span>;
      },
      csvFormatter: (cell) => {
        return cell ? firstImage(cell) : API_URL + DEFAULT_AVATAR;
      }
    },
    {
      dataField: 'lastModifiedDate',
      text: t('updated_date'),
      headerStyle: {
        textAlign: 'center'
      },
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateLocal(cell)}</span>;
      }
    },
    {
      dataField: 'uiStatus',
      text: t('status'),
      headerStyle: {
        textAlign: 'center'
      },
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderOrderStatus(cell, t(cell), 'tag')}</div>;
      }
    }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------
  columns = columns.map((column) => {
    return {
      editable: false,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormatNoFilter,
      style: {
        minWidth: 148
      },
      align: column.align,
      headerAlign: column.align,
      footerAlign: column.align,
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  return (
    <>
      <Skeleton loading={pageLoading} active>
        <div className="d-flex flex-wrap">
          {(customerDetail?.avatar || '').includes('http') ? (
            <Avatar
              size={124}
              className="mr-5 mb-3 mb-lg-0"
              preview={{
                mask: <EyeOutlined />
              }}
              width={32}
              src={avatarSrc}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <AuthAvatar
              size={124}
              className="mr-5 mb-3 mb-lg-0"
              preview={{
                mask: <EyeOutlined />
              }}
              width={32}
              isAuth={true}
              src={avatarSrc}
              // onClick={(e) => e.stopPropagation()}
            />
          )}
          <div className="d-flex flex-column justify-content-center">
            <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={2}>
              <span style={{ fontWeight: '500' }}>{customerDetail?.fullName || '-'}</span>
            </ATypography>
            <div className="d-flex align-items-center">
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={1} className="text-muted pr-5" style={{ fontSize: '14px' }}>
                {customerDetail?.phone ? formatPhoneWithCountryCode(customerDetail?.phone, customerDetail?.country?.code) : '-'}
              </ATypography>
            </div>
          </div>
        </div>
      </Skeleton>

      <Divider />

      <Skeleton loading={pageLoading} active>
        <Row>
          <Col span={24}>
            <AlignedDescription
              column={1}
              labelStyle={{ color: 'rgba(0,0,0,0.5)', width: '150px', verticalAlign: 'top' }}
              colon={false}
              bordered>
              <Descriptions.Item label="Email:">{customerDetail?.email ? customerDetail?.email : '-'}</Descriptions.Item>
              <Descriptions.Item label={`${t('address')}:`}>
                {fullAddress ? (
                  <>
                    {fullAddress || '-'} <br />
                    <AButton className="pl-0" type="link" onClick={() => setMapModal(true)}>
                      {t('view_full_map')}
                    </AButton>
                  </>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
            </AlignedDescription>
          </Col>
        </Row>
      </Skeleton>

      <TableBootstrapHook
        className="mt-5"
        fetchAll
        title={null}
        description={null}
        notSupportToggle
        columns={columns}
        selectField="orderId"
        params={{ requesterId: props.customerOrderId, sort: 'lastModifiedDate,desc' }}
        getStatistic={props.getRepairStatistic} // for statistic API
        statisticProps={{
          mockData: {
            order: orderCount
          },
          name: 'Customer',
          key: 'memberStatus',
          valueSet: {
            // to map params with each filter button
            total: 'ALL',
            canceled: 'CANCELED',
            repaired: 'REPAIRED',
            repairing: 'REPAIRING'
          }
        }}
        searchPlaceholder={t('mechanic_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getCustomerOrders}
        buttons={[]}></TableBootstrapHook>

      <Divider />
      <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
        <BasicBtn size="large" type="ghost" onClick={props.onCancel} icon={<CloseOutlined />} title={props.cancelText || t('close')} />
      </div>

      <MapModal //
        title={t('customer_detail')}
        description={t('customer_detail_des')}
        modalShow={mapModal}
        setModalShow={setMapModal}
        address={customerDetail?.address?.fullAddress}
      />

      <ViewOrderModal //
        id={viewOrderId}
        modalShow={viewOrderModalShow}
        setModalShow={setViewOrderModalShow}
      />
    </>
  );
};

export default connect(
  (state) => ({
    user: state['authUser'].user
  }),
  {
    getCustomerDetail: customerActions.getCustomerDetail,
    getCarInfo: appDataActions.getCarInfo,
    getRequestMechanic: mechanicActions.getRequestMechanic,
    getRepairStatistic: mechanicActions.getRepairStatistic,
    getCustomerOrders: customerActions.getCustomerOrders
  }
)(ViewForm);
