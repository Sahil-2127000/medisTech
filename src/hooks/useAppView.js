import { useEffect, useState } from 'react';

// True on phone/tablet widths or when running inside the Capacitor native app.
// Pages use it to render their app-style screens instead of the website layout.
const QUERY = '(max-width: 1023px)';

export const isNativeApp = () => !!window.Capacitor?.isNativePlatform?.();

export const isAppViewNow = () => isNativeApp() || window.matchMedia(QUERY).matches;

const useAppView = () => {
  const [appView, setAppView] = useState(isAppViewNow);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setAppView(isAppViewNow());
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return appView;
};

export default useAppView;
