import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import { renderRequestStatus } from '~/configs/status/car-services/mechanicRequestStatus';
import { dashboardActions } from '~/state/ducks/carServices/dashboard';
import ViewModal from '~/views/container/CarServices/RequestManagement/Modals/ViewModal';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import COLOR from '~/views/utilities/layout/color';

const BodyStyled = styled.div`
  .card.card-custom {
    box-shadow: none;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #fcfcfc;
  }

  .header-table {
    padding-top: 15px;
    padding-left: 30px;
    padding-right: 30px;
    margin-bottom: 0px;
    display: flex;
    justify-content: space-between;
  }
  .header-table span {
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .header-table a {
    color: ${COLOR.blue02};
  }
`;

function PickupTable(props) {
  const { t } = useTranslation();
  const history = useHistory();

  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [viewRequestId, setViewRequestId] = useState(null);

  const columns = [
    {
      dataField: 'userName',
      text: t('customer_name'),
      sort: false,
      formatter: (cell, row) => {
        return (
          <AButton
            type="link"
            onClick={() => {
              setViewModalShow(true);
              setViewRequestId(row.requestId);
            }}>
            {cell || '-'}
          </AButton>
        );
      }
    },
    {
      dataField: 'phone',
      text: t('phone_number'),
      formatter: (cell, row) => {
        return cell ? formatPhoneWithCountryCode(cell, cell?.startsWith('84') ? 'VN' : cell?.startsWith('1') ? 'US' : 'VN') : '-';
      }
    },
    {
      dataField: 'category',
      text: t('service_order'),
      sort: true
    },
    {
      dataField: 'date',
      text: t('booking_date'),
      sort: true,
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateTimeLocal(cell)}</span>;
      }
    },
    {
      dataField: 'status',
      text: t('status'),
      sort: true,
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderRequestStatus(cell, t(cell), 'tag')}</div>;
      }
    }
  ];

  return (
    <BodyStyled>
      <TableBootstrapHook
        // title={t('available_to_pick_up')}
        customHeader={
          <div className="header-table">
            <div>
              <span>{t('available_to_pick_up')}</span>
            </div>
            <div>
              <a
                onClick={() => {
                  history.push(PATH.CAR_SERVICES_NEW_REQUEST_PATH);
                }}>
                {t('view_all')}
              </a>
              {/* <AButton
                style={{ border: 'none', backgroundColor: 'transparent' }}
                onClick={() => history.push(PATH.CAR_SERVICES_NEW_REQUEST_PATH)} content={t('view_all')}/>
              */}
            </div>
          </div>
        }
        description={null}
        notSupportToggle
        notSupportStatistic
        notSupportPagination
        params={{
          page: 0,
          size: 5
        }}
        columns={columns}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getRequestList}
        buttons={[]}></TableBootstrapHook>

      <ViewModal //
        id={viewRequestId}
        modalShow={viewModalShow}
        setModalShow={setViewModalShow}
        setNeedLoadNewData={setNeedLoadNewData}
      />
    </BodyStyled>
  );
}

export default connect((state) => ({}), {
  getRequestList: dashboardActions.getRequestList
})(PickupTable);
