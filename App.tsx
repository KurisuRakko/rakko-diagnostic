import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BrowserInfo, DiagnosticItem, DiagnosticStage } from './types';
import { getBrowserInfo } from './utils/browserHelper';
import { LoadingIcon, WarningIcon, SuccessIcon, ErrorIcon, NetworkIcon, SystemIcon } from './components/Icon';
import { translations, Language } from './locales';
import { Globe } from 'lucide-react';

// Mock URLs for simulation if real fetch fails due to CORS/Adblock in dev environment
// In a real production app, these would be real endpoints or a /api/ping proxy.
const PING_TIMEOUT = 3000;

const App: React.FC = () => {
  const [stage, setStage] = useState<DiagnosticStage>(DiagnosticStage.INITIALIZING);
  const [dots, setDots] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [showDetail, setShowDetail] = useState(true);
  const [lang, setLang] = useState<Language>('zh');
  
  // Define our checks (labels are now derived from lang in render)
  const [checks, setChecks] = useState<DiagnosticItem[]>([
    { id: 'google', label: '', status: 'pending' },
    { id: 'rakko', label: '', status: 'pending' },
    { id: 'cloudflare', label: '', status: 'pending' },
    { id: 'browser', label: '', status: 'pending' },
  ]);

  const sessionId = useMemo(() => Date.now().toString(16).toUpperCase().slice(-6), []);
  const t = translations[lang];

  // Auto-detect language
  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ja')) setLang('ja');
    else if (browserLang.startsWith('zh')) setLang('zh');
    else setLang('en');
  }, []);

  // Animation for "..."
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Network Check Helper
  const checkUrl = async (url: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), PING_TIMEOUT);
      
      // We use no-cors because we only care if the network path exists/responds, 
      // not the content. If the network is blocked (GFW), it usually timeouts or throws.
      await fetch(url, { 
        mode: 'no-cors', 
        cache: 'no-store',
        signal: controller.signal 
      });
      
      clearTimeout(id);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Main Logic Sequence
  useEffect(() => {
    const runDiagnostics = async () => {
      // Small delay before starting to let user read the "Failed" message
      await new Promise(r => setTimeout(r, 1500));
      setStage(DiagnosticStage.RUNNING);

      // 1. Check Google (Region)
      updateCheckStatus('google', 'running');
      // Using a reliable global URL.
      const googleAlive = await checkUrl('https://www.google.com/favicon.ico?t=' + Date.now()); 
      updateCheckStatus('google', googleAlive ? 'success' : 'error');
      
      await new Promise(r => setTimeout(r, 600)); // Visual pacing

      // 2. Check Rakko
      updateCheckStatus('rakko', 'running');
      // Simulate Rakko check
      const rakkoAlive = await checkUrl('https://rakko.cn/favicon.ico?t=' + Date.now());
      updateCheckStatus('rakko', rakkoAlive ? 'success' : 'error');

      await new Promise(r => setTimeout(r, 600));

      // 3. Check Cloudflare
      updateCheckStatus('cloudflare', 'running');
      const cdnAlive = await checkUrl('https://www.cloudflare.com/cdn-cgi/trace');
      updateCheckStatus('cloudflare', cdnAlive ? 'success' : 'error');

      await new Promise(r => setTimeout(r, 600));

      // 4. Check Browser
      updateCheckStatus('browser', 'running');
      const info = getBrowserInfo();
      setBrowserInfo(info);
      await new Promise(r => setTimeout(r, 800)); // Simulate processing
      
      if (!info.isModern) {
        updateCheckStatus('browser', 'error');
      } else if (info.name === 'Firefox' || info.name === 'Safari') {
        setChecks(prev => prev.map(item => 
          item.id === 'browser' ? { ...item, status: 'warning' } : item
        ));
      } else {
        updateCheckStatus('browser', 'success');
      }

      // Complete
      setStage(DiagnosticStage.COMPLETED);

      // Collapse after a delay
      setTimeout(() => {
        setIsCollapsed(true);
      }, 1500);
    };

    runDiagnostics();
  }, []);

  const updateCheckStatus = (id: string, status: DiagnosticItem['status']) => {
    setChecks(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const handleReconnect = () => {
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get('return_to');
    
    if (returnTo) {
      window.location.href = returnTo;
    } else {
      window.history.back();
    }
  };

  const hasAnyError = checks.some(c => c.status === 'error');
  const hasAnyWarning = checks.some(c => c.status === 'warning');

  // Helper to get localized text for a check item
  const getCheckText = (item: DiagnosticItem) => {
    let label = '';
    let error = '';

    if (item.id === 'google') {
      label = t.check_google;
      error = t.check_google_fail;
    } else if (item.id === 'rakko') {
      label = t.check_rakko;
      error = t.check_rakko_fail;
    } else if (item.id === 'cloudflare') {
      label = t.check_cloudflare;
      error = t.check_cloudflare_fail;
    } else if (item.id === 'browser') {
      label = t.check_browser;
      if (item.status === 'warning') error = t.check_browser_warn;
      else error = t.check_browser_fail;
    }

    return { label, error };
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 font-sans relative">
      <div className="max-w-md w-full flex flex-col items-center transition-all duration-1000">
        
        {/* Header Branding */}
        <div className={`transition-all duration-700 ${isCollapsed ? 'scale-75 mb-4' : 'mb-12'}`}>
          <h1 className="text-3xl font-light tracking-tight text-gray-900 text-center">
            Rakko<span className="font-bold">System</span>
          </h1>
        </div>

        {/* Main Message Area */}
        <div className="text-center space-y-4 mb-8 z-10">
          <div className="flex justify-center mb-6">
            {stage === DiagnosticStage.COMPLETED && isCollapsed ? (
              hasAnyError ? (
                <div className="relative animate-in zoom-in duration-500">
                  <div className="absolute inset-0 bg-red-50 rounded-full scale-125 animate-pulse opacity-50"></div>
                  <WarningIcon className="w-32 h-32 text-red-500 relative z-10" />
                </div>
              ) : hasAnyWarning ? (
                <div className="relative animate-in zoom-in duration-500">
                  <div className="absolute inset-0 bg-yellow-50 rounded-full scale-125 animate-pulse opacity-50"></div>
                  <WarningIcon className="w-32 h-32 text-yellow-500 relative z-10" />
                </div>
              ) : (
                <div className="relative animate-in zoom-in duration-500">
                  <div className="absolute inset-0 bg-gray-50 rounded-full scale-125 opacity-30"></div>
                  <SuccessIcon className="w-20 h-20 text-green-500 relative z-10" />
                </div>
              )
            ) : (
              <div className="relative">
                 <div className="absolute inset-0 bg-gray-50 rounded-full scale-150 animate-ping opacity-30"></div>
                 <WarningIcon className="w-32 h-32 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-2 px-4 transition-all duration-500">
            <h2 className={`text-xl md:text-2xl font-medium text-gray-900 leading-snug ${isCollapsed ? 'scale-110 origin-top' : ''}`}>
              {stage === DiagnosticStage.COMPLETED && isCollapsed ? (
                hasAnyError ? t.header_error : hasAnyWarning ? t.header_warning : t.header_success
              ) : (
                t.header_initial
              )}
            </h2>
            <p className={`text-gray-500 font-light transition-opacity duration-500 ${isCollapsed && !hasAnyError && !hasAnyWarning ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
              {stage === DiagnosticStage.COMPLETED && isCollapsed ? (
                 hasAnyError ? t.sub_error : hasAnyWarning ? t.sub_warning : ""
              ) : (
                <>{t.sub_checking}{dots}</>
              )}
            </p>
          </div>
        </div>

        {/* Diagnostic List - Collapsible - Kept in DOM but normally hidden in this flow unless modified */}
        <div 
          className={`w-full bg-white transition-all duration-1000 ease-in-out overflow-hidden border-gray-100
            ${!isCollapsed ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-4'}
          `}
        >
          <div className="space-y-3 w-full px-2">
            {checks.map((item) => {
              const { label, error } = getCheckText(item);
              return (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300
                    ${item.status === 'pending' ? 'border-transparent opacity-40' : 
                      item.status === 'running' ? 'border-gray-100 bg-white scale-[1.02]' : 
                      'border-transparent bg-white'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-full transition-colors duration-300
                      ${item.status === 'error' ? 'bg-red-50 text-red-500' : 
                        item.status === 'success' ? 'bg-green-50 text-green-500' : 
                        item.status === 'warning' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-gray-50 text-gray-400'}
                    `}>
                      {item.id === 'browser' ? <SystemIcon className="w-4 h-4" /> : <NetworkIcon className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className={`text-sm font-medium ${item.status === 'running' ? 'text-gray-900' : 'text-gray-600'}`}>
                        {label}
                      </span>
                      {(item.status === 'error' || item.status === 'warning') && (
                        <span className={`text-xs animate-in slide-in-from-left-2 fade-in duration-300 ${item.status === 'error' ? 'text-red-500' : 'text-yellow-600'}`}>
                          {error}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-6 flex justify-center">
                    {item.status === 'running' && <LoadingIcon className="w-4 h-4 text-gray-400" />}
                    {item.status === 'success' && <SuccessIcon className="w-5 h-5 text-green-500 animate-in zoom-in duration-300" />}
                    {item.status === 'error' && <ErrorIcon className="w-5 h-5 text-red-500 animate-in zoom-in duration-300" />}
                    {item.status === 'warning' && <WarningIcon className="w-5 h-5 text-yellow-500 animate-in zoom-in duration-300" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Result Summary (Appears after collapse) */}
        <div 
          className={`w-full transition-all duration-1000 delay-300 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isCollapsed ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-8 overflow-hidden'}
          `}
        >
          <div className="mt-2 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            
            {hasAnyError ? (
               <div className="space-y-4">
                 <div className="text-sm text-gray-600 space-y-2">
                   {checks.filter(c => c.status === 'error').map(fail => {
                     const { error } = getCheckText(fail);
                     return (
                       <div key={fail.id} className="flex items-start space-x-2 text-red-600 bg-red-50 p-2 rounded">
                         <ErrorIcon className="w-4 h-4 mt-0.5 shrink-0" />
                         <span>{error}</span>
                       </div>
                     );
                   })}
                   {browserInfo && !browserInfo.isModern && (
                     <div className="text-xs text-gray-500 pt-2 border-t border-gray-100 mt-2">
                       {t.curr_browser}: {browserInfo.name} {browserInfo.version} ({browserInfo.os})
                     </div>
                   )}
                 </div>
                 <button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-all active:scale-95 font-medium text-sm shadow-lg shadow-gray-200"
                >
                  {t.btn_reload}
                </button>
               </div>
            ) : (
              <div className="space-y-4 text-center">
                 {hasAnyWarning && (
                    <div className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg text-left border border-yellow-100">
                       <p className="font-bold mb-1 flex items-center gap-2 text-xs uppercase tracking-wider">
                         <WarningIcon className="w-3 h-3"/> {t.notice_title}
                       </p>
                       {checks.filter(c => c.status === 'warning').map(w => {
                          const { error } = getCheckText(w);
                          return (
                            <div key={w.id} className="text-xs ml-1">
                              • {error} ({browserInfo?.name})
                            </div>
                          );
                       })}
                    </div>
                 )}
                 
                <p className="text-gray-600 text-sm">
                  {hasAnyWarning ? t.notice_warn_desc : t.notice_success_desc}
                </p>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handleReconnect}
                    className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-all active:scale-95 font-medium text-sm shadow-lg shadow-gray-200"
                  >
                    {t.btn_reconnect}
                  </button>
                  
                  {showDetail ? (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-left text-xs text-gray-600 font-mono break-all animate-in fade-in slide-in-from-top-2">
                       <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{t.sys_info}</p>
                            <p>Browser: {browserInfo?.name} {browserInfo?.version}</p>
                            <p>OS: {browserInfo?.os}</p>
                            <p className="mt-1 text-[10px] text-gray-400 leading-tight">{browserInfo?.userAgent}</p>
                          </div>
                          <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600 p-1">
                            ✕
                          </button>
                       </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowDetail(true)}
                      className="text-xs text-gray-400 py-2 hover:text-gray-600 transition-colors"
                    >
                      {t.btn_details}
                    </button>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Language Switcher & Footer */}
        <div className="fixed bottom-6 w-full px-6 flex justify-between items-end pointer-events-none">
           <div className="w-full text-center pointer-events-auto">
             <p className="text-[10px] text-gray-300 uppercase tracking-widest">
               ID: {sessionId}
             </p>
             <p className="text-[10px] text-gray-300 mt-0.5 font-light">
               Rakko diagnostic 1.3
             </p>
           </div>
           
           <div className="absolute right-6 bottom-0 pointer-events-auto flex flex-col gap-1 items-end">
              <div className="flex bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden text-xs font-medium">
                <button onClick={() => setLang('zh')} className={`px-3 py-1.5 transition-colors ${lang === 'zh' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-gray-600'}`}>中</button>
                <div className="w-px bg-gray-100"></div>
                <button onClick={() => setLang('en')} className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-gray-600'}`}>En</button>
                <div className="w-px bg-gray-100"></div>
                <button onClick={() => setLang('ja')} className={`px-3 py-1.5 transition-colors ${lang === 'ja' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-gray-600'}`}>日</button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default App;