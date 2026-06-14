/**
 * Software Engineer Mastery OS - Core Intelligence Engine
 * 
 * This module is the centralized brain of the application. It provides
 * 8 distinct intelligence layers that can be accessed by any front-end
 * portal (DSA, System Design, CS Fundamentals, Agentic AI).
 * 
 * It manages state in localStorage to ensure cross-platform data persistence.
 */

const MasteryOS = (function() {
    
    // --- 0. CORE STATE MANAGER ---
    class CoreState {
        constructor() {
            this.storageKey = 'mastery_os_global_state';
            this.state = this.loadState();
        }

        loadState() {
            const defaultState = {
                user: {
                    readiness: { dsa: 0, sysDesign: 0, csFund: 0, aiEng: 0, overall: 0 },
                    lastActive: Date.now(),
                    createdAt: Date.now()
                },
                activity_log: [],
                nodes: {}, // Knowledge graph nodes (questions, patterns, topics)
                mistake_vault: {
                    wrongIntuition: 0,
                    wrongInvariant: 0,
                    boundaryMistakes: 0,
                    optimizationMisses: 0,
                    communication: 0,
                    designFlaws: 0
                }
            };

            try {
                const stored = localStorage.getItem(this.storageKey);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    // Merge to ensure new keys exist
                    return { ...defaultState, ...parsed };
                }
            } catch (e) {
                console.error("MasteryOS: Failed to load state", e);
            }
            return defaultState;
        }

        saveState() {
            try {
                this.state.user.lastActive = Date.now();
                localStorage.setItem(this.storageKey, JSON.stringify(this.state));
            } catch (e) {
                console.error("MasteryOS: Failed to save state", e);
            }
        }

        getNode(id) {
            if (!this.state.nodes[id]) {
                this.state.nodes[id] = {
                    id: id,
                    type: 'unknown',
                    status: 'unseen', // unseen, learning, weak, strong, mastered
                    attempts: 0,
                    successfulAttempts: 0,
                    history: [], // { date, result, mistakeTags }
                    metrics: {
                        interval: 0,
                        repetition: 0,
                        easeFactor: 2.5,
                        nextReview: 0
                    }
                };
            }
            return this.state.nodes[id];
        }

        logActivity(domain, action, nodeId, details) {
            this.state.activity_log.push({
                timestamp: Date.now(),
                domain: domain,
                action: action,
                nodeId: nodeId,
                details: details
            });
            this.saveState();
        }
    }

    // --- 1. PATTERN RECOGNITION ENGINE ---
    class PatternRecognitionEngine {
        constructor(stateManager) {
            this.sm = stateManager;
        }

        /**
         * Logs an attempt on a problem and evaluates pattern recognition.
         * @param {string} patternId - e.g., 'dsa:pattern:sliding_window'
         * @param {boolean} recognizedPattern - Did the user recognize the pattern before coding?
         */
        logAttempt(patternId, recognizedPattern) {
            const node = this.sm.getNode(patternId);
            node.type = 'pattern';
            node.attempts += 1;
            if (recognizedPattern) node.successfulAttempts += 1;
            
            node.history.push({ date: Date.now(), recognized: recognizedPattern });
            
            // Keep history to last 5 for rolling accuracy
            if (node.history.length > 5) node.history.shift();

            this._recalculateStatus(node);
            this.sm.saveState();
        }

        _recalculateStatus(node) {
            if (node.attempts === 0) return;
            const recentAcc = node.history.filter(h => h.recognized).length / node.history.length;
            
            if (node.attempts >= 3 && recentAcc >= 0.8) node.status = 'strong';
            else if (node.attempts >= 5 && recentAcc >= 0.9) node.status = 'mastered';
            else if (recentAcc < 0.6) node.status = 'weak';
            else node.status = 'learning';
        }

        getWeakPatterns(domain) {
            const nodes = this.sm.state.nodes;
            return Object.values(nodes)
                .filter(n => n.type === 'pattern' && n.status === 'weak' && n.id.startsWith(domain))
                .sort((a, b) => a.successfulAttempts / a.attempts - b.successfulAttempts / b.attempts); // lowest accuracy first
        }
    }

    // --- 2. REVISION INTELLIGENCE ENGINE (FSRS/SM-2 Variant) ---
    class RevisionIntelligenceEngine {
        constructor(stateManager) {
            this.sm = stateManager;
        }

        /**
         * Grade a review on a scale of 0-5 (0 = blackout, 5 = perfect recall)
         */
        submitReview(nodeId, grade) {
            const node = this.sm.getNode(nodeId);
            const m = node.metrics;

            if (grade >= 3) {
                if (m.repetition === 0) m.interval = 1;
                else if (m.repetition === 1) m.interval = 6;
                else m.interval = Math.round(m.interval * m.easeFactor);
                m.repetition += 1;
            } else {
                m.repetition = 0;
                m.interval = 1;
            }

            m.easeFactor = m.easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
            if (m.easeFactor < 1.3) m.easeFactor = 1.3;

            // Convert interval days to timestamp
            const DAY_IN_MS = 24 * 60 * 60 * 1000;
            m.nextReview = Date.now() + (m.interval * DAY_IN_MS);
            
            this.sm.saveState();
        }

        getDueReviews(domain) {
            const now = Date.now();
            const nodes = this.sm.state.nodes;
            return Object.values(nodes)
                .filter(n => n.id.startsWith(domain) && n.metrics.nextReview > 0 && n.metrics.nextReview <= now)
                .sort((a, b) => a.metrics.nextReview - b.metrics.nextReview); // Most overdue first
        }
    }

    // --- 3. INTERVIEW READINESS ENGINE ---
    class InterviewReadinessEngine {
        constructor(stateManager) {
            this.sm = stateManager;
        }

        calculateReadiness(domain) {
            // Mock algorithm: Readiness is based on % of patterns mastered/strong
            const nodes = Object.values(this.sm.state.nodes).filter(n => n.id.startsWith(domain));
            if (nodes.length === 0) return 0;

            let score = 0;
            nodes.forEach(n => {
                if (n.status === 'mastered') score += 1.0;
                else if (n.status === 'strong') score += 0.8;
                else if (n.status === 'learning') score += 0.3;
                else if (n.status === 'weak') score -= 0.2; // penalty for weak areas
            });

            // Normalize to a 0-100 scale (Assuming roughly 50 core nodes per domain)
            const readiness = Math.max(0, Math.min(100, Math.round((score / 50) * 100)));
            this.sm.state.user.readiness[domain] = readiness;
            this.sm.saveState();
            return readiness;
        }

        getOverallReadiness() {
            const r = this.sm.state.user.readiness;
            const overall = Math.round((r.dsa * 0.4) + (r.sysDesign * 0.4) + (r.csFund * 0.1) + (r.aiEng * 0.1));
            this.sm.state.user.readiness.overall = overall;
            this.sm.saveState();
            return overall;
        }
    }

    // --- 4. MISTAKE TRACKING SYSTEM ---
    class MistakeTrackingSystem {
        constructor(stateManager) {
            this.sm = stateManager;
        }

        /**
         * @param {Array<string>} tags - e.g. ['boundaryMistakes', 'wrongIntuition']
         */
        logMistakes(nodeId, tags) {
            const vault = this.sm.state.mistake_vault;
            tags.forEach(tag => {
                if (vault[tag] !== undefined) vault[tag]++;
            });
            this.sm.logActivity('global', 'mistake_logged', nodeId, { tags });
        }

        getFatalFlaw() {
            const vault = this.sm.state.mistake_vault;
            let maxCount = 0;
            let flaw = 'None';
            for (const [key, val] of Object.entries(vault)) {
                if (val > maxCount) {
                    maxCount = val;
                    flaw = key;
                }
            }
            return { flaw, count: maxCount };
        }
    }

    // --- 5. LEARNING ANALYTICS ---
    class LearningAnalytics {
        constructor(stateManager) {
            this.sm = stateManager;
        }

        getVelocity() {
            // Returns problems solved in the last 7 days
            const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
            const now = Date.now();
            const recent = this.sm.state.activity_log.filter(a => (now - a.timestamp) < SEVEN_DAYS && a.action === 'solve');
            return recent.length;
        }

        getConsistencyStreak() {
            // Simplified streak calculation based on activity log
            return "WIP"; // Requires deep date iteration
        }
    }

    // --- 6. KNOWLEDGE GRAPH ---
    class KnowledgeGraph {
        constructor(stateManager) {
            this.sm = stateManager;
            // Pre-defined edges (Concept -> Concept)
            this.edges = [
                { from: 'dsa:lru_cache', to: 'sysDesign:caching', weight: 1.0 },
                { from: 'sysDesign:consistent_hashing', to: 'dsa:binary_search', weight: 0.8 },
                { from: 'dsa:graphs', to: 'aiEng:state_space_search', weight: 0.9 }
            ];
        }

        getUnlockedConcepts(domain) {
            // Return concepts in 'domain' that the user is mathematically ready for
            // based on prerequisites mastered in other domains.
            const masteredIds = Object.keys(this.sm.state.nodes).filter(id => this.sm.state.nodes[id].status === 'mastered');
            
            return this.edges
                .filter(e => masteredIds.includes(e.from) && e.to.startsWith(domain))
                .map(e => e.to);
        }
    }

    // --- 7. INTERVIEW SIMULATION FRAMEWORK ---
    class InterviewSimulationFramework {
        constructor(stateManager) {
            this.sm = stateManager;
        }

        generateMockSession() {
            // Pulls 1 strong pattern, 1 weak pattern, 1 sys design
            const weakDsa = Object.values(this.sm.state.nodes).filter(n => n.type === 'pattern' && n.status === 'weak' && n.id.startsWith('dsa'));
            const strongDsa = Object.values(this.sm.state.nodes).filter(n => n.type === 'pattern' && n.status === 'strong' && n.id.startsWith('dsa'));
            
            return {
                id: 'mock_' + Date.now(),
                durationMins: 45,
                questions: [
                    weakDsa.length > 0 ? weakDsa[0].id : 'dsa:pattern:random_1',
                    strongDsa.length > 0 ? strongDsa[0].id : 'dsa:pattern:random_2',
                    'sysDesign:topic:design_rate_limiter'
                ]
            };
        }
    }

    // --- 8. RESOURCE RECOMMENDATION ENGINE ---
    class ResourceRecommendationEngine {
        constructor(stateManager) {
            this.sm = stateManager;
        }

        getRecommendations() {
            const recommendations = [];
            const flaw = new MistakeTrackingSystem(this.sm).getFatalFlaw();

            if (flaw.flaw === 'boundaryMistakes') {
                recommendations.push({ title: 'Mastering Loop Invariants', type: 'blog', url: '#' });
            }
            if (flaw.flaw === 'optimizationMisses') {
                recommendations.push({ title: 'Time Complexity Masterclass', type: 'video', url: '#' });
            }

            // Also recommend resources for weak patterns
            const weakPatterns = new PatternRecognitionEngine(this.sm).getWeakPatterns('dsa');
            if (weakPatterns.length > 0) {
                recommendations.push({ title: `Pattern Builder: ${weakPatterns[0].id}`, type: 'practice', url: '#' });
            }

            return recommendations;
        }
    }

    // --- INITIALIZATION ---
    const StateManager = new CoreState();

    return {
        State: StateManager,
        Patterns: new PatternRecognitionEngine(StateManager),
        Revision: new RevisionIntelligenceEngine(StateManager),
        Readiness: new InterviewReadinessEngine(StateManager),
        Mistakes: new MistakeTrackingSystem(StateManager),
        Analytics: new LearningAnalytics(StateManager),
        Graph: new KnowledgeGraph(StateManager),
        Simulation: new InterviewSimulationFramework(StateManager),
        Resources: new ResourceRecommendationEngine(StateManager)
    };

})();

// Export for module systems or attach to window
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MasteryOS;
} else {
    window.MasteryOS = MasteryOS;
}
