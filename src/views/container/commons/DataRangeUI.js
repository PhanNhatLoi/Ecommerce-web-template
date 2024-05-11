import 'moment/locale/vi';

import { CloseCircleFilled, DownOutlined, LineOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, DatePicker, Dropdown, Menu } from 'antd/es';
import enUS from 'antd/es/locale/en_US';
import viVN from 'antd/es/locale/vi_VN';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { getKeyForDateFilter } from '~/views/utilities/helpers/string';
import UtilDate from '~/views/utilities/helpers/UtilDate';
import COLOR from '~/views/utilities/layout/color';

// FOR DATA RANGE
const MenuStyled = styled(Menu)`
  max-width: 250px !important;
  width: 250px;
  // background-color: #000;
  background-color: #fff;
  padding: 16px 8px;
  border-radius: 5px;

  // fix bug xuất hiện nhiều mũi tên trong dropdown
  // ::before {
  //   content: ' ';
  //   width: 0;
  //   height: 0;
  //   border-left: 8px solid transparent;
  //   border-right: 8px solid transparent;
  //   border-bottom: 8px solid black;
  //   position: absolute;
  //   top: -8px;
  //   right: 100px;
  // }
  // fix bug xuất hiện nhiều mũi tên trong dropdown

  .ant-dropdown-menu-item button {
    // color: #fff;
    color: ${COLOR.textTitle};
    // border-bottom: solid 1px ${COLOR.Gray6};
  }
  .ant-dropdown-menu-item button:hover {
    color: #000;
  }
`;

const DataRangeBtn = styled(Button)`
  span {
    color: #3f4254;
  }
  font-size: 14px;
  @media (max-width: 768px) {
    font-size: 12.96px;
  }
  @media (max-width: 375px) {
    font-size: 12px;
  }
  @media (max-width: 320px) {
    font-size: 11px;
    .ant-btn {
      font-size: 11px;
    }
  }
`;

const RangePickerStyled = styled(DatePicker.RangePicker)`
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: none;
  .ant-picker-input > input {
    text-align: center;
  }
`;
// FOR DATA RANGE

let dateType = {
  today: 'today',
  week: 'this_week',
  month: 'this_month',
  year: 'this_year',
  custom: 'custom',
  all: ''
};

const DataRangeUI = (props) => {
  const { t } = useTranslation();
  const [resetDisplay, setResetDisplay] = useState(false);
  const [customRangeValue, setCustomRangeValue] = useState('');
  const [locale, setLocale] = useState(enUS);
  const [dataRangeKey, setDataRangeKey] = useState({});
  const rangeType = ['today', 'this_week', 'this_month', 'this_year', 'custom'];

  useEffect(() => {
    if (props.rangeTitle === t('data_range')) {
      setResetDisplay(false);
    } else {
      setResetDisplay(true);
    }
  }, [props.rangeTitle]);

  useEffect(() => {
    setLocale(props.locale === 'vi' ? viVN : enUS);
    moment.locale(props.locale);
  }, [props.locale]);

  useEffect(() => {
    setDataRangeKey({
      // FOR 2 CASES:
      // 1. Booking'From'Date
      // 2. BookingDate'From'
      from: props.isDateFilterReverse ? props.dataRangeKey + 'From' : getKeyForDateFilter(props.dataRangeKey, 'From'),
      to: props.isDateFilterReverse ? props.dataRangeKey + 'To' : getKeyForDateFilter(props.dataRangeKey, 'To')
    });
  }, []);

  const handleReset = () => {
    props.setRangeTitle(t('data_range'));
    props.setRangeStr('');
    setCustomRangeValue('');
    props.setFiltersDataRange();
    props.getData({ ...props.currentQueries, [dataRangeKey.from]: undefined, [dataRangeKey.to]: undefined });
  };

  const handleSelectedRange = (type) => {
    const selected = type;
    if (selected === dateType.today) {
      let rangeDate = UtilDate.getRangeDate('today');
      let startDate = new Date(rangeDate.from);

      // for filter querries
      let arrFrom = UtilDate.toDateTimeUtc(rangeDate.from);
      let arrTo = UtilDate.toDateTimeUtc(rangeDate.to);
      props.getData({ ...props.currentQueries, [dataRangeKey.from]: arrFrom, [dataRangeKey.to]: arrTo });
      props.setFiltersDataRange({ [dataRangeKey.from]: arrFrom, [dataRangeKey.to]: arrTo });
      props.setRangeTitle(t('today'));
      props.setRangeStr(`(${moment(startDate).format(props.locale === 'vi' ? 'ddd, D MMMM' : 'ddd, MMMM D')})`);
    } else if (selected === 'this_week') {
      let rangeDate = [moment().startOf('isoWeek'), moment().endOf('isoWeek')];
      let startDate = new Date(rangeDate[0]);
      let endDate = new Date(rangeDate[1]);

      // for filter querries
      let arrFrom = UtilDate.toDateTimeUtc(rangeDate[0]);
      let arrTo = UtilDate.toDateTimeUtc(rangeDate[1]);
      props.getData({ ...props.currentQueries, [dataRangeKey.from]: arrFrom, [dataRangeKey.to]: arrTo });
      props.setFiltersDataRange({ [dataRangeKey.from]: arrFrom, [dataRangeKey.to]: arrTo });
      props.setRangeTitle(t('this_week'));
      props.setRangeStr(
        `(${moment(startDate).format(props.locale === 'vi' ? 'D MMMM' : 'MMMM D')} - ${moment(endDate).format(
          props.locale === 'vi' ? 'D MMMM' : 'MMMM D'
        )})`
      );
    } else if (selected === 'this_month') {
      let rangeDate = [moment().startOf('month'), moment().endOf('month')];
      let startDate = new Date(rangeDate[0]);
      let endDate = new Date(rangeDate[1]);

      // for filter querries
      let arrFrom = UtilDate.toDateTimeUtc(rangeDate[0]);
      let arrTo = UtilDate.toDateTimeUtc(rangeDate[1]);
      props.getData({ ...props.currentQueries, [dataRangeKey.from]: arrFrom, [dataRangeKey.to]: arrTo });
      props.setFiltersDataRange({ [dataRangeKey.from]: arrFrom, [dataRangeKey.to]: arrTo });
      props.setRangeTitle(t('this_month'));
      props.setRangeStr(
        `(${moment(startDate).format(props.locale === 'vi' ? 'D MMMM' : 'MMMM D')} - ${moment(endDate).format(
          props.locale === 'vi' ? 'D MMMM' : 'MMMM D'
        )})`
      );
    } else if (selected === 'this_year') {
      let rangeDate = [moment().startOf('year').add(1, 'd'), moment().endOf('year')];
      let startDate = new Date(rangeDate[0]);
      let endDate = new Date(rangeDate[1]);

      // for filter querries
      let arrFrom = UtilDate.toDateTimeUtc(rangeDate[0]);
      let arrTo = UtilDate.toDateTimeUtc(rangeDate[1]);
      props.getData({ ...props.currentQueries, [dataRangeKey.from]: arrFrom, [dataRangeKey.to]: arrTo });
      props.setFiltersDataRange({ [dataRangeKey.from]: arrFrom, [dataRangeKey.to]: arrTo });
      props.setRangeTitle(t('this_year'));
      props.setRangeStr(
        `(${moment(startDate).format(props.locale === 'vi' ? 'D MMMM' : 'MMMM D')} - ${moment(endDate).format(
          props.locale === 'vi' ? 'D MMMM' : 'MMMM D'
        )})`
      );
    }
  };

  const dataRangeMenu = () => {
    return (
      <MenuStyled>
        {rangeType.map((type) => {
          if (type === 'custom') {
            return (
              <ConfigProvider locale={locale}>
                <RangePickerStyled
                  separator={<LineOutlined style={{ color: 'rgba(0,0,0,0.5)' }} />}
                  format={UtilDate.formatDateLocal}
                  value={customRangeValue}
                  placeholder={[t('from'), t('to')]}
                  inputReadOnly
                  onChange={(dates, dateStrings) => {
                    setCustomRangeValue(dates);
                    let startDate = new Date(dates[0]);
                    let endDate = new Date(dates[1]);
                    if (dates) {
                      props.setRangeTitle(t(''));
                      props.setRangeStr(
                        `(${moment(startDate).format(props.locale === 'vi' ? 'D MMMM' : 'MMMM D')} - ${moment(endDate).format(
                          props.locale === 'vi' ? 'D MMMM' : 'MMMM D'
                        )})`
                      );
                    }
                    /* Setting the time to 00:00:00:000 and 23:59:59:999 to cover all days for fliter request */
                    startDate.setUTCHours(0, 0, 0, 0);
                    endDate.setUTCHours(23, 59, 59, 999);
                    // for filter querries
                    let arrFrom = UtilDate.toDateTimeUtc(startDate);
                    let arrTo = UtilDate.toDateTimeUtc(endDate);
                    props.getData({ ...props.currentQueries, [dataRangeKey.from]: arrFrom, [dataRangeKey.to]: arrTo });
                  }}
                />
              </ConfigProvider>
            );
          } else
            return (
              <Menu.Item>
                <AButton //
                  className="w-100 d-flex"
                  type="link"
                  onClick={() => handleSelectedRange(type)}>
                  {t(type)}
                </AButton>
              </Menu.Item>
            );
        })}
      </MenuStyled>
    );
  };

  return (
    <div className="d-flex" style={{ paddingRight: '15px' }}>
      <Dropdown overlay={dataRangeMenu} placement="bottomCenter" trigger="click" className="pr-0">
        <DataRangeBtn type="link" style={{ color: '#000' }} className="d-flex align-items-center py-0">
          {/* <FilterFilled /> */}
          {t(props.rangeTitle)} {props.rangeStr}
          <DownOutlined />
        </DataRangeBtn>
      </Dropdown>
      {resetDisplay && (
        <AButton
          type="link"
          style={{ color: 'rgba(0, 0, 0, 0.25)' }}
          onClick={handleReset}
          className="d-flex align-items-center pl-2 pr-0"
          icon={<CloseCircleFilled style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
        />
      )}
    </div>
  );
};

export default connect(
  (state) => ({
    locale: state['appData']?.locale
  }),
  {}
)(DataRangeUI);
