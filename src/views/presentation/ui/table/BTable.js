import { DownOutlined } from '@ant-design/icons';
import PropsType from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import DotLoader from 'react-spinners/DotLoader';
import styled from 'styled-components';
import XLSX from 'xlsx/dist/xlsx.mini.min.js';
import COLOR from '~/color';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import DataRangeUI from '~/views/container/commons/DataRangeUI';
import { DropdownCustomToggler } from '~/views/presentation/_metronic/_partials/dropdowns';
import { TableBootstrapUIFilter } from '~/views/presentation/table-bootstrap-hook/FilterUI';
import { CheckboxTable } from '~/views/presentation/ui/table/helpUI';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { NoRecordsFoundMessage, PleaseWaitMessage } from '~/views/utilities/helpers/TablePaginationHelpers';
import { Color } from '~/views/utilities/layout';

import AButton from '../buttons/AButton';
import { Pagination } from '../pagination/Pagination';
import LoadingOverlayStyled from './styled-components/LoadingOverlay';
import SettingColumnsDropdown from './SettingColumnsDropdown';

const DropdownStyled = styled(Dropdown)`
  margin-bottom: 8px;
`;

const EmptyDataStyle = styled.span`
  margin-top: 10px;
  color: #ababab;
  display: block;
  text-align: center;
  font-size: 16px;
`;

function BTable(props) {
  const { t } = useTranslation();
  const { data, columns, paginationOptions, onTableChange, isLoading, setLoading, allData } = props;
  const [rangeStr, setRangeStr] = useState('');
  const [rangeTitle, setRangeTitle] = useState(t('data_range'));
  const [tableColumns, setTableColumns] = useState(columns);

  useEffect(() => {
    if (data) {
      //refesh columns
      // const newTableColumns = tableColumns => fix bugs missing columns action on promotion table
      const newTableColumns = columns
        .map((m, index) => {
          return {
            ...columns[index],
            hidden: tableColumns.find((f) => f.dataField === m.dataField)?.hidden || m.hidden || false,
            csvFormatter: m.csvFormatter || csvFormatter
          };
        })
        .filter((f) => f.dataField);
      setTableColumns(newTableColumns);
    }
  }, [data]);

  const csvFormatter = (cell) => cell || '-';

  // --------------------------------------------------
  // HANDLE ON SINGLE SELECT EVENT
  // --------------------------------------------------
  const handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      props.setSelectedRows([...props.selectedRows, row[props.selectField]]);
    } else {
      props.setSelectedRows(props.selectedRows.filter((x) => x !== row[props.selectField]));
    }
  };
  // --------------------------------------------------
  // HANDLE ON SINGLE SELECT EVENT
  // --------------------------------------------------

  const renderNoData = () => {
    // return <Empty description={<EmptyDataStyle>{t('no_data')}</EmptyDataStyle>} />;
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '350px' }}>
        <div>
          <SVG src={toAbsoluteUrl('/media/svg/icons/Tools/BackgroundEmpty.svg')} />
          <EmptyDataStyle>{t('no_data').toUpperCase()}</EmptyDataStyle>
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // HANDLE SELECT ALL EVENT
  // --------------------------------------------------
  const handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map((r) => r[props.selectField]);
    if (isSelect) {
      props.setSelectedRows([...props.selectedRows, ...ids]);
    } else {
      props.setSelectedRows(props.selectedRows.filter((f) => !ids.includes(f)));
    }
  };
  // --------------------------------------------------
  // HANDLE SELECT ALL EVENT
  // --------------------------------------------------

  // style column toggle list
  const ToggleListStyled = () => {
    return (
      <DropdownStyled className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-end">
        <div className={props.isDataRangeHidden ? 'd-none' : 'd-block'}>
          <DataRangeUI
            isDateFilterReverse={props.isDateFilterReverse}
            rangeTitle={rangeTitle}
            setRangeTitle={setRangeTitle}
            rangeStr={rangeStr}
            setRangeStr={setRangeStr}
            dataRangeKey={props.dataRangeKey}
            currentQueries={props.currentQueries}
            setFiltersDataRange={props.setFiltersDataRange}
            getData={props.getData}
          />
        </div>
        <Dropdown.Toggle //
          as={DropdownCustomToggler}
          supportTop10={props.supportTop10} // to display seperator
        ></Dropdown.Toggle>

        {/*
      -----------------------------
      FOR TOP 10 TABLES
      -----------------------------
      */}
        {props.supportTop10 && (
          <AButton type="link" style={{ color: Color.Secondary2 }} className="d-flex align-items-center py-0" onClick={props.onClickTop10}>
            {/* <TeamOutlined />  */}
            <SVG src={toAbsoluteUrl('/media/svg/icons/Tools/Top10.svg')} />
            {props.top10Title}
          </AButton>
        )}
        {/*
      -----------------------------
      FOR TOP 10 TABLES
      -----------------------------
      */}

        <SettingColumnsDropdown setLoading={setLoading} setColumns={setTableColumns} columns={tableColumns} />
      </DropdownStyled>
    );
  };
  // style column toggle list

  const exportToExcel = async (header, excelData) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...excelData]);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${props.exportCSVName || 'export'}.xlsx`);

    props.setCallExport(false);
  };

  return (
    <LoadingOverlayStyled
      length={props.limit || props.size}
      styles={{
        overlay: (base) => {
          return {
            ...base,
            background: 'rgba(0, 0, 0, 0.15)',
            borderRadius: '8px'
          };
        },
        content: (base) => {
          return {
            ...base,
            display: 'flex'
          };
        }
      }}
      active={isLoading}
      fadeSpeed={500}
      spinner={<DotLoader speedMultiplier={2} color={COLOR['primary-color']} />}>
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={isLoading}
              paginationProps={paginationProps}
              notSupportPaginationToolbar={props.notSupportPaginationToolbar}>
              <ToolkitProvider bootstrap4 keyField={props.selectField || 'id'} data={data} columns={tableColumns} columnToggle>
                {(propsToolkit) => {
                  if (props.callExport) {
                    const header = tableColumns.filter((column) => column.csvExport !== false).map((column) => column.text);
                    const excelData = props.selectedData?.map((item) => {
                      return tableColumns
                        .filter((column) => column.csvExport !== false)
                        .map((column) => {
                          const { dataField, csvFormatter } = column;
                          if (csvFormatter && typeof csvFormatter === 'function') {
                            return csvFormatter(item[dataField], item);
                          }
                          return item[dataField];
                        });
                    });

                    exportToExcel(header, excelData);
                  }
                  return (
                    <div className="main-table" style={{ position: 'relative', maxWidth: `${props.maxWidth ? props.maxWidth : 'auto'}` }}>
                      <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
                        <div>{props.buttons && props.buttons}</div>
                        <div className="d-flex flex-wrap">
                          {props.supportSearch && (
                            <TableBootstrapUIFilter
                              placeholder={props.searchPlaceholder}
                              mock={props.mock}
                              searchKeyWord={props.searchKeyWord}
                              setCurrentQueries={props.setCurrentQueries}
                              currentQueries={props.currentQueries}
                              getData={props.getData}
                            />
                          )}
                          <>{Boolean(props.notSupportToggle) === false && <ToggleListStyled {...propsToolkit.columnToggleProps} />}</>
                        </div>
                      </div>
                      <BootstrapTable
                        {...propsToolkit.baseProps}
                        {...paginationTableProps}
                        data={data}
                        noDataIndication={renderNoData}
                        wrapperClasses="table-responsive"
                        bordered={false}
                        classes={`table table-head-custom table-vertical-center ${props.fixedColumns ? '' : 'overflow-hidden'}`}
                        remote
                        onTableChange={onTableChange}
                        cellEdit={
                          props.supportEdit
                            ? cellEditFactory({
                                mode: 'click',
                                autoSelectText: true,
                                blurToSave: true,
                                beforeSaveCell: props.beforeSaveCell
                              })
                            : undefined
                        }
                        selectRow={
                          props.supportSelect
                            ? {
                                mode: 'checkbox',
                                clickToSelect: false,
                                hideSelectAll: false,
                                nonSelectable: props.nonSelectable,
                                selected: props.selectedRows,
                                bgColor: props.selectedRows?.length < 1 ? '' : `rgba(32, 127, 167, 0.10)`,
                                headerColumnStyle: props.fixedColumns ? CustomFixedColumns(35, 35, 0, 'center') : undefined,
                                selectColumnStyle: props.fixedColumns ? CustomFixedColumns(35, 35, 0, 'center') : undefined,
                                onSelect: handleOnSelect,
                                onSelectAll: handleOnSelectAll,
                                selectionHeaderRenderer: (propsSelection) => <CheckboxTable {...propsSelection} />,
                                selectionRenderer: (propsSelection) => <CheckboxTable {...propsSelection} />
                              }
                            : undefined
                        }
                        filter={filterFactory()}
                        filterPosition="inline"
                        rowClasses={(_, rowIndex) => {
                          // let classes = 'ht_cell_event '; // fix bug nội dung trong mỗi o khi hover bị hiện boxshadow
                          let classes = '';
                          // animation
                          classes += ` ht_cell_event${rowIndex} `;
                          if (rowIndex % 2 !== 0) {
                            classes += 'ht_cell_odd';
                          }
                          return classes;
                        }}
                      />
                      <PleaseWaitMessage loading={false} />
                      <NoRecordsFoundMessage data={data} onClick={props.onClickCreateNew} />
                    </div>
                  );
                }}
              </ToolkitProvider>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </LoadingOverlayStyled>
  );
}

BTable.defaultProps = {
  isLoading: false
};

BTable.propTypes = {
  data: PropsType.array.isRequired,
  columns: PropsType.array.isRequired,
  onChangeTable: PropsType.func,
  paginationOptions: PropsType.object.isRequired
};

export default BTable;
