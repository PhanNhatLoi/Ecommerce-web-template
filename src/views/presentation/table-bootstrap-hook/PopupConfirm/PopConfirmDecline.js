import { Popconfirm } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { toAbsoluteUrl } from '~/views/utilities/helpers/metronic/AssetsHelpers';

function PopConfirmApprove(props) {
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
      title={t('decline_row_confirm')}
      onConfirm={() => {
        setConfirmLoading(true);
        props
          .approveApi(props.row.id)
          .then((res) => {
            // setTimeout(() => {
            props.setNeedLoadNewData(true);
            setPopConfirmVisible(false);
            setConfirmLoading(false);
            // TODO: dựa vào tốc độ phản hồi của api để tính thời gian delay
            // }, selectedData.length * 100);
          })
          .catch((err) => {
            console.error(err);
            AMessage.error(t('decline_error'));
            setPopConfirmVisible(false);
            setConfirmLoading(false);
          });
      }}
      onCancel={() => {
        setConfirmLoading(false);
        setPopConfirmVisible(false);
      }}>
      <button title="Approve" className="btn btn-icon btn-light btn-hover-danger btn-sm" onClick={() => setPopConfirmVisible(true)}>
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG src={toAbsoluteUrl('/media/svg/icons/Code/Error-circle.svg')} />
        </span>
      </button>
    </Popconfirm>
  );
}
export default PopConfirmApprove;
