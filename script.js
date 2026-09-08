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
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[character]);

function showInlineEditor(button, fields, onSave) {
  const actions = button.closest('.record-actions');
  if (actions.querySelector('.record-edit-form')) return;
  button.disabled = true;
  const form = document.createElement('form');
  form.className = 'record-edit-form';
  fields.forEach(field => {
    const input = document.createElement('input');
    input.name = field.name;
    input.value = field.value;
    input.placeholder = field.label;
    input.setAttribute('aria-label', field.label);
    input.required = true;
    form.append(input);
  });
  form.insertAdjacentHTML('beforeend', '<button type="submit">SAVE</button><button type="button" data-cancel>CANCEL</button>');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    onSave(values);
  });
  form.querySelector('[data-cancel]').addEventListener('click', () => {
    form.remove();
    button.disabled = false;
  });
  actions.append(form);
}

function renderQuiz() {
  if (!quizGrid) return;
  quizGrid.innerHTML = quizData.map((item, index) => `<div class="quiz-card"><div class="quiz-card-inner"><div class="quiz-face quiz-front"><span class="quiz-tag">QUIZ #${escapeHtml(item.tag || index + 1)}</span><p class="quiz-q">School quiz result</p><span class="quiz-hint">Click to reveal score</span><div class="record-actions"><button class="record-edit" type="button" data-index="${index}">EDIT</button><button class="quiz-remove" type="button" data-index="${index}">REMOVE</button></div></div><div class="quiz-face quiz-back"><span class="quiz-tag">SCORE</span><p class="quiz-a">${escapeHtml(item.score || 'Not graded')}</p><span class="quiz-hint">Click to flip back</span><div class="record-actions"><button class="record-edit" type="button" data-index="${index}">EDIT</button><button class="quiz-remove" type="button" data-index="${index}">REMOVE</button></div></div></div></div>`).join('');
  quizGrid.querySelectorAll('.quiz-card').forEach(card => card.addEventListener('click', () => card.classList.toggle('flipped')));
  quizGrid.querySelectorAll('.record-edit').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    const index = Number(button.dataset.index);
    showInlineEditor(button, [
      { name: 'tag', label: 'Quiz number', value: quizData[index].tag },
      { name: 'score', label: 'Score', value: quizData[index].score }
    ], values => {
      quizData[index].tag = values.tag;
      quizData[index].score = values.score;
      saveData('portfolio-quizzes', quizData);
      renderQuiz();
    });
  }));
  quizGrid.querySelectorAll('.quiz-remove').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    quizData.splice(Number(button.dataset.index), 1);
    saveData('portfolio-quizzes', quizData);
    renderQuiz();
  }));
}

function renderAssignments() {
  if (!assignmentsGrid) return;
  assignmentsGrid.innerHTML = assignmentsData.map((item, index) => `<div class="assign-card"><div class="assign-thumb" data-code="${String(index + 1).padStart(2, '0')}"><div class="assign-overlay">ASSIGNMENT</div></div><div class="assign-body"><p class="assign-title">${escapeHtml(item.title)}</p><div class="progress-label"><span>SCORE</span><span>${escapeHtml(item.score || 'Not graded')}</span></div><div class="record-actions"><button class="record-edit" type="button" data-index="${index}">EDIT</button><button class="record-remove" type="button" data-index="${index}">REMOVE</button></div></div></div>`).join('');
  assignmentsGrid.querySelectorAll('.record-edit').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.index);
    showInlineEditor(button, [
      { name: 'title', label: 'Assignment title', value: assignmentsData[index].title },
      { name: 'score', label: 'Score', value: assignmentsData[index].score }
    ], values => {
      assignmentsData[index].title = values.title;
      assignmentsData[index].score = values.score;
      saveData('portfolio-assignments', assignmentsData);
      renderAssignments();
    });
  }));
  assignmentsGrid.querySelectorAll('.record-remove').forEach(button => button.addEventListener('click', () => {
    assignmentsData.splice(Number(button.dataset.index), 1);
    saveData('portfolio-assignments', assignmentsData);
    renderAssignments();
  }));
}

function renderExams() {
  if (!examsTableBody) return;
  examsTableBody.innerHTML = examsData.map((item, index) => `<tr><td>${escapeHtml(item.period)}</td><td>${escapeHtml(item.date)}</td><td>${escapeHtml(item.score)}</td><td class="record-actions"><button class="record-edit" type="button" data-index="${index}">EDIT</button><button class="record-remove" type="button" data-index="${index}">REMOVE</button></td></tr>`).join('');
  examsTableBody.querySelectorAll('.record-edit').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.index);
    showInlineEditor(button, [
      { name: 'period', label: 'Exam period', value: examsData[index].period },
      { name: 'date', label: 'Exam date', value: examsData[index].date },
      { name: 'score', label: 'Score', value: examsData[index].score }
    ], values => {
      examsData[index].period = values.period;
      examsData[index].date = values.date;
      examsData[index].score = values.score;
      saveData('portfolio-exams', examsData);
      renderExams();
    });
  }));
  examsTableBody.querySelectorAll('.record-remove').forEach(button => button.addEventListener('click', () => {
    examsData.splice(Number(button.dataset.index), 1);
    saveData('portfolio-exams', examsData);
    renderExams();
  }));
}

renderQuiz();
renderAssignments();
renderExams();

const quizForm = document.getElementById('quizForm');
if (quizForm) quizForm.addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.target); quizData.push({ tag: form.get('tag'), score: form.get('score') }); saveData('portfolio-quizzes', quizData); renderQuiz(); event.target.reset(); });
const assignmentForm = document.getElementById('assignmentForm');
if (assignmentForm) assignmentForm.addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.target); assignmentsData.push({ title: form.get('title'), score: form.get('score') }); saveData('portfolio-assignments', assignmentsData); renderAssignments(); event.target.reset(); });
const examForm = document.getElementById('examForm');
if (examForm) examForm.addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.target); examsData.push({ period: form.get('period'), date: form.get('date'), score: form.get('score') }); saveData('portfolio-exams', examsData); renderExams(); event.target.reset(); });

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

/* Laboratory PDF upload, persistence, and inline preview */
const laboratoryForm = document.getElementById('laboratoryForm');
const laboratoryFiles = document.getElementById('laboratoryFiles');
const laboratoryFileName = document.getElementById('laboratoryFileName');
const laboratoryEmpty = document.getElementById('laboratoryEmpty');
const laboratoryPreviews = document.getElementById('laboratoryPreviews');
const laboratoryDatabaseName = 'portfolio-laboratory-files';
const laboratoryStoreName = 'files';
let laboratoryDatabase;
let laboratoryObjectUrls = [];

function openLaboratoryDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(laboratoryDatabaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(laboratoryStoreName, { keyPath: 'id', autoIncrement: true });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function saveLaboratoryFile(file) {
  return new Promise((resolve, reject) => {
    const transaction = laboratoryDatabase.transaction(laboratoryStoreName, 'readwrite');
    transaction.objectStore(laboratoryStoreName).add({
      name: file.name,
      size: file.size,
      type: file.type,
      blob: file,
      createdAt: Date.now()
    });
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

function getLaboratoryFiles() {
  return new Promise((resolve, reject) => {
    const transaction = laboratoryDatabase.transaction(laboratoryStoreName, 'readonly');
    const request = transaction.objectStore(laboratoryStoreName).getAll();
    request.onsuccess = () => resolve(request.result.sort((a, b) => a.createdAt - b.createdAt));
    request.onerror = () => reject(request.error);
  });
}

function renderLaboratoryFile(file) {
  const objectUrl = URL.createObjectURL(file.blob);
  laboratoryObjectUrls.push(objectUrl);
  const preview = document.createElement('article');
  preview.className = 'laboratory-file reveal in-view';
  preview.innerHTML = `<div class="laboratory-file-head"><div><span class="laboratory-file-type">PDF FILE</span><h3></h3></div><span class="laboratory-file-size"></span></div><embed type="application/pdf"><a class="laboratory-file-link" target="_blank" rel="noopener">OPEN IN NEW TAB</a>`;
  preview.querySelector('h3').textContent = file.name;
  preview.querySelector('.laboratory-file-size').textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  preview.querySelector('embed').src = objectUrl;
  preview.querySelector('.laboratory-file-link').href = objectUrl;
  laboratoryPreviews.prepend(preview);
  laboratoryEmpty.hidden = true;
}

async function loadLaboratoryFiles() {
  try {
    laboratoryDatabase = await openLaboratoryDatabase();
    const files = await getLaboratoryFiles();
    files.forEach(renderLaboratoryFile);
  } catch (error) {
    console.error('Unable to load saved laboratory files.', error);
  }
}

if (laboratoryPreviews) loadLaboratoryFiles();

if (laboratoryFiles) laboratoryFiles.addEventListener('change', () => {
  const fileCount = laboratoryFiles.files.length;
  laboratoryFileName.textContent = fileCount ? `${fileCount} PDF${fileCount === 1 ? '' : 's'} selected` : 'PDF format only · multiple files allowed';
  laboratoryFileName.classList.toggle('selected', fileCount > 0);
});

if (laboratoryForm) laboratoryForm.addEventListener('submit', async event => {
  event.preventDefault();
  const files = Array.from(laboratoryFiles.files).filter(file => file.type === 'application/pdf');
  if (!files.length || !laboratoryDatabase) return;

  try {
    for (const file of files) {
      await saveLaboratoryFile(file);
      renderLaboratoryFile({ name: file.name, size: file.size, blob: file });
    }
  } catch (error) {
    console.error('Unable to save laboratory files.', error);
  }
  laboratoryForm.reset();
  laboratoryFileName.textContent = 'PDF format only · multiple files allowed';
  laboratoryFileName.classList.remove('selected');
});

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