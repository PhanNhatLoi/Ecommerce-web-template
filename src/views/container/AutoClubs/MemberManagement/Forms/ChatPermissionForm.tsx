import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Checkbox, Form, Table, Tooltip } from 'antd/es';
import { first } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { memberActions } from '~/state/ducks/member';
import Divider from '~/views/presentation/divider';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';

const CHECKBOX_ACTION = {
  ADMIN: 'ADMIN',
  PUBLISH: 'PUBLISH',
  MUTE: 'MUTE'
};

const MEMBER_ROLE = {
  GC_MEMBER: 'GC_MEMBER',
  GC_ADMIN: 'GC_ADMIN'
};

type ChatPermissionFormProps = {
  data: any;
  disableSubmitting: boolean;
  setDisableSubmitting: any;
  setNeedLoadNewData: any;
  onOk: any;
  onCancel: any;
  setDirty: any;
  getChatRoleDetail: any;
  assignChatRole: any;
};

const ChatPermissionForm: React.FC<ChatPermissionFormProps> = (props) => {
  const { t }: any = useTranslation();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    setLoading(true);
    const memberUserId = first(props.data)?.memberUserId;
    if (memberUserId) {
      props
        .getChatRoleDetail(memberUserId)
        .then((res) => {
          const response = res?.content;
          setData([
            {
              ...response,
              role: response?.role === MEMBER_ROLE.GC_ADMIN,
              allowPublish: response?.permissions?.allowPublish,
              allowUserAction: response?.permissions?.allowUserAction
            }
          ]);
          setLoading(false);
        })
        .catch((err) => {
          AMessage.error(`${first(props.data)?.fullname} ${t(err.message)}`, 5);
          console.error(err);
          setLoading(false);
          props.setDisableSubmitting(true);
        });
    }
  }, [props.data]);

  const onFinish = () => {
    if (data?.length > 0) {
      setSubmitting(true);
      props
        .assignChatRole(data[0].memberUserId, {
          role: data[0].role ? MEMBER_ROLE.GC_ADMIN : MEMBER_ROLE.GC_MEMBER,
          permission: {
            allowPublish: data[0].allowPublish,
            allowUserAction: data[0].allowUserAction
          }
        })
        .then((res) => {
          AMessage.success(t('assignChatRoleSuccess'));
          props.onOk();
          setData([]);
          props.setNeedLoadNewData(true);
          setSubmitting(false);
        })
        .catch((err) => {
          AMessage.error(t(err.message));
          console.error('trandev ~ file: InfoForm.js ~ line 72 ~ onFinish ~ err', err);
          setSubmitting(false);
        });
    }
  };

  const handleChange = (memberUserId: string, checked: any, actionPage: any) => {
    props.setDirty(true);
    setData(
      data.map((item) => {
        if (item.memberUserId === memberUserId) {
          return {
            ...item,
            role: actionPage === CHECKBOX_ACTION.ADMIN ? checked : item.role,
            allowPublish:
              actionPage === CHECKBOX_ACTION.ADMIN ? checked : actionPage === CHECKBOX_ACTION.PUBLISH ? checked : item.allowPublish,
            allowUserAction:
              actionPage === CHECKBOX_ACTION.ADMIN ? checked : actionPage === CHECKBOX_ACTION.MUTE ? checked : item.allowUserAction
          };
        }
        return item;
      })
    );
  };

  const checkBoxRender = (row: any, action: any) => {
    let checked = false;
    switch (action) {
      case CHECKBOX_ACTION.ADMIN:
        checked = row.role;
        break;
      case CHECKBOX_ACTION.PUBLISH:
        checked = row.allowPublish;
        break;
      case CHECKBOX_ACTION.MUTE:
        checked = row.allowUserAction;
        break;
      default:
        break;
    }

    return (
      <Tooltip placement="topLeft" title={t('allow_access')}>
        <Checkbox
          disabled={row.disabledAction?.some((s) => s === action)}
          checked={checked}
          onChange={(e) => handleChange(row.memberUserId, e.target.checked, action)}
          name={row.path}></Checkbox>
      </Tooltip>
    );
  };

  const columns: any = [
    {
      title: t('fullName'),
      dataIndex: 'memberName',
      key: 'memberName',
      render: (cell) => {
        return <span>{t(cell)}</span>;
      },
      width: '350px',
      responsive: ['sm', 'lg', 'md', 'xl', 'xxl', 'xs']
    },
    {
      title: t('adminRole'),
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      responsive: ['sm', 'lg', 'md', 'xl', 'xxl', 'xs'],
      width: '150px',
      render: (cell: string[], row: any, index: number) => {
        return checkBoxRender(row, CHECKBOX_ACTION.ADMIN);
      }
    },
    {
      title: t('publishRole'),
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      responsive: ['sm', 'lg', 'md', 'xl', 'xxl', 'xs'],
      width: '170px',
      render: (cell: string[], row: any, index: number) => {
        return checkBoxRender(row, CHECKBOX_ACTION.PUBLISH);
      }
    },
    {
      title: t('muteRole'),
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      responsive: ['sm', 'lg', 'md', 'xl', 'xxl', 'xs'],
      width: '170px',
      render: (cell: string[], row: any, index: number) => {
        return checkBoxRender(row, CHECKBOX_ACTION.MUTE);
      }
    }
  ];

  return (
    <>
      <Table bordered columns={columns} pagination={{ defaultPageSize: 10 }} dataSource={data} loading={loading} />

      <Divider />

      <Form.Item>
        <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
          <BasicBtn
            size="large"
            loading={submitting}
            type="primary"
            htmlType="submit"
            disabled={props.disableSubmitting}
            icon={<SaveOutlined />}
            onClick={onFinish}
            title={t('save')}
          />
          <BasicBtn
            size="large"
            type="ghost"
            onClick={() => {
              setData([]);
              props.onCancel();
            }}
            icon={<CloseOutlined />}
            title={t('close')}
          />
        </div>
      </Form.Item>
    </>
  );
};

export default connect(null, {
  getChatRoleDetail: memberActions.getChatRoleDetail,
  assignChatRole: memberActions.assignChatRole
})(ChatPermissionForm);
