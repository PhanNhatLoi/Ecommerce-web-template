import { Empty, Form, Radio, Skeleton, Space } from 'antd/es';
import { isArray } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import COLOR from '~/color';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { DEFAULT_AVATAR } from '~/configs/default';
import { templatesActions } from '~/state/ducks/templates';
import AButton from '~/views/presentation/ui/buttons/AButton';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate } from '~/views/utilities/ant-validation';
import { parseCurrency } from '~/views/utilities/helpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';

function SkeletonPackageRadio() {
  return (
    <div className="d-flex">
      <Skeleton loading paragraph={{ width: 236 }} className="mr-3" />
      <Skeleton loading paragraph={{ width: 236 }} className="mr-3" />
      <Skeleton loading paragraph={{ width: 236 }} className="mr-3" />
    </div>
  );
}

const RadioCardStyled = styled.div`
  .ant-radio-wrapper-checked {
    box-shadow: 0 0.1rem 1rem 0.25rem rgb(0 0 0 / 5%) !important;
    border: 2px solid ${COLOR['primary-color']};
  }
`;

const WrapRadioStyled = styled.div`
  width: 236px;
  height: 142px;
  background: url(${(props) => (props.background ? props.background : 'unset')});
  background-size: cover;
  border-radius: 8px;

  .mask_image {
    width: 236px;
    height: 142px;
    border-radius: 8px;
    left: 0;
    top: 0;
    background-color: rgba(255, 255, 255, 0.89);
    filter: brightness(1.25) contrast(1.1);
  }
`;
const RadioStyled = styled(Radio)`
  width: 236px;
  height: 142px;
  border-radius: 8px;
  border: 1px dashed;
  padding-top: 8px;
  :hover {
    box-shadow: 0 0.1rem 1rem 0.25rem rgb(0 0 0 / 5%) !important;
  }
  transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -webkit-transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -moz-transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -ms-transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -o-transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
`;

function RadioCard(props) {
  const { t } = useTranslation();
  const history = useHistory();
  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  const [isFetched, setIsFetched] = useState(false);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    props
      .getTemplates({ page: 0, size: 9999 })
      .then((res) => {
        setPackages(res?.data?.content || []);
        setIsFetched(true);
      })
      .catch((err) => {
        setIsFetched(true);
        console.error(`ithoangtan -  ~ file: RadioCard.js ~ line 49 ~ props.getTemplates ~ err`, err);
      });
  }, []);

  return (
    <RadioCardStyled className={props.customLayout ? props.customLayout : 'col-12'}>
      {props.copyBtn || <></>}
      <Form.Item label={props.label || 'RadioCard'} name={props.name || 'RadioCard'} {...props} rules={rules}>
        <Radio.Group optionType="button" size="large">
          <Space direction={props.direction} wrap size={12}>
            {!isFetched && <SkeletonPackageRadio />}
            {isFetched && isArray(packages) && packages.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Chưa có sản phẩm nào trong hệ thống.'}>
                <AButton type="primary" onClick={() => history.push('/')}>
                  Tạo gói sản phẩm
                </AButton>
              </Empty>
            )}
            {isFetched &&
              isArray(packages) &&
              packages.map((o, i) => (
                <WrapRadioStyled background={o?.image ? firstImage(o?.image) : DEFAULT_AVATAR} className="position-relative">
                  <div className="mask_image position-absolute"></div>
                  <RadioStyled
                    value={o.code}
                    className={`d-flex flex-column justify-content-center align-items-center text-center cbp_radio_style position-relative`}>
                    {/* <div style={{ left: 0, top: 0 }} className="position-absolute">
                    <Image
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                      preview={false}
                      src={o?.image ? firstImage(o?.image) : DEFAULT_AVATAR}
                      width={236}
                      height={142}
                    />
                  </div> */}

                    <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} style={{ minHeight: 44 }} ellipsis={{ rows: 2 }} className="mt-2">
                      {o.name}
                    </ATypography>
                    <div>
                      {t('card_release_usage_value')}
                      <ATypography strong>{parseCurrency(o.balance)}</ATypography>
                    </div>
                    <div>
                      {t('card_release_price')} <ATypography strong>{parseCurrency(o.sellPrice)}</ATypography>
                    </div>
                  </RadioStyled>
                </WrapRadioStyled>
              ))}
          </Space>
        </Radio.Group>
      </Form.Item>
    </RadioCardStyled>
  );
}
export default connect(null, {
  getTemplates: templatesActions.getTemplates
})(RadioCard);
