import { DatePicker, Radio } from 'antd/es';
import { head } from 'lodash-es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '~/views/presentation/ui/card/Card';
import AntTable from '~/views/presentation/ui/table/AntTable';
import { UtilDate } from '~/views/utilities/helpers';

import FilterForm from './FilterForm';

const RadioStyled = styled(Radio.Group)`
  .ant-radio-button-wrapper:first-child {
    padding-left: 0px !important;
  }
  .ant-radio-button-wrapper:last-child {
    border-right: 1px solid transparent !important;
  }
  .ant-radio-button-wrapper {
    border: none !important;
    border-right: 1px solid rgba(0, 0, 0, 0.2) !important;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
    background-color: transparent !important;
  }
  .ant-radio-button-wrapper:not(:first-child)::before {
    background-color: transparent !important;
  }
`;

function ReportTable(props) {
  const { t } = useTranslation();
  const { width, height } = useWindowSize();

  // -------------------------------------
  // FOR SWITCHING TABLES
  // -------------------------------------
  const [currentTable, setCurrentTable] = useState(head(Object.keys(props.tables)));

  const switchTable = (e) => {
    setCurrentTable(e.target.value);
  };
  // -------------------------------------
  // FOR SWITCHING TABLES
  // -------------------------------------

  const tableColumns = props.tables[currentTable].columns.map((column) => {
    return {
      ...column,
      title: t(column.title)
    };
  });

  return (
    <Card>
      {props.title && (
        <CardHeader
          className="d-flex flex-wrap w-100"
          titleHeader={
            <div className="d-flex flex-column mr-3 my-5 pb-5 pb-lg-1">
              <h2>{props.title}</h2>
              <div className="text-muted" style={{ fontSize: '14px', width: props.description ? (width >= 1025 ? 1000 : '100%') : '100%' }}>
                {/* ---------------------- // FOR DATA RANGE FILTER // ------------------------------ */}
                <DatePicker.RangePicker
                  format={UtilDate.formatDateLocal}
                  value={props.dateRange}
                  onChange={props.onDateRangeChange}
                  separator={<>-</>}
                  className="pl-0"
                  allowClear={false}
                  style={{ width: '200px' }}
                  bordered={false}
                />
                {/* ---------------------- // FOR DATA RANGE FILTER // ------------------------------ */}
              </div>
              {/* ---------------------- // FOR TABLES SWITCHING // ------------------------------ */}
              <div style={{ marginTop: '40px' }}>
                <RadioStyled onChange={switchTable} value={currentTable}>
                  {Object.keys(props.tables).map((tableName) => (
                    <Radio.Button style={{ fontSize: '12px' }} value={tableName}>
                      {t(tableName)}
                    </Radio.Button>
                  ))}
                </RadioStyled>
              </div>
              {/* ---------------------- // FOR TABLES SWITCHING // ------------------------------ */}
            </div>
          }>
          <CardHeaderToolbar>{props.customHeader}</CardHeaderToolbar>
        </CardHeader>
      )}
      <CardBody className="pt-4">
        {/* TODO: ENHANCE LATER */}
        {/* <div className="d-flex align-items-center justify-content-end">
          <AButton className="mr-3" type="link" icon={<DownloadOutlined style={blackText} />} />
          <AButton className="mr-3" type="link" icon={<SettingOutlined style={blackText} />} />
        </div>
        <Divider className="mt-3" /> */}
        {/* ---------------------- // FOR GLOBAL FILTER // ------------------------------ */}
        <FilterForm
          setNeedLoadNewData={props.setNeedLoadNewData}
          setParams={props.setParams}
          style={{ marginBottom: '32px' }}
          filterList={props.tables[currentTable].filters}
        />
        {/* ---------------------- // FOR GLOBAL FILTER // ------------------------------ */}
        <AntTable //
          loading={props.loading}
          columns={tableColumns}
          data={props.tables[currentTable].data}
          renderSummary={props.tables[currentTable].renderSummary}
        />
      </CardBody>
    </Card>
  );
}
export default ReportTable;
