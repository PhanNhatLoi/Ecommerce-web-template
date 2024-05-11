import React, { useEffect, useState } from 'react';
import { DatePicker, Form } from 'antd/es';
import moment from 'moment';
import styled from 'styled-components';
import useFirstRender from '~/views/hooks/UseFirstRender';
import { UtilDate } from '~/views/utilities/helpers';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;

const WrapRangePicker = styled(Form.Item)`
  .ant-picker {
    min-width: 150px;
    border: none;
    background-color: rgba(24, 125, 228, 0.12);
    border-radius: 4px;
    height: 34px;
    width: auto;
  }
  .ant-picker-focused {
    outline: 0;
    box-shadow: none;
  }
  .w-225 {
    min-width: 225px;
  }
  .ant-picker-clear {
    background: #e3effc;
    svg {
      width: 15px;
      height: 15px;
    }
  }
`;
function RangeDateFilter({ onFilter, isClearFilters }) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  const isFirstRender = useFirstRender();

  useEffect(() => {
    if (!isFirstRender && onFilter) {
      if (!isClearFilters) {
        if (value) {
          const from = UtilDate.toDateTimeUtc(moment(value[0])?.startOf('day'));
          const to = UtilDate.toDateTimeUtc(moment(value[1])?.endOf('day'));
          onFilter({ from, to });
        } else {
          onFilter();
        }
      } else {
        onFilter('clear_filters_ignore_fetch');
      }
    }
  }, [value]);

  useEffect(() => {
    !isFirstRender && isClearFilters && setValue();
  }, [isClearFilters]);

  return (
    <WrapRangePicker hasFeedback={false} onClick={(e) => e.stopPropagation()} className="m-0 p-0">
      <RangePicker
        className={`${value ? 'w-225' : null}`}
        ranges={{
          Today: [moment(), moment()],
          'This Week': [moment().startOf('week'), moment().endOf('week')],
          'This Month': [moment().startOf('month'), moment().endOf('month')]
        }}
        value={value}
        format="MM/DD/YYYY"
        placeholder={[t('from'), t('to')]}
        onChange={(value) => setValue(value)}
      />
    </WrapRangePicker>
  );
}

export default RangeDateFilter;
