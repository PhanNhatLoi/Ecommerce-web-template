import { useState, useEffect } from 'react';
import { Upload, Form } from 'antd/es';
import ImgCrop from 'antd-img-crop';
import { commonValidate } from '~/views/utilities/ant-validation';
import { IMAGE_UPLOAD_URL } from '~/configs';
import { ACCEPT_IMAGE_UPLOAD } from '~/configs/upload';
import { getAuthorizedUser } from '~/state/utils/session';
import FileUpload from '~/views/utilities/helpers/image';
import { head } from 'lodash-es';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import AuthUpload from './AuthUpload';
import { DEFAULT_AVATAR } from '~/configs/default';

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

function UploadImageCropMultiple(props) {
  const { beforeUpload } = FileUpload(ACCEPT_IMAGE_UPLOAD);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
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
  }, [props.fileList?.length]);

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
      <Form.Item label={props?.label} name={props.name || 'UploadImageCropMultiple'} rules={rules} className="col px-0" {...props}>
        <ImgCrop
          beforeCrop={(file, fileList) => {
            if (beforeUpload(file, fileList)) {
              return true;
            } else {
              file.status = 'error';
              return false;
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
            disabled={props.disabled}
            itemRender={(originNode, file) => {
              let src = '';
              if (file.status === 'done' || file.loaded) {
                src = file.response ? firstImage(head(file?.response)?.path) : file.path ? firstImage(file.path) : DEFAULT_AVATAR;
              }

              return props.noToken ? (
                originNode
              ) : (
                <AuthUpload src={src} remove={() => (props.disabled ? '' : handleRemoveImage(file.uid))} />
              );
            }}>
            {(fileList.length < (props.maximumUpload || 5) || !loading || props.alwayShowUploadBtn) &&
              `+ ${props.uploadText || t('upload')}`}
          </Upload>
        </ImgCrop>
      </Form.Item>
    </div>
  );
}
export default UploadImageCropMultiple;
