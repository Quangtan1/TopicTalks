import { createAxios } from './createAxios';
import { getDataAPI } from './fetchData';

/* eslint-disable no-restricted-globals */
const workercode = () => {
  self.onmessage = function (e) {
    const { account, access_token, setAccount } = e.data;
    const axiosJWT = createAxios(account, setAccount);
    console.log(account);

    getDataAPI(`/friends/all/${account?.id}`, access_token, axiosJWT)
      .then((response) => response.json())
      .then((res) => {
        const serializedAccount = JSON.parse(JSON.stringify(res.data));
        self.postMessage(serializedAccount);
      })
      .catch((error) => {
        self.postMessage({ error: error.message });
      });
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], { type: 'application/javascript' });
export const worker_script = URL.createObjectURL(blob);

const notificationWorkerCode = () => {
  self.onmessage = function (e) {
    const { account, access_token, setAccount } = e.data;
    const axiosJWT = createAxios(account, setAccount);
    getDataAPI(`/notification/${account?.id}`, access_token, axiosJWT)
      .then((response) => response.json())
      .then((res) => {
        const serializedAccount = JSON.parse(JSON.stringify(res.data));
        self.postMessage(serializedAccount);
      })
      .catch((error) => {
        self.postMessage({ error: error.message });
      });
  };
};

let notificationCode = notificationWorkerCode.toString();
notificationCode = notificationCode.substring(notificationCode.indexOf('{') + 1, notificationCode.lastIndexOf('}'));

const notificationBlob = new Blob([notificationCode], {
  type: 'application/javascript',
});
export const notification_worker_script = URL.createObjectURL(notificationBlob);
