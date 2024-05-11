import { CloseOutlined, EyeOutlined, RightOutlined } from '@ant-design/icons';
import { Col, Collapse, Descriptions, Image, Row, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { DEFAULT_AVATAR } from '~/configs/default';
import { mechanicActions } from '~/state/ducks/mechanic';
import { quotationActions } from '~/state/ducks/mechanic/quotation';
import { requestActions } from '~/state/ducks/request';
import Divider from '~/views/presentation/divider';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const CollapseStyled = styled(Collapse)`
  border: 1px solid #000;
  .ant-collapse-content {
    border-top: 1px solid #aca8a8;
  }
`;

const ViewForm = (props) => {
  const { t } = useTranslation();
  const [quotationDetail, setQuotationDetail] = useState({});
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    if (Boolean(props.id)) {
      setPageLoading(true);
      props
        .getQuotationDetail(props.id)
        .then((res) => {
          setQuotationDetail({
            id: res?.content?.quotationId,
            name: res?.content?.name,
            status: res?.content?.status,
            customer: res?.content?.customer,
            mechanic: res?.content?.mechanic,
            media: res?.content?.media,
            notes: res?.content?.notes
          });
          setPageLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
          setPageLoading(false);
        });
    }
  }, [props.id]);

  return (
    <>
      <Skeleton loading={pageLoading} active>
        <Row>
          <Col md={24} lg={11}>
            <AlignedDescription labelWidth="200px" contentStyle={{ fontSize: '18px' }}>
              <Descriptions.Item label={t('selected_requests')} contentStyle={{ fontSize: '20px' }}>
                <div className="d-flex align-items-center mb-2">
                  <span className="mr-4">{quotationDetail?.id}</span>
                  <span style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)' }}>{quotationDetail?.name}</span>
                </div>
                <div style={{ fontSize: '14px' }} className="d-flex align-items-center">
                  {quotationDetail?.status}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label={t('customer')}>{quotationDetail?.customer}</Descriptions.Item>
              <Descriptions.Item label={t('mechanic')}>{quotationDetail?.mechanic}</Descriptions.Item>
            </AlignedDescription>

            <Divider />

            <AlignedDescription labelWidth="200px" contentStyle={{ fontSize: '18px' }}>
              <Descriptions.Item label={t('media')}>
                <Image.PreviewGroup>
                  {(quotationDetail?.media || []).map((item) => {
                    let src = !item?.includes('http') ? firstImage(item) : item || DEFAULT_AVATAR;
                    return item?.includes('http') ? (
                      <Image
                        preview={{
                          mask: <EyeOutlined />
                        }}
                        width={64}
                        height={64}
                        src={src}
                        style={{ objectFit: 'contain', marginRight: '16px' }}
                      />
                    ) : (
                      <AuthImage
                        preview={{
                          mask: <EyeOutlined />
                        }}
                        width={64}
                        height={64}
                        isAuth={true}
                        style={{ marginRight: '16px' }}
                        src={src}
                        // onClick={(e) => e.stopPropagation()}
                      />
                    );
                  })}
                </Image.PreviewGroup>
              </Descriptions.Item>
              <Descriptions.Item label={t('quotation_notes')}>{quotationDetail?.notes}</Descriptions.Item>
            </AlignedDescription>

            <Divider />
            <AButton size="large" className="w-100 mb-4 d-flex justify-content-between">
              <span>Original quotation</span>
              <span>
                <span className="mr-3">Jun 26, 2021 16:00</span>
                <span>
                  <RightOutlined style={{ transform: 'translateY(-3px)' }} />
                </span>
              </span>
            </AButton>

            <AButton size="large" className="w-100 mb-4 d-flex justify-content-between">
              <span>Updated quotation</span>
              <span>
                <span className="mr-3">Jun 26, 2021 16:00</span>
                <span>
                  <RightOutlined style={{ transform: 'translateY(-3px)' }} />
                </span>
              </span>
            </AButton>

            <AButton type="primary" size="large" className="w-100 mb-4 d-flex justify-content-between">
              <span>Latest updated quotation</span>
              <span>
                <span className="mr-3">Jun 26, 2021 16:00</span>
                <span>
                  <RightOutlined style={{ transform: 'translateY(-3px)' }} />
                </span>
              </span>
            </AButton>
          </Col>

          <Col md={0} lg={1}></Col>

          <Col md={24} lg={12}>
            <ATypography style={{ color: 'rgba(0,0,0,0.4)' }}>{t('quotation_on_working_items')}</ATypography>
            {[0, 1, 2].map((item, i) => (
              <CollapseStyled key={i} className="mt-5" expandIconPosition="right">
                <Collapse.Panel
                  header={
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="d-flex align-items-center">
                        <ATypography variant={TYPOGRAPHY_TYPE.TITLE} className="mr-5 mb-0" level={5}>
                          Option 1
                        </ATypography>
                        <ATypography variant={TYPOGRAPHY_TYPE.TITLE} className="my-0" level={5} style={{ color: 'rgba(0,0,0,0.5)' }}>
                          Selected
                        </ATypography>
                      </span>
                      <ATypography variant={TYPOGRAPHY_TYPE.TITLE} className="mb-0" level={5}>
                        $2,020.00
                      </ATypography>
                    </div>
                  }
                  key="1">
                  <div className="mx-5 my-3 p-3" style={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                    <div className="pb-2 w-100 mb-4" style={{ borderBottom: '1px solid #000' }}>
                      <ATypography strong>Come and check details</ATypography>
                    </div>
                    <div className="pb-2 w-100 mb-4" style={{ borderBottom: '1px solid #000' }}>
                      <ATypography strong>$20.00</ATypography>
                    </div>
                  </div>
                  <div className="mx-5 my-3 p-3" style={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                    <div className="pb-2 w-100 mb-4" style={{ borderBottom: '1px solid #000' }}>
                      <ATypography strong>Maxis tire replace x2</ATypography>
                    </div>
                    <div className="pb-2 w-100 mb-4" style={{ borderBottom: '1px solid #000' }}>
                      <ATypography strong>$2,000.00</ATypography>
                    </div>
                    <div>
                      <Image.PreviewGroup>
                        {(quotationDetail?.media || []).map((item) => {
                          let src = !item?.includes('http') ? firstImage(item) : item || DEFAULT_AVATAR;
                          return item?.includes('http') ? (
                            <Image
                              preview={{
                                mask: <EyeOutlined />
                              }}
                              width={64}
                              height={64}
                              src={src}
                              style={{ objectFit: 'contain', marginRight: '16px' }}
                            />
                          ) : (
                            <AuthImage
                              preview={{
                                mask: <EyeOutlined />
                              }}
                              width={64}
                              height={64}
                              isAuth={true}
                              style={{ marginRight: '16px' }}
                              src={src}
                              // onClick={(e) => e.stopPropagation()}
                            />
                          );
                        })}
                      </Image.PreviewGroup>
                    </div>
                  </div>
                </Collapse.Panel>
              </CollapseStyled>
            ))}
          </Col>
        </Row>
      </Skeleton>

      <Divider />
      <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
        <AButton
          style={{ verticalAlign: 'middle', width: '200px' }}
          className="mt-3 mt-lg-0 ml-lg-3 px-5"
          size="large"
          type="ghost"
          onClick={props.onCancel}
          icon={<CloseOutlined />}>
          {props.cancelText || t('close')}
        </AButton>
      </div>
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
