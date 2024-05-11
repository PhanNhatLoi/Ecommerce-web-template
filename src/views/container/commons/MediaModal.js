import { EyeOutlined } from '@ant-design/icons';
import { Image } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { DEFAULT_AVATAR } from '~/configs/default';
import Divider from '~/views/presentation/divider';
import AuthAudio from '~/views/presentation/ui/audio/AuthAudio';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ATypography from '~/views/presentation/ui/text/ATypography';
import AuthVideo from '~/views/presentation/ui/video/AuthVideo';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const MediaModal = (props) => {
  const { t } = useTranslation();
  const [audioList, setAudioList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [videoList, setVideoList] = useState([]);

  const getFullUrl = (url) => {
    return !url?.includes('http') ? firstImage(url) : url || DEFAULT_AVATAR;
  };

  const getTypeList = (item, type) => {
    if (item?.type === type) {
      return { ...item, url: getFullUrl(item?.url) };
    }
  };

  useEffect(() => {
    if (props.data?.length > 0) {
      setAudioList(props.data.map((item) => getTypeList(item, 'AUDIO')).filter(Boolean));
      setVideoList(props.data.map((item) => getTypeList(item, 'VIDEO')).filter(Boolean));
      setImageList(props.data.map((item) => getTypeList(item, 'IMAGE')).filter(Boolean));
    }
  }, [props.data?.length]);

  return (
    <>
      <AntModal //
        title={t('media')}
        description=""
        width={600}
        modalShow={props.modalShow}
        destroyOnClose
        onCancel={props.onCancel}>
        <div style={{ width: '100%', height: '700' }}>
          <div className="mb-5">
            {imageList?.length > 0 && (
              <>
                <ATypography strong>{t('images')}</ATypography>
                <div className="d-flex align-items-center mt-3 flex-wrap">
                  <Image.PreviewGroup>
                    {imageList.map((image, i) => {
                      return (
                        <AuthImage
                          key={i}
                          className="p-0"
                          preview={{
                            mask: <EyeOutlined />
                          }}
                          width={100}
                          height="auto"
                          isAuth={true}
                          src={image?.url}
                          // onClick={(e) => e.stopPropagation()}
                        />
                      );
                    })}
                  </Image.PreviewGroup>
                </div>
                <Divider />
              </>
            )}
          </div>
          <div className="mb-5">
            {videoList?.length > 0 && (
              <>
                <ATypography className="mb-3" strong>
                  {t('videos')}
                </ATypography>
                <div className="d-flex align-items-center mt-3 flex-wrap">
                  <Image.PreviewGroup>
                    {videoList.map((image, i) => {
                      return (
                        <AuthVideo
                          isAuth={true}
                          width="200px"
                          height="200px"
                          src={image?.url}
                          style={{ objectFit: 'cover', margin: '20px 10px' }}
                          // onClick={(e) => e.stopPropagation()}
                        />
                      );
                    })}
                  </Image.PreviewGroup>
                </div>
                <Divider />
              </>
            )}
          </div>
          <div>
            {audioList?.length > 0 && (
              <>
                <ATypography className="mb-3" strong>
                  {t('audios')}
                </ATypography>
                <div class="d-flex align-items-center flex-wrap">
                  {audioList.map((audio) => (
                    <AuthAudio isAuth={true} src={audio?.url} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </AntModal>
    </>
  );
};

export default connect(null, {})(MediaModal);
