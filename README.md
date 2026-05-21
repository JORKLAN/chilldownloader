<p align="center">
  <img src="assets/banner.svg" alt="ChillTube" width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/type-userscript-2f6bff?style=flat-square" alt="Userscript">
  <img src="https://img.shields.io/badge/platform-Tampermonkey%20%7C%20Violentmonkey%20%7C%20Greasemonkey-34c759?style=flat-square" alt="Managers">
  <img src="https://img.shields.io/badge/version-2.3.0-555?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-888?style=flat-square" alt="License">
</p>

<p align="center">
  A lightweight, dark-themed control panel that overlays on YouTube and TikTok.
  It hides ad elements, skips skippable video ads, and adds quick page and
  playback controls, all from a single draggable panel available in eleven
  languages. The panel rebrands itself per site —
  <b>ChillTube</b> on YouTube, <b>ChillTok</b> on TikTok — and adapts its
  features and download target to whichever site you are on.
</p>

<p align="center">
  <img src="assets/features.svg?v=2" alt="Feature overview" width="100%">
</p>

---

## Two faces of the same script

A single install handles both sites. The panel detects the host you are on and
swaps its identity:

<table align="center">
<tr>
  <td align="center" width="50%">
    <img src="assets/logo.png" alt="ChillTube" width="80"><br>
    <b>ChillTube</b><br>
    <code>youtube.com</code><br>
    Download via evdfrance.fr
  </td>
  <td align="center" width="50%">
    <img src="assets/chilltok-logo.png" alt="ChillTok" width="80"><br>
    <b>ChillTok</b><br>
    <code>tiktok.com</code><br>
    Download via urlebird.com
  </td>
</tr>
</table>

All other settings — language, brightness, volume, contrast, speed — are shared
between the two sites, so what you configure once is remembered everywhere.

## Overview

ChillTube injects a compact panel into the YouTube and TikTok interface. The
panel mirrors a clean dark theme and groups every control into three tabs:
**Main** for the toggles you reach for most, **More** for visual and playback
tweaks, and **Settings** for language and configuration. Everything you change
is saved and restored automatically on your next visit.

The script is intentionally self-contained. It performs no network requests of
its own, collects no data, and does not bundle or call any external download or
DRM-bypass service. The download button simply opens an external site in a new
tab — evdfrance.fr on YouTube, urlebird.com on TikTok — and lets that site do
the work.

## Features by site

**On YouTube** the full feature set is active. The **Main** tab carries the
core switches: *Ad hiding* removes display ad units such as masthead banners,
promoted feed items, sidebar ad slots, and in-player overlay ads using a
curated list of selectors that leave normal page content untouched.
*Auto-skip* watches the player and clicks YouTube's native skip control the
instant it becomes available; while the unskippable countdown is still
running, a Skip button appears over the player so you can force the ad to its
end yourself. The **Download** button opens evdfrance.fr already loaded with
the current video ID, so the file is ready to download in one click.

**On TikTok** the panel keeps the same layout but the YouTube-specific ad
controls are no-ops there. The visual and playback adjustments still work
(brightness, contrast, grayscale, volume, loop, speed). The **Download**
button opens urlebird.com on the matching path for the page you are on, so
the video, profile, hashtag, or song you were viewing appears immediately
on urlebird's mirror, where it can be downloaded watermark-free.

## The More tab

The **More** tab holds the visual and playback adjustments and works on both
sites. A brightness slider dims or lifts the whole page, a contrast slider and
a grayscale toggle change how the page renders, and a volume slider sets the
level of any video or audio on the page. You can also loop the current video,
set a fixed playback speed, and hide YouTube Shorts shelves from the feed.

## The Settings tab

The **Settings** tab lets you switch the interface language.

## Interface

The panel is draggable by its header and remembers where you place it, even
when you switch tabs. Minimize tucks it into a small floating button in the
corner, and the fullscreen control expands it for closer work. A restrained
particle layer drifts behind the panel for a little depth without distraction.

## Installation

First, install a userscript manager in your browser. Tampermonkey,
Violentmonkey, and Greasemonkey are all supported.

Once a manager is installed, the easiest way to add ChillTube is the one-click
install from GreasyFork:

<p align="center">
  <a href="https://greasyfork.org/scripts/YOUR-SCRIPT-ID">
    <img src="https://img.shields.io/badge/Install%20from%20GreasyFork-Click%20here-34c759?style=for-the-badge" alt="Install from GreasyFork">
  </a>
</p>

Clicking the button opens the script page on GreasyFork. Press the green
**Install** button there and your userscript manager will pick it up and
confirm the installation. After that, open or refresh a YouTube or TikTok tab
and the panel appears.

If you would rather install it by hand, open your manager's dashboard, choose
**Create a new script**, replace the template with the contents of
`chilltube.user.js`, and save.

To update, GreasyFork-installed scripts update automatically. A manual install
is updated by pasting the newer version over the old one and saving.

## Configuration

Most options live in the panel and persist on their own. A few items are worth
calling out.

**Site scope.** By default the script runs on YouTube and TikTok. The active
scope is controlled by the `@match` lines in the metadata block at the top of
the file. To add another site, add another line in that block, for example
`@match *://*.twitch.tv/*`. A line only takes effect if it begins with the
`@match` keyword.

**Per-site profile.** Near the top of the script there is a `SITES` object
that holds the brand name, logo URL, and downloader template for each
supported site. To change where the download button points on YouTube or
TikTok, edit the `downloader` field for the corresponding entry. Two
placeholders are supported in any template:

- `{id}` — the YouTube video ID, useful for `?id=` style downloaders.
- `{path}` — the current page path including the query string, useful for
  mirror-style downloaders that re-host the same URL structure (this is how
  the TikTok ↔ urlebird redirect works).

If neither placeholder is present, the current URL is appended to the
template as-is (URL-encoded).

## Languages

The interface is available in English, Italian, Spanish, French, German,
Portuguese, Russian, Simplified Chinese, Japanese, Arabic (right-to-left),
and Hindi. The language is detected from the browser on first run and can be
changed at any time in the Settings tab.

## Compatibility

ChillTube is written to run across Chromium-based browsers and Firefox
through any of the supported managers. It uses a Trusted-Types-safe
rendering path so it works on sites with strict content-security policies,
and it re-injects itself after in-page navigation so it stays present as you
move between videos.

## License

Released under the MIT License. See `LICENSE` for details.
