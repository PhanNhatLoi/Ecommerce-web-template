import { LoadingOutlined, PaperClipOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { getAuthorizedUser } from '~/state/utils/session';
import ATypography from '~/views/presentation/ui/text/ATypography';

import ASpinner from '../loading/ASpinner';

type NewAuthFileProps = {
  action: any;
  pdfName: string;
};

const NewAuthFile: React.FC<NewAuthFileProps> = (props) => {
  const [loading, setLoading] = useState(false);

  const handleOnClick = () => {
    setLoading(true);
    fetch(props.action, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthorizedUser()}`,
        lang: 'en' // not care
      }
    })
      .then((res) => {
        if (res && res.status === 200)
          res.blob().then((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = props.pdfName;
            link.click();
            setLoading(false);
          });
      })
      .catch((err) => {
        console.error(`ithoangtan -  ~ file: AuthImage.js ~ line 60 ~ useEffect ~ err`, err);
        setLoading(false);
      });
  };

  return (
    <>
      {props.action && (
        <span className="d-flex align-items-center">
          <PaperClipOutlined className="mr-3" />
          <ATypography variant={TYPOGRAPHY_TYPE.LINK} className="mr-5" target="_blank" onClick={handleOnClick}>
            {props.pdfName}
          </ATypography>
          {loading && <ASpinner indicator={<LoadingOutlined style={{ fontSize: 15 }} spin />} spinning />}
        </span>
      )}
    </>
  );
};

export default NewAuthFile;
