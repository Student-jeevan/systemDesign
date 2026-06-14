document.addEventListener('DOMContentLoaded', () => {
    const topicList = document.getElementById('topic-list');
    const markdownContainer = document.getElementById('markdown-container');
    const spinner = document.getElementById('loading-spinner');
    
    // Core Modules Mapping
    const csModules = [
        { id: 'os-internals', title: 'OS & Concurrency', file: 'content/os-internals.md' },
        { id: 'dbms-internals', title: 'DBMS & SQL', file: 'content/dbms-internals.md' },
        { id: 'computer-networks', title: 'Computer Networks', file: 'content/computer-networks.md' },
        { id: 'oop-design-patterns', title: 'OOP & Patterns', file: 'content/oop-design-patterns.md' }
    ];

    // Local Storage Helpers
    function getCompletedTopics() {
        return JSON.parse(localStorage.getItem('cs-completed')) || [];
    }

    function toggleTopicCompletion(id, forceComplete = false) {
        let completed = getCompletedTopics();
        if (!forceComplete && completed.includes(id)) {
            completed = completed.filter(q => q !== id);
        } else if (!completed.includes(id)) {
            completed.push(id);
        }
        localStorage.setItem('cs-completed', JSON.stringify(completed));
        updateProgressUI();
    }

    // Render Sidebar
    function renderSidebar() {
        let html = '';
        csModules.forEach(mod => {
            html += `<button class="topic-btn" data-id="${mod.id}" data-file="${mod.file}">
                        <span class="topic-name">${mod.title}</span>
                     </button>`;
        });
        topicList.innerHTML = html;

        document.querySelectorAll('.topic-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');
                loadModuleContent(target.dataset.file);
            });
        });
        updateProgressUI();
    }

    // Advanced Markdown Lexer & Parser (Adapted from DSA)
    function parseMarkdown(mdText) {
        const lines = mdText.split('\n');
        let html = '';
        let currentPattern = null;
        let inQuestionsSection = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Headings
            if (line.startsWith('# ')) {
                html += `<h1 class="page-title">${line.substring(2)}</h1>`;
            } else if (line.startsWith('## ') && !line.startsWith('## Pattern')) {
                html += `<h2>${line.substring(3)}</h2>`;
            } else if (line.startsWith('## Pattern')) {
                // Close previous pattern if exists
                if (currentPattern) {
                    html += `</div></div>`; // Close questions-container and pattern-card
                    inQuestionsSection = false;
                }
                const title = line.substring(3);
                currentPattern = { title: title };
                html += `<div class="pattern-card">
                            <h3 class="pattern-title">${title}</h3>`;
            } else if (line.startsWith('### Pattern Description') && currentPattern) {
                let desc = '';
                i++;
                while (i < lines.length && !lines[i].startsWith('#')) {
                    if (lines[i].trim() !== '') desc += `<p>${lines[i]}</p>`;
                    i++;
                }
                i--; // Step back
                html += `<div class="pattern-theory accordion">
                            <div class="accordion-header">
                                <span>📖 Deep Dive Theory</span>
                                <span class="accordion-icon">+</span>
                            </div>
                            <div class="accordion-content">
                                ${desc}
                            </div>
                         </div>`;
            } else if (line.startsWith('### Core Invariant') && currentPattern) {
                let inv = '';
                i++;
                while (i < lines.length && !lines[i].startsWith('#')) {
                    if (lines[i].trim() !== '') inv += `<p>${lines[i]}</p>`;
                    i++;
                }
                i--;
                html += `<div class="core-invariant"><strong>Core Invariant:</strong> ${inv}</div>`;
            } else if (line.startsWith('### Curated Questions') && currentPattern) {
                inQuestionsSection = true;
                html += `<h4 style="margin: 24px 0 16px 0; color: var(--text-main);">Curated Interview Concepts</h4>
                         <div class="questions-container">`;
            } else if (inQuestionsSection && line.startsWith('##### Q')) {
                // Parse Question Block
                const qTitle = line.substring(6);
                let qData = { title: qTitle, difficulty: 'Medium', company: 'Various', observation: '' };
                i++;
                while (i < lines.length && !lines[i].startsWith('##### Q') && !lines[i].startsWith('## ')) {
                    if (lines[i].includes('**Difficulty**')) {
                        qData.difficulty = lines[i].split('|')[2].trim();
                    }
                    if (lines[i].includes('**Companies**')) {
                        qData.company = lines[i].split('|')[2].trim();
                    }
                    if (lines[i].startsWith('**Key Observation**:')) {
                        qData.observation = lines[i].substring(20).trim();
                    }
                    i++;
                }
                i--;

                const difficultyClass = qData.difficulty.toLowerCase() === 'hard' ? 'diff-hard' : 
                                        (qData.difficulty.toLowerCase() === 'medium' ? 'diff-medium' : 'diff-easy');
                
                const qId = btoa(qData.title).replace(/=/g, '');
                const patternId = 'cs:concept:' + currentPattern.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

                html += `<div class="question-card">
                            <div class="question-header">
                                <label class="question-checkbox">
                                    <input type="checkbox" data-id="${qId}" data-pattern="${patternId}">
                                    <span class="checkmark"></span>
                                </label>
                                <div class="question-title-wrapper">
                                    <div class="q-title">${qData.title}</div>
                                </div>
                                <span class="badge ${difficultyClass}">${qData.difficulty}</span>
                            </div>
                            <div class="question-tags">
                                <span class="badge diff-easy" style="background: rgba(255, 255, 255, 0.1); color: #ccc;">🏢 ${qData.company}</span>
                            </div>
                            <div class="key-observation">
                                <strong>💡 Core Engineering Principle:</strong><br>
                                ${qData.observation}
                            </div>
                        </div>`;
            }
            // Normal paragraph fallback outside structures
            else if (line.trim() !== '' && !currentPattern && !line.startsWith('#')) {
                html += `<p>${line}</p>`;
            }
        }

        // Close the last pattern
        if (currentPattern) {
            html += `</div></div>`;
        }

        return html;
    }

    // Render logic
    function renderModuleUI(html) {
        markdownContainer.innerHTML = html;
        
        // Attach Event Listeners
        document.querySelectorAll('.question-checkbox input').forEach(cb => {
            cb.addEventListener('click', (e) => {
                const isChecked = e.target.checked;
                if (isChecked) {
                    e.preventDefault(); // Stop instant check
                    openMistakeModal(e.target.dataset.id, e.target.dataset.pattern);
                } else {
                    toggleTopicCompletion(e.target.dataset.id);
                }
            });
        });

        // Accordion Logic
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('.accordion-icon');
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    icon.textContent = '+';
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    icon.textContent = '-';
                }
            });
        });

        updateProgressUI();
    }

    // === Mistake Modal Logic ===
    const mistakeModal = document.getElementById('mistake-modal');
    const modalCancel = document.getElementById('modal-cancel');
    const modalSave = document.getElementById('modal-save');
    const modalRecognized = document.getElementById('modal-recognized-pattern');
    
    let pendingQuestionId = null;
    let pendingPatternId = null;

    function openMistakeModal(qId, patternId) {
        pendingQuestionId = qId;
        pendingPatternId = patternId;
        modalRecognized.checked = false;
        document.querySelectorAll('.mistake-tag').forEach(cb => cb.checked = false);
        mistakeModal.style.display = 'flex';
    }

    modalCancel.addEventListener('click', () => {
        mistakeModal.style.display = 'none';
        pendingQuestionId = null;
        pendingPatternId = null;
    });

    modalSave.addEventListener('click', () => {
        if (!pendingQuestionId) return;

        const recognized = modalRecognized.checked;
        const selectedMistakes = Array.from(document.querySelectorAll('.mistake-tag'))
                                     .filter(cb => cb.checked)
                                     .map(cb => cb.value);

        if (window.MasteryOS) {
            window.MasteryOS.Patterns.logAttempt(pendingPatternId, recognized);
            if (selectedMistakes.length > 0) {
                window.MasteryOS.Mistakes.logMistakes(pendingQuestionId, selectedMistakes);
            }
            window.MasteryOS.Readiness.calculateReadiness('csFund');
        }

        toggleTopicCompletion(pendingQuestionId, true);
        mistakeModal.style.display = 'none';
        pendingQuestionId = null;
        pendingPatternId = null;
    });

    // === Fetch Module Content ===
    async function loadModuleContent(filename) {
        spinner.style.display = 'flex';
        markdownContainer.style.display = 'none';

        try {
            const response = await fetch(filename);
            if (!response.ok) throw new Error('File not found');
            const mdText = await response.text();
            const html = parseMarkdown(mdText);
            renderModuleUI(html);
        } catch (error) {
            markdownContainer.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--color-hard);">
                <h2>Failed to load module.</h2>
                <p>Ensure you are running on a local server, not via file://</p>
            </div>`;
        } finally {
            spinner.style.display = 'none';
            markdownContainer.style.display = 'block';
        }
    }

    // Update Sidebar Progress
    function updateProgressUI() {
        const completed = getCompletedTopics();
        const total = document.querySelectorAll('.question-card').length;
        
        document.querySelectorAll('.question-checkbox input').forEach(cb => {
            const qId = cb.dataset.id;
            const isCompleted = completed.includes(qId);
            cb.checked = isCompleted;
            
            const card = cb.closest('.question-card');
            if (card) {
                if (isCompleted) {
                    card.style.borderColor = 'var(--accent)';
                    card.style.background = 'rgba(16, 185, 129, 0.05)';
                } else {
                    card.style.borderColor = 'var(--border)';
                    card.style.background = 'var(--bg-surface)';
                }
            }
        });

        const activeCompleted = Array.from(document.querySelectorAll('.question-checkbox input')).filter(cb => cb.checked).length;
        if (total > 0) {
            const pct = Math.round((activeCompleted / total) * 100);
            document.getElementById('overall-progress').style.width = pct + '%';
            document.getElementById('progress-text').innerText = `${activeCompleted} / ${total} Concepts Mastered`;
        }
    }

    renderSidebar();
});
