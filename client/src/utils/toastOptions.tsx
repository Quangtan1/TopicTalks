import { ToastOptions, toast } from 'react-toastify';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { AiFillWarning, AiFillInfoCircle } from 'react-icons/ai';

export const ToastSuccess = (message: string) => {
  toast.success(message, success);
};

export const ToastError = (message: string) => {
  toast.error(message, warning);
};

export const ToastInfo = (message: string) => {
  toast.info(message, info);
};

const success: ToastOptions = {
  icon: <IoCheckmarkCircleOutline color={'rgb(135, 44, 228)'} fontSize={24} />,
};

const warning: ToastOptions = {
  icon: <AiFillWarning color={'rgb(135, 44, 228)'} fontSize={24} />,
};

const info: ToastOptions = {
  icon: <AiFillInfoCircle color={'rgb(135, 44, 228)'} fontSize={24} />,
};
