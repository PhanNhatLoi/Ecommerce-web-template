import React, { useEffect } from 'react';
import { Upload, Form } from 'antd/es';
import ImgCrop from 'antd-img-crop';
import { useState } from 'react';
import { commonValidate } from '~/views/utilities/ant-validation';
import { IMAGE_UPLOAD_URL } from '~/configs';
import { ACCEPT_ASPECT_ID_CARD, ACCEPT_IMAGE_UPLOAD } from '~/configs/upload';
import { getAuthorizedUser } from '~/state/utils/session';
import { head } from 'lodash-es';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import FileUpload from '~/views/utilities/helpers/image';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import styled from 'styled-components';

const WrapUploadIDCardStyled = styled.div`
  .ant-upload {
    width: ${(props) => (props.isA4 ? '210px!important' : '258px!important')};
    height: ${(props) => (props.isA4 ? '292px!important' : '162px!important')};
  }
`;

function MUpload1ImageCrop(props) {
  const { beforeUpload } = FileUpload();
  const [imageUrl, setImageUrl] = useState(props?.fileList || '');
  const [loading, setLoading] = useState(false);
  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  const onFileChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done' && head(info.file?.response)?.path) {
      props.onImageChange(head(info.file?.response)?.path);
      setImageUrl(head(info.file?.response)?.path);
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  useEffect(() => {
    setImageUrl(props.fileList);
  }, [props?.fileList]);

  return (
    <WrapUploadIDCardStyled
      isA4={props.isA4}
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
      <Form.Item label={props.label || 'MUpload1ImageCrop'} name={props.name || 'MUpload1ImageCrop'} rules={rules}>
        <ImgCrop beforeCrop={beforeUpload} aspect={props.aspect || ACCEPT_ASPECT_ID_CARD} zoom={false} grid>
          <Upload
            name="files"
            listType="picture-card"
            showUploadList={false}
            action={IMAGE_UPLOAD_URL}
            beforeUpload={beforeUpload}
            headers={{ Authorization: `Bearer ${getAuthorizedUser()}` }}
            accept={ACCEPT_IMAGE_UPLOAD.join(', ')}
            onChange={onFileChange}>
            {imageUrl ? (
              <img
                className="rounded"
                src={firstImage(imageUrl)}
                alt="avatar"
                style={{ maxWidth: '96%', maxHeight: '96%', objectFit: 'contain' }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </ImgCrop>
      </Form.Item>
    </WrapUploadIDCardStyled>
  );
}
export default MUpload1ImageCrop;
