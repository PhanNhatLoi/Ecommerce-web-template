import { head } from 'lodash-es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import AntTable from '~/views/presentation/ui/table/AntTable';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

import InsurancePackageModal from '../Modals/InsurancePackageModal';

const TableWrapper = styled.div`
  margin-bottom: 40px;

  .ant-table-content {
    border: 1px solid #000;
  }

  .ant-table-thead > tr > th {
    background-color: rgba(0, 0, 0, 0.2);
  }

  .ant-table-tbody > tr > td {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

type PackageTableProps = { formValues: any };

const PackageTable: React.FC<PackageTableProps> = (props) => {
  const { t }: any = useTranslation();
  const [packageId, setPackageId] = useState<number | undefined>(undefined);
  const [packageModalShow, setPackageModalShow] = useState(false);

  const columns = [
    {
      title: t('package_insurance'),
      dataIndex: 'productName',
      width: '300px',
      align: 'left',
      render: (cell, row) => {
        return head(props?.formValues?.orderDetails)?.productName ? (
          <div>
            <div>
              <a
                href="*"
                onClick={(e) => {
                  e.preventDefault();
                  setPackageId(row?.insurance?.insurancePackageId);
                  setPackageModalShow(true);
                }}>
                {head(props?.formValues?.orderDetails)?.productName}
              </a>
            </div>
            <div>{`${t('code')}: ${row?.insurance?.insurancePackageId || t('N/A')}`}</div>
          </div>
        ) : (
          t('N/A')
        );
      }
    },
    {
      title: t('insuranceFee'),
      dataIndex: 'unitPrice',
      width: '150px',
      align: 'center',
      render: (cell, row) => {
        return row?.insurance?.unitPrice ? <span>{numberFormatDecimal(+row?.insurance?.unitPrice, ' đ', '')}</span> : t('N/A');
      }
    },
    {
      title: `${t('tax')} (10%)`,
      dataIndex: 'tax',
      width: '80px',
      align: 'center',
      render: (cell, row) => {
        return row?.insurance?.tax ? <span>{numberFormatDecimal(+row?.insurance?.tax, ' đ', '')}</span> : t('N/A');
      }
    },
    {
      title: t('CoDriverAndPassengerFee'),
      dataIndex: 'extraInsurance',
      width: '120px',
      align: 'center',
      render: (cell, row) => {
        return row?.insurance?.extraInsurance?.total ? (
          <span>{numberFormatDecimal(+row?.insurance?.extraInsurance?.total, ' đ', '')}</span>
        ) : (
          t('N/A')
        );
      }
    },
    {
      title: t('Subtotal'),
      dataIndex: 'total',
      width: '200px',
      align: 'center',
      render: (cell, row) => {
        return head(props?.formValues?.orderDetails)?.unitPrice ? (
          <span>{numberFormatDecimal(+head(props?.formValues?.orderDetails)?.unitPrice, ' đ', '')}</span>
        ) : (
          t('N/A')
        );
      }
    }
  ];

  const columnsNew = columns.map((column) => {
    return {
      headerClasses: 'ht-custom-header-table',
      ...column
    };
  });

  return (
    <TableWrapper>
      <AntTable columns={columnsNew} data={props?.formValues?.insuranceContract ? [props?.formValues?.insuranceContract] : []} noBordered />

      <InsurancePackageModal packageId={packageId} modalShow={packageModalShow} setModalShow={setPackageModalShow} />
    </TableWrapper>
  );
};

export default PackageTable;
