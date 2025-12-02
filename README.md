# Meeting Analysis Dashboard

Uma aplicação web moderna para analisar transcrições de reuniões usando Inteligência Artificial (Google Gemini).

## 🚀 Funcionalidades

- **Gerenciamento de Playbooks**: Upload de arquivos PDF para servir de contexto para a IA.
- **Análise Inteligente**: Identificação automática do tipo de reunião, objetivo e métricas de performance.
- **Dashboard Visual**: Gráfico de radar (Spider Chart) com 5 métricas principais:
  - Conhecimento Técnico
  - Rapport
  - Estratégia em Marketplaces
  - Comunicação Clara
  - Resolução de Problemas
- **Feedback Detalhado**: Pontos de melhoria com sugestões acionáveis e timestamps.
- **Design Premium**: Interface Dark Mode com glassmorphism e animações suaves.

## 🛠️ Tecnologias

- HTML5
- CSS3 (Variáveis, Flexbox, Grid)
- JavaScript (Vanilla, ES6+)
- Canvas API (Gráficos)
- Google Gemini API (IA Generativa)

## 📦 Como Usar

1. Clone este repositório ou baixe os arquivos.
2. Abra o arquivo `index.html` em seu navegador.
3. **Playbooks**: Vá até a aba "Playbooks" e adicione seus PDFs de treinamento/processos.
4. **Nova Análise**:
   - Cole a transcrição da reunião ou faça upload de um arquivo `.txt`.
   - Clique em "Iniciar Análise".
5. **Resultados**: Visualize o dashboard com o score, gráfico e feedbacks.

## ⚠️ Nota sobre API Key

Este projeto é um protótipo client-side. A chave da API do Google Gemini está exposta no código (`app.js`) para fins de demonstração. Em um ambiente de produção, recomenda-se usar um backend para proteger suas credenciais.

## 📄 Licença

MIT
