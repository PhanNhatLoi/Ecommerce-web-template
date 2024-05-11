import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { Form, FormInstance, ModalProps } from 'antd/es';
import React, { useEffect, useState } from 'react';
import Geocode from 'react-geocode';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { GOOGLE_MAP_API_KEY } from '~/configs';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ATypography from '~/views/presentation/ui/text/ATypography';

import Marker from './Maker';
import Map from './Map';

const AntdModalStyled = styled(AntModal)`
  @media (max-width: 767px) {
    max-width: 100%;
    margin: 8px auto;
  }
`;

const MapStyled = styled.div`
  .marker_label {
    width: 200px;
    border-radius: 5px;
    height: 0px;
    font-size: 14px;
    position: relative;
    text-align: left;
    left: 116px;
    bottom: 10px;
    white-space: pre-line;
  }
  .btn_current_location {
    background: none rgb(255, 255, 255);
    border: 0px;
    margin: 10px;
    padding: 0px;
    text-transform: none;
    appearance: none;
    position: absolute;
    cursor: pointer;
    user-select: none;
    border-radius: 2px;
    height: 40px;
    width: 40px;
    box-shadow: rgb(0 0 0 / 30%) 0px 1px 4px -1px;
    overflow: hidden;
    bottom: 180px;
    right: 0px;
  }
`;

type MapFullCustomModalProps = ModalProps & {
  description?: string;
  modalShow: boolean | { lat: number; lng: number };
  setModalShow: (modalShow: boolean) => void;
  formParent: FormInstance<any>;
  setAddress: React.Dispatch<React.SetStateAction<any>>;
};

const MapFullCustomModal: React.FC<MapFullCustomModalProps> = (props) => {
  const { t }: any = useTranslation();

  const [clickTooFast, setClickTooFast] = useState(false);

  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 16.39, lng: 107.79 });

  const [addressPoint, setAddressPoint] = useState<{ lat: number; lng: number; fullAddress: string }>();

  useEffect(() => {
    if (typeof props.modalShow === 'object') {
      setCenter(props.modalShow);
      setClicks([new google.maps.LatLng(props.modalShow.lat, props.modalShow.lng)]);
      setZoom(15);
    }
  }, [props.modalShow]);

  // Address form
  const [form] = Form.useForm();

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    // setClicks([...clicks, e.latLng!]);
    setClicks([e.latLng!]);
    setAddressPoint(undefined);
  };

  const onIdle = (m: google.maps.Map) => {
    if (m) {
      setZoom(m.getZoom()!);
      setCenter(m.getCenter()!.toJSON());
    }
  };

  const handleGetCurrentLocation = () => {
    if (clickTooFast) return alert('Please wait 5 seconds before clicking again');
    else {
      setClickTooFast(true);
      setTimeout(() => {
        setClickTooFast(false);
      }, 5000);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          let zoomCal = 16;
          if (position.coords.accuracy > 100) zoomCal = 15;
          if (position.coords.accuracy > 900) zoomCal = 14;
          if (position.coords.accuracy > 1800) zoomCal = 13;
          if (position.coords.accuracy > 3600) zoomCal = 12;
          if (position.coords.accuracy > 4800) zoomCal = 11;
          setZoom(zoomCal);
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setClicks([new google.maps.LatLng(position.coords.latitude, position.coords.longitude)]);
        },
        (error) => {
          AMessage.error(t('location_permission_denied'));
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleDetectLocation = async () => {
    const laglng = clicks[0];
    let response;
    try {
      response = await Geocode.fromLatLng(laglng?.lat().toString(), laglng?.lng().toString());
    } catch (error) {
      console.error('handleDetectLocation', error);
    }
    props.setAddress((prev) => {
      return { ...prev, lat: laglng?.lat(), lng: laglng?.lng() };
    });
    props.setModalShow(false);
  };

  return (
    <AntdModalStyled
      title={props.title}
      width={886}
      description={props.description}
      modalShow={props.modalShow}
      destroyOnClose
      onOk={() => {}}
      onCancel={() => {
        setClicks([]);
        setAddressPoint(undefined);
        setClickTooFast(false);
        form.resetFields();
        props.setModalShow(false);
      }}>
      <MapStyled className="d-flex position-relative" style={{ height: addressPoint ? 0 : '65vh' }}>
        <Wrapper
          apiKey={GOOGLE_MAP_API_KEY}
          render={(status: Status) => {
            return <h1>{status}</h1>;
          }}>
          <Map
            disableDoubleClickZoom={false}
            fullscreenControl={true}
            center={center}
            onClick={onClick}
            onIdle={onIdle}
            zoom={zoom}
            style={{ flexGrow: '1', height: '100%' }}>
            {clicks.map((latLng, i) => (
              <Marker
                //
                key={i}
                position={latLng}
                label={{
                  text: `${latLng.lat()},\n${latLng.lng()}`,
                  className: 'marker_label'
                }}
                opacity={1}
                draggable
              />
            ))}
          </Map>
        </Wrapper>
        <AButton
          className="btn_current_location"
          onClick={handleGetCurrentLocation}
          icon={<i className="fa fa-location-arrow" style={{ color: '#000', fontSize: 32 }} />}
        />
      </MapStyled>

      <div className="d-flex w-100 justify-content-end align-items-center mt-5">
        <ATypography className="mr-3 text-end">
          <i className="fa fa-info mr-2" /> {t('this_is_your_location')}
        </ATypography>
        <AButton disabled={!clicks.length} type="primary" size="large" onClick={handleDetectLocation}>
          {t('confirm')}
        </AButton>
      </div>
    </AntdModalStyled>
  );
};

export default MapFullCustomModal;
