import { Form, FormInstance, Popconfirm } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { customerActions } from '~/state/ducks/customer';
import { ContactType } from '~/state/ducks/customer/actions';
import TableBootstrapHookNoApi from '~/views/presentation/table-bootstrap-hook-no-api';
import { BackBtn, ResetBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook-no-api/ActionBtn';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { UtilDate } from '~/views/utilities/helpers';
import { toAbsoluteUrl } from '~/views/utilities/helpers/metronic/AssetsHelpers';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';

import ContactModal from '../Modals/ContactModal';

type ContactListProps = {
  form: FormInstance<any>;
  getCustomerDetail: any;
  isSubmitting: boolean;
  contactList: ContactType[];
  setContactList: React.Dispatch<React.SetStateAction<ContactType[]>>;
  setDirty: (value: boolean) => void;
};

const ContactList: React.FC<ContactListProps> = (props) => {
  const { t }: any = useTranslation();
  const params = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [addModalShow, setAddModalShow] = useState(false);
  const [needLoadNewData, setNeedLoadNewData] = useState(true);
  const [contactIndex, setContactIndex] = useState<number | undefined>();

  useEffect(() => {
    if (params?.profileId) {
      setNeedLoadNewData(true);
      props
        .getCustomerDetail(params?.profileId)
        .then((res) => {
          props.setContactList(res?.content?.contact || []);
          setNeedLoadNewData(false);
        })
        .catch((err) => {
          setNeedLoadNewData(false);
          console.error('chiendev ~ file: ContactList.tsx: 47 ~ useEffect ~ err', err);
        });
    } else setNeedLoadNewData(false);
  }, [params?.profileId]);

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
      formatter: (cell: string, row: ContactType, index: number) => {
        return cell ? (
          <AButton
            type="link"
            onClick={() => {
              setContactIndex(index);
              setAddModalShow(true);
            }}>
            {cell}
          </AButton>
        ) : (
          '-'
        );
      }
    },
    {
      dataField: 'technician',
      text: t('position'),
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
      text: t('phone_number'),
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
    },
    {
      dataField: 'action',
      text: t('actions'),
      sort: false,
      style: {
        minWidth: 100,
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      },
      formatter: (cell: any, row: ContactType, index: number) => {
        return (
          <Popconfirm
            placement="topRight"
            title={t('deleteRowConfirm')}
            onConfirm={() => handleDelete(index)}
            okText={t('yes')}
            cancelText={t('no')}>
            <AButton className="btn btn-icon btn-light btn-hover-danger btn-sm">
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG src={toAbsoluteUrl('/media/svg/icons/General/Trash.svg')} />
              </span>
            </AButton>
          </Popconfirm>
        );
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

  // For reset form and data
  useEffect(() => {
    if (!addModalShow) {
      setContactIndex(undefined);
    }
  }, [addModalShow]);
  // For reset form and data

  const handleDelete = (index: number) => {
    props.setContactList((contact: ContactType[]) =>
      contact.filter((_: any, idx: number) => {
        return index !== idx;
      })
    );
  };

  return (
    <div>
      <TableBootstrapHookNoApi
        data={props.contactList}
        columns={columnsArr}
        loading={needLoadNewData}
        notSupportPagination
        buttons={[
          {
            type: 'create',
            class: 'pl-0',
            icon: <i className="fas fa-plus" style={{ color: '#000' }}></i>,
            text: t('customer_contact_new'),
            onClick: () => {
              setAddModalShow(true);
              setContactIndex(undefined);
            }
          }
        ]}></TableBootstrapHookNoApi>

      <div className="d-flex flex-wrap justify-content-center align-item-center">
        <BackBtn onClick={() => history.push(PATH.CAR_ACCESSORIES_CUSTOMER_LIST_PATH)} />
        <ResetBtn
          onClick={() => {
            props.form.resetFields();
            props.setContactList([]);
            props.setDirty(true);
          }}
        />
        <SubmitBtn loading={props.isSubmitting} onClick={() => form.submit()} />
      </div>

      {/* MODALS */}
      <ContactModal //
        contactIndex={contactIndex}
        contactList={props.contactList}
        setContactList={props.setContactList}
        modalShow={addModalShow}
        setModalShow={setAddModalShow}
      />
    </div>
  );
};

export default connect(null, {
  getCustomerDetail: customerActions.getCustomerDetail
})(ContactList);
