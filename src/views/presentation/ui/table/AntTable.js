import { Table } from 'antd/es';
import React from 'react';

function AntTable(props) {
  return (
    <Table //
      columns={props.columns}
      dataSource={props.data}
      pagination={false}
      loading={props.loading}
      scroll={{ x: 768 }}
      bordered={props.noBordered ? false : true}
      summary={props.renderSummary}
    />
  );
}

export default AntTable;
