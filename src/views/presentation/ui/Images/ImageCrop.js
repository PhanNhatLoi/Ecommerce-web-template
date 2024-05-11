// https://www.npmjs.com/package/react-easy-crop
import React, { useState, useCallback } from 'react';
import { Slider } from 'antd/es';
import Cropper from 'react-easy-crop';
import './styles.css';

export const ImageCrop = (props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels);
  }, []);

  return (
    <div className="App">
      <div className="crop-container">
        <Cropper
          image={props.imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="controls">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => setZoom(zoom)}
          style={{ padding: '22px 0px' }}
        />
      </div>
    </div>
  );
};
