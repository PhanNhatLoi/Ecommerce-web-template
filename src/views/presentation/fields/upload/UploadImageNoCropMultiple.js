import React, { useEffect } from 'react';
import { Upload, Form } from 'antd/es';
import { head, last } from 'lodash-es';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import AuthUpload from './AuthUpload';
import { ACCEPT_IMAGE_UPLOAD } from '~/configs/upload';
import { DEFAULT_AVATAR } from '~/configs/default';
import { IMAGE_UPLOAD_URL, IMAGE_UPLOAD_WITHOUT_TOKEN_URL } from '~/configs';
import FileUpload from '~/views/utilities/helpers/image';
import { commonValidate } from '~/views/utilities/ant-validation';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { getAuthorizedUser } from '~/state/utils/session';

// Crop before upload preview
const onPreview = async (file) => {
  let src = file.url;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => resolve(reader.result);
    });
  }
  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow.document.write(image.outerHTML);
};
// Crop before upload preview

function MUploadImageNoCrop(props) {
  const { t } = useTranslation();
  const { beforeUpload } = FileUpload();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  useEffect(() => {
    if (props.fileList?.length > 0) {
      if (Array.isArray(props.fileList))
        setFileList(
          props.fileList.map((f) => {
            return {
              uid: f,
              url: firstImage(f),
              path: f,
              loaded: true
            };
          })
        );
      else
        setFileList(
          props.fileList.split('|').map((f) => {
            return {
              uid: f,
              url: firstImage(f),
              path: f,
              loaded: true
            };
          })
        );
    }
    // eslint-disable-next-line
  }, [props.fileList]);

  const onFileChange = ({ fileList }) => {
    setFileList(fileList.filter((file) => file.status !== 'error' || file.loaded === true));
    if (fileList.every((file) => file.status === 'done' || file.loaded === true)) {
      props.onImageChange(
        fileList.map((file) => {
          if (file?.url) {
            return {
              url: file?.path,
              name: file?.name
            };
          } else {
            const f1 = Array.isArray(file?.response) ? head(file?.response) : file?.response;
            return {
              url: f1?.path,
              name: f1?.originalName
            };
          }
        })
      );
    } else setLoading(true);
  };

  const handleRemoveImage = (uid) => {
    const newList = fileList.filter((o) => {
      return o.uid !== uid;
    });
    onFileChange({ fileList: newList });
  };

  return (
    <div
      className={
        (props.noPadding ? 'px-0  ' : '') +
        (props.noLabel
          ? props.hasLayoutForm
            ? 'col-12 col-sm-12 col-md-12 col-lg-12 col-xl-10'
            : 'col-12'
          : props.oneLine
          ? 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'
          : props.customLayout
          ? props.customLayout
          : props.hasLayoutForm
          ? 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-5'
          : 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6')
      }>
      {props.copyBtn && props.copyBtn}
      <Form.Item name={props.name || ''} rules={rules} className="col px-0" {...props}>
        <Upload
          action={props.noToken ? IMAGE_UPLOAD_WITHOUT_TOKEN_URL : IMAGE_UPLOAD_URL}
          maxCount={props.maxCount}
          beforeUpload={beforeUpload}
          fileList={fileList}
          accept={props.accept || ACCEPT_IMAGE_UPLOAD.join(', ')}
          headers={!props.noToken && { Authorization: `Bearer ${getAuthorizedUser()}` }}
          listType="picture-card"
          disabled={props.disabled}
          multiple
          name="files"
          onChange={onFileChange}
          onPreview={onPreview}
          itemRender={(originNode, file) => {
            let src = '';
            if (file.status === 'done' || file.loaded) {
              src = file.response ? firstImage(head(file?.response)?.path) : file.path ? firstImage(file.path) : DEFAULT_AVATAR;
            }

            return props.noToken ? (
              originNode
            ) : (
              <AuthUpload src={src} remove={() => (props.disabled ? '' : handleRemoveImage(file.uid))}></AuthUpload>
            );
          }}>
          {(fileList.length < (props.maximumUpload || 5) || !loading) && `+ ${props.uploadText || t('upload')}`}
        </Upload>
      </Form.Item>
    </div>
  );
}
export default MUploadImageNoCrop;
