/* =============================================
   SmartBiz – app.js
   Shared utilities, navigation, UI helpers
   ============================================= */

// ─── Sidebar Toggle ─────────────────────────────
(function initSidebar() {
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebarOverlay');
  const menuBtn   = document.getElementById('menuBtn');
  if (!sidebar) return;

  function openSidebar() {
    sidebar.classList.add('open');
    overlay && overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay && overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuBtn  && menuBtn.addEventListener('click', openSidebar);
  overlay  && overlay.addEventListener('click', closeSidebar);
})();

// ─── Active Nav ──────────────────────────────────
(function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    if (item.dataset.page === page) item.classList.add('active');
  });
})();

// ─── Live Date/Time ──────────────────────────────
(function updateDateTime() {
  const el = document.getElementById('headerDate');
  if (!el) return;
  function tick() {
    const now  = new Date();
    const opts = { weekday:'short', month:'short', day:'numeric', year:'numeric' };
    el.textContent = now.toLocaleDateString('en-IN', opts);
  }
  tick();
  setInterval(tick, 60000);
})();

// ─── Toast ───────────────────────────────────────
window.showToast = function(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', warning: '⚠️', danger: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOut .35s ease forwards';
    setTimeout(() => toast.remove(), 350);
  }, duration);
};

// ─── Modal helpers ───────────────────────────────
window.openModal  = id => document.getElementById(id)?.classList.add('open');
window.closeModal = id => document.getElementById(id)?.classList.remove('open');

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
  if (e.target.classList.contains('modal-close')) {
    e.target.closest('.modal-overlay')?.classList.remove('open');
  }
});

// ─── Table Search ────────────────────────────────
window.initTableSearch = function(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  if (!input || !table) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
};

// ─── Confirm Delete ──────────────────────────────
window.confirmDelete = function(message) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.innerHTML = `
      <div class="modal" style="max-width:400px">
        <div class="modal-header">
          <h3 class="modal-title" style="color:var(--danger)">⚠️ Confirm Delete</h3>
        </div>
        <div class="modal-body">
          <p style="color:var(--text-secondary);font-size:.9rem">${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="cancelBtn">Cancel</button>
          <button class="btn btn-danger" id="confirmBtn">Delete</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#cancelBtn').onclick  = () => { overlay.remove(); resolve(false); };
    overlay.querySelector('#confirmBtn').onclick = () => { overlay.remove(); resolve(true);  };
  });
};

// ─── Export table to CSV ─────────────────────────
window.exportTableCSV = function(tableId, filename) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const rows  = [...table.querySelectorAll('tr')];
  const csv   = rows.map(row =>
    [...row.querySelectorAll('th,td')]
      .map(cell => `"${cell.textContent.replace(/"/g,'""').trim()}"`)
      .join(',')
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename || 'export.csv' });
  a.click();
  URL.revokeObjectURL(url);
  showToast('Table exported as CSV!', 'success');
};

// ─── Format currency ─────────────────────────────
window.formatCurrency = n => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });
window.formatNumber   = n => Number(n).toLocaleString('en-IN');

// ─── Chart default options ────────────────────────
window.chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: { family: 'Inter', size: 12 },
        color: '#6B7280',
        boxWidth: 12,
        padding: 16,
      }
    },
    tooltip: {
      backgroundColor: '#111827',
      titleFont: { family: 'Inter', weight: '600', size: 13 },
      bodyFont:  { family: 'Inter', size: 12 },
      padding: 12,
      cornerRadius: 10,
      caretSize: 6,
    }
  },
  animation: { duration: 900, easing: 'easeInOutQuart' }
};
