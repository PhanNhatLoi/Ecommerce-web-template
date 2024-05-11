import { UploadOutlined } from '@ant-design/icons';
import { Form, Upload } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IMAGE_UPLOAD_URL } from '~/configs';
import { getAuthorizedUser } from '~/state/utils/session';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { commonValidate } from '~/views/utilities/ant-validation';
import { firstImage } from '~/views/utilities/helpers/utilObject';

function MUploadDocument(props) {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState(props?.fileList || []);

  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  const onFileChange = ({ fileList }) => {
    setFileList(fileList);
    props.onImageChange(
      fileList.map((f) => {
        if (f?.url)
          return {
            uid: f?.uid,
            url: f?.path,
            name: f?.name,
            type: f?.type
          };
        else {
          const f1 = head(f?.response);
          return { uid: f?.uid, url: f1?.path, name: f1?.originalName, type: f1?.typeMedia };
        }
      })
    );
  };

  // if fileList available
  // => fileList format: {type:'...', url:'...'}
  useEffect(() => {
    if (props.fileList?.length > 0) {
      if (Array.isArray(props.fileList)) {
        setFileList(
          props.fileList.map((f) => {
            return {
              uid: f?.uid,
              name: f?.name || f?.url?.split('/')[f?.url?.split('/').length - 1],
              url: firstImage(f?.url),
              path: f?.url,
              type: f?.type,
              loaded: true
            };
          })
        );
      } else
        setFileList(
          props.fileList.split('|').map((f) => {
            return {
              uid: f?.uid,
              name: f?.name || f?.url?.split('/')[f?.url?.split('/').length - 1],
              url: firstImage(f?.url),
              path: f?.url,
              type: f?.type,
              loaded: true
            };
          })
        );
    }
    // eslint-disable-next-line
  }, [props.fileList?.length]);

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
      {props.copyBtn || <></>}
      <Form.Item label={props.label || 'MUpload'} name={props.name || 'MUpload'} {...props} rules={rules}>
        <Upload
          action={IMAGE_UPLOAD_URL}
          onChange={onFileChange}
          accept={props.accept || ''}
          fileList={fileList}
          headers={{ Authorization: `Bearer ${getAuthorizedUser()}` }}
          multiple
          maxCount={props.maxCount}
          disabled={props.disabled}
          name="files">
          {fileList.length < (props.maximumUpload || 5) && <AButton icon={<UploadOutlined />}>{t('clickToUpload')}</AButton>}
        </Upload>
      </Form.Item>
    </div>
  );
}

export default MUploadDocument;
