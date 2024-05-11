import { Cascader, Form } from 'antd/es';
import React from 'react';
import SVG from 'react-inlinesvg';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { toAbsoluteUrl } from '~/views/utilities/helpers/metronic';

function MCascader(props) {
  // cascader options
  const cascaderOptions = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [
            {
              value: 'xihu',
              label: 'West Lake'
            }
          ]
        }
      ]
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: 'Zhong Hua Men'
            }
          ]
        }
      ]
    }
  ];
  // cascader options

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    AMessage.success(`copied to clipboard`);
  };

  return (
    <div
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
      <AButton
        className="right-0 mr-3"
        onClick={() =>
          copyToClipboard(`
        <Form.Item label={'Cascader Select'} name="cascaderSelect"> <Cascader options={cascaderOptions} onChange={() => {}} placeholder="Please select" /> </Form.Item>
      `)
        }
        icon={
          <span className="svg-icon svg-icon-info svg-icon-sm">
            <SVG src={toAbsoluteUrl('/media/svg/icons/Files/Selected-file.svg')} width={32} height={32} />
          </span>
        }></AButton>
      <Form.Item label={'Cascader Select'} name="cascaderSelect">
        <Cascader options={cascaderOptions} onChange={() => {}} placeholder="Please select" />
      </Form.Item>
    </div>
  );
}
export default MCascader;
