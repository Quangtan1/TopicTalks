/* eslint-disable no-restricted-globals */
const workercode = () => {
  self.onmessage = function (e) {
    const { id, access_token } = e.data;
    fetch(`http://localhost:5000/api/v1/friends/all/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        self.postMessage(res.data);
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
    const { id, access_token } = e.data;
    fetch(`http://localhost:5000/api/v1/notification/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        self.postMessage(res.data);
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
