import { DollarOutlined } from '@ant-design/icons';
import { Form, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import { USED_CAR_TRADING_STATUS } from '~/configs/status/used-car-trading/usedCarTradingStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { carTradingActions } from '~/state/ducks/usedCarTrading/carTrading';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import { BackBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { Card, CardBody, CardFooter, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { formatPhoneNumberToVn } from '~/views/utilities/helpers/string';

import { UsedCarTradingListResponseType } from '../../Types';
import PostInfo from '../components/PostInfo';
import SellerInfo from '../components/SellerInfo';
import VehicleInfo from '../components/VehicleInfo';
import RevaluationModal from '../Modals/RevaluationModal';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

const ABtnStyled = styled(AButton)`
  .anticon {
    display: inline-flex !important;
    align-items: center !important;
  }
`;

type InfoFormType = {
  getCarTradingDetail: any;
  createCarTrading: any;
  updateCarTrading: any;
  getAuthUser: any;
};

const InfoFormProps: React.FC<InfoFormType> = (props) => {
  const { t }: any = useTranslation();
  const params = useParams<any>();
  const history = useHistory();
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRevaluationModal, setShowRevaluationModal] = useState(false);
  const [description, setDescription] = useState<any>();
  const [images, setImages] = useState<any[]>([]);
  const [video, setVideo] = useState<any[]>([]);
  const [vehicleInfoId, setVehicleInfoId] = useState<number>();
  const [addressNeedLoad, setAddressNeedLoad] = useState<any>(null);
  const user = props.getAuthUser;
  const [onlyView, setOnlyView] = useState<boolean>(false);

  // get detail
  useEffect(() => {
    if (params.id) {
      //init value
      setLoading(true);
      props
        .getCarTradingDetail(params.id)
        .then((res: { content: UsedCarTradingListResponseType }) => {
          const response = res?.content;
          setOnlyView(response.status === USED_CAR_TRADING_STATUS.SOLD);
          const images = response?.vehicleInfo?.media?.filter((media: any) => media?.type === 'IMAGE') || [];
          const video = response?.vehicleInfo?.media?.filter((media: any) => media?.type === 'VIDEO') || [];
          form.setFieldsValue({
            title: response?.title,
            description: response?.description,
            price: response?.price,
            name: response?.profileInfoCache?.name,
            phone: response?.profileInfoCache?.phone,
            code: response?.profileInfoCache?.phoneCode.toString(),
            // // address
            country1: response?.profileInfoCache?.countryId,
            address1: response?.profileInfoCache?.address,
            state: response?.profileInfoCache?.stateId,
            zipCode: response?.profileInfoCache?.zipCode,
            province: response?.profileInfoCache?.provinceId,
            district: response?.profileInfoCache?.districtId,
            ward: response?.profileInfoCache?.wardsId,
            // // vehicle
            brandId: response?.vehicleInfo?.brandId,
            modelId: response?.vehicleInfo?.modelId,
            producingYear: response?.vehicleInfo?.producingYear,
            gearboxTypeId: response?.vehicleInfo?.gearboxTypeId,
            fuelTypeId: response?.vehicleInfo?.fuelTypeId,
            seat: response?.vehicleInfo?.seat,
            bodyTypeId: response?.vehicleInfo?.bodyTypeId,
            colorId: response?.vehicleInfo?.colorId,
            travelledDistance: response?.vehicleInfo?.travelledDistance,
            license: response?.vehicleInfo?.license,
            // // media
            images: images,
            video: video
          });

          setDescription(response?.description);
          setVehicleInfoId(response.vehicleInfoId);
          setImages(images?.map((media: any) => media?.url));
          setVideo(video);
          setAddressNeedLoad({
            country: response?.profileInfoCache?.countryId,
            state: response?.profileInfoCache?.stateId,
            province: response?.profileInfoCache?.provinceId,
            district: response?.profileInfoCache?.districtId,
            ward: response?.profileInfoCache?.wardsId
          });
        })
        .catch((err: any) => {
          console.error(`file: FormInfo.js ~ line 129 ~ useEffect ~ err`, err);
        })
        .finally(() => {
          setDirty(false);
          setLoading(false);
        });
    } else {
      form.setFieldsValue({
        //phone
        phone: user?.phone,
        code: user?.country.phone,
        // // // address
        country1: user?.address?.countryId,
        address1: user?.address?.address,
        state: user?.address?.stateId,
        zipCode: user?.address?.zipCode,
        province: user?.address?.provinceId,
        district: user?.address?.districtId,
        ward: user?.address?.wardsId
      });
      setAddressNeedLoad({
        country: user?.address?.countryId,
        state: user?.address?.stateId,
        province: user?.address?.provinceId,
        district: user?.address?.districtId,
        ward: user?.address?.wardsId
      });
    }
    // eslint-disable-next-line
  }, []);

  const onFinish = (values: any) => {
    setIsSubmitting(true);

    const body = {
      title: values?.title,
      description: values?.description,
      price: values?.price,
      profileId: user?.id,
      profileInfoCache: {
        name: user?.fullName,
        avatar: user?.avatar,
        phone: formatPhoneNumberToVn(values?.phone)?.label,
        phoneCode: values?.code?.toString(),
        address: values?.address1,
        countryId: values?.country1,
        stateId: values?.state,
        zipCode: values?.zipCode,
        provinceId: values?.province,
        districtId: values?.district,
        wardsId: values?.ward,
        fullAddress: values?.addressInfo?.filter(Boolean)?.join(', ')
      },
      vehicleInfo: {
        id: vehicleInfoId,
        brandId: values?.brandId,
        modelId: values?.modelId,
        producingYear: values?.producingYear,
        gearboxTypeId: values?.gearboxTypeId,
        fuelTypeId: values?.fuelTypeId,
        seat: values?.seat,
        bodyTypeId: values?.bodyTypeId,
        colorId: values.colorId, //change api
        travelledDistance: values?.travelledDistance,
        license: values?.license,
        media: values?.images?.concat(values?.video)?.filter(Boolean)
      }
    };

    if (params.id) {
      props
        .updateCarTrading({ id: +params.id, ...body })
        .then(() => {
          setDirty(false);
          history.push(PATH.USED_CAR_TRADING_LIST_PATH);
          AMessage.success(t('updateUsedCarTradingSuccess'));
          setIsSubmitting(false);
        })
        .catch(() => {
          AMessage.error(t('updateUsedCarTradingFailed'));
          setIsSubmitting(false);
        });
    } else {
      props
        .createCarTrading(body)
        .then(() => {
          setDirty(false);
          history.push(PATH.USED_CAR_TRADING_LIST_PATH);
          AMessage.success(t('createUsedCarTradingSuccess'));
          setIsSubmitting(false);
        })
        .catch(() => {
          AMessage.error(t('createUsedCarTradingFailed'));
          setIsSubmitting(false);
        });
    }
  };

  const handleOnValuesChange = () => {
    setDirty(true);
  };

  return (
    <HOC>
      <WrapStyleForm>
        <Skeleton loading={loading} active>
          <Card>
            <CardHeader
              titleHeader={params.id ? t('updatePostCarForSale') : t('createPostCarForSale')}
              btn={
                <div>
                  <BackBtn onClick={() => history.push(PATH.USED_CAR_TRADING_LIST_PATH)} />
                  {!onlyView && <SubmitBtn loading={isSubmitting} onClick={() => form.submit()} />}
                  <ABtnStyled
                    type="primary"
                    className="m-2"
                    size="large"
                    disabled // disabled cho tới khi làm chức năng này
                    icon={<DollarOutlined />}
                    onClick={() => {
                      setShowRevaluationModal(true);
                    }}>
                    {t('revaluation')}
                  </ABtnStyled>
                </div>
              }></CardHeader>
            <CardBody>
              <Form {...ANT_FORM_SEP_LABEL_LAYOUT} form={form} name={'create'} onValuesChange={handleOnValuesChange} onFinish={onFinish}>
                <Prompt when={dirty} message={t('leave_confirm')} />

                <PostInfo form={form} allowEdit={!onlyView} loading={false} description={description} />

                <Divider />

                <SellerInfo
                  form={form}
                  allowEdit={!onlyView}
                  loading={false}
                  needLoadData={addressNeedLoad}
                  setNeedLoadData={setAddressNeedLoad}
                />

                <Divider />

                <VehicleInfo form={form} allowEdit={!onlyView} loading={false} images={images} video={video} />
              </Form>
            </CardBody>
            <CardFooter className="p-4">
              <div className="d-flex flex-wrap justify-content-center align-item-center">
                <BackBtn onClick={() => history.push(PATH.USED_CAR_TRADING_LIST_PATH)} />
                {!onlyView && <SubmitBtn loading={isSubmitting} onClick={() => form.submit()} />}
                <ABtnStyled
                  type="primary"
                  className="m-2"
                  size="large"
                  disabled // disabled cho tới khi làm chức năng này
                  icon={<DollarOutlined />}
                  onClick={() => {
                    setShowRevaluationModal(true);
                  }}>
                  {t('revaluation')}
                </ABtnStyled>
              </div>
            </CardFooter>
          </Card>
        </Skeleton>
        <RevaluationModal modalShow={showRevaluationModal} setModalShow={setShowRevaluationModal} />
      </WrapStyleForm>
    </HOC>
  );
};

export default connect(
  (state: any) => ({
    getAuthUser: authSelectors.getAuthUser(state)
  }),
  {
    getCarTradingDetail: carTradingActions.getCarTradingDetail,
    createCarTrading: carTradingActions.createCarTrading,
    updateCarTrading: carTradingActions.updateCarTrading
  }
)(InfoFormProps);
