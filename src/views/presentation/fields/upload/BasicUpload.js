import { CloseCircleFilled, UploadOutlined } from '@ant-design/icons';
import { Form, Upload } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { IMAGE_UPLOAD_URL } from '~/configs';
import { getAuthorizedUser } from '~/state/utils/session';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { commonValidate } from '~/views/utilities/ant-validation';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const UploadWrapStyled = styled.div`
  .ant-form-item-control-input-content span {
    display: flex;
  }
  .ant-upload-list-item {
    margin-top: 0px !important;
    margin-left: 8px;
  }
  .ant-upload-list {
    display: block;
    flex-wrap: wrap;
    align-items: center;
  }
`;

const MBasicUpload = (props) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState(props?.fileList || []);
  let rules = [];
  if (props.required !== false) {
    rules = commonValidate();
  }

  useEffect(() => {
    if (props.fileList?.length > 0) {
      if (Array.isArray(props.fileList))
        setFileList(
          props.fileList.map((f) => {
            return {
              uid: f.uid,
              name: f.name,
              url: firstImage(f.url),
              path: f,
              loaded: true
            };
          })
        );
      else
        setFileList(
          props.fileList.split('|').map((f) => {
            return {
              uid: f.uid,
              name: f.name,
              url: firstImage(f.url),
              path: f,
              loaded: true
            };
          })
        );
    } else setFileList([]);
    // eslint-disable-next-line
  }, [props.fileList]);

  const onFileChange = ({ fileList }) => {
    setFileList(fileList);
    props.onImageChange(
      fileList.map((f) => {
        if (f?.url)
          return {
            uid: f?.uid,
            url: f?.path,
            name: f?.name
          };
        else {
          const f1 = head(f?.response);
          return { uid: f?.uid, url: f1?.path, name: f1?.originalName };
        }
      })
    );
  };

  return (
    <UploadWrapStyled
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
      <p style={{ fontSize: '12px' }}>{props.label || t('upload_profile')}</p>
      <Form.Item name={props.name || 'MUpload'} rules={rules}>
        <Upload
          headers={{ Authorization: `Bearer ${getAuthorizedUser()}` }}
          multiple
          showUploadList={{
            showRemoveIcon: true,
            removeIcon: <CloseCircleFilled className="text-muted" />
          }}
          name="files"
          action={IMAGE_UPLOAD_URL}
          onChange={onFileChange}
          maxCount={props.maxCount}
          accept={props.accept || ''}
          fileList={fileList}
          disabled={props.disabled}>
          <AButton
            className="d-flex align-items-center justify-content-center"
            type="primary"
            icon={<UploadOutlined />}
            disabled={fileList.length >= (props.maximumUpload || 5)}
          />
        </Upload>
      </Form.Item>
    </UploadWrapStyled>
  );
};

export default MBasicUpload;
