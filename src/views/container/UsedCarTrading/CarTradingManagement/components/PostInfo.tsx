import React from 'react';
import { useTranslation } from 'react-i18next';
import { MCKEditor, MInput, MInputNumber } from '~/views/presentation/fields/input';
import LayoutForm from '~/views/presentation/layout/forForm';
import { VEHICLE_MAX_DATA } from './VehicleInfo';

type PostInfoProps = {
  form: any;
  allowEdit: boolean;
  loading: boolean;
  description: string;
};

const PostInfo: React.FC<PostInfoProps> = (props) => {
  const { t }: any = useTranslation();

  const onDescriptionChange = (data: any) => {
    props.form.setFieldsValue({ description: data });
  };

  return (
    <LayoutForm data-aos="fade-left" data-aos-delay="300" title={t('postInformation')} description={t('')}>
      <div className="row">
        <div className="col-12 mb-4">
          <MInput
            name="title"
            noLabel
            noPadding
            validateStatus={props.loading ? 'validating' : undefined}
            disabled={!props.allowEdit}
            label={t('Title')}
            placeholder={t('Title')}
            maxLength={VEHICLE_MAX_DATA.TITLE}
          />
        </div>

        <div className="col-12 mt-4">
          <MCKEditor
            name="description"
            label={t('description')}
            placeholder={t('description')}
            noLabel
            noPadding
            require={false}
            loading={props.loading}
            disabled={!props.allowEdit}
            mRules={[{ max: VEHICLE_MAX_DATA.DESCRIPTION, message: t('des_max_length_1500') }]}
            value={props.description}
            onChange={onDescriptionChange}
            toolBar={{
              toolbar: {
                items: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'imageUpload']
              }
            }}
          />
        </div>

        <div className="col-12 col-lg-6 mt-4">
          <MInputNumber
            name="price"
            noLabel
            noPadding
            require
            hasFeedback={false}
            controls={false}
            disabled={!props.allowEdit}
            label={`${t('price')} (đ)`}
            placeholder={t('price')}
            max={VEHICLE_MAX_DATA.PRICE}
          />
        </div>
      </div>
    </LayoutForm>
  );
};

export default PostInfo;
