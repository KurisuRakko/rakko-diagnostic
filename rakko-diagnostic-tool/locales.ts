export type Language = 'zh' | 'en' | 'ja';

export const translations = {
  zh: {
    check_google: '国际网络连通性 (Google)',
    check_google_fail: '你的地区受限 可尝试更换网络或者重试',
    check_rakko: 'Rakko 主站连接',
    check_rakko_fail: '无法连接到 rakko 主站',
    check_cloudflare: 'CDN 节点状态 (Cloudflare)',
    check_cloudflare_fail: 'cdn 连接失败',
    check_browser: '浏览器环境兼容性',
    check_browser_fail: '浏览器版本太旧了',
    check_browser_warn: '可能存在兼容问题',
    
    header_error: '检测到连接问题',
    header_warning: '存在兼容性警告',
    header_success: '环境检测通过',
    header_initial: '诶？连接到 rakko 系网页失败了',
    
    sub_checking: '正在检查错误',
    sub_error: '请根据下方提示修复问题后重试',
    sub_warning: '您的浏览器可能无法完美体验',
    
    notice_title: '注意事项',
    notice_warn_desc: '虽然检测到兼容性提示，但您仍可尝试访问。',
    notice_success_desc: '您的网络环境和浏览器均符合要求。刚才的连接失败可能是临时波动。',
    
    btn_reload: '刷新页面重试',
    btn_reconnect: '尝试重新连接',
    btn_details: '详细信息',
    
    sys_info: '系统信息',
    curr_browser: '当前浏览器',
  },
  en: {
    check_google: 'Global Connectivity (Google)',
    check_google_fail: 'Region restricted. Try changing network.',
    check_rakko: 'Rakko Main Site',
    check_rakko_fail: 'Cannot connect to Rakko main site',
    check_cloudflare: 'CDN Status (Cloudflare)',
    check_cloudflare_fail: 'CDN connection failed',
    check_browser: 'Browser Compatibility',
    check_browser_fail: 'Browser version is too old',
    check_browser_warn: 'Compatibility issues may exist',
    
    header_error: 'Connection Issues Detected',
    header_warning: 'Compatibility Warnings',
    header_success: 'Environment Check Passed',
    header_initial: 'oh? Failed to connect to Rakko system.',
    
    sub_checking: 'Checking for errors',
    sub_error: 'Please fix the issues below and retry',
    sub_warning: 'Your browser may not provide the best experience',
    
    notice_title: 'Notices',
    notice_warn_desc: 'Compatibility issues detected, but you can proceed.',
    notice_success_desc: 'Environment meets requirements. Failure might be temporary.',
    
    btn_reload: 'Refresh and Retry',
    btn_reconnect: 'Reconnect',
    btn_details: 'Details',
    
    sys_info: 'System Info',
    curr_browser: 'Current Browser',
  },
  ja: {
    check_google: '国際ネットワーク接続 (Google)',
    check_google_fail: '地域制限があります。回線を変更してください。',
    check_rakko: 'Rakko メインサイト',
    check_rakko_fail: 'メインサイトに接続できません',
    check_cloudflare: 'CDN ステータス (Cloudflare)',
    check_cloudflare_fail: 'CDN 接続に失敗しました',
    check_browser: 'ブラウザ互換性',
    check_browser_fail: 'ブラウザが古すぎます',
    check_browser_warn: '互換性の問題がある可能性があります',
    
    header_error: '接続の問題が検出されました',
    header_warning: '互換性の警告があります',
    header_success: '環境チェック合格',
    header_initial: 'あれ？Rakko系ページへの接続に失敗しました',
    
    sub_checking: 'エラーをチェックしています',
    sub_error: '以下の問題を修正して再試行してください',
    sub_warning: '最適な体験が得られない可能性があります',
    
    notice_title: '注意事項',
    notice_warn_desc: '互換性の警告がありますが、アクセス可能です。',
    notice_success_desc: '要件を満たしています。接続失敗は一時的なものです。',
    
    btn_reload: 'ページを更新',
    btn_reconnect: '再接続',
    btn_details: '詳細情報',
    
    sys_info: 'システム情報',
    curr_browser: '現在のブラウザ',
  }
};