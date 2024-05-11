import { DownloadOutlined, LoadingOutlined, PaperClipOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { getAuthorizedUser } from '~/state/utils/session';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const AuthFile = (props) => {
  const [fileSrc, setFilerc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (props.isAuth && props.src !== '') {
      setLoading(true);
      fetch(props.src, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getAuthorizedUser()}`,
          lang: 'en' // not care
        }
      })
        .then((res) => {
          if (res && res.status === 200)
            res.blob().then((blob) => {
              setFilerc(URL.createObjectURL(blob));
              setError(false);
              setTimeout(() => {
                setLoading(false);
              }, 150);
            });
          else {
            setError(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error(`ithoangtan -  ~ file: AuthImage.js ~ line 60 ~ useEffect ~ err`, err);
          setError(true);
          setLoading(false);
          // props.setLoading(false);
        });
    }
  }, [props.src]);

  return (
    <div>
      {fileSrc !== '' && !error ? (
        <span className="d-flex align-items-center">
          <PaperClipOutlined className="mr-3" />
          <ATypography
            variant={TYPOGRAPHY_TYPE.LINK}
            className="mr-5"
            target="_blank"
            href={fileSrc !== '' ? fileSrc : props.src ? firstImage(props.src) : ''}>
            {props.children}
          </ATypography>
          <ATypography
            variant={TYPOGRAPHY_TYPE.LINK}
            className="ml-5"
            type="link"
            target="_blank"
            style={{ color: '#000' }}
            href={fileSrc !== '' ? fileSrc : props.src ? firstImage(props.src) : ''}>
            <DownloadOutlined />
          </ATypography>
        </span>
      ) : (
        <>
          {loading && <LoadingOutlined />}
          {!loading && <>failed</>}
        </>
      )}
    </div>
  );
};

export default AuthFile;
