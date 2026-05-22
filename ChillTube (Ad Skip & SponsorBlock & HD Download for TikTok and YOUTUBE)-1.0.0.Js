// ==UserScript==
// @name         ChillTube (Ad Skip & SponsorBlock & HD Download for TikTok and YOUTUBE)
// @namespace    https://github.com/chilltube
// @icon         https://raw.githubusercontent.com/JORKLAN/chilltube/main/assets/logo.png
// @version      1.0.0
// @description  Dark-theme control panel: cosmetic ad-hider, page brightness & media volume controls, and a "Download" button that opens an external downloader site for the current page. Clean script — no scraping/DRM bypass is done here.
// @description:it  Pannello in tema scuro: nascondi annunci, controllo luminosità e volume, e un pulsante "Download" che apre un sito esterno per scaricare la pagina corrente.
// @description:es  Panel con tema oscuro: ocultador de anuncios, control de brillo y volumen, y un botón "Descargar" que abre un sitio externo para la página actual.
// @description:fr  Panneau thème sombre : masquage de publicités, contrôle de luminosité et de volume, et un bouton « Télécharger » qui ouvre un site externe pour la page actuelle.
// @description:de  Dunkles Bedienfeld: Werbung ausblenden, Helligkeits- und Lautstärkeregelung sowie eine „Herunterladen"-Schaltfläche, die eine externe Downloadseite öffnet.
// @description:pt  Painel de tema escuro: ocultar anúncios, controle de brilho e volume, e um botão "Baixar" que abre um site externo para a página atual.
// @description:ru  Тёмная панель управления: скрытие рекламы, регулировка яркости и громкости и кнопка «Скачать», открывающая внешний сайт для текущей страницы.
// @description:zh-CN  深色主题控制面板：隐藏广告、亮度与音量控制，以及一个为当前页面打开外部下载站点的"下载"按钮。
// @description:ja  ダークテーマのコントロールパネル：広告非表示、明るさと音量の調整、現在のページの外部ダウンロードサイトを開く「ダウンロード」ボタン。
// @description:ar  لوحة تحكم بثيم داكن: إخفاء الإعلانات، التحكم في السطوع والصوت، وزر "تنزيل" يفتح موقعًا خارجيًا للصفحة الحالية.
// @description:hi  डार्क-थीम कंट्रोल पैनल: विज्ञापन छिपाना, ब्राइटनेस और वॉल्यूम नियंत्रण, और एक "डाउनलोड" बटन जो वर्तमान पेज के लिए बाहरी साइट खोलता है।
// @author      Juls
// @match        *://*.youtube.com/*
// @match        *://youtube.com/*
// @match        *://*.tiktok.com/*
// @match        *://tiktok.com/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @connect      raw.githubusercontent.com
// @noframes
// @license MIT
// ==/UserScript==

(function () {
  'use strict';

  const CHILLTOK_LOGO = 'data:image/png;base64,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';

  const SITES = {
    youtube: {
      brand: 'ChillTube',
      logo:  'https://raw.githubusercontent.com/JORKLAN/chilltube/main/assets/logo.png',
      downloader: 'https://evdfrance.fr/convert/?id={id}'
    },
    tiktok: {
      brand: 'ChillTok',
      logo:  CHILLTOK_LOGO,
      downloader: '{snap}https://urlebird.com/snap/'
    }
  };

  function getSite() {
    try {
      const h = location.hostname || '';
      if (h.includes('tiktok.com')) return SITES.tiktok;
    } catch (e) {}
    return SITES.youtube;
  }
  function getBrand() { return getSite().brand; }

  const DOWNLOADER_URL = getSite().downloader;
  const LOGO_URL = getSite().logo;

  const store = {
    async get(key, def) {
      try {
        if (typeof GM !== 'undefined' && GM.getValue) return await GM.getValue(key, def);
        if (typeof GM_getValue === 'function') return GM_getValue(key, def);
      } catch (e) {}
      try {
        const v = localStorage.getItem('chilltube_' + key);
        return v === null ? def : JSON.parse(v);
      } catch (e) { return def; }
    },
    async set(key, val) {
      try {
        if (typeof GM !== 'undefined' && GM.setValue) return await GM.setValue(key, val);
        if (typeof GM_setValue === 'function') return GM_setValue(key, val);
      } catch (e) {}
      try { localStorage.setItem('chilltube_' + key, JSON.stringify(val)); } catch (e) {}
    }
  };

  function addStyle(css) {
    if (typeof GM_addStyle === 'function') { GM_addStyle(css); return; }
    const s = document.createElement('style');
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  }

  function openTab(url) {
    if (typeof GM_openInTab === 'function') { GM_openInTab(url, { active: true }); return; }
    window.open(url, '_blank', 'noopener');
  }

  let _ttPolicy = null;
  try {
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
      _ttPolicy = window.trustedTypes.createPolicy('chilltube-policy', { createHTML: s => s });
    }
  } catch (e) { _ttPolicy = null; }

  function setHTML(el, html) {
    try {
      el.textContent = '';
      const doc = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html');
      const frag = document.createDocumentFragment();
      Array.prototype.slice.call(doc.body.childNodes).forEach(n => frag.appendChild(document.importNode(n, true)));
      el.appendChild(frag);
    } catch (e) {
      try { el.innerHTML = _ttPolicy ? _ttPolicy.createHTML(html) : html; } catch (e2) {}
    }
  }

  const I18N = {
    en: { main:'Main', settings:'Settings', title:"Theme 'Dark'", interactive:'Interactive Elements',
          subtitle:'Demonstration of new UI components', adblock:'Ad Block', download:'Download',
          brightness:'Brightness Control', volume:'Volume Settings', save:'Save', reset:'Reset',
          language:'Language', downloader:'Downloader URL', saved:'Saved!', reset_done:'Reset done',
          dl_hint:'Opens an external downloader site for the page you are watching.',
          skipads:'Auto-skip video ads', skipnow:'Skip Ad',
          adblock_tiktok:'Hide sponsored & popups', adblock_hint:'Hides ad elements (banners, sidebars).',
          skip_hint:'Shows an instant Skip button when a video ad plays.',
          more:'More', contrast:'Contrast', grayscale:'Grayscale',
          loop:'Loop videos', speed:'Playback speed', hideshorts:'Hide Shorts',
          dl_set:'Set a downloader URL in Settings first.', dl_novideo:'Open a video first', dl_paste:'Link copied — press Ctrl+V on the page', dl_warn_title:'Link copied automatically', dl_warn_body:'The video link has been copied. On the page that opens, just paste it (Ctrl+V) or press Copy, then download.', dl_warn_ok:'Open downloader', cancel:'Cancel' },
    it: { main:'Principale', settings:'Impostazioni', title:"Tema 'Scuro'", interactive:'Elementi Interattivi',
          subtitle:'Dimostrazione dei nuovi componenti', adblock:'Blocca Ann.', download:'Scarica',
          brightness:'Luminosità', volume:'Volume', save:'Salva', reset:'Ripristina',
          language:'Lingua', downloader:'URL Downloader', saved:'Salvato!', reset_done:'Ripristinato',
          dl_hint:'Apre un sito esterno per scaricare la pagina che stai guardando.',
          skipads:'Salta annunci video', skipnow:'Salta annuncio',
          adblock_tiktok:'Nascondi sponsor e avvisi', adblock_hint:'Nasconde elementi pubblicitari (banner, barre laterali).',
          skip_hint:'Mostra un pulsante Salta istantaneo durante gli annunci video.',
          more:'Altro', contrast:'Contrasto', grayscale:'Bianco e nero',
          loop:'Ripeti video', speed:'Velocità', hideshorts:'Nascondi Shorts',
          dl_set:'Imposta prima un URL downloader nelle Impostazioni.', dl_novideo:'Apri prima un video', dl_paste:'Link copiato — premi Ctrl+V nella pagina', dl_warn_title:'Link copiato automaticamente', dl_warn_body:'Il link del video è stato copiato. Nella pagina che si apre, incollalo (Ctrl+V) o premi Copia, poi scarica.', dl_warn_ok:'Apri downloader', cancel:'Annulla' },
    es: { main:'Inicio', settings:'Ajustes', title:"Tema 'Oscuro'", interactive:'Elementos Interactivos',
          subtitle:'Demostración de componentes nuevos', adblock:'Anuncios', download:'Descargar',
          brightness:'Brillo', volume:'Volumen', save:'Guardar', reset:'Restablecer',
          language:'Idioma', downloader:'URL Descargador', saved:'¡Guardado!', reset_done:'Restablecido',
          dl_hint:'Abre un sitio externo para descargar la página actual.',
          skipads:'Saltar anuncios de video', skipnow:'Saltar anuncio',
          adblock_tiktok:'Ocultar patrocinados y avisos', adblock_hint:'Oculta elementos de anuncios (banners, barras laterales).',
          skip_hint:'Muestra un botón Saltar instantáneo durante los anuncios.',
          more:'Más', contrast:'Contraste', grayscale:'Escala de grises',
          loop:'Repetir vídeos', speed:'Velocidad', hideshorts:'Ocultar Shorts',
          dl_set:'Primero configura una URL de descargador en Ajustes.', dl_novideo:'Abre un video primero', dl_paste:'Enlace copiado — pulsa Ctrl+V en la página', dl_warn_title:'Enlace copiado automáticamente', dl_warn_body:'El enlace del vídeo se ha copiado. En la página que se abre, pégalo (Ctrl+V) o pulsa Copiar, y descarga.', dl_warn_ok:'Abrir descargador', cancel:'Cancelar' },
    fr: { main:'Accueil', settings:'Paramètres', title:"Thème 'Sombre'", interactive:'Éléments Interactifs',
          subtitle:'Démonstration de nouveaux composants', adblock:'Anti-pub', download:'Télécharger',
          brightness:'Luminosité', volume:'Volume', save:'Enregistrer', reset:'Réinitialiser',
          language:'Langue', downloader:'URL Téléchargeur', saved:'Enregistré !', reset_done:'Réinitialisé',
          dl_hint:'Ouvre un site externe pour télécharger la page actuelle.',
          skipads:'Passer les pubs vidéo', skipnow:'Passer la pub',
          adblock_tiktok:'Masquer sponsors et pop-ups', adblock_hint:'Masque les éléments publicitaires (bannières, barres latérales).',
          skip_hint:'Affiche un bouton Passer instantané pendant les pubs vidéo.',
          more:'Plus', contrast:'Contraste', grayscale:'Niveaux de gris',
          loop:'Boucle vidéo', speed:'Vitesse', hideshorts:'Masquer Shorts',
          dl_set:'Configurez d’abord une URL de téléchargeur dans les Paramètres.', dl_novideo:'Ouvrez d’abord une vidéo', dl_paste:'Lien copié — faites Ctrl+V sur la page', dl_warn_title:'Lien copié automatiquement', dl_warn_body:'Le lien de la vidéo a été copié. Sur la page qui s’ouvre, collez-le (Ctrl+V) ou appuyez sur Copier, puis téléchargez.', dl_warn_ok:'Ouvrir le téléchargeur', cancel:'Annuler' },
    de: { main:'Start', settings:'Einstellungen', title:"Thema 'Dunkel'", interactive:'Interaktive Elemente',
          subtitle:'Demonstration neuer UI-Komponenten', adblock:'Werbung', download:'Herunterladen',
          brightness:'Helligkeit', volume:'Lautstärke', save:'Speichern', reset:'Zurücksetzen',
          language:'Sprache', downloader:'Downloader-URL', saved:'Gespeichert!', reset_done:'Zurückgesetzt',
          dl_hint:'Öffnet eine externe Downloadseite für die aktuelle Seite.',
          skipads:'Videowerbung überspringen', skipnow:'Werbung überspringen',
          adblock_tiktok:'Gesponsertes & Pop-ups ausblenden', adblock_hint:'Blendet Werbeelemente aus (Banner, Seitenleisten).',
          skip_hint:'Zeigt eine sofortige Überspringen-Schaltfläche bei Videowerbung.',
          more:'Mehr', contrast:'Kontrast', grayscale:'Graustufen',
          loop:'Videos wiederholen', speed:'Geschwindigkeit', hideshorts:'Shorts ausblenden',
          dl_set:'Lege zuerst eine Downloader-URL in den Einstellungen fest.', dl_novideo:'Öffne zuerst ein Video', dl_paste:'Link kopiert — Strg+V auf der Seite', dl_warn_title:'Link automatisch kopiert', dl_warn_body:'Der Videolink wurde kopiert. Füge ihn auf der geöffneten Seite ein (Strg+V) oder drücke Kopieren, dann lade herunter.', dl_warn_ok:'Downloader öffnen', cancel:'Abbrechen' },
    pt: { main:'Início', settings:'Configurações', title:"Tema 'Escuro'", interactive:'Elementos Interativos',
          subtitle:'Demonstração de novos componentes', adblock:'Anúncios', download:'Baixar',
          brightness:'Brilho', volume:'Volume', save:'Salvar', reset:'Redefinir',
          language:'Idioma', downloader:'URL do Downloader', saved:'Salvo!', reset_done:'Redefinido',
          dl_hint:'Abre um site externo para baixar a página atual.',
          skipads:'Pular anúncios de vídeo', skipnow:'Pular anúncio',
          adblock_tiktok:'Ocultar patrocinados e avisos', adblock_hint:'Oculta elementos de anúncios (banners, barras laterais).',
          skip_hint:'Mostra um botão Pular instantâneo durante os anúncios.',
          more:'Mais', contrast:'Contraste', grayscale:'Escala de cinza',
          loop:'Repetir vídeos', speed:'Velocidade', hideshorts:'Ocultar Shorts',
          dl_set:'Defina primeiro uma URL de downloader nas Configurações.', dl_novideo:'Abra um vídeo primeiro', dl_paste:'Link copiado — pressione Ctrl+V na página', dl_warn_title:'Link copiado automaticamente', dl_warn_body:'O link do vídeo foi copiado. Na página que abrir, cole-o (Ctrl+V) ou pressione Copiar e baixe.', dl_warn_ok:'Abrir downloader', cancel:'Cancelar' },
    ru: { main:'Главная', settings:'Настройки', title:"Тема 'Тёмная'", interactive:'Интерактивные элементы',
          subtitle:'Демонстрация новых компонентов', adblock:'Реклама', download:'Скачать',
          brightness:'Яркость', volume:'Громкость', save:'Сохранить', reset:'Сброс',
          language:'Язык', downloader:'URL загрузчика', saved:'Сохранено!', reset_done:'Сброшено',
          dl_hint:'Открывает внешний сайт для скачивания текущей страницы.',
          skipads:'Пропуск видеорекламы', skipnow:'Пропустить',
          adblock_tiktok:'Скрыть рекламу и баннеры', adblock_hint:'Скрывает рекламные элементы (баннеры, боковые панели).',
          skip_hint:'Показывает кнопку мгновенного пропуска во время видеорекламы.',
          more:'Ещё', contrast:'Контраст', grayscale:'Оттенки серого',
          loop:'Повтор видео', speed:'Скорость', hideshorts:'Скрыть Shorts',
          dl_set:'Сначала укажите URL загрузчика в настройках.', dl_novideo:'Сначала откройте видео', dl_paste:'Ссылка скопирована — нажмите Ctrl+V', dl_warn_title:'Ссылка скопирована автоматически', dl_warn_body:'Ссылка на видео скопирована. На открывшейся странице вставьте её (Ctrl+V) или нажмите Копировать, затем скачайте.', dl_warn_ok:'Открыть загрузчик', cancel:'Отмена' },
    'zh-CN': { main:'主页', settings:'设置', title:"主题 '暗黑'", interactive:'交互元素',
          subtitle:'新 UI 组件演示', adblock:'广告拦截', download:'下载',
          brightness:'亮度控制', volume:'音量设置', save:'保存', reset:'重置',
          language:'语言', downloader:'下载器网址', saved:'已保存！', reset_done:'已重置',
          dl_hint:'为正在观看的页面打开外部下载站点。',
          skipads:'自动跳过视频广告', skipnow:'跳过广告',
          adblock_tiktok:'隐藏赞助和提示', adblock_hint:'隐藏广告元素（横幅、侧边栏）。',
          skip_hint:'播放视频广告时显示一个即时跳过按钮。',
          more:'更多', contrast:'对比度', grayscale:'灰度',
          loop:'循环播放', speed:'播放速度', hideshorts:'隐藏 Shorts',
          dl_set:'请先在设置中填写下载器网址。', dl_novideo:'请先打开一个视频', dl_paste:'链接已复制 — 在页面按 Ctrl+V', dl_warn_title:'链接已自动复制', dl_warn_body:'视频链接已复制。在打开的页面中粘贴（Ctrl+V）或点击复制，然后下载。', dl_warn_ok:'打开下载器', cancel:'取消' },
    ja: { main:'ホーム', settings:'設定', title:"テーマ「ダーク」", interactive:'インタラクティブ要素',
          subtitle:'新しいUIコンポーネントのデモ', adblock:'広告ブロック', download:'ダウンロード',
          brightness:'明るさ', volume:'音量', save:'保存', reset:'リセット',
          language:'言語', downloader:'ダウンローダーURL', saved:'保存しました！', reset_done:'リセット完了',
          dl_hint:'視聴中のページの外部ダウンロードサイトを開きます。',
          skipads:'動画広告を自動スキップ', skipnow:'広告をスキップ',
          adblock_tiktok:'スポンサーと通知を非表示', adblock_hint:'広告要素（バナー、サイドバー）を非表示にします。',
          skip_hint:'動画広告の再生中に即時スキップボタンを表示します。',
          more:'その他', contrast:'コントラスト', grayscale:'グレースケール',
          loop:'動画をループ', speed:'再生速度', hideshorts:'Shorts を非表示',
          dl_set:'先に設定でダウンローダーURLを指定してください。', dl_novideo:'先に動画を開いてください', dl_paste:'リンクをコピー — ページで Ctrl+V', dl_warn_title:'リンクを自動コピーしました', dl_warn_body:'動画リンクをコピーしました。開いたページで貼り付け（Ctrl+V）するかコピーを押して、ダウンロードしてください。', dl_warn_ok:'ダウンローダーを開く', cancel:'キャンセル' },
    ar: { main:'الرئيسية', settings:'الإعدادات', title:"السمة 'الداكنة'", interactive:'عناصر تفاعلية',
          subtitle:'عرض مكونات واجهة جديدة', adblock:'حظر الإعلانات', download:'تنزيل',
          brightness:'السطوع', volume:'الصوت', save:'حفظ', reset:'إعادة تعيين',
          language:'اللغة', downloader:'رابط المُنزّل', saved:'تم الحفظ!', reset_done:'تمت إعادة التعيين',
          dl_hint:'يفتح موقع تنزيل خارجيًا للصفحة الحالية.',
          skipads:'تخطي إعلانات الفيديو تلقائيًا', skipnow:'تخطي الإعلان',
          adblock_tiktok:'إخفاء الرعاية والإشعارات', adblock_hint:'يخفي عناصر الإعلانات (اللافتات والأشرطة الجانبية).',
          skip_hint:'يعرض زر تخطي فوري عند تشغيل إعلان فيديو.',
          more:'المزيد', contrast:'التباين', grayscale:'تدرج رمادي',
          loop:'تكرار الفيديو', speed:'السرعة', hideshorts:'إخفاء Shorts',
          dl_set:'حدّد أولاً رابط المُنزّل في الإعدادات.', dl_novideo:'افتح فيديو أولاً', dl_paste:'تم نسخ الرابط — اضغط Ctrl+V', dl_warn_title:'تم نسخ الرابط تلقائيًا', dl_warn_body:'تم نسخ رابط الفيديو. في الصفحة التي تُفتح، الصقه (Ctrl+V) أو اضغط نسخ، ثم نزّل.', dl_warn_ok:'فتح المُنزّل', cancel:'إلغاء' },
    hi: { main:'मुख्य', settings:'सेटिंग्स', title:"थीम 'डार्क'", interactive:'इंटरैक्टिव तत्व',
          subtitle:'नए UI घटकों का प्रदर्शन', adblock:'विज्ञापन ब्लॉक', download:'डाउनलोड',
          brightness:'चमक', volume:'वॉल्यूम', save:'सहेजें', reset:'रीसेट',
          language:'भाषा', downloader:'डाउनलोडर URL', saved:'सहेजा गया!', reset_done:'रीसेट हो गया',
          dl_hint:'वर्तमान पेज के लिए एक बाहरी डाउनलोडर साइट खोलता है।',
          skipads:'वीडियो विज्ञापन ऑटो-स्किप', skipnow:'विज्ञापन छोड़ें',
          adblock_tiktok:'प्रायोजित और सूचनाएं छिपाएं', adblock_hint:'विज्ञापन तत्व छिपाता है (बैनर, साइडबार)।',
          skip_hint:'वीडियो विज्ञापन चलने पर तुरंत स्किप बटन दिखाता है।',
          more:'अधिक', contrast:'कंट्रास्ट', grayscale:'ग्रेस्केल',
          loop:'वीडियो लूप करें', speed:'गति', hideshorts:'Shorts छिपाएं',
          dl_set:'पहले सेटिंग्स में डाउनलोडर URL सेट करें।', dl_novideo:'पहले एक वीडियो खोलें', dl_paste:'लिंक कॉपी हुआ — पेज पर Ctrl+V दबाएं', dl_warn_title:'लिंक अपने आप कॉपी हो गया', dl_warn_body:'वीडियो लिंक कॉपी हो गया है। खुलने वाले पेज पर इसे पेस्ट करें (Ctrl+V) या Copy दबाएं, फिर डाउनलोड करें।', dl_warn_ok:'डाउनलोडर खोलें', cancel:'रद्द करें' }
  };

  function pickLang(saved) {
    if (saved && I18N[saved]) return saved;
    const n = (navigator.language || 'en');
    if (I18N[n]) return n;
    const base = n.split('-')[0];
    return I18N[base] ? base : 'en';
  }

  const AD_CSS = `
    /* generic display-ad containers (specific & safe) */
    ins.adsbygoogle, .adsbygoogle,
    iframe[src*="doubleclick.net"], iframe[src*="googlesyndication.com"],
    iframe[src*="adservice.google"], iframe[id^="google_ads_iframe"],
    div[id^="div-gpt-ad"], div[id^="google_ads_"],
    #ad-banner, .ad-banner, .advertisement, .advertisment,
    .ad-container, .ad-wrapper, [data-ad-slot], [data-ad-client] {
      display: none !important;
    }
    /* YouTube-specific ad units (won't touch normal content) */
    ytd-display-ad-renderer, ytd-promoted-sparkles-web-renderer,
    ytd-promoted-video-renderer, ytd-compact-promoted-video-renderer,
    ytd-action-companion-ad-renderer, ytd-companion-slot-renderer,
    ytd-in-feed-ad-layout-renderer, ytd-ad-slot-renderer,
    ytd-banner-promo-renderer, ytd-statement-banner-renderer,
    #masthead-ad, #player-ads,
    .ytp-ad-overlay-container, .ytp-ad-overlay-slot,
    ytd-rich-item-renderer:has(ytd-ad-slot-renderer) {
      display: none !important;
    }
  `;

  const TIKTOK_AD_CSS = `
    /* bottom "Get the app" / download banners */
    [class*="DivBottomContainer"], [class*="DownloadGuide"],
    [class*="PopupContainer"], [class*="DivAppBanner"],
    div[data-e2e="download-app-popup"],
    /* sticky top "open app" bars */
    [class*="DivOpenAppBar"], [class*="DivBannerContainer"],
    /* login / signup nag modal + its mask */
    div[data-e2e="login-modal"], div[id="login-modal"],
    div[class*="DivLoginContainer"]:not(:has(form)),
    /* "Log in to follow creators" side prompts */
    div[class*="DivLoginCardContainer"],
    /* cookie / privacy floating banner */
    tiktok-cookie-banner {
      display: none !important;
    }
  `;

  let adStyleEl = null;
  let tiktokAdStyleEl = null;
  let tiktokAdTimer = null;

  function isTikTok() {
    try { return (location.hostname || '').includes('tiktok.com'); } catch (e) { return false; }
  }

  function getCurrentTikTokVideoUrl() {
    try {
      if (/\/@[^/]+\/video\/\d+/.test(location.pathname)) return location.href;
    } catch (e) {}

    const buildFromIdAuthor = (author, id) => {
      if (id && author) return 'https://www.tiktok.com/@' + author.replace(/^@/, '') + '/video/' + id;
      if (id) return 'https://www.tiktok.com/@_/video/' + id;
      return '';
    };

    const cy = window.innerHeight / 2;
    const vids = Array.from(document.querySelectorAll('video'));
    let activeContainer = null, bestDist = Infinity;
    vids.forEach(v => {
      const r = v.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const mid = r.top + r.height / 2;
      const dist = Math.abs(mid - cy);
      if (dist < bestDist) { bestDist = dist; activeContainer = v; }
    });

    if (activeContainer) {
      let node = activeContainer;
      for (let depth = 0; depth < 12 && node; depth++) {
        const a = node.querySelector && node.querySelector('a[href*="/video/"]');
        if (a) {
          const href = a.getAttribute('href') || '';
          if (/\/@[^/]+\/video\/\d+/.test(href)) {
            try { return new URL(href, location.origin).href; } catch (e) {}
          }
        }
        if (node.getAttribute) {
          const idAttr = node.getAttribute('data-video-id') ||
                         node.getAttribute('data-e2e-item-id') ||
                         (node.id && /\d{6,}/.test(node.id) ? node.id.match(/\d{6,}/)[0] : '');
          if (idAttr) {
            const authEl = node.querySelector && node.querySelector('a[href^="/@"], [data-e2e="video-author-uniqueid"]');
            let author = '';
            if (authEl) {
              const h = authEl.getAttribute('href') || authEl.textContent || '';
              const m = h.match(/@([A-Za-z0-9._]+)/);
              if (m) author = m[1];
            }
            const u = buildFromIdAuthor(author, idAttr);
            if (u) return u;
          }
        }
        node = node.parentElement;
      }
    }

    const links = Array.from(document.querySelectorAll('a[href*="/video/"]'))
      .filter(a => /\/@[^/]+\/video\/\d+/.test(a.getAttribute('href') || ''));
    if (links.length) {
      let best = null, d2 = Infinity;
      links.forEach(a => {
        const r = a.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        const mid = r.top + r.height / 2;
        const dist = Math.abs(mid - cy);
        if (dist < d2) { d2 = dist; best = a; }
      });
      if (!best) best = links[0];
      try { return new URL(best.getAttribute('href'), location.origin).href; } catch (e) {}
    }

    try {
      const og = document.querySelector('meta[property="og:url"], link[rel="canonical"]');
      const v = og && (og.getAttribute('content') || og.getAttribute('href'));
      if (v && /\/video\/\d+/.test(v)) return v;
    } catch (e) {}

    return '';
  }

  const SPONSORED_LABELS = [
    'sponsored', 'sponsorisé', 'patrocinado', 'gesponsert', 'sponsorizzato',
    'реклама', '广告', '스폰서', 'إعلان', 'विज्ञापन', '広告', 'patrocinada'
  ];
  function scanTikTokAds() {
    if (!isTikTok()) return;
    const items = document.querySelectorAll(
      'div[data-e2e="recommend-list-item-container"], ' +
      'div[class*="DivItemContainer"], div[class*="DivVideoFeed"] > div'
    );
    items.forEach(item => {
      if (item.dataset.ctHidden === '1') return;
      const text = (item.textContent || '').toLowerCase();
      const hit = SPONSORED_LABELS.some(lbl => {
        const idx = text.indexOf(lbl);
        return idx !== -1 && lbl.length >= 5;
      });
      const badge = item.querySelector('[class*="SponsoredText"], [class*="ad-badge"], [data-e2e*="ad"]');
      if (hit || badge) {
        item.style.setProperty('display', 'none', 'important');
        item.dataset.ctHidden = '1';
      }
    });
  }

  function setAdBlock(on) {
    if (on && !adStyleEl) {
      adStyleEl = document.createElement('style');
      adStyleEl.id = 'chilltube-adhide';
      adStyleEl.textContent = AD_CSS;
      (document.head || document.documentElement).appendChild(adStyleEl);
    } else if (!on && adStyleEl) {
      adStyleEl.remove();
      adStyleEl = null;
    }

    if (isTikTok()) {
      if (on && !tiktokAdStyleEl) {
        tiktokAdStyleEl = document.createElement('style');
        tiktokAdStyleEl.id = 'chilltube-tiktok-adhide';
        tiktokAdStyleEl.textContent = TIKTOK_AD_CSS;
        (document.head || document.documentElement).appendChild(tiktokAdStyleEl);
      } else if (!on && tiktokAdStyleEl) {
        tiktokAdStyleEl.remove();
        tiktokAdStyleEl = null;
      }
      if (on && !tiktokAdTimer) {
        scanTikTokAds();
        tiktokAdTimer = setInterval(scanTikTokAds, 1200);
      } else if (!on && tiktokAdTimer) {
        clearInterval(tiktokAdTimer);
        tiktokAdTimer = null;
      }
    }
  }

  function setRootFilter(s) {
    try { document.documentElement.style.filter = s || ''; } catch (e) {}
  }

  let mediaSpeed = 1, mediaLoop = false;
  function applyVideoPrefs() {
    document.querySelectorAll('video').forEach(v => {
      try { if (v.playbackRate !== mediaSpeed) v.playbackRate = mediaSpeed; v.loop = mediaLoop; } catch (e) {}
    });
  }

  let shortsStyleEl = null;
  const SHORTS_CSS = `
    ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer,
    ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
    ytd-guide-entry-renderer:has(a[title="Shorts"]),
    ytd-mini-guide-entry-renderer[aria-label="Shorts"] { display:none !important; }
  `;
  function setHideShorts(on) {
    if (on && !shortsStyleEl) {
      shortsStyleEl = document.createElement('style');
      shortsStyleEl.id = 'chilltube-shorts';
      shortsStyleEl.textContent = SHORTS_CSS;
      (document.head || document.documentElement).appendChild(shortsStyleEl);
    } else if (!on && shortsStyleEl) {
      shortsStyleEl.remove(); shortsStyleEl = null;
    }
  }

  let currentVol = 1;
  function applyVolume(v) {
    currentVol = Math.max(0, Math.min(1, v / 100));
    document.querySelectorAll('video, audio').forEach(m => {
      try { m.muted = currentVol === 0; m.volume = currentVol; } catch (e) {}
    });
  }
  const volObserver = new MutationObserver(() => { applyVolume(currentVol * 100); applyVideoPrefs(); });
  try { volObserver.observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}

  let skipEnabled = true;
  let skipBtnEl = null;
  let skipLabel = 'Skip Ad';

  function getPlayer() {
    return document.getElementById('movie_player') || document.querySelector('.html5-video-player');
  }

  function adIsShowing() {
    const p = getPlayer();
    if (p && (p.classList.contains('ad-showing') || p.classList.contains('ad-interrupting'))) return true;
    if (document.querySelector(
      '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, ' +
      '.ytp-ad-skip-button-container button, .videoAdUiSkipButton'
    )) return true;
    return false;
  }

  function clickNativeSkip() {
    const sel = '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, ' +
                '.ytp-ad-skip-button-container button, .videoAdUiSkipButton, ' +
                'button.ytp-ad-skip-button-modern, [id^="skip-button"] button';
    let clicked = false;
    document.querySelectorAll(sel).forEach(b => {
      try {
        const r = b.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) { b.click(); clicked = true; }
      } catch (e) {}
    });
    return clicked;
  }

  function seekAdToEnd() {
    const p = getPlayer();
    if (!p || !(p.classList.contains('ad-showing') || p.classList.contains('ad-interrupting'))) return;
    const v = p.querySelector('video') || document.querySelector('video');
    if (!v) return;
    try {
      if (isFinite(v.duration) && v.duration > 0) {
        v.currentTime = Math.max(v.currentTime, v.duration - 0.05);
        v.muted = true;
        if (v.paused) v.play().catch(() => {});
      } else {
        v.currentTime = (v.currentTime || 0) + 30;
      }
    } catch (e) {}
  }

  function doSkip() {
    if (!clickNativeSkip()) seekAdToEnd();
    setTimeout(() => { clickNativeSkip(); }, 120);
    setTimeout(() => { if (!adIsShowing()) hideSkipBtn(); }, 300);
  }

  function showSkipBtn() {
    if (!skipEnabled) return;
    const player = getPlayer();
    if (!skipBtnEl) {
      skipBtnEl = document.createElement('button');
      skipBtnEl.id = 'chilltube-skip';
      skipBtnEl.addEventListener('click', doSkip);
    }
    if (player) {
      if (skipBtnEl.parentElement !== player) player.appendChild(skipBtnEl);
      skipBtnEl.classList.add('in-player');
    } else {
      if (skipBtnEl.parentElement !== document.body) document.body.appendChild(skipBtnEl);
      skipBtnEl.classList.remove('in-player');
    }
    setHTML(skipBtnEl, '<span style="font-size:18px;line-height:1">\u23ED</span> ' + skipLabel);
    skipBtnEl.style.display = 'flex';
  }
  function hideSkipBtn() { if (skipBtnEl) skipBtnEl.style.display = 'none'; }

  setInterval(() => {
    applyVideoPrefs();
    if (!skipEnabled) { hideSkipBtn(); return; }
    if (adIsShowing()) {
      const skipped = clickNativeSkip();
      if (skipped) { hideSkipBtn(); return; }
      showSkipBtn();
    } else {
      hideSkipBtn();
    }
  }, 250);

  addStyle(`
    #chilltube-root { all: initial; }
    #chilltube-panel {
      position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
      width: 760px; max-width: calc(100vw - 24px); z-index: 2147483646;
      background: #0d0e0f; color: #f4f4f5;
      border: 1px solid #1d1f22; border-radius: 18px;
      box-shadow: 0 30px 80px rgba(0,0,0,.55);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: grid; grid-template-rows: auto 1fr; overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }
    #chilltube-panel * { box-sizing: border-box; }
    .ct-header { display:flex; align-items:center; gap:12px; padding:16px 20px;
      border-bottom:1px solid #161719; cursor:grab; user-select:none; }
    .ct-header:active { cursor:grabbing; }
    .ct-logo { width:44px; height:44px; border-radius:10px; background:transparent;
      display:flex; align-items:center; justify-content:center; flex:0 0 auto; overflow:hidden; }
    .ct-titles { display:flex; flex-direction:column; line-height:1.15; }
    .ct-titles b { font-size:16px; font-weight:700; }
    .ct-titles span { font-size:12px; color:#8b8d92; }
    .ct-winbtns { margin-left:auto; display:flex; gap:6px; }
    .ct-winbtns button { width:30px; height:30px; border:none; border-radius:8px;
      background:transparent; color:#aaadb3; cursor:pointer; display:flex;
      align-items:center; justify-content:center; }
    .ct-winbtns button:hover { background:#1d1f22; color:#fff; }
    .ct-body { display:grid; grid-template-columns:230px 1fr; min-height:430px; }
    .ct-side { padding:16px; display:flex; flex-direction:column; gap:6px;
      border-right:1px solid #161719; }
    .ct-tab { display:flex; align-items:center; gap:12px; padding:13px 16px;
      border-radius:12px; cursor:pointer; font-size:15px; font-weight:600; color:#cfd1d6; }
    .ct-tab:hover { background:#141517; }
    .ct-tab.active { background:#1a1c1f; color:#fff; }
    .ct-tab svg { opacity:.85; }
    .ct-content { padding:26px 30px; overflow:auto; }
    .ct-h1 { font-size:26px; font-weight:800; margin:0; }
    .ct-h2 { font-size:15px; color:#8b8d92; margin:4px 0 22px; }
    .ct-row2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .ct-card { background:#161719; border-radius:14px; padding:14px 18px;
      display:flex; align-items:center; gap:12px; }
    .ct-card .lbl { font-size:18px; font-weight:700; }
    .ct-section-title { font-size:18px; font-weight:700; margin:24px 0 12px; }
    .ct-slidecard { background:#161719; border-radius:14px; padding:16px 18px;
      display:flex; align-items:center; gap:16px; }
    .ct-slidecard svg { color:#9a9da3; flex:0 0 auto; }
    /* toggle */
    .ct-switch { margin-left:auto; position:relative; width:62px; height:34px; flex:0 0 auto; }
    .ct-switch input { opacity:0; width:0; height:0; }
    .ct-slider-sw { position:absolute; inset:0; background:#3a3d42; border-radius:999px;
      transition:.2s; cursor:pointer; }
    .ct-slider-sw:before { content:""; position:absolute; height:26px; width:26px;
      left:4px; top:4px; background:#fff; border-radius:50%; transition:.2s; }
    .ct-switch input:checked + .ct-slider-sw { background:#34c759; }
    .ct-switch input:checked + .ct-slider-sw:before { transform:translateX(28px); }
    /* range */
    .ct-range { -webkit-appearance:none; appearance:none; flex:1; height:6px;
      border-radius:6px; background:#2a2c30; outline:none; }
    .ct-range::-webkit-slider-thumb { -webkit-appearance:none; appearance:none;
      width:26px; height:26px; border-radius:50%; background:#fff; cursor:pointer;
      box-shadow:0 1px 4px rgba(0,0,0,.4); }
    .ct-range::-moz-range-thumb { width:26px; height:26px; border-radius:50%;
      background:#fff; cursor:pointer; border:none; }
    .ct-range.filled { background:linear-gradient(#2f6bff,#2f6bff) no-repeat; }
    /* buttons */
    .ct-btn { background:#161719; border:none; border-radius:14px; color:#fff;
      padding:16px; font-size:17px; font-weight:700; cursor:pointer;
      display:flex; align-items:center; justify-content:center; gap:10px; width:100%; }
    .ct-btn:hover { background:#1f2124; }
    .ct-btn svg { color:#9a9da3; }
    .ct-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px; }
    /* settings tab */
    .ct-field { margin-bottom:18px; }
    .ct-field label { display:block; font-size:14px; color:#9a9da3; margin-bottom:8px; }
    .ct-field select, .ct-field input {
      width:100%; background:#161719; border:1px solid #232529; color:#fff;
      border-radius:10px; padding:12px 14px; font-size:15px; outline:none; }
    .ct-toast { position:fixed; bottom:22px; left:50%; transform:translateX(-50%);
      background:#1a1c1f; color:#fff; padding:12px 22px; border-radius:10px;
      font-family:-apple-system,sans-serif; font-size:14px; z-index:2147483647;
      box-shadow:0 8px 30px rgba(0,0,0,.5); opacity:0; transition:opacity .25s; }
    .ct-toast.show { opacity:1; }
    /* download warning dialog */
    .ct-warn-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.6);
      z-index:2147483647; display:flex; align-items:center; justify-content:center;
      opacity:0; transition:opacity .18s; font-family:-apple-system,sans-serif; }
    .ct-warn-backdrop.show { opacity:1; }
    .ct-warn { background:#161719; border:1px solid #2a2c30; border-radius:16px;
      padding:24px; max-width:380px; width:90%; text-align:center;
      box-shadow:0 20px 60px rgba(0,0,0,.6); transform:translateY(10px);
      transition:transform .18s; }
    .ct-warn-backdrop.show .ct-warn { transform:translateY(0); }
    .ct-warn-icon { font-size:42px; line-height:1; margin-bottom:10px; }
    .ct-warn h3 { margin:0 0 10px; color:#f4f4f5; font-size:17px; font-weight:700; }
    .ct-warn p { margin:0 0 20px; color:#c4c6cb; font-size:14px; line-height:1.5; }
    .ct-warn-btn { width:100%; background:#34c759; border:none; color:#06210f;
      padding:13px; border-radius:11px; font-size:15px; font-weight:700;
      cursor:pointer; }
    .ct-warn-btn:hover { background:#2fb350; }
    .ct-warn-cancel { width:100%; background:transparent; border:none; color:#8a8d92;
      padding:11px; margin-top:6px; font-size:13px; cursor:pointer; }
    .ct-warn-cancel:hover { color:#c4c6cb; }
    .ct-hidden { display:none !important; }
    #chilltube-fab { position:fixed; bottom:20px; right:20px; width:54px; height:54px;
      border-radius:12px; background:transparent; border:none; color:#fff;
      cursor:pointer; z-index:2147483646; display:flex; align-items:center;
      justify-content:center; box-shadow:0 8px 30px rgba(0,0,0,.5); padding:0; overflow:hidden; }
    #chilltube-fab img { width:100%; height:100%; object-fit:cover; border-radius:12px; display:block; }
    #chilltube-fab:hover { background:#1a1c1f; }
    #chilltube-skip {
      position:fixed; bottom:90px; right:24px; z-index:2147483647;
      display:none; align-items:center; gap:8px;
      background:rgba(20,20,20,.92); color:#fff; cursor:pointer;
      border:1px solid rgba(255,255,255,.35); border-radius:4px;
      padding:11px 18px; font-size:14px; font-weight:600;
      font-family:-apple-system,"Roboto","Segoe UI",sans-serif;
      box-shadow:0 4px 18px rgba(0,0,0,.5); }
    #chilltube-skip:hover { background:#fff; color:#0d0d0d; border-color:#fff; }
    #chilltube-skip.in-player { position:absolute; bottom:70px; right:12px; top:auto; left:auto; z-index:1000; }
    #ct-particles { position:absolute; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:0; }
    #chilltube-panel > .ct-header, #chilltube-panel > .ct-body { position:relative; z-index:1; }
  `);

  const ICON = {
    logo: LOGO_URL
      ? '<img src="' + LOGO_URL + '" alt="' + getBrand() + '" style="width:100%;height:100%;object-fit:contain;border-radius:8px;display:block">'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cfd1d6" stroke-width="2"><path d="M3 12c4-7 14-7 18 0-4 7-14 7-18 0z"/><circle cx="12" cy="12" r="3" fill="#cfd1d6"/></svg>',
    home:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    gear:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1l-.4-2.6h-4l-.4 2.6a7 7 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5c.1-.3.1-.7.1-1z"/></svg>',
    unload:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
    moon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    sun:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>',
    mute:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16 8l5 5M21 8l-5 5" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    vol:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    save:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>',
    reset:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>',
    dl:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M5 21h14"/></svg>',
    puzzle:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="11" y2="6"/><line x1="15" y1="6" x2="20" y2="6"/><circle cx="13" cy="6" r="2"/><line x1="4" y1="12" x2="7" y2="12"/><line x1="11" y1="12" x2="20" y2="12"/><circle cx="9" cy="12" r="2"/><line x1="4" y1="18" x2="13" y2="18"/><line x1="17" y1="18" x2="20" y2="18"/><circle cx="15" cy="18" r="2"/></svg>',
    contrastLo:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>',
    contrastHi:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none"/></svg>'
  };

  async function init() {
    if (document.getElementById('chilltube-root')) return;

    const state = {
      lang: pickLang(await store.get('lang', null)),
      adblock: await store.get('adblock', true),
      skipAds: await store.get('skipAds', true),
      brightness: await store.get('brightness', 100),
      volume: await store.get('volume', 100),
      contrast: await store.get('contrast', 100),
      grayscale: await store.get('grayscale', false),
      loop: await store.get('loop', false),
      speed: await store.get('speed', 1),
      hideShorts: await store.get('hideShorts', false),
      open: true
    };
    let t = Object.assign({}, I18N.en, I18N[state.lang]);

    const root = document.createElement('div');
    root.id = 'chilltube-root';
    document.documentElement.appendChild(root);

    let panelPos = null;
    let particleRAF = null;

    function fillRange(el) {
      const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
      el.style.backgroundSize = pct + '% 100%';
      el.classList.add('filled');
    }

    function applyVisuals() {
      const parts = [];
      if (state.brightness < 95) parts.push('brightness(' + (0.3 + state.brightness / 100 * 0.85).toFixed(3) + ')');
      if (state.contrast !== 100) parts.push('contrast(' + (state.contrast / 100).toFixed(3) + ')');
      if (state.grayscale) parts.push('grayscale(1)');
      setRootFilter(parts.join(' '));
    }

    function render() {
      const rtl = state.lang === 'ar' ? 'dir="rtl"' : '';
      const content = state.tab === 'settings' ? settingsHTML()
                    : state.tab === 'more' ? moreHTML() : mainHTML();
      setHTML(root, `
        <div id="chilltube-panel" ${rtl}>
          <canvas id="ct-particles"></canvas>
          <div class="ct-header" id="ct-drag">
            <div class="ct-logo">${ICON.logo}</div>
            <div class="ct-titles"><b>${getBrand()}</b></div>
            <div class="ct-winbtns">
              <button id="ct-min" title="—"><svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg></button>
              <button id="ct-full" title="full"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>
            </div>
          </div>
          <div class="ct-body">
            <div class="ct-side">
              <div class="ct-tab ${('main'===state.tab||!state.tab)?'active':''}" data-tab="main">${ICON.home}${t.main}</div>
              <div class="ct-tab ${state.tab==='more'?'active':''}" data-tab="more">${ICON.puzzle}${t.more}</div>
              <div class="ct-tab ${state.tab==='settings'?'active':''}" data-tab="settings">${ICON.gear}${t.settings}</div>
            </div>
            <div class="ct-content">
              ${content}
            </div>
          </div>
        </div>`);
      bind();
      if (panelPos) {
        const p = root.querySelector('#chilltube-panel');
        if (p) { p.style.transform = 'none'; p.style.left = panelPos.left + 'px'; p.style.top = panelPos.top + 'px'; }
      }
      startParticles(root.querySelector('#ct-particles'));
    }

    function mainHTML() {
      const onTok = isTikTok();
      const skipCard = onTok ? '' : `
        <div class="ct-card" style="margin-top:14px;">
          <span class="lbl">${t.skipads}</span>
          <label class="ct-switch">
            <input type="checkbox" id="ct-skipmain" ${state.skipAds?'checked':''}>
            <span class="ct-slider-sw"></span>
          </label>
        </div>`;
      return `
        <div class="ct-card">
          <span class="lbl">${onTok ? t.adblock_tiktok : t.adblock}</span>
          <label class="ct-switch">
            <input type="checkbox" id="ct-adblock" ${state.adblock?'checked':''}>
            <span class="ct-slider-sw"></span>
          </label>
        </div>
        ${skipCard}

        <div class="ct-grid2" style="margin-top:18px;">
          <button class="ct-btn" id="ct-save">${ICON.save}<span>${t.save}</span></button>
          <button class="ct-btn" id="ct-reset">${ICON.reset}<span>${t.reset}</span></button>
        </div>
        <div class="ct-grid2" style="grid-template-columns:1fr;">
          <button class="ct-btn" id="ct-dl" title="${t.dl_hint}">${ICON.dl}<span>${t.download}</span></button>
        </div>`;
    }

    function moreHTML() {
      const onTok = isTikTok();
      const speeds = [0.5,0.75,1,1.25,1.5,2].map(s =>
        `<option value="${s}" ${s===state.speed?'selected':''}>${s}x</option>`).join('');
      const shortsCard = onTok ? '' : `
        <div class="ct-card" style="margin-top:14px;">
          <span class="lbl">${t.hideshorts}</span>
          <label class="ct-switch">
            <input type="checkbox" id="ct-shorts" ${state.hideShorts?'checked':''}>
            <span class="ct-slider-sw"></span>
          </label>
        </div>`;
      return `
        <h1 class="ct-h1">${t.more}</h1>

        <div class="ct-section-title">${t.brightness}</div>
        <div class="ct-slidecard">
          ${ICON.moon}
          <input type="range" min="0" max="100" value="${state.brightness}" class="ct-range" id="ct-bright">
          ${ICON.sun}
        </div>

        <div class="ct-section-title">${t.volume}</div>
        <div class="ct-slidecard">
          ${ICON.mute}
          <input type="range" min="0" max="100" value="${state.volume}" class="ct-range" id="ct-vol">
          ${ICON.vol}
        </div>

        <div class="ct-section-title">${t.contrast}</div>
        <div class="ct-slidecard">
          ${ICON.contrastLo}
          <input type="range" min="50" max="150" value="${state.contrast}" class="ct-range" id="ct-contrast">
          ${ICON.contrastHi}
        </div>

        <div class="ct-card" style="margin-top:18px;">
          <span class="lbl">${t.grayscale}</span>
          <label class="ct-switch">
            <input type="checkbox" id="ct-gray" ${state.grayscale?'checked':''}>
            <span class="ct-slider-sw"></span>
          </label>
        </div>
        <div class="ct-card" style="margin-top:14px;">
          <span class="lbl">${t.loop}</span>
          <label class="ct-switch">
            <input type="checkbox" id="ct-loop" ${state.loop?'checked':''}>
            <span class="ct-slider-sw"></span>
          </label>
        </div>
        ${shortsCard}

        <div class="ct-field" style="margin-top:20px;">
          <label>${t.speed}</label>
          <select id="ct-speed">${speeds}</select>
        </div>

        <div class="ct-grid2">
          <button class="ct-btn" id="ct-save3">${ICON.save}<span>${t.save}</span></button>
          <button class="ct-btn" id="ct-reset">${ICON.reset}<span>${t.reset}</span></button>
        </div>`;
    }

    function settingsHTML() {
      const opts = Object.keys(I18N).map(k =>
        `<option value="${k}" ${k===state.lang?'selected':''}>${k}</option>`).join('');
      return `
        <h1 class="ct-h1">${t.settings}</h1>
        <div class="ct-field">
          <label>${t.language}</label>
          <select id="ct-lang">${opts}</select>
        </div>
        <div class="ct-grid2">
          <button class="ct-btn" id="ct-save2">${ICON.save}<span>${t.save}</span></button>
          <button class="ct-btn" id="ct-reset">${ICON.reset}<span>${t.reset}</span></button>
        </div>`;
    }

    function toast(msg) {
      const el = document.createElement('div');
      el.className = 'ct-toast'; el.textContent = msg;
      root.appendChild(el);
      requestAnimationFrame(() => el.classList.add('show'));
      setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 1500);
    }

    function showDownloadWarning(onConfirm) {
      const backdrop = document.createElement('div');
      backdrop.className = 'ct-warn-backdrop';
      const TRIANGLE =
        '<svg class="ct-warn-svg" width="46" height="46" viewBox="0 0 24 24" fill="none" ' +
        'stroke="#ffce3a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>' +
        '<line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
      const card = document.createElement('div');
      card.className = 'ct-warn';
      setHTML(card,
        '<div class="ct-warn-icon">' + TRIANGLE + '</div>' +
        '<h3>' + (t.dl_warn_title || 'Link copied automatically') + '</h3>' +
        '<p>' + (t.dl_warn_body || 'The video link has been copied. On the page that opens, just paste it (Ctrl+V) or press the Copy button, then download.') + '</p>' +
        '<button class="ct-warn-btn" id="ct-warn-ok">' + (t.dl_warn_ok || 'Open downloader') + '</button>' +
        '<button class="ct-warn-cancel" id="ct-warn-cancel">' + (t.cancel || 'Cancel') + '</button>'
      );
      backdrop.appendChild(card);
      root.appendChild(backdrop);
      requestAnimationFrame(() => backdrop.classList.add('show'));
      function close() { backdrop.classList.remove('show'); setTimeout(() => backdrop.remove(), 200); }
      card.querySelector('#ct-warn-ok').addEventListener('click', () => { close(); onConfirm(); });
      card.querySelector('#ct-warn-cancel').addEventListener('click', close);
      backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
    }

    async function saveAll() {
      await store.set('lang', state.lang);
      await store.set('adblock', state.adblock);
      await store.set('skipAds', state.skipAds);
      await store.set('brightness', state.brightness);
      await store.set('volume', state.volume);
      await store.set('contrast', state.contrast);
      await store.set('grayscale', state.grayscale);
      await store.set('loop', state.loop);
      await store.set('speed', state.speed);
      await store.set('hideShorts', state.hideShorts);
      toast(t.saved);
    }

    function bind() {
      const $ = id => root.querySelector(id);

      const br = $('#ct-bright'), vo = $('#ct-vol');
      if (br) { fillRange(br); }
      if (vo) { fillRange(vo); }

      root.querySelectorAll('.ct-tab').forEach(tab =>
        tab.addEventListener('click', () => { state.tab = tab.dataset.tab; render(); }));

      const adb = $('#ct-adblock');
      if (adb) adb.addEventListener('change', e => { state.adblock = e.target.checked; setAdBlock(state.adblock); });

      const skipMain = $('#ct-skipmain');
      if (skipMain) skipMain.addEventListener('change', e => { state.skipAds = e.target.checked; skipEnabled = state.skipAds; if (!skipEnabled) hideSkipBtn(); });

      if (br) br.addEventListener('input', e => { state.brightness = +e.target.value; fillRange(e.target); applyVisuals(); });
      if (vo) vo.addEventListener('input', e => { state.volume = +e.target.value; fillRange(e.target); applyVolume(state.volume); });

      const ctr = $('#ct-contrast');
      if (ctr) { fillRange(ctr); ctr.addEventListener('input', e => { state.contrast = +e.target.value; fillRange(e.target); applyVisuals(); }); }
      const gray = $('#ct-gray');
      if (gray) gray.addEventListener('change', e => { state.grayscale = e.target.checked; applyVisuals(); });
      const loop = $('#ct-loop');
      if (loop) loop.addEventListener('change', e => { state.loop = e.target.checked; mediaLoop = state.loop; applyVideoPrefs(); });
      const shorts = $('#ct-shorts');
      if (shorts) shorts.addEventListener('change', e => { state.hideShorts = e.target.checked; setHideShorts(state.hideShorts); });
      const spd = $('#ct-speed');
      if (spd) spd.addEventListener('change', e => { state.speed = +e.target.value; mediaSpeed = state.speed; applyVideoPrefs(); });

      const save = $('#ct-save'); if (save) save.addEventListener('click', saveAll);
      const save2 = $('#ct-save2'); if (save2) save2.addEventListener('click', saveAll);
      const save3 = $('#ct-save3'); if (save3) save3.addEventListener('click', saveAll);

      root.querySelectorAll('#ct-reset').forEach(b => b.addEventListener('click', () => {
        state.adblock = true; state.skipAds = true; state.brightness = 100; state.volume = 100;
        state.contrast = 100; state.grayscale = false; state.loop = false; state.speed = 1; state.hideShorts = false;
        setAdBlock(true); applyVisuals(); applyVolume(100); skipEnabled = true;
        mediaSpeed = 1; mediaLoop = false; applyVideoPrefs(); setHideShorts(false);
        render(); toast(t.reset_done);
      }));

      const dl = $('#ct-dl');
      if (dl) dl.addEventListener('click', () => {
        const tmpl = getSite().downloader;
        if (!tmpl) { toast(t.dl_set); state.tab = 'settings'; render(); return; }

        let vid = '';
        try {
          const u = new URL(location.href);
          if (u.hostname.includes('youtu.be')) {
            vid = u.pathname.replace(/^\//, '').split('/')[0];
          } else if (u.searchParams.get('v')) {
            vid = u.searchParams.get('v');
          } else {
            const m = u.pathname.match(/\/(?:shorts|embed|live)\/([A-Za-z0-9_-]{6,})/);
            if (m) vid = m[1];
          }
        } catch (e) {}

        let pageUrl = location.href;
        if (isTikTok()) {
          const tk = getCurrentTikTokVideoUrl();
          if (tk) {
            pageUrl = tk;
          } else {
            toast(t.dl_novideo || 'Open a video first');
            return;
          }
        }

        let url = tmpl;
        if (url.startsWith('{snap}')) {
          const target = url.slice('{snap}'.length);
          const doCopyAndOpen = () => {
            try {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(pageUrl).then(
                  () => openTab(target),
                  () => { ctFallbackCopy(pageUrl); openTab(target); }
                );
              } else { ctFallbackCopy(pageUrl); openTab(target); }
            } catch (e) { ctFallbackCopy(pageUrl); openTab(target); }
          };
          showDownloadWarning(doCopyAndOpen);
          return;
        }
        if (url.includes('{id}')) {
          url = url.replace('{id}', encodeURIComponent(vid || ''));
        } else if (url.includes('{path}')) {
          let path = '/';
          try {
            const u = new URL(pageUrl);
            path = u.pathname + u.search;
          } catch (e) {}
          url = url.replace('{path}', path);
        } else if (url.includes('{url}')) {
          url = url.replace('{url}', encodeURIComponent(pageUrl));
        } else {
          url = url + encodeURIComponent(pageUrl);
        }
        openTab(url);
      });

      function ctFallbackCopy(text) {
        try {
          const ta = document.createElement('textarea');
          ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
          document.body.appendChild(ta); ta.select();
          document.execCommand('copy'); document.body.removeChild(ta);
        } catch (e) {}
      }

      const langSel = $('#ct-lang');
      if (langSel) langSel.addEventListener('change', e => { state.lang = e.target.value; t = Object.assign({}, I18N.en, I18N[state.lang]); skipLabel = t.skipnow; render(); });

      $('#ct-min').addEventListener('click', () => { state.open = false; root.querySelector('#chilltube-panel').classList.add('ct-hidden'); showFab(); });
      $('#ct-full').addEventListener('click', () => {
        const p = root.querySelector('#chilltube-panel');
        if (p.dataset.full === '1') { p.style.cssText = ''; p.dataset.full = '0'; render(); }
        else {
          p.dataset.full = '1';
          p.style.top = '12px'; p.style.left = '12px'; p.style.transform = 'none';
          p.style.width = 'calc(100vw - 24px)'; p.style.height = 'calc(100vh - 24px)';
        }
      });

      makeDraggable(root.querySelector('#ct-drag'), root.querySelector('#chilltube-panel'));
    }

    function makeDraggable(handle, panel) {
      let sx, sy, ox, oy, dragging = false;
      handle.addEventListener('mousedown', e => {
        if (e.target.closest('.ct-winbtns')) return;
        dragging = true;
        const r = panel.getBoundingClientRect();
        ox = r.left; oy = r.top; sx = e.clientX; sy = e.clientY;
        panel.style.transform = 'none';
        document.addEventListener('mousemove', mv);
        document.addEventListener('mouseup', up);
        e.preventDefault();
      });
      function mv(e) {
        if (!dragging) return;
        const left = ox + e.clientX - sx, top = oy + e.clientY - sy;
        panel.style.left = left + 'px'; panel.style.top = top + 'px';
        panelPos = { left: left, top: top };
      }
      function up() { dragging = false; document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); }
    }

    function startParticles(canvas) {
      if (!canvas) return;
      if (particleRAF) { cancelAnimationFrame(particleRAF); particleRAF = null; }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      function size() {
        const panel = canvas.parentElement;
        if (!panel) return;
        const w = panel.clientWidth, h = panel.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { w: w, h: h };
      }
      let dim = size() || { w: 760, h: 460 };

      const count = Math.max(14, Math.min(30, Math.round((dim.w * dim.h) / 14000)));
      const motes = [];
      for (let i = 0; i < count; i++) {
        motes.push({
          x: Math.random() * dim.w,
          y: Math.random() * dim.h,
          r: 0.4 + Math.random() * 1.1,
          a: 0.05 + Math.random() * 0.11,
          vx: (Math.random() - 0.5) * 0.05,
          vy: -0.04 - Math.random() * 0.06,
          tw: Math.random() * Math.PI * 2,
          tws: 0.004 + Math.random() * 0.008
        });
      }

      let resizeQueued = false;
      const onResize = () => { if (resizeQueued) return; resizeQueued = true;
        requestAnimationFrame(() => { dim = size() || dim; resizeQueued = false; }); };
      window.addEventListener('resize', onResize);

      function frame() {
        ctx.clearRect(0, 0, dim.w, dim.h);
        for (const m of motes) {
          m.x += m.vx; m.y += m.vy; m.tw += m.tws;
          if (m.y < -4) { m.y = dim.h + 4; m.x = Math.random() * dim.w; }
          if (m.x < -4) m.x = dim.w + 4; else if (m.x > dim.w + 4) m.x = -4;
          const alpha = m.a * (0.6 + 0.4 * Math.sin(m.tw));
          const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 3);
          g.addColorStop(0, 'rgba(255,255,255,' + alpha.toFixed(3) + ')');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 3, 0, Math.PI * 2); ctx.fill();
        }
        particleRAF = requestAnimationFrame(frame);
      }
      frame();
    }

    function showFab() {
      if (document.getElementById('chilltube-fab')) return;
      const fab = document.createElement('button');
      fab.id = 'chilltube-fab'; setHTML(fab, ICON.logo);
      fab.title = 'ChillTube';
      fab.addEventListener('click', () => {
        fab.remove();
        const p = root.querySelector('#chilltube-panel');
        p.classList.remove('ct-hidden'); state.open = true;
      });
      document.body.appendChild(fab);
    }

    setAdBlock(state.adblock);
    applyVisuals();
    applyVolume(state.volume);
    mediaSpeed = state.speed; mediaLoop = state.loop; applyVideoPrefs();
    setHideShorts(state.hideShorts);
    skipEnabled = state.skipAds;
    skipLabel = t.skipnow;

    state.tab = 'main';
    render();

    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('Toggle ChillTube panel', () => {
        const p = root.querySelector('#chilltube-panel');
        if (!p) return;
        p.classList.toggle('ct-hidden');
        const fab = document.getElementById('chilltube-fab');
        if (fab) fab.remove();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('yt-navigate-finish', () => setTimeout(init, 300));
  window.addEventListener('popstate', () => setTimeout(init, 300));
  setInterval(() => { if (!document.getElementById('chilltube-root')) init(); }, 3000);
})();