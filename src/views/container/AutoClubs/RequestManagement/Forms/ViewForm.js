import { CheckCircleFilled, CloseOutlined, ExceptionOutlined, FileImageOutlined } from '@ant-design/icons';
import { Col, Descriptions, Row, Skeleton, Steps, Table } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import { REQUEST_FIXED_BY_MECHANIC, REQUEST_HELPED_BY_HELPER } from '~/configs';
import { DEFAULT_AVATAR } from '~/configs/default';
import { requestActions } from '~/state/ducks/member/request';
import MapModal from '~/views/container/commons/MapModal';
import MediaModal from '~/views/container/commons/MediaModal';
import Divider from '~/views/presentation/divider';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import AuthVideo from '~/views/presentation/ui/video/AuthVideo';
import { UtilDate } from '~/views/utilities/helpers';

const StepStyled = styled(Steps)`
  .ant-steps-label-vertical .ant-steps-item-content {
    margin-top: 14px !important;
  }
  height: ${(props) => (props.windowWidth > 768 ? '100px' : 'max-content')};
  position: relative;
  top: 16px;
  overflow-y: ${(props) => (props.windowWidth > 768 ? 'hidden' : 'scroll')};
  overflow-x: ${(props) => (props.windowWidth <= 768 ? 'hidden' : 'scroll')};
  .ant-steps-item {
    position: relative;
    left: ${(props) => (props.windowWidth <= 768 ? '16px' : '0px')};
    top: ${(props) => (props.windowWidth > 768 ? '16px' : '0px')};
  }
`;

const ViewForm = (props) => {
  const { t } = useTranslation();
  const { width, height } = useWindowSize();
  const [requestDetail, setRequestDetail] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [mapModal, setMapModal] = useState(false);
  const [videoModal, setVideoModal] = useState(null);
  const [wizardModalShow, setWizardModalShow] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [requestMedia, setRequestMedia] = useState([]);
  const [mediaModal, setMediaModal] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState([]);

  useEffect(() => {
    if (Boolean(props.id)) {
      setPageLoading(true);
      props
        .getRequestDetail(props.id)
        .then((res) => {
          setRequestDetail(res?.content);
          setVehicleInfo([res?.content?.vehicleInfo].filter(Boolean));
          setRequestMedia(res?.content?.media?.concat(res?.content?.descriptionAudio).filter(Boolean) || []);
          if (res?.content?.helperType === 'HELPER') {
            setCurrentStep(
              res?.content?.auditInfo?.closedDate
                ? 3
                : res?.content?.auditInfo?.waitingDoneConfirmByRequesterDate
                ? 2
                : res?.content?.auditInfo?.fixingDate
                ? 1
                : 0
            );
          } else {
            setCurrentStep(
              res?.content?.auditInfo?.closedDate
                ? 5
                : res?.content?.auditInfo?.waitingPaymentDate
                ? 4
                : res?.content?.auditInfo?.waitingPaymentConfirmDate
                ? 3
                : res?.content?.auditInfo?.waitingDoneConfirmByRequesterDate
                ? 2
                : res?.content?.auditInfo?.fixingDate
                ? 1
                : 0
            );
          }
          setPageLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
          setPageLoading(false);
        });
    }
  }, [props.id]);

  const carInfoColumns = [
    {
      title: t('brand'),
      dataIndex: 'brand',
      key: 'brand',
      align: 'center',
      render: (cell, row) => {
        return <span style={{ fontWeight: 'lighter' }}>{cell?.name || '-'}</span>;
      }
    },
    {
      title: t('model'),
      dataIndex: 'model',
      key: 'model',
      align: 'center',
      render: (cell, row) => {
        return <span style={{ fontWeight: 'lighter' }}>{cell?.name || '-'}</span>;
      }
    },
    {
      title: t('year_of_manufacture'),
      dataIndex: 'producingYear',
      key: 'producingYear',
      align: 'center',
      render: (cell, row) => {
        return <span style={{ fontWeight: 'lighter' }}>{cell || '-'}</span>;
      }
    },
    {
      title: t('engine'),
      dataIndex: 'engine',
      key: 'engine',
      align: 'center',
      render: (cell, row) => {
        return <span style={{ fontWeight: 'lighter' }}>{cell || '-'}</span>;
      }
    },
    {
      title: t('body_type'),
      dataIndex: 'bodyType',
      key: 'bodyType',
      align: 'center',
      render: (cell, row) => {
        return <span style={{ fontWeight: 'lighter' }}>{cell?.name || '-'}</span>;
      }
    },
    {
      title: t('doors'),
      dataIndex: 'door',
      key: 'door',
      align: 'center',
      render: (cell, row) => {
        return <span style={{ fontWeight: 'lighter' }}>{cell || '-'}</span>;
      }
    },
    {
      title: t('seats'),
      dataIndex: 'seat',
      key: 'seat',
      align: 'center',
      render: (cell, row) => {
        return <span style={{ fontWeight: 'lighter' }}>{cell || '-'}</span>;
      }
    },
    {
      title: t('license_plate'),
      dataIndex: 'license',
      key: 'license',
      align: 'center',
      render: (cell, row) => {
        return <span style={{ fontWeight: 'lighter' }}>{cell || '-'}</span>;
      }
    }
  ];

  return (
    <>
      <Skeleton loading={pageLoading} active>
        <Row>
          <Col lg={15} md={24}>
            <AlignedDescription
              labelStyle={{ paddingTop: '0px', paddingBottom: '16px' }}
              contentStyle={{ paddingTop: '0px', paddingBottom: '16px' }}>
              <Descriptions.Item className="pb-0" label={t('request_id')} contentStyle={{ fontSize: '20px' }}>
                {requestDetail?.id}
              </Descriptions.Item>
              <Descriptions.Item contentStyle={{ fontSize: '12px' }} className="pt-0" label="">
                {t('status')}: {t(requestDetail?.status).toUpperCase()}
              </Descriptions.Item>
            </AlignedDescription>
          </Col>
          <Col lg={9} md={24}>
            <AlignedDescription labelStyle={{ padding: '0px' }} contentStyle={{ paddingTop: '0px', paddingBottom: '16px' }}>
              <Descriptions.Item
                contentStyle={{ fontSize: '14px' }}
                labelStyle={{ fontSize: '14px' }}
                className="pb-1"
                label={t('booking_date')}>
                {requestDetail?.time ? UtilDate.toLocalDateTimeString(requestDetail?.time) : '-'}
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ fontSize: '12px' }}
                contentStyle={{ color: 'rgba(0,0,0,0.4)', fontSize: '12px' }}
                className="py-1"
                label={t('picking_up_date')}>
                {requestDetail?.auditInfo?.fixingDate ? UtilDate.toLocalDateTimeString(requestDetail?.auditInfo?.fixingDate) : '-'}
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ fontSize: '12px' }}
                contentStyle={{ color: 'rgba(0,0,0,0.4)', fontSize: '12px' }}
                className="pt-1"
                label={t('finished_date')}>
                {requestDetail?.auditInfo?.closedDate ? UtilDate.toLocalDateTimeString(requestDetail?.auditInfo?.closedDate) : '-'}
              </Descriptions.Item>
            </AlignedDescription>
          </Col>
        </Row>
        <Row>
          <Col lg={15} md={24}>
            <AlignedDescription //
              labelStyle={{ paddingTop: '0px', paddingBottom: '16px' }}
              contentStyle={{ paddingTop: '0px', paddingBottom: '16px' }}>
              <Descriptions.Item label={t('incident')}>
                <span className="mr-5">{requestDetail?.category}</span>
                {Boolean(requestDetail?.problemInfos) && requestDetail?.problemInfos?.length > 0 && (
                  <BasicBtn type="primary" icon={<ExceptionOutlined />} onClick={() => setWizardModalShow(true)} title={t('view_wizard')} />
                  // <AButton type="primary" icon={<ExceptionOutlined />} onClick={() => setWizardModalShow(true)}>
                  //   {t('view_wizard')}
                  // </AButton>
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t('description')}>{requestDetail?.description}</Descriptions.Item>
              <Descriptions.Item label={t('visual_media')} contentStyle={{ display: 'flex', alignItems: 'center' }}>
                <span className="d-flex align-items-center">
                  {Boolean(requestMedia) && requestMedia.length > 0 ? (
                    <>
                      <AButton type="primary" icon={<FileImageOutlined />} onClick={() => setMediaModal(requestMedia)}>
                        {t('view_media')}
                      </AButton>
                      &nbsp; ({requestMedia.length} {t('items')})
                    </>
                  ) : (
                    <span>{t('no_media')}</span>
                  )}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label={t('location')}>
                {requestDetail?.fullAddress} <br />
                <AButton
                  className="pl-0"
                  type="link"
                  onClick={() => {
                    if (requestDetail?.fullAddress) setMapModal(true);
                    else AMessage.error(t('errorAddressNotFound'));
                  }}>
                  {t('view_full_map')}
                </AButton>
              </Descriptions.Item>
              <Descriptions.Item label={t('vehicle_info')}>{(!Boolean(vehicleInfo) || vehicleInfo?.length === 0) && '-'}</Descriptions.Item>
            </AlignedDescription>
          </Col>
          {Boolean(vehicleInfo) && vehicleInfo?.length > 0 && (
            <Table //
              className="mb-5"
              scroll={{ x: 1500 }}
              pagination={false}
              columns={carInfoColumns}
              dataSource={vehicleInfo}
            />
          )}
          <Col lg={9} md={24}></Col>
        </Row>
      </Skeleton>

      <Divider />

      <Skeleton loading={pageLoading} active>
        <AlignedDescription
          labelStyle={{ paddingTop: '0px', paddingBottom: '16px' }}
          contentStyle={{ paddingTop: '0px', paddingBottom: '16px' }}
          layout="horizontal"
          column={width > 768 ? 3 : 1}>
          <Descriptions.Item label={t('picked_up_by')}>
            {requestDetail?.helperName ? (
              <AButton type="link" className="pl-0 pt-0">
                {requestDetail?.helperName}
              </AButton>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('picked_up_date')}>
            <span style={{ width: 'max-content' }}>
              {requestDetail?.auditInfo?.fixingDate ? UtilDate.toLocalDateTimeString(requestDetail?.auditInfo?.fixingDate) : '-'}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={t('accept_date')}>
            <span style={{ width: 'max-content' }}>{requestDetail?.time ? UtilDate.toLocalDateTimeString(requestDetail?.time) : '-'}</span>
          </Descriptions.Item>
        </AlignedDescription>
      </Skeleton>

      <Divider />

      <Skeleton loading={pageLoading} active>
        <div style={{ height: 'max-content', overflowX: 'scroll' }}>
          <StepStyled
            windowWidth={width}
            progressDot={(dot, { status, index }) => {
              return status === 'wait' ? (
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    position: 'relative',
                    top: '-6px',
                    right: '5px',
                    border: '3px solid #f0f0f0',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}></span>
              ) : (
                <CheckCircleFilled
                  style={{
                    position: 'relative',
                    top: '-12px',
                    right: '14px',
                    fontSize: '32px',
                    color: index <= currentStep ? '#1a91ff' : '#bbb'
                  }}
                />
              );
            }}
            labelPlacement="vertical"
            current={currentStep}>
            {(requestDetail?.helperType === 'HELPER' ? REQUEST_HELPED_BY_HELPER : REQUEST_FIXED_BY_MECHANIC).map((status) => (
              <Steps.Step
                title={
                  <div className="mt-3">
                    <div>{t(status.text)}</div>
                  </div>
                }
              />
            ))}
          </StepStyled>
        </div>
      </Skeleton>

      <Divider />
      <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
        <BasicBtn size="large" type="ghost" onClick={props.onCancel} icon={<CloseOutlined />} title={props.cancelText || t('close')} />
      </div>

      <MapModal //
        title={t('location')}
        description={requestDetail?.fullAddress}
        modalShow={mapModal}
        setModalShow={setMapModal}
        address={requestDetail?.fullAddress}
      />

      <AntModal //
        title={t('video')}
        description=""
        width={700}
        destroyOnClose
        modalShow={Boolean(videoModal)}
        onCancel={() => setVideoModal(null)}>
        <div className="d-flex align-items-center justify-content-center">
          <AuthVideo
            isAuth={true}
            width="700px"
            height="700px"
            src={videoModal || DEFAULT_AVATAR}
            style={{ objectFit: 'cover' }}
            // onClick={(e) => e.stopPropagation()}
          />
        </div>
      </AntModal>

      <AntModal //
        title={t('wizard_title')}
        description=""
        width={500}
        modalShow={wizardModalShow}
        onCancel={() => setWizardModalShow(false)}>
        <div style={{ minHeight: '500px' }}>
          {(requestDetail?.problemInfos || []).map((wizard) => (
            <div key={wizard?.id}>
              <div className="text-left text-muted">{wizard?.question}</div>
              {(wizard?.answer?.content || []).map((rep, i) => (
                <div key={i} className="text-right">
                  {rep || '-'}
                </div>
              ))}
              <Divider />
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <AButton
            style={{ verticalAlign: 'middle', width: '200px' }}
            className="mt-3 mt-lg-0 ml-lg-3 px-5"
            size="large"
            type="ghost"
            onClick={() => setWizardModalShow(false)}
            icon={<CloseOutlined />}></AButton>
        </div>
      </AntModal>

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
    getRequestDetail: requestActions.getRequestDetail
  }
)(ViewForm);
