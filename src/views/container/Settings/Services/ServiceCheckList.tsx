import { SaveOutlined } from '@ant-design/icons';
import { Form, Input, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect, useDispatch } from 'react-redux';
import { Prompt } from 'react-router';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import {
  getSettingCategories,
  getVendorSupportedCategories,
  SettingCategoryResponse,
  updateSettingCategory,
  updateSettingServices
} from '~/state/ducks/settings/actions';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { replaceVniToEng } from '~/views/utilities/helpers/string';

import CategoryCheckItem from './CategoryCheckItem';
import ServiceCheckItem from './ServiceCheckItem';
import ServiceOther from './ServiceOther';
import { BasicBtn } from '~/views/presentation/ui/buttons';

const ServicesCheckListStyled = styled.div`
  width: 400px;

  .check_list {
    max-height: calc(100vh - 400px);
    overflow-y: auto;
  }

  .all_service_item {
    position: sticky;
    top: 0;
    background: #eee;
    z-index: 2;
  }

  .icon_all_service {
    width: 40px;
    height: 40px;
    font-size: 28px;
    i {
      color: #0a5b66;
    }
  }
`;

const ITEM_ALL = (t) => ({
  icon: '',
  id: -1,
  index: -1,
  isDefault: false,
  name: t('all'),
  parentCatalogId: -1,
  subCatalogs: [],
  services: [],
  categoryId: -1
});

type ServiceCheckListProps = {
  /* Use for register form */
  registerForm?: boolean;
  setStep?: any;
  setBodyRequest?: any;
  /* Use for register form */
  getRoleBase: any;
};

const ServiceCheckList: React.FC<ServiceCheckListProps> = (props) => {
  const { t }: any = useTranslation();
  const dispatch = useDispatch();

  const [initial, setInitial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showServiceList, setShowServiceList] = useState(false);
  const [categories, setCategories] = useState<Array<SettingCategoryResponse>>([]);
  const [categoriesNoService, setCategoriesNoService] = useState<Array<SettingCategoryResponse>>([]);
  const [categoriesFilter, setCategoriesFilter] = useState<Array<SettingCategoryResponse>>();
  const [flagSuccess, setFlagSuccess] = useState(false);

  // Categories checked list
  const [categoriesDetail, setCategoriesDetail] = useState<SettingCategoryResponse>();
  const [catalogIds, setCatalogIds] = useState<Array<number>>([]);
  const [indeterminateCategory, setIndeterminateCategory] = useState(false);

  // Service checked list
  const [serviceIds, setServiceIds] = useState<Array<number>>([]);
  const [serviceBody, setServiceBody] = useState<any>([]); // use for payload
  const [indeterminateService, setIndeterminateService] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);

  const [form] = Form.useForm();
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, props.getRoleBase);

  const fetchCategoryData = async () => {
    setLoading(true);

    let categoriesNoService = [];
    await dispatch(getSettingCategories({ parentId: 1 })).then((res) => {
      setCategoriesNoService(res?.content?.filter((item: any) => !item?.services?.length) || []);
      setCategories(res?.content || []);
      setServiceIds(
        res?.content
          ?.flatMap((item: any) => item.services)
          ?.filter((service) => service?.isSupported)
          ?.map((service) => service.id) || []
      );
      setServiceBody(
        res?.content
          ?.filter((item: any) => item?.services?.length)
          ?.map((item: any) => ({
            categoryId: item.id,
            questionIds: item.services?.filter((service) => service.isSupported).map((service) => service.id)
          })) || []
      );
    });

    if (!props.registerForm) {
      await dispatch(getVendorSupportedCategories()).then((res) => {
        setCatalogIds(res?.content?.catalogIds || []);
        if (res?.content?.catalogIds?.length && res?.content?.catalogIds?.length < categoriesNoService.length) {
          setIndeterminateCategory(true);
        } else {
          setIndeterminateCategory(false);
        }
      });
    }

    setLoading(false);
    setInitial(true);
  };

  useEffect(() => {
    fetchCategoryData();
    return () => {
      setCatalogIds([]);
      setLoading(false);
      setCategories([]);
      setCategoriesFilter(undefined);
    };
  }, []);

  const getServiceData = async (catalog: SettingCategoryResponse) => {
    setServiceLoading(true);
    setShowServiceList(true);

    setServiceBody((serviceBody) => {
      const service = serviceBody.find((item) => item.categoryId === catalog.id);

      if (service?.questionIds?.length && service?.questionIds?.length < catalog.services.length) {
        setIndeterminateService(true);
      } else {
        setIndeterminateService(false);
      }

      return serviceBody;
    });

    setCategoriesDetail(catalog);
    setServiceLoading(false);
  };

  const handleSelectCategory = (catalog: SettingCategoryResponse) => {
    getServiceData(catalog);
  };

  const handleCheckCategory = (catalog: SettingCategoryResponse) => {
    setDirty(true);
    if (catalog.id === -1) {
      // all category checked
      if (catalogIds.length >= categoriesNoService.length) {
        setCatalogIds([]);
      } else {
        setCatalogIds([...categoriesNoService.map((m) => m.id)]);
      }
      setIndeterminateCategory(false);
      return;
    }

    setCatalogIds((prev) => {
      let newCatalogIds = [...prev];
      if (prev.includes(catalog.id)) {
        newCatalogIds = prev.filter((item) => item !== catalog.id);
      } else {
        newCatalogIds = [...prev, catalog.id];
      }
      if (newCatalogIds.length && newCatalogIds.length < categoriesNoService.length) setIndeterminateCategory(true);
      else setIndeterminateCategory(false);
      return newCatalogIds;
    });
  };

  const handleCheckService = (service: SettingCategoryResponse) => {
    setDirty(true);
    const checkAllService = categoriesDetail?.services?.map((item) => item.id)?.every((id) => serviceIds.includes(id));

    if (service.id === -1) {
      // all service checked
      if (checkAllService) {
        setServiceIds((serviceIds) => serviceIds.filter((id) => !categoriesDetail?.services?.map((service) => service.id)?.includes(id)));
        setServiceBody((serviceBody: any) => {
          return serviceBody.map((item: any) => {
            if (item.categoryId === categoriesDetail?.id) {
              return {
                ...item,
                questionIds: []
              };
            }
            return item;
          });
        });
      } else {
        setServiceIds((serviceIds) => [...serviceIds, ...(categoriesDetail?.services?.map((service) => service.id) || [])]);
        setServiceBody((serviceBody: any) => {
          return serviceBody.map((item: any) => {
            if (item.categoryId === categoriesDetail?.id) {
              return {
                ...item,
                questionIds: categoriesDetail?.services?.map((service) => service.id) || []
              };
            }
            return item;
          });
        });
      }

      setIndeterminateService(false);
      return;
    }

    setServiceIds((prev) => {
      let newServiceIds = [...prev];
      if (prev.includes(service.id)) {
        newServiceIds = prev.filter((item) => item !== service.id);
      } else {
        newServiceIds = [...prev, service.id];
      }

      const allServiceIds = categoriesDetail?.services?.map((service) => service.id) || [];
      const currentServiceIds = newServiceIds.filter((id) => allServiceIds.includes(id)) || [];

      if (currentServiceIds.length && currentServiceIds.length < allServiceIds.length) setIndeterminateService(true);
      else setIndeterminateService(false);

      return newServiceIds;
    });

    setServiceBody((serviceBody: any) => {
      return serviceBody.map((item: any) => {
        if (item.categoryId === service.categoryId && item.questionIds.includes(service.id)) {
          return {
            ...item,
            questionIds: item.questionIds.filter((item) => item !== service.id)
          };
        } else if (item.categoryId === service.categoryId && !item.questionIds.includes(service.id)) {
          return {
            ...item,
            questionIds: [...item.questionIds, service.id]
          };
        }
        return item;
      });
    });
  };

  const onChange = (e) => {
    const value = e.target.value;
    setCategoriesFilter(
      categories.filter((item) => replaceVniToEng(item.name.toLowerCase()).includes(replaceVniToEng(value.toLowerCase())))
    );
  };

  const renderSkeleton = () => {
    return [...new Array(10)].map((_, index) => {
      return <Skeleton key={index} className=" pl-4 py-4 w-100" avatar paragraph={false} title={{ width: '100%' }} active />;
    });
  };

  const onFinish = ({ suggestCatalogs }) => {
    setLoading(true);

    const categoryWithService = serviceBody.filter((item: any) => item.questionIds.length).map((item: any) => item.categoryId);

    if (props.registerForm) {
      setDirty(false);
      props.setBodyRequest((bodyRequest) => ({
        ...bodyRequest,
        profile: {
          ...bodyRequest.profile,
          catalogIds: [...catalogIds, ...categoryWithService],
          questions: serviceBody.filter((item) => item.questionIds.length > 0)
        }
      }));
      props.setStep(6);
      setLoading(false);
    } else {
      dispatch(updateSettingCategory({ catalogIds: [...catalogIds, ...categoryWithService], suggestCatalogs }))
        .then(() => {
          return dispatch(updateSettingServices(serviceBody.filter((item) => item.questionIds.length > 0)));
        })
        .then(() => {
          setDirty(false);
          AMessage.success(t('update_setting_success'));
          setFlagSuccess(true);
          setTimeout(() => {
            setFlagSuccess(false);
          }, 10);
        })
        .catch((err) => AMessage.error(t(err.message)))
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <div className="row">
        <ServicesCheckListStyled className={`col-12 ${!props.registerForm ? 'col-lg-5 col-xl-4' : ''} d-flex flex-column gap-8 mb-10`}>
          <Prompt when={dirty} message={t('leave_confirm')} />
          <Input
            size="large"
            prefix={<SVG src={toAbsoluteUrl('/media/svg/icons/Tools/Search.svg')} />}
            placeholder={t('settings_service_search_placeholder')}
            onChange={onChange}
            allowClear
          />

          <div className="d-flex flex-column gap-4 px-2 check_list">
            {initial ? (
              <>
                {!categoriesFilter && (
                  <CategoryCheckItem
                    className="all_service_item"
                    key="all"
                    item={ITEM_ALL(t)}
                    iconCustom={
                      <span className="d-flex justify-content-center align-items-center icon_all_service">
                        <i className="fa fa-th-list" aria-hidden="true" />
                      </span>
                    }
                    indeterminateCategory={indeterminateCategory}
                    checked={!!catalogIds.length && !!categoriesNoService.length && catalogIds.length >= categoriesNoService.length}
                    handleCheckCategory={handleCheckCategory}
                  />
                )}
                {(categoriesFilter || categories).map((item) => (
                  <CategoryCheckItem
                    key={item.id}
                    item={item}
                    checked={catalogIds.includes(item.id)}
                    handleCheckCategory={handleCheckCategory}
                    handleSelectCategory={handleSelectCategory}
                    registerForm={props.registerForm}
                  />
                ))}
              </>
            ) : (
              renderSkeleton()
            )}
          </div>
        </ServicesCheckListStyled>

        <div className="col-1"></div>

        {showServiceList && (
          <ServicesCheckListStyled className={`col-12 ${!props.registerForm ? 'col-lg-5 col-xl-4' : ''} d-flex flex-column gap-8 mb-10`}>
            <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4} className="ml-2">
              {`${t('serviceSuggestList')} (${categoriesDetail?.name || ''})`}
            </ATypography>
            <div className="d-flex flex-column gap-4 px-2 check_list">
              {!serviceLoading ? (
                <>
                  <ServiceCheckItem
                    className="all_service_item"
                    key="all"
                    item={ITEM_ALL(t)}
                    iconCustom={
                      <span className="d-flex justify-content-center align-items-center icon_all_service">
                        <i className="fa fa-th-list" aria-hidden="true" />
                      </span>
                    }
                    indeterminateService={indeterminateService}
                    checked={categoriesDetail?.services?.map((service) => service.id)?.every((id) => serviceIds.includes(id)) || false}
                    handleCheckService={handleCheckService}
                  />
                  {(categoriesDetail?.services || []).map((item) => (
                    <ServiceCheckItem
                      key={item.id}
                      item={item}
                      checked={serviceIds.includes(item.id)}
                      handleCheckService={handleCheckService}
                      iconCustom={<></>}
                    />
                  ))}
                </>
              ) : (
                renderSkeleton()
              )}
            </div>
          </ServicesCheckListStyled>
        )}
      </div>

      <div className="row">
        <div className={`col-12 ${!props.registerForm ? 'col-lg-5 col-xl-4' : ''}`}>
          <ServiceOther form={form} onFinish={onFinish} flagSuccess={flagSuccess} setDirty={setDirty} registerForm={props.registerForm} />
          {(fullAccessPage || props.registerForm) && (
            <BasicBtn
              size="large"
              style={{ width: '100%', margin: 0 }}
              loading={loading}
              type="primary"
              icon={<SaveOutlined style={{ fontSize: 16 }} />}
              onClick={form.submit}
              title={t(props.registerForm ? 'next' : 'save')}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default connect((state: any) => ({
  getRoleBase: authSelectors.getRoleBase(state)
}))(ServiceCheckList);
