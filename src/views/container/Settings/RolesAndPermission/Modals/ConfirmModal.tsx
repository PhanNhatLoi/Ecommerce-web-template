import { CloseOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Form, Image, Table } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { DEFAULT_AVATAR } from '~/configs/default';
import { userSettingActions } from '~/state/ducks/settings/userSetting';
import Divider from '~/views/presentation/divider';
import { MInput } from '~/views/presentation/fields/input';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const MInputStyled = styled(MInput)`
  .ant-input-affix-wrapper {
    border: 1px solid #000 !important;
  }
`;

type propsConfirmType = {
  text: string;
  modalShow: Boolean;
  action: any;
  data: {
    type: 'block' | 'unblock' | 'approve' | 'reject' | 'remove';
    id: string;
  }[];
  setNeedLoadNewData: any;
  setData: (e: []) => void;
  setModalShow: any;
  getUsermanagement: any;
};

const ConfirmDeleteModal = (props: propsConfirmType) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState('');
  const [stateForm, setStateForm] = useState<boolean>(true);
  const [influenceList, setInfluenceList] = useState<any[]>([]);
  const [showListUser, setShowListUer] = useState<boolean>(false);

  const confirmAction = (values: { confirmId: String }) => {
    const action = props.action;
    const confirmIds = values.confirmId.split(';').map((id: String) => id.trim());
    setLoading(true);
    Promise.all(
      confirmIds.map((id: String) => {
        return action(Number(id), actionType);
      })
    )
      .then((res) => {
        props.setNeedLoadNewData(true);
        AMessage.success(t(`${actionType}_${props.text}_success`).toString());
        setLoading(false);
        handleCancel();
      })
      .catch((err) => {
        setLoading(false);
        console.error('trandev ~ file: RemoveModal.js ~ line 41 ~ onFinish ~ err', err);
        AMessage.error(t(err.message).toString());
      });
  };

  const onFinish = (values: { confirmId: String }) => {
    confirmAction(values);
  };

  const onFinishFailed = (err: any) => {
    console.error('trandev ~ file: ConfirmModal.tsx ~ line 54 ~ onFinishFailed ~ err', err);
  };

  const handleCancel = () => {
    form.resetFields();
    setSubmitDisabled(true);
    props.setModalShow(false);
    props.setData([]);
    setSelectedIds([]);
    setInfluenceList([]);
    setStateForm(true);
  };

  // ----------------------------------------
  // FOR VALIDATE INPUT
  // ----------------------------------------
  useEffect(() => {
    if (props?.data?.length) {
      props?.data?.map((d) => setSelectedIds((selectedIds): any => [...selectedIds, d?.id?.toString()]));
      setActionType(head(props?.data)?.type || '');
    }
  }, [props.data]);

  const onFormChange = () => {
    let Ids = form.getFieldValue('confirmId').split(';');

    Ids = Ids.map((m: String) => m.trim());

    let isSame = true;
    if (selectedIds === Ids) isSame = true;
    else if (selectedIds == null || Ids == null) isSame = false;
    else if (selectedIds.length !== Ids.length) isSame = false;
    else
      for (var i = 0; i < selectedIds.length; ++i) {
        if (selectedIds[i] !== Ids[i]) isSame = false;
      }
    setSubmitDisabled(!isSame);
  };
  // ----------------------------------------
  // FOR VALIDATE INPUT
  // ----------------------------------------

  const DeleteForm = () => {
    return (
      <Form //
        {...ANT_FORM_SEP_LABEL_LAYOUT}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onChange={onFormChange}>
        <ATypography className="mb-3">{t(`${actionType}_${props.text}_helper`).toString()}</ATypography>
        <div className="mb-3">
          {props.data.map((item, i) => (
            <ATypography strong key={i}>
              {item.id}
              {`${i < props.data.length - 1 ? ';' : ''}`}{' '}
            </ATypography>
          ))}
        </div>

        <MInputStyled //
          noLabel
          noPadding
          label=""
          name="confirmId"
          placeholder={t(`enter_${props.text}_id`)}
          extra={<span style={{ fontSize: '11px' }}>{t(`${props.text}_extra`).toString()}</span>}
        />

        {influenceList?.length > 0 && (
          <div className="mb-3">
            <ATypography type="danger">{t('warning_delete_role_base').toString()}:</ATypography>
            <AButton type="link" onClick={() => setShowListUer(true)}>
              {t('view_list')}
            </AButton>
          </div>
        )}

        <Divider />
        <Form.Item>
          <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
            <BasicBtn
              loading={loading}
              size="large"
              disabled={submitDisabled}
              htmlType="submit"
              type="primary"
              icon={<DeleteOutlined />}
              title={t(`confirm_${actionType}`)}
            />
            <BasicBtn size="large" type="ghost" onClick={handleCancel} icon={<CloseOutlined />} title={t('close')} />
          </div>
        </Form.Item>
      </Form>
    );
  };

  useEffect(() => {
    if (selectedIds.length) {
      let influence_list: string[] = [];
      selectedIds.map((m: string) => {
        props
          .getUsermanagement({ rolePageId: m })
          .then((res: any) => {
            if (res.content.length) {
              res.content.map((result: any) => {
                influence_list.push(result);
              });
              setInfluenceList([...influenceList, ...influence_list]);
            }
          })
          .catch((err: any) => console.error(t(err)));
      });
    }
  }, [selectedIds]);

  const NoteForm = () => {
    const columns = [
      {
        dataIndex: 'code',
        title: t('id')
      },
      {
        dataIndex: 'avatar',
        title: t('avatar'),
        render: (cell: string) => {
          if (cell) {
            let src = !cell.includes('http') ? firstImage(cell) : cell || DEFAULT_AVATAR;
            return cell.includes('http') ? (
              <Image
                preview={{
                  mask: <EyeOutlined />
                }}
                width={50}
                src={src}
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <AuthImage
                preview={{
                  mask: <EyeOutlined />
                }}
                width={50}
                isAuth={true}
                src={src}
                // onClick={(e) => e.stopPropagation()}
              />
            );
          } else return '-';
        }
      },
      {
        dataIndex: 'fullName',
        title: t('full_name')
      },

      {
        dataIndex: 'phone',
        title: t('phone'),
        render: (cell: string, row: any) => {
          return cell ? formatPhoneWithCountryCode(cell, cell?.startsWith('84') ? 'VN' : cell?.startsWith('1') ? 'US' : 'VN') : '-';
        }
      },
      {
        dataIndex: 'email',
        title: t('email')
      },
      {
        dataIndex: 'rolePageName',
        title: t('role_name'),
        render: (cell: string, row: any) => {
          return cell || '-';
        }
      }
    ];
    return (
      <AntModal
        title={t('list_inf')}
        description={''}
        width={1000}
        modalShow={showListUser}
        destroyOnClose
        onOk={() => setShowListUer(false)}
        onCancel={() => setShowListUer(false)}>
        <Table bordered dataSource={influenceList} columns={columns} />
      </AntModal>
    );
  };

  return (
    <AntModal
      title={t(`${actionType}_${props.text}`)}
      description={t(`${actionType}_${props.text}_des`)}
      width={1000}
      modalShow={props.modalShow}
      destroyOnClose
      onOk={onFinish}
      onCancel={handleCancel}>
      <DeleteForm />
      <NoteForm />
    </AntModal>
  );
};

export default connect(null, {
  getUsermanagement: userSettingActions.getUserManagerment
})(ConfirmDeleteModal);
