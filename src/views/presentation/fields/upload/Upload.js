import { EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Tooltip, Upload } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IMAGE_UPLOAD_URL } from '~/configs';
import { getAuthorizedUser } from '~/state/utils/session';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthFile from '~/views/presentation/ui/file/AuthFile';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AuthVideo from '~/views/presentation/ui/video/AuthVideo';
import { commonValidate } from '~/views/utilities/ant-validation';
import { firstImage } from '~/views/utilities/helpers/utilObject';

function MUpload(props) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [fileList, setFileList] = useState(props?.fileList || []);
  const [previewFile, setPreviewFile] = useState();

  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  const onFileChange = ({ fileList }) => {
    setFileList(fileList);
    props.onImageChange(
      fileList?.length > 0
        ? fileList?.map((f) => {
            if (f?.url)
              return {
                uid: f?.uid,
                url: f?.path?.url,
                name: f?.name || f?.path?.name,
                type: f?.type
              };
            else {
              const f1 = head(f?.response);
              return { uid: f?.uid, url: f1?.path, name: f1?.originalName || f1?.path, type: f1?.typeMedia };
            }
          })
        : []
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
              name: f?.name || f?.url,
              url: firstImage(f?.url),
              path: f,
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
              name: f?.name || f?.url,
              url: firstImage(f?.url),
              path: f,
              type: f?.type,
              loaded: true
            };
          })
        );
    }
    // eslint-disable-next-line
  }, [props.fileList?.length]);

  const handleGetDocument = (file) => <AuthFile src={firstImage(head(file?.response)?.path)} isAuth={true}></AuthFile>;

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
          itemRender={(originNode, file, currFileList) => {
            return (
              <span>
                {file.status === 'error' ? (
                  <Tooltip title="Upload Error">{originNode.props.children}</Tooltip>
                ) : (
                  <>
                    <AButton style={{ textAlign: 'left' }} type="link">
                      {originNode}
                    </AButton>
                  </>
                )}
              </span>
            );
          }}
          onPreview={(file) => {
            setPreviewFile(file);
            setShowModal(true);
          }}
          onRemove={() => {
            setPreviewFile(undefined);
          }}
          headers={{ Authorization: `Bearer ${getAuthorizedUser()}` }}
          multiple
          maxCount={props.maxCount}
          disabled={props.disabled}
          name="files">
          {(fileList.length < (props.maximumUpload || 5) || props.alwayShowUploadBtn) && (
            <AButton disabled={props.disabled} icon={<UploadOutlined />}>
              {t('clickToUpload')}
            </AButton>
          )}
        </Upload>
      </Form.Item>
      <Modal
        footer={null}
        centered={props.isModalCenter || false}
        width={1000}
        title={props.previewModalTitle || t('preview')}
        open={showModal}
        onCancel={() => {
          setPreviewFile(undefined);
          setShowModal(false);
        }}>
        {[previewFile?.type, head(previewFile?.response)?.typeMedia]?.includes('VIDEO') ? (
          <AuthVideo isAuth={true} src={previewFile?.url || firstImage(head(previewFile?.response)?.path)} />
        ) : (
          <AuthImage
            preview={{
              mask: <EyeOutlined />
            }}
            isAuth={true}
            src={previewFile?.url || firstImage(head(previewFile?.response)?.path)}
          />
        )}
      </Modal>
    </div>
  );
}

export default MUpload;
