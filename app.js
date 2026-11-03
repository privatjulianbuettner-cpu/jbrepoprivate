const STORAGE_KEY = 'fg-ssd-portal-state-v1';

const defaultState = {
  currentRole: 'member',
  user: {
    name: 'Mara Schneider',
    role: 'SSD-Mitglied',
  },
  stats: [
    { label: 'Anstehende Dienste', value: 3, delta: '+1 diese Woche' },
    { label: 'Offene Abwesenheiten', value: 2, delta: '1 zu prüfen' },
    { label: 'Materialfenster', value: 5, delta: '2 heute' },
    { label: 'Nachrichten', value: 8, delta: '3 neu' },
  ],
  absences: [
    {
      startDate: '2026-11-05',
      endDate: '2026-11-06',
      service: 'Wachdienst 1',
      note: 'Schulreise',
      status: 'Neu',
    },
    {
      startDate: '2026-11-10',
      endDate: '2026-11-12',
      service: 'Ersteinsatzbetreuung',
      note: 'Krankheitsbedingt',
      status: 'Bestätigt',
    },
  ],
  services: [
    { title: 'Wachdienst 1', date: 'Mi. 08.11., 08:00', assignee: 'Mara Schneider' },
    { title: 'Ersteinsatzbetreuung', date: 'Fr. 10.11., 12:30', assignee: 'Leonie Hartmann' },
    { title: 'Materialkontrolle', date: 'Sa. 12.11., 09:00', assignee: 'Jan Becker' },
  ],
  notifications: [
    { title: 'Vertretung bestätigt', detail: 'Dienst am 10.11. wurde übernommen.' },
    { title: 'Materialruf', detail: 'Ich benötige 6 Verbände in Lager B.' },
    { title: 'Dienständerung', detail: 'Wachdienst auf 09:30 verschoben.' },
  ],
  incidents: [
    {
      building: 'Hauptgebäude',
      section: 'EG',
      floor: '1',
      room: 'Aula',
      meetingPoint: 'Haupteingang',
      type: 'Erste Hilfe',
      datetime: '2026-11-05T14:00',
      orientation: 'Person mit Schürfwunde, Ansprechpartner: Frau Meier',
      status: 'Eingegangen',
    },
    {
      building: 'Sporthalle',
      section: 'Nord',
      floor: '1',
      room: 'Korridor',
      meetingPoint: 'Sporteingang',
      type: 'Verstärkung',
      datetime: '2026-11-06T09:30',
      orientation: 'Meldegruppe an der Turnhalle',
      status: 'Übernommen',
    },
  ],
  materials: [
    { name: 'Verbandsmaterial', location: 'Lager A', stock: 18, checkDate: '2026-11-04', status: 'Gut' },
    { name: 'Taschenlampe', location: 'Kiste 2', stock: 4, checkDate: '2026-11-03', status: 'Prüfen' },
    { name: 'Schmerzmittel', location: 'Kasten 7', stock: 2, checkDate: '2026-11-04', status: 'Nachbestellen' },
  ],
  messages: [
    { title: 'Rundmeldung', detail: 'Materialausgabe für die nächste Schulwoche am Freitag.', read: false },
    { title: 'Dienständerung', detail: 'Wachdienst wurde verschoben.', read: true },
    { title: 'Kursleitung', detail: 'Abwesenheit für 08.11. wurde bestätigt.', read: false },
  ],
  swapRequests: [
    { title: 'Tausch: Wachdienst 1', detail: 'Mara Schneider ↔ Leonie Hartmann', state: 'Genehmigt' },
    { title: 'Vertretung', detail: 'Jan Becker für Materialkontrolle', state: 'Offen' },
  ],
};

const el = {
  roleSelector: document.querySelector('#roleSelector'),
  userName: document.querySelector('#userName'),
  notificationCount: document.querySelector('#notificationCount'),
  statsGrid: document.querySelector('#statsGrid'),
  upcomingServices: document.querySelector('#upcomingServices'),
  notificationList: document.querySelector('#notificationList'),
  absenceSummary: document.querySelector('#absenceSummary'),
  messageSummary: document.querySelector('#messageSummary'),
  absenceTable: document.querySelector('#absenceTable'),
  scheduleTable: document.querySelector('#scheduleTable'),
  swapList: document.querySelector('#swapList'),
  incidentTable: document.querySelector('#incidentTable'),
  materialTable: document.querySelector('#materialTable'),
  messageList: document.querySelector('#messageList'),
  archiveList: document.querySelector('#archiveList'),
  absenceForm: document.querySelector('#absenceForm'),
  incidentForm: document.querySelector('#incidentForm'),
  materialForm: document.querySelector('#materialForm'),
  navLinks: document.querySelectorAll('.nav-link'),
  panels: document.querySelectorAll('.panel'),
};

function loadState() {
  const state = localStorage.getItem(STORAGE_KEY);
  if (!state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    return structuredClone(defaultState);
  }
  try {
    return JSON.parse(state);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    return structuredClone(defaultState);
  }
}

const appState = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function formatStatus(status) {
  const normalized = String(status).trim().toLowerCase();
  const map = {
    neu: 'neu',
    gesehen: 'gesehen',
    bestätigt: 'bestätigt',
    vertretung erforderlich: 'vertretung',
    erledigt: 'erledigt',
    eingegangen: 'eingegangen',
    übernommen: 'eingegangen',
    abgeschlossen: 'abgeschlossen',
  };
  return map[normalized] || 'neu';
}

function renderStats() {
  const cards = appState.stats.map((item) => `
    <div class="stat-card">
      <div class="label">
        <span>${item.label}</span>
      </div>
      <div class="value">${item.value}</div>
      <div class="delta">${item.delta}</div>
    </div>
  `).join('');
  el.statsGrid.innerHTML = cards;
}

function renderUpcoming() {
  el.upcomingServices.innerHTML = appState.services.map((service) => `
    <li>
      <div>
        <h5>${service.title}</h5>
        <p>${service.date}</p>
      </div>
      <small>${service.assignee}</small>
    </li>
  `).join('');
}

function renderNotifications() {
  el.notificationList.innerHTML = appState.notifications.map((item) => `
    <li>
      <div>
        <h5>${item.title}</h5>
        <p>${item.detail}</p>
      </div>
    </li>
  `).join('');
  el.notificationCount.textContent = String(appState.notifications.length);
}

function renderAbsenceSummary() {
  el.absenceSummary.innerHTML = appState.absences.slice(0, 3).map((item) => `
    <li>
      <div>
        <h5>${item.service}</h5>
        <p>${item.startDate} bis ${item.endDate}</p>
      </div>
      <span class="status-tag ${formatStatus(item.status)}">${item.status}</span>
    </li>
  `).join('');
}

function renderMessagesSummary() {
  const unread = appState.messages.filter((msg) => !msg.read).length;
  el.messageSummary.innerHTML = appState.messages.slice(0, 3).map((item) => `
    <li>
      <div>
        <h5>${item.title}</h5>
        <p>${item.detail}</p>
      </div>
      <small>${item.read ? 'Gelesen' : 'Neu'}</small>
    </li>
  `).join('');

  appState.stats[3].value = unread + appState.messages.length;
  appState.stats[3].delta = `${unread} neu`;
}

function renderAbsenceTable() {
  const rows = appState.absences.map((item) => `
    <tr>
      <td>${item.startDate}</td>
      <td>${item.endDate}</td>
      <td>${item.service}</td>
      <td>${item.note || '-'}</td>
      <td><span class="status-tag ${formatStatus(item.status)}">${item.status}</span></td>
    </tr>
  `).join('');

  el.absenceTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Beginn</th>
          <th>Ende</th>
          <th>Dienst</th>
          <th>Mitteilung</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderSchedule() {
  const rows = appState.services.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.title}</td>
      <td>${item.date}</td>
      <td>${item.assignee}</td>
      <td><span class="status-tag bestätigt">Aktiv</span></td>
    </tr>
  `).join('');

  el.scheduleTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Dienst</th>
          <th>Termin</th>
          <th>Verantwortlich</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  el.swapList.innerHTML = appState.swapRequests.map((item) => `
    <li>
      <div>
        <h5>${item.title}</h5>
        <p>${item.detail}</p>
      </div>
      <small>${item.state}</small>
    </li>
  `).join('');
}

function renderIncidents() {
  const rows = appState.incidents.map((item) => `
    <tr>
      <td>${item.building}</td>
      <td>${item.type}</td>
      <td>${item.datetime}</td>
      <td>${item.meetingPoint || '-'}</td>
      <td><span class="status-tag ${formatStatus(item.status)}">${item.status}</span></td>
    </tr>
  `).join('');

  el.incidentTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Ort</th>
          <th>Art</th>
          <th>Zeitpunkt</th>
          <th>Treffpunkt</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderMaterials() {
  const rows = appState.materials.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.location}</td>
      <td>${item.stock}</td>
      <td>${item.checkDate}</td>
      <td><span class="status-tag ${item.status === 'Gut' ? 'bestätigt' : item.status === 'Prüfen' ? 'vertretung' : 'neu'}">${item.status}</span></td>
    </tr>
  `).join('');

  el.materialTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Material</th>
          <th>Standort</th>
          <th>Bestand</th>
          <th>Kontrolle</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderMessages() {
  el.messageList.innerHTML = appState.messages.map((item, index) => `
    <li>
      <div>
        <h5>${item.title}</h5>
        <p>${item.detail}</p>
      </div>
      <button class="small-btn" data-index="${index}">${item.read ? 'Gelesen' : 'Lesen'}</button>
    </li>
  `).join('');

  el.archiveList.innerHTML = appState.messages.filter((item) => item.read).slice(0, 3).map((item) => `
    <li>
      <div>
        <h5>${item.title}</h5>
        <p>${item.detail}</p>
      </div>
    </li>
  `).join('');

  document.querySelectorAll('.small-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      appState.messages[index].read = true;
      saveState();
      renderAll();
    });
  });
}

function renderRole() {
  const role = appState.currentRole;
  el.roleSelector.value = role;
  const nameMap = {
    member: 'Mara Schneider',
    kursleitung: 'Leonie Hartmann',
    sekretariat: 'Sandra König',
  };
  const roleMap = {
    member: 'SSD-Mitglied',
    kursleitung: 'SSD-Kursleitung',
    sekretariat: 'Sekretariat',
  };
  el.userName.textContent = nameMap[role];
  appState.user.name = nameMap[role];
  appState.user.role = roleMap[role];
}

function setPanel(targetId) {
  el.panels.forEach((panel) => panel.classList.toggle('active', panel.id === targetId));
  el.navLinks.forEach((link) => link.classList.toggle('active', link.dataset.target === targetId));
}

function renderAll() {
  renderRole();
  renderStats();
  renderUpcoming();
  renderNotifications();
  renderAbsenceSummary();
  renderMessagesSummary();
  renderAbsenceTable();
  renderSchedule();
  renderIncidents();
  renderMaterials();
  renderMessages();
}

el.roleSelector.addEventListener('change', (event) => {
  appState.currentRole = event.target.value;
  saveState();
  renderAll();
});

el.navLinks.forEach((button) => {
  button.addEventListener('click', () => {
    setPanel(button.dataset.target);
  });
});

el.absenceForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const newEntry = {
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    service: formData.get('service'),
    note: formData.get('note') || '',
    status: 'Neu',
  };
  appState.absences.unshift(newEntry);
  saveState();
  renderAll();
  event.currentTarget.reset();
});

el.incidentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const newIncident = {
    building: formData.get('building'),
    section: formData.get('section') || '-',
    floor: formData.get('floor') || '-',
    room: formData.get('room') || '-',
    meetingPoint: formData.get('meetingPoint') || '-',
    type: formData.get('type'),
    datetime: formData.get('datetime'),
    orientation: formData.get('orientation') || '-',
    status: 'Eingegangen',
  };
  appState.incidents.unshift(newIncident);
  appState.notifications.unshift({
    title: 'Neue Meldung',
    detail: `${newIncident.type} für ${newIncident.building}`,
  });
  saveState();
  renderAll();
  event.currentTarget.reset();
});

el.materialForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  appState.materials.unshift({
    name: formData.get('name'),
    location: formData.get('location'),
    stock: Number(formData.get('stock')), 
    checkDate: formData.get('checkDate'),
    status: Number(formData.get('stock')) > 5 ? 'Gut' : 'Prüfen',
  });
  saveState();
  renderAll();
  event.currentTarget.reset();
});

renderAll();
setPanel('dashboard-section');

if (globalThis.window) {
  window.addEventListener('storage', () => {
    renderAll();
  });
}
