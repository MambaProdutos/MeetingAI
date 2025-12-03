<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting AI - Análise de Reuniões</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="app-container">
        <!-- SIDEBAR -->
        <nav class="sidebar">
            <div class="brand">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                    </path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span>MeetingAI</span>
            </div>

            <div class="nav-menu">
                <div class="nav-item" onclick="app.navigate('upload')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span class="nav-text">Nova Análise</span>
                </div>
                <div class="nav-item" onclick="app.navigate('playbooks')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span class="nav-text">Playbooks</span>
                </div>
                <div class="nav-item" onclick="app.navigate('dashboard')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span class="nav-text">Dashboard</span>
                </div>
                <div class="nav-item" onclick="app.navigate('collaborators')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span class="nav-text">Colaboradores</span>
                </div>
            </div>
        </nav>

        <!-- MAIN CONTENT -->
        <main class="main-content">
            <!-- VIEW: UPLOAD/NEW ANALYSIS -->
            <section id="view-upload" class="view-section active">
                <h1>Nova Análise</h1>
                <p class="subtitle">Cole a transcrição da reunião para receber insights baseados nos seus playbooks.</p>

                <div class="card">
                    <div class="input-row" style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                        <div class="input-group" style="flex: 1; margin-bottom: 0;">
                            <label>Nome do Colaborador</label>
                            <input type="text" id="collaborator-name" placeholder="Ex: João Silva" class="text-input">
                        </div>
                        <div class="input-group" style="flex: 1; margin-bottom: 0;">
                            <label>Nome da Reunião</label>
                            <input type="text" id="meeting-name" placeholder="Ex: Reunião de Vendas - Cliente X"
                                class="text-input">
                        </div>
                    </div>

                    <div class="input-group">
                        <label>Transcrição da Reunião</label>
                        <textarea id="transcript-input"
                            placeholder="Cole o texto aqui (Ex: Vendedor: Olá, tudo bem? Cliente: Tudo ótimo...)"></textarea>
                    </div>

                    <div class="input-group">
                        <label>Ou faça upload de um arquivo de texto (.txt)</label>
                        <input type="file" id="transcript-file" accept=".txt" onchange="app.handleTranscriptFile(this)">
                    </div>

                    <button id="btn-analyze" class="btn" onclick="app.runAnalysis()">
                        <span class="btn-text">Analisar com IA</span>
                        <div class="spinner" style="display: none;"></div>
                    </button>
                </div>

                <div class="card" style="border-left: 4px solid var(--primary);">
                    <h4>💡 Dica</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">
                        Certifique-se de que seus Playbooks estão cadastrados na aba "Playbooks" para uma análise mais
                        precisa.
                    </p>
                </div>
            </section>

            <!-- VIEW: PLAYBOOKS -->
            <section id="view-playbooks" class="view-section">
                <h1>Gerenciar Playbooks</h1>
                <p class="subtitle">Faça upload dos seus guias de vendas e metodologias (PDF).</p>

                <div class="upload-zone" id="drop-zone">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                        style="color: var(--primary); margin-bottom: 1rem;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p>Arraste e solte seus PDFs aqui ou <span style="color: var(--primary); font-weight: 600;">clique
                            para buscar</span></p>
                    <input type="file" id="playbook-input" accept="application/pdf" multiple style="display: none;">
                </div>

                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Playbooks Ativos</h3>
                <div id="playbook-list" class="file-list">
                    <!-- Files will be injected here -->
                </div>
            </section>

            <!-- VIEW: DASHBOARD -->
            <section id="view-dashboard" class="view-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h1>Resultados da Análise</h1>
                    <button class="btn btn-outline" onclick="app.navigate('upload')">Nova Análise</button>
                </div>

                <!-- Score Header -->
                <div class="card"
                    style="background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%); border-left: 4px solid var(--primary);">
                    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Tipo
                                de Reunião</span>
                            <h3 id="res-type">---</h3>
                        </div>
                        <div>
                            <span
                                style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Duração
                                Estimada</span>
                            <h3 id="res-duration">---</h3>
                        </div>
                        <div>
                            <span
                                style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Objetivo</span>
                            <h3 id="res-objective" style="font-size: 1rem; max-width: 400px;">---</h3>
                        </div>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <!-- Chart Column -->
                    <div class="card">
                        <h4 style="margin-bottom: 1rem; text-align: center;">Performance Multidimensional</h4>
                        <div class="chart-container">
                            <canvas id="radarChart" width="300" height="300"></canvas>
                        </div>
                    </div>

                    <!-- Metrics & Feedback Column -->
                    <div>
                        <div class="card">
                            <h4 style="margin-bottom: 1rem;">Pontos de Atenção & Sugestões</h4>
                            <div id="feedback-container" class="feedback-list">
                                <p style="color: var(--text-muted); text-align: center; padding: 2rem;">Nenhuma análise
                                    realizada ainda.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- VIEW: COLLABORATORS LIST -->
            <section id="view-collaborators" class="view-section">
                <h1>Colaboradores</h1>
                <p class="subtitle">Histórico de análises por membro da equipe.</p>

                <div id="collaborators-list" class="file-list">
                    <!-- Collaborator cards injected here -->
                </div>
            </section>

            <!-- VIEW: COLLABORATOR DETAIL -->
            <section id="view-collaborator-detail" class="view-section">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <button class="btn-outline" onclick="app.navigate('collaborators')" style="padding: 0.5rem;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <h1 id="detail-collaborator-name" style="margin-bottom: 0;">Nome do Colaborador</h1>
                </div>
                <p class="subtitle">Histórico de reuniões analisadas.</p>

                <div id="collaborator-meetings-list" class="file-list">
                    <!-- Meeting cards injected here -->
                </div>
            </section>

        </main>
    </div>

    <!-- TOAST CONTAINER -->
    <div id="toast-container"></div>

    <script src="app.js"></script>
</body>

</html>
