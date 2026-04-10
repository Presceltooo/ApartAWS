import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css';
import 'dayjs/locale/vi';
import App from './App.tsx'

import { StyleProvider, px2remTransformer } from '@ant-design/cssinjs';
import antdDefaultConfig from '@configs/antDesign';
import { App as AntdApp, ConfigProvider as AntdConfigProvider } from 'antd';
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from '@configs/reactQuery';

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import './assets/scss/index.scss';
// import ErrorBoundary from '@/shared/components/error-boundary/ErrorBoundary.tsx';
// import { Detector } from 'react-detect-offline';
// import { 
//   OfflineNotification, 
//   OnlineNotification 
// } from '@/shared/components/online-offline';

const PX_2_REM = px2remTransformer({ rootValue: 10 });
// const SHOW_DETECTOR_INTERNET = false;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AntdConfigProvider {...antdDefaultConfig}>
        <AntdApp>
          <StyleProvider transformers={[PX_2_REM]}>
            {/* <ErrorBoundary> */}
              <App />
            {/* </ErrorBoundary> */}
          </StyleProvider>
        </AntdApp>
      </AntdConfigProvider>
    </QueryClientProvider>
    {/*
      SHOW_DETECTOR_INTERNET &&
      <Detector
        polling={false}
        render={({ online }) => {
          return online 
            ? <OnlineNotification online={online} /> 
            : <OfflineNotification />;
        }}
      />
    */}
  </StrictMode>,
)
