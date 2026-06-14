(function() {
  // Initialize App
  const App = {
    data: {
      layers: {},
      questions: [],
      roadmap: [],
      readiness: null
    },
    state: {
      completedTopics: new Set(),
      completedQuestions: new Set(),
      completedWeeks: new Set(),
      notes: {},
      currentWeek: 1,
      settings: {}
    },
    
    init() {
      console.log('Initializing System Design Mastery...');
      
      // Load data from global SDM object (populated by other scripts)
      if (window.SDM) {
        this.data.layers = window.SDM.layers || {};
        this.data.questions = window.SDM.questions || [];
        this.data.roadmap = window.SDM.roadmap || [];
        this.data.readiness = window.SDM.readiness || null;
      }
      
      this.loadState();
      this.initMermaid();
      this.setupEventListeners();
      this.renderSidebarLayers();
      
      // Handle initial route
      this.handleRoute();
      
      // Wait for data if not loaded yet, then re-render
      if (Object.keys(this.data.layers).length === 0) {
        this.showToast('Data files loading...', 'info');
        setTimeout(() => {
          if (window.SDM) {
            this.data.layers = window.SDM.layers || {};
            this.data.questions = window.SDM.questions || [];
            this.data.roadmap = window.SDM.roadmap || [];
            this.data.readiness = window.SDM.readiness || null;
            this.renderSidebarLayers();
            this.handleRoute();
          }
        }, 2000);
      }
    },
    
    // --- STATE MANAGEMENT ---
    
    loadState() {
      try {
        const saved = localStorage.getItem('sdm_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.state.completedTopics = new Set(parsed.completedTopics || []);
          this.state.completedQuestions = new Set(parsed.completedQuestions || []);
          this.state.completedWeeks = new Set(parsed.completedWeeks || []);
          this.state.notes = parsed.notes || {};
          this.state.currentWeek = parsed.currentWeek || 1;
          this.state.settings = parsed.settings || {};
        }
      } catch (e) {
        console.error('Error loading state:', e);
      }
      this.updateGlobalProgress();
    },
    
    saveState() {
      try {
        const toSave = {
          completedTopics: Array.from(this.state.completedTopics),
          completedQuestions: Array.from(this.state.completedQuestions),
          completedWeeks: Array.from(this.state.completedWeeks),
          notes: this.state.notes,
          currentWeek: this.state.currentWeek,
          settings: this.state.settings
        };
        localStorage.setItem('sdm_state', JSON.stringify(toSave));
        this.updateGlobalProgress();
      } catch (e) {
        console.error('Error saving state:', e);
      }
    },
    
    // --- ROUTING ---
    
    handleRoute() {
      const hash = window.location.hash || '#/dashboard';
      const path = hash.substring(1); // Remove #
      
      const appContainer = document.getElementById('app');
      window.scrollTo(0, 0);
      
      // Update active nav links
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash || link.getAttribute('data-route') === path) {
          link.classList.add('active');
        }
      });
      
      // Close mobile menu if open
      document.getElementById('sidebar').classList.remove('open');
      
      if (path === '/dashboard' || path === '/') {
        this.renderDashboard(appContainer);
      } else if (path.startsWith('/layer/')) {
        const id = path.split('/')[2];
        this.renderLayer(appContainer, id);
      } else if (path.startsWith('/topic/')) {
        const id = path.split('/')[2];
        this.renderTopic(appContainer, id);
      } else if (path === '/questions') {
        this.renderQuestionsList(appContainer);
      } else if (path.startsWith('/question/')) {
        const id = path.split('/')[2];
        this.renderQuestionDetail(appContainer, id);
      } else if (path === '/roadmap') {
        this.renderRoadmap(appContainer);
      } else if (path === '/notes') {
        this.renderNotes(appContainer);
      } else if (path.startsWith('/search')) {
        const params = new URLSearchParams(path.split('?')[1]);
        this.renderSearchResults(appContainer, params.get('q'));
      } else if (path === '/settings') {
        this.renderSettings(appContainer);
      } else {
        appContainer.innerHTML = `<div class="view-container"><h1>404 Not Found</h1></div>`;
      }
    },
    
    // --- RENDERING ---
    
    renderSidebarLayers() {
      const sidebarLayers = document.getElementById('sidebar-layers');
      if (!sidebarLayers) return;
      
      const layerKeys = Object.keys(this.data.layers).sort((a, b) => parseInt(a) - parseInt(b));
      
      if (layerKeys.length === 0) return; // Still loading
      
      let html = '';
      layerKeys.forEach(key => {
        const layer = this.data.layers[key];
        html += `<li><a href="#/layer/${key}" class="nav-link" data-route="/layer/${key}"><span class="nav-icon">${layer.icon}</span> Layer ${key}</a></li>`;
      });
      
      sidebarLayers.innerHTML = html;
    },
    
    renderDashboard(container) {
      if (!window.MasteryOS) {
          container.innerHTML = `<div class="view-container"><h1>Loading Analytics Engine...</h1></div>`;
          return;
      }

      const overallReadiness = window.MasteryOS.Readiness.getOverallReadiness();
      const dsaReadiness = window.MasteryOS.State.state.user.readiness.dsa;
      const flawData = window.MasteryOS.Mistakes.getFatalFlaw();
      const vault = window.MasteryOS.State.state.mistake_vault;
      
      const weakPatterns = window.MasteryOS.Patterns.getWeakPatterns('dsa').slice(0, 3);
      const velocity = window.MasteryOS.Analytics.getVelocity();

      // Mistake Bars HTML
      let mistakeHtml = '';
      const totalMistakes = Object.values(vault).reduce((a, b) => a + b, 0);
      const labels = {
          wrongIntuition: 'Wrong Intuition',
          wrongInvariant: 'Wrong Invariant',
          boundaryMistakes: 'Boundary Mistakes',
          optimizationMisses: 'Suboptimal Code',
          communication: 'Communication',
          designFlaws: 'Design/Syntax'
      };
      
      Object.entries(vault).sort((a,b) => b[1] - a[1]).forEach(([key, val]) => {
          const pct = totalMistakes > 0 ? (val / totalMistakes) * 100 : 0;
          mistakeHtml += `
            <div class="mistake-bar-container">
              <div class="mistake-label">${labels[key]}</div>
              <div class="mistake-bar-bg">
                <div class="mistake-bar-fill" style="width: ${pct}%"></div>
              </div>
              <div class="mistake-count">${val}</div>
            </div>
          `;
      });

      // Weak Patterns HTML
      let patternsHtml = '';
      if (weakPatterns.length === 0) {
          patternsHtml = `<p style="color: var(--text-muted); font-style: italic;">No weak patterns detected yet. Complete more questions.</p>`;
      } else {
          weakPatterns.forEach(p => {
              const acc = Math.round((p.successfulAttempts / p.attempts) * 100);
              patternsHtml += `
                <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; margin-bottom: 8px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-weight: 600; color: var(--text-main); font-size: 14px;">${p.id.replace('dsa:pattern:', '').replace(/_/g, ' ')}</span>
                    <span style="color: #ef4444; font-weight: 600;">${acc}% Acc</span>
                  </div>
                  <div style="font-size: 12px; color: var(--text-muted);">Attempts: ${p.attempts}</div>
                </div>
              `;
          });
      }

      // Heatmap HTML (Simplified 12 weeks for visual demo)
      let heatmapHtml = '';
      for (let w = 0; w < 12; w++) {
          heatmapHtml += `<div class="heatmap-col">`;
          for (let d = 0; d < 7; d++) {
              // Using some static pseudo-randomness for visual appeal until full activity log populates
              const intensity = Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0;
              heatmapHtml += `<div class="heatmap-cell ${intensity > 0 ? 'heat-'+intensity : ''}"></div>`;
          }
          heatmapHtml += `</div>`;
      }

      container.innerHTML = `
        <div class="view-container">
          <h1 class="page-title">Global Analytics</h1>
          <p class="page-subtitle">Mastery OS cross-platform intelligence command center.</p>
          
          <div class="dashboard-bento">
            <!-- 1. Readiness Radar -->
            <div class="bento-card col-span-2" style="position: relative; min-height: 300px;">
              <div class="bento-title">Interview Readiness Radar</div>
              <div style="display: flex; gap: 24px; height: 100%;">
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                  <div style="font-size: 64px; font-weight: 800; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1;">
                    ${overallReadiness}
                  </div>
                  <div style="color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-top: 8px;">Global Score</div>
                </div>
                <div style="flex: 2; position: relative; height: 250px;">
                  <canvas id="readinessRadar"></canvas>
                </div>
              </div>
            </div>

            <!-- 2. Velocity & Consistency -->
            <div class="bento-card">
              <div class="bento-title">7-Day Velocity</div>
              <div style="font-size: 48px; font-weight: 800; color: #10b981; margin-bottom: 16px;">${velocity} <span style="font-size: 16px; color: var(--text-muted); font-weight: 400;">Problems</span></div>
              
              <div class="bento-title" style="margin-top: auto;">Activity Heatmap</div>
              <div class="heatmap-wrapper">
                <div class="heatmap-container">
                  ${heatmapHtml}
                </div>
              </div>
            </div>

            <!-- 3. Mistake Triage -->
            <div class="bento-card col-span-2">
              <div class="bento-title">Fatal Flaw Analysis 
                ${flawData.flaw !== 'None' ? `<span class="badge badge-advanced">Target: ${labels[flawData.flaw] || flawData.flaw}</span>` : ''}
              </div>
              <div style="margin-top: 16px;">
                ${totalMistakes > 0 ? mistakeHtml : '<p style="color: var(--text-muted); font-style: italic;">No mistakes logged yet. Use the DSA portal to generate data.</p>'}
              </div>
            </div>

            <!-- 4. Pattern Triage -->
            <div class="bento-card">
              <div class="bento-title">Weak Patterns</div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${patternsHtml}
              </div>
            </div>
          </div>
        </div>
      `;

      // Render Chart.js
      setTimeout(() => {
          const ctx = document.getElementById('readinessRadar');
          if (ctx && window.Chart) {
              new Chart(ctx, {
                  type: 'radar',
                  data: {
                      labels: ['DSA', 'System Design', 'CS Fundamentals', 'AI Engineering'],
                      datasets: [{
                          label: 'Readiness Score',
                          data: [dsaReadiness, 0, 0, 0], 
                          backgroundColor: 'rgba(124, 58, 237, 0.2)',
                          borderColor: '#7c3aed',
                          pointBackgroundColor: '#06b6d4',
                          borderWidth: 2,
                          pointRadius: 4
                      }]
                  },
                  options: {
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                          r: {
                              angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                              grid: { color: 'rgba(255, 255, 255, 0.1)' },
                              pointLabels: { color: '#a0aec0', font: { family: 'Inter', size: 12 } },
                              ticks: { display: false, min: 0, max: 100 }
                          }
                      },
                      plugins: { legend: { display: false } }
                  }
              });
          }
      }, 100);
    },
    
    renderLayer(container, layerId) {
      const layer = this.data.layers[layerId];
      if (!layer) {
        container.innerHTML = `<div class="view-container"><h1>Layer not found</h1></div>`;
        return;
      }
      
      const layerTopics = this.getLayerTopicsCount(layer);
      const layerCompleted = this.getLayerCompletedCount(layer);
      const layerProgress = layerTopics > 0 ? Math.round((layerCompleted / layerTopics) * 100) : 0;
      
      let sectionsHtml = '';
      
      if (layer.sections) {
        layer.sections.forEach(section => {
          let topicsHtml = '';
          
          if (section.topics) {
            section.topics.forEach(topic => {
              const isCompleted = this.state.completedTopics.has(topic.id);
              const difficultyClass = `badge-${topic.difficulty || 'beginner'}`;
              
              topicsHtml += `
                <div class="topic-item" data-id="${topic.id}" onclick="window.location.hash='#/topic/${topic.id}'">
                  <div class="topic-checkbox ${isCompleted ? 'checked' : ''}" onclick="event.stopPropagation(); window.SDM_APP.toggleTopic('${topic.id}')"></div>
                  <div class="topic-item-icon">${topic.icon || '📄'}</div>
                  <div class="topic-item-title">${topic.id} ${topic.title}</div>
                  <div class="badge ${difficultyClass}">${topic.difficulty || 'beginner'}</div>
                </div>
              `;
            });
          }
          
          sectionsHtml += `
            <div class="glass-card section-card">
              <h2 class="section-header">${section.id} ${section.title}</h2>
              <div class="topic-list">
                ${topicsHtml}
              </div>
            </div>
          `;
        });
      }
      
      container.innerHTML = `
        <div class="view-container">
          <div class="breadcrumb">
            <a href="#/dashboard">Dashboard</a> / Layer ${layerId}
          </div>
          
          <div class="glass-card" style="margin-bottom: 32px; border-top: 4px solid ${layer.color}">
            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
              <div style="font-size: 48px;">${layer.icon}</div>
              <div>
                <h1 class="page-title">Layer ${layerId}: ${layer.title}</h1>
                <p class="page-subtitle" style="margin-bottom: 0;">${layer.subtitle} • ${layer.duration}</p>
              </div>
            </div>
            
            <div class="layer-progress">
              <div class="progress-header">
                <span>Completion Progress</span>
                <span>${layerProgress}%</span>
              </div>
              <div class="progress-bar-bg" style="height: 10px;">
                <div class="progress-bar-fill" style="width: ${layerProgress}%; background: ${layer.color}"></div>
              </div>
            </div>
          </div>
          
          ${sectionsHtml}
        </div>
      `;
    },
    
    renderTopic(container, topicId) {
      // Find topic and its parent layer/section
      let targetTopic = null;
      let targetLayer = null;
      let targetSection = null;
      let prevTopic = null;
      let nextTopic = null;
      
      // Very naive flattening to find prev/next
      const flatTopics = [];
      const layerKeys = Object.keys(this.data.layers).sort((a, b) => parseInt(a) - parseInt(b));
      
      for (const lKey of layerKeys) {
        const layer = this.data.layers[lKey];
        if (!layer.sections) continue;
        for (const section of layer.sections) {
          if (!section.topics) continue;
          for (const topic of section.topics) {
            flatTopics.push({ topic, layer, section });
          }
        }
      }
      
      const topicIndex = flatTopics.findIndex(item => item.topic.id === topicId);
      
      if (topicIndex !== -1) {
        targetTopic = flatTopics[topicIndex].topic;
        targetLayer = flatTopics[topicIndex].layer;
        targetSection = flatTopics[topicIndex].section;
        if (topicIndex > 0) prevTopic = flatTopics[topicIndex - 1].topic;
        if (topicIndex < flatTopics.length - 1) nextTopic = flatTopics[topicIndex + 1].topic;
      }
      
      if (!targetTopic) {
        container.innerHTML = `<div class="view-container"><h1>Topic not found</h1></div>`;
        return;
      }
      
      const isCompleted = this.state.completedTopics.has(topicId);
      const difficultyClass = `badge-${targetTopic.difficulty || 'beginner'}`;
      const noteContent = this.state.notes[topicId] || '';
      
      let html = `
        <div class="view-container">
          <div class="breadcrumb">
            <a href="#/dashboard">Dashboard</a> / 
            <a href="#/layer/${targetLayer.id}">Layer ${targetLayer.id}</a> / 
            ${targetSection.title}
          </div>
          
          <div class="topic-header">
            <div>
              <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 24px;">${targetTopic.icon || '📄'}</span>
                <span class="badge ${difficultyClass}">${targetTopic.difficulty || 'beginner'}</span>
              </div>
              <h1 class="page-title">${targetTopic.id} ${targetTopic.title}</h1>
            </div>
            <button class="btn ${isCompleted ? 'btn-success' : 'btn-secondary'}" onclick="window.SDM_APP.toggleTopic('${topicId}')" id="btn-complete-${topicId}">
              ${isCompleted ? '✓ Completed' : 'Mark as Complete'}
            </button>
          </div>
      `;
      
      // Markdown Content
      if (targetTopic.content) {
        html += `<div class="markdown-content">${this.parseMarkdown(targetTopic.content)}</div>`;
      }
      
      // Mermaid Diagram
      if (targetTopic.mermaidDiagram) {
        // Just adding a unique ID for the mermaid element
        const mId = 'mermaid-' + topicId.replace(/\./g, '-');
        html += `
          <div class="diagram-container">
            <div class="mermaid" id="${mId}">
              ${targetTopic.mermaidDiagram}
            </div>
          </div>
        `;
      }
      
      // ASCII Diagram
      if (targetTopic.asciiDiagram) {
        html += `
          <div class="diagram-container" style="justify-content: flex-start; overflow-x: auto;">
            <pre style="background: transparent; border: none; color: var(--accent-secondary); margin: 0; padding: 0;">${targetTopic.asciiDiagram}</pre>
          </div>
        `;
      }
      
      // Notes Section
      html += `
          <div class="notes-section">
            <h3>📝 Personal Notes</h3>
            <textarea class="notes-textarea" id="note-${topicId}" placeholder="Write your notes, analogies, or thoughts here...">${noteContent}</textarea>
            <button class="btn btn-secondary" onclick="window.SDM_APP.saveNote('${topicId}')">Save Notes</button>
          </div>
          
          <div class="topic-navigation">
            ${prevTopic ? `<button class="btn btn-secondary" onclick="window.location.hash='#/topic/${prevTopic.id}'">← Previous: ${prevTopic.title}</button>` : '<div></div>'}
            ${nextTopic ? `<button class="btn btn-primary" onclick="window.location.hash='#/topic/${nextTopic.id}'">Next: ${nextTopic.title} →</button>` : '<div></div>'}
          </div>
        </div>
      `;
      
      container.innerHTML = html;
      
      // Re-init mermaid for newly added diagram
      if (targetTopic.mermaidDiagram) {
        setTimeout(() => this.renderMermaid(), 100);
      }
    },
    
    renderQuestionsList(container) {
      if (!this.data.questions || this.data.questions.length === 0) {
        container.innerHTML = `<div class="view-container"><h1>Loading questions...</h1></div>`;
        return;
      }
      
      let html = `
        <div class="view-container">
          <h1 class="page-title">Interview Questions</h1>
          <p class="page-subtitle">100 real-world system design interview questions.</p>
          
          <div class="filters-bar">
            <input type="text" id="q-search" class="filter-select" placeholder="Search questions..." onkeyup="window.SDM_APP.filterQuestions()">
            <select id="q-diff" class="filter-select" onchange="window.SDM_APP.filterQuestions()">
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div class="questions-grid" id="q-grid">
      `;
      
      this.data.questions.forEach(q => {
        const isCompleted = this.state.completedQuestions.has(q.id);
        const difficultyClass = `badge-${q.difficulty || 'beginner'}`;
        
        html += `
          <a href="#/question/${q.id}" class="glass-card interactive q-card" data-title="${q.title.toLowerCase()}" data-diff="${q.difficulty || 'beginner'}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <span class="badge ${difficultyClass}">${q.difficulty || 'beginner'}</span>
              ${isCompleted ? '<span style="color: var(--color-success)">✓</span>' : ''}
            </div>
            <h3 style="margin-bottom: 8px; color: var(--text-main); font-size: 16px;">${q.id}. ${q.title}</h3>
            <p style="color: var(--text-muted); font-size: 13px;">${q.category || ''}</p>
          </a>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
      
      container.innerHTML = html;
    },
    
    renderQuestionDetail(container, qId) {
      const q = this.data.questions.find(q => String(q.id) === String(qId));
      if (!q) {
        container.innerHTML = `<div class="view-container"><h1>Question not found</h1></div>`;
        return;
      }
      
      const isCompleted = this.state.completedQuestions.has(q.id);
      const difficultyClass = `badge-${q.difficulty || 'beginner'}`;
      const noteContent = this.state.notes['q-' + q.id] || '';
      
      let html = `
        <div class="view-container">
          <div class="breadcrumb">
            <a href="#/dashboard">Dashboard</a> / 
            <a href="#/questions">Interview Questions</a> / 
            Q${q.id}
          </div>
          
          <div class="topic-header">
            <div>
              <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 8px;">
                <span class="badge ${difficultyClass}">${q.difficulty || 'beginner'}</span>
                <span style="color: var(--text-muted); font-size: 14px;">${q.category || ''}</span>
              </div>
              <h1 class="page-title">${q.title}</h1>
            </div>
            <button class="btn ${isCompleted ? 'btn-success' : 'btn-secondary'}" onclick="window.SDM_APP.toggleQuestion(${q.id})" id="btn-complete-q-${q.id}">
              ${isCompleted ? '✓ Practiced' : 'Mark as Practiced'}
            </button>
          </div>
      `;
      
      if (q.content) {
        html += `<div class="markdown-content">${this.parseMarkdown(q.content)}</div>`;
      }
      
      if (q.mermaidDiagram) {
        const mId = 'mermaid-q-' + q.id;
        html += `
          <div class="diagram-container">
            <div class="mermaid" id="${mId}">
              ${q.mermaidDiagram}
            </div>
          </div>
        `;
      }
      
      // Notes Section
      html += `
          <div class="notes-section">
            <h3>📝 Interview Notes</h3>
            <textarea class="notes-textarea" id="note-q-${q.id}" placeholder="Write your specific approach, tradeoffs considered, or mistakes made...">${noteContent}</textarea>
            <button class="btn btn-secondary" onclick="window.SDM_APP.saveNote('q-${q.id}')">Save Notes</button>
          </div>
        </div>
      `;
      
      container.innerHTML = html;
      
      if (q.mermaidDiagram) {
        setTimeout(() => this.renderMermaid(), 100);
      }
    },
    
    renderRoadmap(container) {
      if (!this.data.roadmap || this.data.roadmap.length === 0) {
        container.innerHTML = `<div class="view-container"><h1>Loading roadmap...</h1></div>`;
        return;
      }
      
      let html = `
        <div class="view-container">
          <h1 class="page-title">52-Week Roadmap</h1>
          <p class="page-subtitle">Your step-by-step path to mastery. Set your current week in Settings.</p>
          
          <div class="roadmap-timeline">
      `;
      
      let currentPhase = "";
      
      this.data.roadmap.forEach(week => {
        if (week.phase !== currentPhase) {
          html += `<h2 style="margin: 40px 0 20px 20px; color: var(--text-main); border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Phase ${week.phaseNumber}: ${week.phase}</h2>`;
          currentPhase = week.phase;
        }
        
        const isCurrent = this.state.currentWeek === week.week;
        const isCompleted = this.state.completedWeeks.has(week.week);
        
        let classNames = "roadmap-week";
        if (isCurrent) classNames += " current";
        if (isCompleted) classNames += " completed";
        
        html += `
          <div class="${classNames}">
            <div class="roadmap-week-marker"></div>
            <div class="roadmap-card">
              <div class="roadmap-week-header">
                <span class="roadmap-week-num">Week ${week.week}</span>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                  <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="window.SDM_APP.toggleWeek(${week.week})">
                  Done
                </label>
              </div>
              <h3 style="margin-bottom: 12px; font-size: 18px;">${week.title}</h3>
              <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px;"><strong>Practice:</strong> ${week.practice || 'N/A'}</p>
              ${week.milestone ? '<span class="badge badge-advanced" style="margin-top: 8px; display: inline-block;">Milestone</span>' : ''}
            </div>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
      
      container.innerHTML = html;
    },
    
    renderNotes(container) {
      const noteKeys = Object.keys(this.state.notes).filter(k => this.state.notes[k].trim() !== '');
      
      let html = `
        <div class="view-container">
          <h1 class="page-title">My Notes</h1>
          <p class="page-subtitle">All your saved notes across the curriculum.</p>
      `;
      
      if (noteKeys.length === 0) {
        html += `<div class="glass-card"><p>You haven't saved any notes yet.</p></div>`;
      } else {
        html += `<div class="questions-grid">`;
        noteKeys.forEach(key => {
          let title = key;
          let link = '';
          
          if (key.startsWith('q-')) {
            const qId = key.substring(2);
            const q = this.data.questions.find(q => String(q.id) === String(qId));
            if (q) title = `Q${q.id}: ${q.title}`;
            link = `#/question/${qId}`;
          } else {
            // Find topic title
            const flatTopics = [];
            const layerKeys = Object.keys(this.data.layers);
            for (const lKey of layerKeys) {
              const layer = this.data.layers[lKey];
              if (!layer.sections) continue;
              for (const section of layer.sections) {
                if (!section.topics) continue;
                for (const topic of section.topics) {
                  if (topic.id === key) title = `${topic.id} ${topic.title}`;
                }
              }
            }
            link = `#/topic/${key}`;
          }
          
          const content = this.state.notes[key];
          
          html += `
            <a href="${link}" class="glass-card interactive">
              <h3 style="margin-bottom: 12px; font-size: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">${title}</h3>
              <p style="color: var(--text-muted); font-size: 14px; white-space: pre-wrap; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;">${content}</p>
            </a>
          `;
        });
        html += `</div>`;
      }
      
      html += `</div>`;
      container.innerHTML = html;
    },
    
    renderSettings(container) {
      container.innerHTML = `
        <div class="view-container">
          <h1 class="page-title">Settings</h1>
          
          <div class="glass-card" style="margin-top: 32px; max-width: 600px;">
            <h2 style="margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Progress Configuration</h2>
            
            <div style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Current Week in Roadmap</label>
              <select id="setting-week" class="filter-select" style="width: 100%; max-width: 200px;" onchange="window.SDM_APP.updateSetting('currentWeek', this.value)">
                ${Array.from({length: 52}, (_, i) => i + 1).map(w => `<option value="${w}" ${this.state.currentWeek == w ? 'selected' : ''}>Week ${w}</option>`).join('')}
              </select>
            </div>
            
            <div style="margin-bottom: 24px; margin-top: 48px;">
              <h2 style="color: var(--color-advanced); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Danger Zone</h2>
              <p style="color: var(--text-muted); margin-bottom: 16px;">This will permanently delete all your progress, completed topics, and notes.</p>
              <button class="btn" style="background: rgba(239, 68, 68, 0.2); color: var(--color-advanced); border: 1px solid var(--color-advanced);" onclick="if(confirm('Are you sure? This cannot be undone.')) window.SDM_APP.resetProgress()">Reset All Progress</button>
            </div>
          </div>
        </div>
      `;
    },
    
    // --- ACTIONS & HELPERS ---
    
    toggleTopic(topicId) {
      if (this.state.completedTopics.has(topicId)) {
        this.state.completedTopics.delete(topicId);
        this.showToast(`Unmarked topic ${topicId}`);
      } else {
        this.state.completedTopics.add(topicId);
        this.showToast(`Marked topic ${topicId} as completed!`, 'success');
      }
      this.saveState();
      
      // Update UI if on topic page
      const btn = document.getElementById(`btn-complete-${topicId}`);
      if (btn) {
        if (this.state.completedTopics.has(topicId)) {
          btn.className = 'btn btn-success';
          btn.innerText = '✓ Completed';
        } else {
          btn.className = 'btn btn-secondary';
          btn.innerText = 'Mark as Complete';
        }
      }
      
      // Re-render layer page if we are on it
      if (window.location.hash.startsWith('#/layer/')) {
        this.handleRoute();
      }
    },
    
    toggleQuestion(qId) {
      qId = parseInt(qId);
      if (this.state.completedQuestions.has(qId)) {
        this.state.completedQuestions.delete(qId);
        this.showToast(`Unmarked question ${qId}`);
      } else {
        this.state.completedQuestions.add(qId);
        this.showToast(`Marked question ${qId} as practiced!`, 'success');
      }
      this.saveState();
      
      // Update UI if on question detail page
      const btn = document.getElementById(`btn-complete-q-${qId}`);
      if (btn) {
        if (this.state.completedQuestions.has(qId)) {
          btn.className = 'btn btn-success';
          btn.innerText = '✓ Practiced';
        } else {
          btn.className = 'btn btn-secondary';
          btn.innerText = 'Mark as Practiced';
        }
      }
    },
    
    toggleWeek(week) {
      week = parseInt(week);
      if (this.state.completedWeeks.has(week)) {
        this.state.completedWeeks.delete(week);
      } else {
        this.state.completedWeeks.add(week);
      }
      this.saveState();
      this.handleRoute(); // Re-render roadmap
    },
    
    saveNote(id) {
      const el = document.getElementById(`note-${id}`);
      if (el) {
        this.state.notes[id] = el.value;
        this.saveState();
        this.showToast('Note saved successfully!', 'success');
      }
    },
    
    updateSetting(key, value) {
      if (key === 'currentWeek') {
        this.state.currentWeek = parseInt(value);
      }
      this.saveState();
      this.showToast('Setting updated');
    },
    
    resetProgress() {
      this.state.completedTopics.clear();
      this.state.completedQuestions.clear();
      this.state.completedWeeks.clear();
      this.state.notes = {};
      this.state.currentWeek = 1;
      this.saveState();
      this.showToast('All progress has been reset', 'info');
      this.handleRoute();
    },
    
    filterQuestions() {
      const search = (document.getElementById('q-search').value || '').toLowerCase();
      const diff = document.getElementById('q-diff').value;
      
      document.querySelectorAll('.q-card').forEach(card => {
        const title = card.getAttribute('data-title');
        const d = card.getAttribute('data-diff');
        
        let matchSearch = title.includes(search);
        let matchDiff = diff === 'all' || d === diff;
        
        if (matchSearch && matchDiff) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    },
    
    // --- UTILS & CORE ---
    
    getTotalTopicsCount() {
      let count = 0;
      Object.keys(this.data.layers).forEach(k => {
        const layer = this.data.layers[k];
        if (layer.sections) {
          layer.sections.forEach(s => {
            if (s.topics) count += s.topics.length;
          });
        }
      });
      return count;
    },
    
    getLayerTopicsCount(layer) {
      let count = 0;
      if (layer.sections) {
        layer.sections.forEach(s => {
          if (s.topics) count += s.topics.length;
        });
      }
      return count;
    },
    
    getLayerCompletedCount(layer) {
      let count = 0;
      if (layer.sections) {
        layer.sections.forEach(s => {
          if (s.topics) {
            s.topics.forEach(t => {
              if (this.state.completedTopics.has(t.id)) count++;
            });
          }
        });
      }
      return count;
    },
    
    updateGlobalProgress() {
      const total = this.getTotalTopicsCount();
      const comp = this.state.completedTopics.size;
      const pct = total > 0 ? Math.round((comp / total) * 100) : 0;
      
      const txt = document.getElementById('sidebar-progress-text');
      const bar = document.getElementById('sidebar-progress-bar');
      if (txt) txt.innerText = `${pct}%`;
      if (bar) bar.style.width = `${pct}%`;
      
      this.updateReadinessScore();
    },
    
    updateReadinessScore() {
      const badge = document.getElementById('readiness-badge');
      if (!badge) return;
      
      // Calculate level based on progress
      const total = this.getTotalTopicsCount();
      if (total === 0) return;
      
      const comp = this.state.completedTopics.size;
      const pct = comp / total;
      
      let level = 0;
      if (pct > 0.1) level = 1;
      if (pct > 0.3) level = 2;
      if (pct > 0.5) level = 3;
      if (pct > 0.75) level = 4;
      if (pct >= 0.95) level = 5;
      
      badge.innerText = `L${level}`;
    },
    
    showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerText = message;
      
      container.appendChild(toast);
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 3000);
    },
    
    parseMarkdown(md) {
      if (!md) return '';
      
      let html = md;
      
      // Code blocks
      html = html.replace(/```[\s\S]*?```/g, function(match) {
        return '<pre><code>' + match.replace(/```[a-z]*\n?/g, '') + '</code></pre>';
      });
      
      // Inline code
      html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
      
      // Headers
      html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
      html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
      html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
      
      // Bold
      html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      
      // Blockquotes
      html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
      
      // Links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
      
      // Lists (naive)
      html = html.replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>');
      html = html.replace(/<\/ul>\n<ul>/g, '\n');
      
      // Paragraphs
      html = html.split('\n\n').map(p => {
        if (p.trim().startsWith('<') || p.trim() === '') return p;
        return '<p>' + p + '</p>';
      }).join('\n');
      
      return html;
    },
    
    initMermaid() {
      if (window.mermaid) {
        mermaid.initialize({ 
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#7c3aed',
            primaryBorderColor: '#06b6d4',
            primaryTextColor: '#fff',
            lineColor: '#a0aec0',
            fontFamily: 'Inter'
          }
        });
      }
    },
    
    renderMermaid() {
      if (window.mermaid) {
        try {
          mermaid.init(undefined, document.querySelectorAll('.mermaid'));
        } catch (e) {
          console.error('Mermaid render error:', e);
        }
      }
    },
    
    setupEventListeners() {
      window.addEventListener('hashchange', () => this.handleRoute());
      
      const mobileToggle = document.getElementById('mobile-menu-toggle');
      const mobileClose = document.getElementById('mobile-menu-close');
      const sidebar = document.getElementById('sidebar');
      
      if (mobileToggle) {
        mobileToggle.addEventListener('click', () => sidebar.classList.add('open'));
      }
      
      if (mobileClose) {
        mobileClose.addEventListener('click', () => sidebar.classList.remove('open'));
      }
      
      // Close sidebar when clicking links on mobile
      document.querySelectorAll('.sidebar-nav a').forEach(el => {
        el.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
          }
        });
      });
      
      // Global search (naive implementation)
      const searchInput = document.getElementById('global-search');
      if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
          if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query) {
              window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
              searchInput.value = '';
            }
          }
        });
      }
      
      // Modal close
      document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.closest('.modal').classList.remove('active');
        });
      });
    },
    
    renderSearchResults(container, query) {
      query = query.toLowerCase();
      let results = [];
      
      // Search topics
      const layerKeys = Object.keys(this.data.layers);
      for (const lKey of layerKeys) {
        const layer = this.data.layers[lKey];
        if (!layer.sections) continue;
        for (const section of layer.sections) {
          if (!section.topics) continue;
          for (const topic of section.topics) {
            if (topic.title.toLowerCase().includes(query) || (topic.content && topic.content.toLowerCase().includes(query))) {
              results.push({
                type: 'Topic',
                title: `${topic.id} ${topic.title}`,
                link: `#/topic/${topic.id}`,
                match: layer.title
              });
            }
          }
        }
      }
      
      // Search questions
      this.data.questions.forEach(q => {
        if (q.title.toLowerCase().includes(query) || (q.content && q.content.toLowerCase().includes(query))) {
          results.push({
            type: 'Interview Question',
            title: `Q${q.id}: ${q.title}`,
            link: `#/question/${q.id}`,
            match: q.category
          });
        }
      });
      
      let html = `
        <div class="view-container">
          <h1 class="page-title">Search Results</h1>
          <p class="page-subtitle">Showing results for "${query}"</p>
          
          <div class="questions-grid" style="margin-top: 32px;">
      `;
      
      if (results.length === 0) {
        html += `<p>No results found.</p>`;
      } else {
        results.forEach(r => {
          html += `
            <a href="${r.link}" class="glass-card interactive">
              <span class="badge" style="margin-bottom: 8px; display: inline-block;">${r.type}</span>
              <h3 style="margin-bottom: 8px; font-size: 16px; color: var(--text-main);">${r.title}</h3>
              <p style="color: var(--text-muted); font-size: 13px;">${r.match}</p>
            </a>
          `;
        });
      }
      
      html += `
          </div>
        </div>
      `;
      
      container.innerHTML = html;
    }
  };

  // Expose to window for inline onclick handlers
  window.SDM_APP = App;
  
  // Start app when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
  
})();
