import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Image, Tabs } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { DEFAULT_AVATAR } from '~/configs/default';
import { renderMechanicStatus } from '~/configs/status/car-services/mechanicStatus';
import { mechanicActions } from '~/state/ducks/mechanic';
import Divider from '~/views/presentation/divider';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { API_URL } from '~/configs';

const MemberTable = (props) => {
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const { t } = useTranslation();
  let columns = [
    {
      dataField: 'profileId',
      text: t('employee_id'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return cell || '-';
      }
    },
    {
      dataField: 'fullName',
      text: t('fullname'),
      style: {
        minWidth: 200,
        position: 'sticky',
        left: 0
      },
      formatter: (cell, row) => {
        return cell || '-';
      }
    },
    {
      dataField: 'phone',
      text: t('phone_number'),
      style: {
        minWidth: 170
      },
      formatter: (cell, row) => {
        return <span>{cell ? formatPhoneWithCountryCode(cell, row?.country?.code) : '-'}</span>;
      }
    },
    {
      dataField: 'avatar',
      text: t('profile_picture'),
      style: {
        minWidth: 50,
        textAlign: 'center'
      },
      filter: '',
      filterRenderer: '',
      formatter: (cell) => {
        if (cell) {
          let src = !cell.includes('http') ? firstImage(cell) : cell || DEFAULT_AVATAR;
          return cell.includes('http') ? (
            <Image
              preview={{
                mask: <EyeOutlined />
              }}
              width={32}
              src={src}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <AuthImage
              preview={{
                mask: <EyeOutlined />
              }}
              width={32}
              isAuth={true}
              src={src}
              // onClick={(e) => e.stopPropagation()}
            />
          );
        } else return <span></span>;
      },
      csvFormatter: (cell) => {
        return cell ? firstImage(cell) : API_URL + DEFAULT_AVATAR;
      }
    },
    {
      dataField: 'yearsOfExperience',
      text: t('yrs_of_exp'),
      headerStyle: {
        textAlign: 'center'
      },
      style: {
        minWidth: 110,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return cell || '-';
      }
    },
    {
      dataField: 'revenue',
      text: t('revenue'),
      headerStyle: {
        textAlign: 'center'
      },
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <span>{cell ? `${numberFormatDecimal(+cell, ' đ', '')}` : '-'}</span>;
      }
    },
    {
      dataField: 'numOfHelps',
      text: t('numOfHelps'),
      headerStyle: {
        textAlign: 'center'
      },
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <span>{cell ? `${numberFormatDecimal(+cell, '', '')}` : '-'}</span>;
      }
    },
    {
      dataField: 'ratings',
      text: t('ratings'),
      headerStyle: {
        textAlign: 'center'
      },
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell) => {
        return <span>{cell ? `${cell}*` : '-'}</span>;
      }
    },
    {
      dataField: 'roles',
      text: t('roles'),
      headerStyle: {
        textAlign: 'center'
      },
      style: {
        minWidth: 110,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return t('service_advisor');
      }
    },
    {
      dataField: 'memberStatus',
      text: t('status'),
      headerStyle: {
        textAlign: 'center'
      },
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      formatter: (cell, row) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderMechanicStatus(cell, t(cell), 'tag')}</div>;
      }
    }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------
  columns = columns.map((column) => {
    return {
      editable: false,
      sort: false,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
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
  return (
    <div>
      <TableBootstrapHook
        supportEdit // for editable and save
        isDateFilterReverse
        tableMaxHeight="fit-content !important"
        notSupportPagination
        columns={columns}
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        dataRangeKey="joinedDate" // for data range filter
        selectField="profileId"
        notSupportStatistic
        searchPlaceholder={t('member_search')}
        fetchData={props.fetchData}
        isClearFilter={null}
        params={{
          memberRole: 'ROLE_CONSUMER',
          sort: props.sort,
          page: 0,
          size: 10
        }}
        buttons={[]}></TableBootstrapHook>
    </div>
  );
};

const TopMemberModal = (props) => {
  const { t } = useTranslation();

  const closeModal = () => {
    props.setModalShow(false);
  };

  return (
    <AntModal //
      modalShow={props.modalShow}
      destroyOnClose
      onCancel={closeModal}
      title={t('top_10_employee')}
      description={t('top_10_employee_des')}
      width={1000}>
      <Tabs type="card">
        <Tabs.TabPane tab={t('highest_revenue')} key="1">
          <MemberTable sort="revenue,desc" fetchData={props.getTopMechanics} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('most_repairs')} key="2">
          <MemberTable sort="totalRepair,desc" fetchData={props.getTopMechanics} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('highest_rates')} key="3">
          <MemberTable sort="raiting,desc" fetchData={props.getTopMechanics} />
        </Tabs.TabPane>
      </Tabs>
      <Divider />
      <AButton
        style={{ verticalAlign: 'middle', width: '200px' }}
        className="mt-3 mt-lg-0 ml-lg-3 px-5"
        size="large"
        type="ghost"
        onClick={closeModal}
        icon={<CloseOutlined />}>
        {props.cancelText || t('close')}
      </AButton>
    </AntModal>
  );
};

export default connect(null, {
  getTopMechanics: mechanicActions.getTopMechanics
})(TopMemberModal);
