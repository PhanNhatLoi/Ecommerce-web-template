import { Dropdown, Menu, Skeleton } from 'antd/es';
import { head } from 'lodash-es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { Card, CardBody, CardHeaderToolbar } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';
import BTable from '~/views/presentation/ui/table/BTable';
import { UtilDate } from '~/views/utilities/helpers';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { ColumnFormat } from '~/views/utilities/helpers/ColumnFormat';
import { numberFormatWithPoint } from '~/views/utilities/helpers/currency';
import { getKeyForDateFilter } from '~/views/utilities/helpers/string';
import { sizePerPageList } from '~/views/utilities/helpers/TablePaginationHelpers';
import { generatePagination } from '~/views/utilities/helpers/utilURLParam';
import COLOR from '~/views/utilities/layout/color';

import GlobalFilter from './FilterUI/GlobalFilter';
import { renderButtons } from './helperUI';

const TableBootstrapHookStyled = styled.div`
  // FOR FIELDS CLEAR CUSTOM FOR TABLE
  th {
    .ant-input-clear-icon {
      font-size: 21px;
    }
    .ant-picker-clear,
    .ant-select-clear {
      .anticon-close-circle {
        font-size: 21px;
      }
    }
    .ant-select-selection-placeholder {
      text-transform: initial;
      font-weight: normal;
      font-family: unset;
      letter-spacing: unset;
    }
    .ant-picker-range {
      .ant-picker-clear {
        right: 24px;
      }
    }
  }

  .ant-picker-panels {
    display: -ms-flexbox !important;
    display: -webkit-flex !important;
    display: flex !important;
    -webkit-flex-wrap: wrap !important;
    -ms-flex-wrap: wrap !important;
    flex-wrap: wrap !important;
  }

  .ht-custom-header-table {
    .filter-label {
      display: block;
      margin-bottom: 4px;
    }
  }

  .ht-select-table-checkbox {
    :hover {
      cursor: pointer;
      background-color: #f0f5ff;
    }
  }
  // FOR FIELDS CLEAR CUSTOM FOR TABLE

  .main-table {
    max-height: ${(props) => (props.fetchAll ? props.tableMaxHeight || '300px !important' : '')};
    overflow: ${(props) => (props.fetchAll ? 'auto !important' : '')};
  }
  .pagination-wrapper {
    display: ${(props) => (props.fetchAll || props.notSupportPagination ? 'none !important' : '')};
  }
  .table {
    font-size: 12px;
  }
`;

const ButtonWrapStyled = styled.div`
  @media (max-width: 1024px) {
    max-width: 650px;
    overflow-x: scroll;
  }
`;
const ButtonStyled = styled(AButton)`
  .anticon {
    position: relative !important;
    bottom: 8px !important;
  }
`;
const DropdownStyled = styled(Dropdown)`
  .ant-dropdown {
    background-color: #000 !important;
    border-radius: 5px !important;
    padding: 16px 8px !important;
  }
  .ant-dropdown-arrow {
    background-color: #000 !important;
  }
`;

const MenuStyled = styled(Menu)`
  background-color: #000;
  padding: 16px 8px;
  border-radius: 5px;
  width: 250px;

  .ant-dropdown-menu-item button {
    color: #fff;
  }
  .ant-dropdown-menu-item button:hover {
    color: #000;
  }
`;

function TableBootstrap(props) {
  const { t } = useTranslation();
  const { width, height } = useWindowSize();
  const [firstLoad, setFirstLoad] = useState(false);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [currentQueries, setCurrentQueries] = useState({});
  const [loading, setLoading] = useState(true);
  const [paginationOptions, setPaginationOptions] = useState({
    totalSize: 0,
    sizePerPage: props.fetchAll ? 1000000000 : 10,
    page: 0,
    custom: true,
    sizePerPageList,
    paginationTotalRenderer: (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
        {t('showing')} {from} {t('to')} {to} {t('of')} {size} {t('results')}
      </span>
    )
  });
  const { paramsIdApi = undefined } = props;

  const actionColumn = {
    dataField: 'action',
    text: t('actions'),
    headerStyle: {
      minWidth: 130,
      textAlign: 'center'
    },
    sort: false,
    align: 'center',
    csvExport: false,
    headerFormatter: ColumnFormat,
    formatter: (cell, row, rowIndex) => {
      const menu =
        (props.actionColumn && props.actionColumn.actions && (
          <MenuStyled>
            {props.actionColumn.actions.map((action) => (
              <Menu.Item>
                <AButton
                  disabled={(props.actionColumn.disableAction && props.actionColumn.disableAction(row, action.text, action.key)) || false}
                  className="w-100 d-flex align-items-center"
                  type="link"
                  onClick={() => action.onClick(row)}>
                  {action.icon} &nbsp; {row.status === 'BLOCKED' ? (action.alterText ? action.alterText : action.text) : action.text}
                </AButton>
              </Menu.Item>
            ))}
          </MenuStyled>
        )) ||
        [];

      return (
        <DropdownStyled overlay={menu} placement="bottomCenter" trigger="click">
          <ButtonStyled
            type="link"
            size="large"
            style={{ fontSize: '24px' }}
            icon={<SVG src={toAbsoluteUrl('/media/svg/icons/Tools/More.svg')} />}
          />
        </DropdownStyled>
      );
    },
    classes: 'text-center pr-0',
    headerClasses: 'ht-custom-header-table pr-3',
    filter: customFilter(),
    editable: false,
    filterRenderer: (onFilter, column) => (
      <button
        onClick={() => props.actionColumn.handleResetFilters() || {}}
        className="btn btn-sm py-2 w-100"
        style={{
          borderRadius: '8px',
          background: COLOR.Primary,
          color: COLOR.White,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <span className="svg-icon svg-icon-md svg-icon-white">
          <SVG src={toAbsoluteUrl('/media/svg/icons/Tools/Trash.svg')} />
        </span>
        &nbsp;
        {t('clear_filter')}
      </button>
    )
  };

  // ------------------------------
  // FOR GLOBAL FILTER
  // ------------------------------
  const [statistic, setStatistic] = useState();
  const [globalFilters, setGlobalFilters] = useState([]);
  const [globalFilterLoading, setGlobalFilterLoading] = useState(false);

  const getStatistic = () => {
    setGlobalFilters([]);
    setGlobalFilterLoading(true);
    props.getStatistic &&
      props
        .getStatistic(props.statisticProps?.params)
        .then((res) => {
          setStatistic(props.statisticMock ? head(res?.content) : res?.content);
          setGlobalFilterLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: index.js ~ line 119 ~ useEffect ~ err', err);
          setGlobalFilterLoading(false);
        });
  };

  useEffect(() => {
    if (!props.notSupportStatistic) {
      // for scenario unable to use mock api fetch -> we use mockData in code instead
      if (props.statisticProps?.mockData) {
        setStatistic(props.statisticProps?.mockData);
      } else {
        // if mock api fetch is able to use
        getStatistic();
      }
    }
  }, []);

  useEffect(() => {
    if (!props.notSupportStatistic) {
      // for scenario unable to use mock api fetch -> we use mockData in code instead
      if (props.statisticProps?.mockData) {
        setGlobalFilters([]);
        setStatistic(props.statisticProps?.mockData);
      }
    }
  }, [props.statisticProps?.mockData]);

  const handleGlobalFilterChange = (stat) => {
    const newElement = {
      // the label will be the key in statistic api's response combine with statisticProps.name
      label: `${t(stat + props.statisticProps?.name)} (${numberFormatWithPoint(+statistic[stat])})`,
      key: props.statisticProps?.key,
      value: props.statisticProps?.valueSet[stat]
    };
    setGlobalFilters((globalFilters) => {
      if (globalFilters?.length === (props.statisticProps?.order?.length || Object.keys(statistic)?.length)) {
        return [newElement];
      } else {
        return [...globalFilters, newElement];
      }
    });
  };

  useEffect(() => {
    if (Boolean(statistic)) {
      // if the API does not response with the desired order
      if (props.statisticProps?.order) {
        for (let stat of props.statisticProps?.order) {
          handleGlobalFilterChange(stat);
        }
      } else {
        for (let stat in statistic) {
          handleGlobalFilterChange(stat);
        }
      }
    }
  }, [statistic]);
  useEffect(() => {
    if (!props.isFetchData) setPaginationOptions({ ...paginationOptions, totalSize: props.data?.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data?.length]);
  // ------------------------------
  // FOR GLOBAL FILTER
  // ------------------------------

  // ---------------------
  // FOR FETCH DATA
  // ---------------------
  useEffect(() => {
    if (props.customExpand) {
      // trường hợp api cần chèn id sau url. truyền params trước, id sau. nếu props k có paramsIdApi thì tương ứng undefine => không xảy ra gì cả
      props.fetchData({ size: 999999 }, paramsIdApi).then((res) => {
        setAllData(res?.content || []);
      });
    }
    setSelectedRows([]);
  }, [props.needLoad]);

  // eslint-disable-line react-hooks/exhaustive-deps
  const getData = (queries, type) => {
    if (props.clearAll) return; //for clear all not call API
    setLoading(true);

    const params = {
      ...generatePagination(), // pagination default
      ...props.params,
      ...queries, // all sort, filter, keyword, pagination,...
      size: props.fetchAll ? 1000000000 : queries?.size || 10
    };

    // FOR MOCK API
    if (props.mock) {
      if (!params['search']) params.page = params.page + 1;
      params.limit = props.fetchAll ? 1000000000 : params.size ? params.size : 10;
      params.size = undefined;
    } else {
      params.limit = undefined;
    }
    // FOR MOCK API

    // for search and more component not owner at bootstrap table
    setCurrentQueries(params);
    // for search and more component not owner at bootstrap table
    props
      .fetchData(params, paramsIdApi)
      .then((res) => {
        // data
        setData(
          props.keyData && res?.data[props.keyData]?.filter(Boolean)
            ? res?.data[props.keyData]?.filter(Boolean)
            : res?.data?.content?.filter(Boolean)
            ? res?.data?.content?.filter(Boolean)
            : res.data?.filter(Boolean)
            ? res.data?.filter(Boolean)
            : res.content?.filter(Boolean)
            ? res.content?.filter(Boolean)
            : []
        );
        // pagination
        const newPagination = {
          ...paginationOptions,
          page: +params?.page + 1 || 1,
          sizePerPage: res?.data?.size ? +res?.data?.size : props.keyData ? +res?.data[props.keyData]?.length : params.size,
          totalSize: res?.data?.totalElements
            ? +res?.data?.totalElements
            : res.headers['x-total-count']
            ? +res.headers['x-total-count']
            : props.keyData
            ? +res?.data[props.keyData]?.length
            : res?.data?.length
        };
        //      FOR MOCK API
        if (props.mock) {
          newPagination.page = +params.page;
          newPagination.sizePerPage = +params.limit;
          newPagination.totalSize = 100;
        }
        //      FOR MOCK API
        // pagination
        setPaginationOptions(newPagination);

        // pagination

        // loading
        setLoading(false);

        // for first load
        setFirstLoad(true);
      })
      .catch((err) => {
        AMessage.error(t(err.message));
        setLoading(false);
        setData([]);

        // for first load
        setFirstLoad(true);
      });
  };

  // For only call once API when clear all filter
  // Cause when clear a filter => onChangeTable handle called => call API
  // Clear all filter(s) => call multi API
  useEffect(() => {
    props.isClearFilter &&
      getData({
        keyword: currentQueries.keyword
      });
  }, [props.isClearFilter]); // eslint-disable-line react-hooks/exhaustive-deps
  // ---------------------
  // FOR FETCH DATA
  // ---------------------
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // --------------------------------------
  // FOR ACTIONS
  // --------------------------------------

  const [filterParams, setFilterParams] = useState([]);
  const [filtersDataRange, setFiltersDataRange] = useState({});
  useEffect(() => {
    if (props.columns.length) {
      setFilterParams(() => {
        return props.columns.map((m) => {
          return m.dataField;
        });
      });
    }
  }, [props.columns]);

  const onTableChange = (type, newState) => {
    if (!firstLoad) return; // don't logic first load

    let filters = newState?.filters || {};
    const keys = Object.keys(filters);
    const filtersData = {};
    keys.forEach((key) => {
      let value = filters[key]?.filterVal || undefined;
      // FOR CUSTOM FILTER WITH ANTD FIELDS
      if (value?.antdCustom) {
        const arrFromTo = value?.value?.split('~');
        // FOR 2 CASES:
        // 1. Booking'From'Date
        // 2. BookingDate'From'
        filtersData[props.isDateFilterReverse ? key + 'From' : getKeyForDateFilter(key, 'From')] = arrFromTo[0];
        filtersData[props.isDateFilterReverse ? key + 'To' : getKeyForDateFilter(key, 'To')] = arrFromTo[1];
      } else if (filters[key]?.filterType === FILTER_TYPES.DATE) {
        // FOR CUSTOM FILTER OF REACT-TABLE-2
        filtersData[key] = value.comparator !== null ? UtilDate.toDateTimeUtc(moment(value?.date).startOf('day')) : undefined;
      } else if (filters[key]?.filterType === FILTER_TYPES.SELECT && value.includes('-')) {
        // FOR CUSTOM FILTER OF REACT-TABLE-2
        const arrFromTo = value?.split('-');
        filtersData[props.isNumberRangeReverse ? key + 'From' : 'from' + capitalizeFirstLetter(key)] = arrFromTo[0];
        filtersData[props.isNumberRangeReverse ? key + 'To' : 'to' + capitalizeFirstLetter(key)] = arrFromTo[1];
      } else if (filters[key]?.filterType === FILTER_TYPES.SELECT && value.includes('>')) {
        // FOR CUSTOM FILTER OF REACT-TABLE-2
        const arrFromTo = value?.split('>');
        // const arrFromTo = [value?.replaceAll('>', ''), Number.MAX_SAFE_INTEGER];
        filtersData[props.isNumberRangeReverse ? key + 'From' : 'from' + capitalizeFirstLetter(key)] = arrFromTo[0];
        // filtersData[props.isNumberRangeReverse ?  key + 'To':'to' + capitalizeFirstLetter(key) ] = arrFromTo[1];
      } else if (filters[key]?.filterType === FILTER_TYPES.SELECT && value.includes('*')) {
        // FOR CUSTOM FILTER FORM AMOUNT TO AMOUNT IN TRANSACTION PAGE
        const arrFromTo = value?.split('*');
        filtersData[props.isNumberRangeReverse ? key + 'From' : 'from' + capitalizeFirstLetter(key)] = arrFromTo[0];
        filtersData[props.isNumberRangeReverse ? key + 'To' : 'to' + capitalizeFirstLetter(key)] = arrFromTo[1];
      } else {
        filtersData[key] = value;
      }
    });

    //add custom sort props for api transaction page in case the sort props in queries is different with normal props name
    const { customSortField = {} } = props || {};
    let sorter = { sort: undefined };
    if (customSortField[newState?.sortField]) {
      sorter = { sort: `${customSortField[newState?.sortField]},${newState?.sortOrder}` };
    } else {
      sorter = { sort: newState?.sortField ? `${newState?.sortField},${newState?.sortOrder}` : props.params?.sort || undefined };
    }

    const pagination = {
      page: newState?.page ? newState?.page - 1 : 0,
      size: props.fetchAll ? 1000000000 : newState?.sizePerPage
    };
    if (props.mock) {
      sorter.sortBy = newState?.sortField;
      sorter.order = newState?.sortOrder;
      pagination.limit = newState?.sizePerPage;
      sorter.sort = undefined;
    }

    let newCurrentQueries = {}; // new state for current queries (eliminate filter params)
    const keysCurrentQueries = Object.keys(currentQueries);
    keysCurrentQueries.forEach((key) => {
      const tempKey = key.replace('To', '').replace('From', '');
      if (!filterParams.some((s) => s.toLowerCase() === tempKey.toLowerCase())) newCurrentQueries[key] = currentQueries[key];
    });
    if (type !== 'filter') newCurrentQueries[props.statisticProps?.key] = currentQueries[props.statisticProps?.key];

    !props.isClearFilter &&
      getData({
        ...filtersData,
        ...newCurrentQueries,
        ...sorter,
        ...pagination,
        ...filtersDataRange
      });
  };
  // --------------------------------------
  // FOR ACTIONS
  // --------------------------------------

  // --------------------------------------
  // FOR EXPORT CSV
  // --------------------------------------
  const [callExport, setCallExport] = useState(false);
  // --------------------------------------
  // FOR EXPORT CSV
  // --------------------------------------

  // --------------------------------------
  // FILTER SELECTED DATA
  // --------------------------------------
  useEffect(() => {
    setSelectedData(
      (props.mockData || props.customExpand ? allData : data).filter(function (item) {
        return selectedRows.includes(item[props?.selectField || 'id']);
      })
    );
  }, [selectedRows, allData]); // eslint-disable-line react-hooks/exhaustive-deps

  // --------------------------------------
  // FILTER SELECTED DATA
  // --------------------------------------

  // --------------------------------------
  // CUSTOM RELOAD DATA
  // --------------------------------------
  useEffect(() => {
    if (props.needLoad) {
      getData({ ...currentQueries, ...props.params });
      if (!props.statisticProps?.mockData) {
        setGlobalFilters([]);
        getStatistic();
      }
      props.setNeedLoad && props.setNeedLoad(false);
      setSelectedRows([]);
    }
  }, [props.needLoad, props.params]); // eslint-disable-line react-hooks/exhaustive-deps
  // --------------------------------------
  // CUSTOM RELOAD DATA
  // --------------------------------------

  // --------------------------------------
  // CUSTOM Button
  // --------------------------------------
  const ButtonUiAction = () => {
    return (
      <ButtonWrapStyled className="d-flex align-items-center pt-3 mb-5">
        {renderButtons(
          props.buttons.map((o) => {
            if (o?.type === 'export') {
              return {
                ...o,
                exportCount: selectedRows.length,
                selectedData: selectedData,
                onClick: () => setCallExport(true),
                tooltip: t('issueExportCsv')
              };
            } else if (o?.type === 'hasData') {
              return { ...o, selectedData: selectedData };
            } else return o;
          }),
          props.fullAccessPage
        )}
      </ButtonWrapStyled>
    );
  };
  // --------------------------------------
  // CUSTOM Button
  // --------------------------------------

  return (
    <TableBootstrapHookStyled
      notSupportPagination={props.notSupportPagination}
      fetchAll={props.fetchAll}
      tableMaxHeight={props.tableMaxHeight}
      className={props.className}>
      {/* header */}
      {props.title && (
        <div
          className="d-flex flex-column mr-3 mt-5 pb-10 mb-5"
          style={{ borderBottomColor: COLOR.gray6, borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
          <h2>{props.title}</h2>
          <div className="text-muted" style={{ fontSize: '14px', width: '100%' }}>
            {props.description}
          </div>
        </div>
      )}
      {/* header */}

      {/* statistic */}
      <div
        className="d-flex flex-wrap align-items-center justify-content-between"
        style={{ marginBottom: Boolean(props.buttons) && props.buttons.length > 0 ? '24px' : '16px' }}>
        <div className="d-flex flex-wrap-wrap" style={{ overflowX: 'auto' }}>
          {!props.notSupportStatistic &&
            Boolean(props.statisticProps) &&
            (globalFilterLoading ? (
              <Skeleton.Input size="small" style={{ width: '400px' }} active className="mr-2"></Skeleton.Input>
            ) : (
              <GlobalFilter //
                fields={globalFilters}
                currentQueries={currentQueries}
                getData={getData}
              />
            ))}
          {props.supportReload && (
            <AButton //
              style={{ border: 'none', backgroundColor: 'transparent' }}
              icon={
                <span className="svg-icon svg-icon-xl">
                  <SVG src={toAbsoluteUrl('/media/svg/icons/Tools/Refresh.svg')} />
                </span>
              }
              onClick={() => props.setNeedLoad(true)}
            />
          )}
        </div>
      </div>
      {/* statistic */}
      {/* header */}
      <Card>
        {props.customHeader && <CardHeaderToolbar>{props.customHeader}</CardHeaderToolbar>}
        <CardBody className={props.noPadding ? 'p-0' : 'pt-4'}>
          {selectedRows.length > 0 && (
            <div className="d-flex align-items-center">
              {props.supportAssign && (
                <AButton
                  title="Assign"
                  className="btn btn-sm btn-primary d-flex align-items-center"
                  onClick={() => {
                    props.supportAssign(selectedData);
                  }}>
                  <span className="svg-icon svg-icon-md svg-icon">
                    <SVG src={toAbsoluteUrl('/media/svg/icons/Communication/Write.svg')} />
                  </span>
                  <span>{t('assign')}</span>
                </AButton>
              )}
              {props.supportChangeStatus && (
                <button
                  title={t('Change Status')}
                  className="btn btn-sm btn-primary d-flex align-items-center"
                  onClick={() => {
                    props.supportChangeStatus(selectedData);
                  }}>
                  <span className="svg-icon svg-icon-md svg-icon">
                    <SVG src={toAbsoluteUrl('/media/svg/icons/Navigation/Exchange.svg')} />
                  </span>
                  <span>{t('Change Status')}</span>
                </button>
              )}
            </div>
          )}

          <BTable
            buttons={props.buttons && ButtonUiAction()}
            beforeSaveCell={props.beforeSaveCell}
            callExport={callExport}
            columns={(props.columns && ((props.actionColumn && [...props.columns, actionColumn]) || props.columns)) || []}
            data={props.mockData || data}
            isDateFilterReverse={props.isDateFilterReverse}
            isLoading={props.loading || loading}
            setLoading={setLoading}
            notSupportPagination={props.notSupportPagination}
            notSupportToggle={props.notSupportToggle}
            onClickCreateNew={props.onClickCreateNew}
            onClickTop10={props.onClickTop10}
            onTableChange={onTableChange}
            paginationOptions={paginationOptions}
            selectField={props.selectField || 'id'}
            selectedRows={selectedRows}
            selectedData={selectedData}
            allData={allData}
            setCallExport={setCallExport}
            setSelectedRows={setSelectedRows}
            supportEdit={props.supportEdit}
            supportSelect={props.supportSelect}
            nonSelectable={props.nonSelectable}
            supportTop10={props.supportTop10}
            top10Title={props.top10Title}
            fixedColumns={props.fixedColumns}
            supportSearch={props.supportSearch}
            searchPlaceholder={props.searchPlaceholder}
            mock={props.mock}
            searchKeyWord={props.searchKeyWord}
            setCurrentQueries={setCurrentQueries}
            // for data range
            currentQueries={currentQueries}
            setFiltersDataRange={setFiltersDataRange}
            dataRangeKey={props.dataRangeKey}
            isDataRangeHidden={props.isDataRangeHidden}
            getData={getData}
            maxWidth={props.maxWidth}
            // for animation
            limit={currentQueries?.limit}
            size={props.fetchAll ? 1000000000 : currentQueries?.size}
          />
        </CardBody>
      </Card>
    </TableBootstrapHookStyled>
  );
}
export default TableBootstrap;
