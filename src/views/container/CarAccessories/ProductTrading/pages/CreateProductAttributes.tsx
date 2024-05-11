import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Form, Popconfirm, Row } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MInput } from '~/views/presentation/fields/input';
import LayoutForm from '~/views/presentation/layout/forForm';
import AButton from '~/views/presentation/ui/buttons/AButton';

interface CreateProductAttributesProps {
  isDisableAddAttribute?: Boolean;
  initValue: React.MutableRefObject<
    | {
        key?: String | undefined;
        name?: String | undefined;
        value?: String | undefined;
      }[]
    | undefined
  >;
}
const CreateProductAttributes: React.FC<CreateProductAttributesProps> = ({ isDisableAddAttribute, initValue }) => {
  const { t }: any = useTranslation();

  return (
    <Col>
      <LayoutForm
        data-aos="fade-right"
        data-aos-delay="300"
        title={t('setting_attribute_trading_product_title')}
        description={t('setting_attribute_trading_product_des')}>
        <Form.List name="attributes" initialValue={[]}>
          {(fields, { add, remove }) => (
            <>
              <Form.Item>
                <Row className="d-flex flex-column">
                  <Col>
                    <label className="p-0" style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: '2px' }}>
                      {t('attribute_name_label')}
                    </label>
                  </Col>
                  <Col style={{ width: 100 }} className="mb-5">
                    <AButton //
                      type="dashed"
                      onClick={() => add()}
                      disabled={!isDisableAddAttribute}
                      icon={<PlusOutlined />}
                    />
                  </Col>
                </Row>
              </Form.Item>

              {fields.map(({ key, name, fieldKey }, index) => {
                return (
                  <>
                    <Row className="mb-10">
                      <Col lg={11} md={11} sm={24} xs={24}>
                        <MInput //
                          labelAlign="left"
                          itemKey={key}
                          name={[name, 'name']}
                          fieldKey={[fieldKey, 'name']}
                          noPadding
                          require
                          allowClear={false}
                          customLayout="w-100"
                          label={index === 0 && t('attribute_name_for_trading_product_label')}
                          placeholder={t('attribute_name_for_trading_product_placeholder')}
                        />
                      </Col>
                      <Col lg={2} md={2} sm={24} xs={24} className="mb-4" />
                      <Col lg={11} md={11} sm={24} xs={24} className="d-flex justify-content-center">
                        <MInput //
                          allowClear={false}
                          labelAlign="left"
                          itemKey={key}
                          name={[name, 'value']}
                          fieldKey={[fieldKey, 'value']}
                          noPadding
                          require
                          customLayout="w-100"
                          controls={false}
                          label={index === 0 && t('attribute_value_for_trading_product_label')}
                          placeholder={t('attribute_value_for_trading_product_placeholder')}
                        />
                        <Popconfirm
                          className={`ml-2 ${index === 0 ? 'mt-14' : 'mt-1'} `}
                          placement="topRight"
                          title={t('confirm_delete')}
                          onConfirm={() => remove(name)}
                          okText={t('okTextConfirm')}
                          cancelText={t('cancelTextConfirm')}>
                          <AButton icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Col>
                    </Row>
                  </>
                );
              })}
            </>
          )}
        </Form.List>
      </LayoutForm>
    </Col>
  );
};

export default CreateProductAttributes;
