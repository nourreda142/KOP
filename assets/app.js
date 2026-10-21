'use strict';
const one = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
const storage = {
  read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
  remove(key) { try { localStorage.removeItem(key); return true; } catch { return false; } }
};
const toggle = one('.nav-toggle');
const navigation = one('#navigation');
function closeNavigation() { navigation.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
toggle.addEventListener('click', () => { const open = navigation.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeNavigation(); toggle.focus(); } });
window.addEventListener('resize', () => { if (window.innerWidth > 900) closeNavigation(); });
const savedValue = storage.read('koppee-favourites', []);
let saved = new Set(Array.isArray(savedValue) ? savedValue.filter(value => typeof value === 'string') : []);
let filter = 'All';
function filterMenu() {
  const search = one('#coffee-search')?.value.trim().toLowerCase() || '';
  let count = 0;
  all('#menu-grid .coffee-card').forEach(card => {
    const match = (filter === 'All' || (filter === 'Saved' ? saved.has(card.dataset.id) : card.dataset.category === filter)) && card.dataset.name.includes(search);
    card.hidden = !match;
    if (match) count++;
  });
  if (one('#result-count')) one('#result-count').textContent = `${count} drink${count === 1 ? '' : 's'} to discover`;
  if (one('#empty-state')) one('#empty-state').hidden = count > 0;
}
all('.favorite').forEach(button => {
  const id = button.closest('.coffee-card').dataset.id;
  const update = () => { const active = saved.has(id); button.setAttribute('aria-pressed', String(active)); button.textContent = active ? '♥' : '♡'; };
  update();
  button.addEventListener('click', () => { saved.has(id) ? saved.delete(id) : saved.add(id); storage.write('koppee-favourites', [...saved]); update(); filterMenu(); });
});
all('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  all('[data-filter]').forEach(item => { const active = item === button; item.classList.toggle('selected', active); item.setAttribute('aria-pressed', String(active)); });
  filterMenu();
}));
one('#coffee-search')?.addEventListener('input', filterMenu);
filterMenu();
function localDate(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
const reservation = one('#reservation-form');
if (reservation) {
  const dateInput = reservation.elements.date;
  const timeInput = reservation.elements.time;
  dateInput.min = localDate();
  const status = reservation.querySelector('.form-status');
  function showBooking() {
    const booking = storage.read('koppee-booking', null);
    const box = one('#last-booking');
    const valid = booking && typeof booking.date === 'string' && typeof booking.time === 'string' && Number.isInteger(Number(booking.guests));
    box.hidden = !valid;
    if (valid) box.querySelector('p').textContent = `${booking.date} at ${booking.time} · ${booking.guests} guest${Number(booking.guests) === 1 ? '' : 's'}. Demo only; no real table reserved.`;
  }
  showBooking();
  [dateInput, timeInput].forEach(input => input.addEventListener('input', () => { dateInput.setCustomValidity(''); timeInput.setCustomValidity(''); }));
  reservation.addEventListener('submit', event => {
    event.preventDefault();
    dateInput.min = localDate();
    const when = new Date(`${dateInput.value}T${timeInput.value}`);
    timeInput.setCustomValidity(Number.isNaN(when.getTime()) || when <= new Date() ? 'Choose a future date and time.' : '');
    reservation.elements.name.setCustomValidity(reservation.elements.name.value.trim() ? '' : 'Please enter your name.');
    if (!reservation.reportValidity()) return;
    const booking = { date: dateInput.value, time: timeInput.value, guests: reservation.elements.guests.value };
    const persisted = storage.write('koppee-booking', booking);
    status.textContent = persisted ? 'Demo plan saved in this browser. No real reservation was made.' : 'Plan validated. Browser storage is unavailable, so it could not be saved.';
    showBooking();
  });
  reservation.elements.name.addEventListener('input', () => reservation.elements.name.setCustomValidity(''));
  one('#clear-booking').addEventListener('click', () => { const removed = storage.remove('koppee-booking'); status.textContent = removed ? 'Saved demo plan deleted.' : 'Unable to delete the plan from browser storage.'; showBooking(); });
}
const contact = one('#contact-form');
if (contact) {
  ['name', 'message'].forEach(name => contact.elements[name].addEventListener('input', () => contact.elements[name].setCustomValidity('')));
  contact.addEventListener('submit', event => {
    event.preventDefault();
    contact.elements.name.setCustomValidity(contact.elements.name.value.trim() ? '' : 'Please enter your name.');
    contact.elements.message.setCustomValidity(contact.elements.message.value.trim().length >= 10 ? '' : 'Please write at least 10 characters.');
    if (!contact.reportValidity()) return;
    contact.querySelector('.form-status').textContent = 'Message preview ready. This demo has not sent or stored your message.';
    const preview = one('#message-preview');
    preview.hidden = false;
    preview.replaceChildren();
    const title = document.createElement('h4'); title.textContent = contact.elements.subject.value;
    const text = document.createElement('p'); text.textContent = contact.elements.message.value.trim();
    preview.append(title, text);
  });
}
const reviews = all('.review');
if (reviews.length) {
  let index = 0;
  const move = direction => { index = (index + direction + reviews.length) % reviews.length; reviews.forEach((review, i) => { review.hidden = i !== index; }); one('#review-count').textContent = `${String(index + 1).padStart(2, '0')} / ${String(reviews.length).padStart(2, '0')}`; };
  one('#review-prev').addEventListener('click', () => move(-1));
  one('#review-next').addEventListener('click', () => move(1));
}
const topButton = one('.back-top');
window.addEventListener('scroll', () => { topButton.hidden = window.scrollY < 500; }, { passive: true });
topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
