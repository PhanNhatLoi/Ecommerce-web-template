import React from 'react';
import { Result } from 'antd/es';
import { ToolOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const ProductAddPage = () => {
  const { t } = useTranslation();
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '70vh' }}>
      <Result title={t('under_development')} icon={<ToolOutlined />} />
    </div>
  );
};

export default ProductAddPage;
