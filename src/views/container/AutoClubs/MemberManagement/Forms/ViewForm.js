import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Avatar, Descriptions, Skeleton, Table } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { DEFAULT_AVATAR } from '~/configs/default';
import * as PATH from '~/configs/routesConfig';
import { memberActions } from '~/state/ducks/member';
import { requestActions } from '~/state/ducks/member/request';
import Divider from '~/views/presentation/divider';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormatNoFilter } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { API_URL } from '~/configs';
import { BasicBtn } from '~/views/presentation/ui/buttons';

const ViewForm = (props) => {
  const { t } = useTranslation();
  const [memberDetail, setMemberDetail] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [mapModal, setMapModal] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState([]);
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  // for requests/repairs table
  const [requestParams, setRequestParams] = useState({
    userId: props.memberUserId,
    problemType: 'REQUEST',
    page: 0,
    size: 9999999999
  });

  const fetch = (action, setData, params) => {
    setPageLoading(true);
    action(params)
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
    setRequestParams({ ...requestParams, userId: props.memberUserId });
    if (Boolean(props.id)) {
      setNeedLoadNewData(true);
      fetch(props.getMemberDetail, setMemberDetail, props.id);
      fetch(props.getRequesterVehicles, setVehicleInfo, { memberId: props.id });
    }
  }, [props.id, props.memberUserId]);

  let columns = [
    {
      dataField: 'requestId',
      text: t('request_id'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <Link to={PATH.CAR_SERVICES_EMPLOYEE_EDIT_PATH.replace(':idMechanics', row.id)}>{cell || '-'}</Link>;
      }
    },
    {
      dataField: 'category',
      text: t('incident'),
      style: {
        minWidth: 200
      },
      formatter: (cell, row) => {
        return <Link to={PATH.CAR_SERVICES_EMPLOYEE_EDIT_PATH.replace(':idMechanics', row.id)}>{cell || '-'}</Link>;
      }
    },
    {
      dataField: 'fullAddress',
      text: t('location'),
      style: {
        minWidth: 250
      },
      formatter: (cell, row) => {
        return cell || '-';
      }
    },
    {
      dataField: 'bookingDate',
      text: t('booking_date'),
      sort: false,
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <span>{cell ? UtilDate.toDateLocal(cell) : '-'}</span>;
      },
      csvFormatter: (cell) => {
        return cell ? firstImage(cell) : API_URL + DEFAULT_AVATAR;
      }
    },
    {
      dataField: 'acceptDate',
      text: t('start_fixing'),
      headerStyle: {
        textAlign: 'center'
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
      dataField: 'endHelping',
      text: t('end_fixing'),
      headerStyle: {
        textAlign: 'center'
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
      dataField: 'problemType',
      text: t('request_type'),
      headerStyle: {
        textAlign: 'center'
      },
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return cell || '-';
      }
    },
    {
      dataField: 'status',
      text: t('status'),
      headerStyle: {
        textAlign: 'center'
      },
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return cell ? t(cell) : '-';
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
        <div className="d-flex flex-wrap">
          <div className="mr-5">
            {(memberDetail?.avatar || '').includes('http') ? (
              <Avatar
                size={124}
                className="mr-5 mb-3 mb-lg-0"
                preview={{
                  mask: <EyeOutlined />
                }}
                width={32}
                src={(memberDetail?.avatar || '').includes('http') ? memberDetail?.avatar : firstImage(memberDetail?.avatar)}
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
                src={(memberDetail?.avatar || '').includes('http') ? memberDetail?.avatar : firstImage(memberDetail?.avatar)}
                // onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
          <div className="d-flex flex-column justify-content-center">
            <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={2}>
              <span style={{ fontWeight: '500' }}>{memberDetail?.fullName}</span>
            </ATypography>
            <div className="d-flex align-items-center">
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4} className="text-muted pr-5" style={{ borderRight: '1px solid #000' }}>
                {memberDetail?.phone ? formatPhoneWithCountryCode(memberDetail?.phone, memberDetail?.country?.code) : '-'}
              </ATypography>
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4} className="pl-5 mt-0" strong>
                <span>{numberFormatDecimal(memberDetail?.numOfXims || 0, '', '')}</span>
                {` `}
                <span className="font-weight-light">
                  <sup>XIMs</sup>
                </span>
              </ATypography>
            </div>
          </div>
        </div>
      </Skeleton>

      <Divider />

      <Skeleton loading={pageLoading} active>
        <AlignedDescription
          column={1}
          labelStyle={{ color: 'rgba(0,0,0,0.5)', minWidth: '150px', paddingTop: '8px', paddingBottom: '8px', verticalAlign: 'top' }}
          contentStyle={{ paddingTop: '8px', paddingBottom: '8px' }}
          bordered>
          <Descriptions.Item label={`${t('email_address')}:`}>{memberDetail?.email || '-'}</Descriptions.Item>
          <Descriptions.Item label={`${t('address')}:`}>
            {memberDetail?.address?.address ? (
              <>
                {memberDetail?.address?.address} <br />
                <AButton className="p-0" type="link" onClick={() => setMapModal(true)}>
                  {t('view_full_map')}
                </AButton>
              </>
            ) : (
              <>-</>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={`${t('vehicle_info')}:`}>
            {(!Boolean(vehicleInfo) || vehicleInfo?.length === 0) && '-'}
          </Descriptions.Item>
        </AlignedDescription>
      </Skeleton>

      {Boolean(vehicleInfo) && vehicleInfo?.length > 0 && (
        <Table //
          className="mb-5"
          scroll={{ x: 1500 }}
          pagination={false}
          columns={carInfoColumns}
          dataSource={vehicleInfo}
        />
      )}

      <TableBootstrapHook
        fetchAll
        title={null}
        description={null}
        notSupportToggle
        supportSearch
        params={requestParams}
        columns={columns}
        getStatistic={props.getMemberRequestRepairStatistic}
        statisticProps={{
          // for statistic API params
          params: { userId: requestParams?.userId },
          name: 'Member',
          key: 'problemType',
          valueSet: {
            // to map params with each filter button
            totalRequests: 'REQUEST',
            totalHelps: 'REPAIR'
          }
        }}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getMemberRequestRepairList}
        buttons={[]}></TableBootstrapHook>

      <Divider />
      <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
        <BasicBtn size="large" type="ghost" onClick={props.onCancel} icon={<CloseOutlined />} title={props.cancelText || t('close')} />
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    user: state['authUser'].user
  }),
  {
    getMemberDetail: memberActions.getMemberDetail,
    getMemberRequests: memberActions.getMemberRequests,
    getRequesterVehicles: requestActions.getRequesterVehicles,
    getMemberRequestRepairStatistic: memberActions.getMemberRequestRepairStatistic,
    getMemberRequestRepairList: memberActions.getMemberRequestRepairList
  }
)(ViewForm);
