import { Popconfirm } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { toAbsoluteUrl } from '~/views/utilities/helpers/metronic/AssetsHelpers';

function PopConfirmDel(props) {
  const { t } = useTranslation();
  const [popConfirmVisible, setPopConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <Popconfirm
      placement="topRight"
      visible={popConfirmVisible}
      okText={t('yes')}
      cancelText={t('no')}
      okButtonProps={{ loading: confirmLoading, size: 'default' }}
      cancelButtonProps={{ disabled: confirmLoading, size: 'default', type: 'dashed' }}
      title={t('deleteRowConfirm')}
      onConfirm={() => {
        setConfirmLoading(true);
        props
          .deleteApi(props.row.id)
          .then((res) => {
            props.setNeedLoadNewData(true);
            setPopConfirmVisible(false);
            setConfirmLoading(false);
          })
          .catch((err) => {
            console.error(err);
            AMessage.error(t('delete_error'));
            setPopConfirmVisible(false);
            setConfirmLoading(false);
          });
      }}
      onCancel={() => {
        setPopConfirmVisible(false);
      }}>
      <button title="Delete" className="btn btn-icon btn-light btn-hover-danger btn-sm" onClick={() => setPopConfirmVisible(true)}>
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG src={toAbsoluteUrl('/media/svg/icons/General/Trash.svg')} />
        </span>
      </button>
    </Popconfirm>
  );
}
export default PopConfirmDel;
