import { isObject, isString } from 'lodash-es';
import { PureComponent } from 'react';
import { API_CODE, TIME_MESSAGE_POPUP } from '~/configs';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { getString } from '~/views/utilities/helpers/utilObject';

export default class ServerError extends PureComponent {
  static getServerError(res) {
    if (`${res}` === 'TypeError: Failed to fetch') {
      return { message: API_CODE.SERVER_MAINTENANCE };
    }
    let errorCode = (getString(res, 'message') || '').replace(/\./g, '_');
    return {
      message: errorCode
    };
  }

  static getMessage(msg) {
    if (isString(msg)) {
      return msg;
    } else if (isObject(msg)) {
      return getString(msg, 'message');
    }
    return '';
  }
}

export function showToastError(msg, timePopUp = TIME_MESSAGE_POPUP, onClose) {
  AMessage.error(ServerError.getMessage(msg), timePopUp, onClose);
}
export const showToastSuccess = (msg, timePopUp = TIME_MESSAGE_POPUP, onClose) => {
  AMessage.success(ServerError.getMessage(msg), timePopUp, onClose);
};
