import type { SiteThemeMode } from '@/types/home/site-settings';

export const THEME_STORAGE_KEY = 'akhila-theme';

export function getThemeBootstrapScript(defaultTheme: SiteThemeMode) {
  const safeDefault = JSON.stringify(defaultTheme);
  const safeKey = JSON.stringify(THEME_STORAGE_KEY);

  return `(function(){try{var k=${safeKey};var d=${safeDefault};var t=null;try{t=localStorage.getItem(k);}catch(e){}if(t!=='light'&&t!=='dark'&&t!=='system'){t=d;}var r=t;if(t==='system'){r=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(r!=='light'&&r!=='dark'){r='dark';}document.documentElement.setAttribute('data-theme',r);document.documentElement.style.colorScheme=r;}catch(e){document.documentElement.setAttribute('data-theme','dark');document.documentElement.style.colorScheme='dark';}})();`;
}
