import React, { useEffect, useState } from 'react';
import { Form, DatePicker } from 'antd/es';
import { UtilDate } from '~/views/utilities/helpers';
import moment from 'moment';

function DateFilter(props) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState('');
  const [clearing, setClearing] = useState(false);

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
      <DatePicker
        allowClear
        onClick={(e) => e.stopPropagation()} // very important for stop propagation (impact sorter of react-table-2)
        onChange={(val) => {
          if (val) {
            props.onFilter && props.onFilter(val ? UtilDate.toDateTimeUtc(val) : val);
            setLoading('success');
          } else {
            !clearing && props.onFilter && props.onFilter(val);
            setLoading();
          }
          setValue(val);
          setClearing(false);
        }}
        value={value}
        placeholder={props.placeholder}
        className="w-100"
        style={{ minWidth: 132, ...props.style }}
        format={UtilDate.formatDateLocal}
        showNow
        disabledDate={(day) => {
          return day && day < moment().subtract(1, 'day').endOf('day');
        }}></DatePicker>
    </Form.Item>
  );
}
export default DateFilter;
