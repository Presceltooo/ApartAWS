import { App } from 'antd'
export const useNotification = () => {
  const { notification } = App.useApp();

  const showSuccessNotify = (msg: string, description?: string) => {
    notification.success({ message: msg, description });
  }
  const showErrorNotify = (msg: string, description?: string) => {
    notification.error({ message: msg, description });
  }
  const showInfoNotify = (msg: string, description?: string) => {
    notification.info({ message: msg, description });
  }
  return {
    showSuccessNotify,
    showErrorNotify,
    showInfoNotify,
  }
}
export default useNotification;