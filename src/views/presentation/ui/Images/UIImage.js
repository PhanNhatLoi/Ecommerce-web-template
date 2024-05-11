import { Image } from 'antd/es';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchImage } from '~/views/utilities/helpers/image';

const WrapImage = styled(Image)`
  object-fit: cover;
`;

function UIImage({ src, width = 50, height = 50 }) {
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    if (src) {
      fetchImage(src)
        .then((url) => {
          setImageUrl(url);
        })
        .catch((err) => {
          console.error('%c [ err ]', 'font-size:13px; background:pink; color:#bf2c9f;', err);
        });
    }
  }, [src]);

  return imageUrl ? (
    <WrapImage
      width={width}
      height={height}
      preview={{
        mask: (
          <span>
            <i className="fa fa-eye " style={{ fontSize: '15px', color: `white` }} />
          </span>
        )
      }}
      src={imageUrl}
    />
  ) : null;
}

export default UIImage;
