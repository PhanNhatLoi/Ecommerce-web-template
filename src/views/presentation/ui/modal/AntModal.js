import { CloseCircleOutlined, EditFilled } from '@ant-design/icons';
import { Modal } from 'antd/es';
import React from 'react';
import { isMobile } from 'react-device-detect';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { BasicBtn } from '../buttons';

const AntModal = (props) => {
  return (
    <Modal //
      {...props}
      title={
        <div className="py-3 pr-5 d-print-none">
          <div className="d-flex align-items-center mb-2">
            <span style={{ fontSize: '24px' }}>{props.title}</span>
            {props.supportEdit && (
              <AButton
                className="ml-2"
                type="link"
                onClick={props.onEdit}
                icon={<EditFilled style={{ fontSize: '26px', color: '#000' }} />}
              />
            )}
          </div>
          <span className="text-muted" style={{ fontSize: '14px' }}>
            {props.description}
          </span>
        </div>
      }
      closeIcon={<CloseCircleOutlined className="d-print-none" style={{ fontSize: '32px' }} />}
      centered
      footer={null}
      open={props.modalShow || props.visible}
      style={props.style}
      width={isMobile ? '100%' : props.width || 800}
      onCancel={props.onCancel}>
      <div style={{ maxHeight: '75vh', overflow: 'hidden', overflowY: 'auto' }}>{props.children}</div>
    </Modal>
  );
};

export default AntModal;
