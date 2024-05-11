import React from 'react';
import { Row, Col, Form, Button } from 'antd/es';
import { useTranslation } from 'react-i18next';
import PromotionItem from '../components/PromotionItem';
import AButton from '~/views/presentation/ui/buttons/AButton';

type PromotionContactProps = {
  form: any;
  listName: any;
  needLoadData: boolean;
  setNeedLoadData: any;
  promotionDiscountType: string;
  allowEdit: boolean;
};

const PromotionContact: React.FC<PromotionContactProps> = (props) => {
  const { t }: any = useTranslation();

  return (
    <Row className="mb-10">
      <Col sm={24} md={24} lg={24}>
        <Form.List
          name="promotionContact"
          // initialValue={props?.data || []}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <div className="mt-5">
                    <PromotionItem //
                      data={undefined}
                      itemKey={key}
                      remove={remove}
                      name={name}
                      form={props.form}
                      listName={props.listName}
                      needLoadData={props.needLoadData}
                      setNeedLoadData={props.setNeedLoadData}
                      promotionDiscountType={props.promotionDiscountType}
                      allowEdit={props.allowEdit}
                    />
                  </div>
                );
              })}
              <Form.Item>
                <div className="p-5 col-12 col-lg-5">
                  <AButton //
                    type="primary"
                    disabled={!props.allowEdit}
                    onClick={add}
                    block>
                    {t('more_item')}
                  </AButton>
                </div>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Col>
    </Row>
  );
};

export default PromotionContact;
