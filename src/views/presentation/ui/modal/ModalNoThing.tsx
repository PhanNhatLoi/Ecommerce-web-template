import React from 'react';
import { Modal, ModalProps } from 'antd/es';
import { CloseCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const ModalNoThingStyled = styled(Modal)``;

const ModalNoThing: React.FC<ModalProps> = (props) => {
  return (
    <ModalNoThingStyled //
      closeIcon={<CloseCircleOutlined style={{ fontSize: '32px' }} />}
      footer={null}
      {...props}
    />
  );
};

export default ModalNoThing;
