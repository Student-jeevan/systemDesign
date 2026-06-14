document.addEventListener('DOMContentLoaded', () => {
    // === Curriculum Structure ===
    const curriculum = [
        {
            tier: "Tier 1: Critical",
            topics: [
                { id: "topic-20-dynamic-programming", name: "Dynamic Programming", file: "dp-patterns-01-04.md" },
                { id: "topic-15-greedy", name: "Greedy", file: "topic-15-greedy.md" },
                { id: "topic-08-monotonic-stack", name: "Monotonic Stack", file: "topic-08-monotonic-stack.md" },
                { id: "topic-11-trees", name: "Trees", file: "topic-11-trees.md" },
                { id: "topic-05-binary-search", name: "Binary Search", file: "topic-05-binary-search.md" }
            ]
        },
        {
            tier: "Tier 2: High ROI",
            topics: [
                { id: "topic-24-ds-design", name: "DS Design Problems", file: "topic-24-ds-design.md" },
                { id: "topic-25-advanced-patterns", name: "Advanced Patterns", file: "topic-25-advanced-patterns.md" },
                { id: "topic-09-heap", name: "Heap / Priority Queue", file: "topic-09-heap.md" },
                { id: "topic-16-graphs", name: "Graphs BFS/DFS", file: "topic-16-graphs.md" },
                { id: "topic-18-shortest-path", name: "Shortest Path", file: "topic-18-shortest-path.md" },
                { id: "topic-17-union-find", name: "Union Find", file: "topic-17-union-find.md" }
            ]
        },
        {
            tier: "Tier 3: Consolidation",
            topics: [
                { id: "topic-03-sliding-window", name: "Sliding Window", file: "topic-03-sliding-window.md" },
                { id: "topic-14-backtracking", name: "Backtracking", file: "topic-14-backtracking.md" },
                { id: "topic-06-intervals", name: "Intervals", file: "topic-06-intervals.md" },
                { id: "topic-13-trie", name: "Trie", file: "topic-13-trie.md" },
                { id: "topic-19-topological-sort", name: "Topological Sort", file: "topic-19-topological-sort.md" },
                { id: "topic-04-prefix-sum", name: "Prefix Sum", file: "topic-04-prefix-sum.md" },
                { id: "topic-02-two-pointers", name: "Two Pointers", file: "topic-02-two-pointers.md" }
            ]
        },
        {
            tier: "Tier 4: Maintenance",
            topics: [
                { id: "topic-01-arrays-hashing", name: "Arrays & Hashing", file: "topic-01-arrays-hashing.md" },
                { id: "topic-07-stack", name: "Stack", file: "topic-07-stack.md" },
                { id: "topic-10-linked-list", name: "Linked List", file: "topic-10-linked-list.md" },
                { id: "topic-12-bst", name: "Binary Search Tree", file: "topic-12-bst.md" },
                { id: "topic-21-bit-manipulation", name: "Bit Manipulation", file: "topic-21-bit-manipulation.md" },
                { id: "topic-22-segment-tree", name: "Segment Tree", file: "topic-22-segment-tree.md" },
                { id: "topic-23-fenwick-tree", name: "Fenwick Tree", file: "topic-23-fenwick-tree.md" }
            ]
        }
    ];

    // === DOM Elements ===
    const sidebarNav = document.getElementById('sidebar-nav');
    const markdownContainer = document.getElementById('markdown-container');
    const spinner = document.getElementById('loading-spinner');
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const themeText = document.getElementById('theme-text');

    // === Progress Tracking ===
    function getCompletedQuestions() {
        return JSON.parse(localStorage.getItem('dsa-completed')) || [];
    }

    function toggleQuestionCompletion(id) {
        let completed = getCompletedQuestions();
        if (completed.includes(id)) {
            completed = completed.filter(q => q !== id);
        } else {
            completed.push(id);
        }
        localStorage.setItem('dsa-completed', JSON.stringify(completed));
        updateProgressUI();
    }

    function updateProgressUI() {
        const completed = getCompletedQuestions();
        document.querySelectorAll('.question-checkbox input').forEach(checkbox => {
            const id = checkbox.dataset.id;
            const isChecked = completed.includes(id);
            checkbox.checked = isChecked;
            const card = checkbox.closest('.question-card');
            if (card) {
                if (isChecked) card.classList.add('completed');
                else card.classList.remove('completed');
            }
        });
        
        // Update header progress bar
        const totalQuestions = document.querySelectorAll('.question-checkbox input').length;
        if (totalQuestions > 0) {
            const completedInTopic = Array.from(document.querySelectorAll('.question-checkbox input')).filter(c => c.checked).length;
            const progressEl = document.getElementById('topic-progress-text');
            const barEl = document.getElementById('topic-progress-fill');
            if (progressEl) progressEl.textContent = `${completedInTopic} / ${totalQuestions} Completed`;
            if (barEl) barEl.style.width = `${(completedInTopic / totalQuestions) * 100}%`;
        }
    }

    // === Initialize Sidebar ===
    function renderSidebar() {
        sidebarNav.innerHTML = '';
        curriculum.forEach(tierObj => {
            const group = document.createElement('div');
            group.className = 'nav-group';
            
            const title = document.createElement('div');
            title.className = 'nav-group-title';
            title.textContent = tierObj.tier;
            group.appendChild(title);

            tierObj.topics.forEach(topic => {
                const link = document.createElement('a');
                link.className = 'nav-item';
                link.textContent = topic.name;
                link.dataset.file = topic.file;
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
                    link.classList.add('active');
                    sidebar.classList.remove('open');
                    loadTopicContent(topic.file);
                });
                group.appendChild(link);
            });
            sidebarNav.appendChild(group);
        });
    }

    // === Markdown Lexer logic to extract Checklist Structure ===
    function parseCurriculumMarkdown(markdownText) {
        const tokens = marked.lexer(markdownText);
        
        let topicInfo = { title: "", description: [] };
        let patterns = [];
        let currentPattern = null;
        let currentQuestion = null;
        let parsingState = 'overview'; 
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            
            if (token.type === 'heading') {
                if (token.depth === 1) {
                    topicInfo.title = token.text;
                    parsingState = 'overview';
                } 
                else if (token.depth === 2 && token.text.toLowerCase().includes('pattern')) {
                    if (currentPattern) {
                        if (currentQuestion) currentPattern.questions.push(currentQuestion);
                        patterns.push(currentPattern);
                    }
                    currentPattern = {
                        title: token.text,
                        description: [],
                        invariant: [],
                        questions: []
                    };
                    currentQuestion = null;
                    parsingState = 'pattern';
                }
                else if (token.depth === 3 && currentPattern) {
                    if (token.text.includes('Pattern Description')) parsingState = 'pattern_desc';
                    else if (token.text.includes('Core Invariant')) parsingState = 'invariant';
                    else if (token.text.includes('Curated Questions')) parsingState = 'questions';
                }
                else if (token.depth === 5 && token.text.startsWith('Q') && currentPattern) {
                    if (currentQuestion) currentPattern.questions.push(currentQuestion);
                    currentQuestion = {
                        title: token.text.replace(/^Q\d+:\s*/, ''),
                        id: token.text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(), // simple id
                        link: '#',
                        difficulty: 'Unknown',
                        companies: '',
                        observation: []
                    };
                    parsingState = 'question_details';
                }
                continue;
            }
            
            if (parsingState === 'overview' && token.type !== 'space') {
                topicInfo.description.push(token.raw);
            }
            else if (parsingState === 'pattern_desc' && token.type !== 'space') {
                currentPattern.description.push(token.raw);
            }
            else if (parsingState === 'invariant' && token.type !== 'space') {
                currentPattern.invariant.push(token.raw);
            }
            else if (parsingState === 'question_details') {
                if (token.type === 'table') {
                    token.rows.forEach(row => {
                        const key = row[0].text.replace(/\*\*/g, '').trim();
                        const val = row[1].text.trim();
                        if (key.includes('Link')) {
                            const rawLinkMatch = val.match(/(https?:\/\/[^\s]+)/);
                            currentQuestion.link = rawLinkMatch ? rawLinkMatch[0] : val;
                        }
                        else if (key.includes('Difficulty')) currentQuestion.difficulty = val.replace(/\*\*/g, '');
                        else if (key.includes('Companies')) currentQuestion.companies = val;
                    });
                } else if (token.type !== 'space' && token.type !== 'hr') {
                    currentQuestion.observation.push(token.raw);
                }
            }
        }
        
        if (currentQuestion && currentPattern) currentPattern.questions.push(currentQuestion);
        if (currentPattern) patterns.push(currentPattern);
        
        return { topicInfo, patterns };
    }

    function renderChecklistUI(parsedData) {
        let html = '';
        
        // Render Header
        html += `<div class="topic-header">
                    <h1>${parsedData.topicInfo.title}</h1>
                    <div class="topic-progress-container">
                        <div class="progress-bar-bg"><div class="progress-bar-fill" id="topic-progress-fill" style="width: 0%"></div></div>
                        <div class="progress-text" id="topic-progress-text">0 / 0 Completed</div>
                    </div>
                 </div>`;
                 
        // Render Overview Collapsible
        if (parsedData.topicInfo.description.length > 0) {
            html += `<details class="theory-accordion">
                        <summary>View Topic Overview & Theory</summary>
                        <div class="accordion-content markdown-body">
                            ${DOMPurify.sanitize(marked.parse(parsedData.topicInfo.description.join('\n')))}
                        </div>
                     </details>`;
        }

        // Render Levels (Patterns)
        parsedData.patterns.forEach((pattern, index) => {
            html += `<div class="level-card">
                        <div class="level-header">
                            <span class="level-badge">Level ${index + 1}</span>
                            <h2>${pattern.title.replace(/^Pattern \d+\.\d+:\s*/, '')}</h2>
                        </div>`;
            
            // Render Pattern Theory Accordion
            const theoryContent = pattern.description.join('\n') + '\n\n### Core Invariant\n' + pattern.invariant.join('\n');
            if (theoryContent.trim().length > 0) {
                html += `<details class="theory-accordion mb-4">
                            <summary>Pattern Concept & Invariants</summary>
                            <div class="accordion-content markdown-body">
                                ${DOMPurify.sanitize(marked.parse(theoryContent))}
                            </div>
                         </details>`;
            }

            // Render Questions Checklist
            if (pattern.questions.length > 0) {
                html += `<div class="question-list">`;
                pattern.questions.forEach(q => {
                    const diffClass = q.difficulty.toLowerCase().includes('hard') ? 'diff-hard' : 
                                      q.difficulty.toLowerCase().includes('medium') ? 'diff-medium' : 'diff-easy';
                    
                    const qId = q.link ? btoa(q.link).replace(/=/g, '') : q.id; // stable ID based on URL
                    
                    html += `<div class="question-card">
                                <div class="question-header">
                                    <label class="question-checkbox">
                                        <input type="checkbox" data-id="${qId}">
                                        <span class="checkmark"></span>
                                    </label>
                                    <div class="question-title-wrapper">
                                        <a href="${q.link}" target="_blank" class="question-title">${q.title} 🔗</a>
                                        <div class="question-meta">
                                            <span class="badge ${diffClass}">${q.difficulty}</span>
                                            <span class="companies">${q.companies}</span>
                                        </div>
                                    </div>
                                    <button class="expand-btn">▼</button>
                                </div>
                                <div class="question-details markdown-body" style="display: none;">
                                    ${DOMPurify.sanitize(marked.parse(q.observation.join('\n')))}
                                </div>
                             </div>`;
                });
                html += `</div>`;
            } else {
                 html += `<p class="no-questions">No curated questions mapped to this pattern.</p>`;
            }
            
            html += `</div>`; // End Level Card
        });

        markdownContainer.innerHTML = html;
        Prism.highlightAllUnder(markdownContainer);
        
        // Attach Event Listeners to new DOM elements
        document.querySelectorAll('.question-checkbox input').forEach(cb => {
            cb.addEventListener('change', (e) => {
                toggleQuestionCompletion(e.target.dataset.id);
            });
        });

        document.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.question-card');
                const details = card.querySelector('.question-details');
                if (details.style.display === 'none') {
                    details.style.display = 'block';
                    e.target.textContent = '▲';
                } else {
                    details.style.display = 'none';
                    e.target.textContent = '▼';
                }
            });
        });

        updateProgressUI();
    }

    // === Load Content ===
    async function loadTopicContent(filename) {
        spinner.style.display = 'flex';
        markdownContainer.style.display = 'none';
        
        try {
            const response = await fetch(`./content/${filename}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const markdownText = await response.text();
            
            marked.setOptions({ gfm: true, breaks: true });
            
            const parsedData = parseCurriculumMarkdown(markdownText);
            renderChecklistUI(parsedData);
            
            document.querySelector('.content-area').scrollTop = 0;

        } catch (error) {
            console.error("Failed to load markdown:", error);
            markdownContainer.innerHTML = `
                <div style="text-align:center; padding: 40px; color: var(--text-secondary);">
                    <h2>Content Loading Error</h2>
                    <p>Failed to load <code>${filename}</code>.</p>
                </div>`;
        } finally {
            spinner.style.display = 'none';
            markdownContainer.style.display = 'block';
        }
    }

    // === Theme Toggle Logic ===
    function toggleTheme() {
        const isDark = document.body.classList.contains('dark-theme');
        if (isDark) {
            document.body.classList.remove('dark-theme');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            themeText.textContent = 'Dark Mode';
            localStorage.setItem('dsa-theme', 'light');
        } else {
            document.body.classList.add('dark-theme');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            themeText.textContent = 'Light Mode';
            localStorage.setItem('dsa-theme', 'dark');
        }
    }

    const savedTheme = localStorage.getItem('dsa-theme');
    if (savedTheme === 'light') toggleTheme(); 

    themeToggle.addEventListener('click', toggleTheme);
    menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

    // Initialize
    renderSidebar();
});
