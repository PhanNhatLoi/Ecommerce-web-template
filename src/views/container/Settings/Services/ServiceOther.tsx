import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { actionForPage } from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { MInput } from '~/views/presentation/fields/input';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';

import CategoryCheckItem from './CategoryCheckItem';
import COLOR from '~/views/utilities/layout/color';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { BasicBtn } from '~/views/presentation/ui/buttons';

const ServiceOtherStyled = styled.div`
  margin: 6px 0;
  .ant-input-group-addon {
    padding-right: 0;
    border: none;
  }
`;

type ServiceOtherProps = {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
  flagSuccess: boolean;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
  registerForm?: boolean;
  getRoleBase: any;
};

const ServiceOther: React.FC<ServiceOtherProps> = ({ form, onFinish, flagSuccess, setDirty, getRoleBase, registerForm }) => {
  const { t }: any = useTranslation();

  const [suggestCatalogs, setSuggestCatalogs] = useState<string[]>([]);
  const location: any = useLocation();
  const fullAccessPage = actionForPage(location.pathname, getRoleBase);

  const handleAddSuggestCatalog = () => {
    setDirty(true);
    const newSuggest = form.getFieldValue('suggestCatalog');
    if (!newSuggest) return;

    setSuggestCatalogs((prev) => [...new Set([...prev, newSuggest])]);

    form.setFieldsValue({ suggestCatalog: '' });
  };

  useEffect(() => {
    if (flagSuccess) setSuggestCatalogs([]);
  }, [flagSuccess]);

  return (
    <ServiceOtherStyled>
      <Form //
        {...ANT_FORM_SEP_LABEL_LAYOUT}
        scrollToFirstError={{
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
          scrollMode: 'always'
        }}
        requiredMark={false}
        form={form}
        onFinish={() => onFinish({ suggestCatalogs: suggestCatalogs })}>
        {!registerForm && (
          <MInput //
            name="suggestCatalog"
            extra={t('settings_service_suggest_more_information')}
            noLabel
            size="large"
            require={false}
            hasFeedback={false}
            placeholder={t('settings_service_other_placeholder')}
            inputProps={{
              addonAfter: fullAccessPage && (
                <BasicBtn
                  style={{ height: '35px', margin: 0 }}
                  type="primary"
                  onClick={handleAddSuggestCatalog}
                  icon={<PlusOutlined />}
                  title={t('submit_suggestion')}
                />
              )
            }}
          />
        )}
      </Form>
      {suggestCatalogs.map((suggest) => (
        <CategoryCheckItem
          noAction
          key={suggest}
          item={
            {
              id: suggest,
              name: suggest
            } as any
          }
          checked={true}
          handleCheckCategory={() => {}}
        />
      ))}
    </ServiceOtherStyled>
  );
};

export default connect((state: any) => ({
  getRoleBase: authSelectors.getRoleBase(state)
}))(ServiceOther);
