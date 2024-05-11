import { UploadOutlined } from '@ant-design/icons';
import { Form, Tooltip, Upload } from 'antd/es';
import ImgCrop from 'antd-img-crop';
import { head } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IMAGE_UPLOAD_URL } from '~/configs';
import { ACCEPT_IMAGE_UPLOAD } from '~/configs/upload';
import { getAuthorizedUser } from '~/state/utils/session';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { commonValidate } from '~/views/utilities/ant-validation';
import FileUpload from '~/views/utilities/helpers/image';
import { firstImage } from '~/views/utilities/helpers/utilObject';

function UploadImageCropWithBtn(props) {
  const { t } = useTranslation();
  const { beforeUpload } = FileUpload();
  const [fileList, setFileList] = useState(props?.fileList || []);
  const [loading, setLoading] = useState(false);

  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  const onFileChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.every((file) => file.status === 'done')) {
      props.onImageChange(
        fileList.map((f) => {
          if (f?.url) return f.path;
          else {
            const f1 = head(f?.response);
            return f1?.path;
          }
        })
      );
      setLoading(false);
    } else setLoading(true);
  };

  useEffect(() => {
    if (props.fileList?.length > 0) {
      if (Array.isArray(props.fileList))
        setFileList(
          props.fileList.map((f) => {
            return {
              uid: f,
              name: f.split('/')[f.split('/').length - 1],
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
              name: f.split('/')[f.split('/').length - 1],
              url: firstImage(f),
              path: f,
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
      <Form.Item
        label={props.label || 'UploadImageCropWithBtn'}
        name={props.name || 'UploadImageCropWithBtn'}
        rules={rules}
        tooltip={props.tooltip}
        {...props}>
        <ImgCrop
          fillColor={'transparent'} // important
          accept={props.accept || ACCEPT_IMAGE_UPLOAD.join(', ')}
          beforeCrop={beforeUpload}
          rotate
          aspect={props.aspect || 4 / 3}
          grid>
          <Upload
            action={IMAGE_UPLOAD_URL}
            beforeUpload={beforeUpload}
            onChange={onFileChange}
            accept={props.accept.join(', ') || ACCEPT_IMAGE_UPLOAD.join(', ')}
            fileList={fileList}
            disabled={props.disabled}
            itemRender={
              props.itemRender
                ? props.itemRender
                : (originNode, file, currFileList) => (
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
                  )
            }
            headers={{ Authorization: `Bearer ${getAuthorizedUser()}` }}
            multiple
            name="files">
            {(fileList.length < (props.maximumUpload || 5) || props.alwayShowUploadBtn) && (
              <AButton type={props.type} disabled={props.disabled} icon={<UploadOutlined />} loading={loading}>
                {t('clickToUpload')}
              </AButton>
            )}
          </Upload>
        </ImgCrop>
        <Form.Item noStyle>
          <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)', marginTop: 4 }}>{props.helperText}</div>
        </Form.Item>
      </Form.Item>
    </div>
  );
}
export default UploadImageCropWithBtn;
