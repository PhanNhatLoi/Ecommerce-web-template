import { Modal, Upload } from 'antd/es';
import objectPath from 'object-path';
import PropsType from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IMAGE_UPLOAD_URL } from '~/configs';
import { getAuthorizedUser } from '~/state/utils/session';
import FileUpload from '~/views/utilities/helpers/image';

const WrapUpload = styled(Upload)`
  .ant-upload-list-item-info::before {
    left: 0;
  }
`;

export function ListImageUpload({ name, fileList = [], onChange, max }) {
  const { beforeUpload, fetchImage } = FileUpload();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [images, setImages] = useState(fileList);
  useEffect(() => {
    setImages(fileList);
  }, [fileList]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    setPreviewImage(file.url);
    setPreviewVisible(true);
  };

  const handleRemove = (file) => {
    const files = fileList.filter((f) => f.uid !== file.uid);
    onChange && onChange(files);
  };

  const handleChange = async ({ file, fileList }) => {
    if (file.status === 'uploading') {
      setImages(fileList);
    } else if (file.status === 'done') {
      let blobUrl = '';
      try {
        blobUrl = await fetchImage(objectPath.get(file, 'response.0.path'));
      } catch (err) {
        console.error('%c [ err ]', 'font-size:13px; background:pink; color:#bf2c9f;', err);
      }
      const files = fileList.map((f) => ({
        uid: objectPath.get(f, 'uid'),
        name: objectPath.get(f, 'name'),
        status: 'done',
        url: objectPath.get(f, 'url') || blobUrl,
        path: objectPath.get(f, 'path') || objectPath.get(file, 'response.0.path')
      }));
      onChange && onChange(files);
    }
  };
  const uploadButton = (
    <div>
      <img src={'/media/logos/upload.png'} alt="upload icon"></img>
    </div>
  );
  return (
    <>
      <WrapUpload
        name={name}
        headers={{
          Authorization: `Bearer ${getAuthorizedUser()}`
        }}
        action={IMAGE_UPLOAD_URL}
        beforeUpload={beforeUpload}
        listType="picture-card"
        fileList={images}
        onPreview={handlePreview}
        onRemove={handleRemove}
        onChange={handleChange}>
        {fileList.length >= max ? null : uploadButton}
      </WrapUpload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
}

ListImageUpload.defaultProps = {
  name: 'files',
  max: 1
};

ListImageUpload.propTypes = {
  name: PropsType.string,
  onChange: PropsType.func.isRequired,
  fileList: PropsType.array.isRequired,
  max: PropsType.number.isRequired
};
