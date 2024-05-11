import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Button, Form } from 'antd/es';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'react-use';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

// const SearchStyled = styled(Input.Search)`
//change style input search
const SearchStyled = styled(Input)`
  .ant-input-affix-wrapper {
    border: 1px solid #000;
  }
`;

const SearchWrapStyled = styled.div`
  max-width: 300px;
  background: var(--gray-colors-white, #fff);
  border-radius: 8px;
  background: var(--gray-colors-white, #fff);
  .ant-input-search > .ant-input-group > .ant-input-group-addon:last-child .ant-input-search-button:not(.ant-btn-primary) {
    border: 1px solid #000 !important;
    background: #000 !important;
    color: #fff !important;
  }
  .ant-btn .anticon {
    position: relative;
    top: -3px;
  }
  .ant-btn-primary[disabled] {
    border-color: #000;
  }

  .ant-input-affix-wrapper {
    border: 1px solid #e2e2e2;
  }

  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    border: 1px solid var(--brand-colors-primary, #116acc);
    background: rgba(11, 44, 58, 0.1);
  }
`;

export function TableBootstrapUIFilter(props) {
  const { t } = useTranslation();
  const [findDisabled, setFindDisabled] = useState(true);
  const [form] = Form.useForm();
  const [value, setValue] = useState(undefined);

  const [, cancel] = useDebounce(
    () => {
      if (value !== undefined) {
        props.getData({
          ...props.currentQueries,
          [getKeyWord()]: value,
          page: 0
        });
        props.setCurrentQueries({
          ...props.currentQueries,
          [getKeyWord()]: value
        });
      }
    },
    props.delay ? props.delay : 500,
    [value]
  );

  const getKeyWord = () => {
    return props.mock ? 'search' : props.searchKeyWord ? props.searchKeyWord : 'keyword';
  };
  // TODO use debounce at here to onChange

  // handle search
  const handleSearch = (e) => {
    setValue(e.target?.value ? e.target?.value : (typeof e !== 'object' && e) || '');
  };

  return (
    <>
      <Form
        form={form}
        onChange={(changedFields) => {
          setFindDisabled(!form.getFieldValue('searchText'));
        }}>
        <Form.Item name="searchText" className="form-group m-0 mb-md-3 mb-lg-0">
          <SearchWrapStyled>
            <SearchStyled
              // prefix={<SearchOutlined />}
              // suffix={<AudioOutlined />}
              prefix={<SVG src={toAbsoluteUrl('/media/svg/icons/Tools/Search.svg')} />}
              allowClear
              // enterButton={
              //   <AButton disabled={findDisabled} type="primary"content={t('find')}/>
              // }
              name="searchText"
              placeholder={props.placeholder || t('search')}
              // change method search
              onChange={(e) => {
                handleSearch(e);
              }}

              // onSearch={(e) => {
              //   props.getData({
              //     ...props.currentQueries,
              //     [getKeyWord()]: e.target?.value ? e.target?.value : e,
              //     page: 0
              //   });
              //   props.setCurrentQueries({
              //     ...props.currentQueries,
              //     [getKeyWord()]: e.target?.value ? e.target?.value : e
              //   });
              // }}
            />
          </SearchWrapStyled>
        </Form.Item>
      </Form>
    </>
  );
}
