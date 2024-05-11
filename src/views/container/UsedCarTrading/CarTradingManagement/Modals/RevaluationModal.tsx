import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import HOC from '~/views/container/HOC';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import VehicleInfo from '../components/VehicleInfo';
import { BackBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { CloseOutlined, DollarOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Divider from '~/views/presentation/divider';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { TYPOGRAPHY_TYPE } from '~/configs';

type RevaluationModalProps = {
  modalShow: boolean;
  setModalShow: any;
};

const ABtnStyled = styled(AButton)`
  .anticon {
    display: inline-flex !important;
    align-items: center !important;
  }
`;

export const RevaluationModal: React.FC<RevaluationModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <HOC>
      <AntModal
        title={t('revaluation')}
        description={''}
        width={1000}
        destroyOnClose
        modalShow={props.modalShow}
        setModalShow={props.setModalShow}
        onCancel={handleCancel}>
        <Form {...ANT_FORM_SEP_LABEL_LAYOUT} form={form}>
          <VehicleInfo form={form} loading={false} allowEdit={true} isRevaluationModal={true} />

          <Divider />

          <div className="d-flex justify-content-center align-items-center text-center h-50">
            <div className="p-5" style={{ borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={1}>
                {/* {numberFormatDecimal(totalAccess)} */}N/A
              </ATypography>
            </div>
          </div>

          <Divider />

          <div className="d-flex flex-wrap justify-content-center align-item-center">
            <ABtnStyled
              style={{ verticalAlign: 'middle', width: '200px' }}
              className="mt-3 mt-lg-0 ml-lg-3 px-5"
              size="large"
              type="ghost"
              onClick={handleCancel}
              icon={<CloseOutlined />}>
              {t('close')}
            </ABtnStyled>
            <ABtnStyled
              style={{ verticalAlign: 'middle', width: '200px' }}
              className="mt-3 mt-lg-0 ml-lg-3 px-5"
              size="large"
              type="primary"
              onClick={() => {}}
              icon={<DollarOutlined />}>
              {t('revaluation')}
            </ABtnStyled>
          </div>
        </Form>
      </AntModal>
    </HOC>
  );
};

export default connect(null, {})(RevaluationModal);
