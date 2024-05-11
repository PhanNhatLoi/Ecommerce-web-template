import React from 'react';
import { useTranslation } from 'react-i18next';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { ACCEPT_FILE_UPLOAD } from '~/configs/upload';
import { MTextArea } from '~/views/presentation/fields/input';
import { MBasicUpload } from '~/views/presentation/fields/upload';
import ATypography from '~/views/presentation/ui/text/ATypography';

import * as Types from '../Type';

type Props = {
  documentFile: Types.documentFileType[];
  onContractChange: (file: Types.documentFileType) => void;
};
const DeliveryNote = (props: Props) => {
  const { t }: any = useTranslation();
  return (
    <div>
      {' '}
      <div className="d-print-none">
        <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
          {t('note_delivery')}
        </ATypography>
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} type="secondary">
          {t('note_delivery_des')}
        </ATypography>
      </div>
      <div className="row">
        <div className="d-print-none col-3">{t('license')}</div>
        <div className="d-print-none col-9">
          <MBasicUpload //
            name="licenseFile"
            noPadding
            maximumUpload
            label={t('upload_license')}
            fileList={props.documentFile}
            onImageChange={props.onContractChange}
            accept={ACCEPT_FILE_UPLOAD.join(',')}
            required={false}
          />
        </div>
        <div className="col-3">{t('note')}</div>
        <div className="col-9">
          <MTextArea name="note" hasFeedback={false} hasLayoutForm noPadding noLabel rows={4} />
        </div>
      </div>
    </div>
  );
};

export default DeliveryNote;
