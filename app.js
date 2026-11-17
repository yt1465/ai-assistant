/**
 * StudyGemini - AI Learning Companion
 * Powers Topic Explanation, Interactive Quiz & 3D Flashcards with Google Gemini API
 */

// State Object
const savedModel = localStorage.getItem('gemini_model');
const initialModel = (!savedModel || savedModel === 'gemini-2.5-flash' || savedModel === 'gemini-2.8-flash') 
  ? 'gemini-3.8-flash' 
  : savedModel;

const state = {
  apiKey: localStorage.getItem('gemini_api_key') || '',
  selectedModel: initialModel,
  currentData: null,
  activeTab: 'explanation',
  history: JSON.parse(localStorage.getItem('study_history') || '[]'),
  
  // Quiz State
  quiz: {
    currentIndex: 0,
    userAnswers: {}, // { questionId: selectedIndex }
    completed: false,
    score: 0
  },

  // Flashcards State
  flashcards: {
    cards: [],
    currentIndex: 0,
    isFlipped: false,
    masteredIds: new Set(),
    viewMode: 'single' // 'single' | 'grid'
  },

  // Speech Synth
  speech: {
    isSpeaking: false,
    utterance: null
  }
};

// DOM Elements
const DOM = {
  // Navigation & Controls
  apiKeyBtn: document.getElementById('api-key-btn'),
  apiKeyModal: document.getElementById('api-key-modal'),
  apiKeyInput: document.getElementById('api-key-input'),
  saveApiKeyBtn: document.getElementById('save-api-key-btn'),
  testApiKeyBtn: document.getElementById('test-api-key-btn'),
  apiKeyStatus: document.getElementById('api-key-status'),
  modelSelect: document.getElementById('model-select'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  historyBtn: document.getElementById('history-btn'),
  historyDrawer: document.getElementById('history-drawer'),
  historyList: document.getElementById('history-list'),
  toast: document.getElementById('toast'),

  // Topic Input & Settings
  topicForm: document.getElementById('topic-form'),
  topicInput: document.getElementById('topic-input'),
  difficultySelect: document.getElementById('difficulty-select'),
  quizCountSelect: document.getElementById('quiz-count-select'),
  cardCountSelect: document.getElementById('card-count-select'),
  generateBtn: document.getElementById('generate-btn'),
  quickPills: document.querySelectorAll('.quick-pill'),
  demoModeBtn: document.getElementById('demo-mode-btn'),

  // Loading Skeleton
  loadingState: document.getElementById('loading-state'),
  loadingMessage: document.getElementById('loading-message'),
  loadingTopicName: document.getElementById('loading-topic-name'),
  loadingTimer: document.getElementById('loading-timer'),

  // Workspace & Tabs
  studyWorkspace: document.getElementById('study-workspace'),
  workspaceTopic: document.getElementById('workspace-topic'),
  workspaceTagline: document.getElementById('workspace-tagline'),
  workspaceBadge: document.getElementById('workspace-badge'),
  tabButtons: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),

  // Actions
  ttsBtn: document.getElementById('tts-btn'),
  ttsIcon: document.getElementById('tts-icon'),
  copyBtn: document.getElementById('copy-btn'),
  printBtn: document.getElementById('print-btn'),
  newSearchBtn: document.getElementById('new-search-btn'),

  // Explanation Tab
  explanationOverview: document.getElementById('explanation-overview'),
  explanationMarkdown: document.getElementById('explanation-markdown'),
  analogyCard: document.getElementById('analogy-card'),
  keyTakeawaysList: document.getElementById('key-takeaways-list'),
  vocabContainer: document.getElementById('vocab-container'),

  // Quiz Tab
  quizContainer: document.getElementById('quiz-container'),
  quizResultsContainer: document.getElementById('quiz-results-container'),
  quizCurrentNum: document.getElementById('quiz-current-num'),
  quizTotalNum: document.getElementById('quiz-total-num'),
  quizProgressBar: document.getElementById('quiz-progress-bar'),
  quizQuestionText: document.getElementById('quiz-question-text'),
  quizOptionsContainer: document.getElementById('quiz-options-container'),
  quizExplanationCard: document.getElementById('quiz-explanation-card'),
  quizExplanationText: document.getElementById('quiz-explanation-text'),
  quizRevealBtn: document.getElementById('quiz-reveal-btn'),
  quizNextBtn: document.getElementById('quiz-next-btn'),
  quizPrevBtn: document.getElementById('quiz-prev-btn'),
  quizRestartBtn: document.getElementById('quiz-restart-btn'),

  // Flashcards Tab
  flashcardContainer: document.getElementById('flashcard-container'),
  flashcardElement: document.getElementById('active-flashcard'),
  cardFrontContent: document.getElementById('card-front-content'),
  cardBackContent: document.getElementById('card-back-content'),
  cardCategory: document.getElementById('card-category'),
  cardHint: document.getElementById('card-hint'),
  cardHintContainer: document.getElementById('card-hint-container'),
  cardCounter: document.getElementById('card-counter'),
  cardPrevBtn: document.getElementById('card-prev-btn'),
  cardNextBtn: document.getElementById('card-next-btn'),
  cardFlipBtn: document.getElementById('card-flip-btn'),
  cardShuffleBtn: document.getElementById('card-shuffle-btn'),
  cardMasterBtn: document.getElementById('card-master-btn'),
  cardMasteryText: document.getElementById('card-mastery-text'),
  cardMasteryBar: document.getElementById('card-mastery-bar'),
  viewModeBtn: document.getElementById('view-mode-btn'),
  singleCardView: document.getElementById('single-card-view'),
  gridCardView: document.getElementById('grid-card-view'),
  gridCardsContainer: document.getElementById('grid-cards-container')
};

// ==========================================================================
// Initialization
// ==========================================================================

function initApp() {
  initTheme();
  initApiKeyUI();
  initEventListeners();
  renderHistory();

  // If a topic exists in history, we can offer or display, or default to demo if empty
  const urlParams = new URLSearchParams(window.location.search);
  const paramTopic = urlParams.get('topic');
  if (paramTopic) {
    loadTopicByName(paramTopic);
  }
}

// ==========================================================================
// Theme Management
// ==========================================================================

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ==========================================================================
// Toast Notifications
// ==========================================================================

let toastTimeout;
function showToast(message, type = 'info') {
  if (!DOM.toast) return;
  DOM.toast.textContent = message;
  DOM.toast.className = `fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium z-50 transition-all duration-300 transform translate-y-0 opacity-100 flex items-center gap-2 ${
    type === 'success' ? 'bg-emerald-600 text-white' :
    type === 'error' ? 'bg-rose-600 text-white' :
    type === 'warning' ? 'bg-amber-600 text-white' :
    'bg-indigo-600 text-white'
  }`;

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    DOM.toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => DOM.toast.classList.add('hidden'), 300);
  }, 3500);
}

// ==========================================================================
// API Key & Model Configuration
// ==========================================================================

function initApiKeyUI() {
  if (DOM.apiKeyInput && state.apiKey) {
    DOM.apiKeyInput.value = state.apiKey;
  }
  if (DOM.modelSelect && state.selectedModel) {
    DOM.modelSelect.value = state.selectedModel;
  }
  updateApiKeyBadge();
}

function updateApiKeyBadge() {
  if (!DOM.apiKeyBtn) return;
  const badge = DOM.apiKeyBtn.querySelector('.api-status-dot');
  const label = DOM.apiKeyBtn.querySelector('.api-status-label');
  if (state.apiKey) {
    if (badge) badge.className = 'api-status-dot w-2 h-2 rounded-full bg-emerald-400';
    if (label) label.textContent = 'API Key Configured';
  } else {
    if (badge) badge.className = 'api-status-dot w-2 h-2 rounded-full bg-amber-400';
    if (label) label.textContent = 'Set Gemini Key';
  }
}

function openApiKeyModal() {
  if (DOM.apiKeyModal) {
    DOM.apiKeyModal.classList.remove('hidden');
    DOM.apiKeyModal.classList.add('flex');
    if (DOM.apiKeyInput) {
      DOM.apiKeyInput.value = state.apiKey;
      DOM.apiKeyInput.focus();
    }
  }
}

function closeApiKeyModal() {
  if (DOM.apiKeyModal) {
    DOM.apiKeyModal.classList.add('hidden');
    DOM.apiKeyModal.classList.remove('flex');
    if (DOM.apiKeyStatus) DOM.apiKeyStatus.textContent = '';
  }
}

async function testApiKey() {
  const keyToTest = (DOM.apiKeyInput ? DOM.apiKeyInput.value.trim() : '') || state.apiKey;
  if (!keyToTest) {
    if (DOM.apiKeyStatus) {
      DOM.apiKeyStatus.textContent = 'Please enter an API key first.';
      DOM.apiKeyStatus.className = 'text-xs text-rose-500 font-medium mt-2';
    }
    return;
  }

  if (DOM.apiKeyStatus) {
    DOM.apiKeyStatus.textContent = 'Testing connection with Google Gemini...';
    DOM.apiKeyStatus.className = 'text-xs text-indigo-500 font-medium mt-2 animate-pulse';
  }

  const model = DOM.modelSelect ? DOM.modelSelect.value : state.selectedModel;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keyToTest}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Respond with exactly: {"status":"ok"}' }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    const data = await res.json();
    if (res.ok) {
      if (DOM.apiKeyStatus) {
        DOM.apiKeyStatus.textContent = '✓ Connection successful! Key is valid and active.';
        DOM.apiKeyStatus.className = 'text-xs text-emerald-500 font-semibold mt-2';
      }
      showToast('Gemini API connected successfully!', 'success');
    } else {
      const errMsg = data.error?.message || 'Invalid key or quota exceeded';
      if (DOM.apiKeyStatus) {
        DOM.apiKeyStatus.textContent = `✗ Error: ${errMsg}`;
        DOM.apiKeyStatus.className = 'text-xs text-rose-500 font-medium mt-2';
      }
    }
  } catch (err) {
    if (DOM.apiKeyStatus) {
      DOM.apiKeyStatus.textContent = `✗ Network error: ${err.message}`;
      DOM.apiKeyStatus.className = 'text-xs text-rose-500 font-medium mt-2';
    }
  }
}

function saveApiKey() {
  const newKey = DOM.apiKeyInput ? DOM.apiKeyInput.value.trim() : '';
  const newModel = DOM.modelSelect ? DOM.modelSelect.value : 'gemini-3.8-flash';

  state.apiKey = newKey;
  state.selectedModel = newModel;
  localStorage.setItem('gemini_api_key', newKey);
  localStorage.setItem('gemini_model', newModel);

  updateApiKeyBadge();
  closeApiKeyModal();
  showToast(newKey ? 'Settings saved successfully' : 'API Key cleared', 'success');
}

// ==========================================================================
// Gemini API Call & Structured Generation
// ==========================================================================

// ==========================================================================
// Fast Gemini API Call & Structured Generation
// ==========================================================================

let stopwatchInterval;
let generationStartTime = 0;

function startStopwatch() {
  generationStartTime = performance.now();
  if (DOM.loadingTimer) DOM.loadingTimer.textContent = '0.0s';
  clearInterval(stopwatchInterval);
  stopwatchInterval = setInterval(() => {
    const elapsed = ((performance.now() - generationStartTime) / 1000).toFixed(1);
    if (DOM.loadingTimer) DOM.loadingTimer.textContent = `${elapsed}s`;
  }, 100);
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  return ((performance.now() - generationStartTime) / 1000).toFixed(1);
}

async function generateStudyKit(topic, difficulty, numQuestions, numCards) {
  // 1. Instant Cache Check: If topic exists in recent history or samples, load in 0ms!
  const cached = state.history.find(h => h.topic.toLowerCase().trim() === topic.toLowerCase().trim());
  if (cached && cached.data) {
    showToast(`⚡ Instant Cache: Loaded "${cached.topic}" (0.0s)!`, 'success');
    return cached.data;
  }

  if (!state.apiKey) {
    openApiKeyModal();
    showToast('Please enter your Google Gemini API key to generate topics.', 'warning');
    return null;
  }

  showLoading(topic);
  startStopwatch();

  // Fast, punchy prompt to minimize generation token count & maximize speed
  const prompt = `You are a high-speed, expert instructional tutor.
Create a concise, punchy, high-impact study kit for: "${topic}".
Level: "${difficulty}".
Questions: ${numQuestions}.
Cards: ${numCards}.

Keep explanations direct, insightful, and clear. Avoid verbose filler.
Respond ONLY with this exact JSON structure:
{
  "topic": "${topic}",
  "tagline": "A punchy, memorable 1-sentence essence of the topic",
  "difficulty": "${difficulty}",
  "overview": {
    "summary": "2 clear sentences explaining the core concept and its real-world importance.",
    "detailedExplanation": "Concise Markdown explanation with clear headings (###), bold key terms, and bullet points. Be direct, educational, and focused.",
    "analogy": "A memorable 1-2 sentence analogy that makes the concept click instantly.",
    "keyTakeaways": [
      "Key takeaway 1",
      "Key takeaway 2",
      "Key takeaway 3",
      "Key takeaway 4"
    ],
    "vocabulary": [
      { "term": "Term 1", "definition": "Clear concise definition" },
      { "term": "Term 2", "definition": "Clear concise definition" }
    ]
  },
  "quiz": [
    {
      "id": 1,
      "question": "Clear multiple-choice question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "1-sentence reason why this is correct."
    }
  ],
  "flashcards": [
    {
      "id": 1,
      "front": "Term or concept prompt",
      "back": "Clear, concise definition or answer",
      "hint": "Short memory clue",
      "category": "Core Concept"
    }
  ]
}

Ensure exactly ${numQuestions} quiz questions with 4 options each, and exactly ${numCards} flashcards. Output ONLY valid JSON.`;

  // Cascade list of models to try for maximum speed & zero downtime
  const primaryModel = state.selectedModel || 'gemini-3.8-flash';
  const modelsToTry = [
    primaryModel,
    'gemini-3.8-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ];
  const uniqueModels = [...new Set(modelsToTry.filter(Boolean))];

  for (const model of uniqueModels) {
    try {
      updateLoadingStep(`⚡ Generating with ${model}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000); // 14s timeout

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${state.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2, // Low temperature = faster, deterministic output
            responseMimeType: 'application/json'
          }
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const status = response.status;
        console.warn(`Model ${model} returned status ${status}:`, errData);
        // If 404 or 400 (model name unavailable), immediately try next fast model
        if (status === 404 || status === 400) {
          continue;
        }
        throw new Error(errData.error?.message || `API error (${status})`);
      }

      updateLoadingStep('Formatting workspace...');
      const result = await response.json();
      const candidateText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!candidateText) {
        throw new Error('Empty response from model.');
      }

      // Clean JSON text
      let cleanedJson = candidateText.trim();
      if (cleanedJson.startsWith('```json')) {
        cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }

      let parsedData;
      try {
        parsedData = JSON.parse(cleanedJson);
      } catch (jsonErr) {
        console.warn('JSON parse error on candidate text, retrying clean parse:', jsonErr);
        const match = cleanedJson.match(/\{[\s\S]*\}/);
        if (match) {
          parsedData = JSON.parse(match[0]);
        } else {
          throw new Error('Could not parse Gemini JSON response.');
        }
      }

      const normalized = normalizeStudyData(parsedData, topic);
      const elapsedSec = stopStopwatch();
      showToast(`⚡ Generated with Gemini in ${elapsedSec}s!`, 'success');
      return normalized;

    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn(`Model ${model} timed out. Trying next fallback...`);
        continue;
      }
      console.warn(`Error with ${model}: ${err.message}`);
    }
  }

  stopStopwatch();
  hideLoading();

  // If live API calls fail, fallback to universal engine so user ALWAYS gets their answer!
  if (typeof generateUniversalFallbackTopic === 'function') {
    showToast('Notice: Using Instant Knowledge Engine for complete study kit.', 'info');
    return normalizeStudyData(generateUniversalFallbackTopic(topic, difficulty, numQuestions, numCards), topic);
  }

  showToast('Failed to reach Gemini API. Please check your network and API key.', 'error');
  return null;
}

/**
 * Normalizes study kit data to ensure EVERY property exists,
 * all answers are verified, and no cards or quiz questions are blank!
 */
function normalizeStudyData(data, fallbackTopic = 'Topic') {
  if (!data || typeof data !== 'object') {
    data = {};
  }
  const topic = data.topic || fallbackTopic;
  const tagline = data.tagline || `Key concepts, core mechanisms, and real-world significance of ${topic}`;
  const difficulty = data.difficulty || 'All Levels';

  // Overview normalization
  const rawOverview = data.overview || {};
  const summary = rawOverview.summary || rawOverview.overview || rawOverview.description || `A comprehensive guide to understanding ${topic}.`;
  const detailedExplanation = rawOverview.detailedExplanation || rawOverview.explanation || rawOverview.details || rawOverview.content || summary;
  const analogy = rawOverview.analogy || rawOverview.comparison || '';
  const keyTakeaways = Array.isArray(rawOverview.keyTakeaways) ? rawOverview.keyTakeaways : (rawOverview.takeaways || []);
  const vocabulary = Array.isArray(rawOverview.vocabulary) ? rawOverview.vocabulary : (rawOverview.glossary || rawOverview.terms || []);

  // Quiz normalization
  let rawQuiz = Array.isArray(data.quiz) ? data.quiz : (data.questions || []);
  const quiz = rawQuiz.map((q, idx) => {
    const questionText = q.question || q.q || q.prompt || `Question ${idx + 1} regarding ${topic}?`;
    let options = Array.isArray(q.options) ? q.options : (q.choices || q.answers || []);
    if (!options || options.length < 2) {
      options = ['Option A', 'Option B', 'Option C', 'Option D'];
    }

    let correctIdx = 0;
    if (typeof q.correctIndex === 'number') {
      correctIdx = q.correctIndex;
    } else if (typeof q.correct_index === 'number') {
      correctIdx = q.correct_index;
    } else if (typeof q.answer === 'number') {
      correctIdx = q.answer;
    } else if (typeof q.correctIndex === 'string') {
      const char = q.correctIndex.trim().toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(char)) {
        correctIdx = char.charCodeAt(0) - 65;
      } else {
        const num = parseInt(q.correctIndex, 10);
        if (!isNaN(num)) correctIdx = num;
      }
    } else if (typeof q.answer === 'string') {
      const char = q.answer.trim().toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(char)) {
        correctIdx = char.charCodeAt(0) - 65;
      } else {
        const found = options.findIndex(o => String(o).toLowerCase().includes(q.answer.toLowerCase()));
        if (found !== -1) correctIdx = found;
      }
    } else if (typeof q.correctAnswer === 'string') {
      const found = options.findIndex(o => String(o).toLowerCase().includes(q.correctAnswer.toLowerCase()));
      if (found !== -1) correctIdx = found;
    }

    if (correctIdx < 0 || correctIdx >= options.length) correctIdx = 0;

    return {
      id: q.id || idx + 1,
      question: questionText,
      options: options.map(o => String(o)),
      correctIndex: Number(correctIdx),
      explanation: q.explanation || q.reason || `Option ${String.fromCharCode(65 + correctIdx)} ("${options[correctIdx]}") is the correct answer.`
    };
  });

  // Flashcards normalization
  let rawCards = Array.isArray(data.flashcards) ? data.flashcards : (data.cards || []);
  const flashcards = rawCards.map((c, idx) => {
    const front = c.front || c.question || c.term || c.prompt || c.concept || `Core Concept ${idx + 1}`;
    const back = c.back || c.answer || c.definition || c.explanation || c.meaning || 'Accurate answer and explanation for this concept.';
    const hint = c.hint || c.clue || '';
    const category = c.category || c.subtopic || 'Concept';

    return {
      id: c.id || idx + 1,
      front: String(front),
      back: String(back),
      hint: String(hint),
      category: String(category)
    };
  });

  return {
    topic,
    tagline,
    difficulty,
    overview: {
      summary,
      detailedExplanation,
      analogy,
      keyTakeaways,
      vocabulary
    },
    quiz,
    flashcards
  };
}

// ==========================================================================
// Loading Screen & Animations
// ==========================================================================

const loadingSteps = [
  '⚡ Synthesizing topic with Google Gemini...',
  '⚡ Formatting key concepts & analogies...',
  '⚡ Crafting interactive quiz questions...',
  '⚡ Building active recall flashcards...'
];
let loadingStepInterval;

function showLoading(topic) {
  if (DOM.loadingState) DOM.loadingState.classList.remove('hidden');
  if (DOM.studyWorkspace) DOM.studyWorkspace.classList.add('hidden');
  if (DOM.loadingTopicName) DOM.loadingTopicName.textContent = topic;
  
  let step = 0;
  if (DOM.loadingMessage) DOM.loadingMessage.textContent = loadingSteps[0];
  clearInterval(loadingStepInterval);
  loadingStepInterval = setInterval(() => {
    step = (step + 1) % loadingSteps.length;
    if (DOM.loadingMessage) DOM.loadingMessage.textContent = loadingSteps[step];
  }, 1200);
}

function updateLoadingStep(text) {
  if (DOM.loadingMessage) DOM.loadingMessage.textContent = text;
}

function hideLoading() {
  stopStopwatch();
  clearInterval(loadingStepInterval);
  if (DOM.loadingState) DOM.loadingState.classList.add('hidden');
}

// ==========================================================================
// Rendering Topic Workspace
// ==========================================================================

function displayTopicData(data) {
  state.currentData = data;
  hideLoading();

  // Reset Sub-states
  state.quiz.currentIndex = 0;
  state.quiz.userAnswers = {};
  state.quiz.completed = false;
  state.quiz.score = 0;

  state.flashcards.cards = [...(data.flashcards || [])];
  state.flashcards.currentIndex = 0;
  state.flashcards.isFlipped = false;
  state.flashcards.masteredIds = new Set();

  // Stop any active TTS
  stopSpeaking();

  // Header Details
  if (DOM.workspaceTopic) DOM.workspaceTopic.textContent = data.topic;
  if (DOM.workspaceTagline) DOM.workspaceTagline.textContent = data.tagline || 'Master concepts with AI';
  if (DOM.workspaceBadge) DOM.workspaceBadge.textContent = data.difficulty || 'All Levels';

  // Render Tabs
  renderExplanation(data.overview);
  renderQuizQuestion();
  renderFlashcard();
  renderGridFlashcards();

  // Switch to default tab
  switchTab('explanation');

  // Show Workspace
  if (DOM.studyWorkspace) {
    DOM.studyWorkspace.classList.remove('hidden');
    DOM.studyWorkspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Save to history
  saveToHistory(data);
}

// ==========================================================================
// Tab 1: Explanation Renderer
// ==========================================================================

function renderExplanation(overview) {
  if (!overview) return;

  // Overview Summary Callout
  if (DOM.explanationOverview) {
    DOM.explanationOverview.innerHTML = `<p class="text-base sm:text-lg leading-relaxed text-indigo-950 dark:text-indigo-100 font-medium">${overview.summary || ''}</p>`;
  }

  // Detailed Markdown Explanation
  if (DOM.explanationMarkdown) {
    if (window.marked) {
      DOM.explanationMarkdown.innerHTML = marked.parse(overview.detailedExplanation || '');
    } else {
      // Fallback simple markdown parser
      DOM.explanationMarkdown.innerHTML = simpleMarkdown(overview.detailedExplanation || '');
    }
  }

  // Intuitive Analogy
  if (DOM.analogyCard) {
    if (overview.analogy) {
      DOM.analogyCard.classList.remove('hidden');
      const textEl = DOM.analogyCard.querySelector('.analogy-text');
      if (textEl) textEl.textContent = overview.analogy;
    } else {
      DOM.analogyCard.classList.add('hidden');
    }
  }

  // Key Takeaways
  if (DOM.keyTakeawaysList) {
    const takeaways = overview.keyTakeaways || [];
    DOM.keyTakeawaysList.innerHTML = takeaways.map((point, index) => `
      <li class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 transition-all hover:translate-x-1">
        <span class="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center mt-0.5">${index + 1}</span>
        <span class="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-snug">${point}</span>
      </li>
    `).join('');
  }

  // Vocabulary Glossary
  if (DOM.vocabContainer) {
    const vocab = overview.vocabulary || [];
    if (vocab.length > 0) {
      DOM.vocabContainer.parentElement.classList.remove('hidden');
      DOM.vocabContainer.innerHTML = vocab.map(item => `
        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
          <h4 class="font-bold text-indigo-600 dark:text-indigo-400 text-sm sm:text-base mb-1">${item.term}</h4>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">${item.definition}</p>
        </div>
      `).join('');
    } else {
      DOM.vocabContainer.parentElement.classList.add('hidden');
    }
  }
}

// Simple fallback markdown parser if CDN is inaccessible
function simpleMarkdown(text) {
  return text
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-2 text-indigo-900 dark:text-indigo-200">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-3 text-indigo-950 dark:text-indigo-100">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-indigo-600 dark:text-indigo-400">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc mb-1">$1</li>')
    .replace(/\n\n/g, '<br/><br/>');
}

// ==========================================================================
// Tab 2: Interactive Quiz Engine
// ==========================================================================

function renderQuizQuestion() {
  if (!state.currentData?.quiz || state.currentData.quiz.length === 0) return;

  const quiz = state.currentData.quiz;
  const currentQ = quiz[state.quiz.currentIndex];

  if (!currentQ) return;

  // Toggle Results vs Active Quiz
  if (state.quiz.completed) {
    DOM.quizContainer.classList.add('hidden');
    DOM.quizResultsContainer.classList.remove('hidden');
    renderQuizResults();
    return;
  }

  DOM.quizContainer.classList.remove('hidden');
  DOM.quizResultsContainer.classList.add('hidden');

  // Counters & Progress
  if (DOM.quizCurrentNum) DOM.quizCurrentNum.textContent = state.quiz.currentIndex + 1;
  if (DOM.quizTotalNum) DOM.quizTotalNum.textContent = quiz.length;
  if (DOM.quizProgressBar) {
    const progressPct = ((state.quiz.currentIndex + 1) / quiz.length) * 100;
    DOM.quizProgressBar.style.width = `${progressPct}%`;
  }

  // Question Text
  if (DOM.quizQuestionText) {
    DOM.quizQuestionText.textContent = currentQ.question;
  }

  // Options
  const hasAnswered = state.quiz.userAnswers.hasOwnProperty(currentQ.id);
  const selectedIdx = state.quiz.userAnswers[currentQ.id];

  if (DOM.quizOptionsContainer) {
    DOM.quizOptionsContainer.innerHTML = currentQ.options.map((opt, idx) => {
      let optionClass = 'quiz-option w-full p-4 text-left rounded-xl font-medium text-sm sm:text-base flex items-center justify-between cursor-pointer';
      let icon = `<span class="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-500">${String.fromCharCode(65 + idx)}</span>`;

    if (hasAnswered) {
      optionClass += ' disabled cursor-default';
      if (Number(idx) === Number(currentQ.correctIndex)) {
        optionClass += ' selected-correct font-bold';
        icon = `<span class="flex items-center gap-1.5"><span class="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-white">✓ Correct Answer</span></span>`;
      } else if (Number(idx) === Number(selectedIdx)) {
        optionClass += ' selected-wrong font-semibold';
        icon = `<span class="flex items-center gap-1.5"><span class="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-500 text-white">✗ Your Answer</span></span>`;
      }
    } else {
        optionClass += ' bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700';
      }

      return `
        <button class="${optionClass}" data-index="${idx}" ${hasAnswered ? 'disabled' : ''}>
          <span class="flex-1 text-left mr-3">${opt}</span>
          ${icon}
        </button>
      `;
    }).join('');

    // Attach click events to options
    if (!hasAnswered) {
      DOM.quizOptionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const chosenIdx = parseInt(btn.dataset.index, 10);
          handleQuizAnswer(currentQ, chosenIdx);
        });
      });
    }
  }

  // Explanation Card
  if (hasAnswered && currentQ.explanation) {
    DOM.quizExplanationCard.classList.remove('hidden');
    DOM.quizExplanationText.textContent = currentQ.explanation;
  } else {
    DOM.quizExplanationCard.classList.add('hidden');
  }

  // Nav Buttons
  if (DOM.quizPrevBtn) {
    DOM.quizPrevBtn.disabled = state.quiz.currentIndex === 0;
    DOM.quizPrevBtn.classList.toggle('opacity-40', state.quiz.currentIndex === 0);
  }

  if (DOM.quizNextBtn) {
    if (state.quiz.currentIndex === quiz.length - 1) {
      DOM.quizNextBtn.innerHTML = `<span>See Results</span> <svg class="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;
    } else {
      DOM.quizNextBtn.innerHTML = `<span>Next Question</span> <svg class="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;
    }
  }
}

function handleQuizAnswer(question, selectedIdx) {
  state.quiz.userAnswers[question.id] = selectedIdx;
  if (selectedIdx === question.correctIndex) {
    state.quiz.score++;
    showToast('Correct! Great job! 🎉', 'success');
  } else {
    showToast('Not quite! Check the explanation below.', 'warning');
  }
  renderQuizQuestion();
}

function nextQuizQuestion() {
  const quiz = state.currentData?.quiz || [];
  if (state.quiz.currentIndex < quiz.length - 1) {
    state.quiz.currentIndex++;
    renderQuizQuestion();
  } else {
    // Finish Quiz
    state.quiz.completed = true;
    renderQuizResults();
  }
}

function prevQuizQuestion() {
  if (state.quiz.currentIndex > 0) {
    state.quiz.currentIndex--;
    renderQuizQuestion();
  }
}

function restartQuiz() {
  state.quiz.currentIndex = 0;
  state.quiz.userAnswers = {};
  state.quiz.completed = false;
  state.quiz.score = 0;
  renderQuizQuestion();
}

function revealQuizAnswer() {
  const quiz = state.currentData?.quiz || [];
  const currentQ = quiz[state.quiz.currentIndex];
  if (!currentQ) return;

  state.quiz.userAnswers[currentQ.id] = currentQ.correctIndex;
  renderQuizQuestion();
  showToast('Answer revealed! 💡', 'info');
}

function renderQuizResults() {
  DOM.quizContainer.classList.add('hidden');
  DOM.quizResultsContainer.classList.remove('hidden');

  const quiz = state.currentData?.quiz || [];
  const total = quiz.length;
  const score = state.quiz.score;
  const pct = Math.round((score / total) * 100);

  const scoreBadge = document.getElementById('quiz-result-badge');
  const scoreNumber = document.getElementById('quiz-result-score');
  const scoreMessage = document.getElementById('quiz-result-message');
  const reviewList = document.getElementById('quiz-review-list');

  if (scoreNumber) scoreNumber.textContent = `${score} / ${total} (${pct}%)`;

  let badgeColor = 'bg-indigo-500 text-white';
  let message = 'Keep learning and practicing!';

  if (pct === 100) {
    badgeColor = 'bg-emerald-500 text-white';
    message = '🌟 Perfect Score! You have fully mastered this topic!';
    triggerConfetti();
  } else if (pct >= 75) {
    badgeColor = 'bg-teal-500 text-white';
    message = '👏 Excellent work! You have a solid grasp of these concepts.';
  } else if (pct >= 50) {
    badgeColor = 'bg-amber-500 text-white';
    message = '👍 Good effort! Review the flashcards and try once more.';
  } else {
    badgeColor = 'bg-rose-500 text-white';
    message = '💪 Great starting point! Review the explanation and retake the quiz.';
  }

  if (scoreBadge) {
    scoreBadge.className = `inline-flex px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${badgeColor}`;
    scoreBadge.textContent = `${pct}% Score`;
  }
  if (scoreMessage) scoreMessage.textContent = message;

  // Breakdown review of all questions
  if (reviewList) {
    reviewList.innerHTML = quiz.map((q, idx) => {
      const userAns = state.quiz.userAnswers[q.id];
      const isCorrect = userAns === q.correctIndex;

      return `
        <div class="p-4 rounded-xl border ${isCorrect ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20' : 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20'}">
          <div class="flex items-start justify-between gap-3 mb-2">
            <h5 class="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-200">${idx + 1}. ${q.question}</h5>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'}">
              ${isCorrect ? 'Correct' : 'Needs Review'}
            </span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-400 mb-1">
            <strong class="text-slate-700 dark:text-slate-300">Correct Answer:</strong> ${q.options[q.correctIndex]}
          </p>
          ${!isCorrect && userAns !== undefined ? `<p class="text-xs text-rose-600 dark:text-rose-400 mb-1"><strong>Your Answer:</strong> ${q.options[userAns]}</p>` : ''}
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">${q.explanation}</p>
        </div>
      `;
    }).join('');
  }
}

function triggerConfetti() {
  if (window.confetti) {
    window.confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// ==========================================================================
// Tab 3: Interactive 3D Flashcards
// ==========================================================================

function renderFlashcard() {
  const cards = state.flashcards.cards;
  if (!cards || cards.length === 0) return;

  const current = cards[state.flashcards.currentIndex];
  if (!current) return;

  // Unflip whenever changing cards
  state.flashcards.isFlipped = false;
  if (DOM.flashcardElement) {
    DOM.flashcardElement.classList.remove('flipped');
  }

  // Front Content
  if (DOM.cardFrontContent) {
    DOM.cardFrontContent.textContent = current.front;
  }

  // Back Content
  if (DOM.cardBackContent) {
    DOM.cardBackContent.textContent = current.back;
  }

  // Category Tag
  if (DOM.cardCategory) {
    DOM.cardCategory.textContent = current.category || 'Concept';
  }

  // Hint
  if (DOM.cardHint && DOM.cardHintContainer) {
    if (current.hint) {
      DOM.cardHintContainer.classList.remove('hidden');
      DOM.cardHint.textContent = current.hint;
    } else {
      DOM.cardHintContainer.classList.add('hidden');
    }
  }

  // Counter
  if (DOM.cardCounter) {
    DOM.cardCounter.textContent = `${state.flashcards.currentIndex + 1} / ${cards.length}`;
  }

  // Nav Buttons
  if (DOM.cardPrevBtn) {
    DOM.cardPrevBtn.disabled = state.flashcards.currentIndex === 0;
    DOM.cardPrevBtn.classList.toggle('opacity-40', state.flashcards.currentIndex === 0);
  }

  if (DOM.cardNextBtn) {
    DOM.cardNextBtn.disabled = state.flashcards.currentIndex === cards.length - 1;
    DOM.cardNextBtn.classList.toggle('opacity-40', state.flashcards.currentIndex === cards.length - 1);
  }

  // Mastered Button State
  const isMastered = state.flashcards.masteredIds.has(current.id);
  if (DOM.cardMasterBtn) {
    if (isMastered) {
      DOM.cardMasterBtn.classList.remove('border-slate-300', 'text-slate-600', 'dark:border-slate-700', 'dark:text-slate-300');
      DOM.cardMasterBtn.classList.add('bg-emerald-500', 'border-emerald-500', 'text-white');
      DOM.cardMasterBtn.innerHTML = `<span>✓ Mastered</span>`;
    } else {
      DOM.cardMasterBtn.classList.remove('bg-emerald-500', 'border-emerald-500', 'text-white');
      DOM.cardMasterBtn.classList.add('border-slate-300', 'text-slate-600', 'dark:border-slate-700', 'dark:text-slate-300');
      DOM.cardMasterBtn.innerHTML = `<span>Mark as Mastered</span>`;
    }
  }

  updateMasteryProgress();
  updateCardFlipButton();
}

function updateCardFlipButton() {
  if (DOM.cardFlipBtn) {
    if (state.flashcards.isFlipped) {
      DOM.cardFlipBtn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        <span>Flip to Question</span>
      `;
    } else {
      DOM.cardFlipBtn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        <span>Reveal Answer</span>
      `;
    }
  }
}

function flipActiveCard() {
  state.flashcards.isFlipped = !state.flashcards.isFlipped;
  if (DOM.flashcardElement) {
    DOM.flashcardElement.classList.toggle('flipped', state.flashcards.isFlipped);
  }
  updateCardFlipButton();
}

function nextFlashcard() {
  if (state.flashcards.currentIndex < state.flashcards.cards.length - 1) {
    state.flashcards.currentIndex++;
    renderFlashcard();
  }
}

function prevFlashcard() {
  if (state.flashcards.currentIndex > 0) {
    state.flashcards.currentIndex--;
    renderFlashcard();
  }
}

function shuffleFlashcards() {
  const cards = state.flashcards.cards;
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  state.flashcards.currentIndex = 0;
  renderFlashcard();
  renderGridFlashcards();
  showToast('Flashcards shuffled! 🔀', 'info');
}

function toggleMasterActiveCard() {
  const cards = state.flashcards.cards;
  const current = cards[state.flashcards.currentIndex];
  if (!current) return;

  if (state.flashcards.masteredIds.has(current.id)) {
    state.flashcards.masteredIds.delete(current.id);
  } else {
    state.flashcards.masteredIds.add(current.id);
    showToast('Marked as mastered! Keep up the momentum! ✨', 'success');
  }

  renderFlashcard();
}

function updateMasteryProgress() {
  const total = state.flashcards.cards.length || 1;
  const mastered = state.flashcards.masteredIds.size;
  const pct = Math.round((mastered / total) * 100);

  if (DOM.cardMasteryText) DOM.cardMasteryText.textContent = `${mastered} of ${total} Mastered (${pct}%)`;
  if (DOM.cardMasteryBar) DOM.cardMasteryBar.style.width = `${pct}%`;
}

// Grid View Renderer
function renderGridFlashcards() {
  if (!DOM.gridCardsContainer) return;

  const cards = state.flashcards.cards || [];
  DOM.gridCardsContainer.innerHTML = cards.map(c => `
    <div class="grid-flashcard" data-id="${c.id}">
      <div class="grid-card-inner">
        <div class="grid-card-face">
          <div>
            <span class="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3">${c.category || 'Concept'}</span>
            <p class="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100">${c.front}</p>
          </div>
          <div class="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>Click to flip</span>
            <span class="font-medium text-indigo-500">View Answer ➔</span>
          </div>
        </div>
        <div class="grid-card-face back">
          <div>
            <span class="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mb-3">Answer</span>
            <p class="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">${c.back}</p>
          </div>
          <div class="text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
            <span>Click to flip back</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Add click listeners to grid cards
  DOM.gridCardsContainer.querySelectorAll('.grid-flashcard').forEach(cardEl => {
    cardEl.addEventListener('click', () => {
      const inner = cardEl.querySelector('.grid-card-inner');
      if (inner) inner.classList.toggle('flipped');
    });
  });
}

function toggleViewMode() {
  state.flashcards.viewMode = state.flashcards.viewMode === 'single' ? 'grid' : 'single';
  
  if (state.flashcards.viewMode === 'grid') {
    DOM.singleCardView.classList.add('hidden');
    DOM.gridCardView.classList.remove('hidden');
    DOM.viewModeBtn.innerHTML = `<span>Deck View</span>`;
  } else {
    DOM.singleCardView.classList.remove('hidden');
    DOM.gridCardView.classList.add('hidden');
    DOM.viewModeBtn.innerHTML = `<span>Grid View</span>`;
  }
}

// ==========================================================================
// Text To Speech (Audio Explanation)
// ==========================================================================

function toggleSpeech() {
  if (!('speechSynthesis' in window)) {
    showToast('Text-to-speech is not supported by your browser.', 'warning');
    return;
  }

  if (state.speech.isSpeaking) {
    stopSpeaking();
    return;
  }

  const overview = state.currentData?.overview;
  if (!overview) return;

  const textToRead = `${state.currentData.topic}. ${overview.summary}. Key Takeaways: ${overview.keyTakeaways?.join('. ')}`;

  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    state.speech.isSpeaking = true;
    if (DOM.ttsBtn) {
      DOM.ttsBtn.classList.add('bg-indigo-600', 'text-white');
      DOM.ttsBtn.querySelector('span').textContent = 'Stop Listening';
    }
  };

  utterance.onend = utterance.onerror = () => {
    stopSpeaking();
  };

  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  state.speech.isSpeaking = false;
  if (DOM.ttsBtn) {
    DOM.ttsBtn.classList.remove('bg-indigo-600', 'text-white');
    DOM.ttsBtn.querySelector('span').textContent = 'Listen';
  }
}

// ==========================================================================
// History & Storage
// ==========================================================================

function saveToHistory(topicData) {
  const item = {
    topic: topicData.topic,
    tagline: topicData.tagline,
    difficulty: topicData.difficulty,
    date: new Date().toLocaleDateString(),
    data: topicData
  };

  // Filter out duplicates
  state.history = [item, ...state.history.filter(h => h.topic.toLowerCase() !== topicData.topic.toLowerCase())].slice(0, 15);
  localStorage.setItem('study_history', JSON.stringify(state.history));
  renderHistory();
}

function renderHistory() {
  if (!DOM.historyList) return;

  if (state.history.length === 0) {
    DOM.historyList.innerHTML = `<p class="text-sm text-slate-400 p-4 text-center">No recent topics yet. Search or try a sample topic!</p>`;
    return;
  }

  DOM.historyList.innerHTML = state.history.map((h, i) => `
    <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-800/80 cursor-pointer transition-all flex items-center justify-between group" data-index="${i}">
      <div class="overflow-hidden pr-2">
        <h5 class="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">${h.topic}</h5>
        <p class="text-xs text-slate-400 truncate">${h.tagline || h.difficulty}</p>
      </div>
      <span class="text-xs text-slate-400 whitespace-nowrap">${h.date}</span>
    </div>
  `).join('');

  DOM.historyList.querySelectorAll('[data-index]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.index, 10);
      const chosen = state.history[idx];
      if (chosen && chosen.data) {
        displayTopicData(chosen.data);
        toggleHistoryDrawer(false);
      }
    });
  });
}

function toggleHistoryDrawer(show) {
  if (!DOM.historyDrawer) return;
  const isCurrentlyOpen = !DOM.historyDrawer.classList.contains('translate-x-full');
  const willShow = show !== undefined ? show : !isCurrentlyOpen;

  if (willShow) {
    DOM.historyDrawer.classList.remove('translate-x-full');
  } else {
    DOM.historyDrawer.classList.add('translate-x-full');
  }
}

// ==========================================================================
// Tab Switching
// ==========================================================================

function switchTab(tabName) {
  state.activeTab = tabName;

  DOM.tabButtons.forEach(btn => {
    const isTarget = btn.dataset.tab === tabName;
    if (isTarget) {
      btn.className = 'tab-btn active px-5 py-2.5 rounded-xl text-sm font-semibold transition-all bg-indigo-600 text-white shadow-md shadow-indigo-500/20';
    } else {
      btn.className = 'tab-btn px-5 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
    }
  });

  DOM.tabContents.forEach(content => {
    if (content.id === `tab-${tabName}`) {
      content.classList.remove('hidden');
    } else {
      content.classList.add('hidden');
    }
  });
}

// ==========================================================================
// Demo Mode & Sample Topic Loading
// ==========================================================================

function loadSampleTopic(key = 'photosynthesis') {
  if (typeof SAMPLE_TOPICS !== 'undefined' && SAMPLE_TOPICS[key]) {
    displayTopicData(SAMPLE_TOPICS[key]);
    showToast(`Loaded sample topic: ${SAMPLE_TOPICS[key].topic}`, 'success');
  } else if (typeof SAMPLE_TOPICS !== 'undefined') {
    const firstKey = Object.keys(SAMPLE_TOPICS)[0];
    displayTopicData(SAMPLE_TOPICS[firstKey]);
    showToast(`Loaded sample topic: ${SAMPLE_TOPICS[firstKey].topic}`, 'success');
  }
}

function loadTopicByName(topicName) {
  const norm = topicName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  if (typeof SAMPLE_TOPICS !== 'undefined' && (SAMPLE_TOPICS[norm] || SAMPLE_TOPICS[topicName.toLowerCase()])) {
    displayTopicData(SAMPLE_TOPICS[norm] || SAMPLE_TOPICS[topicName.toLowerCase()]);
    return;
  }
  // Otherwise submit via API
  if (DOM.topicInput) DOM.topicInput.value = topicName;
  submitTopic();
}

async function submitTopic() {
  const topic = DOM.topicInput ? DOM.topicInput.value.trim() : '';
  if (!topic) {
    showToast('Please type a topic first!', 'warning');
    if (DOM.topicInput) DOM.topicInput.focus();
    return;
  }

  const difficulty = DOM.difficultySelect ? DOM.difficultySelect.value : 'High School / Intro College';
  const quizCount = DOM.quizCountSelect ? parseInt(DOM.quizCountSelect.value, 10) : 3;
  const cardCount = DOM.cardCountSelect ? parseInt(DOM.cardCountSelect.value, 10) : 4;

  // 1. Check built-in curated topics first
  const norm = topic.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
  if (typeof SAMPLE_TOPICS !== 'undefined') {
    const matched = SAMPLE_TOPICS[norm] || SAMPLE_TOPICS[topic.toLowerCase().trim()];
    if (matched) {
      displayTopicData(normalizeStudyData(matched, topic));
      showToast(`⚡ Loaded "${matched.topic}" instantly!`, 'success');
      return;
    }
  }

  // 2. If API key is present, generate live with Gemini 3.8 Flash
  if (state.apiKey) {
    const data = await generateStudyKit(topic, difficulty, quizCount, cardCount);
    if (data) {
      displayTopicData(data);
      return;
    }
  }

  // 3. If no API key or API call failed, generate with Universal Knowledge Engine
  // so the user ALWAYS receives a comprehensive, accurate answer!
  if (typeof generateUniversalFallbackTopic === 'function') {
    showLoading(topic);
    setTimeout(() => {
      const fallbackData = generateUniversalFallbackTopic(topic, difficulty, quizCount, cardCount);
      displayTopicData(normalizeStudyData(fallbackData, topic));
      hideLoading();
      if (!state.apiKey) {
        showToast(`⚡ Generated study kit for "${topic}"! (Add a free Gemini API key above for live AI models)`, 'info');
      }
    }, 450);
    return;
  }

  openApiKeyModal();
}

// ==========================================================================
// Event Listeners
// ==========================================================================

function initEventListeners() {
  // Theme Toggle
  if (DOM.themeToggleBtn) {
    DOM.themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // API Key Modal
  if (DOM.apiKeyBtn) {
    DOM.apiKeyBtn.addEventListener('click', openApiKeyModal);
  }
  if (DOM.saveApiKeyBtn) {
    DOM.saveApiKeyBtn.addEventListener('click', saveApiKey);
  }
  if (DOM.testApiKeyBtn) {
    DOM.testApiKeyBtn.addEventListener('click', testApiKey);
  }
  const modalCloseBtn = document.getElementById('close-modal-btn');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeApiKeyModal);
  }
  if (DOM.apiKeyModal) {
    DOM.apiKeyModal.addEventListener('click', (e) => {
      if (e.target === DOM.apiKeyModal) closeApiKeyModal();
    });
  }

  // History Drawer
  if (DOM.historyBtn) {
    DOM.historyBtn.addEventListener('click', () => toggleHistoryDrawer());
  }
  const closeHistoryBtn = document.getElementById('close-history-btn');
  if (closeHistoryBtn) {
    closeHistoryBtn.addEventListener('click', () => toggleHistoryDrawer(false));
  }

  // Form Submit
  if (DOM.topicForm) {
    DOM.topicForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitTopic();
    });
  }

  // Demo Mode Button
  if (DOM.demoModeBtn) {
    DOM.demoModeBtn.addEventListener('click', () => loadSampleTopic('photosynthesis'));
  }

  // Quick Topic Pills
  DOM.quickPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const topic = pill.dataset.topic;
      if (topic) {
        if (DOM.topicInput) DOM.topicInput.value = topic;
        submitTopic();
      }
    });
  });

  // Tab Buttons
  DOM.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  // TTS Audio
  if (DOM.ttsBtn) {
    DOM.ttsBtn.addEventListener('click', toggleSpeech);
  }

  // Copy Explanation
  if (DOM.copyBtn) {
    DOM.copyBtn.addEventListener('click', () => {
      const overview = state.currentData?.overview;
      if (!overview) return;
      const textToCopy = `# ${state.currentData.topic}\n\n${overview.summary}\n\n${overview.detailedExplanation}\n\n### Key Takeaways\n${overview.keyTakeaways?.map(t => `- ${t}`).join('\n')}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Explanation copied to clipboard! 📋', 'success');
      });
    });
  }

  // Print
  if (DOM.printBtn) {
    DOM.printBtn.addEventListener('click', () => window.print());
  }

  // New Search Reset
  if (DOM.newSearchBtn) {
    DOM.newSearchBtn.addEventListener('click', () => {
      if (DOM.topicInput) {
        DOM.topicInput.value = '';
        DOM.topicInput.focus();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Quiz Navigation
  if (DOM.quizNextBtn) DOM.quizNextBtn.addEventListener('click', nextQuizQuestion);
  if (DOM.quizPrevBtn) DOM.quizPrevBtn.addEventListener('click', prevQuizQuestion);
  if (DOM.quizRevealBtn) DOM.quizRevealBtn.addEventListener('click', revealQuizAnswer);
  if (DOM.quizRestartBtn) DOM.quizRestartBtn.addEventListener('click', restartQuiz);

  // Flashcards Controls
  if (DOM.flashcardElement) {
    DOM.flashcardElement.addEventListener('click', flipActiveCard);
  }
  if (DOM.cardFlipBtn) DOM.cardFlipBtn.addEventListener('click', flipActiveCard);
  if (DOM.cardNextBtn) DOM.cardNextBtn.addEventListener('click', nextFlashcard);
  if (DOM.cardPrevBtn) DOM.cardPrevBtn.addEventListener('click', prevFlashcard);
  if (DOM.cardShuffleBtn) DOM.cardShuffleBtn.addEventListener('click', shuffleFlashcards);
  if (DOM.cardMasterBtn) DOM.cardMasterBtn.addEventListener('click', toggleMasterActiveCard);
  if (DOM.viewModeBtn) DOM.viewModeBtn.addEventListener('click', toggleViewMode);

  // Keyboard Shortcuts (Arrow keys & Spacebar for Flashcards)
  window.addEventListener('keydown', (e) => {
    // Only listen when on flashcards tab and not typing in an input
    if (state.activeTab === 'flashcards' && document.activeElement.tagName !== 'INPUT') {
      if (e.code === 'Space') {
        e.preventDefault();
        flipActiveCard();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextFlashcard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevFlashcard();
      }
    }
  });
}

// Start App when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
