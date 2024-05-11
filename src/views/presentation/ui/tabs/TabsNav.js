import PropTypes from 'prop-types';
import React from 'react';
import { Nav, Tab } from 'react-bootstrap';

function TabsNav({ tabs, tab, changeTab }) {
  return (
    <Tab.Container defaultActiveKey={tab}>
      <Nav as="ul" onSelect={changeTab} className="nav nav-pills nav-pills-sm nav-dark-75 flex-sm-row flex-column">
        {tabs?.map((t, i) => {
          return (
            <Nav.Item key={i} className="nav-item" as="li">
              <Nav.Link eventKey={t.value} className={`nav-link py-2 px-4 ${t.value === tab ? 'active' : ''}`}>
                {t.label}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
    </Tab.Container>
  );
}

TabsNav.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  tab: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired
};

export default TabsNav;
