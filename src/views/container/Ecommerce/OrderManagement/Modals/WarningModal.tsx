import { CloseOutlined } from '@ant-design/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AntModal from '~/views/presentation/ui/modal/AntModal';

type WarningModalProps = {
  modalShow: boolean;
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
};

export const WarningModal: React.FC<WarningModalProps> = (props) => {
  const { t }: any = useTranslation();

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <HOC>
      <AntModal
        title={t('noticeModalTitle')}
        description={''}
        width={500}
        destroyOnClose
        modalShow={props.modalShow}
        setModalShow={props.setModalShow}
        onCancel={handleCancel}>
        {
          <div>
            <span className="d-flex align-items-center justify-content-center">{t('noticePackagedContent')}</span>
            <Divider />
            <div className="d-flex align-items-center justify-content-center">
              <AButton
                style={{ verticalAlign: 'middle', width: '200px' }}
                className="mt-3 mt-lg-0 ml-lg-3 px-5"
                size="large"
                type="ghost"
                onClick={handleCancel}
                icon={<CloseOutlined />}>
                {t('close')}
              </AButton>
            </div>
          </div>
        }
      </AntModal>
    </HOC>
  );
};

export default WarningModal;
