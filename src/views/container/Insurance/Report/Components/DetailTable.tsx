import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ORDER_TYPE, TIME_UNITS } from '~/configs';
import { TABS_REPORT } from '~/configs/const';
import { reportActions } from '~/state/ducks/carAccessories/report';
import { RequireParams } from '~/state/ducks/carAccessories/report/actions';
import { CustomFixedColumns } from '~/views/container/commons/customFixedColumns';
import TableBootstrapHookNoApi from '~/views/presentation/table-bootstrap-hook-no-api';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

type DetailTableProps = {
  tab: string;
  params: RequireParams | undefined;
  dateType: string;
  getRevenueList: any;
  getOrderList: any;
  getProductList: any;
  getCustomerList: any;
};

const DetailTable: React.FC<DetailTableProps> = (props) => {
  const { t }: any = useTranslation();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [tableData, setTableData] = useState<any>([]);

  useEffect(() => setNeedLoadNewData(true), [props.tab, props.params]);

  useEffect(() => {
    setNeedLoadNewData(true);
    handleGetApi(props.tab, { ...props?.params, type: ORDER_TYPE.INSURANCE })
      .then((res: any) => {
        // get data with necessary columns
        const response = res?.content?.map((data) => getTableColumns(props.tab, data));
        setTableData(getTableDataByTime(response || [], props.params, props.dateType || TIME_UNITS.DATE.toLowerCase()));
        setNeedLoadNewData(false);
      })
      .catch((err: any) => {
        console.error('🚀chiendev ~ file: DetailTable.tsx:52 ~ useEffect ~ err', err);
        setTableData([]);
        setNeedLoadNewData(false);
      });
  }, [props.tab, props.params]);

  const handleGetApi = (tab: string, params: any) => {
    const finalParams = {
      // fetch all
      size: 1000000000,
      ...params
    };
    switch (tab) {
      case TABS_REPORT.REVENUE:
        return props.getRevenueList(finalParams);
      case TABS_REPORT.ORDER:
        return props.getOrderList(finalParams);
      case TABS_REPORT.CUSTOMER:
        return props.getCustomerList(finalParams);
      case TABS_REPORT.PACKAGE:
        return props.getProductList(finalParams);
      default:
        return;
    }
  };

  // format dataField date to createdDate
  const getTableColumns = (tab, data) => {
    switch (tab) {
      case TABS_REPORT.REVENUE:
        return {
          createdDate: data.lastModifiedDate,
          subTotal: data.subTotal,
          tax: data.tax,
          shippingFee: data.shippingFee,
          refundQuantity: data.refundQuantity,
          refundTotal: data.refundTotal,
          promotionDiscount: data.promotionDiscount,
          revenue: data.revenue
        };
      case TABS_REPORT.ORDER:
        return {
          createdDate: data.createdDate,
          code: data.code,
          buyerName: data.buyerName,
          subTotal: data.subTotal,
          tax: data.tax,
          paymentGateway: data.paymentGateway,
          promotionDiscount: data.promotionDiscount,
          revenue: data.revenue
        };
      case TABS_REPORT.PACKAGE:
        return {
          createdDate: data.createdDate,
          productId: data.productId,
          productName: data.productName,
          productQuantity: data.productQuantity,
          orderQuantity: data.orderQuantity,
          total: data.total,
          tax: data.tax,
          refundQuantity: data.refundQuantity,
          refundAmount: data.refundAmount,
          promotionDiscount: data.promotionDiscount,
          revenue: data.revenue,
          shippingFee: data.shippingFee
        };
      case TABS_REPORT.CUSTOMER:
        return {
          buyerId: data.buyerId,
          buyerName: data.buyerName,
          productQuantity: data.productQuantity,
          createdDate: data.createdDate,
          subTotal: data.subTotal,
          tax: data.tax,
          shippingFee: data.shippingFee,
          refundQuantity: data.refundQuantity,
          refundTotal: data.refundTotal,
          promotionDiscount: data.promotionDiscount,
          revenue: data.revenue
        };
      default:
        return;
    }
  };

  const getDiff = (fromDate: Moment, toDate: Moment, timeType: string) => {
    if (timeType === TIME_UNITS.DATE.toLowerCase()) return toDate.diff(fromDate, 'days');
    else {
      const newTimeType: any = `${timeType}s`;
      return toDate.diff(fromDate, newTimeType);
    }
  };

  const getTimeSubtract = (toDate: Moment, i: number, timeType: any) => {
    const newTimeType: any = timeType === TIME_UNITS.DATE.toLowerCase() ? 'days' : `${timeType}s`;
    return toDate.subtract(i, newTimeType).startOf(timeType.toLowerCase());
  };

  const getExistingItem = (tab, data, item) => {
    switch (tab) {
      case TABS_REPORT.CUSTOMER:
        return data.buyerId === item.buyerId && data.buyerName === item.buyerName;
      case TABS_REPORT.PACKAGE:
        return data.productId === item.productId && data.productName === item.productName;
      default:
        return data;
    }
  };

  const getTableDataByTime = (tableData: any, params: any, timeType: any) => {
    let dateList: any = [];

    // khoảng thời gian từ fromDate đến toDate
    const diff: any = getDiff(moment(params?.fromDate), moment(params?.toDate), timeType);

    // lấy danh sách thời gian theo ngày/tháng/quý/năm từ fromDate đến toDate
    for (let i = diff; i >= 0; i--) {
      dateList.push({ time: getTimeSubtract(moment(params?.toDate), i, timeType) });
    }

    const result: any = [];

    dateList.forEach((obj) => {
      const date = obj.time;
      const endOfTime = moment(date).endOf(timeType.toLowerCase()); // ngày cuối cùng của date

      // lấy dữ liệu trong khoảng date -> endOfTime
      const dataFiltered = tableData.filter((data) => moment(data.createdDate).isBetween(moment(date), moment(endOfTime), undefined, '[]'));

      // bỏ comment nếu muốn lấy ngày không có data
      // if (dataFiltered.length <= 0) {
      //   result.push({ createdDate: moment(date).add(7, 'hours').toJSON() });
      //   return;
      // }

      const total = dataFiltered.reduce((acc, item) => {
        const existingItem = acc.find((data) => getExistingItem(props.tab, data, item));

        if (existingItem) {
          if (props.tab === TABS_REPORT.REVENUE) {
            existingItem.subTotal += item.subTotal;
            existingItem.tax += item.tax;
            existingItem.shippingFee += item.shippingFee;
            existingItem.refundQuantity += item.refundQuantity;
            existingItem.refundTotal += item.refundTotal;
            existingItem.promotionDiscount += item.promotionDiscount;
            existingItem.revenue += item.revenue;
          } else if (props.tab === TABS_REPORT.PACKAGE) {
            existingItem.productQuantity += item.productQuantity;
            existingItem.orderQuantity += item.orderQuantity;
            existingItem.total += item.total;
            existingItem.tax += item.tax;
            existingItem.refundQuantity += item.refundQuantity;
            existingItem.refundAmount += item.refundAmount;
            existingItem.promotionDiscount += item.promotionDiscount;
            existingItem.revenue += item.revenue;
            existingItem.shippingFee += item.shippingFee;
          } else if (props.tab === TABS_REPORT.CUSTOMER) {
            existingItem.productQuantity += item.productQuantity;
            existingItem.subTotal += item.subTotal;
            existingItem.tax += item.tax;
            existingItem.shippingFee += item.shippingFee;
            existingItem.refundQuantity += item.refundQuantity;
            existingItem.refundTotal += item.refundTotal;
            existingItem.promotionDiscount += item.promotionDiscount;
            existingItem.revenue += item.revenue;
          }
        } else {
          acc.push(Object.assign({}, item));
        }

        return acc;
      }, []);

      result.push(...total);
    });

    return result.reverse();
  };

  const formatDate = (date: any, timeType: string) => {
    switch (timeType) {
      case TIME_UNITS.DATE.toLowerCase():
        return moment(date).format('DD/MM/YYYY');
      case TIME_UNITS.MONTH.toLowerCase():
        return moment(date).format('M/YYYY');
      case TIME_UNITS.QUARTER.toLowerCase():
        return `Q${moment(date).format('Q/YYYY')}`;
      case TIME_UNITS.YEAR.toLowerCase():
        return moment(date).format('YYYY');
      default:
        return;
    }
  };

  let columns = [
    {
      dataField: 'createdDate',
      text: t('date'),
      headerStyle: CustomFixedColumns(150, 150, 0, 'center'),
      style: CustomFixedColumns(150, 150, 0, 'center'),
      formatter: (cell: string) => {
        return <span>{formatDate(cell, props.dateType || TIME_UNITS.DATE.toLowerCase())}</span>;
      }
    },
    {
      dataField: props.tab === TABS_REPORT.ORDER ? 'code' : 'productId',
      text: props.tab === TABS_REPORT.ORDER ? t('order_id') : t('package_id'),
      headerStyle: CustomFixedColumns(150, 150, 150, 'center'),
      style: CustomFixedColumns(150, 150, 150, 'center'),
      hidden: ![TABS_REPORT.ORDER, TABS_REPORT.PACKAGE].includes(props.tab),
      formatter: (cell: string) => {
        return cell ? cell : '-';
      }
    },
    {
      dataField: 'buyerName',
      text: t('customer_name'),
      headerStyle: [TABS_REPORT.CUSTOMER].includes(props.tab) ? CustomFixedColumns(250, 250, 150, 'left') : { minWidth: 250 },
      style: [TABS_REPORT.CUSTOMER].includes(props.tab) ? CustomFixedColumns(250, 250, 150, 'left') : { minWidth: 250 },
      hidden: ![TABS_REPORT.ORDER, TABS_REPORT.CUSTOMER].includes(props.tab),
      formatter: (cell: string) => {
        return cell || '-';
      }
    },
    {
      dataField: 'productName',
      text: t('package_name'),
      headerStyle: CustomFixedColumns(250, 250, 150, 'left'),
      style: CustomFixedColumns(250, 250, 150, 'left'),
      hidden: props.tab !== TABS_REPORT.PACKAGE,
      formatter: (cell: string) => {
        return cell || '-';
      }
    },
    {
      dataField: 'productQuantity',
      text: t('submission_quantity'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.PACKAGE].includes(props.tab)
    },
    {
      dataField: 'orderQuantity',
      text: t('orders_quantity'),
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.PACKAGE].includes(props.tab)
    },
    {
      dataField: props.tab === TABS_REPORT.PACKAGE ? 'total' : 'subTotal',
      text: t('sale'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.REVENUE, TABS_REPORT.ORDER, TABS_REPORT.PACKAGE, TABS_REPORT.CUSTOMER].includes(props.tab),
      formatter: (cell: number) => {
        return numberFormatDecimal(cell || 0, ' đ', '');
      }
    },
    {
      dataField: 'tax',
      text: t('tax_money'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.REVENUE, TABS_REPORT.ORDER, TABS_REPORT.PACKAGE, TABS_REPORT.CUSTOMER].includes(props.tab),
      formatter: (cell: number) => {
        return numberFormatDecimal(cell || 0, ' đ', '');
      }
    },
    {
      dataField: 'paymentGateway',
      text: t('payment_method'),
      style: {
        minWidth: 220,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.ORDER].includes(props.tab),
      formatter: (cell: string) => {
        return t(cell) || '-';
      }
    },
    {
      dataField: 'promotionDiscount',
      text: t('Promotion'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.REVENUE, TABS_REPORT.ORDER, TABS_REPORT.PACKAGE, TABS_REPORT.CUSTOMER].includes(props.tab),
      formatter: (cell: number) => {
        return numberFormatDecimal(cell || 0, ' đ', '');
      }
    },
    {
      dataField: 'revenue',
      text: t('revenue'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.REVENUE, TABS_REPORT.ORDER, TABS_REPORT.PACKAGE, TABS_REPORT.CUSTOMER].includes(props.tab),
      formatter: (cell: number) => {
        return numberFormatDecimal(cell || 0, ' đ', '');
      }
    }
  ];

  //-------------------------
  // COMMON property column
  //-------------------------
  let columnsArr = columns.map((column) => {
    return {
      editable: false,
      sort: false,
      filter: customFilter(),
      filterRenderer: () => {},
      formatter: (cell: number) => {
        return numberFormatDecimal(+cell || 0, '', '');
      },
      csvFormatter: (cell: any) => {
        return cell || '-';
      },
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  return (
    <div>
      <TableBootstrapHookNoApi
        data={tableData}
        columns={columnsArr}
        loading={needLoadNewData}
        notSupportPagination
        // noPadding
        fixedColumns></TableBootstrapHookNoApi>
    </div>
  );
};

export default connect(null, {
  getRevenueList: reportActions.getRevenueList,
  getOrderList: reportActions.getOrderList,
  getProductList: reportActions.getProductList,
  getCustomerList: reportActions.getCustomerList
})(DetailTable);
