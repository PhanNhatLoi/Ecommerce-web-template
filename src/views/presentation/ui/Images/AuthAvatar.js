import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon, Avatar, Image } from 'antd/es';
import { getAuthorizedUser } from '~/state/utils/session';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { DEFAULT_AVATAR } from '~/configs/default';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { firstImage } from '~/views/utilities/helpers/utilObject';

function AuthAvatar(props) {
  const [imgSrc, setImgSrc] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.isAuth && Boolean(props.src)) {
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
              setImgSrc(URL.createObjectURL(blob));
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
    <>
      {imgSrc !== '' && !error ? (
        props.isSymbolLabel ? (
          <div className={props.symbolClassName || 'symbol bg-white-o-15 mr-3'}>
            <span
              className="symbol-label text-success font-weight-bold font-size-h4"
              style={{
                backgroundImage: `url(${imgSrc !== '' ? imgSrc : props.src && firstImage(props.src)})`
              }}
            />
          </div>
        ) : (
          <Avatar
            {...props}
            size={props.size}
            className={props.className}
            alt={'malu image'}
            placeholder={<Avatar preview={false} src={toAbsoluteUrl(DEFAULT_AVATAR)} />}
            src={imgSrc !== '' ? imgSrc : props.src && firstImage(props.src)}
          />
        )
      ) : (
        <>{loading ? <LoadingOutlined /> : <Avatar className={props.className} size={props.size} icon={<UserOutlined />} />}</>
      )}
    </>
  );
}
export default AuthAvatar;
