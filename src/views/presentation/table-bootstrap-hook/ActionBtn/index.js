import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  EditOutlined,
  HistoryOutlined,
  PrinterOutlined,
  SaveOutlined
} from '@ant-design/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import AButton from '~/views/presentation/ui/buttons/AButton';

const ABtnStyled = styled(AButton)`
  .anticon {
    display: inline-flex !important;
    align-items: center !important;
  }
`;

const ApproveBtnStyled = styled(AButton)`
  background: #52c41a !important;
  color: white;

  .anticon {
    display: inline-flex !important;
    align-items: center !important;
  }
`;

const DeclineBtnStyled = styled(AButton)`
  background: #f5222d !important;
  color: white;

  .anticon {
    display: inline-flex !important;
    align-items: center !important;
  }
`;

export function SaveAndPrintBtn(props) {
  const { t } = useTranslation();
  return (
    <>
      <ABtnStyled
        className="m-2"
        icon={<PrinterOutlined />}
        style={{ width: t('save_and_print').length * 10 + 56 }}
        loading={props.loading}
        type="primary"
        htmlType={props.htmlType || 'submit'}
        size="large"
        disabled={props.disabled}
        onClick={props.onClick}>
        {t(props.label) || t('save_and_print')}
      </ABtnStyled>
    </>
  );
}

export function SubmitBtn(props) {
  const { t } = useTranslation();
  return (
    <>
      <ABtnStyled
        className="m-2"
        icon={<SaveOutlined />}
        style={{ width: t('save').length * 10 + 56 }}
        loading={props.loading}
        type="primary"
        htmlType="submit"
        size="large"
        disabled={props.disabled}
        onClick={props.onClick}>
        {t('save')}
      </ABtnStyled>
    </>
  );
}

export function CancelBtn(props) {
  const { t } = useTranslation();
  return (
    <>
      <ABtnStyled
        className="m-2"
        icon={<CloseOutlined />}
        style={{ width: t('cancel').length * 10 + 56 }}
        type="dashed"
        size="large"
        onClick={props.onClick}>
        {t('cancel')}
      </ABtnStyled>
    </>
  );
}

export function ResetBtn(props) {
  const { t } = useTranslation();
  return (
    <>
      <ABtnStyled
        className="m-2"
        icon={<HistoryOutlined />}
        style={{ width: t('retype').length * 10 + 56 }}
        type="ghost"
        size="large"
        disabled={props.disabled}
        onClick={props.onClick}>
        {t('retype')}
      </ABtnStyled>
    </>
  );
}

export function BackBtn(props) {
  const { t } = useTranslation();
  return (
    <>
      <ABtnStyled
        className="m-2"
        icon={<ArrowLeftOutlined />}
        style={{ width: t('back').length * 10 + 56 }}
        type="dashed"
        size="large"
        onClick={props.onClick}>
        {t('back')}
      </ABtnStyled>
    </>
  );
}

export function PrevBtn(props) {
  const { t } = useTranslation();
  return (
    <>
      <ABtnStyled className="m-2 btn-secondary" icon={<ArrowLeftOutlined />} type="dashed" size="large" onClick={props.onClick}>
        {props.label ? props.label : t('back')}
      </ABtnStyled>
    </>
  );
}

export function NextBtn(props) {
  const { t } = useTranslation();
  return (
    <>
      <ABtnStyled
        className="m-2"
        icon={<ArrowRightOutlined />}
        type="primary"
        size="large"
        htmlType={props.htmlType}
        onClick={props.onClick}>
        {props.label ? props.label : t('next')}
      </ABtnStyled>
    </>
  );
}

export function ApproveBtn(props) {
  const { t } = useTranslation();
  return (
    <>
      <ApproveBtnStyled className="mr-2" icon={<CheckCircleOutlined />} size="large" onClick={props.onClick}>
        {props.label ? props.label : t('approve')}
      </ApproveBtnStyled>
    </>
  );
}

export function DeclineBtn(props) {
  const { t } = useTranslation();
  return (
    <>
      <DeclineBtnStyled className="m-2 btn-secondary" icon={<CloseCircleOutlined />} size="large" onClick={props.onClick}>
        {props.label ? props.label : t('decline')}
      </DeclineBtnStyled>
    </>
  );
}

export function EditBtn(props) {
  const { t } = useTranslation();
  return (
    <>
      <ABtnStyled
        className="m-2"
        icon={<EditOutlined />}
        style={{ width: t('edit').length * 10 + 56 }}
        loading={props.loading}
        type="primary"
        size="large"
        onClick={props.onClick}>
        {t('edit')}
      </ABtnStyled>
    </>
  );
}
