import { PlusOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import { useTranslation } from 'react-i18next';
import AButton from '~/views/presentation/ui/buttons/AButton';

import QuotationItem from './QuotationItem';

const QuotationList = (props) => {
  const { t } = useTranslation();
  return (
    <Form.List name="items">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, fieldKey, ...restField }) => {
            return (
              <QuotationItem //
                itemKey={key}
                setCurrentItemKey={props.setCurrentItemKey}
                setPricingSystemShow={props.setPricingSystemShow}
                remove={remove}
                form={props.form}
                name={name}
                fieldKey={fieldKey}
                itemKeyFlag={props.itemKeyFlag}
              />
            );
          })}
          <Form.Item>
            <AButton //
              type="dashed"
              disabled={props.moreItemDisabled}
              onClick={() => add()}
              block
              icon={<PlusOutlined />}>
              {t('more_item')}
            </AButton>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default QuotationList;
