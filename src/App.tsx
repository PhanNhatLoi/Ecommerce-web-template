import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import './i18n';
import AppRouter from './routes';
import { getCountry, getListCountry, setCountryID } from './state/ducks/appData/actions';
import { getNotificationUnreadQuantity, getNewOrderQuantity, getNewInsuranceOrderQuantity } from './state/ducks/authUser/actions';
import store, { persistor } from './state/store';
import ErrorBoundary from './views/presentation/core/ErrorBoundary';
import { LayoutProvider } from './views/presentation/core/Layout';
import { LayoutSplashScreen, SplashScreenProvider } from './views/presentation/core/SplashScreen';
import { SubheaderProvider } from './views/presentation/core/Subheader';

// For Google map Geocoding
import Geocode from 'react-geocode';
import { GOOGLE_MAP_API_KEY } from '~/configs';
import { getAuthorizedUser } from './state/utils/session';
Geocode.setApiKey(GOOGLE_MAP_API_KEY);

class App extends React.Component {
  async componentDidMount() {
    //Detect country
    Promise.all([
      store.dispatch(getCountry()),
      store.dispatch(getListCountry()),
      getAuthorizedUser() && store.dispatch(getNotificationUnreadQuantity({ group: 'ORDER' })),
      getAuthorizedUser() && store.dispatch(getNewOrderQuantity()),
      getAuthorizedUser() && store.dispatch(getNewInsuranceOrderQuantity())
    ])
      .then(([country, listOfCountries]) => {
        const c = listOfCountries?.content?.find((coun: any) => coun.code === country?.content?.countryCode);
        const id = c ? c.id : 223; // default 223 is US
        store.dispatch(setCountryID(id));
      })
      .catch((err) => {
        store.dispatch(setCountryID(223)); // default 223 is US
      });
  }

  render() {
    return (
      <>
        <ReduxProvider store={store}>
          <LayoutProvider>
            <SubheaderProvider>
              <SplashScreenProvider>
                <ErrorBoundary>
                  <PersistGate loading={null} persistor={persistor}>
                    <React.Suspense fallback={<LayoutSplashScreen />}>
                      <AppRouter {...this.props} />
                    </React.Suspense>
                  </PersistGate>
                </ErrorBoundary>
              </SplashScreenProvider>
            </SubheaderProvider>
          </LayoutProvider>
        </ReduxProvider>
      </>
    );
  }
}

export default App;
