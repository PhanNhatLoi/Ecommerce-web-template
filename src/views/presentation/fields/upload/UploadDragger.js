import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Form, Modal } from 'antd/es';
import { head } from 'lodash-es';
import { useTranslation } from 'react-i18next';

import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AuthUpload from './AuthUpload';
import { DEFAULT_AVATAR } from '~/configs/default';
import { IMAGE_UPLOAD_URL } from '~/configs';
import { commonValidate } from '~/views/utilities/ant-validation';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { getAuthorizedUser } from '~/state/utils/session';

const DraggerWrap = styled(Form.Item)`
  .ant-upload.ant-upload-drag {
    display: ${(props) => (props.fileList.length < props.maxCount ? 'block' : 'none')};
    width: 170px !important;
    height: 150px !important;
  }
`;

function MUploadDragger(props) {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState(props?.fileList || []);
  const [previewFile, setPreviewFile] = useState();

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
              url: f,
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
              url: f,
              path: f,
              loaded: true
            };
          })
        );
    }
    // eslint-disable-next-line
  }, [props?.fileList?.length]);

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
      <DraggerWrap
        fileList={fileList}
        maxCount={props.maxCount || 1}
        label={props.label || ''}
        name={props.name || 'dragAndDrop'}
        extra={props.extra}
        rules={rules}>
        <Upload.Dragger
          action={IMAGE_UPLOAD_URL}
          onChange={onFileChange}
          beforeUpload={props.beforeUpload}
          maxCount={props.maxCount || 1}
          accept={props.accept || ''}
          listType={props.listType || 'picture-card'}
          fileList={fileList}
          onPreview={(file) => setPreviewFile(file)}
          headers={{ Authorization: `Bearer ${getAuthorizedUser()}` }}
          multiple
          itemRender={(originNode, file) => {
            let src = file.url ? firstImage(file.url) : DEFAULT_AVATAR;
            if (file.response) {
              src = firstImage(head(file?.response)?.path);
            }
            return props.noToken ? (
              originNode
            ) : (
              <AuthUpload //
                src={src}
                remove={() => handleRemoveImage(file.uid)}></AuthUpload>
            );
          }}
          name="files">
          {fileList.length < (props.maxCount || 1) && (
            <>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{props.uploadText || t('uploadText')}</p>
              <p className="ant-upload-hint">{props.uploadHint !== undefined ? props.uploadHint : t('uploadHint')}</p>
            </>
          )}
        </Upload.Dragger>
      </DraggerWrap>

      <Modal
        footer={null}
        centered={props.isModalCenter || false}
        width={1000}
        title={props.previewModalTitle || t('preview')}
        visible={Boolean(previewFile)}
        onCancel={() => setPreviewFile(undefined)}>
        <AuthImage isAuth={true} src={firstImage(head(previewFile?.response)?.path)} />
      </Modal>
    </div>
  );
}
export default MUploadDragger;
