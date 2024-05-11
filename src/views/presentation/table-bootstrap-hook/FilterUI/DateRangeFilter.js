import React, { useEffect, useState } from 'react';
import { Form, DatePicker, ConfigProvider } from 'antd/es';
import { UtilDate } from '~/views/utilities/helpers';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { LineOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';
import enUS from 'antd/es/locale/en_US';
import viVN from 'antd/es/locale/vi_VN';
import { connect } from 'react-redux';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

const RangePickerStyled = styled(DatePicker.RangePicker)`
  // border: none;
  // border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: none;
  border-radius: 8px;
  height: 32px;
  // border: 1px solid #eaeaea;
  // background: #fff;
  .ant-picker-input > input {
    text-align: center;
  }
`;

function DateRangeFilter(props) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState('');
  const [clearing, setClearing] = useState(false);
  const [width, setWidth] = useState(148);
  const [locale, setLocale] = useState(enUS);

  useEffect(() => {
    setLocale(props.locale === 'vi' ? viVN : enUS);
  }, [props.locale]);

  useEffect(() => {
    if (props.isClearFilter) {
      setClearing(true);
      setLoading();
      setValue();
      props.onFilter && props.onFilter('');
    }
  }, [props.isClearFilter]);

  return (
    <Form.Item
      onClick={(e) => e.stopPropagation()} // very important for stop propagation (impact sorter of react-table-2)
      className="m-0 p-0"
      validateStatus={loading}
      hasFeedback={false}
      label=""
      colon={false}>
      <ConfigProvider locale={locale}>
        <RangePickerStyled
          allowClear
          inputReadOnly
          suffixIcon={<SVG src={toAbsoluteUrl('/media/svg/icons/Tools/Calendar.svg')} />}
          separator={<LineOutlined style={{ color: 'rgba(0,0,0,0.5)' }} />}
          onClick={(e) => {
            e.stopPropagation();
          }} // very important for stop propagation (impact sorter of react-table-2)
          onChange={(val) => {
            if (val) {
              props.onFilter &&
                props.onFilter({
                  antdCustom: true,
                  value: `${UtilDate.toDateTimeUtc(val[0].startOf('day'))}~${UtilDate.toDateTimeUtc(val[1].endOf('day'))}`
                });
              setWidth('max-content');
              setLoading('success');
            } else {
              !clearing && props.onFilter && props.onFilter(val);
              setWidth(148);
              setLoading();
            }
            setValue(val);
            setClearing(false);
          }}
          value={value}
          placeholder={[t('from'), t('to')]}
          className="w-100"
          onFocus={() => {
            setWidth('max-content');
          }}
          onBlur={() => {
            setWidth(value ? 'max-content' : 148);
          }}
          style={{ minWidth: width, ...props.style }}
          format={UtilDate.formatDateLocal}
          showNow
          renderExtraFooter={() => {
            return <div className="d-flex flex-wrap"></div>;
          }}></RangePickerStyled>
      </ConfigProvider>
    </Form.Item>
  );
}

export default connect(
  (state) => ({
    locale: state['appData']?.locale
  }),
  {}
)(DateRangeFilter);
