import { getCookie } from './session';
import { JWT, LANG } from '~/configs/index';
import moment from 'moment';

const authHeader = () => {
  const token = getCookie(JWT);
  const language = getCookie(LANG);

  if (token) {
    //YYYY-MM-DDTHH:mm:ss.SSS[Z]
    return {
      lang: language ? language : 'vi', // vietnamese is default
      Authorization: 'Bearer ' + token,
      localDatetime: moment().format('YYYY-MM-DDTHH:mm:ssZ')
    };
  } else {
    return { localDatetime: moment().format('YYYY-MM-DDTHH:mm:ssZ') };
  }
};

export default authHeader;
