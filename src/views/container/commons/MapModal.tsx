import React from 'react';
import { connect } from 'react-redux';
import { ModalProps } from 'antd/es';

import AntModal from '~/views/presentation/ui/modal/AntModal';
import { GOOGLE_MAP_API_KEY } from '~/configs';

type AddressInfoMapModal = { address: string; lat?: number; lng?: number };

type MapModalProps = ModalProps & {
  address: string | AddressInfoMapModal; // full address or lat, lng
  modalShow: boolean;
  setModalShow: (modalShow: boolean) => void;
  description?: string | AddressInfoMapModal;
  allowFullScreen?: boolean;
  actions?: React.ReactNode;
};

const MapModal: React.FC<MapModalProps> = (props) => {
  const getDescription = () => {
    if (typeof props.description === 'string') return props.description;
    else if (props.description?.address) return props.description?.address;
    else return '';
  };
  const getAddressMap = () => {
    if (typeof props.address === 'object')
      if (props.address?.lat && props.address?.lng) return `${props.address?.lat},${props.address?.lng}`;
      else return props.address?.address;
    else return props.address;
  };

  return (
    <AntModal
      title={props.title}
      description={getDescription()}
      width={props.width || 700}
      modalShow={props.modalShow}
      destroyOnClose
      onOk={() => {}}
      onCancel={() => props.setModalShow(false)}>
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAP_API_KEY}&q=${getAddressMap()}&zoom=18`}
        width="100%"
        title="map"
        height="500"
        style={{ border: 'none', alignSelf: 'center' }}
        allowFullScreen={props.allowFullScreen}
        loading="lazy"></iframe>
      {props.actions}
    </AntModal>
  );
};

export default connect(
  (state: any) => ({
    user: state['authUser'].user
  }),
  {}
)(MapModal);
