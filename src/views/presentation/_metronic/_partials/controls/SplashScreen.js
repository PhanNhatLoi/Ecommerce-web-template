import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { toAbsoluteUrl } from '~/views/utilities/helpers/metronic';

export function SplashScreen() {
  return (
    <>
      <div className="splash-screen">
        <img src={toAbsoluteUrl('/media/logos/logo-mini-md.png')} alt="Metronic logo" />
        <CircularProgress className="splash-screen-spinner" />
      </div>
    </>
  );
}
