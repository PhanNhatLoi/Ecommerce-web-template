import { CloseOutlined, FileImageOutlined } from '@ant-design/icons';
import { Col, Descriptions, Row, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { mechanicActions } from '~/state/ducks/mechanic';
import { quotationActions } from '~/state/ducks/mechanic/quotation';
import { requestActions } from '~/state/ducks/request';
import MediaModal from '~/views/container/commons/MediaModal';
import Divider from '~/views/presentation/divider';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

const ViewForm = (props) => {
  const { t } = useTranslation();
  const [quotationDetail, setQuotationDetail] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [totalFee, setTotalFee] = useState(0);
  const [mediaModal, setMediaModal] = useState(null);

  useEffect(() => {
    if (Boolean(props.id)) {
      setPageLoading(true);
      props
        .getQuotationDetail(props.id)
        .then((res) => {
          const response = res?.content;
          let _totalFee = 0;
          (response?.items || []).forEach((item) => {
            _totalFee += +item?.price * +item?.quantity;
          });
          setQuotationDetail(response);
          setTotalFee(_totalFee);
          setPageLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
          setPageLoading(false);
        });
    }
  }, [props.id]);

  const handleGetWarranty = (value) => {
    if (value?.guaranteeTime) return { label: t('warrantyTime'), data: `${value?.guaranteeTime} ${t('month')}` };
    else if (value?.guaranteeKm) return { label: t('warrantyKm'), data: `${value?.guaranteeKm} km` };
    else return { label: t('warrantyPolicy'), data: t('noWarranty') };
  };

  return (
    <>
      <Skeleton loading={pageLoading} active>
        <Row>
          <Col md={24} lg={11}>
            <AlignedDescription labelWidth="200px" contentStyle={{ fontSize: '12px' }}>
              <Descriptions.Item label={t('quotation_id')} contentStyle={{ fontSize: '12px' }}>
                <div className="d-flex align-items-center mb-2">
                  <span className="mr-5">{quotationDetail?.id || '-'}</span>
                  <span
                    style={{
                      fontSize: '10px',
                      border: '1px solid #000',
                      color: '#fff',
                      backgroundColor: '#000',
                      padding: '4px 16px'
                    }}>
                    {t(quotationDetail?.status) || '-'}
                  </span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label={t('service')}>
                <div>{quotationDetail?.requestName || '-'}</div>
                <div className="text-muted">{quotationDetail?.requestId || '-'}</div>
              </Descriptions.Item>
              <Descriptions.Item label={t('requester')}>{quotationDetail?.requesterName || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('quoted_by')}>{quotationDetail?.helperName || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('sent_date')}>
                {quotationDetail?.createdDate ? UtilDate.toLocalDateTimeString(quotationDetail?.createdDate) : '-'}
              </Descriptions.Item>
            </AlignedDescription>

            <Divider />

            <AlignedDescription labelWidth="200px" contentStyle={{ fontSize: '12px' }}>
              <Descriptions.Item label={t('media')}>
                <span className="d-flex align-items-center">
                  {Boolean(quotationDetail?.media) && quotationDetail?.media.length > 0 ? (
                    <>
                      <AButton type="primary" icon={<FileImageOutlined />} onClick={() => setMediaModal(quotationDetail?.media)}>
                        {t('view_media')}
                      </AButton>
                      &nbsp; ({quotationDetail?.media.length} {t('items')})
                    </>
                  ) : (
                    <span>{t('no_media')}</span>
                  )}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label={t('quotation_notes')}>{quotationDetail?.description || '-'}</Descriptions.Item>
            </AlignedDescription>
          </Col>

          <Col md={0} lg={1}></Col>

          <Col md={24} lg={12}>
            <div className="mb-5">
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
                {t('quotation_detail')}
              </ATypography>
            </div>
            {quotationDetail?.items?.length > 0 &&
              quotationDetail?.items.map((item) => (
                <div className="mx-5 my-3 p-5" style={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                  <div className="pb-2 w-100 mb-4" style={{ borderBottom: '1px solid #000' }}>
                    <ATypography strong>{item?.name}</ATypography>
                  </div>
                  <div className="pb-2 w-100 mb-4" style={{ borderBottom: '1px solid #000' }}>
                    <div className="row">
                      <div className="col-6">
                        <ATypography strong>
                          {t('price')}: &nbsp;&nbsp;&nbsp;&nbsp; {numberFormatDecimal(+item?.price, ' đ', '')}
                        </ATypography>
                      </div>
                      <div className="col-6">
                        <ATypography strong>
                          {t('quantity')}: &nbsp;&nbsp;&nbsp;&nbsp; {+item?.quantity}
                        </ATypography>
                      </div>
                    </div>
                  </div>
                  <div className="pb-2 w-100 mb-4" style={{ borderBottom: '1px solid #000' }}>
                    <div className="row">
                      <div className="col-6">
                        <ATypography strong>
                          {t('origin')}: &nbsp;&nbsp;&nbsp;&nbsp; {item?.origin || '-'}
                        </ATypography>
                      </div>
                      <div className="col-6">
                        <ATypography strong>
                          {t('unit')}: &nbsp;&nbsp;&nbsp;&nbsp; {item?.unit || '-'}
                        </ATypography>
                      </div>
                    </div>
                  </div>
                  <div className="pb-2 w-100 mb-4" style={{ borderBottom: '1px solid #000' }}>
                    <div className="row">
                      <div className="col-12">
                        <ATypography strong>
                          {handleGetWarranty(item?.warrantyPolicy).label}: &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                          {handleGetWarranty(item?.warrantyPolicy).data || t('noWarranty')}
                        </ATypography>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            <Divider />
            <div className="d-flex align-items-center justify-content-between">
              <ATypography>{t('total_fee')}:</ATypography>
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
                {numberFormatDecimal(+totalFee, ' đ', '')}
              </ATypography>
            </div>
          </Col>
        </Row>
      </Skeleton>

      <Divider />
      <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
        <BasicBtn size="large" type="ghost" onClick={props.onCancel} icon={<CloseOutlined />} title={props.cancelText || t('close')} />
      </div>

      <MediaModal //
        modalShow={Boolean(mediaModal)}
        onCancel={() => setMediaModal(null)}
        data={mediaModal}
      />
    </>
  );
};

export default connect(
  (state) => ({
    user: state['authUser'].user
  }),
  {
    getQuotationDetail: quotationActions.getQuotationDetail,
    getMechanics: mechanicActions.getMechanics,
    getRequests: requestActions.getRequests,
    getMechanicStatistic: mechanicActions.getMechanicStatistic,
    getRequestMechanic: mechanicActions.getRequestMechanic,
    getRepairStatistic: mechanicActions.getRepairStatistic
  }
)(ViewForm);
