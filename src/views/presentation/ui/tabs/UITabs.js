/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import UITable from '../table/UITable';
import styled from 'styled-components';
import { Color } from '~/views/utilities/layout';

const WrapTabs = styled.ul`
  &::-webkit-scrollbar {
    height: 0px;
    width: 0px;
  }

  flex-wrap: nowrap;

  li.nav-item {
    margin: 0px;
    a.nav-link {
      white-space: nowrap;
    }
  }
  li.nav-item.active,
  li.nav-item:hover {
    border-bottom: 1px solid ${Color.primary};
  }
  a.active,
  a:hover {
    border-bottom: none !important;
  }

  @media screen and (max-width: 576px) {
    overflow: scroll;
  }
`;

function UITabs({ tabs, tab, changeTab }) {
  return (
    <WrapTabs className="nav nav-tabs nav-tabs-line mb-5" role="tablist">
      {tabs?.map((t, i) => {
        return (
          <li key={i} className={`nav-item px-3 ${tab === t.value && 'active'}`} onClick={() => changeTab(t.value)}>
            <a
              className={`nav-link ${tab === t.value && 'active'}`}
              data-toggle="tab"
              role="tab"
              aria-selected={(tab === t.value).toString()}>
              {t.label}
            </a>
          </li>
        );
      })}
    </WrapTabs>
  );
}
UITable.defaultProps = {
  tabs: [],
  tab: '',
  changeTab: () => {}
};
UITable.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  tab: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired
};

export default UITabs;
