import { $ } from '../core/dom.js';
import { S } from '../core/state.js';
import { drive } from '../drive/state.js';
import { net } from './state.js';

/* ---------- czat: T (albo przycisk „Czat”) otwiera pole, Enter wysyła, Esc zamyka; wiadomości w HUD ---------- */
// Serwer odsyła wiadomość także nadawcy, więc na ekranie jest to, co naprawdę doszło do pokoju.
const KEEP = 6;                                // linii na ekranie
const SHOW = 12000;                            // ms, potem linia gaśnie (wraca na czas pisania)
const log = $('dChatLog'), input = $('dChatIn'), box = $('dChatBox');
let send = null;

export function chatLine(nick, text) {
  const p = document.createElement('p');
  if (nick) p.append(Object.assign(document.createElement('b'), { textContent: nick }), ' ');
  else p.className = 'sys';                    // wejście i wyjście graczy
  p.append(text);
  log.append(p);
  while (log.children.length > KEEP) log.firstElementChild.remove();
  setTimeout(() => p.classList.add('old'), SHOW);
}
export function openChat() {
  if (!S.driving || net.status !== 'on' || !box.hidden) return;
  drive.keys = {};                             // puszczone klawisze: auto nie jedzie dalej samo
  box.hidden = false; log.classList.add('open');
  input.focus({ preventScroll: true });
}
function closeChat() {
  input.value = ''; box.hidden = true; log.classList.remove('open');
  if (document.activeElement === input) input.blur();
}
export function initChat(sendText) {
  send = sendText;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const text = input.value.replace(/\s+/g, ' ').trim();
      if (text) send(text);
      closeChat();
    } else if (e.key === 'Escape') { e.preventDefault(); closeChat(); }
    e.stopPropagation();
  });
  input.addEventListener('blur', closeChat);
  $('dChat').onclick = openChat;
}
export function clearChat() { closeChat(); log.replaceChildren(); }
