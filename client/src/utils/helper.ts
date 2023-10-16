import dayjs from 'dayjs';
import { ToastError } from './toastOptions';

export const APIKeyGPT = `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`;

export const DateFormatDisplayMinute = 'MM/DD/YYYY hh:mm A';

export const RE_CAPTCHA_SITE_KEY = '6LfQ3KUoAAAAAKy7R5K2DCfMEwYQy8_Qso9c5q37';

export const formatDate = (value: string, format: string = 'MM/DD/YYYY') => {
  if (!value) return '';

  return dayjs(value).format(format);
};

export const formatYear = (value: string, format: string = 'YYYY') => {
  if (!value) return '';

  return dayjs(value).format(format);
};

export const formatDateTime = (value: string, format: string = DateFormatDisplayMinute) => {
  if (!value) return '';
  return dayjs(value).format(format);
};

const isImage = ['png', 'jpg', 'svg', 'webp'];

export const handleImageUpload = (image, setImageUrl, isPost: boolean) => {
  console.log('11111');
  const data = new FormData();
  for (let i = 0; i < image.length; i++) {
    const fileExtension = image[i].name.split('.').pop().toLowerCase();
    if (isImage.includes(`${fileExtension}`)) {
      data.append('file', image[i]);
      data.append('upload_preset', `${isPost ? 'topicchildandpost' : 'topictalk_message_image'}`);
      data.append('cloud_name', 'tantqdev');
      fetch('https://api.cloudinary.com/v1_1/tantqdev/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setImageUrl(data?.url);
          console.log('data', data?.url);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setImageUrl('err');
      ToastError(`Invalid file extension: ${fileExtension}`);
    }
  }
};
