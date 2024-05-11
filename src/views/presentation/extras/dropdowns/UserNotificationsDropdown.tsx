import { Badge, Empty } from 'antd/es';
import objectPath from 'object-path';
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown, OverlayTrigger, Tab, Tooltip } from 'react-bootstrap';
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
import store from '~/state/store';
import { UtilDate } from '~/views/utilities/helpers';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

import { useHtmlClassService } from '../../core/Layout';
import { DropdownTopbarItemToggler } from '../../dropdowns';
import ASpinner from '../../ui/loading/ASpinner';

const NotificationItemStyled = styled.div<{ isHovered: boolean }>`
  &:hover {
    background-color: rgba(246, 246, 246, 0.5);
  }
`;

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
};

type UserNotificationsDropdownProps = {
  getNotificationUnreadQuantity: any; // redux
  setReadNotification: any; // redux
  getAccessNotification: any; // redux
  getNotiUnreadQuantity: any;
  getNotificationList: any;
  readNotification: any;
  getAuthUser: any;
};

const UserNotificationsDropdown: React.FC<UserNotificationsDropdownProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [key, setKey] = useState('Alerts');
  const bgImage = toAbsoluteUrl('/media/misc/bg-1.jpg');
  const uiService = useHtmlClassService();
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotificationList, setShowNotificationList] = useState(false);
  const [data, setData] = useState<any>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const layoutProps = useMemo(() => {
    return {
      offcanvas: objectPath.get(uiService.config, 'extras.notifications.layout') === 'offcanvas'
    };
  }, [uiService]);

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

  useEffect(() => {
    if (showNotificationList && isAccessNotificationCenter()) {
      props.getNotiUnreadQuantity({ group: 'ORDER' });
      loadMoreData();
    }
  }, [showNotificationList]);

  return (
    <>
      {layoutProps.offcanvas && (
        <div className="topbar-item">
          <div className="btn btn-icon btn-clean btn-lg mr-1 pulse pulse-primary" id="kt_quick_notifications_toggle">
            <span className="svg-icon svg-icon-xl svg-icon-primary">
              <SVG src={toAbsoluteUrl('/media/svg/icons/Code/Compiling.svg')} />
            </span>
            <span className="pulse-ring"></span>
          </div>
        </div>
      )}
      {!layoutProps.offcanvas && (
        <Dropdown drop="down" align="end" onToggle={(nextShow: boolean) => setShowNotificationList(nextShow)}>
          <Dropdown.Toggle as={DropdownTopbarItemToggler} id="kt_quick_notifications_toggle">
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="user-notification-tooltip">{t('Notification')}</Tooltip>}>
              <Badge
                size="small"
                count={isAccessNotificationCenter() ? props.getNotificationUnreadQuantity : 0}
                overflowCount={9}
                offset={isAccessNotificationCenter() && (props.getNotificationUnreadQuantity <= 9 ? [-10, 5] : [-18, 5])}>
                <div
                  className={`btn btn-icon btn-clean btn-lg pulse pulse-primary ${
                    isAccessNotificationCenter() && (props.getNotificationUnreadQuantity <= 9 ? 'mr-1' : 'mr-6')
                  }`}
                  id="kt_quick_notifications_toggle">
                  <span className="svg-icon svg-icon-xl svg-icon-primary">
                    <i className="flaticon-bell" style={{ color: '#3699FF' }}></i>
                  </span>
                  <span className="pulse-ring"></span>
                  <span className="pulse-ring" />
                </div>
              </Badge>
            </OverlayTrigger>
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim-up dropdown-menu-lg">
            {/** Head */}
            <div
              className="d-flex flex-column pt-6 bgi-size-cover bgi-no-repeat rounded-top"
              style={{ backgroundImage: `url(${bgImage})` }}>
              <h4 className="d-flex flex-center rounded-top pb-4">
                <span className="text-white">{t('Notification')}</span>
                <span className="btn btn-text btn-success btn-sm font-weight-bold btn-font-md ml-2">
                  {isAccessNotificationCenter() ? props.getNotificationUnreadQuantity : 0}
                </span>
              </h4>

              <Tab.Container defaultActiveKey={key}>
                {/* <Nav
                    as="ul"
                    className="nav nav-bold nav-tabs nav-tabs-line nav-tabs-line-3x nav-tabs-line-transparent-white nav-tabs-line-active-border-success mt-3 px-8"
                    onSelect={(_key) => setKey(_key)}>
                    <Nav.Item className="nav-item" as="li">
                      <Nav.Link eventKey="Alerts" className={`nav-link show ${key === 'Alerts' ? 'active' : ''}`}>
                        Alerts
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="Events" className={`nav-link show ${key === 'Events' ? 'active' : ''}`}>
                        Events
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="Logs" className={`nav-link show ${key === 'Logs' ? 'active' : ''}`}>
                        Logs
                      </Nav.Link>
                    </Nav.Item>
                  </Nav> */}

                <Tab.Content className="tab-content">
                  <Tab.Pane eventKey="Alerts">
                    <PerfectScrollbar
                      id="scrollableDiv"
                      options={perfectScrollbarOptions}
                      className="scroll"
                      style={{ maxHeight: 300, position: 'relative' }}>
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
                                        store.dispatch(props.setReadNotification());
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
                                  <span
                                    className={`font-size-lg mb-1 ${
                                      notification?.readTime ? 'text-muted' : 'text-dark text-hover-primary'
                                    }`}>
                                    {notification?.eventType === EVENT_TYPE.NEW_INSURANCE_ORDER
                                      ? t('newInsuranceOrder')
                                      : t('newEcommerceOrder')}
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
                  </Tab.Pane>
                  {/* <Tab.Pane eventKey="Events" id="topbar_notifications_events">
                      <PerfectScrollbar
                        options={perfectScrollbarOptions}
                        className="navi navi-hover scroll my-4"
                        style={{ maxHeight: '300px', position: 'relative' }}>
                        <a href="#!" className="navi-item">
                          <div className="navi-link">
                            <div className="navi-icon mr-2">
                              <i className="flaticon2-line-chart text-success"></i>
                            </div>
                            <div className="navi-text">
                              <div className="font-weight-bold">New report has been received</div>
                              <div className="text-muted">23 hrs ago</div>
                            </div>
                          </div>
                        </a>
                      </PerfectScrollbar>
                    </Tab.Pane>
                    <Tab.Pane eventKey="Logs" id="topbar_notifications_logs">
                      <div className="d-flex flex-center text-center text-muted min-h-200px">
                        All caught up!
                        <br />
                        No new notifications.
                      </div>
                    </Tab.Pane> */}
                </Tab.Content>
              </Tab.Container>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      )}
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
)(UserNotificationsDropdown);
