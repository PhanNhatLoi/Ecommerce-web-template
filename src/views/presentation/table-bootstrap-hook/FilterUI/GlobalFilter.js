import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import AButton from '~/views/presentation/ui/buttons/AButton';
import COLOR from '~/views/utilities/layout/color';

const ButtonStyled = styled.span`
  border-right: 1px solid #e0e0e0;
  .ant-btn {
    height: 26px !important;
  }
`;

const FilterWrapStyled = styled.div`
  @media (max-width: 1024px) {
    max-width: 1000px;
    overflow-x: scroll;
    margin-bottom: 16px;
  }
  @media (max-width: 1440px) {
    margin-bottom: 16px;
  }
`;

export const COLOR_STATUS = {
  DEFAULT: COLOR.blue02,
  APPROVED: COLOR.blue02,
  SUCCESSED: COLOR.blue02,
  REPAIRED: COLOR.blue02,
  IN_PROCCESS: COLOR.Yellow2,
  FIXING: COLOR.Yellow2,
  REPAIRING: COLOR.Yellow2,
  WAITING_CONFIRMATION: COLOR.Yellow2,
  WAITING_FOR_APPROVAL: COLOR.Yellow2,
  FAILED: COLOR.Red2,
  CANCELED: COLOR.Red2,
  REJECTED: COLOR.Red2,
  FAILURE: COLOR.Red2
};

function GlobalFilter(props) {
  const { t } = useTranslation();

  const FilterBtn = (props) => {
    let colorText = COLOR_STATUS.DEFAULT;

    if (props.paramValue) {
      colorText = COLOR_STATUS[props.paramValue.toString().toUpperCase()] || COLOR_STATUS.DEFAULT;
    }
    return (
      <AButton
        type="link"
        className={props.className}
        style={{ color: props.color || colorText }}
        onClick={() => {
          props.getData({ ...props.currentQueries, [props.paramKey]: props.paramValue, page: 0 }, 'statistic');
        }}>
        {props.label}
      </AButton>
    );
  };

  return (
    <FilterWrapStyled className="d-flex align-items-center">
      {(props.fields || []).map((f, i) => {
        if (i !== props.fields.length - 1) {
          return (
            <ButtonStyled>
              <FilterBtn
                className={`${i === 0 && 'pl-0'} py-0`}
                getData={props.getData}
                color={props.fields?.length === 1 && '#000'}
                paramKey={f.key}
                paramValue={f.value}
                currentQueries={props.currentQueries}
                label={t(f.label)}
              />
            </ButtonStyled>
          );
        } else
          return (
            <FilterBtn //
              className="py-0"
              getData={props.getData}
              paramKey={f.key}
              paramValue={f.value}
              currentQueries={props.currentQueries}
              label={t(f.label)}
            />
          );
      })}
    </FilterWrapStyled>
  );
}
export default GlobalFilter;
