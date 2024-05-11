import { CloseOutlined } from '@ant-design/icons';
import { Form, Tabs } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { packageActions } from '~/state/ducks/insurance/package';
import Divider from '~/views/presentation/divider';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import Step1 from '../../PackageManagement/components/Step1';
import Step2 from '../../PackageManagement/components/Step2';
import Step3 from '../../PackageManagement/components/Step3';

const { TabPane } = Tabs;

type PackageModalProps = {
  packageId: number;
  modalShow: boolean;
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  getPackageDetail: any;
};

export const PackageModal: React.FC<PackageModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState<any>();
  const [formValues, setFormValues] = useState<any>();

  useEffect(() => {
    if (props.packageId) {
      setLoading(true);
      props
        .getPackageDetail(props.packageId)
        .then((res: any) => {
          const response = res?.content;
          form.setFieldsValue({
            name: response?.name,
            packageType: response?.packageType,
            banner: response?.banner,
            informationSubject: response?.informationSubject,
            details: response?.details,
            policies: response?.policies,
            informationFee: response?.informationFee
          });
          setBannerFile(firstImage(response?.banner));
          setFormValues(response);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('🚀chiendev ~ file: InfoForm.tsx:34 ~ useEffect ~ err:', err);
          setLoading(false);
        });
    }
  }, [props.packageId]);

  const steps = [
    {
      title: t('generalInfo'),
      content: <Step1 viewEditForm={form} allowEdit={false} bannerFile={bannerFile} setBannerFile={setBannerFile} formValues={formValues} />
    },
    {
      title: t('policy'),
      content: <Step2 viewEditForm={form} allowEdit={false} formValues={formValues} />
    },
    {
      title: t('insuranceFee'),
      content: <Step3 viewEditForm={form} allowEdit={false} formValues={formValues} />
    }
  ];

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={t('selectInsurancePackage')}
      description={''}
      width={1000}
      destroyOnClose
      modalShow={props.modalShow}
      setModalShow={props.setModalShow}
      onCancel={handleCancel}>
      <Form {...ANT_FORM_SEP_LABEL_LAYOUT} form={form} name={'view'}>
        <ASpinner spinning={loading}>
          <Tabs defaultActiveKey="0" type="card">
            {steps.map((step, index) => (
              <TabPane tab={t(step.title)} key={index}>
                <div className="mt-10">{step.content}</div>
              </TabPane>
            ))}
          </Tabs>
        </ASpinner>

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
      </Form>
    </AntModal>
  );
};

export default connect(null, {
  getPackageDetail: packageActions.getPackageDetail
})(PackageModal);
