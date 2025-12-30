import { BrowserInfo } from '../types';

export const getBrowserInfo = (): BrowserInfo => {
  const ua = navigator.userAgent;
  let tem;
  let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {
      name: 'IE',
      version: tem[1] || '',
      os: getOS(ua),
      userAgent: ua,
      isModern: false
    };
  }
  
  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null) {
      return {
        name: tem[1].replace('OPR', 'Opera'),
        version: tem[2],
        os: getOS(ua),
        userAgent: ua,
        isModern: parseInt(tem[2], 10) > 80 // Arbitrary cutoff for "modern"
      };
    }
  }
  
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  
  const version = M[1];
  const majorVersion = parseInt(version, 10);
  const name = M[0];

  // Heuristic for "Modern"
  let isModern = true;
  if (name === 'Chrome' && majorVersion < 90) isModern = false;
  if (name === 'Firefox' && majorVersion < 90) isModern = false;
  if (name === 'Safari' && majorVersion < 14) isModern = false;
  if (name === 'IE' || name === 'MSIE') isModern = false;

  return {
    name,
    version,
    os: getOS(ua),
    userAgent: ua,
    isModern
  };
};

const getOS = (ua: string): string => {
  if (ua.indexOf("Win") !== -1) return "Windows";
  if (ua.indexOf("Mac") !== -1) return "MacOS";
  if (ua.indexOf("X11") !== -1) return "UNIX";
  if (ua.indexOf("Linux") !== -1) return "Linux";
  if (ua.indexOf("Android") !== -1) return "Android";
  if (ua.indexOf("like Mac") !== -1) return "iOS";
  return "Unknown OS";
};