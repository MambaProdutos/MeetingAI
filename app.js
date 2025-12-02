/**
 * Meeting Analysis Dashboard
 * Main Application Logic
 */

// --- Configuration ---
const API_KEY = 'AIzaSyC987HTopzfXyzf0v948gAOB8lBlP_9_jc';
// Using gemini-pro as it is the standard stable model
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// --- State Management ---
const state = {
    currentView: 'new-analysis',
    playbooks: [], // Array of { name: string, content: string (base64 or text) }
    analysisResult: null,
    isAnalyzing: false
};

// --- DOM Elements ---
const elements = {
    navItems: document.querySelectorAll('.nav-item'),
    views: document.querySelectorAll('.view-section'),

    // New Analysis View
    transcriptionText: document.getElementById('transcription-text'),
    transcriptionFile: document.getElementById('transcription-file'),
    transcriptionUpload: document.getElementById('transcription-upload'),
    btnAnalyze: document.getElementById('btn-analyze'),
    spinner: document.querySelector('.spinner'),
    btnText: document.querySelector('.btn-text'),

    // Playbooks View
    playbookUpload: document.getElementById('playbook-upload'),
    playbookFile: document.getElementById('playbook-file'),
    playbooksList: document.getElementById('playbooks-list'),

    // Dashboard View
    meetingType: document.getElementById('meeting-type'),
    meetingDuration: document.getElementById('meeting-duration'),
    overallScore: document.getElementById('overall-score'),
    meetingObjective: document.getElementById('meeting-objective'),
    metricsChart: document.getElementById('metrics-chart'),
    feedbackList: document.getElementById('feedback-list'),

    // Toast
    toast: document.getElementById('toast')
};

// --- Initialization ---
function init() {
    loadPlaybooks();
    setupNavigation();
    setupUploads();
    setupAnalysis();
    renderPlaybooks();
}

// --- Navigation ---
function setupNavigation() {
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewId = item.dataset.view;
            switchView(viewId);
        });
    });
}

function switchView(viewId) {
    // Update State
    state.currentView = viewId;

    // Update UI
    elements.navItems.forEach(item => {
        if (item.dataset.view === viewId) item.classList.add('active');
        else item.classList.remove('active');
    });

    elements.views.forEach(view => {
        if (view.id === `view-${viewId}`) view.classList.add('active');
        else view.classList.remove('active');
    });
}

// --- Playbook Management ---
function setupUploads() {
    // Playbook Upload
    setupDragAndDrop(elements.playbookUpload, elements.playbookFile, handlePlaybookFiles);

    // Transcription Upload
    setupDragAndDrop(elements.transcriptionUpload, elements.transcriptionFile, handleTranscriptionFile);
}

function setupDragAndDrop(dropZone, fileInput, handler) {
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handler(e.target.files));

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handler(e.dataTransfer.files);
    });
}

async function handlePlaybookFiles(files) {
    if (!files.length) return;

    for (const file of files) {
        if (file.type !== 'application/pdf') {
            showToast('Apenas arquivos PDF são permitidos.', 'error');
            continue;
        }

        try {
            const base64 = await fileToBase64(file);
            const playbook = {
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                name: file.name,
                content: base64, // Storing base64 to send to Gemini
                type: file.type
            };

            state.playbooks.push(playbook);
        } catch (error) {
            console.error('Erro ao ler arquivo:', error);
            showToast(`Erro ao carregar ${file.name}`, 'error');
        }
    }

    savePlaybooks();
    renderPlaybooks();
    showToast(`${files.length} playbook(s) adicionado(s) com sucesso!`);
}

function handleTranscriptionFile(files) {
    if (!files.length) return;
    const file = files[0];

    if (file.type !== 'text/plain') {
        showToast('Apenas arquivos de texto (.txt) são permitidos.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        elements.transcriptionText.value = e.target.result;
        showToast('Transcrição carregada com sucesso!');
    };
    reader.readAsText(file);
}

function savePlaybooks() {
    try {
        localStorage.setItem('playbooks', JSON.stringify(state.playbooks));
    } catch (e) {
        showToast('Erro: Armazenamento cheio. Remova alguns playbooks.', 'error');
    }
}

function loadPlaybooks() {
    const stored = localStorage.getItem('playbooks');
    if (stored) {
        state.playbooks = JSON.parse(stored);
    }
}

function renderPlaybooks() {
    elements.playbooksList.innerHTML = '';

    if (state.playbooks.length === 0) {
        elements.playbooksList.innerHTML = `
            <div class="empty-state">
                <p>Nenhum playbook cadastrado.</p>
            </div>
        `;
        return;
    }

    state.playbooks.forEach(pb => {
        const div = document.createElement('div');
        div.className = 'playbook-item';
        div.innerHTML = `
            <div class="playbook-info">
                <span class="icon">📄</span>
                <span class="playbook-name">${pb.name}</span>
            </div>
            <button class="btn-delete" onclick="removePlaybook('${pb.id}')">
                🗑️
            </button>
        `;
        elements.playbooksList.appendChild(div);
    });
}

window.removePlaybook = function (id) {
    state.playbooks = state.playbooks.filter(pb => pb.id !== id);
    savePlaybooks();
    renderPlaybooks();
    showToast('Playbook removido.');
};

// --- Analysis Logic ---
function setupAnalysis() {
    elements.btnAnalyze.addEventListener('click', runAnalysis);
}

async function runAnalysis() {
    const transcription = elements.transcriptionText.value.trim();

    if (!transcription) {
        showToast('Por favor, insira a transcrição da reunião.', 'warning');
        return;
    }

    setLoading(true);

    try {
        const result = await callGeminiAPI(transcription, state.playbooks);
        state.analysisResult = result;
        switchView('dashboard');
        requestAnimationFrame(() => renderDashboard(result));
        showToast('Análise concluída com sucesso!');
    } catch (error) {
        console.error('Erro na análise:', error);
        showToast('Erro ao realizar a análise. Verifique o console.', 'error');
    } finally {
        setLoading(false);
    }
}

async function callGeminiAPI(transcription, playbooks) {
    // Construct the system prompt
    let systemPrompt = `Você é um especialista em análise de reuniões de vendas e suporte. 
    Analise a transcrição fornecida.
    
    Retorne APENAS um objeto JSON válido com a seguinte estrutura, sem markdown:
    {
        "meetingType": "Vendas/Consultoria/Suporte/Onboarding",
        "objective": "objetivo principal em uma frase",
        "duration": "duração estimada (ex: 30 min)",
        "metrics": {
            "Conhecimento Técnico": 0-100,
            "Rapport": 0-100,
            "Estratégia em Marketplaces": 0-100,
            "Comunicação Clara": 0-100,
            "Resolução de Problemas": 0-100
        },
        "feedback": [
            {
                "category": "nome da métrica relacionada",
                "issue": "problema identificado",
                "suggestion": "sugestão de melhoria",
                "timestamp": "00:15:30 (aproximado)",
                "severity": "warning" or "critical"
            }
        ]
    }`;

    // Note: Using text-only request as requested by user to fix API error.
    // Playbooks are not sent as binary to avoid complexity with the current model/request structure.
    if (playbooks.length > 0) {
        systemPrompt += `\n\nCONTEXTO: O usuário possui ${playbooks.length} playbooks cadastrados.`;
    }

    // API Call using the user's provided structure
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: systemPrompt + "\n\nTRANSCRICÃO:\n" + transcription }]
            }]
        })
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Details:', response.status, errorData);
        throw new Error(`Erro na API: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    let textResult = data.candidates[0].content.parts[0].text;

    // Clean Markdown if present
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(textResult);
}

// --- Dashboard Rendering ---
function renderDashboard(data) {
    // Meta
    elements.meetingType.textContent = `Tipo: ${data.meetingType}`;
    elements.meetingDuration.textContent = `Duração: ${data.duration}`;
    elements.meetingObjective.textContent = data.objective;

    // Score
    const metrics = Object.values(data.metrics);
    const avgScore = Math.round(metrics.reduce((a, b) => a + b, 0) / metrics.length);
    elements.overallScore.textContent = avgScore;

    // Chart
    drawChart(data.metrics);

    // Feedback
    renderFeedback(data.feedback);
}

function renderFeedback(feedbackItems) {
    elements.feedbackList.innerHTML = '';

    if (!feedbackItems || feedbackItems.length === 0) {
        elements.feedbackList.innerHTML = '<div class="empty-state"><p>Nenhum ponto de melhoria crítico identificado.</p></div>';
        return;
    }

    feedbackItems.forEach(item => {
        const div = document.createElement('div');
        div.className = `feedback-item ${item.severity}`;
        div.innerHTML = `
            <div class="feedback-header">
                <span class="feedback-category">${item.category}</span>
                <span class="feedback-timestamp">⏱ ${item.timestamp}</span>
            </div>
            <div class="feedback-issue">${item.issue}</div>
            <div class="feedback-suggestion">💡 ${item.suggestion}</div>
        `;
        elements.feedbackList.appendChild(div);
    });
}

// --- Chart Logic (Canvas API) ---
function drawChart(metricsObj) {
    const canvas = elements.metricsChart;
    const ctx = canvas.getContext('2d');

    // Resize canvas for high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Config
    const labels = Object.keys(metricsObj);
    const data = Object.values(metricsObj);
    const count = labels.length;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 40; // Padding

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw Grid (Spider Web)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;

    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        const r = (radius / 5) * i;
        for (let j = 0; j <= count; j++) {
            const angle = (Math.PI * 2 * j) / count - Math.PI / 2;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // Draw Axes
    ctx.beginPath();
    for (let j = 0; j < count; j++) {
        const angle = (Math.PI * 2 * j) / count - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Data Area
    ctx.beginPath();
    ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;

    for (let j = 0; j <= count; j++) {
        const index = j % count;
        const value = data[index];
        const r = (radius * value) / 100;
        const angle = (Math.PI * 2 * j) / count - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let j = 0; j < count; j++) {
        const angle = (Math.PI * 2 * j) / count - Math.PI / 2;
        const labelRadius = radius + 20;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;

        // Split long labels
        const words = labels[j].split(' ');
        if (words.length > 1) {
            ctx.fillText(words[0], x, y - 7);
            ctx.fillText(words.slice(1).join(' '), x, y + 7);
        } else {
            ctx.fillText(labels[j], x, y);
        }
    }
}

// --- Utilities ---
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function setLoading(isLoading) {
    state.isAnalyzing = isLoading;
    if (isLoading) {
        elements.btnAnalyze.disabled = true;
        elements.spinner.classList.remove('hidden');
        elements.btnText.textContent = 'Analisando...';
    } else {
        elements.btnAnalyze.disabled = false;
        elements.spinner.classList.add('hidden');
        elements.btnText.textContent = 'Iniciar Análise';
    }
}

function showToast(message, type = 'success') {
    const toast = elements.toast;
    toast.textContent = message;
    toast.className = `toast ${type}`; // Reset classes
    toast.classList.remove('hidden');

    if (type === 'error') toast.style.borderLeft = '4px solid #ef4444';
    else if (type === 'warning') toast.style.borderLeft = '4px solid #f59e0b';
    else toast.style.borderLeft = '4px solid #10b981';

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Start
document.addEventListener('DOMContentLoaded', init);
