import { Empty } from 'antd/es';
import objectPath from 'object-path';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import SVG from 'react-inlinesvg';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { EVENT_TYPE } from '~/configs';
import { BUSINESS_TYPES } from '~/configs/const';
import * as PATH from '~/configs/routesConfig';
import { authActions, authSelectors } from '~/state/ducks/authUser';
import { setReadNotification } from '~/state/ducks/authUser/actions';
import store from '~/state/store';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import { UtilDate } from '~/views/utilities/helpers';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
};

const NotificationItemStyled = styled.div<{ isHovered: boolean }>`
  &:hover {
    background-color: rgba(246, 246, 246, 0.5);
  }
`;

type NotificationInfoProps = {
  getNotificationUnreadQuantity: any; // redux
  getAccessNotification: any; // redux
  getNotiUnreadQuantity: any;
  getNotificationList: any;
  readNotification: any;
  getAuthUser: any;
};

const NotificationInfo: React.FC<NotificationInfoProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isAccessNotificationCenter()) {
      props.getNotiUnreadQuantity({ group: 'ORDER' });
      loadMoreData();
    }
  }, []);

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  const loadMoreData = () => {
    setLoading(true);
    props
      .getNotificationList({ group: 'ORDER', size: 20, page: currentPage })
      .then((res: any) => {
        const finalData = [...data, ...res?.content];
        setData(finalData);
        setTotalItems(parseInt(objectPath.get(res?.headers, 'x-total-count', 0)));
        setCurrentPage(currentPage + 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const isAccessNotificationCenter = () => {
    return (
      props.getAccessNotification &&
      props.getAuthUser?.businessTypes?.some((item) => [BUSINESS_TYPES.SUPPLIER, BUSINESS_TYPES.INSURANCE_COMPANY].includes(item.id))
    );
  };

  return (
    <>
      <div className="title">
        <span>{t('Notification')}</span>
      </div>
      <PerfectScrollbar
        id="scrollableDiv"
        options={perfectScrollbarOptions}
        className="scroll"
        style={{ maxHeight: 500, position: 'relative' }}>
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={data.length < totalItems}
          loader={<></>}
          scrollableTarget="scrollableDiv">
          <ASpinner size="large" spinning={loading}>
            {data.length > 0 ? (
              data?.map((notification) => (
                <NotificationItemStyled
                  className="d-flex align-items-center border-bottom cursor-pointer p-4"
                  isHovered={isHovered}
                  onMouseEnter={handleHover}
                  onMouseLeave={handleHover}
                  onClick={() => {
                    const path =
                      notification?.eventType === EVENT_TYPE.NEW_INSURANCE_ORDER
                        ? PATH.INSURANCE_ORDER_EDIT_PATH.replace(':id', JSON.parse(notification?.metadata).orderId)
                        : `${PATH.CAR_ACCESSORIES_VIEW_SALES_ORDERS_PATH}?id=${JSON.parse(notification?.metadata).orderId}`;

                    if (notification?.readTime) history.push(path);
                    else {
                      props
                        .readNotification({ ids: [notification?.id] })
                        .then(() => {
                          history.push(path);
                          store.dispatch(setReadNotification());
                        })
                        .catch((err) => console.error(err));
                    }
                  }}>
                  <div className={`symbol symbol-40 mr-5 ${notification?.readTime ? 'opacity-25' : ''}`}>
                    <span className="symbol-circle">
                      <SVG
                        src={toAbsoluteUrl(
                          notification?.eventType === EVENT_TYPE.NEW_INSURANCE_ORDER
                            ? '/media/svg/icons/Design/InsuranceOrder.svg'
                            : '/media/svg/icons/Design/EcommerceOrder.svg'
                        )}
                        className="svg-icon-lg svg-icon-primary"></SVG>
                    </span>
                  </div>
                  <div className="d-flex flex-column font-weight-bold">
                    <span className={`font-size-lg mb-1 ${notification?.readTime ? 'text-muted' : 'text-dark text-hover-primary'}`}>
                      {notification?.eventType === EVENT_TYPE.NEW_INSURANCE_ORDER ? t('newInsuranceOrder') : t('newEcommerceOrder')}
                    </span>
                    <span style={{ color: notification?.readTime ? '#b6b6c4' : '#83879d' }}>{`${t('orderCode')}: ${
                      JSON.parse(notification?.metadata).orderCode || t('N/A')
                    }. ${t('pleaseCheckOrder')}.`}</span>
                    <span style={{ color: notification?.readTime ? '#b6b6c4' : '#83879d' }}>
                      <i className="flaticon-time-1" style={{ fontSize: '12px' }} />
                      &nbsp;
                      {UtilDate.toDateTimeLocal(notification?.createdDate)}
                    </span>
                  </div>
                </NotificationItemStyled>
              ))
            ) : (
              <Empty description={t('no_notification')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </ASpinner>
        </InfiniteScroll>
      </PerfectScrollbar>
    </>
  );
};

export default connect(
  (state: any) => ({
    getNotificationUnreadQuantity: authSelectors.getNotificationUnreadQuantity(state),
    getAccessNotification: authSelectors.getAccessNotification(state),
    getAuthUser: authSelectors.getAuthUser(state)
  }),
  {
    getNotificationList: authActions.getNotificationList,
    getNotiUnreadQuantity: authActions.getNotificationUnreadQuantity,
    readNotification: authActions.readNotification
  }
)(NotificationInfo);
