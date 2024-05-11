/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Form } from 'antd/es';
import { commonValidate } from '~/views/utilities/ant-validation';
import { Transfer, Table } from 'antd/es';
import difference from 'lodash/difference';
import { replaceVniToEng } from '~/views/utilities/helpers/string';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SCREEN } from '~/views/utilities/layout/window';

const WrapStyleTransfer = styled.div`
  @media (max-width: ${SCREEN.sm}) {
    .ant-transfer {
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-flex-wrap: wrap;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
    }
    .ant-transfer-list {
      margin-bottom: 12px;
    }
    .ant-transfer-operation {
      position: absolute;
      right: -18px;
      top: 108px;
    }
    .ant-btn {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .ant-transfer-operation {
    .ant-btn {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const TableTransfer = ({ leftColumns, rightColumns, loading, ...restProps }) => (
  <Transfer {...restProps} showSelectAll={false}>
    {({ direction, filteredItems, onItemSelectAll, onItemSelect, selectedKeys: listSelectedKeys, disabled: listDisabled }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: (item) => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key);
          const diffKeys = selected ? difference(treeSelectedKeys, listSelectedKeys) : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys
      };
      return (
        <Table
          loading={loading}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            }
          })}
        />
      );
    }}
  </Transfer>
);

function MTransferTable(props) {
  const { t } = useTranslation();
  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  const [targetKeys, setTargetKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    props
      .fetchData()
      .then((res) => {
        setData(
          res.data.map((o) => {
            return { ...o, key: o.id };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error('file: TransferTable.js ~ line 99 ~ useEffect ~ err', err);
      });
  }, []);

  useEffect(() => {
    if (props.value?.length) {
      setTargetKeys(
        props.value.map((o) => {
          return o[props.keyName || 'id'];
        })
      );
    }
    // eslint-disable-next-line
  }, [props.value?.length]);

  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
    props.onTransferChange &&
      props.onTransferChange(
        data.filter((o) => {
          return nextTargetKeys.includes(o[props.keyName || 'id']);
        })
      );
  };

  return (
    <WrapStyleTransfer className="col-12">
      {props.copyBtn || <></>}
      <Form.Item label={props.label || 'MTransferTable'} name={props.name || 'MTransferTable'} {...props} rules={rules}>
        <TableTransfer
          loading={loading}
          dataSource={data}
          targetKeys={targetKeys}
          showSearch={true}
          onChange={onChange}
          filterOption={(inputValue, item) => {
            if (props.searchCorrectly) return (item[props.filterName || 'id'] + '').toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
            else
              return (
                replaceVniToEng((item[props.filterName || 'id'] + '').toLowerCase()).indexOf(replaceVniToEng(inputValue.toLowerCase())) >= 0
              );
          }}
          leftColumns={props.columns || []}
          rightColumns={props.columns || []}
          keyName={props.keyName}
          titles={props.titles || [t('Source'), t('Target')]}
          operations={props.operations || ['', '']}
          operationStyle={{ transform: 'scale(1.15)' }}
        />
      </Form.Item>
    </WrapStyleTransfer>
  );
}

export default MTransferTable;
