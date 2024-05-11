import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Image, Upload } from 'antd/es';
import ImgCrop from 'antd-img-crop';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { IMAGE_UPLOAD_URL } from '~/configs';
import { ACCEPT_IMAGE_UPLOAD } from '~/configs/upload';
import { getAuthorizedUser } from '~/state/utils/session';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import { commonValidate } from '~/views/utilities/ant-validation';
import FileUpload from '~/views/utilities/helpers/image';
import { firstImage } from '~/views/utilities/helpers/utilObject';

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

function MUploadImageCropNoStyle(props) {
  const { beforeUpload } = FileUpload();
  const [file, setFile] = useState(props?.file || []);
  const [loading, setLoading] = useState(false);

  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  const onFileChange = ({ file }) => {
    setFile(file);
    if (file?.status === 'done') {
      props.onImageChange(head(file?.response)?.path);
      setLoading(false);
      setFile({
        ...file,
        url: firstImage(head(file?.response)?.path)
      });
    } else setLoading(true);
  };

  useEffect(() => {
    if (props.file) setFile({ url: firstImage(props.file) });
    // eslint-disable-next-line
  }, [props.file]);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text"> Upload</div>
    </div>
  );

  return (
    <Form.Item label={props?.label} name={props.name || 'MUploadImageCropNoStyle'} rules={rules} {...props}>
      <ImgCrop
        // cropperProps={{}}
        fillColor={'transparent'} // important
        accept={ACCEPT_IMAGE_UPLOAD.join(', ')}
        beforeCrop={beforeUpload}
        rotate
        aspect={props.aspect || 4 / 3}
        grid>
        <Upload
          action={IMAGE_UPLOAD_URL}
          beforeUpload={beforeUpload}
          accept={ACCEPT_IMAGE_UPLOAD.join(', ')}
          headers={{ Authorization: `Bearer ${getAuthorizedUser()}` }}
          listType="picture-card"
          showUploadList={false}
          name="files"
          onChange={onFileChange}
          onPreview={onPreview}>
          {!loading && file?.url ? (
            <AuthImage
              preview={false}
              isAuth={true}
              src={file?.url}
              // onClick={(e) => e.stopPropagation()}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      </ImgCrop>
    </Form.Item>
  );
}
export default MUploadImageCropNoStyle;
