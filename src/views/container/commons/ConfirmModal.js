import { Input, Modal } from 'antd/es';
import { isNil } from 'lodash-es';
import React, { useState } from 'react';

export const ConfirmModal = (
  props = {
    title: undefined,
    content: undefined,
    onConfirm,
    okText,
    cancelText,
    isNeedReason
  }
) => {
  const { title, content, okText = 'Đồng ý', cancelText = 'Huỷ', onConfirm, isNeedReason = false, children } = props;

  const { TextArea } = Input;

  const [visible, setVisible] = useState(false);
  const [reason, setReason] = useState('');

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => {
          setVisible(true);
        }
      })}
      <Modal
        title={title}
        visible={visible}
        cancelText={cancelText}
        okText={okText}
        onOk={() => {
          setVisible(false);
          onConfirm && onConfirm(reason);
        }}
        okButtonProps={{ disabled: isNeedReason && !(!isNil(reason) && reason.trim().length > 0) }}
        onCancel={() => {
          setVisible(false);
        }}>
        {isNeedReason ? (
          <div>
            <p className="p-0 mb-2" style={{ width: 350 }}>
              {content}
            </p>
            <TextArea rows={2} autoFocus placeholder="Nhập lý do..." onChange={(e) => setReason(e.target.value)} />
          </div>
        ) : (
          content
        )}
      </Modal>
    </>
  );
};
