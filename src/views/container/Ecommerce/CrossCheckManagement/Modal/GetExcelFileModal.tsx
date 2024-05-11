import { InboxOutlined } from '@ant-design/icons';
import { Form, Upload } from 'antd/es';
import { head } from 'lodash-es';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import XLSX from 'xlsx/dist/xlsx.mini.min.js';
import { importHeaders } from '~/configs/const';
import { crossCheckActions } from '~/state/ducks/cross-check';
import Divider from '~/views/presentation/divider';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AntModal from '~/views/presentation/ui/modal/AntModal';

const FILE_ACCEPT = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

const ConfirmProductSpecificationModal = (props) => {
  const { t }: any = useTranslation();
  const [data, setData] = useState<any>([]);
  const dataTemplate = {
    orderCode: '',
    shippingCode: '',
    total: '',
    discount: '',
    shippingFee: ''
  };

  const handleImport = async ({ fileList }) => {
    const file = head(fileList);
    const reader = new FileReader();

    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt?.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert to JSON */
      const jsonData = XLSX.utils.sheet_to_json(ws);
      /* Change key name */
      const transformedData = jsonData.map((item: any) => {
        const newItem = {};
        Object.keys(item).forEach((key, index) => {
          newItem[importHeaders[index]] = item[key];
        });
        return newItem;
      });
      processExcelData(transformedData);
    };
    if (file?.status === 'uploading') {
      const originalFile = file.originFileObj;
      reader.readAsBinaryString(originalFile);
    }
    file.status = 'done';
  };

  const processExcelData = (data) => {
    if (data.length > 0) {
      const results = data.map((row) => {
        let element = {};
        Object.keys(dataTemplate).forEach((key) => {
          element[key] = row[key].toString();
        });
        return element;
      });
      setData(results);
    } else {
      setData([]);
      AMessage.error(t('wrong_file_format'));
    }
  };

  const beforeUpload = (file) => {
    const isCorrectType = FILE_ACCEPT.includes(file.type);
    if (!isCorrectType) {
      AMessage.error(t('errorFileType'));
    }
    return isCorrectType || Upload.LIST_IGNORE;
  };

  const createData = (file) => {
    if (file.length > 0) {
      props
        .createCrossCheck(file)
        .then((res) => {
          props.setModalShow(false);
          props.setNeedLoadNewData(true);
          AMessage.success(t('successfully_read_file'));
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      AMessage.error(t('wrong_file_format'));
    }
  };

  return (
    <AntModal
      title={t('import_csv')}
      description={t('')}
      width={1000}
      modalShow={props.modalShow}
      destroyOnClose
      onCancel={() => props.setModalShow(false)}>
      <Form.Item name="uploadCSV">
        <Upload.Dragger accept={FILE_ACCEPT.join(', ')} name="csvFile" onChange={handleImport} maxCount={1} beforeUpload={beforeUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{t('uploadText')}</p>
          <p className="ant-upload-hint">{t('uploadHint')}</p>
        </Upload.Dragger>
        <Divider />
        <AButton
          style={{ verticalAlign: 'middle', minWidth: '200px' }}
          className="px-5"
          size="large"
          // disabled={submitDisabled}
          onClick={() => {
            createData(data);
          }}
          type="primary">
          {t('confirm_select')}
        </AButton>
      </Form.Item>
    </AntModal>
  );
};

export default connect(null, {
  createCrossCheck: crossCheckActions.createCrossCheck
})(ConfirmProductSpecificationModal);
