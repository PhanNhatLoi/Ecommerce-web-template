import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Image, Tabs } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { DEFAULT_AVATAR } from '~/configs/default';
import { renderMemberStatus } from '~/configs/status/auto-clubs/memberStatus';
import { memberActions } from '~/state/ducks/member';
import Divider from '~/views/presentation/divider';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import { UtilDate } from '~/views/utilities/helpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { API_URL } from '~/configs';

const TOP_MEMBER_TAB = {
  REQUEST: 'REQUEST',
  HELP: 'HELP',
  XIM: 'XIM'
};

const MemberTable = (props) => {
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const { t } = useTranslation();
  let columns = [
    {
      dataField: 'profileId',
      text: t('member_id'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 150, textAlign: 'center' }
    },
    {
      dataField: 'fullname',
      text: t('full_name'),
      style: {
        minWidth: 250,
        textAlign: 'left'
      },
      headerStyle: { minWidth: 250, textAlign: 'left' }
    },
    {
      dataField: 'phoneNumber',
      text: t('phone_number'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 150, textAlign: 'center' },
      formatter: (cell, row) => {
        return <span>{formatPhoneWithCountryCode(cell)}</span>;
      }
    },
    {
      dataField: 'avatar',
      text: t('profile_picture'),
      sort: false,
      style: {
        minWidth: 150,
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center'
      },
      headerStyle: { minWidth: 150, textAlign: 'center' },
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
      dataField: 'joinedDate',
      text: t('joined_date'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 150, textAlign: 'center' },
      formatter: (cell, row) => {
        return <span>{UtilDate.toDateTimeLocal(cell)}</span>;
      }
    },
    {
      dataField: 'status',
      text: t('status'),
      sort: false,
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 150, textAlign: 'center' },
      formatter: (cell) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderMemberStatus(cell, t(cell), 'tag')}</div>;
      }
    },
    {
      dataField: 'totalRequests',
      text: t('total_requests'),
      hidden: [TOP_MEMBER_TAB.HELP, TOP_MEMBER_TAB.XIM].includes(props.currentTab),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 150, textAlign: 'center' },
      formatter: (cell, row) => {
        return numberFormatDecimal(cell, '', '');
      }
    },
    {
      dataField: 'totalHelps',
      text: t('total_helps'),
      hidden: [TOP_MEMBER_TAB.REQUEST, TOP_MEMBER_TAB.XIM].includes(props.currentTab),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 150, textAlign: 'center' },
      formatter: (cell, row) => {
        return numberFormatDecimal(cell, '', '');
      }
    },
    {
      dataField: 'totalXims',
      text: t('total_xims'),
      hidden: [TOP_MEMBER_TAB.REQUEST, TOP_MEMBER_TAB.HELP].includes(props.currentTab),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: { minWidth: 150, textAlign: 'center' },
      formatter: (cell, row) => {
        return numberFormatDecimal(cell, '', '');
      }
    }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------
  columns = columns.map((column) => {
    return {
      editable: false,
      sort: true,
      sortCaret: sortCaret,
      headerClasses: 'ht-custom-header-table',
      headerFormatter: ColumnFormat,
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
        dataRangeKey="joinedDate" // for data range filter
        selectField="profileId"
        notSupportStatistic
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        searchPlaceholder={t('member_search')}
        fetchData={props.fetchData}
        isClearFilter={null}
        params={{
          memberRole: 'ROLE_CONSUMER',
          status: 'APPROVED',
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
  const [currentTab, setCurrentTab] = useState(TOP_MEMBER_TAB.REQUEST);

  const closeModal = () => {
    props.setModalShow(false);
  };

  return (
    <AntModal //
      modalShow={props.modalShow}
      destroyOnClose
      onCancel={closeModal}
      title={t('top_10_members')}
      description={t('top_10_members_des')}
      width={1150}>
      <Tabs type="card" onChange={(key) => setCurrentTab(key)}>
        <Tabs.TabPane tab={t('most_requests')} key={TOP_MEMBER_TAB.REQUEST}>
          <MemberTable sort="totalRequests,desc" fetchData={props.getMembers} currentTab={currentTab} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('most_helps')} key={TOP_MEMBER_TAB.HELP}>
          <MemberTable sort="totalHelps,desc" fetchData={props.getMembers} currentTab={currentTab} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('most_xims')} key={TOP_MEMBER_TAB.XIM}>
          <MemberTable sort="totalXims,desc" fetchData={props.getMembers} currentTab={currentTab} />
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
  getMembers: memberActions.getMembers,
  deleteMember: memberActions.deleteMember
})(TopMemberModal);
