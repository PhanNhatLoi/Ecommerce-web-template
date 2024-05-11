import { Form } from 'antd/es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { ACCEPT_ASPECT_ID_CARD } from '~/configs/upload';
import { appDataAction } from '~/state/ducks/appData';
import MAddressCascader from '~/views/presentation/fields/AddressCascader';
import MRadioCard from '~/views/presentation/fields/Advanced/RadioCard';
import MCheckbox from '~/views/presentation/fields/Checkbox';
import MDatePicker from '~/views/presentation/fields/DatePicker';
import { MInput, MInputNumber, MTextArea } from '~/views/presentation/fields/input';
import MPasswordInput from '~/views/presentation/fields/PasswordInput';
import MRadio from '~/views/presentation/fields/Radio';
import MRangePicker from '~/views/presentation/fields/RangePicker';
import MSelect from '~/views/presentation/fields/Select';
import MTags from '~/views/presentation/fields/Tags';
import MTimePicker from '~/views/presentation/fields/TimePicker';
import MTransferTable from '~/views/presentation/fields/TransferTable';
import { MUpload, MUploadCardIDCrop, MUploadDragger, MUploadImageCrop } from '~/views/presentation/fields/upload';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { Card, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { toAbsoluteUrl } from '~/views/utilities/helpers/metronic';

import MCKEditor from './input/MyCKEditor';

function FieldsAllAntDesign(props) {
  const { t } = useTranslation();
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
  };
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    AMessage.success(`copied to clipboard`);
  };

  const CopyBtn = (props) => {
    return (
      <AButton
        className="right-0 mr-3"
        onClick={() => copyToClipboard(props.copyText)}
        icon={
          <span className="svg-icon svg-icon-info svg-icon-sm">
            <SVG src={toAbsoluteUrl('/media/svg/icons/Files/Selected-file.svg')} width={32} height={32} />
          </span>
        }
      />
    );
  };

  const onFinish = (values) => {
    // console.log(`file: index.js ~ line 58 ~ onFinish ~ values`, values);
  };

  // for MUploadImageCrop
  const onImageChange = (fileList) => {
    form.setFieldsValue({ UploadImageCrop: fileList });
  };
  const onImageChangeIDCardFront = (filePath) => {
    form.setFieldsValue({ UploadCardIdCropFront: filePath });
  };
  const onImageChangeIDCardBack = (filePath) => {
    form.setFieldsValue({ UploadCardIdCropBack: filePath });
  };
  const onChangeEditor = (filePath) => {
    form.setFieldsValue({ MCKEditor: filePath });
  };
  // for MUploadImageCrop

  const onTransferChange = (targets) => {
    form.setFieldsValue({ MTransferTable: targets });
  };

  const onChangeTags = (tags) => {
    form.setFieldsValue({ MTags: tags });
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader titleHeader={'Input'}></CardHeader>
        <CardBody>
          <Form
            // form={form}
            onFinish={onFinish}
            {...layout}
            initialValues={{
              name: 'asa',
              inputNumber: 0,
              dropdownSelect: 'jack',
              radioSelect: 1,
              timePicker: moment('00:00:00', 'HH:mm:ss')
            }}>
            <div className="row">
              {/* Done */}
              <MInput
                label={t('normal')}
                placeholder={t('normal_placeholder')}
                name="basicInput"
                copyBtn={<CopyBtn copyText={` <MInput label={t('key')} placeholder={t('keyPlaceholder')} name="basicInput" />`} />}
              />

              {/* Done */}
              <MInput
                label={t('phone')}
                placeholder={t('phone_placeholder')}
                name="phoneInput"
                type="phone"
                require={false}
                copyBtn={
                  <CopyBtn
                    copyText={` <MInput label={t('key')} placeholder={t('keyPlaceholder')} name="phoneInput" type="phone" require={false} />`}
                  />
                }
              />

              {/* Done */}
              <MInput
                label={t('email')}
                placeholder={t('email_placeholder')}
                name="emailInput"
                type="email"
                copyBtn={
                  <CopyBtn copyText={` <MInput label={t('key')} placeholder={t('keyPlaceholder')} name="emailInput" type="email" />`} />
                }
              />

              <MTextArea
                label={t('normal')}
                placeholder={t('normal_placeholder')}
                name="basicTextArea"
                copyBtn={<CopyBtn copyText={` <MTextArea label={t('key')} placeholder={t('keyPlaceholder')} name="basicInput" />`} />}
              />

              {/* Done */}
              <MPasswordInput
                label="Password Input"
                name="passwordInput"
                copyBtn={
                  <CopyBtn copyText={`<MPasswordInput name="passwordInput" label={t('key')} placeholder={t('keyPlaceholder')} />`} />
                }
              />

              {/* Done */}
              <MInput
                label={t('Read Only')}
                placeholder={t('Read Only_placeholder')}
                name="readOnlyInput"
                readOnly
                require={false}
                copyBtn={
                  <CopyBtn
                    copyText={`<MInput label={t('key')} placeholder={t('keyPlaceholder')} name="readOnlyInput" readOnly require={false} />`}
                  />
                }
              />

              {/* Done */}
              <MInputNumber
                label={t('Number')}
                placeholder={t('Number_placeholder')}
                require={true}
                copyBtn={<CopyBtn copyText={`<MInputNumber label={t('key')} placeholder={t('keyPlaceholder')} require={true} />`} />}
              />

              {/* Done */}
              <MSelect
                name="fetchDataSelect"
                label={t('Select')}
                placeholder={t('Select_placeholder')}
                fetchData={props.getProvinces}
                searchCorrectly={false}
                valueProperty="id"
                labelProperty="name"
                copyBtn={
                  <CopyBtn
                    copyText={`<MSelect name="fetchDataSelect" label={t('key')} placeholder={t('keyPlaceholder')} fetchData={props.getProvinces} searchCorrectly={false} valueProperty="id" labelProperty="name" />`}
                  />
                }
              />

              {/* Done */}
              <MRadio
                label={t('Radio')}
                placeholder={t('Radio_placeholder')}
                name="radioSelect"
                direction="vertical"
                options={[
                  { value: 1, label: 1 },
                  { value: 2, label: 2 }
                ]}
                copyBtn={
                  <CopyBtn
                    copyText={`  <MRadio label={t('key')} placeholder={t('keyPlaceholder')} name="radioSelect" direction="vertical" options={[ { value: 1, label: 1 }, { value: 2, label: 2 } ]} />`}
                  />
                }
              />

              {/* Done */}
              <MCheckbox
                label={t('Checkbox')}
                placeholder={t('Checkbox_placeholder')}
                name="checkboxSelect"
                options={[
                  { value: 1, label: 1 },
                  { value: 2, label: 1 }
                ]}
                style={{ width: '100%' }}
                copyBtn={
                  <CopyBtn
                    copyText={` <MCheckbox label={t('key')} placeholder={t('keyPlaceholder')} name="checkboxSelect" options={[ { value: 1, label: 1 }, { value: 2, label: 1 } ]} style={{ width: '100%' }} />`}
                  />
                }
              />

              {/* Done */}
              <MTimePicker
                label={t('key')}
                placeholder={t('keyPlaceholder')}
                copyBtn={<CopyBtn copyText={`<MTimePicker  label={t('key')} placeholder={t('keyPlaceholder')} />`} />}
              />

              {/* Done */}
              <MDatePicker
                label={t('key')}
                placeholder={t('keyPlaceholder')}
                copyBtn={<CopyBtn copyText={`<MDatePicker  label={t('key')} placeholder={t('keyPlaceholder')} />`} />}
              />

              <MRangePicker
                label={t('key')}
                placeholder={t('keyPlaceholder')}
                copyBtn={<CopyBtn copyText={`<MRangePicker  label={t('key')} placeholder={t('keyPlaceholder')} />`} />}
              />

              <MAddressCascader copyBtn={<CopyBtn copyText={`<MAddressCascader />`} />} />
            </div>
            <Form.Item>
              <AButton type="primary" htmlType="submit">
                Submit
              </AButton>
            </Form.Item>
          </Form>
        </CardBody>
      </Card>
      <Card>
        <CardHeader titleHeader={'Upload'}></CardHeader>
        <CardBody>
          <Form form={form} {...layout} onFinish={onFinish}>
            <div className="row">
              <MUpload copyBtn={<CopyBtn copyText={`<MUpload />`} />} />

              <MUploadDragger copyBtn={<CopyBtn copyText={`<MUploadDragger />`} />} />

              <MUploadImageCrop
                onImageChange={onImageChange}
                name="UploadImageCrop"
                label="UploadImageCrop"
                maximumUpload={2}
                aspect={16 / 9}
                copyBtn={
                  <CopyBtn
                    copyText={`const onImageChange = (fileList) => { form.setFieldsValue({ UploadImageCrop: fileList }); };
                    <MUploadImageCrop onImageChange={onImageChange} name="UploadImageCrop" />`}
                  />
                }
              />
              <div className="row col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <MUploadCardIDCrop
                  onImageChange={onImageChangeIDCardFront}
                  name="UploadCardIdCropFront"
                  labelF="UploadCardIdCropFront"
                  maximumUpload={1}
                  oneLine
                  aspect={ACCEPT_ASPECT_ID_CARD}
                  copyBtn={
                    <CopyBtn
                      copyText={`const onImageChangeIDCardFront = (fileList) => { form.setFieldsValue({ UploadCardIdCropFront: fileList }); };
                    <MUploadCardIDCrop onImageChange={onImageChange} name="UploadCardIdCropFront" />`}
                    />
                  }
                />
                <MUploadCardIDCrop
                  onImageChange={onImageChangeIDCardBack}
                  name="UploadCardIdCropBack"
                  label="UploadCardIdCropBack"
                  maximumUpload={1}
                  oneLine
                  aspect={ACCEPT_ASPECT_ID_CARD}
                  copyBtn={
                    <CopyBtn
                      copyText={`const onImageChangeIDCardBack = (fileList) => { form.setFieldsValue({ UploadCardIdCropBack: fileList }); };
                    <MUploadCardIDCrop onImageChange={onImageChange} name="UploadCardIdCropBack" />`}
                    />
                  }
                />
              </div>
            </div>
            <Form.Item>
              <AButton type="primary" htmlType="submit">
                Submit
              </AButton>
            </Form.Item>
          </Form>
        </CardBody>
      </Card>
      <Card>
        <CardHeader titleHeader={'Transfer table'}></CardHeader>
        <CardBody>
          <Form form={form} {...layout} onFinish={onFinish}>
            <div className="row">
              <MTransferTable
                onTransferChange={onTransferChange}
                name="MTransferTable"
                fetchData={props.getProvinces}
                filterName="name"
                columns={[
                  { dataIndex: 'id', title: 'id' },
                  { dataIndex: 'name', title: 'name' }
                ]}
                keyName="id"
                copyBtn={
                  <CopyBtn
                    copyText={`   const onTransferChange = (targets) => {
                      form.setFieldsValue({ MTransferTable: targets });
                    };
                <MTransferTable
                  onTransferChange={onTransferChange}
                  name="MTransferTable"
                  label={t('key')}
                  fetchData={props.getProvinces}
                  filterName="name"
                  columns={[
                    { dataIndex: 'id', title: 'id' },
                    { dataIndex: 'name', title: 'name' }
                  ]}
                  keyName="id"
                />`}
                  />
                }
              />
            </div>
            <Form.Item>
              <AButton type="primary" htmlType="submit">
                Submit
              </AButton>
            </Form.Item>
          </Form>
        </CardBody>
      </Card>
      <Card>
        <CardHeader titleHeader={'Transfer table'}></CardHeader>
        <CardBody>
          <Form form={form} {...layout} onFinish={onFinish}>
            <div className="row">
              <MRadioCard
                label={t('Radio Card')}
                placeholder={t('Radio_placeholder')}
                name="radioCard"
                direction="vertical"
                options={[
                  { value: 1, label: 1 },
                  { value: 2, label: 2 }
                ]}
                copyBtn={
                  <CopyBtn
                    copyText={`  <MRadioCard label={t('key')} placeholder={t('keyPlaceholder')} name="radioSelect" direction="vertical" options={[ { value: 1, label: 1 }, { value: 2, label: 2 } ]} />`}
                  />
                }
              />
            </div>
            <Form.Item>
              <AButton type="primary" htmlType="submit">
                Submit
              </AButton>
            </Form.Item>
          </Form>
        </CardBody>
      </Card>{' '}
      <Card>
        <CardHeader titleHeader={'Transfer table'}></CardHeader>
        <CardBody>
          <Form form={form} {...layout} onFinish={onFinish}>
            <div className="row">
              <MCKEditor
                label={t('MCKEditor')}
                placeholder={t('MCKEditor')}
                name="MCKEditor"
                onChange={onChangeEditor}
                copyBtn={
                  <CopyBtn
                    copyText={`
                
            const onChangeEditor = (content) => {
              form.setFieldsValue({ MCKEditor: content });
            };
                  <MCKEditor
                label={t('MCKEditor')}
                placeholder={t('MCKEditor')}
                name="MCKEditor"
                onChange={onChangeEditor}
              /> `}
                  />
                }
              />
              <MTags
                onChangeTags={onChangeTags}
                loading={loading}
                value={'1as,1212'}
                label={t('MTags')}
                placeholder={t('MTags')}
                name="MTags"
                copyBtn={
                  <CopyBtn
                    copyText={`
                    const onChangeTags = (tags) => {
                      form.setFieldsValue({ MTags: tags });
                    };
                    <MTags
                      onChangeTags={onChangeTags}
                      loading={loading}
                      value={'1as,1212'}
                      label={t('MTags')}
                      placeholder={t('MTags')}
                      name="MTags"`}
                  />
                }
              />
            </div>
            <Form.Item>
              <AButton type="primary" htmlType="submit">
                Submit
              </AButton>
            </Form.Item>
          </Form>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default connect(null, {
  getProvinces: appDataAction.getProvinces,
  getDistricts: appDataAction.getDistricts,
  getWards: appDataAction.getWards
})(FieldsAllAntDesign);
