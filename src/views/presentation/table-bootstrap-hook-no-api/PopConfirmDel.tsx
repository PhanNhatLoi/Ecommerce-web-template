import { Popconfirm } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { toAbsoluteUrl } from '~/views/utilities/helpers/metronic/AssetsHelpers';

function PopConfirmDel(props) {
  const { t }: any = useTranslation();
  const [popConfirmVisible, setPopConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <Popconfirm
      placement="topRight"
      visible={popConfirmVisible}
      okButtonProps={{ loading: confirmLoading }}
      title={t('deleteRowConfirm')}
      onConfirm={() => {
        props
          .deleteApi(props.row.id)
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
            AMessage.error(t('delete_error'));
            setPopConfirmVisible(false);
            setConfirmLoading(false);
          });
      }}
      onCancel={() => {
        setPopConfirmVisible(false);
      }}
      okText={t('yes')}
      cancelButtonProps={{ disabled: confirmLoading }}
      cancelText={t('no')}>
      <button title="Delete" className="btn btn-icon btn-light btn-hover-danger btn-sm" onClick={() => setPopConfirmVisible(true)}>
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG src={toAbsoluteUrl('/media/svg/icons/General/Trash.svg')} />
        </span>
      </button>
    </Popconfirm>
  );
}
export default PopConfirmDel;
