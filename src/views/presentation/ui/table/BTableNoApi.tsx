import PropsType from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import DotLoader from 'react-spinners/DotLoader';
import styled from 'styled-components';
import COLOR from '~/color';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { CheckboxTable } from '~/views/presentation/ui/table/helpUI';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { toAbsoluteUrl } from '~/views/utilities/helpers/metronic';
import { NoRecordsFoundMessage, PleaseWaitMessage } from '~/views/utilities/helpers/metronic/TablePaginationHelpers';

import { Pagination } from '../pagination/Pagination';
import LoadingOverlayStyled from './styled-components/LoadingOverlay';

type BTableNoApiProps = {
  data: Array<any>;
  columns: Array<any>;
  paginationOptions: object;
  onTableChange: any;
  isLoading: boolean;
  onClickCreateNew?: any;
  notSupportPaginationToolbar?: boolean;
  notSupportPagination?: boolean;
  notSupportToggle?: boolean;
  supportSelect?: boolean;
  fixedColumns?: boolean;
  selectedRows?: any;
  setSelectedRows?: any;
  callExport?: boolean;
  setCallExport?: any;
  exportCSVName?: any;
  limit?: any;
  size?: any;
};

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

function BTableNoApi(props: BTableNoApiProps) {
  const { t }: any = useTranslation();
  const { data, columns, paginationOptions, onTableChange, isLoading } = props;

  // handle on select event
  const handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      props.setSelectedRows([...props.selectedRows, row.id]);
    } else {
      props.setSelectedRows(props.selectedRows.filter((x) => x !== row.id));
    }
  };
  // handle on select event

  // handle on select all event
  const handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map((r) => r.id);
    if (isSelect) {
      props.setSelectedRows(ids);
    } else {
      props.setSelectedRows([]);
    }
  };
  // handle on select all event

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

  // style column toggle list
  const ToggleListStyled = ({ columns, onColumnToggle, toggles }) => (
    <DropdownStyled className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-end">
      <Dropdown.Menu className="dropdown-menu dropdown-menu-right" style={{ minWidth: '200px' }}>
        <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} className="ml-3 my-0 pb-3" strong>
          {t('column_display')}
        </ATypography>
        <li className="navi navi-hover scroll-75vh" data-toggle="buttons">
          {columns
            .map((column) => ({
              ...column,
              toggle: toggles[column.dataField]
            }))
            .map((column, i) => (
              <li key={`NavStyled${i}`} style={{ position: 'relative' }} className={`navi-item ${column.toggle ? 'active1' : ''}`}>
                <button
                  style={{ textAlign: 'start' }}
                  type="button"
                  key={column.dataField}
                  className="btn w-100"
                  data-toggle="button"
                  aria-pressed={column.toggle ? 'true' : 'false'}
                  onClick={() => onColumnToggle(column.dataField)}>
                  {column.toggle && (
                    <span className="svg-icon svg-icon-md svg-icon-primary">
                      <SVG src={toAbsoluteUrl('/media/svg/icons/Navigation/Check.svg')} width={12} height={12} />
                    </span>
                  )}
                  {!column.toggle && (
                    <span className="svg-icon svg-icon-md svg-icon-warning">
                      <SVG src={toAbsoluteUrl('/media/svg/icons/Navigation/Minus.svg')} width={12} height={12} />
                    </span>
                  )}{' '}
                  {column.text}
                </button>
              </li>
            ))}
        </li>
      </Dropdown.Menu>
    </DropdownStyled>
  );
  // style column toggle list

  return (
    <LoadingOverlayStyled
      length={props.limit || props.size}
      styles={{
        overlay: (base) => {
          return {
            ...base,
            background: 'rgba(0, 0, 0, 0.15)'
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
            <Pagination //
              isLoading={isLoading}
              paginationProps={paginationProps}
              notSupportPaginationToolbar={props.notSupportPaginationToolbar}>
              <ToolkitProvider
                exportCSV={{
                  noAutoBOM: false,
                  fileName: `${props.exportCSVName || 'export'}.csv`,
                  blobType: 'charset=UTF-8',
                  onlyExportSelection: Boolean((props.selectedRows || []).length), // enable when select !==0
                  onlyExportFiltered: true,
                  exportAll: false
                }}
                bootstrap4
                keyField="id"
                data={data || []}
                columns={columns}
                columnToggle>
                {(propsToolkit) => {
                  props.callExport && propsToolkit?.csvProps?.onExport();
                  props.callExport && props.setCallExport(false);
                  return (
                    <div className="main-table" style={{ position: 'relative' }}>
                      {Boolean(props.notSupportToggle) === false && <ToggleListStyled {...propsToolkit.columnToggleProps} />}

                      <BootstrapTable
                        {...propsToolkit.baseProps}
                        {...paginationTableProps}
                        wrapperClasses="table-responsive"
                        bordered={false}
                        classes={`table table-head-custom table-vertical-center ${props.fixedColumns ? '' : 'overflow-hidden'}`}
                        remote
                        noDataIndication={renderNoData}
                        onTableChange={onTableChange}
                        selectRow={
                          props.supportSelect
                            ? {
                                mode: 'checkbox',
                                clickToSelect: false,
                                hideSelectAll: false,
                                bgColor: `${COLOR['primary-color']}33`,
                                selectColumnStyle: {
                                  cursor: 'pointer'
                                },
                                onSelect: handleOnSelect,
                                onSelectAll: handleOnSelectAll,
                                selectionHeaderRenderer: (propsSelection) => <CheckboxTable {...propsSelection} />,
                                selectionRenderer: (propsSelection) => <CheckboxTable {...propsSelection} />
                              }
                            : undefined
                        }
                        filter={filterFactory()}
                        filterPosition="inline"
                        rowClasses={(row, rowIndex) => {
                          // let classes = 'ht_cell_event '; // fix bug nội dung trong mỗi o khi hover bị hiện boxshadow
                          let classes = '';
                          // animation
                          classes += ` ht_cell_event${rowIndex} `;
                          if (rowIndex % 2 !== 0) {
                            classes += 'ht_cell_odd';
                          }
                          return classes;
                        }}></BootstrapTable>
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
BTableNoApi.defaultProps = {
  isLoading: false
};

BTableNoApi.propTypes = {
  data: PropsType.array.isRequired,
  columns: PropsType.array.isRequired,
  onChangeTable: PropsType.func,
  paginationOptions: PropsType.object.isRequired
};

export default BTableNoApi;
