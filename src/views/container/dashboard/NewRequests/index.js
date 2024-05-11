import { CalendarFilled, CarFilled, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Geocode from 'react-geocode';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as PATH from '~/configs/routesConfig';
import { authSelectors } from '~/state/ducks/authUser';
import { requestActions } from '~/state/ducks/mechanic/request';
import store from '~/state/store';
import SendQuotationModal from '~/views/container/CarServices/RequestManagement/Modals/SendQuotationModal';
import ViewModal from '~/views/container/CarServices/RequestManagement/Modals/ViewModal';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { AList, AListItem, AListItemMeta } from '~/views/presentation/ui/list/AList';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';

function NewRequests(props) {
  const { t } = useTranslation();
  const [requestList, setRequestList] = useState([]);
  const [detailModalShow, setDetailModalShow] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [sendQuotationModalShow, setSendQuotationModalShow] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNewRequest = async () => {
    const addressValue = store.getState()?.authUser?.user?.address?.fullAddress;
    setLoading(true);
    let address = {
      lat: '',
      lng: ''
    };
    try {
      const response = await Geocode.fromAddress(addressValue);
      const { lat, lng } = response.results[0].geometry.location;
      address.lat = lat;
      address.lng = lng;
    } catch (error) {
      console.error('🚀 ~ file: index.js ~ line 39 ~ fetchNewRequest ~ error', error);
    }
    props
      .getRequests({
        status: 'NEW',
        isOrderByDistance: true,
        ...address
      })
      .then((res) => {
        setRequestList(res?.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: index.js ~ line 25 ~ useEffect ~ err', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const roleAccessRequest = props.getRoleBase?.pagePermissions?.find((role) => [PATH.CAR_SERVICES_PATH].includes(role.path));

    if (!roleAccessRequest?.access?.nonAccess) fetchNewRequest();
  }, []);

  return (
    <>
      <AList
        itemLayout="horizontal"
        dataSource={requestList}
        loading={loading}
        renderItem={(item) => (
          <AListItem>
            <AListItemMeta
              avatar={<CarFilled style={{ fontSize: '24px' }} />}
              title={
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <p
                    className="mb-0"
                    style={{ color: '#000', cursor: 'pointer' }}
                    onClick={() => {
                      setDetailModalShow(true);
                      setViewId(item.id);
                    }}>
                    {item?.category}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center mr-5">
                      <CalendarFilled className="mr-2 text-muted" />
                      <ATypography className="text-muted">{UtilDate.toDateTimeLocal(item.time)}</ATypography>
                    </div>
                    <div className="d-flex align-items-center mr-5">
                      <UserOutlined className="mr-2 text-muted" />
                      <ATypography className="text-muted">{item.requesterName || '-'}</ATypography>
                    </div>
                    {/* <div className="d-flex align-items-center">
                      <CarFilled className="mr-2 text-muted" />
                      <ATypography className="text-muted">{item.vehicle || '-'}</ATypography>
                    </div> */}
                  </div>
                </div>
              }
              description={
                <div>
                  <p>{item?.description}</p>
                  <div className="d-flex align-items-center">
                    <AButton
                      className="pl-0 py-0"
                      onClick={() => {
                        setDetailModalShow(true);
                        setViewId(item.id);
                      }}
                      type="link"
                      style={{ borderRight: '1px solid #000', height: 'fit-content' }}>
                      {t('view_details')}
                    </AButton>
                    <AButton
                      className="py-0"
                      onClick={() => {
                        setSendQuotationModalShow(true);
                        setSelectedProblems([item]);
                      }}
                      type="link"
                      style={{ height: 'fit-content' }}>
                      {t('send_quotation')}
                    </AButton>
                  </div>
                </div>
              }
            />
          </AListItem>
        )}
      />
      <ViewModal //
        id={viewId}
        modalShow={detailModalShow}
        setModalShow={setDetailModalShow}
        setNeedLoadNewData={() => {}}
      />

      <SendQuotationModal //
        modalShow={sendQuotationModalShow}
        setModalShow={setSendQuotationModalShow}
        setNeedLoadNewData={() => {}}
        selectedProblems={selectedProblems}
      />
    </>
  );
}

export default connect(
  (state) => ({
    getRoleBase: authSelectors.getRoleBase(state)
  }),
  {
    getRequests: requestActions.getRequests
  }
)(NewRequests);
