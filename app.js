/**
 * APP LOGIC
 * Vanilla JS - Single File Structure
 */
const app = {
    // State
    state: {
        currentView: 'upload',
        playbooks: [], // Stores { name: string, date: string }
        analyses: [], // Stores { id, collaborator, meetingName, date, score, result }
        analysisResult: null
    },

    // Configuration
    config: {
        // ATENÇÃO: Ao fazer deploy público, restrinja esta chave no Google Cloud Console para o domínio do seu site.
        apiKey: 'AIzaSyC4VJ9KK79BccUNXT49XZSNU6VzFG_7K64',
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent'
    },

    // Initialization
    init: function () {
        this.loadPlaybooks();
        this.loadAnalyses();
        this.setupNavigation();
        this.setupDragDrop();
        this.navigate('upload');
    },

    // --- NAVIGATION ---
    navigate: function (viewId) {
        // Update State
        this.state.currentView = viewId;

        // UI Updates
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        document.getElementById(`view-${viewId}`).classList.add('active');

        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

        // Find index based on viewId simple mapping
        let navIndex = -1;
        if (viewId === 'upload') navIndex = 0;
        else if (viewId === 'playbooks') navIndex = 1;
        else if (viewId === 'dashboard') navIndex = 2;
        else if (viewId === 'collaborators' || viewId === 'collaborator-detail') navIndex = 3; // New menu item

        if (navIndex >= 0) {
            const navItem = document.querySelectorAll('.nav-item')[navIndex];
            if (navItem) navItem.classList.add('active');
        }

        // View specific logic
        if (viewId === 'collaborators') {
            this.renderCollaboratorsList();
        }
    },

    setupNavigation: function () {
        // Done via onclick in HTML for simplicity
    },

    // --- DATA MANAGEMENT ---
    loadPlaybooks: function () {
        const stored = localStorage.getItem('meeting_ai_playbooks');
        if (stored) {
            this.state.playbooks = JSON.parse(stored);
            this.renderPlaybooks();
        }
    },

    savePlaybooks: function () {
        localStorage.setItem('meeting_ai_playbooks', JSON.stringify(this.state.playbooks));
        this.renderPlaybooks();
    },

    loadAnalyses: function () {
        const stored = localStorage.getItem('meeting_ai_analyses');
        if (stored) {
            this.state.analyses = JSON.parse(stored);
        }
    },

    saveAnalyses: function () {
        localStorage.setItem('meeting_ai_analyses', JSON.stringify(this.state.analyses));
    },

    // --- PLAYBOOK ACTIONS ---
    addPlaybook: function (file) {
        // Validate duplicate
        if (this.state.playbooks.some(p => p.name === file.name)) {
            this.showToast(`O playbook "${file.name}" já existe.`, 'warning');
            return;
        }

        // Add metadata only (Browser cannot easily store full PDF content in localStorage due to 5MB limit)
        this.state.playbooks.push({
            name: file.name,
            date: new Date().toLocaleDateString(),
            size: (file.size / 1024).toFixed(1) + ' KB'
        });

        this.savePlaybooks();
        this.showToast('Playbook adicionado com sucesso!', 'success');
    },

    removePlaybook: function (index) {
        this.state.playbooks.splice(index, 1);
        this.savePlaybooks();
        this.showToast('Playbook removido.', 'default');
    },

    renderPlaybooks: function () {
        const list = document.getElementById('playbook-list');
        list.innerHTML = '';

        if (this.state.playbooks.length === 0) {
            list.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">Nenhum playbook cadastrado.</p>';
            return;
        }

        this.state.playbooks.forEach((pb, index) => {
            const el = document.createElement('div');
            el.className = 'file-card';
            el.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.8rem; overflow: hidden;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <div style="overflow: hidden;">
                        <div style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${pb.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${pb.date} • ${pb.size}</div>
                    </div>
                </div>
                <div class="delete-btn" onclick="app.removePlaybook(${index})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </div>
            `;
            list.appendChild(el);
        });
    },

    setupDragDrop: function () {
        const dropZone = document.getElementById('drop-zone');
        const input = document.getElementById('playbook-input');

        dropZone.addEventListener('click', () => input.click());

        input.addEventListener('change', (e) => {
            Array.from(e.target.files).forEach(file => this.addPlaybook(file));
            input.value = ''; // Reset
        });

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            Array.from(files).forEach(file => {
                if (file.type === 'application/pdf') {
                    this.addPlaybook(file);
                } else {
                    this.showToast('Apenas arquivos PDF são permitidos.', 'danger');
                }
            });
        });
    },

    handleTranscriptFile: function (input) {
        const file = input.files[0];
        if (!file) return;

        // Auto-fill meeting name from filename
        const meetingNameInput = document.getElementById('meeting-name');
        if (meetingNameInput && !meetingNameInput.value) {
            meetingNameInput.value = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('transcript-input').value = e.target.result;
            this.showToast('Transcrição carregada!', 'success');
        };
        reader.readAsText(file);
    },

    // --- GEMINI ANALYSIS LOGIC ---
    runAnalysis: async function () {
        const transcript = document.getElementById('transcript-input').value.trim();
        const collaborator = document.getElementById('collaborator-name').value.trim() || 'Desconhecido';
        const meetingName = document.getElementById('meeting-name').value.trim() || `Reunião ${new Date().toLocaleDateString()}`;

        // Validations
        if (!transcript) {
            this.showToast('Por favor, insira uma transcrição.', 'warning');
            return;
        }

        if (transcript.length < 50) {
            this.showToast('Transcrição muito curta para análise.', 'warning');
            return;
        }

        // UI Loading
        const btn = document.getElementById('btn-analyze');
        const btnText = btn.querySelector('.btn-text');
        const spinner = btn.querySelector('.spinner');

        btn.disabled = true;
        btnText.textContent = 'Analisando...';
        spinner.style.display = 'block';

        try {
            // Construct Prompt
            const playbooksList = this.state.playbooks.map(p => p.name).join(', ');
            const systemPrompt = `
                Você é um especialista em análise de reuniões e coaching de vendas.
                Analise a transcrição abaixo.
                
                Contexto dos Playbooks Ativos (considere as melhores práticas inferidas pelos títulos): ${playbooksList || "Nenhum playbook específico, use boas práticas gerais de vendas."}

                Retorne APENAS um objeto JSON válido (sem markdown, sem code blocks) com a seguinte estrutura:
                {
                    "meetingType": "String (ex: Vendas, Suporte, Onboarding)",
                    "objective": "Resumo de 1 frase",
                    "duration": "Estimativa baseada no texto (ex: 30 min)",
                    "overallScore": 0-100 (Nota geral de qualidade da reunião),
                    "metrics": {
                        "Conhecimento Técnico": { "score": 0-100, "reasoning": "Explicação clara do porquê desta nota, citando exemplos.", "improvement": "O que fazer para melhorar na próxima." },
                        "Rapport": { "score": 0-100, "reasoning": "...", "improvement": "..." },
                        "Estratégia em Marketplaces": { "score": 0-100, "reasoning": "...", "improvement": "..." },
                        "Comunicação Clara": { "score": 0-100, "reasoning": "...", "improvement": "..." },
                        "Resolução de Problemas": { "score": 0-100, "reasoning": "...", "improvement": "..." }
                    }
                }
            `;

            // API Call
            const response = await fetch(`${this.config.apiUrl}?key=${this.config.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: systemPrompt + "\n\nTRANSCRICÃO:\n" + transcript }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Erro na API: ${response.status} - ${errorData}`);
            }

            const data = await response.json();
            let textResult = data.candidates[0].content.parts[0].text;

            // Clean Markdown if present (Gemini sometimes adds ```json ... ```)
            textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

            const jsonResult = JSON.parse(textResult);

            // Save Analysis
            const newAnalysis = {
                id: Date.now().toString(),
                collaborator: collaborator,
                meetingName: meetingName,
                date: new Date().toLocaleDateString(),
                score: jsonResult.overallScore || 0,
                result: jsonResult
            };

            this.state.analyses.unshift(newAnalysis); // Add to beginning
            this.saveAnalyses();
            this.state.analysisResult = jsonResult;

            // Navigate to Dashboard
            this.navigate('dashboard');

            // Render Chart
            setTimeout(() => {
                this.renderDashboard(jsonResult);
            }, 50);

            this.showToast('Análise concluída e salva!', 'success');

        } catch (error) {
            console.error(error);
            this.showToast('Falha na análise. Verifique o console ou a API Key.', 'danger');
        } finally {
            btn.disabled = false;
            btnText.textContent = 'Analisar com IA';
            spinner.style.display = 'none';
        }
    },

    // --- DASHBOARD RENDERING ---
    renderDashboard: function (data) {
        // Meta Info
        document.getElementById('res-type').textContent = data.meetingType;
        document.getElementById('res-duration').textContent = data.duration;
        document.getElementById('res-objective').textContent = data.objective;

        // Total Score & Progress Bar
        const score = data.overallScore || 0;
        document.getElementById('total-score-display').textContent = score;

        const progressBar = document.getElementById('score-progress-bar');
        // Reset width first to trigger animation
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.width = `${score}%`;
        }, 100);

        // Metrics Breakdown
        const list = document.getElementById('metrics-breakdown');
        list.innerHTML = '';

        const metrics = data.metrics;
        for (const [key, value] of Object.entries(metrics)) {
            // Handle both old format (simple number) and new format (object) for backward compatibility
            const metricScore = typeof value === 'object' ? value.score : value;
            const reasoning = typeof value === 'object' ? value.reasoning : "Sem detalhes disponíveis.";
            const improvement = typeof value === 'object' ? value.improvement : "Sem sugestões disponíveis.";

            const el = document.createElement('div');
            el.className = 'metric-card';
            el.innerHTML = `
                <div class="metric-header">
                    <div class="metric-title">${key}</div>
                    <div class="metric-score ${this.getScoreClass(metricScore)}">${metricScore}</div>
                </div>
                <div class="metric-content">
                    <h5>🔎 Por que essa nota?</h5>
                    <p class="metric-text">${reasoning}</p>
                    
                    <h5>🚀 Como melhorar</h5>
                    <p class="metric-text">${improvement}</p>
                </div>
            `;
            list.appendChild(el);
        }

        // Chart (Prepare simple object for chart)
        const simpleMetrics = {};
        for (const [key, value] of Object.entries(metrics)) {
            simpleMetrics[key] = typeof value === 'object' ? value.score : value;
        }
        this.drawRadarChart(simpleMetrics);
    },

    drawRadarChart: function (metricsObj) {
        const canvas = document.getElementById('radarChart');

        // Safety check: ensure canvas exists
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // High DPI scaling
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // Safety check: if element is hidden or has no size, stop drawing to prevent errors
        if (rect.width === 0 || rect.height === 0) return;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        // Fix CSS size
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const width = rect.width;
        const height = rect.height;
        const centerX = width / 2;
        const centerY = height / 2;

        // Ensure radius is never negative. If (min/2) < 40, set radius to 0 to avoid crash
        const radius = Math.max(0, (Math.min(width, height) / 2) - 30); // Reduced padding for better fit

        // Data prep
        const labels = Object.keys(metricsObj);
        const values = Object.values(metricsObj);
        const count = labels.length;
        const angleStep = (Math.PI * 2) / count;

        ctx.clearRect(0, 0, width, height);

        // If radius is 0, we can't draw anything useful
        if (radius <= 0) return;

        // 1. Draw Grid (Pentagons)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        for (let r = 0.2; r <= 1; r += 0.2) {
            ctx.beginPath();
            for (let i = 0; i < count; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + Math.cos(angle) * (radius * r);
                const y = centerY + Math.sin(angle) * (radius * r);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // 2. Draw Axes
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);

            // Draw Labels
            const labelX = centerX + Math.cos(angle) * (radius + 20);
            const labelY = centerY + Math.sin(angle) * (radius + 20);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Split long labels
            const words = labels[i].split(' ');
            if (words.length > 1 && angle !== -Math.PI / 2) {
                ctx.fillText(words[0], labelX, labelY - 6);
                ctx.fillText(words.slice(1).join(' '), labelX, labelY + 6);
            } else {
                ctx.fillText(labels[i], labelX, labelY);
            }
        }
        ctx.stroke();

        // 3. Draw Data Area
        ctx.beginPath();
        values.forEach((val, i) => {
            const normalized = val / 100;
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * (radius * normalized);
            const y = centerY + Math.sin(angle) * (radius * normalized);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();

        // Gradient Fill
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)'); // Indigo
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)'); // Purple

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 4. Draw Points
        values.forEach((val, i) => {
            const normalized = val / 100;
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * (radius * normalized);
            const y = centerY + Math.sin(angle) * (radius * normalized);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        });
    },

    // --- COLLABORATORS VIEWS ---
    renderCollaboratorsList: function () {
        const list = document.getElementById('collaborators-list');
        list.innerHTML = '';

        // Group by collaborator
        const grouped = {};
        this.state.analyses.forEach(a => {
            const name = a.collaborator;
            if (!grouped[name]) grouped[name] = [];
            grouped[name].push(a);
        });

        const names = Object.keys(grouped).sort();

        if (names.length === 0) {
            list.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">Nenhum histórico encontrado.</p>';
            return;
        }

        names.forEach(name => {
            const count = grouped[name].length;
            // Calculate average score
            const avgScore = Math.round(grouped[name].reduce((sum, a) => sum + (a.score || 0), 0) / count);

            const el = document.createElement('div');
            el.className = 'collaborator-card';
            el.onclick = () => this.openCollaboratorDetail(name);
            el.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;">${name}</h3>
                    <div class="score-badge ${this.getScoreClass(avgScore)}">${avgScore}</div>
                </div>
                <div style="color: var(--text-muted); font-size: 0.9rem;">
                    ${count} reuniões analisadas
                </div>
            `;
            list.appendChild(el);
        });
    },

    openCollaboratorDetail: function (name) {
        document.getElementById('detail-collaborator-name').textContent = name;
        this.navigate('collaborator-detail');

        const list = document.getElementById('collaborator-meetings-list');
        list.innerHTML = '';

        const meetings = this.state.analyses.filter(a => a.collaborator === name);

        meetings.forEach(meeting => {
            const el = document.createElement('div');
            el.className = 'meeting-card';
            el.onclick = () => this.loadAnalysisToDashboard(meeting);
            el.innerHTML = `
                <div>
                    <div style="font-weight: 600; margin-bottom: 0.2rem;">${meeting.meetingName}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">
                        ${meeting.date} • ${meeting.result.meetingType}
                    </div>
                </div>
                <div class="score-badge ${this.getScoreClass(meeting.score)}">${meeting.score || 0}</div>
            `;
            list.appendChild(el);
        });
    },

    loadAnalysisToDashboard: function (analysis) {
        this.state.analysisResult = analysis.result;
        this.navigate('dashboard');
        setTimeout(() => {
            this.renderDashboard(analysis.result);
        }, 50);
    },

    getScoreClass: function (score) {
        if (score >= 80) return 'score-high';
        if (score >= 50) return 'score-mid';
        return 'score-low';
    },

    // --- UTILS ---
    showToast: function (message, type = 'default') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';

        let icon = '';
        if (type === 'success') icon = '✅';
        if (type === 'warning') icon = '⚠️';
        if (type === 'danger') icon = '❌';

        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

        if (type === 'danger') toast.style.borderColor = 'var(--danger)';
        if (type === 'success') toast.style.borderColor = 'var(--success)';

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});



