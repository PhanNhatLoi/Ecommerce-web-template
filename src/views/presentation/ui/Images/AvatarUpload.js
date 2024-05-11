import { Upload } from 'antd/es';
import clsx from 'clsx';
import PropsType from 'prop-types';
import React, { useEffect, useState } from 'react';
import ImgCrop from 'antd-img-crop';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { BASE_URL_IMG_WITHOUT_TOKEN, IMAGE_UPLOAD_URL, IMAGE_UPLOAD_WITHOUT_TOKEN_URL } from '~/configs';
import { showToastError } from '~/configs/ServerErrors';
import { getAuthorizedUser } from '~/state/utils/session';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import FileUpload from '~/views/utilities/helpers/image';
import { UploadOutlined } from '@ant-design/icons';

const UIUpload = styled(Upload)`
  position: absolute;
  top: -10px;
  right: -10px;

  .wrap-icon {
    height: 24px;
    width: 24px;
    border-radius: 50%50%;
    box-shadow: 0px 9px 16px 0px rgb(24 28 50 / 25%) !important;
    color: #3f4254;
    background-color: #fff;
    border-color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ant-upload.ant-upload-select-picture-card,
  img {
    border-radius: 8px;
  }

  ${(props) => {
    if (props.border) {
      return css`
        .ant-upload.ant-upload-select-picture-card {
          border: none;
        }
      `;
    }
  }}
`;

export default function AvatarUpload(props) {
  const { imageUrl, name, onChange, className, withToken } = props;
  const { t } = useTranslation();
  const { beforeUpload, fetchImage } = FileUpload();

  const [src, setSrc] = useState('');

  // create blob url for image need token
  useEffect(() => {
    if (withToken && imageUrl) {
      fetchImage(imageUrl)
        .then((res) => {
          setSrc(res);
        })
        .catch((err) => {
          showToastError(t(err.message));
        });
    } else {
      setSrc(imageUrl);
    }
  }, [imageUrl]);

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      const url = withToken ? info?.file?.response?.[0]?.path : info?.file?.response?.path;
      onChange && onChange(url);
    }
  };

  const removePic = () => {
    onChange && onChange('');
  };

  return (
    <React.Fragment>
      <div className={clsx('image-input image-input-outline', className)} id="kt_profile_avatar">
        {src ? (
          <img
            src={withToken ? src : BASE_URL_IMG_WITHOUT_TOKEN + imageUrl}
            alt="avatar"
            className="image-input-wrapper"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{ fontSize: '12px', border: '1px solid #ebebeb', color: 'rgba(0,0,0,0.5)' }}
            className="image-input-wrapper d-flex flex-column align-items-center justify-content-center text-center p-2">
            <div className="mb-2">
              <UploadOutlined style={{ fontSize: '14px' }} />
            </div>
            {t('upload_logo')}
          </div>
        )}

        <ImgCrop
          // cropperProps={{}}
          fillColor={'transparent'} // important
          beforeCrop={beforeUpload}
          rotate
          aspect={props.aspect || 4 / 3}
          grid>
          <UIUpload
            name={name}
            headers={
              withToken && {
                Authorization: `Bearer ${getAuthorizedUser()}`
              }
            }
            className=""
            disabled={props.disabled}
            showUploadList={false}
            action={withToken ? IMAGE_UPLOAD_URL : IMAGE_UPLOAD_WITHOUT_TOKEN_URL}
            beforeUpload={beforeUpload}
            onChange={handleChange}>
            <label className="wrap-icon">
              <i className="fa fa-pencil icon-sm text-muted" aria-hidden="true"></i>
            </label>
          </UIUpload>
        </ImgCrop>
        <span
          className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
          data-action="cancel"
          data-toggle="tooltip"
          title=""
          data-original-title="Cancel avatar">
          <i className="ki ki-bold-close icon-xs text-muted"></i>
        </span>
        {src && (
          <span
            onClick={removePic}
            className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
            data-action="remove"
            data-toggle="tooltip"
            title=""
            data-original-title="Remove avatar">
            <i className="ki ki-bold-close icon-xs text-muted"></i>
          </span>
        )}
      </div>
      {/* <span className="form-text text-muted">{t('avatar_des')}</span> */}
    </React.Fragment>
  );
}
AvatarUpload.defaultProps = {
  name: 'files',
  withToken: true
};

AvatarUpload.propTypes = {
  name: PropsType.string,
  onChange: PropsType.func.isRequired,
  imageUrl: PropsType.string.isRequired,
  withToken: PropsType.bool
};
