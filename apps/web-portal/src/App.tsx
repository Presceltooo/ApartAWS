import { 
  useLayoutEffect 
} from 'react';
// import { MIN_DEVICE_WIDTH } from "@/constants"
// import { getZoomRatio } from '@utils/getZoomRatio';
import { RouterProvider } from '@tanstack/react-router'
import router from '@/Route';

function App() {
  //Auto zoom to fit the screen
  useLayoutEffect(() => {
    // if (window.screen.width < MIN_DEVICE_WIDTH) {
    //   const zoom = getZoomRatio();
    //   document.documentElement.style.setProperty('--zoom', zoom.toString());
    // }
  }, []);

  return (
    <RouterProvider router={router} />
  )
}

export default App
