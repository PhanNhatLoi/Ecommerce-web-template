import React from 'react';
import ReactDOM from 'react-dom';

// external css
import 'normalize.css';
import 'antd/dist/antd.min.css';
import 'react-datepicker/dist/react-datepicker.min.css';
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
// import 'perfect-scrollbar-react/dist/style.min.css';

// aos and user guide
import 'aos/dist/aos.css';
// aos and user guide

// interal css
import '~/static/scss/style.scss';
import '~/static/plugins/keenthemes-icons/font/ki.css';
import '~/static/plugins/flaticon/flaticon.css';
import '~/static/plugins/flaticon2/flaticon.css';

import App from './App';
import * as serviceWorker from './worker/serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
