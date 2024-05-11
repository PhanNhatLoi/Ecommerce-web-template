import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAuthorizedUser } from '~/state/utils/session';
import { LoadingOutlined } from '@ant-design/icons';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const WrapAuthAudio = styled.span`
  margin: 8px;
`;

function AuthAudio(props) {
  const [audioSrc, setAudioSrc] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

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
              setAudioSrc(URL.createObjectURL(blob));
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
        });
    }
  }, [props.src]);

  return (
    <WrapAuthAudio
      style={{
        width: props.width,
        height: props.height
      }}
      className="d-flex justify-content-center align-items-center">
      {!loading && audioSrc !== '' && !error ? (
        <audio controls>
          <source src={audioSrc !== '' ? audioSrc : props.src && firstImage(props.src)} type="audio/ogg" />
          <source src={audioSrc !== '' ? audioSrc : props.src && firstImage(props.src)} type="audio/mpeg" />
          <source src={audioSrc !== '' ? audioSrc : props.src && firstImage(props.src)} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <>
          {loading && <LoadingOutlined />}
          {!loading && <div className="d-flex justify-content-center align-items-center">No audio</div>}
        </>
      )}
    </WrapAuthAudio>
  );
}
export default AuthAudio;
