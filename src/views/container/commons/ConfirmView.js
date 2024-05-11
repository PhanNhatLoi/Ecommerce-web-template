import { Input, Popconfirm, Tooltip } from 'antd/es';
import { isNil } from 'lodash-es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ConfirmView = (
  props = {
    tooltip: undefined,
    confirmTitle: undefined,
    onConfirm,
    okText,
    cancelText,
    isNeedReason
  }
) => {
  const { t } = useTranslation();
  const {
    children,
    tooltip,
    confirmTitle,
    okText = t('okTextConfirm'),
    cancelText = t('cancelTextConfirm'),
    onConfirm,
    isNeedReason = false
  } = props;

  const [reason, setReason] = useState('');
  const { TextArea } = Input;

  const childrenView = !isNil(tooltip) ? (
    <Tooltip placement="right" title={tooltip}>
      {children}
    </Tooltip>
  ) : (
    children
  );

  return confirmTitle ? (
    <Popconfirm
      placement="topRight"
      title={
        isNeedReason ? (
          <div>
            <p className="p-0 mb-2" style={{ width: 350 }}>
              {confirmTitle}
            </p>
            <TextArea rows={2} autoFocus placeholder="Nhập lý do..." onChange={(e) => setReason(e.target.value)} />
          </div>
        ) : (
          confirmTitle
        )
      }
      onConfirm={() => onConfirm && onConfirm(reason)}
      okButtonProps={{ disabled: isNeedReason && !(!isNil(reason) && reason.trim().length > 0) }}
      okText={okText}
      cancelText={cancelText}>
      {childrenView}
    </Popconfirm>
  ) : (
    childrenView
  );
};
export default ConfirmView;
