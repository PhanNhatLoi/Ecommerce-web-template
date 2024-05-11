import { EditOutlined, EyeOutlined, MinusCircleOutlined } from '@ant-design/icons';
import React, { ReactElement, useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { CROSS_CHECK, CROSS_CHECK_PAYMENT, CROSS_CHECK_RESULT, renderCrossCheck } from '~/configs/status/car-accessories/crossCheckTypes';
import { crossCheckActions } from '~/state/ducks/cross-check';
import { UnitRespone } from '~/state/ducks/units/actions';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHook from '~/views/presentation/table-bootstrap-hook';
import InputFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/InputFilter';
import SelectFilter from '~/views/presentation/table-bootstrap-hook/FilterUI/SelectFilter';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { sortCaret } from '~/views/utilities/helpers/TableSortingHelpers';

import GetExcelFileModal from '../Modal/GetExcelFileModal';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

type ProductSpecificationProps = {
  createCrossCheck: any;
  getCrossCheck: any;
};

const CrossCheckTable: React.FC<ProductSpecificationProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [needLoadNewData, setNeedLoadNewData] = useState<Boolean>(true);
  const [confirmModalShow, setConfirmModalShow] = useState<Boolean>(false);
  const [confirmData, setConfirmData]: any = useState<Array<{ type; id; name? }>>([]);
  const [fileData, setFileData] = useState<Array<any>>([]);
  const [tableData, setTableData] = useState<Array<any>>([]);

  const [data, setData] = useState<Array<any>>([]);
  const [viewModalShow, setViewModalShow] = useState<Boolean>(false);
  const [dataView, setDataView] = useState<Array<UnitRespone>>([]);
  interface Action {
    icon: JSX.Element;
    text: string;
    onClick: (row: any) => void;
    alterIcon?: any;
    alterText?: any;
    style?: any;
  }

  const [params, setParams] = useState({});

  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------
  const actions: Array<Action> = [
    {
      icon: <EyeOutlined />,
      text: t('view_customer'),

      onClick: (row) => {
        setViewModalShow(true);
        setDataView(row);
      }
    },
    {
      icon: <EditOutlined />,
      text: t('edit_customer'),
      onClick: (row) => {
        history.push(PATH.CAR_ACCESSORIES_PRODUCT_SPECIFICATION_EDIT.replace(':id', row.id));
      }
    },
    {
      icon: <MinusCircleOutlined />,
      text: t('delete_specification'),
      onClick: (row) => {
        setConfirmModalShow(true);
        // setConfirmData([{ type: 'delete', id: row.id, fullName: row.name }]);
        setConfirmData([{ type: 'delete', id: row.id }]);
      }
    }
  ];

  // ------------------------------
  // FOR MECHANIC ACTIONS
  // ------------------------------

  // ------------------------------
  // FOR COLUMN AND FILTER
  // ------------------------------
  const [isClearFilter, setIsClearFilter] = useState(false);
  const handleResetFilters = () => {
    setIsClearFilter(true);
  };
  useEffect(() => {
    // props.getSpecification().then((res) => setSpecificationData(res?.content))
    if (isClearFilter) {
      setTimeout(() => {
        // this is resolve impact follow call API (multi call)
        // user can't filter again in 500ms-1000ms
        // this to fix user filter again bug
        setIsClearFilter(false);
      }, 500);
    }
  }, [isClearFilter]);

  // ------------------------------
  // FOR COLUMN AND FILTER
  // ------------------------------
  type Column = Array<{
    dataField?: string;
    text?: string;
    hidden?: boolean;
    style?: any;
    formatter?: (cell, row?, index?) => void | ReactElement | undefined | number | String;
    editable?: boolean;
    sort?: boolean;
    sortCaret?: (order: any, column: any) => JSX.Element | null;
    headerClasses?: string;
    headerFormatter?: (
      column: any,
      colIndex: any,
      {
        sortElement,
        filterElement
      }: {
        sortElement: any;
        filterElement: any;
      }
    ) => JSX.Element;
    filter?: any;
    filterRenderer?: any;
    csvFormatter?: (cell: any) => any;
    headerStyle?: any;
    csvText?: any;
    classes?: string;
  }>;

  let columns: any = [
    {
      dataField: 'index',
      text: t('contact_index'),
      sort: false,
      filter: '',
      filterRenderer: '',
      csvExport: false,
      fixed: true,
      headerStyle: CustomFixedColumns(80, 80, 35, 'center'),
      style: CustomFixedColumns(80, 80, 35, 'center'),
      formatter: (cell, row, index) => {
        return ++index;
      }
    },
    {
      dataField: 'orderCode',
      text: t('cross_check_code'),
      fixed: true,
      headerStyle: CustomFixedColumns(150, 150, 115, 'center'),
      style: CustomFixedColumns(150, 150, 115, 'center')
    },
    {
      dataField: 'shippingCode',
      text: t('shipCode'),
      style: {
        textAlign: 'center',
        minWidth: 200
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 200
      }
    },
    {
      dataField: 'total',
      text: t('cross_check_total'),
      style: {
        textAlign: 'center',
        minWidth: 200
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 200
      },
      formatter: (cell) => {
        return cell ? numberFormatDecimal(cell, ' đ', '') : '-';
      },
      csvFormatter: (cell) => {
        return cell ? numberFormatDecimal(cell, '', '') : '-';
      }
    },
    {
      dataField: 'discount',
      text: t('discount_value'),
      style: {
        textAlign: 'center',
        minWidth: 200
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 200
      },
      formatter: (cell) => cell || '0',
      csvFormatter: (cell) => cell || '0'
    },
    {
      dataField: 'shippingFee',
      text: t('fee'),
      style: {
        textAlign: 'center',
        minWidth: 200
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 200
      },
      formatter: (cell) => {
        return cell ? numberFormatDecimal(cell, ' đ', '') : '-';
      },
      csvFormatter: (cell) => {
        return cell ? numberFormatDecimal(cell, '', '') : '-';
      }
    },
    {
      dataField: 'result',
      text: t('cross_check_result'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 200
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 200
      },
      formatter: (cell: string) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderCrossCheck(cell, t(cell), 'tag')}</div>;
      },
      csvFormatter: (cell: string) => {
        return t(cell) || '-';
      },
      filter: customFilter(),
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(CROSS_CHECK_RESULT).map((o) => {
              return {
                value: o,
                search: t(CROSS_CHECK_RESULT[o]),
                label: renderCrossCheck(CROSS_CHECK_RESULT[o], t(CROSS_CHECK_RESULT[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'status',
      text: t('cross_check'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 200
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 200
      },
      formatter: (cell: string) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderCrossCheck(cell, t(cell), 'tag')}</div>;
      },
      csvFormatter: (cell: string) => {
        return t(cell) || '-';
      },
      filter: customFilter(),
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(CROSS_CHECK).map((o) => {
              return {
                value: o,
                search: t(CROSS_CHECK[o]),
                label: renderCrossCheck(CROSS_CHECK[o], t(CROSS_CHECK[o]), 'tag')
              };
            })}
          />
        );
      }
    },
    {
      dataField: 'paymentStatus',
      text: t('payment'),
      sort: false,
      style: {
        textAlign: 'center',
        minWidth: 200
      },
      headerStyle: {
        textAlign: 'center',
        minWidth: 200
      },
      formatter: (cell: string) => {
        return <div className="w-100 status_wrap-nononono">{cell && renderCrossCheck(cell, t(cell), 'tag')}</div>;
      },
      csvFormatter: (cell: string) => {
        return t(cell) || '-';
      },
      filter: customFilter(),
      filterRenderer: (onFilter, column) => {
        return (
          <SelectFilter
            isClearFilter={isClearFilter}
            onFilter={onFilter}
            placeholder={column?.text}
            options={Object.keys(CROSS_CHECK_PAYMENT).map((o) => {
              return {
                value: o,
                search: t(CROSS_CHECK_PAYMENT[o]),
                label: renderCrossCheck(CROSS_CHECK_PAYMENT[o], t(CROSS_CHECK_PAYMENT[o]), 'tag')
              };
            })}
          />
        );
      }
    }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------
  let myColumns = columns.map((column) => {
    return {
      editable: false,
      sort: true,
      isClearFilter: isClearFilter,
      sortCaret: sortCaret,
      headerFormatter: ColumnFormat,
      filter: customFilter(),
      filterRenderer: (onFilter, col) => {
        return <InputFilter isClearFilter={isClearFilter} onFilter={onFilter} placeholder={t('search') + column.text} />;
      },
      csvFormatter: (cell) => {
        return cell ? cell : '-';
      },
      footerAlign: 'center',
      formatter: (cell) => cell || '-',
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
        title={t('cross_check')}
        data={fileData}
        columns={myColumns}
        dataRangeKey="joinedDate" // for data range filter
        supportMultiDelete
        supportSelect
        fixedColumns
        isDataRangeHidden={true}
        // supportSearch
        selectField="id"
        needLoad={needLoadNewData}
        setNeedLoad={setNeedLoadNewData}
        fetchData={props.getCrossCheck}
        params={{ sort: 'desc', ...params }}
        isClearFilter={isClearFilter}
        buttons={[
          {
            type: 'export',
            icon: <i className="fas fa-file-excel" style={{ color: '#000' }}></i>,
            text: t('export_excel'),
            t
          },

          {
            type: 'upload',
            icon: <i className="fas fa-upload" style={{ color: '#000' }}></i>,
            text: t('import_from_file'),
            onClick: (selectedData) => {
              setConfirmModalShow(true);
            }
          },
          {
            type: 'download',
            icon: <i className="fas fa-download" style={{ color: '#000' }}></i>,
            text: t('download_file')
          }
        ]}></TableBootstrapHook>
      <GetExcelFileModal modalShow={confirmModalShow} setModalShow={setConfirmModalShow} setNeedLoadNewData={setNeedLoadNewData} />
    </div>
  );
};

export default connect(null, {
  createCrossCheck: crossCheckActions.createCrossCheck,
  getCrossCheck: crossCheckActions.getCrossCheck
})(CrossCheckTable);
