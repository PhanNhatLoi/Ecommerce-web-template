import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import { SaveAndPrintBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import PrintForm from '../components/PrintForm';

const AntModalStyled = styled(AntModal)`
  .ant-modal-header {
    @media print {
      visibility: hidden;
    }
  }
`;

type PrintModalProps = {
  orderId: any;
  modalShow: any;
  setModalShow: any;
};

const PrintModal: React.FC<PrintModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [loading, setLoading] = useState<Boolean>(false);

  const handleCancel = () => {
    props.setModalShow(false);
  };

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
    @media print {
      @page {
        size: auto;
      }
      .print-form {
        position: absolute;
        left: 0;
        top: 0;
      }
      .print-title {
        font-size: 2.5rem !important
      }
      .print-shipping {
        font-size: 2.5rem !important
      }
      .print-product {
        font-size: 2.5rem !important;
        margin: 20px 0 !important
      }
      .print-total {
        text-align: center !important;
      }
      .print-total .print-total-title {
        font-size: 2.8rem !important;
      }
      .print-total .print-total-amount {
        font-size: 3.5rem !important;
        margin-top: 15px !important
      }
      .print-total .print-total-confirm {
        font-size: 2rem !important
      }
    }
  `,
    onBeforePrint: () => setLoading(true),
    onAfterPrint: () => setLoading(false)
  });

  return (
    <HOC>
      <AntModalStyled title={t('print')} description={t('')} width={550} destroyOnClose modalShow={props.modalShow} onCancel={handleCancel}>
        <div ref={componentRef}>
          <PrintForm orderId={props.orderId} />
        </div>
        <Divider className="d-print-none" />
        <div className="d-print-none d-flex align-items-center justify-content-center">
          <SaveAndPrintBtn label="print" onClick={handlePrint} loading={loading} htmlType="button" />
        </div>
      </AntModalStyled>
    </HOC>
  );
};

export default connect(null, {})(PrintModal);
