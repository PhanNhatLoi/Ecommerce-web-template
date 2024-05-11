import { Col, Form, message, Skeleton } from 'antd/es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt, useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { sidebarMenus } from '~/configs/menus';
import * as PATH from '~/configs/routesConfig';
import { authActions, authSelectors } from '~/state/ducks/authUser';
import { roleBaseAccessControlActions } from '~/state/ducks/settings/roleAndPermission';
import HOC from '~/views/container/HOC';
import { useSubheader } from '~/views/presentation/core/Subheader';
import Divider from '~/views/presentation/divider';
import { MInput } from '~/views/presentation/fields/input';
import LayoutForm from '~/views/presentation/layout/forForm';
import { BackBtn, CancelBtn, ResetBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card as BCard, CardBody, CardFooter, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';

import TablePermission from '../components/TablePermission';
import { DataSource, defaultValueAccess, Menu, statusRole } from '../Types';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

type Props = {
  createRoleBase: any;
  getRoleBaseDetail: any;
  updateRoleBase: any;
  getRoleBase: any;
  getAuthUser: any;
};
const InforForm = (props: Props) => {
  const subheader = useSubheader();
  const params: any = useParams();
  subheader.setUseDates(false);
  const history = useHistory();
  const { t }: any = useTranslation();
  // for form
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resetForm, setResetForm] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);
  //for data
  const [menuList, setMenuList] = useState<Array<DataSource>>([]);
  const [dataSubmit, setDataSubmit] = useState<Array<any>>([]);
  const [result, setResult] = useState<any>([]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  });

  const getVendorRoleBase = () => {
    props
      .getRoleBase()
      .then((res) => {})
      .catch((err) => {
        console.error('🚀 ~ file: index.js:46 ~ getVendorRoleBase ~ err', err);
      });
  };

  const flattenMenuRecursion = (menu: any): any => {
    let sub: any = [];
    const flattenMenu = menu?.map((item: any) => {
      if (item.children && item?.children?.length) {
        sub = [...sub, ...item.children];
      }
      return item;
    });
    return flattenMenu.concat(sub?.length ? flattenMenuRecursion(sub) : sub);
  };

  useEffect(() => {
    setDataSubmit(flattenMenuRecursion(menuList));
  }, [menuList]);

  // get and set data for table
  useEffect(() => {
    if (params.id) {
      if (result.length) {
        if (sidebarMenus) {
          const userBusinessTypes = props?.getAuthUser?.businessTypes?.map((item: { id: string }) => item.id);
          const dataSoure: Array<DataSource> = sidebarMenus
            .filter((menu: any) => {
              if (typeof menu.businessTypes === 'string') return true;
              return userBusinessTypes.includes(menu.businessTypes);
            })
            .filter((menu: Menu) => menu.path !== PATH.DEFAULT_PATH && !menu.showOnlyVendor)
            .map((menu: Menu) => {
              return {
                key: menu.path,
                title: t(menu.title.props.i18nKey),
                path: menu.path,
                parent: menu.parent,
                access: result.find((f) => f.path === menu.path)?.access,
                disabledAction: menu.disabledAction || [],
                children: menu.subMenus && menu.subMenus.length > 0 ? getChildrenRecursion(menu?.subMenus) : undefined
              };
            });
          setMenuList(dataSoure);
          setResetForm(false);
        }
      }
    } else {
      if (sidebarMenus) {
        const userBusinessTypes = props?.getAuthUser?.businessTypes?.map((item: { id: string }) => item.id);
        const dataSoure: Array<DataSource> = sidebarMenus
          .filter((menu: any) => {
            if (typeof menu.businessTypes === 'string') return true;
            return userBusinessTypes.includes(menu.businessTypes);
          })
          .filter((menu: Menu) => menu.path !== PATH.DEFAULT_PATH && !menu.showOnlyVendor)
          .map((menu: Menu) => {
            return {
              key: menu.path,
              title: t(menu.title.props.i18nKey),
              path: menu.path,
              parent: menu.parent,
              access: defaultValueAccess,
              disabledAction: menu.disabledAction || [],
              children: menu.subMenus && menu.subMenus.length > 0 ? getChildrenRecursion(menu?.subMenus) : undefined
            };
          });
        setMenuList(dataSoure);
        setResetForm(false);
      }
    }
  }, [result, resetForm]);

  const getChildrenRecursion = (subMenu: Array<Menu>): Array<DataSource> => {
    return subMenu.map((menu: Menu) => {
      return {
        key: menu.path,
        path: menu.path,
        parent: menu.parent,
        title: t(menu.title.props.i18nKey),
        permission: menu.permission,
        access: params.id ? result.find((f) => f.path === menu.path)?.access : defaultValueAccess,
        disabledAction: menu.disabledAction || [],
        children: menu.subMenus && menu.subMenus.length > 0 ? getChildrenRecursion(menu?.subMenus) : undefined
      };
    });
  };

  // get data for detail page
  useEffect(() => {
    setLoading(true);
    if (params.id) {
      setResetForm(false);
      props
        .getRoleBaseDetail(params.id)
        .then((res: any) => {
          const result = res.data || res.content;
          const pagePermissions = result?.pagePermissions;
          setResult(pagePermissions);
          form.setFieldsValue({
            roleName: result.name,
            description: result.description
          });
          setLoading(false);
        })
        .catch((err: any) => console.error(err));
    } else {
      setLoading(false);
    }
  }, [params]);

  const submitAction = (action: any, payload: any, successMessage: string) => {
    action(payload, params.id || null)
      .then(() => {
        setDirty(false);
        getVendorRoleBase();
        if (!params.id) history.push(PATH.SETTINGS_ROLES_AND_PERMISSION_PATH);
        AMessage.success(t(successMessage).toString());
        setIsSubmitting(false);
      })
      .catch((err: { message: string }) => {
        AMessage.error(t(err.message).toString());
        setIsSubmitting(false);
      });
  };

  const onFinish = (values: any) => {
    setIsSubmitting(true);

    if (dataSubmit.length <= 0) {
      AMessage.error(t('No_pages_selected').toString());
      setIsSubmitting(false);
    } else {
      const body = {
        id: Number(params?.id) || null,
        name: values.roleName,
        description: values.description,
        pagePermissions: dataSubmit.map((item: DataSource) => {
          return { name: item.title, path: item.path, access: item.access, status: item.status || statusRole.ACTIVATED };
        })
      };

      const action = params.id ? props.updateRoleBase : props.createRoleBase;
      const successMessage = params.id ? 'update_role_base_access' : 'create_role_base_access';
      submitAction(action, body, successMessage);
    }
  };

  const handleReset = () => {
    setResetForm(true);
    setDirty(false);
    if (!params.id) form.resetFields();
  };

  const onFormChange = () => {
    setDirty(true);
  };

  return (
    <HOC>
      <WrapStyleForm>
        <BCard>
          <CardHeader
            titleHeader={params.id ? t('role_base_access_detail') : t('create_role_base')}
            btn={
              <div>
                <BackBtn onClick={() => history.push(PATH.SETTINGS_ROLES_AND_PERMISSION_PATH)} />
                <SubmitBtn disabled={!dirty} loading={isSubmitting} onClick={() => form.submit()} />
              </div>
            }></CardHeader>
          <CardBody>
            <Skeleton style={{ height: '500px' }} active loading={loading}>
              <Form {...ANT_FORM_SEP_LABEL_LAYOUT} form={form} name={'create'} onFinish={onFinish} onFieldsChange={onFormChange}>
                <Prompt when={dirty} message={t('leave_confirm')} />
                <LayoutForm //
                  data-aos="fade-left"
                  title={t('role_name')}
                  description={t('role_name_des')}>
                  <div className="row">
                    <Col sm={24} md={24} lg={11}>
                      <MInput noLabel require name="roleName" label={t('role_name')} placeholder={t('role_name')} />
                    </Col>
                    <Col sm={24} md={24} lg={2}></Col>
                    <Col sm={24} md={24} lg={11}>
                      <MInput require={false} rules="" noLabel name="description" label={t('description')} placeholder={t('description')} />
                    </Col>
                  </div>
                </LayoutForm>
                <Divider />
                <LayoutForm //
                  title={t('permission')}
                  description={t('permission_des')}>
                  <div className="row">
                    <div className="col-12">
                      <TablePermission
                        dataSubmit={dataSubmit}
                        title={t('permission')}
                        setData={setMenuList}
                        data={menuList}
                        setDirty={setDirty}
                      />
                    </div>
                  </div>
                </LayoutForm>
              </Form>
            </Skeleton>
          </CardBody>
          <CardFooter className="p-4">
            <div className="d-flex flex-wrap justify-content-center align-item-center">
              <CancelBtn onClick={() => history.push(PATH.SETTINGS_ROLES_AND_PERMISSION_PATH)} />
              <ResetBtn onClick={handleReset} />
              <SubmitBtn disabled={!dirty} loading={isSubmitting} onClick={() => form.submit()} />
            </div>
          </CardFooter>
        </BCard>
      </WrapStyleForm>
    </HOC>
  );
};

export default connect(
  (state: any) => ({
    getAuthUser: authSelectors.getAuthUser(state)
  }),
  {
    createRoleBase: roleBaseAccessControlActions.createRoleBaseAccessControl,
    getRoleBaseDetail: roleBaseAccessControlActions.getDetailRoleBaseAccessControl,
    updateRoleBase: roleBaseAccessControlActions.updateRoleBaseAccessControl,
    getRoleBase: authActions.getRoleBase
  }
)(InforForm);
