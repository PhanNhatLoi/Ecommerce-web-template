import { CloseOutlined, EyeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Col, Empty, Form, message, Radio, Result, Row, Select } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { EnumVendorMessageType } from '~/configs';
import { USER_ROLES } from '~/configs/const';
import { DEFAULT_AVATAR } from '~/configs/default';
import { memberActions } from '~/state/ducks/member';
import { notificationActions } from '~/state/ducks/notification';
import Divider from '~/views/presentation/divider';
import MCheckbox from '~/views/presentation/fields/Checkbox';
import { MCKEditor, MInput } from '~/views/presentation/fields/input';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { formatPhoneWithCountryCode, replaceVniToEng } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import ReceiverList from '../components/ReceiverList';
import { BasicBtn } from '~/views/presentation/ui/buttons';

const ReceiverTitle = (props) => {
  return (
    <>
      <div className="w-100 mt-5 ml-3">
        <ATypography style={{ color: 'rgba(0,0,0,0.7)', fontSize: '18px' }}>{props.title}</ATypography>
      </div>
      <Divider />
    </>
  );
};

const RadioWrapper = styled(Form.Item)`
  .ant-radio-button-wrapper {
    border: none;
    margin-right: 16px;
    border-radius: 5px;
    width: 145px;
    text-align: center;
    transition: all 0.3s ease-in-out;
  }
  .ant-radio-button-checked,
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    border-radius: 5px;
    background: #ebebeb;
    color: #000;
  }
  .ant-radio-button-wrapper:hover {
    border: none;
    border-radius: 5px;
    background: #f5f5f5;
    color: #000;
  }
  .ant-radio-button-wrapper::before,
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
    background: transparent;
  }
`;

type InfoFormProps = {
  id: any;
  user: any;
  onCancel: any;
  isEditing: any;
  submitIcon: any;
  submitText: any;
  setNeedLoadNewData: any;
  getReceivers: any;
  getNotificationDetail: any;
  createNotification: any;
  updateNotification: any;
};

const InfoForm: React.FC<InfoFormProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  //--------------------------------------------------------------
  // FOR RECEIVER SELECT
  //--------------------------------------------------------------
  const [receiverType, setReceiverType] = useState<any>([]);
  const [mechanicList, setMechanicList] = useState<any>([]);
  const [memberList, setMemberList] = useState<any>([]);
  const [receiverLoading, setReceiverLoading] = useState(false);
  const [selectedReceivers, setSelectedReceivers] = useState<any>([]);
  const [selectDataSrc, setSelectDataSrc] = useState<any>([]);
  const [receiverDisabled, setReceiverDisabled] = useState(false);
  const [receiver, setReceiver] = useState(t('receiver_placeholder'));
  const [isAllMember, setIsAllMember] = useState(false);
  const [isAllMechanic, setIsAllMechanic] = useState(false);
  const [isAllMemberAndMechanic, setIsAllMemberAndMechanic] = useState(false);
  const [content, setContent] = useState('');
  const [receiverIds, setReceiverIds] = useState(''); // use for view notification detail

  const fetchData = (setLoading, action, setList, params) => {
    setLoading(true);
    action(params)
      .then((res) => {
        // since member and mechanic API response with different content
        setList(
          res?.content.map((item) => {
            return {
              id: item?.id,
              userId: item?.userId,
              phone: item?.phone,
              avatar: item?.avatar,
              name: item?.fullName,
              search: `${item?.fullName}-${item?.phone}`
            };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: InfoForm.js ~ line 79 ~ useEffect ~ err', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(setReceiverLoading, props.getReceivers, setMemberList, USER_ROLES.CONSUMER);
    fetchData(setReceiverLoading, props.getReceivers, setMechanicList, USER_ROLES.TECHNICIAN);

    setSelectDataSrc([...memberList, ...mechanicList]);

    // default values
    form.setFieldsValue({ messageType: EnumVendorMessageType[0] });
  }, []);

  useEffect(() => {
    setSelectDataSrc([...memberList, ...mechanicList]);
    setReceiverLoading(false);
  }, [memberList, mechanicList]);

  const handleReceiverCheck = (allMemberAndMechanic, allMember, allMechanic) => {
    setIsAllMemberAndMechanic(allMemberAndMechanic);
    setIsAllMember(allMember);
    setIsAllMechanic(allMechanic);
  };

  const handleReceiverChange = (receiverPlaceholder, receiverDisabled) => {
    setReceiver(receiverPlaceholder);
    setReceiverDisabled(receiverDisabled);
  };

  useEffect(() => {
    // BOTH CHECKBOXES ARE CHECKED
    if (receiverType.includes('allMembers') && receiverType.includes('allMechanics')) {
      handleReceiverChange(t('receiver_placeholder'), true);
      setSelectDataSrc([...memberList, ...mechanicList]);
      // for list display
      handleReceiverCheck(false, false, false);

      // ALL MECHANICS CHECKBOX IS CHECKED
    } else if (receiverType.includes('allMechanics')) {
      handleReceiverChange(t('receiver_placeholder'), false);
      setSelectDataSrc(memberList);
      // for list display
      handleReceiverCheck(false, false, true);

      // ALL MEMBER CHECKBOX IS CHECKED
    } else if (receiverType.includes('allMembers')) {
      handleReceiverChange(t('receiver_placeholder'), false);
      setSelectDataSrc(mechanicList);
      // for list display
      handleReceiverCheck(false, true, false);

      // NONE ARE CHECKED
    } else {
      handleReceiverChange(t('receiver_placeholder'), false);
      setSelectDataSrc([...memberList, ...mechanicList]);
      // for list display
      handleReceiverCheck(false, false, false);
    }
    setSelectedReceivers([]);
  }, [receiverType]);
  //--------------------------------------------------------------
  // FOR RECEIVER SELECT
  //--------------------------------------------------------------

  // Get notification detail
  useEffect(() => {
    if (props.id) {
      props
        .getNotificationDetail(props.id)
        .then((res) => {
          const response = res?.content;
          form.setFieldsValue({
            vendorName: props.user?.fullName,
            message: response?.message,
            content: response?.content,
            messageType: response?.messageType
          });
          setContent(response?.content);
          setReceiverIds(JSON.parse(response?.pushToUsers).map((id) => id?.toString()));
        })
        .catch((err) => {
          console.error('trandev ~ file: InfoForm.js ~ line 41 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
        });
    } else {
      // set phone  code is VN +84 as default
      form.setFieldsValue({ sendingTime: 'now' });
    }
  }, [props.id]);

  // Get receiver in notification detail
  useEffect(() => {
    if (selectDataSrc?.length > 0 && receiverIds?.length > 0) {
      setSelectedReceivers(selectDataSrc.filter((item) => receiverIds.includes(item.userId)));
    }
  }, [selectDataSrc, receiverIds]);

  const onFinish = (values) => {
    setSubmitting(true);

    const userIds =
      receiverType.includes('allMembers') && receiverType.includes('allMechanics')
        ? [...memberList, ...mechanicList].map((receiver) => receiver.userId)
        : receiverType.includes('allMembers')
        ? [...selectedReceivers, ...memberList].map((receiver) => receiver.userId)
        : receiverType.includes('allMechanics')
        ? [...selectedReceivers, ...mechanicList].map((receiver) => receiver.userId)
        : selectedReceivers.map((receiver) => receiver.userId) || [];

    if (userIds.length > 0) {
      const body = {
        vendorName: props.user?.fullName,
        message: values.message,
        content: values.content,
        messageType: values.messageType,
        userIds: userIds
      };

      if (props.id) {
        props
          .updateNotification({ ...body, id: +props.id })
          .then((res) => {
            AMessage.success(t('update_notification_success'));
            form.resetFields();
            props.onCancel();

            setSelectedReceivers([]);
            setIsAllMemberAndMechanic(false);
            setIsAllMember(false);
            setIsAllMechanic(false);
            props.setNeedLoadNewData && props.setNeedLoadNewData(true);
            setSubmitting(false);
          })
          .catch((err) => {
            AMessage.error(t(err.message));
            console.error('trandev ~ file: InfoForm.js ~ line 72 ~ onFinish ~ err', err);
            setSubmitting(false);
          });
      } else {
        props
          .createNotification(body)
          .then((res) => {
            AMessage.success(t('create_notification_success'));
            form.resetFields();
            props.onCancel();

            setSelectedReceivers([]);
            setIsAllMemberAndMechanic(false);
            setIsAllMember(false);
            setIsAllMechanic(false);
            props.setNeedLoadNewData && props.setNeedLoadNewData(true);
            setSubmitting(false);
          })
          .catch((err) => {
            AMessage.error(t(err.message));
            console.error('trandev ~ file: InfoForm.js ~ line 72 ~ onFinish ~ err', err);
            setSubmitting(false);
          });
      }
    } else {
      AMessage.error(t('pleaseSelectReceiver'));
      setSubmitting(false);
    }
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  const onContentChange = (data) => {
    form.setFieldsValue({
      content: `<html><head><style type="text/css">img{max-width: 100%;height: auto;} html{font-size: 13px;}</style></head><body><div style="color: #686867; font-family: 'poppins_regular'">${data}</div></body></html>`
    });
  };

  return (
    <Form requiredMark={false} {...ANT_FORM_SEP_LABEL_LAYOUT} form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Row>
        <Col md={24} lg={12}>
          <MInput
            noLabel
            noPadding
            name="message"
            label={t('message')}
            placeholder={t('message_placeholder')}
            extra={props.isEditing ? null : <span style={{ fontSize: '11px' }}>{t('message_extra')}</span>}
            tooltip={{
              title: t('required_field'),
              icon: (
                <span>
                  (<ATypography type="danger">*</ATypography>)
                </span>
              )
            }}
          />

          {/* TODO: Add in version 2.0
          <RadioWrapper label={t('sending_time')} name="sendingTime">
            <Radio.Group>
              <Radio.Button value="now">{t('send_now')}</Radio.Button>
            </Radio.Group>
          </RadioWrapper> */}

          <Divider />

          <MCKEditor //
            noPadding
            noLabel
            require={true}
            name="content"
            label={t('content')}
            value={content}
            setContent={setContent}
            onChange={onContentChange}
            toolBar={{
              toolbar: {
                items: [
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'link',
                  'bulletedList',
                  'numberedList',
                  '|',
                  'imageUpload',
                  'blockQuote',
                  'insertTable',
                  'undo',
                  'redo'
                ]
              }
            }}
          />

          <RadioWrapper label={t('message_type')} name="messageType">
            <Radio.Group>
              {EnumVendorMessageType.map((type) => (
                <Radio.Button value={type}>{t(type.toLowerCase())}</Radio.Button>
              ))}
            </Radio.Group>
          </RadioWrapper>
        </Col>

        <Col md={0} lg={1} />

        <Col md={24} lg={11}>
          <MCheckbox
            noLabel
            value={receiverType}
            onCheckboxChange={(values) => setReceiverType(values)}
            label={t('receivers')}
            tooltip={{
              title: t('required_field'),
              icon: (
                <span>
                  (<ATypography type="danger">*</ATypography>)
                </span>
              )
            }}
            options={[
              { value: 'allMembers', label: t('all_members') },
              { value: 'allMechanics', label: t('all_mechanics') }
            ]}
          />

          <Select //
            className="w-100"
            size="large"
            value={receiver}
            showSearch
            filterOption={(input, option) => {
              const childrenOption = option?.search || option?.value;
              return replaceVniToEng(childrenOption.toLowerCase()).indexOf(replaceVniToEng(input.toLowerCase())) >= 0;
            }}
            disabled={receiverDisabled}
            loading={receiverLoading}
            notFoundContent={receiverLoading ? <ASpinner spinning /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            onChange={(value) => {
              setReceiver(t('receiver_placeholder'));
              const selectedUser = head(selectDataSrc.filter((item) => item.userId === value));
              if (selectedUser)
                setSelectedReceivers((selectedReceivers) => {
                  if (!selectedReceivers.map((user) => user.userId).includes(selectedUser?.userId))
                    return [
                      ...selectedReceivers,
                      ...[
                        {
                          name: selectedUser?.name,
                          phone: selectedUser?.phone,
                          avatar: selectedUser?.avatar,
                          userId: selectedUser?.userId
                        }
                      ]
                    ];
                  else return [...selectedReceivers];
                });
              form.setFieldsValue({ receivers: undefined });
            }}
            placeholder={t('receiver_placeholder')}>
            {selectDataSrc.map((o, i) => {
              let src = !o?.avatar?.includes('http') ? firstImage(o?.avatar) : o?.avatar || DEFAULT_AVATAR;
              return (
                <Select.Option key={i} value={o.userId} search={o.search}>
                  <div className="d-flex align-items-center">
                    <div>
                      <AuthAvatar
                        className="mr-3"
                        preview={{
                          mask: <EyeOutlined />
                        }}
                        width={32}
                        size={32}
                        isAuth={true}
                        src={src}
                        // onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="d-flex flex-column">
                      <div>
                        <strong>{o.name}</strong>
                      </div>
                      <div>
                        {formatPhoneWithCountryCode(o.phone, o.phone.startsWith('84') ? 'VN' : o.phone.startsWith('1') ? 'US' : 'VN')}
                      </div>
                    </div>
                  </div>
                </Select.Option>
              );
            })}
          </Select>

          {isAllMemberAndMechanic ? (
            <Result
              icon={<InfoCircleOutlined style={{ fontSize: '32px', opacity: 0.7 }} />}
              title={<span style={{ color: 'rgba(0,0,0,0.7)', fontSize: '18px' }}>{t('all_members_and_all_mechanics')}</span>}
            />
          ) : isAllMember ? (
            <>
              <ReceiverTitle title={t('all_members')} />
              <ReceiverList setData={setSelectedReceivers} data={selectedReceivers} />
            </>
          ) : isAllMechanic ? (
            <>
              <ReceiverTitle title={t('all_mechanics')} />
              <ReceiverList setData={setSelectedReceivers} data={selectedReceivers} />
            </>
          ) : (
            <ReceiverList setData={setSelectedReceivers} data={selectedReceivers} />
          )}
        </Col>
      </Row>

      <Divider />
      <Form.Item>
        <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
          <BasicBtn title={props.submitText} size="large" htmlType="submit" loading={submitting} type="primary" icon={props.submitIcon} />
          <BasicBtn
            title="close"
            type="ghost"
            onClick={() => {
              setContent('');
              onContentChange('');
              setSelectedReceivers([]);
              setIsAllMemberAndMechanic(false);
              setIsAllMember(false);
              setIsAllMechanic(false);
              form.resetFields();
              props.onCancel();
            }}
            icon={<CloseOutlined />}
          />
        </div>
      </Form.Item>
    </Form>
  );
};

export default connect(
  (state: any) => ({
    user: state['authUser'].user
  }),
  {
    getNotificationDetail: notificationActions.getNotificationDetail,
    createNotification: notificationActions.createNotification,
    updateNotification: notificationActions.updateNotification,
    getReceivers: memberActions.getReceivers
  }
)(InfoForm);
