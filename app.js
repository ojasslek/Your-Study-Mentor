

import { DoubtSolver } from "./modules/doubtSolver.js?v=2";
import { VideoLibrary } from "./modules/videos.js?v=5";
import { FocusMode } from "./modules/focusMode.js?v=7";
import { StudyPlanner } from "./modules/planner.js?v=2";
import { ResourcesVault } from "./modules/resources.js";

class AppState {
  constructor() {
    this.apiKey = localStorage.getItem("mentor_gemini_api_key") || "YOUR_API_KEY_HERE";
    this.stats = JSON.parse(localStorage.getItem("mentor_stats")) || {
      sessions: 0,
      doubts: 0,
      tasksPercentage: 0
    };
  }

  getApiKey() {
    return this.apiKey;
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem("mentor_gemini_api_key", key);
    this.syncApiIndicator();
  }

  clearApiKey() {
    this.apiKey = "";
    localStorage.removeItem("mentor_gemini_api_key");
    this.syncApiIndicator();
  }

  incrementStat(statKey) {
    if (this.stats[statKey] !== undefined) {
      this.stats[statKey]++;
      this.saveStats();
      this.renderStatsUI();
    }
  }

  updatePercentageStat(percentage) {
    this.stats.tasksPercentage = percentage;
    this.saveStats();
    this.renderStatsUI();
  }

  saveStats() {
    localStorage.setItem("mentor_stats", JSON.stringify(this.stats));
  }

  renderStatsUI() {
    const elSessions = document.getElementById("stat-sessions");
    const elDoubts = document.getElementById("stat-doubts");
    const elTasks = document.getElementById("stat-tasks");

    if (elSessions) elSessions.innerText = this.stats.sessions;
    if (elDoubts) elDoubts.innerText = this.stats.doubts;
    if (elTasks) elTasks.innerText = `${this.stats.tasksPercentage}%`;
  }

  syncApiIndicator() {}
}


document.addEventListener("DOMContentLoaded", () => {
  const state = new AppState();
  state.renderStatsUI();
  state.syncApiIndicator();

  
  const doubtSolver = new DoubtSolver(state);
  const videoLibrary = new VideoLibrary();
  const focusMode = new FocusMode(state);
  const studyPlanner = new StudyPlanner(state);
  const resourcesVault = new ResourcesVault();



  
  const navItems = document.querySelectorAll(".nav-item");
  const panels = document.querySelectorAll(".content-panel");

  const navigateTo = (panelName) => {
    
    navItems.forEach(item => {
      if (item.dataset.panel === panelName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    
    panels.forEach(panel => {
      if (panel.id === `panel-${panelName}`) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });
  };

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(item.dataset.panel);
    });
  });

  
  document.querySelectorAll(".level-card").forEach(card => {
    card.addEventListener("click", () => {
      const level = card.dataset.level;
      
      doubtSolver.switchMentor(level);
      
      navigateTo("doubt-solver");
    });
  });

  
  const timeDisplay = document.getElementById("live-time");
  const updateClock = () => {
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const paddedHours = hours.toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    timeDisplay.innerHTML = `<span style="color: #34A853">${paddedHours}</span>:<span style="color: #FBBC05">${minutes}</span>:<span style="color: #EA4335">${seconds}</span> ${ampm}`;
  };
  setInterval(updateClock, 1000);
  updateClock();

  
  const welcomeText = document.getElementById("welcome-text");
  const hours = new Date().getHours();
  let greeting = "Hi, Scholar!";
  if (hours < 12) greeting = "Good Morning, Scholar! ☀️";
  else if (hours < 17) greeting = "Good Afternoon, Scholar! 🌤️";
  else greeting = "Good Evening, Scholar! 🌙";
  welcomeText.innerText = greeting;

  
  const PALETTE_KEY = 'mentor_palette';
  const DARK_KEY    = 'mentor_dark';
  const gearBtn     = document.getElementById('gear-btn');
  const panel       = document.getElementById('settings-panel');
  const backdrop    = document.getElementById('settings-backdrop');
  const closeBtn    = document.getElementById('settings-close');
  const darkToggle  = document.getElementById('theme-toggle');

  
  applyPalette(localStorage.getItem(PALETTE_KEY) || 'blue');

  
  if (localStorage.getItem(DARK_KEY) === 'true') {
    document.body.classList.add('dark-mode');
    if (darkToggle) darkToggle.querySelector('i').className = 'ph ph-sun';
  }

  
  gearBtn.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');
    panel.classList.toggle('open', !isOpen);
    backdrop.classList.toggle('open', !isOpen);
    gearBtn.classList.toggle('active', !isOpen);
  });

  [closeBtn, backdrop].forEach(el => el.addEventListener('click', closePanel));

  function closePanel() {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
    gearBtn.classList.remove('active');
  }

  
  document.querySelectorAll('.st-card').forEach(btn => {
    btn.addEventListener('click', () => {
      applyPalette(btn.dataset.theme);
      localStorage.setItem(PALETTE_KEY, btn.dataset.theme);
    });
  });

  function applyPalette(palette) {
    document.documentElement.setAttribute('data-palette', palette);
    document.querySelectorAll('.st-card').forEach(b => {
      b.classList.toggle('active', b.dataset.theme === palette);
    });
  }

  
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      darkToggle.querySelector('i').className = isDark ? 'ph ph-sun' : 'ph ph-moon';
      localStorage.setItem(DARK_KEY, isDark);
    });
  }

});


