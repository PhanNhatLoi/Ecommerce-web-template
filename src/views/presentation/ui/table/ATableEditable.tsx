import { Form, Input, InputNumber, Popconfirm, Radio, Select, Table } from 'antd/es';
import { last } from 'lodash-es';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import styled from 'styled-components';
import { KTUtil } from '~/static/js/components/util';
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { UtilDate } from '~/views/utilities/helpers';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { toAbsoluteUrl } from '~/views/utilities/helpers/metronic';

import MDatePicker from '../../fields/DatePicker';
import MSelect from '../../fields/Select';

const ATableEditableStyled = styled.div`
  .editable-cell {
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }
  .editable-row .editable-cell-value-wrap {
    min-height: 32px;
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }
  .editable-row .editable-cell-value-wrap:hover {
    min-height: 32px;
    padding: 4px 11px;
    border: 1px solid #434343;
    border-radius: 4px;
  }

  [data-theme='dark'] .editable-row:hover .editable-cell-value-wrap {
    border: 1px solid #434343;
  }
`;

const EditableContext = React.createContext<any>(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr className="ht_animation" {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
type Optiontype = {
  value: string;
  label: string;
  children?: any;
  search?: string;
  object?: any;
};

type EditableCellType = {
  title: string;
  editable: boolean;
  children: any;
  dataIndex: string;
  record: any;
  handleSave: any;
  type: string;
  searchCorrectly: any;
  options: Optiontype[];
  fillOtherField: any;
  fetchData?: {
    action: any;
    value: string;
    label: string;
  };
  unique: boolean;
  fixDataUnique: any;
  columnsValue: string[];
  minNumber: number;
  maxNumber: number;
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  columnsValue,
  type = 'input',
  fetchData,
  searchCorrectly,
  options = [],
  unique,
  fixDataUnique,
  minNumber,
  maxNumber,
  ...restProps
}: EditableCellType) => {
  const { t }: any = useTranslation();
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<any>(null);
  const form = useContext<any>(EditableContext);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    });
  };

  const save = async () => {
    // save data cell
    try {
      let values = await form.validateFields();
      if (restProps.fillOtherField) {
        if (fetchData) {
          values = restProps.fillOtherField(values, record, options.find((o: Optiontype) => o.value === values[dataIndex])?.object);
        } else values = restProps.fillOtherField(values, record);
      }
      if (unique && columnsValue?.length) {
        const checkUnique = columnsValue.filter((f: any) => f.key !== record.key).some((s: any) => s.value === values[dataIndex]);
        if (checkUnique) {
          AMessage.error(t('data_key_unique'));
          values = fixDataUnique(record, values);
        }
      }

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.error('Save failed:', errInfo);
    }
  };

  // type input
  let childNode = children;
  let input = <Input autoFocus ref={inputRef} onPressEnter={save} onBlur={save} />;
  switch (type) {
    case 'select':
      input = (
        <Select
          defaultActiveFirstOption
          defaultOpen
          autoFocus
          ref={inputRef}
          showSearch
          className="w-100"
          optionFilterProp="children"
          onChange={save}
          onBlur={save}>
          {options.map((o: Optiontype, i) => {
            return (
              <Select.Option key={`sl${i}`} value={o.value} search={o.search}>
                {o.label}
              </Select.Option>
            );
          })}
        </Select>
      );
      break;
    case 'number':
      input = (
        <InputNumber
          ref={inputRef}
          onPressEnter={save}
          autoFocus
          className="w-100"
          formatter={(value: any) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          max={maxNumber || Number.MAX_SAFE_INTEGER}
          min={minNumber || 0}
          parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
          onBlur={save}
        />
      );
      break;
    case 'radio':
      input = <Radio.Group ref={inputRef} onBlur={save} onChange={save} options={options} optionType="button" buttonStyle="solid" />;
      break;
    case 'date':
      input = (
        <MDatePicker
          onPressEnter={save}
          require={false}
          placeholder=" "
          name={dataIndex}
          noLabel
          noPadding
          autoFocus
          className="w-100"
          ref={inputRef}
          onBlur={save}
        />
      );
      break;
    case 'selectApi':
      input = (
        <MSelect
          onPressEnter={save}
          autoFocus
          name={dataIndex}
          className="w-100"
          noLabel
          noPadding
          placeholder=" "
          ref={inputRef}
          onBlur={save}
          onChange={save}
          options={options}
        />
      );
      break;
    default:
      break;
  }

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}>
        {input}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}>
        {type === 'select' || type === 'selectApi'
          ? options.find((o: Optiontype) => o.value === record[dataIndex])?.label
          : type === 'date'
          ? UtilDate.toDateLocal(record?.date?._d)
          : type === 'number'
          ? numberFormatDecimal(record[dataIndex])
          : children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

function ATableEditable(props) {
  const { t }: any = useTranslation();
  const [viewData, setViewData] = useState<{ key: number; isValid?: boolean }[]>([]);
  const [addRow, setAddRow] = useState(false);
  const dataTemplate = props.dataTemplate || null;
  const [fetchData, setFetchData] = useState({});

  useEffect(() => {
    const filterValue = props.columns.filter((f) => f?.fetchData);
    if (filterValue.length) {
      filterValue.map((m) => {
        m.fetchData
          .action({ size: 9999, ...m?.fetchData?.params })
          .then((res) => {
            setFetchData((pre) => {
              return {
                ...pre,
                [m.dataIndex]: res.content.map((e) => {
                  return {
                    label: e[m.fetchData.label],
                    value: e[m.fetchData.value],
                    object: e
                  };
                })
              };
            });
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
  }, []);

  const resetKey = (data) => {
    setViewData(() => {
      data.map((e, index) => {
        e.key = index + 1;
        e.isValid = isValid(e);
        return e;
      });
      return data;
    });
  };

  useEffect(() => {
    if (props?.needLoadNewData) {
      props.setNeedLoadNewData(false);
      resetKey(props?.dataSource);
    }
  }, [props.needLoadNewData]);

  useEffect(() => {
    // save array data
    resetKey(viewData);
    setAddRow(!viewData.some((s) => s.isValid === false));
    props.setDataSource(viewData.filter((f) => f.isValid === true));
  }, [viewData]);

  useEffect(() => {
    // auto add or enable button add
    if (addRow && props.autoAdd) {
      handleAdd();
    }
  }, [addRow]);

  // button delete
  const columns = props.noActionBtn
    ? props.columns
    : props.columns.concat([
        {
          title: t('operation'),
          width: 100,
          align: 'center',
          dataIndex: 'operation',
          fixed: KTUtil.isMobileDevice() ? false : 'right',
          render: (_, record) => (
            <div className={props.isNone ? ' d-none justify-content-center' : ' d-flex justify-content-center'}>
              <Popconfirm
                placement="topRight"
                title={record.key === viewData.length && props?.autoAdd ? t('confirm_reset') : t('reset_line')}
                onConfirm={() => handleDelete(record.key)}
                okText={t('okTextConfirm')}
                cancelText={t('cancelTextConfirm')}>
                <button title="Delete" className="btn btn-icon btn-light btn-hover-danger btn-sm">
                  <span className="svg-icon svg-icon-md svg-icon-danger">
                    <SVG src={toAbsoluteUrl('/media/svg/icons/General/Trash.svg')} />
                  </span>
                </button>
              </Popconfirm>
            </div>
          )
        }
      ]);

  const handleDelete = (key) => {
    if (props.autoAdd && key === last(viewData).key) {
      viewData.pop();
      resetKey([...viewData, { key: viewData.length + 1 }]);
    } else resetKey(viewData.filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    setAddRow(false);
    const newRow = { ...dataTemplate, key: viewData.length + 1, isValid: false };
    setViewData([...viewData, newRow]);
  };

  const isValid = (row): boolean => {
    let temp = true;
    props.columns.map((col) => {
      const value = row[`${col.dataIndex}`];
      if (col?.require && !value && value !== 0) temp = false;
    });
    return temp;
  };

  const handleSave = (row) => {
    row.isValid = isValid(row);
    const dataSource2 = [...viewData];
    const index = viewData.findIndex((item) => row.key === item.key);
    dataSource2[index] = { ...dataSource2[index], ...row };
    setViewData(dataSource2);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  };
  const columnsEditable = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    //check unique
    const data = viewData.filter((f) => f[col.dataIndex]);
    const columnsValue: any[] = data.map((v) => {
      if (v[col.dataIndex]) return { key: v.key, value: v[col.dataIndex] };
    });
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        type: col.type,
        searchCorrectly: col.searchCorrectly, // for search correct
        options: col.options ? col.options : col.fetchData ? fetchData[col.dataIndex] : [],
        fillOtherField: col.fillOtherField,
        fetchData: col.fetchData,
        unique: col.unique,
        fixDataUnique: col.fixDataUnique,
        columnsValue: columnsValue,
        minNumber: col.minNumber,
        maxNumber: col.maxNumber,
        handleSave: handleSave
      })
    };
  });

  return (
    <ATableEditableStyled>
      <Card>
        <div>
          {props?.title && (
            <CardHeader titleHeader={props.title}>
              <CardHeaderToolbar className="col-xl-3 col-lg-4 col-md-5 p-0 "></CardHeaderToolbar>
            </CardHeader>
          )}
        </div>
        <CardBody className="p-0">
          <Table
            size="small"
            loading={props.loading}
            scroll={{ x: props.scrollX ? props.scrollX : '100%' }}
            style={{ marginBottom: '16px' }}
            rowKey={props.rowKey || 'id'}
            pagination={{ hideOnSinglePage: true }}
            bordered
            components={components}
            dataSource={viewData}
            columns={columnsEditable}
            rowClassName={(record, index) => {
              return 'editable-row ';
            }}
          />
          {!props?.autoAdd && !props.notSupportAddBtn && (
            <button disabled={!addRow} type="button" className="btn btn-info btn-sm mb-2" onClick={handleAdd}>
              <span className="svg-icon">
                <SVG src={toAbsoluteUrl('/media/svg/icons/Navigation/Plus.svg')} />
                {` `} {t('addButton')}
              </span>
            </button>
          )}
        </CardBody>
      </Card>
    </ATableEditableStyled>
  );
}

export default ATableEditable;
