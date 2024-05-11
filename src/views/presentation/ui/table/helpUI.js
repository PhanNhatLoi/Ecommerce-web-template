import { Checkbox } from 'antd/es';
import React from 'react';
export function CheckboxTable({ mode, ...rest }) {
  return <Checkbox type={mode} {...rest} />;
}
