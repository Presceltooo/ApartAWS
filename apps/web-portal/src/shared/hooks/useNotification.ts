import { App } from 'antd'
export const useNotification = () => {
  const { notification } = App.useApp();

  const showSuccessNotify = (msg: string) => {
    notification.success({ message: msg });
  }
  const showErrorNotify = (msg: string) => {
    notification.error({ message: msg });
  }
  return {
    showSuccessNotify,
    showErrorNotify
  }
}
export default useNotification;