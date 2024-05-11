import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Avatar, Col, Descriptions, Row, Skeleton } from 'antd/es';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { IMAGE_UPLOAD_URL, TYPOGRAPHY_TYPE } from '~/configs';
import { DEFAULT_AVATAR } from '~/configs/default';
import { PRICING_UNIT } from '~/configs/status/car-services/pricingSystemStatus';
import { customerActions } from '~/state/ducks/customer';
import { CustomerDetailResponse } from '~/state/ducks/customer/actions';
import { getAuthorizedUser } from '~/state/utils/session';
import Divider from '~/views/presentation/divider';
import TableBootstrapHookNoApi from '~/views/presentation/table-bootstrap-hook-no-api';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import { UploadStyled } from '../components/Styles';

type ViewFormProps = {
  id?: string;
  getCustomerDetail: any;
  onCancel: React.MouseEventHandler<HTMLElement>;
  cancelText?: string;
};

const ViewForm: React.FC<ViewFormProps> = (props) => {
  const { t }: any = useTranslation();
  const [pageLoading, setPageLoading] = useState(false);
  const [customerDetail, setCustomerDetail] = useState<CustomerDetailResponse>();
  const [avatarSrc, setAvatarSrc] = useState<string>('');
  const [contractSrc, setContractSrc] = useState<UploadFile[]>([]);
  const [imageSrc, setImageSrc] = useState<string[]>([]);
  const [documentSrc, setDocumentSrc] = useState<UploadFile[]>([]);
  const [fullAddress, setFullAddress] = useState('');

  // ----------------------------------
  // GET CUSTOMER INFO
  // ----------------------------------
  useEffect(() => {
    if (Boolean(props.id)) {
      setPageLoading(true);
      props
        .getCustomerDetail(props.id)
        .then((res: { content: CustomerDetailResponse }) => {
          const response = res?.content;
          const address = res?.content?.address;
          const fullAddress = `${address?.address || ''} ${address?.fullAddress || ''}, ${address?.wards?.name || ''}, ${
            address?.district?.name || ''
          }, ${address?.province?.name || ''} ${address?.zipCode || ''}, ${address?.country?.nativeName || ''}`;

          setFullAddress(
            fullAddress
              .split(',')
              .map((segment) => segment.trim())
              .join(', ')
          );
          setCustomerDetail(response);
          setAvatarSrc(
            response?.avatar && !response?.avatar?.includes('http') ? firstImage(response?.avatar) : response?.avatar || DEFAULT_AVATAR
          );
          setContractSrc(
            response?.otherData?.contractFiles
              ? response?.otherData?.contractFiles.map((contract: UploadFile) => {
                  return { uid: contract?.uid, name: contract?.name, url: firstImage(contract?.url) };
                })
              : []
          );
          setImageSrc(response?.otherData?.otherImages || []);
          setDocumentSrc(
            response?.otherData?.otherDocuments
              ? response?.otherData?.otherDocuments.map((contract: UploadFile) => {
                  return { uid: contract?.uid, name: contract?.name, url: firstImage(contract?.url) };
                })
              : []
          );
          setPageLoading(false);
        })
        .catch((err: any) => {
          console.error('chiendev ~ file: ViewForm.tsx: 73 ~ useEffect ~ err', err);
          setPageLoading(false);
        });
    }
  }, [props.id]);

  const columns = [
    {
      dataField: 'index',
      text: t('contact_index'),
      style: {
        minWidth: 60,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell: string, row: string, index: number) => {
        return ++index;
      }
    },
    {
      dataField: 'fullName',
      text: t('contact_name'),
      style: {
        minWidth: 200
      },
      formatter: (cell: string) => {
        return cell || '-';
      }
    },
    {
      dataField: 'technician',
      text: t('contact_role'),
      style: {
        minWidth: 140,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return cell || '-';
      }
    },
    {
      dataField: 'gender',
      text: t('gender'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return t(cell) || '-';
      }
    },
    {
      dataField: 'birthday',
      text: t('birthday'),
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return <span>{UtilDate.toDateLocal(cell) || '-'}</span>;
      }
    },
    {
      dataField: 'phone',
      text: t('phone'),
      style: {
        minWidth: 170,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell: string) => {
        return cell ? formatPhoneWithCountryCode(cell, cell?.startsWith('84') ? 'VN' : cell?.startsWith('1') ? 'US' : 'VN') : '-';
      }
    },
    {
      dataField: 'email',
      text: t('email_address'),
      style: {
        minWidth: 170
      },
      formatter: (cell: string) => {
        return cell || '-';
      }
    },
    {
      dataField: 'fullAddress',
      text: t('address'),
      style: {
        minWidth: 250
      },
      formatter: (cell: string) => {
        return cell !== 'undefined' ? cell : '-';
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
      headerClasses: 'ht-custom-header-table',
      ...column
    };
  });
  //-------------------------
  // COMMON property column
  //-------------------------

  return (
    <>
      <Skeleton loading={pageLoading} active>
        <div className="d-flex flex-wrap">
          {(customerDetail?.avatar || '').includes('http') ? (
            <Avatar
              size={124}
              className="mr-5 mb-3 mb-lg-0"
              // preview={{
              //   mask: <EyeOutlined />
              // }}
              // width={32}
              src={avatarSrc}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <AuthAvatar
              size={124}
              className="mr-5 mb-3 mb-lg-0"
              preview={{
                mask: <EyeOutlined />
              }}
              width={32}
              isAuth={true}
              src={avatarSrc}
            />
          )}
          <div className="d-flex flex-column justify-content-center">
            <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={2}>
              <span style={{ fontWeight: '500' }}>{customerDetail?.fullName || '-'}</span>
            </ATypography>
            <div className="d-flex align-items-center">
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={1} className="text-muted pr-5" style={{ fontSize: '14px' }}>
                {customerDetail?.phone ? formatPhoneWithCountryCode(customerDetail?.phone, customerDetail?.country?.code) : '-'}
              </ATypography>
            </div>
          </div>
        </div>
      </Skeleton>

      <Divider />

      <Skeleton loading={pageLoading} active>
        <Row>
          <Col span={24}>
            <AlignedDescription
              column={1}
              labelStyle={{ color: 'rgba(0,0,0,0.5)', width: '200px', verticalAlign: 'top' }}
              colon={false}
              bordered>
              <Descriptions.Item label="Email:">{customerDetail?.email || '-'}</Descriptions.Item>
              <Descriptions.Item label={`${t('address')}:`}>{fullAddress || '-'}</Descriptions.Item>
              <Descriptions.Item label={`${t('max_allow_debt')}:`}>
                {customerDetail?.otherData?.debtMaximum
                  ? numberFormatDecimal(
                      customerDetail?.otherData?.debtMaximum,
                      customerDetail?.otherData?.currency === PRICING_UNIT.DONG ? ' đ' : ' $'
                    )
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={`${t('debt_term')}:`}>
                {customerDetail?.otherData?.timeDate ? `${customerDetail?.otherData?.timeDate} ${t(customerDetail?.otherData?.time)}` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={`${t('digital_contract')}:`}>{customerDetail?.otherData?.digitalContract || '-'}</Descriptions.Item>
              <Descriptions.Item label={`${t('contract_file')}:`} contentStyle={{ display: 'inline-block' }}>
                {contractSrc.length > 0 ? (
                  <UploadStyled
                    headers={{ Authorization: `Bearer ${getAuthorizedUser()}` }}
                    action={IMAGE_UPLOAD_URL}
                    fileList={contractSrc}
                    showUploadList={{
                      showRemoveIcon: false
                    }}></UploadStyled>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label={`${t('customer_other_document_view')}:`} contentStyle={{ display: 'inline-block' }}>
                {documentSrc.length > 0 ? (
                  <UploadStyled
                    headers={{ Authorization: `Bearer ${getAuthorizedUser()}` }}
                    action={IMAGE_UPLOAD_URL}
                    fileList={documentSrc}
                    showUploadList={{
                      showRemoveIcon: false
                    }}></UploadStyled>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label={`${t('customer_other_image_view')}:`} contentStyle={{ display: 'inline-block' }}>
                {imageSrc.length > 0 ? (
                  <Row>
                    {imageSrc.map((image, i) => (
                      <div className={i !== 0 ? 'd-none d-md-block' : ''}>
                        <AuthImage
                          src={firstImage(image)}
                          isAuth={true}
                          width={100}
                          preview={{
                            mask: <EyeOutlined />
                          }}
                        />
                      </div>
                    ))}
                  </Row>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
            </AlignedDescription>
          </Col>
        </Row>
      </Skeleton>

      <TableBootstrapHookNoApi
        title={t('contact_info_list')}
        data={customerDetail?.contact}
        columns={columnsArr}
        loading={pageLoading}
        notSupportPagination
        buttons={[]}></TableBootstrapHookNoApi>

      <Divider />
      <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
        <AButton
          style={{ verticalAlign: 'middle', width: '200px' }}
          className="mt-3 mt-lg-0 ml-lg-3 px-5"
          size="large"
          type="ghost"
          onClick={props.onCancel}
          icon={<CloseOutlined />}>
          {props.cancelText || t('close')}
        </AButton>
      </div>
    </>
  );
};

export default connect(null, {
  getCustomerDetail: customerActions.getCustomerDetail
})(ViewForm);
