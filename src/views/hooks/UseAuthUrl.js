import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAuthorizedUser } from '~/state/utils/session';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const useAuthUrl = (url = '2021-08-05/image/4223a92a-08b0-424e-af63-0ee7344c6dc6.png') => {
  const { t } = useTranslation();
  const [fetchUrl, setFetchUrl] = useState(url);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(firstImage(url), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthorizedUser()}`,
        lang: 'vi' // not care
      }
    })
      .then((res) => {
        if (res && res.status === 200)
          res.blob().then((blob) => {
            setFetchUrl(URL.createObjectURL(blob));
          });
        else {
          AMessage.error(t('fetch_url_failed'));
        }
      })
      .catch((err) => {
        console.error('trandev ~ file: UseAuthUrl.js ~ line 30 ~ useEffect ~ err', err);
        setError(err.message);
      });
  }, [url]);

  return [fetchUrl, error];
};

export default useAuthUrl;
