import { message } from 'antd/es';

const AMessage = {
  config: (config) => {
    message.config(config);
  },
  success: (content, duration?, onClose?) => {
    message.success(content, duration, onClose);
  },
  error: (content, duration?, onClose?) => {
    message.error(content, duration, onClose);
  },
  warning: (content, duration?, onClose?) => {
    message.warning(content, duration, onClose);
  }
};

export default AMessage;
