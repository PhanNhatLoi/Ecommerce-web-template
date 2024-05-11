import React from 'react';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '~/views/utilities/helpers/metronic/AssetsHelpers';
import { checkIsActive } from '~/views/utilities/helpers/metronic/RouterHelpers';
import { sidebarMenus } from '~/configs/menus';

export function SidebarMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url) ? ` ${!hasSubmenu && 'menu-item-active'} menu-item-open menu-item-not-hightlighted` : '';
  };

  const renderSubMenus = (subMenus) => {
    return (
      <div className="menu-submenu ">
        <i className="menu-arrow" />
        <ul className="menu-subnav">
          {(subMenus || []).map((menu, i) => {
            return (
              <li
                role="menuitem"
                key={i}
                className={`menu-item ${menu.subMenus && 'menu-item-submenu'} ${getMenuItemActive(
                  menu.path,
                  menu.subMenus ? true : false
                )}`}
                aria-haspopup="true"
                data-menu-toggle={menu.subMenus && 'hover'}>
                <NavLink className="menu-link menu-toggle" to={menu.path}>
                  <span className="svg-icon menu-icon">
                    <SVG src={toAbsoluteUrl(menu.icon)} />
                  </span>
                  <span className="menu-text">{menu.title}</span>
                  {menu.subMenus && <i className="menu-arrow" />}
                </NavLink>
                {menu.subMenus && renderSubMenus(menu.subMenus)}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderMenus = (menus) => {
    return (menus || []).map((menu, i) => {
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
            role="menuitem"
            key={i}
            className={`menu-item  ${menu.subMenus && 'menu-item-submenu'} ${getMenuItemActive(menu.path, menu.subMenus ? true : false)}`}
            aria-haspopup="true"
            data-menu-toggle={menu.subMenus && 'hover'}>
            <NavLink className="menu-link menu-toggle" to={menu.path}>
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl(menu.icon)} />
              </span>
              <span className="menu-text">{menu.title}</span>
              {menu.subMenus && <i className="menu-arrow" />}
            </NavLink>
            {menu.subMenus && renderSubMenus(menu.subMenus)}
          </li>
        );
      }
    });
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>{renderMenus(sidebarMenus)}</ul>

      {/* end::Menu Nav */}
    </>
  );
}
