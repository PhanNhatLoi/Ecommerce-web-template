import React, { useEffect } from 'react';
import { Upload, Form } from 'antd/es';
import ImgCrop from 'antd-img-crop';
import { useState } from 'react';
import { commonValidate } from '~/views/utilities/ant-validation';
import { IMAGE_UPLOAD_URL, IMAGE_UPLOAD_WITHOUT_TOKEN_URL } from '~/configs';
import { ACCEPT_IMAGE_UPLOAD } from '~/configs/upload';
import { getAuthorizedUser } from '~/state/utils/session';
import FileUpload from '~/views/utilities/helpers/image';
import { head } from 'lodash-es';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import AuthImage from '../../ui/Images/AuthImage';
import { DEFAULT_AVATAR } from '~/configs/default';
import { EyeOutlined } from '@ant-design/icons';

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

const AuthUpload = (props) => {
  const [visiblePreview, setVisiblePreview] = useState(false);
  return (
    <div className="ant-upload-list-picture-card-container">
      <div className="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card">
        <div className="ant-upload-list-item-info">
          <span className="ant-upload-span">
            <AuthImage
              preview={{
                mask: <EyeOutlined />,
                onVisibleChange: (visible) => {
                  setVisiblePreview(visible);
                },
                visible: visiblePreview
              }}
              width={85}
              height={85}
              style={{ objectFit: 'cover' }}
              isAuth={true}
              src={props.src}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </span>
        </div>
        <span className="ant-upload-list-item-actions">
          <span role="img" aria-label="eye" className="anticon anticon-eye" onClick={() => setVisiblePreview(true)}>
            <svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" />
            </svg>
          </span>
          <button
            onClick={() => {
              props.remove && props.remove();
            }}
            title="Remove file"
            type="button"
            className="ant-btn ant-btn-text ant-btn-sm ant-btn-icon-only ant-upload-list-item-card-actions-btn">
            <span role="img" aria-label="delete" tabIndex={-1} className="anticon anticon-delete">
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="delete"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true">
                <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
              </svg>
            </span>
          </button>
        </span>
      </div>
    </div>
  );
};

function MUploadImageCropNoStyle(props) {
  const { beforeUpload } = FileUpload();
  const [fileList, setFileList] = useState(props?.fileList || []);
  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  const onFileChange = ({ fileList }) => {
    setFileList(fileList);
    props.onImageChange(
      fileList.map((f) => {
        if (f?.url) return f.path;
        else {
          const f1 = head(f?.response);
          return f1?.path;
        }
      })
    );
  };

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
  }, [props.fileList?.length]);

  const handleRemoveImage = (uid) => {
    setFileList(
      fileList.filter((o) => {
        return o.uid !== uid;
      })
    );
  };

  return (
    <Form.Item label={props?.label} name={props.name || 'MUploadImageCropNoStyle'} rules={rules} className="col px-0" {...props}>
      <ImgCrop
        beforeCrop={(file, fileList) => {
          if (beforeUpload(file, fileList)) {
            return true;
          } else {
            file.status = 'error';
          }
        }}
        rotate
        aspect={props.aspect || 3 / 4}
        grid
        fillColor="transparent">
        <Upload
          action={props.noToken ? IMAGE_UPLOAD_WITHOUT_TOKEN_URL : IMAGE_UPLOAD_URL}
          beforeUpload={beforeUpload}
          fileList={fileList}
          accept={ACCEPT_IMAGE_UPLOAD.join(', ')}
          headers={{ Authorization: `Bearer ${getAuthorizedUser()}` }}
          listType="picture-card"
          multiple
          name="files"
          onChange={onFileChange}
          onPreview={onPreview}
          itemRender={(originNode, file) => {
            let src = file.url ? firstImage(file.url) : DEFAULT_AVATAR;
            if (file.response) {
              src = firstImage(head(file?.response)?.path);
            }
            return <AuthUpload src={src} remove={() => handleRemoveImage(file.uid)}></AuthUpload>;
          }}>
          {fileList.length < (props.maximumUpload || 5) && '+ Upload'}
        </Upload>
      </ImgCrop>
    </Form.Item>
  );
}
export default MUploadImageCropNoStyle;
