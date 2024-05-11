import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { packageActions } from '~/state/ducks/insurance/package';
import HOC from '~/views/container/HOC';
import { BackBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';

import StepProgressForm from '../components/StepProgressForm';

type InfoFormProps = {
  createPackage: any;
};

const InfoForm: React.FC<InfoFormProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<any>();

  const onFinish = () => {
    setIsSubmitting(true);

    let body = {
      name: formValues?.name,
      banner: formValues?.banner,
      packageType: formValues?.packageType,
      informationSubject: formValues?.informationSubject,
      details: formValues?.details,
      policies: formValues?.policies,
      informationFee: formValues?.informationFee,
      index: 0
    };

    props
      .createPackage(body)
      .then(() => {
        history.push(PATH.INSURANCE_PACKAGE_LIST_PATH);
        AMessage.success(t('create_insurance_package_success'));
        setIsSubmitting(false);
      })
      .catch(() => {
        AMessage.error(t('create_insurance_package_fail'));
        setIsSubmitting(false);
      });
  };

  return (
    <HOC>
      <BCard>
        <CardHeader
          titleHeader={t('add_insurance_package')}
          btn={
            <div>
              <BackBtn
                onClick={() => {
                  history.push(PATH.INSURANCE_PACKAGE_LIST_PATH);
                }}
              />
            </div>
          }></CardHeader>
        <CardBody>
          <StepProgressForm onFinish={onFinish} formValues={formValues} setFormValues={setFormValues} isSubmitting={isSubmitting} />
        </CardBody>
      </BCard>
    </HOC>
  );
};

export default connect(null, {
  createPackage: packageActions.createPackage
})(InfoForm);
