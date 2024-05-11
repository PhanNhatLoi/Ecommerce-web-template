import { useTranslation } from 'react-i18next';
import { BASE_URL_IMG } from '~/configs';
import { getAuthorizedUser } from '~/state/utils/session';
import AMessage from '~/views/presentation/ui/message/AMessage';

const FileUpload = (accept?: string[]) => {
  const { t }: any = useTranslation();

  const beforeUpload = (file) => {
    const isImage = file.type.includes('image');
    if (!isImage) {
      AMessage.error(t('errorImageOnly'));
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      AMessage.error(t('errorImage5MB'));
    }
    if (accept && accept.length > 0) {
      const isImageCorrectType = accept.includes(file.type);
      if (!isImageCorrectType) {
        AMessage.error(t('errorImageType'));
      }
      return isImage && isLt5M && isImageCorrectType;
    }
    return isImage && isLt5M;
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const fetchImage = (url) => {
    return fetch(BASE_URL_IMG + url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthorizedUser()}`,
        lang: 'en' // not care
      }
    }).then((response) => {
      if (response && response.status === 200)
        return response.blob().then((blob) => {
          return URL.createObjectURL(blob);
        });
      else return Promise.reject({ message: 'errorUploadAvatar' });
    });
  };

  return { beforeUpload, getBase64, fetchImage };
};

export default FileUpload;
