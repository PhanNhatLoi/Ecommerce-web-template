/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from 'react';
import SVG from 'react-inlinesvg';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';
import { headerMenus } from '~/configs/menus';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { checkIsActive } from '~/views/utilities/helpers/RouterHelpers';

export function HeaderMenu({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url) => {
    return checkIsActive(location, url) ? 'menu-item-active' : '';
  };

  const renderSubMenus = (subMenus) => {
    return (
      <div className="menu-submenu menu-submenu-classic menu-submenu-left">
        <ul className="menu-subnav">
          {(subMenus || []).map((menu, i) => {
            return (
              <li
                key={i}
                className={`menu-item ${menu.subMenus ? 'menu-item-submenu' : ''} ${getMenuItemActive(menu.path)}`}
                data-menu-toggle="hover"
                aria-haspopup="true">
                <NavLink className="menu-link menu-toggle" to={menu.path}>
                  <span className="svg-icon menu-icon">
                    <SVG src={toAbsoluteUrl(menu.icon)} />
                  </span>
                  <span className="menu-text">{menu.title}</span>
                  {menu.subMenus && <i className="menu-arrow" />}
                </NavLink>

                {menu.subMenus && (
                  <div className={`menu-submenu menu-submenu-classic menu-submenu-right`}>
                    <ul className="menu-subnav">
                      {/*begin::3 Level*/}

                      {(menu.subMenus || []).map((subMenu, i) => {
                        return (
                          <li key={i} className={`menu-item ${getMenuItemActive(subMenu.path)}`}>
                            <NavLink className="menu-link" to={subMenu.path}>
                              <i className="menu-bullet menu-bullet-dot">
                                <span />
                              </i>
                              <span className="menu-text">{subMenu.title}</span>
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderMenus = (menus) => {
    return (menus || []).map((menu, i) => {
      if (menu.subMenus) {
        return (
          <li
            key={i}
            data-menu-toggle={layoutProps.menuDesktopToggle}
            aria-haspopup="true"
            className={`menu-item ${menu.subMenus ? 'menu-item-submenu' : ''} menu-item-rel ${getMenuItemActive(menu.path)}`}>
            <NavLink className="menu-link menu-toggle" to={menu.path}>
              <span className="menu-text">{menu.title}</span>
              {menu.subMenus && <i className="menu-arrow"></i>}
            </NavLink>
            {menu.subMenus && renderSubMenus(menu.subMenus)}
          </li>
        );
      } else {
        return (
          <li key={i} className={`menu-item menu-item-rel ${getMenuItemActive(menu.path)}`}>
            <NavLink className="menu-link" to={menu.path}>
              <span className="menu-text">{menu.title}</span>
              {layoutProps.rootArrowEnabled && <i className="menu-arrow" />}
            </NavLink>
          </li>
        );
      }
    });
  };

  return (
    <div
      id="kt_header_menu"
      className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
      {...layoutProps.headerMenuAttributes}>
      {/*begin::Header Nav*/}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>{renderMenus(headerMenus)}</ul>
      {/*end::Header Nav*/}
    </div>
  );
}
