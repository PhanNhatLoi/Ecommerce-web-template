import React from 'react';
import { appDataSelector } from '../../../state/ducks/appData';
import { connect } from 'react-redux';

const LocaleWrapper = (props) => {
  return <div>{props.children}</div>;
};

const mapStateToProps = (state) => ({
  locale: appDataSelector.getLocale(state)
});

export default connect(mapStateToProps)(LocaleWrapper);
