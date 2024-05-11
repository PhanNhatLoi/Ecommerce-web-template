import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { renderQuotationStatus } from '~/configs/status/car-services/quotationStatus';
import { quotationActions } from '~/state/ducks/mechanic/quotation';
import { memberActions } from '~/state/ducks/member';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { headerSortingClasses, sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

function QuotationTable(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);

  const columns = [
    {
      dataField: 'repairId',
      text: t('request_id'),
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: 'request',
      text: t('incident'),
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: 'requesterName',
      text: t('requester'),
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses
    },
    {
      dataField: 'totalPrice',
      text: t('total_fee'),
      sort: true,
      sortCaret: sortCaret,
      formatter: (cell) => numberFormatDecimal(+cell, ' đ', '')
    },
    {
      dataField: 'createdDate',
      text: t('sent_date'),
      sort: true,
      sortCaret: sortCaret,
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateLocal(cell)}</span>;
      }
    },

    {
      dataField: 'uiStatus',
      text: t('status'),
      sortCaret: sortCaret,
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell ? renderQuotationStatus(cell, t(cell), 'tag') : cell}</div>;
      }
    }
  ];

  return (
    <TableBootstrapHook
      title={t('quotations')}
      customHeader={
        <AButton type="default" onClick={() => history.push(PATH.CAR_SERVICES_QUOTATION_LIST_PATH)}>
          {t('view_all')}
        </AButton>
      }
      description={null}
      notSupportToggle
      notSupportStatistic
      params={{
        requesterId: props.id,
        uiStatus: 'WAITING_ACCEPT',
        sort: 'lastModifiedDate,desc',
        size: 5
      }}
      columns={columns}
      needLoad={needLoadNewData}
      setNeedLoad={setNeedLoadNewData}
      fetchData={props.getQuotations}
      buttons={[]}></TableBootstrapHook>
  );
}

export default connect((state) => ({}), {
  getQuotations: quotationActions.getQuotations,
  getMemberDetail: memberActions.getMemberDetail,
  getMemberRequests: memberActions.getMemberRequests,
  getMemberRequestStatistic: memberActions.getMemberRequestStatistic
})(QuotationTable);
