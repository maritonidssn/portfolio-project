/* =========================================================
   DATA
========================================================= */
const quizData = JSON.parse(localStorage.getItem('portfolio-quizzes') || '[]');

const assignmentsData = JSON.parse(localStorage.getItem('portfolio-assignments') || '[]');

const examsData = JSON.parse(localStorage.getItem('portfolio-exams') || '[]');

const quizGrid = document.getElementById('quizGrid');
const assignmentsGrid = document.getElementById('assignmentsGrid');
const examsTableBody = document.querySelector('#examsTable tbody');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

function renderQuiz() {
  quizGrid.innerHTML = quizData.map((item, index) => `<div class="quiz-card"><div class="quiz-card-inner"><div class="quiz-face quiz-front"><span class="quiz-tag">QUIZ #${item.tag || index + 1}</span><p class="quiz-q">School quiz result</p><span class="quiz-hint">Click to reveal score</span><button class="quiz-remove" type="button" data-index="${index}">REMOVE</button></div><div class="quiz-face quiz-back"><span class="quiz-tag">SCORE</span><p class="quiz-a">${item.score || 'Not graded'}</p><span class="quiz-hint">Click to flip back</span><button class="quiz-remove" type="button" data-index="${index}">REMOVE</button></div></div></div>`).join('');
  quizGrid.querySelectorAll('.quiz-card').forEach(card => card.addEventListener('click', () => card.classList.toggle('flipped')));
  quizGrid.querySelectorAll('.quiz-remove').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    quizData.splice(Number(button.dataset.index), 1);
    saveData('portfolio-quizzes', quizData);
    renderQuiz();
  }));
}

function renderAssignments() {
  assignmentsGrid.innerHTML = assignmentsData.map((item, index) => `<div class="assign-card"><div class="assign-thumb" data-code="${String(index + 1).padStart(2, '0')}"><div class="assign-overlay">ASSIGNMENT</div></div><div class="assign-body"><p class="assign-title">${item.title}</p><div class="progress-label"><span>SCORE</span><span>${item.score || 'Not graded'}</span></div></div></div>`).join('');
}

function renderExams() {
  examsTableBody.innerHTML = examsData.map(item => `<tr><td>${item.period}</td><td>${item.date}</td><td>${item.score}</td></tr>`).join('');
}

renderQuiz();
renderAssignments();
renderExams();

document.getElementById('quizForm').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.target); quizData.push({ tag: form.get('tag'), score: form.get('score') }); saveData('portfolio-quizzes', quizData); renderQuiz(); event.target.reset(); });
document.getElementById('assignmentForm').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.target); assignmentsData.push({ title: form.get('title'), score: form.get('score') }); saveData('portfolio-assignments', assignmentsData); renderAssignments(); event.target.reset(); });
document.getElementById('examForm').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.target); examsData.push({ period: form.get('period'), date: form.get('date'), score: form.get('score') }); saveData('portfolio-exams', examsData); renderExams(); event.target.reset(); });

window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40), { passive:true });
navToggle.addEventListener('click', () => { navToggle.classList.toggle('open'); navLinks.classList.toggle('open'); });

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* Active link highlight on scroll */
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(sec => navObserver.observe(sec));

/* =========================================================
   SCROLL REVEAL
========================================================= */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

/* Stagger the assignment/quiz cards + trigger progress bars on view */
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.progress-fill');
      if (fill) fill.style.width = fill.dataset.progress + '%';
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.assign-card').forEach(card => progressObserver.observe(card));

/* =========================================================
   CURSOR GLOW
========================================================= */
const glow = document.getElementById('cursorGlow');
if (window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  }, { passive:true });
}