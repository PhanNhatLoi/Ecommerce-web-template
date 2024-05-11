import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';

export function BreadCrumbs({ items }) {
  const { t } = useTranslation();
  if (!items || !items.length) {
    return '';
  }

  return (
    <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2">
      {![PATH.DASHBOARD_PATH, PATH.NOTIFICATION_PATH].includes(window.location.pathname) &&
        items.map((item, index) => {
          if (index !== items.length - 1) {
            if (index !== items.length - 1 && index !== 0) {
              return (
                <li key={`bc${index}`} className="breadcrumb-item">
                  <Link className="text-muted" to={{ pathname: '../dashboard' }}>
                    {item.title}
                  </Link>
                </li>
              );
            }
            return (
              <li key={`bc${index}`} className="breadcrumb-item">
                <Link className="text-muted" to={{ pathname: item.pathname }}>
                  {item.title}
                </Link>
              </li>
            );
          } else {
            return (
              <li key={`bc${index}`} className="breadcrumb-item">
                <span className="text-muted">{item.title}</span>
              </li>
            );
          }
        })}
    </ul>
  );
}
