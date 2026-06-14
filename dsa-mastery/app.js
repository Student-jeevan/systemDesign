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
                    // Update active state
                    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Close mobile sidebar if open
                    sidebar.classList.remove('open');

                    // Load content
                    loadMarkdownContent(topic.file);
                });
                group.appendChild(link);
            });
            sidebarNav.appendChild(group);
        });
    }

    // === Load and Render Markdown ===
    async function loadMarkdownContent(filename) {
        spinner.style.display = 'flex';
        markdownContainer.style.display = 'none';
        
        try {
            // Note: Since this is a static site without a backend, 
            // the fetch requires a local server (like Live Server) to bypass CORS for local files.
            const response = await fetch(`./content/${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const markdownText = await response.text();
            
            // Configure Marked.js options
            marked.setOptions({
                gfm: true,
                breaks: true,
            });

            // Parse markdown to HTML
            let htmlContent = marked.parse(markdownText);
            
            // Sanitize HTML
            htmlContent = DOMPurify.sanitize(htmlContent);
            
            // Inject to DOM
            markdownContainer.innerHTML = htmlContent;
            
            // Apply syntax highlighting
            Prism.highlightAllUnder(markdownContainer);
            
            // Scroll to top
            document.querySelector('.content-area').scrollTop = 0;

        } catch (error) {
            console.error("Failed to load markdown:", error);
            markdownContainer.innerHTML = `
                <div style="text-align:center; padding: 40px; color: var(--text-secondary);">
                    <h2>Content Loading Error</h2>
                    <p>Failed to load <code>${filename}</code>.</p>
                    <p><em>Note: If you are opening this file directly in the browser (file://), fetch requests might fail due to CORS policies. Please use a local server (like VS Code Live Server or python -m http.server).</em></p>
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

    // Initialize Theme
    const savedTheme = localStorage.getItem('dsa-theme');
    if (savedTheme === 'light') {
        toggleTheme(); // It starts dark by default, so toggle to light
    }

    themeToggle.addEventListener('click', toggleTheme);

    // === Mobile Menu Toggle ===
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Run initialization
    renderSidebar();
});
