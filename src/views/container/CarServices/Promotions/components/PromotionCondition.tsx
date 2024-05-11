import { Col } from 'antd/es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CONDITION } from '~/configs';
import { PROMOTION_SERVICE_CONDITION_TYPE } from '~/configs/status/car-services/promotionServiceStatus';
import { MInputNumber, MTextArea } from '~/views/presentation/fields/input';
import MRadio from '~/views/presentation/fields/Radio';
import MSelect from '~/views/presentation/fields/Select';

type PromotionConditionProps = {
  form: any;
  name: number;
  allowEdit: boolean;
  currentType: string;
};

const PromotionCondition: React.FC<PromotionConditionProps> = (props) => {
  const { t }: any = useTranslation();
  const [isCondition, setIsCondition] = useState(
    props.form.getFieldValue(['promotionSetting', props.name, `isCondition${props.currentType}`]) || CONDITION.NO
  );
  const [conditionType, setConditionType] = useState(
    props.form.getFieldValue(['promotionSetting', props.name, `conditionType${props.currentType}`]) || ''
  );

  return (
    <>
      <Col span={24}>
        <MRadio
          name={[props.name, `isCondition${props.currentType}`]}
          label={t('promotionCondition')}
          noLabel
          noPadding
          labelAlign="left"
          labelCol
          wrapperCol={{ offset: 1 }}
          colon={true}
          require={false}
          disabled={!props.allowEdit}
          defaultValue={CONDITION.NO}
          options={Object.keys(CONDITION).map((o) => {
            return {
              value: CONDITION[o],
              search: t(CONDITION[o]),
              label: t(CONDITION[o])
            };
          })}
          onChange={(e: any) => {
            setIsCondition(e.target.value);
          }}
        />
      </Col>

      {isCondition === CONDITION.YES && (
        <>
          <Col span={24} md={11}>
            <MSelect
              name={[props.name, `conditionType${props.currentType}`]}
              noLabel
              noPadding
              require={true}
              label={t('conditionType')}
              placeholder={t('conditionType')}
              disabled={!props.allowEdit}
              searchCorrectly={false}
              options={Object.keys(PROMOTION_SERVICE_CONDITION_TYPE).map((o) => {
                return {
                  value: PROMOTION_SERVICE_CONDITION_TYPE[o],
                  search: t(PROMOTION_SERVICE_CONDITION_TYPE[o]),
                  label: t(PROMOTION_SERVICE_CONDITION_TYPE[o])
                };
              })}
              onChange={(value: string) => {
                setConditionType(value);
              }}
            />
          </Col>

          {conditionType === PROMOTION_SERVICE_CONDITION_TYPE.ORDER_VALUE && (
            <>
              <Col span={24} md={2}></Col>

              <Col span={24} md={11}>
                <MInputNumber
                  name={[props.name, `stringValue${props.currentType}`]}
                  noLabel
                  noPadding
                  require
                  hasFeedback={false}
                  controls={false}
                  disabled={!props.allowEdit}
                  label={`${t('orderPriceFrom')} (đ)`}
                  placeholder={t('orderPriceFrom')}
                />
              </Col>

              <Col span={24}>
                <MTextArea
                  name={[props.name, `description${props.currentType}`]}
                  rows={4}
                  maxLength={null}
                  customLayout="w-100"
                  require
                  disabled={!props.allowEdit}
                  label={t('Promotion')}
                  placeholder={t('Promotion')}
                />
              </Col>
            </>
          )}

          {conditionType === PROMOTION_SERVICE_CONDITION_TYPE.OTHER && (
            <>
              <Col span={24}>
                <MTextArea
                  name={[props.name, `stringValue${props.currentType}`]}
                  rows={4}
                  maxLength={null}
                  customLayout="w-100"
                  require={false}
                  readOnly={!props.allowEdit}
                  label={t('condition')}
                  placeholder={t('condition')}
                />
              </Col>

              <Col span={24}>
                <MTextArea
                  name={[props.name, `description${props.currentType}`]}
                  rows={4}
                  maxLength={null}
                  customLayout="w-100"
                  require={false}
                  readOnly={!props.allowEdit}
                  label={t('Promotion')}
                  placeholder={t('Promotion')}
                />
              </Col>
            </>
          )}
        </>
      )}
    </>
  );
};

export default PromotionCondition;
