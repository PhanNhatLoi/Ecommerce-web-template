import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Tag, Tooltip } from 'antd/es';
import { isArray, isString } from 'lodash-es';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { commonValidate } from '~/views/utilities/ant-validation';

const WrapTagStyled = styled.div`
  .site-tag-plus {
    background: #fff;
    border-style: dashed;
  }
`;

const MTags = (props) => {
  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  const [tags, setTags] = useState(['Unremovable', 'Tag 2', 'Tag 3']);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleClose = (removedTag) => {
    setTags(tags.filter((tag) => tag !== removedTag));
    props.onChangeTags && props.onChangeTags(tags.filter((tag) => tag !== removedTag));
  };

  const refInput = useRef(null);

  useEffect(() => {
    inputVisible && refInput.current.focus();
  }, [inputVisible]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
      props.onChangeTags && props.onChangeTags([...tags, inputValue]);
    }
    setInputValue('');
    setInputVisible(false);
  };

  // for load api data
  useEffect(() => {
    if (isArray(props.value)) {
      setTags(props.value);
    }
    if (isString(props.value)) {
      setTags(props.value.split(','));
    }
  }, [props.value.length]);

  return (
    <>
      <WrapTagStyled
        className={
          (props.noPadding ? 'px-0  ' : '') +
          (props.noLabel
            ? props.hasLayoutForm
              ? 'col-12 col-sm-12 col-md-12 col-lg-12 col-xl-10'
              : 'col-12'
            : props.oneLine
            ? 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'
            : props.customLayout
            ? props.customLayout
            : props.hasLayoutForm
            ? 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-5'
            : 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6')
        }>
        {props.copyBtn && props.copyBtn}
        <Form.Item label={props?.label} name={props.name || 'MTags '} rules={rules} extra={props.extra} {...props}>
          {!props.loading &&
            tags.map((tag) => {
              const isLongTag = tag.length > 20;

              const tagElem = (
                <Tag className="m-1" key={tag} closable={true} onClose={() => handleClose(tag)}>
                  <span>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</span>
                </Tag>
              );
              return isLongTag ? (
                <Tooltip title={tag} key={tag}>
                  {tagElem}
                </Tooltip>
              ) : (
                tagElem
              );
            })}
          {inputVisible && (
            <Input
              ref={refInput}
              type="text"
              size="small"
              className="tag-input"
              style={{ maxWidth: 150 }}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag className="site-tag-plus" onClick={() => setInputVisible(true)}>
              <PlusOutlined /> New Tag
            </Tag>
          )}
          {props.loading && <LoadingOutlined />}
        </Form.Item>
      </WrapTagStyled>
    </>
  );
};

export default MTags;
