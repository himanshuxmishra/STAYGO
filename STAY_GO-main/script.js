document.addEventListener('DOMContentLoaded', () => {
  const byId = id => document.getElementById(id);
  const pages = {
    login: byId('login-page'),
    create: byId('create-page'),
    home: byId('home-page'),
    hotel: byId('hotel-page'),
    car: byId('car-page')
  };

  function showPage(name) {
    Object.values(pages).forEach(p => p && p.classList.remove('active'));
    if (pages[name]) pages[name].classList.add('active');
    updateNavbar();
  }

  // Storage
  const USERS_KEY = 'staygo_users', CUR_KEY = 'staygo_current';
  const loadUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const saveUsers = u => localStorage.setItem(USERS_KEY, JSON.stringify(u));
  const getCurrent = () => JSON.parse(localStorage.getItem(CUR_KEY) || 'null');
  const setCurrent = u => localStorage.setItem(CUR_KEY, JSON.stringify(u));
  const clearCurrent = () => localStorage.removeItem(CUR_KEY);

  function updateNavbar() {
    const cur = getCurrent();
    if (byId('nav-user')) byId('nav-user').textContent = cur ? cur.name : 'Not logged';
    if (byId('hotel-user')) byId('hotel-user').textContent = cur ? cur.name : 'Account';
    if (byId('car-user')) byId('car-user').textContent = cur ? cur.name : 'Account';
  }

  // Register
  byId('btn-create').onclick = () => showPage('create');
  byId('reg-cancel').onclick = () => showPage('login');
  byId('reg-submit').onclick = () => {
    const name = byId('reg-name').value.trim();
    const id = byId('reg-identifier').value.trim();
    const pass = byId('reg-password').value;
    if (!name || !id || !pass) { alert("Please fill all fields."); return; }
    let users = loadUsers();
    if (users.some(u => u.identifier.toLowerCase() === id.toLowerCase())) { alert("Account exists."); return; }
    users.push({ name, identifier: id, password: pass });
    saveUsers(users);
    alert("Account created. Please login.");
    showPage('login');
  };

  // Login
  byId('btn-login').onclick = () => {
    const id = byId('login-identifier').value.trim();
    const pass = byId('login-password').value;
    if (!id || !pass) { alert("INCORRECT CREDENTIALS OR CREATE ACCOUNT FIRST"); return; }
    const found = loadUsers().find(u => u.identifier.toLowerCase() === id.toLowerCase() && u.password === pass);
    if (!found) { alert("INCORRECT CREDENTIALS OR CREATE ACCOUNT FIRST"); return; }
    setCurrent(found);
    showPage('home');
  };

  // Navigation
  byId('card-car').onclick = () => {
    if (!getCurrent()) { alert("INCORRECT CREDENTIALS OR CREATE ACCOUNT FIRST"); showPage('login'); return; }
    showPage('car');
  };
  byId('card-hotel').onclick = () => {
    if (!getCurrent()) { alert("INCORRECT CREDENTIALS OR CREATE ACCOUNT FIRST"); showPage('login'); return; }
    showPage('hotel');
  };
  byId('hotel-home-btn').onclick = () => showPage('home');
  byId('car-home-btn').onclick = () => showPage('home');

  // Cards
  const hotelImgs = ['h1.jpg','h2.jpg','h3.jpg','h4.jpg','h5.jpg','h6.jpg'];
  const carImgs = ['AUDI.jpg','BMW.jpg','DEFENDER.jpg','FERRAI.jpg','LAMBO.jpg','RUDICON.jpg'];
  const carNames = ['Audi','BMW','Defender','Ferrari','Lamborghini','Rudicon'];

  function createCard(img, title, price) {
    const div = document.createElement('div');
    div.className = "small-card";
    const loggedIn = getCurrent();

    div.innerHTML = `
      <img src="${img}" alt="${title}">
      <div class="card-body">
        <div style="font-weight:800;color:var(--primary)">${title}</div>
        <div style="color:#555;margin-top:6px;font-size:13px">Quick features • Verified</div>
        <div class="card-footer">
          <div class="price">₹${price.toLocaleString()}</div>
          ${loggedIn 
            ? `<button type="button" class="btn rent-btn">RENT NOW</button>` 
            : `<div class="muted" style="font-size:12px;color:#888">Login to book</div>`}
        </div>
      </div>`;

    if (loggedIn) {
      div.querySelector('.rent-btn').onclick = () => {
        alert(`Booking started for ${title}`);
      };
    }
    return div;
  }

  hotelImgs.forEach((h, i) => byId('hotel-cards').appendChild(createCard(h, `Hotel ${i + 1}`, 10000 + i * 2000)));
  carImgs.forEach((c, i) => byId('car-cards').appendChild(createCard(c, carNames[i], 50000 + i * 5000)));

  // Logout
  byId('nav-user').onclick = () => {
    if (!getCurrent()) { showPage('login'); return; }
    if (confirm("Sign out?")) { clearCurrent(); updateNavbar(); showPage('login'); }
  };

  // Always start with login page
  clearCurrent();
  showPage('login');
  updateNavbar();
});
