import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AppContentWrapper from '~/views/presentation/core/AppContentWrapper';

const AuthBaseRoute = ({ routes, redirectURL }) => {
  return (
    <AppContentWrapper>
      <Switch>
        {routes.map((r) => {
          const exact = r.exact || false;
          return <Route path={r.path} component={r.component} exact={exact} key={r.path} />;
        })}
        <Redirect to={redirectURL} />
      </Switch>
    </AppContentWrapper>
  );
};

export default AuthBaseRoute;
