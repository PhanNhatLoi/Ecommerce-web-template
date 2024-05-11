import { CloseOutlined } from '@ant-design/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Divider from '~/views/presentation/divider';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AntModal from '~/views/presentation/ui/modal/AntModal';

const WizardModal = (props) => {
  const { t } = useTranslation();

  return (
    <AntModal //
      title={t('wizard_title')}
      description=""
      width={500}
      modalShow={props.modalShow}
      destroyOnClose
      onCancel={() => props.setModalShow(false)}>
      <div style={{ minHeight: '500px' }}>
        {props.data.map((item) => {
          return (
            <div key={item?.id}>
              <div className="text-left text-muted">{item?.question}</div>
              {(item?.answer?.content || []).map((rep, i) => (
                <div key={i} className="text-right">
                  {rep}
                </div>
              ))}
              <Divider />
            </div>
          );
        })}
      </div>
      <div className="text-center mt-5">
        <AButton
          style={{ verticalAlign: 'middle', width: '200px' }}
          className="mt-3 mt-lg-0 ml-lg-3 px-5"
          size="large"
          type="ghost"
          onClick={() => props.setModalShow(false)}
          icon={<CloseOutlined />}>
          {t('cancel')}
        </AButton>
      </div>
    </AntModal>
  );
};

export default WizardModal;
