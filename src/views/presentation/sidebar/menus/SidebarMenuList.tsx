import { Badge } from 'antd/es';
import React, { useEffect, useState } from 'react';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { sidebarMenus } from '~/configs/menus';
import { CAR_ACCESSORIES_SALES_ORDERS_PATH, DEFAULT_PATH_USER, INSURANCE_ORDER_LIST_PATH } from '~/configs/routesConfig';
import * as roleBaseStatus from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { checkIsActive } from '~/views/utilities/helpers/RouterHelpers';
import COLOR from '~/views/utilities/layout/color';

const SelectStyled = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 45px;
  background-color: ${COLOR.systemColor};
  width: 5px;
  border-radius: 8px 0px 0px 8px;
`;

function SidebarMenuList({ layoutProps, getAuthUser, getRoleBase, getNewOrderQuantity, getNewInsuranceOrderQuantity, locale }) {
  const location = useLocation();
  const [pagePermission, setPagePermission] = useState<roleBaseStatus.pagePermissionsType[]>([]);

  const businessTypes = getAuthUser.businessTypes?.map((item) => item.id);

  useEffect(() => {
    if (getRoleBase?.pagePermissions) setPagePermission(getRoleBase.pagePermissions);
  }, [getRoleBase]);

  const businessTypeValid = (menu) => {
    return menu.businessTypes === 'none' || !menu.businessTypes || businessTypes?.includes(menu.businessTypes);
  };

  const menuValid = (menu) => {
    if (!businessTypeValid(menu)) return false;
    if (menu.showOnlyVendor) return false;

    // Những menu mặc định không cần phân quyền: DASHBOARD_PATH,....
    if (DEFAULT_PATH_USER.includes(menu.path)) return true;

    // cần check xem là vendor hay là user của vendor
    if (roleBaseStatus.isVendor()) return true;
    const hasPath = pagePermission?.find((item: roleBaseStatus.pagePermissionsType) => item.path === menu.path && !item.access?.nonAccess);
    return hasPath;
  };

  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url) ? ` ${!hasSubmenu && 'menu-item-active'} menu-item-open menu-item-not-hightlighted` : '';
  };

  const renderBadge = (path, orderQuantity, insuranceOrderQuantity) => {
    switch (path) {
      case CAR_ACCESSORIES_SALES_ORDERS_PATH:
        return orderQuantity > 0 && <Badge count={orderQuantity} size="small" style={{ right: 0, top: 14 }} />;
      case INSURANCE_ORDER_LIST_PATH:
        return insuranceOrderQuantity > 0 && <Badge count={insuranceOrderQuantity} size="small" style={{ right: 0, top: 14 }} />;
      default:
        return;
    }
  };

  const renderSubMenus = (subMenus) => {
    return (
      <div className="menu-submenu">
        <i className="menu-arrow" />
        <ul className="menu-subnav">
          {(subMenus || []).map((menu, i) => {
            const active = getMenuItemActive(menu.path, menu.subMenus ? true : false);

            if (menuValid(menu)) {
              return (
                <li
                  key={i}
                  className={`menu-item ${menu.subMenus && 'menu-item-submenu'} ${active}`}
                  role={menu.subMenus ? 'menuitem' : 'listitem'}
                  data-menu-toggle={menu.subMenus && 'hover'}>
                  <NavLink className="menu-link menu-toggle" to={menu.path}>
                    <span className="svg-icon menu-icon">
                      {active ? (
                        <span className="svg-icon svg-icon-md">
                          <SVG src={toAbsoluteUrl('/media/svg/icons/Tools/li_item_select.svg')} />
                        </span>
                      ) : (
                        <span className="svg-icon svg-icon-sm" style={{ marginLeft: '2px' }}>
                          <SVG src={toAbsoluteUrl('/media/svg/icons/Tools/li_item.svg')} />
                        </span>
                      )}
                    </span>
                    <div style={{ display: 'flex', width: '100%' }}>
                      <span className="menu-text">{menu.title}</span>
                      {renderBadge(menu.path, getNewOrderQuantity, getNewInsuranceOrderQuantity)}
                    </div>
                    {menu.subMenus && <i className="menu-plus" style={{ color: COLOR.systemColor }}></i>}
                  </NavLink>
                  {menu.subMenus && renderSubMenus(menu.subMenus)}
                </li>
              );
            }
          })}
        </ul>
      </div>
    );
  };

  const renderMenus = (menus) => {
    return (menus || []).map((menu, i) => {
      const active = getMenuItemActive(menu.path, menu.subMenus ? true : false);
      if (menuValid(menu)) {
        if (menu.group) {
          return (
            <li className="menu-section " key={i}>
              <h4 className="menu-text">{menu.group}</h4>
              <i className="menu-icon flaticon-more-v2"></i>
            </li>
          );
        } else {
          return (
            <li
              style={{ position: 'relative' }}
              key={i}
              className={`menu-item ${menu.subMenus && 'menu-item-submenu'} ${getMenuItemActive(menu.path, menu.subMenus ? true : false)}`}
              role={menu.subMenus ? 'menuitem' : 'listitem'}
              data-menu-toggle={menu.subMenus && 'hover'}>
              <NavLink className="menu-link menu-toggle " to={menu.path}>
                {menu.icon && (
                  <span className="svg-icon svg-icon-lg d-flex justify-content-center align-items-center">
                    <SVG src={toAbsoluteUrl(`/media/svg/icons/Menu/${menu.icon}.svg`)} />
                  </span>
                )}

                <span className="menu-text text-uppercase" style={{ fontWeight: menu.subMenus ? 600 : 'normal' }}>
                  {menu.title}
                </span>
                {menu.subMenus && <i className="menu-arrow" />}
              </NavLink>
              {menu.subMenus && renderSubMenus(menu.subMenus)}
              {active && <SelectStyled />}
            </li>
          );
        }
      }
    });
  };

  return (
    <>
      {/* begin::Menu Nav */}
      {businessTypes && <ul className={`menu-nav ${layoutProps.ulClasses}`}>{renderMenus(sidebarMenus)}</ul>}

      {/* end::Menu Nav */}
    </>
  );
}

export default connect((state: any) => ({
  getAuthUser: authSelectors.getAuthUser(state),
  getRoleBase: authSelectors.getRoleBase(state),
  getNewOrderQuantity: authSelectors.getNewOrderQuantity(state),
  getNewInsuranceOrderQuantity: authSelectors.getNewInsuranceOrderQuantity(state),
  locale: state['appData']?.locale
}))(SidebarMenuList);
