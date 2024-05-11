import { Col, Form, Row, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authActions, authSelectors } from '~/state/ducks/authUser';
import { roleBaseAccessControlActions } from '~/state/ducks/settings/roleAndPermission';
import { userSettingActions } from '~/state/ducks/settings/userSetting';
import { UsermanagermentDetailResponse } from '~/state/ducks/settings/userSetting/actions';
import HOC from '~/views/container/HOC';
import { useSubheader } from '~/views/presentation/core/Subheader';
import Divider from '~/views/presentation/divider';
import { MInput, MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import { MUploadImageCrop } from '~/views/presentation/fields/upload';
import LayoutForm from '~/views/presentation/layout/forForm';
import { BackBtn, CancelBtn, EditBtn, ResetBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { Card as BCard, CardBody, CardFooter, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';

import * as Types from '../types';
import InputPassword from './InputPassword';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

const getFullAddress = (addressInfo: string[]): string => {
  let fullAddress: string = addressInfo?.length
    ? addressInfo
        .map((m: string, index: number) => {
          if (!m || index === 0) return m;
          else return ', ' + m;
        })
        .join('')
    : '';
  return fullAddress;
};
type Props = {
  createUserManagerment: any;
  getUserManagermentDetail: any;
  updateUserManagerment: any;
  getRoleBase: any;
  getUser: any;
  getRoleBaseAccess: any;
};

const InforForm = (props: Props) => {
  const subheader = useSubheader();
  subheader.setUseDates(false);
  const history = useHistory();
  const { t }: any = useTranslation();
  const params = useParams<{ id?: string; action?: string }>();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(params.action === 'view' ? true : false);
  const [loading, setLoading] = useState<boolean>(params.id ? true : false);
  const [dirty, setDirty] = useState<boolean>(false);
  const [fileIcon, setFileIcon] = useState<any>();
  const [addressNeedLoad, setAddressNeedLoad] = useState<any>();
  const [parentVendorId, setParentVendorId] = useState<number>();
  const [email, setEmail] = useState<string>();
  const [updateId, setUpdateId] = useState<number>();
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBaseAccess);

  useEffect(() => {
    form.setFieldValue('code', Types.countryCodeDefault.VI);
    props
      .getUser()
      .then((res: any) => {
        setParentVendorId(Number(res.content.userId));
      })
      .catch((err: { messsage }) => AMessage.error(t(err.messsage)));
  }, []);

  const setPhone = (phone: string) => {
    if (phone.includes('+84')) {
      form.setFieldsValue({
        code: 241,
        phone: phone.replace('+84', '').trim()
      });
    }
  };
  // FOR VIEW DETAIL AND UPDATE PAGE
  useEffect(() => {
    if (params?.id) {
      props
        .getUserManagermentDetail(params.id)
        .then((res: { content: UsermanagermentDetailResponse }) => {
          props.getRoleBase().then((res) => {
            form.setFieldValue('roleBase', res.content.find((f) => f.id === data.rolePageId) ? data.rolePageId : t('has_not_been_granted'));
          });
          const data = res.content;
          const address = data?.address;
          setEmail(data.email);
          setPhone(data.phone);
          setUpdateId(data.id);
          form.setFieldsValue({
            email: data.email,
            fullName: data.fullName,
            password: '********',
            avatar: data.avatar,
            phone_view: data.phone,
            country1: address?.countryId,
            address1: address?.address,
            state: address?.stateId,
            zipCode: address?.zipCode,
            province: address?.provinceId,
            district: address?.districtId,
            ward: address?.wardsId
          });
          setAddressNeedLoad({
            country: address?.countryId,
            // state: data.addressInfo?.stateId,
            province: address?.provinceId,
            district: address?.districtId,
            ward: address?.wardsId
          });
          setFileIcon(data.avatar);
          setLoading(false);
        })
        .catch((err: any) => {
          AMessage.error(t(err.message).toString());
          setIsSubmitting(false);
        });
    }
  }, [params]);

  // ACTION FORM
  const onFinish = (values: any) => {
    setIsSubmitting(true);
    const bodyCreate = {
      parentVendorId: parentVendorId,
      username: values.email.toLowerCase(),
      password: values.password,
      profile: {
        countryId: values.country1,
        fullName: values.fullName,
        email: values.email.toLowerCase(),
        phone: (values.code === Types.countryCodeDefault.VI ? '+84 ' : '') + values.phone,
        avatar: values.avatar,
        logo: values.avatar,
        address: {
          lat: 10.79555, //hard code
          lng: 106.63795, //hard code
          address: values.address1 || null,
          districtId: values.district || null,
          provinceId: values.province || null,
          wardsId: values.ward || null,
          countryId: values.country1 || null,
          zipCode: values.zipCode || null,
          fullAddress: getFullAddress(values.addressInfo),
          stateId: null
        },
        rolePageId: Number(values.roleBase)
      }
    };

    const bodyUpdate = {
      id: updateId,
      countryId: values.country1,
      fullName: values.fullName,
      email: values.email.toLowerCase(),
      phone: (values.code === Types.countryCodeDefault.VI ? '+84 ' : '') + values.phone,
      avatar: values.avatar,
      address: {
        lat: 10.79555, //hard code
        lng: 106.63795, //hard code
        address: values.address1,
        districtId: values.district,
        provinceId: values.province,
        wardsId: values.ward,
        countryId: values.country1,
        zipCode: values.zipCode,
        fullAddress: getFullAddress(values.addressInfo),
        stateId: null
      },
      rolePageId: Number(values.roleBase)
    };

    submitAction(
      params.id ? props.updateUserManagerment : props.createUserManagerment,
      params.id ? bodyUpdate : bodyCreate,
      params.id ? 'update_sucess' : 'create_sucess'
    );
  };

  const submitAction = (action: any, body: any, successMessage: string) => {
    action(body, params.id || null)
      .then(() => {
        setIsSubmitting(false);
        setDirty(false);
        history.push(PATH.SETTINGS_USERS_PATH);
        AMessage.success(t(successMessage).toString());
      })
      .catch((err: any) => {
        AMessage.error(t(err.message).toString());
        setIsSubmitting(false);
      });
  };

  const onFormChange = (value: any) => {
    setDirty(true);
  };

  const handleReset = () => {
    setFileIcon(undefined);
    form.resetFields();
    form.setFieldValue('email', email);
  };

  const onImageChange = (file: string) => {
    setDirty(true);
    setFileIcon(file);
    form.setFieldsValue({ avatar: file });
  };

  return (
    <HOC>
      <WrapStyleForm>
        <Skeleton active loading={loading}>
          <BCard>
            <CardHeader
              titleHeader={!params.id ? t('create_user_management') : isView ? t('view_user_management') : t('edit_user_management')}
              btn={
                fullAccessPage && (
                  <div>
                    <BackBtn onClick={() => history.push(PATH.SETTINGS_USERS_PATH)} />
                    {isView ? (
                      <EditBtn loading={isSubmitting} onClick={() => setIsView(false)} />
                    ) : (
                      <SubmitBtn disabled={!dirty} loading={isSubmitting} onClick={() => form.submit()} />
                    )}
                  </div>
                )
              }></CardHeader>
            <CardBody>
              <Form {...ANT_FORM_SEP_LABEL_LAYOUT} form={form} name={'create'} onFinish={onFinish} onFieldsChange={onFormChange}>
                <Prompt when={dirty} message={t('leave_confirm')} />
                <Col>
                  <LayoutForm //
                    title={t('info_user_login')}
                    description={t('info_user_login_des')}>
                    <Row>
                      <Col sm={24} md={24} lg={11} className="w-100 mb-5">
                        <MInput
                          noLabel
                          noPadding
                          autoComplete="new-email"
                          disabled={params.id}
                          require={!isView}
                          type="email"
                          name="email"
                          label={t('email_register')}
                          placeholder={t('enter_email_register')}
                        />
                      </Col>
                      <Col sm={24} md={24} lg={2} className="mb-5"></Col>
                      <Col sm={24} md={24} lg={11} className="mb-5">
                        <MUploadImageCrop
                          disabled={isView}
                          label={t('avatar').toString()}
                          maximumUpload={1}
                          onImageChange={onImageChange}
                          name="avatar"
                          file={fileIcon}
                          require={false}
                        />
                      </Col>
                    </Row>
                    <Row>
                      {isView || !params.id || changePassword ? (
                        <InputPassword isView={isView} />
                      ) : (
                        <Col sm={24} md={24} lg={11}>
                          <AButton
                            disabled={true} // Chưa có API
                            onClick={() => {
                              setChangePassword(true);
                              form.setFieldValue('password', '');
                            }}>
                            {t('change_password')}
                          </AButton>
                        </Col>
                      )}
                    </Row>
                    <Divider />
                  </LayoutForm>
                </Col>
                <Col>
                  <LayoutForm //
                    title={t('info_user')}
                    description={t('info_user_des')}>
                    <Row>
                      <Col sm={24} md={24} lg={11}>
                        <MInput
                          noLabel
                          noPadding
                          disabled={isView}
                          require={!isView}
                          name="fullName"
                          label={t('full_name')}
                          placeholder={t('full_name')}
                        />
                      </Col>
                      <Col sm={24} md={24} lg={2}></Col>
                      <Col sm={24} md={24} lg={11}>
                        {isView ? (
                          <MInput noLabel noPadding disabled={isView} require={false} readOnly name="phone_view" label={t('Phone')} />
                        ) : (
                          <MInputPhone
                            noLabel
                            noPadding
                            label={t('phone_number')}
                            placeholder={t('phone_number')}
                            name="phone"
                            require={!isView}
                            phoneTextTranslate="2px"
                          />
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="w-100">
                        <MInputAddress //
                          disabled={isView}
                          form={form}
                          notRequireZipCode
                          label={t('address')}
                          name="addressInfo"
                          needLoadData={addressNeedLoad}
                          noLabel
                          noPadding
                          setNeedLoadData={setAddressNeedLoad}
                        />
                      </Col>
                    </Row>
                    <Divider />
                  </LayoutForm>
                </Col>
                <Col>
                  <LayoutForm //
                    title={t('role_base_access_control')}
                    description={t('role_base_access_control_des')}>
                    <Row>
                      <Col sm={24} md={24} lg={11}>
                        <MSelect
                          noLabel
                          noPadding
                          disabled={isView}
                          label={t('role_base_access_control')}
                          name="roleBase"
                          placeholder={t('role_base_access_control')}
                          fetchData={props.getRoleBase}
                          valueProperty="id"
                          labelProperty="name"
                          searchCorrectly={false}
                        />
                      </Col>
                    </Row>
                  </LayoutForm>
                </Col>
              </Form>
            </CardBody>
            {!isView && (
              <CardFooter className="p-4">
                <div className="d-flex flex-wrap justify-content-center align-item-center">
                  <CancelBtn onClick={() => history.push(PATH.SETTINGS_USERS_PATH)} />
                  <ResetBtn onClick={handleReset} />
                  <SubmitBtn disabled={!dirty} loading={isSubmitting} onClick={() => form.submit()} />
                </div>
              </CardFooter>
            )}
          </BCard>
        </Skeleton>
      </WrapStyleForm>
    </HOC>
  );
};

export default connect(
  (state: any) => ({
    getAuthUser: authSelectors.getAuthUser(state),
    getRoleBaseAccess: authSelectors.getRoleBase(state) // role of redux
  }),
  {
    getUser: authActions.getUser,
    createUserManagerment: userSettingActions.createUserManagerment,
    getUserManagermentDetail: userSettingActions.getDetailUserManagerment,
    updateUserManagerment: userSettingActions.updateUserManagerment,
    getRoleBase: roleBaseAccessControlActions.getRoleBaseAccessControls
  }
)(InforForm);
