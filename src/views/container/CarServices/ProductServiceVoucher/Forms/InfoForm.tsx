import { Form } from 'antd/es';
import { findIndex } from 'lodash-es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { serviceVoucherActions } from '~/state/ducks/carServices/voucher';
import HOC from '~/views/container/HOC';
import { BackBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';

import ProductServiceInfo from '../components/ProductServiceInfo';
import VoucherInfo from '../components/VoucherInfo';
import VoucherLanguage from '../components/VoucherLanguage';
import AMessage from '~/views/presentation/ui/message/AMessage';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

type InfoFormType = { locale: any; voucherProps: any; applyVoucher: any; onSubmitForm: () => void; onCancel: () => void };

const InfoFormProps: React.FC<InfoFormType> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();

  const { voucherProps, onSubmitForm = () => {} } = props;
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [description, setDescription] = useState('');
  const [fileIcon, setFileIcon] = useState('');

  const [productServiceList, setProductServiceList] = useState<any>([]);
  const [productServiceIds, setProductServiceIds] = useState<string[]>([]);
  const [selectedProductService, setSelectedProductService] = useState<any>([]);
  const checkAllProductServiceWatch = Form.useWatch('checkAll', form) || [false];
  const [acceptProductServiceFlag, setAcceptProductServiceFlag] = useState('');

  // --------------------------------
  // FOR TABLE LANGUAGE SHOW
  // --------------------------------
  const [loadingChangeLang, setLoadingChangeLang] = useState(false);
  const [translationFake, setTranslationFake] = useState([
    { key: 1, langCode: 'en', name: 'English', description: 'English', moreInfo: '', closable: false },
    { key: 2, langCode: 'vi', name: 'Tiếng Việt', description: 'Tiếng Việt', moreInfo: '', closable: false } // data for key desc => animation
  ]);
  const [currLangCode, setCurrLangCode] = useState(props.locale || 'en');
  const [dataMultiLang, setDataMultiLang] = useState(translationFake);
  // --------------------------------
  // FOR TABLE LANGUAGE SHOW
  // --------------------------------

  // get voucher detail
  useEffect(() => {
    // eslint-disable-next-line
    if (voucherProps && Object.keys(voucherProps).length > 0) {
      form.setFieldsValue({
        ...voucherProps,
        startDate: moment(voucherProps.startDate),
        expireDate: moment(voucherProps.expireDate)
      });
      const defaultSelect = JSON.parse(voucherProps.pricingSystemCaches)?.map((item) => {
        return {
          id: +item?.id,
          image: item?.image,
          name: item?.name,
          salePrice: item?.salePrice
        };
      });
      setSelectedProductService(defaultSelect || []);
      setFileIcon(voucherProps.image);
    }
  }, [voucherProps]);

  const onFinish = () => {
    if (checkAllProductServiceWatch[0] || (selectedProductService && selectedProductService.length > 0)) {
      setIsSubmitting(true);

      const pricingSystem = checkAllProductServiceWatch[0]
        ? productServiceList.map((p: any) => {
            return { id: p?.id, image: p?.image, name: p?.name, salePrice: p?.salePrice };
          })
        : selectedProductService;

      const body = {
        voucherId: voucherProps.id,
        pricingSystemCaches: pricingSystem,
        pricingSystemIds: pricingSystem.map((m) => m.id)
      };

      props
        .applyVoucher({ ...body })
        .then(() => {
          setTimeout(() => {
            onSubmitForm();
          }, 700);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      AMessage.error(t('pleaseSelectProductService'));
    }
  };

  // --------------------------------------
  // CHANGE TRANSLATES WHEN INPUT CHANGE
  // --------------------------------------
  const handleChangeLocalize = (value: any, input: any) => {
    const newDataMulti = Array.from(dataMultiLang);
    const indexLang = findIndex(dataMultiLang, (lang) => lang.langCode === currLangCode);
    if (indexLang > -1) {
      newDataMulti[indexLang] = {
        ...newDataMulti[indexLang],
        [input]: value
      };
      // if (input === 'moreInfo') {
      //   let value = e?.target?.value ? e?.target?.value : e;
      //   newDataMulti[indexLang] = {
      //     ...newDataMulti[indexLang],
      //     moreInfo: ''
      //   };
      // }
      setDataMultiLang(newDataMulti);
    }
  };
  // --------------------------------------
  // CHANGE TRANSLATES WHEN INPUT CHANGE
  // --------------------------------------

  return (
    <HOC>
      <WrapStyleForm>
        <Form {...ANT_FORM_SEP_LABEL_LAYOUT} form={form} name={'create'} onFinish={onFinish}>
          <div className="row">
            <div className="col-12 col-md-6">
              {/* <VoucherLanguage
                form={form}
                setLoadingChangeLang={setLoadingChangeLang}
                dataMultiLang={dataMultiLang}
                setDataMultiLang={setDataMultiLang}
                currLangCode={currLangCode}
                setCurrLangCode={setCurrLangCode}
                translationFake={translationFake}
                setDescription={setDescription}
              /> */}

              <VoucherInfo
                form={form}
                loading={loading}
                allowEditing={false}
                loadingChangeLang={loadingChangeLang}
                fileIcon={fileIcon}
                setFileIcon={setFileIcon}
                handleChangeLocalize={handleChangeLocalize}
              />
            </div>

            <div className="col-12 col-md-1"></div>

            <div className="col-12 col-md-5">
              <ProductServiceInfo
                form={form}
                productServiceList={productServiceList}
                setProductServiceList={setProductServiceList}
                productServiceIds={productServiceIds}
                setProductServiceIds={setProductServiceIds}
                selectedProductService={selectedProductService}
                setSelectedProductService={setSelectedProductService}
                checkAllProductServiceWatch={checkAllProductServiceWatch}
                allowEditing={true}
                acceptProductServiceFlag={acceptProductServiceFlag}
                setLoading={setLoading}
              />
            </div>
          </div>
        </Form>

        <div className="d-flex flex-wrap justify-content-center align-item-center">
          <BackBtn onClick={props.onCancel} />
          <SubmitBtn loading={isSubmitting} onClick={() => form.submit()} />
        </div>
      </WrapStyleForm>
    </HOC>
  );
};

export default connect(
  (state: any) => ({
    locale: state['appData']?.locale
  }),
  {
    applyVoucher: serviceVoucherActions.applyVoucher
  }
)(InfoFormProps);
