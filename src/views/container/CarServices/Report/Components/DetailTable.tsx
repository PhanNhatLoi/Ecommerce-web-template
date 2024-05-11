import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TIME_UNITS } from '~/configs';
import { TABS_REPORT } from '~/configs/const';
import { reportActions } from '~/state/ducks/carServices/report';
import { RequireParams } from '~/state/ducks/carServices/report/actions';
import TableBootstrapHookNoApi from '~/views/presentation/table-bootstrap-hook-no-api';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

type DetailTableProps = {
  tab: string;
  params: RequireParams;
  dateType: string;
  getRevenueList: any;
  getServiceList: any;
  getUserList: any;
  getGiftList: any;
  getPromotionList: any;
};

const DetailTable: React.FC<DetailTableProps> = (props) => {
  const { t }: any = useTranslation();
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [tableData, setTableData] = useState<any>([]);

  useEffect(() => setNeedLoadNewData(true), [props.tab, props.params]);

  useEffect(() => {
    setNeedLoadNewData(true);
    handleGetApi(props.tab, props?.params)
      .then((res: any) => {
        // get data with necessary columns
        const response = res?.content?.map((data) => getTableColumns(props.tab, data));
        setTableData(getTableDataByTime(response, props.params, props.dateType));

        setNeedLoadNewData(false);
      })
      .catch((err: any) => {
        setNeedLoadNewData(false);
        console.error('🚀chiendev ~ file: DetailTable.tsx:50 ~ useEffect ~ err', err);
      });
  }, [props.tab, props.params]);

  const handleGetApi = (tab: string, params: RequireParams | undefined) => {
    const finalParams = {
      sort: [TABS_REPORT.REVENUE].includes(props.tab)
        ? 'revenueDate,desc'
        : [TABS_REPORT.USER].includes(props.tab)
        ? 'requestDate,desc'
        : 'date,desc',
      // fetch all
      size: 1000000000,
      ...params
    };
    switch (tab) {
      case TABS_REPORT.REVENUE:
        return props.getRevenueList(finalParams);
      case TABS_REPORT.SERVICE:
        return props.getServiceList(finalParams);
      case TABS_REPORT.USER:
        return props.getUserList(finalParams);
      case TABS_REPORT.GIFT_CARD:
        return props.getGiftList(finalParams);
      case TABS_REPORT.PROMOTION:
        return props.getPromotionList(finalParams);
      default:
        return;
    }
  };

  // format dataField date to createdDate
  const getTableColumns = (tab, data) => {
    switch (tab) {
      case TABS_REPORT.REVENUE:
        return {
          createdDate: data.revenueDate,
          sales: data.sales,
          totalOrder: data.totalOrder,
          totalPromotion: data.totalPromotion,
          sumRevenue: data.sumRevenue
        };
      case TABS_REPORT.SERVICE:
        return {
          createdDate: data.date,
          categoryId: data.categoryId,
          category: data.category,
          totalRequest: data.totalRequest,
          totalOrder: data.totalOrder,
          totalTechnician: data.totalTechnician,
          revenue: data.revenue
        };
      case TABS_REPORT.USER:
        return {
          createdDate: data.requestDate,
          totalUser: data.totalUser,
          totalTechnician: data.totalTechnician,
          totalBooking: data.totalBooking
        };
      case TABS_REPORT.GIFT_CARD:
        return {
          createdDate: data.date,
          code: data.code,
          customerName: data.customerName,
          giftName: data.giftName,
          serial: data.serial,
          giftPrice: data.giftPrice,
          providerName: data.providerName
        };
      case TABS_REPORT.PROMOTION:
        return {
          createdDate: data.date,
          promotionName: data.promotionName,
          totalGara: data.totalGara,
          totalApply: data.totalApply,
          totalUser: data.totalUser,
          totalDiscount: data.totalDiscount
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
      case TABS_REPORT.SERVICE:
        return data.categoryId === item.categoryId && data.category === item.category;
      case TABS_REPORT.PROMOTION:
        return data.promotionName === item.promotionName;
      default:
        return data;
    }
  };

  const getTableDataByTime = (tableData: any, params: RequireParams, timeType: any) => {
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
            existingItem.sales += item.sales;
            existingItem.totalOrder += item.totalOrder;
            existingItem.totalPromotion += item.totalPromotion;
            existingItem.sumRevenue += item.sumRevenue;
          } else if (props.tab === TABS_REPORT.SERVICE) {
            existingItem.totalRequest += item.totalRequest;
            existingItem.totalOrder += item.totalOrder;
            existingItem.totalTechnician += item.totalTechnician;
            existingItem.revenue += item.revenue;
          } else if (props.tab === TABS_REPORT.USER) {
            existingItem.totalUser += item.totalUser;
            existingItem.totalTechnician += item.totalTechnician;
            existingItem.totalBooking += item.totalBooking;
          } else if (props.tab === TABS_REPORT.PROMOTION) {
            existingItem.totalGara += item.totalGara;
            existingItem.totalApply += item.totalApply;
            existingItem.totalUser += item.totalUser;
            existingItem.totalDiscount += item.totalDiscount;
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
      text: t('Date'),
      style: {
        minWidth: 150,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return <span>{formatDate(cell, props.dateType || TIME_UNITS.MONTH.toLowerCase())}</span>;
      }
    },
    {
      dataField: 'sales',
      text: t('sales'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.REVENUE].includes(props.tab)
    },
    {
      dataField: 'code',
      text: t('orderCode'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.GIFT_CARD].includes(props.tab),
      formatter: (cell: string) => {
        return cell || '-';
      }
    },
    {
      dataField: 'customerName',
      text: t('customer_name'),
      style: {
        minWidth: 200,
        textAlign: 'left'
      },
      headerStyle: {
        textAlign: 'left'
      },
      hidden: ![TABS_REPORT.GIFT_CARD].includes(props.tab),
      formatter: (cell: string) => {
        return cell || '-';
      }
    },
    {
      dataField: 'giftName',
      text: t('giftCardName'),
      style: {
        minWidth: 200,
        textAlign: 'left'
      },
      headerStyle: {
        textAlign: 'left'
      },
      hidden: ![TABS_REPORT.GIFT_CARD].includes(props.tab),
      formatter: (cell: string) => {
        return cell || '-';
      }
    },
    {
      dataField: 'serial',
      text: t('seri'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.GIFT_CARD].includes(props.tab),
      formatter: (cell: string) => {
        return cell || '-';
      }
    },
    {
      dataField: 'giftPrice',
      text: t('giftCardValue'),
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.GIFT_CARD].includes(props.tab),
      formatter: (cell: number) => {
        return numberFormatDecimal(+cell || 0, ' đ', '');
      }
    },
    {
      dataField: 'providerName',
      text: t('suppliers_name'),
      style: {
        minWidth: 200,
        textAlign: 'left'
      },
      headerStyle: {
        textAlign: 'left'
      },
      hidden: ![TABS_REPORT.GIFT_CARD].includes(props.tab),
      formatter: (cell: string) => {
        return cell || '-';
      }
    },
    {
      dataField: 'category',
      text: t('parentCategory'),
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.SERVICE].includes(props.tab),
      formatter: (cell: number) => {
        return cell || '-';
      }
    },
    {
      dataField: 'totalRequest',
      text: t('totalRequest'),
      style: {
        minWidth: 220,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.SERVICE].includes(props.tab)
    },
    {
      dataField: 'totalOrder',
      text: [TABS_REPORT.REVENUE].includes(props.tab) ? t('orders_quantity') : t('problemFixedRequest'),
      style: {
        minWidth: 220,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.REVENUE, TABS_REPORT.SERVICE].includes(props.tab)
    },
    {
      dataField: 'promotionName',
      text: t('promotionName'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.PROMOTION].includes(props.tab),
      formatter: (cell: number) => {
        return cell || '-';
      }
    },
    {
      dataField: 'totalGara',
      text: t('garageApplyQuantity'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.PROMOTION].includes(props.tab)
    },
    {
      dataField: 'totalApply',
      text: t('apply_quantity'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.PROMOTION].includes(props.tab)
    },
    {
      dataField: 'totalUser',
      text: [TABS_REPORT.USER].includes(props.tab) ? t('eca_user_quantity') : t('userUseQuantity'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.USER, TABS_REPORT.PROMOTION].includes(props.tab)
    },
    {
      dataField: 'totalDiscount',
      text: t('totalPromotionBudget'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.PROMOTION].includes(props.tab),
      formatter: (cell: number) => {
        return numberFormatDecimal(+cell || 0, ' đ', '');
      }
    },
    {
      dataField: 'totalPromotion',
      text: t('Promotion'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.REVENUE].includes(props.tab),
      formatter: (cell: number) => {
        return numberFormatDecimal(+cell || 0, ' đ', '');
      }
    },
    {
      dataField: 'totalTechnician',
      text: [TABS_REPORT.SERVICE].includes(props.tab) ? t('ecaSRepaired') : t('ecaS_user_quantity'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.SERVICE, TABS_REPORT.USER].includes(props.tab)
    },
    {
      dataField: 'totalBooking',
      text: t('totalUseService'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.USER].includes(props.tab)
    },
    {
      dataField: [TABS_REPORT.REVENUE].includes(props.tab) ? 'sumRevenue' : 'revenue',
      text: t('revenue'),
      style: {
        minWidth: 180,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      hidden: ![TABS_REPORT.REVENUE, TABS_REPORT.SERVICE].includes(props.tab),
      formatter: (cell: number) => {
        return numberFormatDecimal(+cell || 0, ' đ', '');
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
      filter: customFilter({ type: FILTER_TYPES.TEXT }),
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
        noPadding
        fixedColumns></TableBootstrapHookNoApi>
    </div>
  );
};

export default connect(null, {
  getRevenueList: reportActions.getRevenueList,
  getServiceList: reportActions.getServiceList,
  getUserList: reportActions.getUserList,
  getGiftList: reportActions.getGiftList,
  getPromotionList: reportActions.getPromotionList
})(DetailTable);
