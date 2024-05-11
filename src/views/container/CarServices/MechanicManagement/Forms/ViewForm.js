import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Avatar, Col, Descriptions, Image, Rate, Row, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { DEFAULT_AVATAR } from '~/configs/default';
import { repairActions } from '~/state/ducks/carServices/repair';
import { mechanicActions } from '~/state/ducks/mechanic';
import { ratingActions } from '~/state/ducks/ratings';
import { requestActions } from '~/state/ducks/request';
import MapModal from '~/views/container/commons/MapModal';
import Divider from '~/views/presentation/divider';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormatNoFilter } from '~/views/utilities/helpers/ColumnFormat';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { API_URL } from '~/configs';
import { BasicBtn } from '~/views/presentation/ui/buttons';

const ViewForm = (props) => {
  const { t } = useTranslation();
  const [mechanicDetail, setMechanicDetail] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [mapModal, setMapModal] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [document, setDocument] = useState([]);
  const [rating, setRating] = useState(0);
  const [mechanicId, setMechanicId] = useState(null);
  const [fullAddress, setFullAddress] = useState('');

  useEffect(() => {
    if (Boolean(props.id)) {
      setPageLoading(true);
      setNeedLoadNewData(true);
      setMechanicId(props.id);
      props
        .getMechanicDetail(props.id)
        .then((res) => {
          const address = res?.content?.address;
          const fullAddress = `${address?.address || ''} ${address?.fullAddress || ''}, ${address?.wards?.name || ''}, ${
            address?.district?.name || ''
          }, ${address?.province?.name || ''} ${address?.zipCode || ''}, ${address?.country?.nativeName || ''}`;

          setFullAddress(
            fullAddress
              .split(',')
              .map((segment) => segment.trim())
              .join(', ')
          );
          setMechanicDetail(res?.content);
          // for certificates
          setCertificates(res?.content?.certificates ? JSON.parse(res?.content?.certificates || '[]') : []);
          // for documentMedia
          setDocument(res?.content?.documentMedia ? JSON.parse(res?.content?.documentMedia || '[]') : []);
          setPageLoading(false);
          setNeedLoadNewData(true);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 61 ~ useEffect ~ err', err);
          setPageLoading(false);
          setNeedLoadNewData(true);
        });

      props
        .getMechanicRating(props.id)
        .then((res) => {
          setRating(+res?.content?.value);
          setNeedLoadNewData(true);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 71 ~ useEffect ~ err', err);
          setNeedLoadNewData(true);
        });
    }
  }, [props.id]);

  let columns = [
    {
      dataField: 'requestId',
      text: t('request_id'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      formatter: (cell, row) => {
        return <Link>{cell || '-'}</Link>;
      }
    },
    {
      dataField: 'category',
      text: t('service'),
      headerStyle: {
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      style: {
        minWidth: 100,
        textAlign: 'middle'
      },
      formatter: (cell, row) => {
        return <Link>{cell || '-'}</Link>;
      }
    },
    {
      dataField: 'address',
      text: t('location'),
      headerStyle: {
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      style: {
        minWidth: 100,
        textAlign: 'middle'
      },
      formatter: (cell) => {
        return cell || '-';
      }
    },
    {
      dataField: 'bookingDate',
      text: t('pickup_date'),
      sort: false,
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateLocal(cell)}</span>;
      },
      csvFormatter: (cell) => {
        return cell ? firstImage(cell) : API_URL + DEFAULT_AVATAR;
      }
    },
    {
      dataField: 'endHelping',
      text: t('completed_date'),
      headerStyle: {
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{cell ? UtilDate.toDateLocal(cell) : '-'}</span>;
      }
    },
    {
      dataField: 'requesterName',
      text: t('customer'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      formatter: (cell) => {
        return cell || '-';
      }
    },
    {
      dataField: 'quoteId',
      text: t('quotation'),
      headerStyle: {
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      style: {
        minWidth: 110,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return cell || '-';
      }
    },
    {
      dataField: 'uiStatus',
      text: t('status'),
      headerStyle: {
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return t(cell);
      }
    }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------
  columns = columns.map((column) => {
    return {
      editable: false,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormatNoFilter,
      style: {
        minWidth: 148
      },
      align: column.align,
      headerAlign: column.align,
      footerAlign: column.align,
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  const onFinish = () => {};

  return (
    <>
      <Skeleton loading={pageLoading} active>
        <div className="d-flex flex-wrap">
          {(mechanicDetail?.avatar || '').includes('http') ? (
            <Avatar
              size={124}
              className="mr-5 mb-3 mb-lg-0"
              preview={{
                mask: <EyeOutlined />
              }}
              width={32}
              src={mechanicDetail?.avatar}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <AuthAvatar
              size={124}
              className="mr-5 mb-3 mb-lg-0"
              preview={{
                mask: <EyeOutlined />
              }}
              width={32}
              isAuth={true}
              src={firstImage(mechanicDetail?.avatar)}
              // onClick={(e) => e.stopPropagation()}
            />
          )}
          <div className="d-flex flex-column justify-content-center">
            <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={2}>
              <span style={{ fontWeight: '500' }}>{mechanicDetail?.fullName || '-'}</span>
            </ATypography>
            <div className="d-flex align-items-center">
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4} className="text-muted pr-5 mb-0">
                {mechanicDetail?.phone ? formatPhoneWithCountryCode(mechanicDetail?.phone, mechanicDetail?.country?.code) : '-'}
              </ATypography>
              <span className="pl-5" style={{ borderLeft: '1px solid #000' }}>
                <Rate disabled="true" value={rating || 5} />
              </span>
            </div>
          </div>
        </div>
      </Skeleton>

      <Divider />

      <Skeleton loading={pageLoading} active>
        <Row>
          <Col md={24} lg={12}>
            <AlignedDescription column={1} labelStyle={{ color: 'rgba(0,0,0,0.5)' }} colon={false} bordered>
              <Descriptions.Item label="Email">{mechanicDetail?.email || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('address')}>
                {fullAddress ? (
                  <>
                    {fullAddress} <br />
                    <AButton className="pl-0" type="link" onClick={() => setMapModal(true)}>
                      {t('view_full_map')}
                    </AButton>
                  </>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t('yrs_of_exp')}>
                {mechanicDetail?.yearsOfExperience || '-'}{' '}
                {mechanicDetail?.yearsOfExperience > 1 ? t('years').toLowerCase() : t('year').toLowerCase()}
              </Descriptions.Item>
            </AlignedDescription>
          </Col>
          <Col md={24} lg={12}>
            <AlignedDescription
              layout="vertical"
              column={1}
              labelStyle={{ color: 'rgba(0,0,0,0.5)' }}
              contentStyle={{ display: 'flex', alignItems: 'flex-start', paddingLeft: '0px' }}
              colon={false}
              bordered>
              <Descriptions.Item label={t('exp_des')}>
                {mechanicDetail?.experience ? <p dangerouslySetInnerHTML={{ __html: mechanicDetail?.experience }}></p> : '-'}
              </Descriptions.Item>
            </AlignedDescription>
          </Col>
          <Col md={24} lg={24}>
            <AlignedDescription column={1} labelStyle={{ color: 'rgba(0,0,0,0.5)' }} colon={false} bordered>
              <Descriptions.Item label={t('certificates')}>
                <div className="d-flex flex-wrap">
                  <Image.PreviewGroup>
                    {certificates?.length > 0
                      ? (certificates || []).map((item) => {
                          let imageUrl = item?.url ? item?.url : item?.path;
                          let src = !imageUrl?.includes('http') ? firstImage(imageUrl) : imageUrl || DEFAULT_AVATAR;
                          return (
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
                        })
                      : '-'}
                  </Image.PreviewGroup>
                </div>
              </Descriptions.Item>
            </AlignedDescription>
          </Col>
        </Row>
      </Skeleton>

      <TableBootstrapHook
        fetchAll
        title={null}
        description={null}
        notSupportToggle
        columns={columns}
        params={{
          sort: 'bookingDate,desc',
          helperUserId: mechanicId,
          problemType: 'REQUEST'
        }}
        getStatistic={props.getMechanicRepairStatistic} // for statistic API
        statisticProps={{
          // for statistic API params
          params: { helperUserId: mechanicId },
          name: 'Request',
          key: 'uiStatus',
          order: ['total', 'repairing', 'done', 'canceled'],
          valueSet: {
            // to map params with each filter button
            total: 'ALL',
            canceled: 'CANCELED',
            done: 'REPAIRED',
            repairing: 'REPAIRING'
          }
        }}
        searchPlaceholder={t('mechanic_search')}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getRepairs}
        buttons={[]}></TableBootstrapHook>

      <Divider />
      <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
        <BasicBtn size="large" type="ghost" onClick={props.onCancel} icon={<CloseOutlined />} title={props.cancelText || t('close')} />
      </div>

      <MapModal //
        title={t('mechanic_detail')}
        description={t('mechanic_detail_des')}
        modalShow={mapModal}
        setModalShow={setMapModal}
        address={mechanicDetail?.address?.fullAddress}
      />
    </>
  );
};

export default connect(
  (state) => ({
    user: state['authUser'].user
  }),
  {
    getMechanicDetail: mechanicActions.getMechanicDetail,
    getMechanics: mechanicActions.getMechanics,
    getRequests: requestActions.getRequests,
    getMechanicStatistic: mechanicActions.getMechanicStatistic,
    getRepairs: repairActions.getRepairs,
    getMechanicRepairStatistic: mechanicActions.getMechanicRepairStatistic,
    getMechanicRating: ratingActions.getMechanicRating
  }
)(ViewForm);
