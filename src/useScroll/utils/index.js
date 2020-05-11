/**
 * Utils
 */

export const addEvent = (el, event, handler) => {
  if (!el) return;
  if (el.attachEvent) {
    el.attachEvent('on' + event, handler);
  } else if (el.addEventListener) {
    el.addEventListener(event, handler, false);
  } else {
    el['on' + event] = handler;
  }
};

export const removeEvent = (el, event, handler) => {
  if (!el) return;
  if (el.detachEvent) {
    el.detachEvent('on' + event, handler);
  } else if (el.removeEventListener) {
    el.removeEventListener(event, handler, false);
  } else {
    el['on' + event] = null;
  }
};

export const isIOS = (() => {
  const u = navigator.userAgent;
  // const app = navigator.appVersion;
  // const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // android终端或者uc浏览器
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
})();
