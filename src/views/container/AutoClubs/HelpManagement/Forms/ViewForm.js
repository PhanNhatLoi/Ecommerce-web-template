import { CheckCircleFilled, CloseOutlined, ExceptionOutlined, FileImageOutlined } from '@ant-design/icons';
import { Col, Descriptions, Row, Skeleton, Steps, Table } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import { HELP_STEPS } from '~/configs';
import { DEFAULT_AVATAR } from '~/configs/default';
import { helpActions } from '~/state/ducks/member/help';
import MapModal from '~/views/container/commons/MapModal';
import MediaModal from '~/views/container/commons/MediaModal';
import WizardModal from '~/views/container/commons/WizardModal';
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
  const [currentStep, setCurrentStep] = useState('');
  const [requestMedia, setRequestMedia] = useState([]);
  const [wizardModalShow, setWizardModalShow] = useState(false);
  const [wizardDetail, setWizardDetail] = useState([]);
  const [vehicleInfo, setVehicleInfo] = useState([]);
  const [mediaModal, setMediaModal] = useState(null);

  //-----------------------------------------
  // FETCH DATA
  //-----------------------------------------
  const fetch = (id, action, setData) => {
    setPageLoading(true);
    action(id)
      .then((res) => {
        setData(res?.content);
        setPageLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
        AMessage.error(t(err.message));
        setPageLoading(false);
      });
  };

  useEffect(() => {
    if (Boolean(props.id)) {
      fetch(props.id, props.getHelpDetail, setRequestDetail);
      fetch(props.id, props.getHelpWizard, setWizardDetail);
    }
  }, [props.id]);
  //-----------------------------------------
  // FETCH DATA
  //-----------------------------------------

  useEffect(() => {
    setVehicleInfo([requestDetail?.vehicleInfo].filter(Boolean));
    setRequestMedia(requestDetail?.requestMedia?.concat(requestDetail?.descriptionAudio).filter(Boolean) || []);
    setCurrentStep(
      requestDetail?.auditInfo?.closedDate ? 3 : requestDetail?.auditInfo?.doneDate ? 2 : requestDetail?.auditInfo?.fixingDate ? 1 : 0
    );
  }, [requestDetail]);

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
      title: t('year'),
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
                {props.id || '-'}
              </Descriptions.Item>
              <Descriptions.Item contentStyle={{ fontSize: '12px' }} className="pt-0" label="">
                {t('status')}: {t(requestDetail?.uistatus).toUpperCase() || ' -'}
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
                {requestDetail?.bookingDate ? UtilDate.toLocalDateTimeString(requestDetail?.bookingDate) : '-'}
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
              <Descriptions.Item label={t('service')}>
                <span className="mr-5">{requestDetail?.problem || '-'}</span>
                {Boolean(wizardDetail) && wizardDetail?.length > 0 && (
                  <BasicBtn type="primary" icon={<ExceptionOutlined />} onClick={() => setWizardModalShow(true)} title={t('view_wizard')} />
                  // <AButton type="primary" icon={<ExceptionOutlined />} onClick={() => setWizardModalShow(true)}>
                  //   {t('view_wizard')}
                  // </AButton>
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t('description')}>{requestDetail?.requestDescription || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('media')} contentStyle={{ display: 'flex', alignItems: 'center' }}>
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
                {requestDetail?.location ? (
                  <>
                    {requestDetail?.location} <br />
                    <AButton className="pl-0" type="link" onClick={() => setMapModal(true)}>
                      {t('view_full_map')}
                    </AButton>
                  </>
                ) : (
                  '-'
                )}
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
          <Descriptions.Item label={t('helped_by')}>
            {requestDetail?.helperName ? (
              <AButton type="link" className="pl-0 pt-0">
                {requestDetail?.helperName}
              </AButton>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('start_help_at')}>
            <span style={{ width: 'max-content' }}>
              {requestDetail?.auditInfo?.fixingDate ? UtilDate.toLocalDateTimeString(requestDetail?.auditInfo?.fixingDate) : '-'}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={t('end_help_at')}>
            <span style={{ width: 'max-content' }}>
              {requestDetail?.auditInfo?.closedDate ? UtilDate.toLocalDateTimeString(requestDetail?.auditInfo?.closedDate) : '-'}
            </span>
          </Descriptions.Item>
        </AlignedDescription>
      </Skeleton>

      <Divider />

      <Skeleton loading={pageLoading} active>
        <div style={{ height: '100px', overflowX: 'scroll', overflowY: 'hidden' }}>
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
            {HELP_STEPS.map((status) => (
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
        description={requestDetail?.location}
        modalShow={mapModal}
        setModalShow={setMapModal}
        address={requestDetail?.location}
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

      <WizardModal //
        modalShow={wizardModalShow}
        setModalShow={setWizardModalShow}
        data={wizardDetail}
      />

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
    getHelpDetail: helpActions.getHelpDetail,
    getHelpWizard: helpActions.getHelpWizard
  }
)(ViewForm);
