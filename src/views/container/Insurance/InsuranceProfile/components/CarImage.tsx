import { Col, Form, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { MUploadImageNoCropMultiple } from '~/views/presentation/fields/upload';
import LayoutForm from '~/views/presentation/layout/forForm';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

type CarImageProps = { type: string };

const CarImage: React.FC<CarImageProps> = (props) => {
  const { t }: any = useTranslation();
  const { width } = useWindowSize();
  const params = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [imageFiles, setImageFiles] = useState<string[]>([]);

  useEffect(() => {}, []);

  const noteList = [t('frontRightAngle'), t('backRightAngle'), t('frontLeftAngle'), t('BackLeftAngle')];

  const onImageChange = () => {};

  return (
    <div>
      <LayoutForm title={t('carImage')} description={t('')}>
        <Row>
          <Col sm={24} md={11} lg={11} className="mb-10">
            <SVG
              src={toAbsoluteUrl('/media/svg/logos/insurance-car.svg')}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Col>
          <Col sm={24} md={2} lg={2}></Col>
          <Col sm={24} md={11} lg={11} className="mb-10">
            {noteList.map((note, index) => (
              <span key={index}>
                {`${index + 1}. ${note}`}
                <br />
              </span>
            ))}
          </Col>

          <Col sm={24} md={24} lg={24}>
            <MUploadImageNoCropMultiple
              name="otherImages"
              noLabel
              noPadding
              label=""
              fileList={imageFiles}
              onImageChange={onImageChange}
              maximumUpload={4}
              maxCount={4}
              required
            />
          </Col>
        </Row>
      </LayoutForm>
    </div>
  );
};

export default connect(null, {})(CarImage);
