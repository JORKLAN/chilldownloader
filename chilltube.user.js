// ==UserScript==
// @name         ChillTube — Theme 'Dark' Panel
// @namespace    https://github.com/chilltube
// @version      2.3.0
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
// @author       you
// @match        *://*.youtube.com/*
// @match        *://youtube.com/*
// To add another site, add a line above like:  @match  *://*.twitch.tv/*
// (it must begin with the @match keyword to take effect)
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
// ==/UserScript==

/* global GM, GM_setValue, GM_getValue, GM_addStyle, GM_registerMenuCommand, GM_openInTab */

(function () {
  'use strict';

  /* ============================================================
   *  CONFIG — your downloader site (optional).
   *  Left empty on purpose: put your own site here or set it in
   *  Settings. The button only OPENS this URL in a new tab and
   *  appends the current page address where {url} is. It downloads
   *  nothing itself. Example format:
   *      'https://your-downloader-site.com/?url={url}'
   * ============================================================ */
  const DOWNLOADER_URL = '';

  /* Your logo. Once you upload logo.png to your GitHub repo, paste its raw
   * URL here, e.g.:
   *   https://raw.githubusercontent.com/USERNAME/REPO/main/assets/logo.png
   * Leave empty to use the built-in placeholder mark. */
  const LOGO_URL = '';

  /* ----------  cross-engine storage (TM / VM / GM)  ---------- */
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

  /* ----  Trusted-Types-safe HTML injection (fixes YouTube)  ---- */
  let _ttPolicy = null;
  try {
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
      _ttPolicy = window.trustedTypes.createPolicy('chilltube-policy', { createHTML: s => s });
    }
  } catch (e) { _ttPolicy = null; }

  function setHTML(el, html) {
    // Parse via DOMParser — NOT an injection sink, so Trusted Types allows it.
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

  /* ----------------------  i18n  ---------------------- */
  const I18N = {
    en: { main:'Main', settings:'Settings', title:"Theme 'Dark'", interactive:'Interactive Elements',
          subtitle:'Demonstration of new UI components', adblock:'Ad Block', download:'Download',
          brightness:'Brightness Control', volume:'Volume Settings', save:'Save', reset:'Reset',
          language:'Language', downloader:'Downloader URL', saved:'Saved!', reset_done:'Reset done',
          dl_hint:'Opens an external downloader site for the page you are watching.',
          skipads:'Auto-skip video ads', skipnow:'Skip Ad',
          adblock_hint:'Hides ad elements (banners, sidebars).',
          skip_hint:'Shows an instant Skip button when a video ad plays.',
          more:'More', contrast:'Contrast', grayscale:'Grayscale',
          loop:'Loop videos', speed:'Playback speed', hideshorts:'Hide Shorts',
          dl_set:'Set a downloader URL in Settings first.' },
    it: { main:'Principale', settings:'Impostazioni', title:"Tema 'Scuro'", interactive:'Elementi Interattivi',
          subtitle:'Dimostrazione dei nuovi componenti', adblock:'Blocca Ann.', download:'Scarica',
          brightness:'Luminosità', volume:'Volume', save:'Salva', reset:'Ripristina',
          language:'Lingua', downloader:'URL Downloader', saved:'Salvato!', reset_done:'Ripristinato',
          dl_hint:'Apre un sito esterno per scaricare la pagina che stai guardando.',
          skipads:'Salta annunci video', skipnow:'Salta annuncio',
          adblock_hint:'Nasconde elementi pubblicitari (banner, barre laterali).',
          skip_hint:'Mostra un pulsante Salta istantaneo durante gli annunci video.',
          more:'Altro', contrast:'Contrasto', grayscale:'Bianco e nero',
          loop:'Ripeti video', speed:'Velocità', hideshorts:'Nascondi Shorts',
          dl_set:'Imposta prima un URL downloader nelle Impostazioni.' },
    es: { main:'Inicio', settings:'Ajustes', title:"Tema 'Oscuro'", interactive:'Elementos Interactivos',
          subtitle:'Demostración de componentes nuevos', adblock:'Anuncios', download:'Descargar',
          brightness:'Brillo', volume:'Volumen', save:'Guardar', reset:'Restablecer',
          language:'Idioma', downloader:'URL Descargador', saved:'¡Guardado!', reset_done:'Restablecido',
          dl_hint:'Abre un sitio externo para descargar la página actual.',
          skipads:'Saltar anuncios de video', skipnow:'Saltar anuncio',
          adblock_hint:'Oculta elementos de anuncios (banners, barras laterales).',
          skip_hint:'Muestra un botón Saltar instantáneo durante los anuncios.',
          more:'Más', contrast:'Contraste', grayscale:'Escala de grises',
          loop:'Repetir vídeos', speed:'Velocidad', hideshorts:'Ocultar Shorts',
          dl_set:'Primero configura una URL de descargador en Ajustes.' },
    fr: { main:'Accueil', settings:'Paramètres', title:"Thème 'Sombre'", interactive:'Éléments Interactifs',
          subtitle:'Démonstration de nouveaux composants', adblock:'Anti-pub', download:'Télécharger',
          brightness:'Luminosité', volume:'Volume', save:'Enregistrer', reset:'Réinitialiser',
          language:'Langue', downloader:'URL Téléchargeur', saved:'Enregistré !', reset_done:'Réinitialisé',
          dl_hint:'Ouvre un site externe pour télécharger la page actuelle.',
          skipads:'Passer les pubs vidéo', skipnow:'Passer la pub',
          adblock_hint:'Masque les éléments publicitaires (bannières, barres latérales).',
          skip_hint:'Affiche un bouton Passer instantané pendant les pubs vidéo.',
          more:'Plus', contrast:'Contraste', grayscale:'Niveaux de gris',
          loop:'Boucle vidéo', speed:'Vitesse', hideshorts:'Masquer Shorts',
          dl_set:'Configurez d’abord une URL de téléchargeur dans les Paramètres.' },
    de: { main:'Start', settings:'Einstellungen', title:"Thema 'Dunkel'", interactive:'Interaktive Elemente',
          subtitle:'Demonstration neuer UI-Komponenten', adblock:'Werbung', download:'Herunterladen',
          brightness:'Helligkeit', volume:'Lautstärke', save:'Speichern', reset:'Zurücksetzen',
          language:'Sprache', downloader:'Downloader-URL', saved:'Gespeichert!', reset_done:'Zurückgesetzt',
          dl_hint:'Öffnet eine externe Downloadseite für die aktuelle Seite.',
          skipads:'Videowerbung überspringen', skipnow:'Werbung überspringen',
          adblock_hint:'Blendet Werbeelemente aus (Banner, Seitenleisten).',
          skip_hint:'Zeigt eine sofortige Überspringen-Schaltfläche bei Videowerbung.',
          more:'Mehr', contrast:'Kontrast', grayscale:'Graustufen',
          loop:'Videos wiederholen', speed:'Geschwindigkeit', hideshorts:'Shorts ausblenden',
          dl_set:'Lege zuerst eine Downloader-URL in den Einstellungen fest.' },
    pt: { main:'Início', settings:'Configurações', title:"Tema 'Escuro'", interactive:'Elementos Interativos',
          subtitle:'Demonstração de novos componentes', adblock:'Anúncios', download:'Baixar',
          brightness:'Brilho', volume:'Volume', save:'Salvar', reset:'Redefinir',
          language:'Idioma', downloader:'URL do Downloader', saved:'Salvo!', reset_done:'Redefinido',
          dl_hint:'Abre um site externo para baixar a página atual.',
          skipads:'Pular anúncios de vídeo', skipnow:'Pular anúncio',
          adblock_hint:'Oculta elementos de anúncios (banners, barras laterais).',
          skip_hint:'Mostra um botão Pular instantâneo durante os anúncios.',
          more:'Mais', contrast:'Contraste', grayscale:'Escala de cinza',
          loop:'Repetir vídeos', speed:'Velocidade', hideshorts:'Ocultar Shorts',
          dl_set:'Defina primeiro uma URL de downloader nas Configurações.' },
    ru: { main:'Главная', settings:'Настройки', title:"Тема 'Тёмная'", interactive:'Интерактивные элементы',
          subtitle:'Демонстрация новых компонентов', adblock:'Реклама', download:'Скачать',
          brightness:'Яркость', volume:'Громкость', save:'Сохранить', reset:'Сброс',
          language:'Язык', downloader:'URL загрузчика', saved:'Сохранено!', reset_done:'Сброшено',
          dl_hint:'Открывает внешний сайт для скачивания текущей страницы.',
          skipads:'Пропуск видеорекламы', skipnow:'Пропустить',
          adblock_hint:'Скрывает рекламные элементы (баннеры, боковые панели).',
          skip_hint:'Показывает кнопку мгновенного пропуска во время видеорекламы.',
          more:'Ещё', contrast:'Контраст', grayscale:'Оттенки серого',
          loop:'Повтор видео', speed:'Скорость', hideshorts:'Скрыть Shorts',
          dl_set:'Сначала укажите URL загрузчика в настройках.' },
    'zh-CN': { main:'主页', settings:'设置', title:"主题 '暗黑'", interactive:'交互元素',
          subtitle:'新 UI 组件演示', adblock:'广告拦截', download:'下载',
          brightness:'亮度控制', volume:'音量设置', save:'保存', reset:'重置',
          language:'语言', downloader:'下载器网址', saved:'已保存！', reset_done:'已重置',
          dl_hint:'为正在观看的页面打开外部下载站点。',
          skipads:'自动跳过视频广告', skipnow:'跳过广告',
          adblock_hint:'隐藏广告元素（横幅、侧边栏）。',
          skip_hint:'播放视频广告时显示一个即时跳过按钮。',
          more:'更多', contrast:'对比度', grayscale:'灰度',
          loop:'循环播放', speed:'播放速度', hideshorts:'隐藏 Shorts',
          dl_set:'请先在设置中填写下载器网址。' },
    ja: { main:'ホーム', settings:'設定', title:"テーマ「ダーク」", interactive:'インタラクティブ要素',
          subtitle:'新しいUIコンポーネントのデモ', adblock:'広告ブロック', download:'ダウンロード',
          brightness:'明るさ', volume:'音量', save:'保存', reset:'リセット',
          language:'言語', downloader:'ダウンローダーURL', saved:'保存しました！', reset_done:'リセット完了',
          dl_hint:'視聴中のページの外部ダウンロードサイトを開きます。',
          skipads:'動画広告を自動スキップ', skipnow:'広告をスキップ',
          adblock_hint:'広告要素（バナー、サイドバー）を非表示にします。',
          skip_hint:'動画広告の再生中に即時スキップボタンを表示します。',
          more:'その他', contrast:'コントラスト', grayscale:'グレースケール',
          loop:'動画をループ', speed:'再生速度', hideshorts:'Shorts を非表示',
          dl_set:'先に設定でダウンローダーURLを指定してください。' },
    ar: { main:'الرئيسية', settings:'الإعدادات', title:"السمة 'الداكنة'", interactive:'عناصر تفاعلية',
          subtitle:'عرض مكونات واجهة جديدة', adblock:'حظر الإعلانات', download:'تنزيل',
          brightness:'السطوع', volume:'الصوت', save:'حفظ', reset:'إعادة تعيين',
          language:'اللغة', downloader:'رابط المُنزّل', saved:'تم الحفظ!', reset_done:'تمت إعادة التعيين',
          dl_hint:'يفتح موقع تنزيل خارجيًا للصفحة الحالية.',
          skipads:'تخطي إعلانات الفيديو تلقائيًا', skipnow:'تخطي الإعلان',
          adblock_hint:'يخفي عناصر الإعلانات (اللافتات والأشرطة الجانبية).',
          skip_hint:'يعرض زر تخطي فوري عند تشغيل إعلان فيديو.',
          more:'المزيد', contrast:'التباين', grayscale:'تدرج رمادي',
          loop:'تكرار الفيديو', speed:'السرعة', hideshorts:'إخفاء Shorts',
          dl_set:'حدّد أولاً رابط المُنزّل في الإعدادات.' },
    hi: { main:'मुख्य', settings:'सेटिंग्स', title:"थीम 'डार्क'", interactive:'इंटरैक्टिव तत्व',
          subtitle:'नए UI घटकों का प्रदर्शन', adblock:'विज्ञापन ब्लॉक', download:'डाउनलोड',
          brightness:'चमक', volume:'वॉल्यूम', save:'सहेजें', reset:'रीसेट',
          language:'भाषा', downloader:'डाउनलोडर URL', saved:'सहेजा गया!', reset_done:'रीसेट हो गया',
          dl_hint:'वर्तमान पेज के लिए एक बाहरी डाउनलोडर साइट खोलता है।',
          skipads:'वीडियो विज्ञापन ऑटो-स्किप', skipnow:'विज्ञापन छोड़ें',
          adblock_hint:'विज्ञापन तत्व छिपाता है (बैनर, साइडबार)।',
          skip_hint:'वीडियो विज्ञापन चलने पर तुरंत स्किप बटन दिखाता है।',
          more:'अधिक', contrast:'कंट्रास्ट', grayscale:'ग्रेस्केल',
          loop:'वीडियो लूप करें', speed:'गति', hideshorts:'Shorts छिपाएं',
          dl_set:'पहले सेटिंग्स में डाउनलोडर URL सेट करें।' }
  };

  function pickLang(saved) {
    if (saved && I18N[saved]) return saved;
    const n = (navigator.language || 'en');
    if (I18N[n]) return n;
    const base = n.split('-')[0];
    return I18N[base] ? base : 'en';
  }

  /* -------------  cosmetic ad-hider (CSS only)  -------------
   * Curated, SPECIFIC selectors only. No broad substring matches
   * like [class^="ad-"] — those hide real page content (e.g. it
   * blanked YouTube). Only known ad units are targeted here.
   */
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
  let adStyleEl = null;
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
  }

  /* -------------  page visual filters  ------------- */
  function setRootFilter(s) {
    try { document.documentElement.style.filter = s || ''; } catch (e) {}
  }

  /* -------------  video preferences (speed / loop)  ------------- */
  let mediaSpeed = 1, mediaLoop = false;
  function applyVideoPrefs() {
    document.querySelectorAll('video').forEach(v => {
      try { if (v.playbackRate !== mediaSpeed) v.playbackRate = mediaSpeed; v.loop = mediaLoop; } catch (e) {}
    });
  }

  /* -------------  hide YouTube Shorts  ------------- */
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

  /* -------------  media volume control  ------------- */
  let currentVol = 1;
  function applyVolume(v) {
    currentVol = Math.max(0, Math.min(1, v / 100));
    document.querySelectorAll('video, audio').forEach(m => {
      try { m.muted = currentVol === 0; m.volume = currentVol; } catch (e) {}
    });
  }
  // keep new media elements in sync
  const volObserver = new MutationObserver(() => { applyVolume(currentVol * 100); applyVideoPrefs(); });
  try { volObserver.observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}

  /* -------------  instant video-ad skip  ------------- */
  let skipEnabled = true;
  let skipBtnEl = null;
  let skipLabel = 'Skip Ad';

  function getPlayer() {
    return document.getElementById('movie_player') || document.querySelector('.html5-video-player');
  }

  function adIsShowing() {
    const p = getPlayer();
    if (p && (p.classList.contains('ad-showing') || p.classList.contains('ad-interrupting'))) return true;
    // a visible native skip control is also a sure sign of an ad
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
    // The ad uses the SAME <video> element as the content on YouTube.
    const v = p.querySelector('video') || document.querySelector('video');
    if (!v) return;
    try {
      if (isFinite(v.duration) && v.duration > 0) {
        v.currentTime = Math.max(v.currentTime, v.duration - 0.05);
        v.muted = true;            // silence the last frames
        if (v.paused) v.play().catch(() => {});
      } else {
        // duration not known yet — nudge forward so it ends fast
        v.currentTime = (v.currentTime || 0) + 30;
      }
    } catch (e) {}
  }

  function doSkip() {
    // Try native skip first (cleanest); if not available, seek the ad to its end.
    if (!clickNativeSkip()) seekAdToEnd();
    // a moment later, click skip again in case seeking revealed it
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
    // Attach the button INTO the player so it overlays the video
    // (bottom-right, like YouTube's native skip) and survives fullscreen.
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
      // Auto-attempt: click native skip if it's available right now.
      const skipped = clickNativeSkip();
      if (skipped) { hideSkipBtn(); return; }
      // Not skippable yet (countdown) — show our button so the user can
      // force-skip by seeking the ad to its end.
      showSkipBtn();
    } else {
      hideSkipBtn();
    }
  }, 250);


  /* ----------------------  styles  ---------------------- */
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
    .ct-logo { width:34px; height:34px; border-radius:9px; background:#1b1c1e;
      display:flex; align-items:center; justify-content:center; flex:0 0 auto; }
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
    .ct-hidden { display:none !important; }
    #chilltube-fab { position:fixed; bottom:20px; right:20px; width:54px; height:54px;
      border-radius:50%; background:#0d0e0f; border:1px solid #2a2c30; color:#fff;
      cursor:pointer; z-index:2147483646; display:flex; align-items:center;
      justify-content:center; box-shadow:0 8px 30px rgba(0,0,0,.5); }
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

  /* SVG icons */
  const ICON = {
    logo: LOGO_URL
      ? '<img src="' + LOGO_URL + '" alt="ChillTube" style="width:100%;height:100%;object-fit:cover;border-radius:8px;display:block">'
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
    puzzle:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.44 7.85c-.05.32.06.65.29.88l1.57 1.57c.47.47.7 1.08.7 1.7s-.23 1.23-.7 1.7l-1.61 1.61a.98.98 0 0 1-.84.28c-.47-.07-.8-.48-.97-.92a2.5 2.5 0 1 0-3.21 3.21c.45.17.86.5.93.97a.98.98 0 0 1-.28.84l-1.61 1.61c-.47.47-1.08.7-1.7.7s-1.24-.23-1.71-.7l-1.57-1.57a1.03 1.03 0 0 0-.88-.29c-.49.07-.84.5-1.02.97a2.5 2.5 0 1 1-3.24-3.24c.47-.18.9-.53.97-1.02a1.03 1.03 0 0 0-.29-.88L2.7 13.7A2.4 2.4 0 0 1 2 12c0-.62.24-1.23.7-1.7l1.53-1.53c.24-.24.58-.35.92-.3.51.08.87.53 1.07 1.01a2.5 2.5 0 1 0 3.26-3.26c-.48-.2-.93-.56-1.01-1.07-.05-.34.06-.68.3-.92l1.53-1.53A2.4 2.4 0 0 1 12 2c.62 0 1.23.24 1.7.7l1.57 1.57c.23.23.56.34.88.29.49-.07.84-.5 1.02-.97a2.5 2.5 0 1 1 3.24 3.24c-.47.18-.9.53-.97 1.02Z"/></svg>',
    contrastLo:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>',
    contrastHi:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none"/></svg>'
  };

  /* ----------------------  build UI  ---------------------- */
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
      downloader: await store.get('downloader', DOWNLOADER_URL),
      open: true
    };
    let t = Object.assign({}, I18N.en, I18N[state.lang]);

    const root = document.createElement('div');
    root.id = 'chilltube-root';
    document.documentElement.appendChild(root);

    let panelPos = null;       // remembers dragged position across re-renders
    let particleRAF = null;    // current particle animation frame

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
            <div class="ct-titles"><b>ChillTube</b></div>
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
      // reapply dragged position so switching tabs doesn't move the panel
      if (panelPos) {
        const p = root.querySelector('#chilltube-panel');
        if (p) { p.style.transform = 'none'; p.style.left = panelPos.left + 'px'; p.style.top = panelPos.top + 'px'; }
      }
      startParticles(root.querySelector('#ct-particles'));
    }

    function mainHTML() {
      return `
        <h1 class="ct-h1">${t.interactive}</h1>
        <p class="ct-h2">${t.subtitle}</p>
        <div class="ct-card">
          <span class="lbl">${t.adblock}</span>
          <label class="ct-switch">
            <input type="checkbox" id="ct-adblock" ${state.adblock?'checked':''}>
            <span class="ct-slider-sw"></span>
          </label>
        </div>
        <div class="ct-card" style="margin-top:14px;">
          <span class="lbl">${t.skipads}</span>
          <label class="ct-switch">
            <input type="checkbox" id="ct-skipmain" ${state.skipAds?'checked':''}>
            <span class="ct-slider-sw"></span>
          </label>
        </div>

        <div class="ct-grid2" style="margin-top:18px;">
          <button class="ct-btn" id="ct-save">${ICON.save}<span>${t.save}</span></button>
          <button class="ct-btn" id="ct-reset">${ICON.reset}<span>${t.reset}</span></button>
        </div>
        <div class="ct-grid2" style="grid-template-columns:1fr;">
          <button class="ct-btn" id="ct-dl" title="${t.dl_hint}">${ICON.dl}<span>${t.download}</span></button>
        </div>`;
    }

    function moreHTML() {
      const speeds = [0.5,0.75,1,1.25,1.5,2].map(s =>
        `<option value="${s}" ${s===state.speed?'selected':''}>${s}x</option>`).join('');
      return `
        <h1 class="ct-h1">${t.more}</h1>
        <p class="ct-h2">${t.subtitle}</p>

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
        <div class="ct-card" style="margin-top:14px;">
          <span class="lbl">${t.hideshorts}</span>
          <label class="ct-switch">
            <input type="checkbox" id="ct-shorts" ${state.hideShorts?'checked':''}>
            <span class="ct-slider-sw"></span>
          </label>
        </div>

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
        <p class="ct-h2">${t.subtitle}</p>
        <div class="ct-field">
          <label>${t.language}</label>
          <select id="ct-lang">${opts}</select>
        </div>
        <div class="ct-field">
          <label>${t.downloader}</label>
          <input type="text" id="ct-dlurl" value="${state.downloader.replace(/"/g,'&quot;')}">
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
      await store.set('downloader', state.downloader);
      toast(t.saved);
    }

    function bind() {
      const $ = id => root.querySelector(id);

      // fill slider tracks
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
        if (!state.downloader || !state.downloader.trim()) { toast(t.dl_set); state.tab = 'settings'; render(); return; }
        const url = state.downloader.includes('{url}')
          ? state.downloader.replace('{url}', encodeURIComponent(location.href))
          : state.downloader + encodeURIComponent(location.href);
        openTab(url);
      });

      const langSel = $('#ct-lang');
      if (langSel) langSel.addEventListener('change', e => { state.lang = e.target.value; t = Object.assign({}, I18N.en, I18N[state.lang]); skipLabel = t.skipnow; render(); });

      const dlurl = $('#ct-dlurl');
      if (dlurl) dlurl.addEventListener('input', e => { state.downloader = e.target.value; });

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

    /* ----------  subtle white particles (restrained)  ---------- */
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

      // few, slow, low-opacity motes — not a constellation/connect-the-dots
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

    // apply persisted settings immediately
    setAdBlock(state.adblock);
    applyVisuals();
    applyVolume(state.volume);
    mediaSpeed = state.speed; mediaLoop = state.loop; applyVideoPrefs();
    setHideShorts(state.hideShorts);
    skipEnabled = state.skipAds;
    skipLabel = t.skipnow;

    state.tab = 'main';
    render();

    // menu command to toggle panel
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

  // Keep the panel alive on single-page-app sites (YouTube etc.)
  window.addEventListener('yt-navigate-finish', () => setTimeout(init, 300));
  window.addEventListener('popstate', () => setTimeout(init, 300));
  setInterval(() => { if (!document.getElementById('chilltube-root')) init(); }, 3000);
})();
