// ===========================
// FAQ Page Functionality
// ===========================
let currentLanguage = localStorage.getItem('norouz-language') || 'fr';
let translations = {};

// FAQ State
let faqData = [];
let filteredFAQ = [];
let activeCategory = 'all';

// Load translations and FAQ data
async function loadFAQData() {
    try {
        const response = await fetch('./js/translations.json');
        const data = await response.json();
        translations = data;
        faqData = data[currentLanguage]?.faq?.items || [];
        filteredFAQ = [...faqData];
        renderFAQ();
        return true;
    } catch (error) {
        console.error('Error loading FAQ data:', error);
        return false;
    }
}

// Change language
function changeLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Language "${lang}" not found`);
        return;
    }
    
    currentLanguage = lang;
    localStorage.setItem('norouz-language', lang);
    updateFAQContent();
    updateLanguageSelector();
    updateCategoryFilters();
    
    // Reload FAQ data for new language
    loadFAQData();
}

// Update FAQ content (text elements)
function updateFAQContent() {
    const translation = translations[currentLanguage];
    if (!translation) return;
    
    // Update navigation and page elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedValue(translation, key);
        if (value) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        }
    });
    
    // Update document title
    document.title = `FAQ - ${translation.faq?.title || 'Questions Fréquentes'} | Norouz Peinture`;
}

// Update language selector display
function updateLanguageSelector() {
    const langCurrent = document.getElementById('langCurrent');
    const langText = langCurrent?.querySelector('.lang-text');
    const flag = langCurrent?.querySelector('.flag');
    
    const languageData = {
        fr: { text: 'FR', flag: '🇫🇷' },
        en: { text: 'EN', flag: '🇬🇧' },
        es: { text: 'ES', flag: '🇪🇸' },
        de: { text: 'DE', flag: '🇩🇪' }
    };
    
    const lang = languageData[currentLanguage];
    if (lang && langText && flag) {
        langText.textContent = lang.text;
        flag.textContent = lang.flag;
    }
}

// Update category filter texts
function updateCategoryFilters() {
    const translation = translations[currentLanguage];
    if (!translation) return;
    
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        const category = filter.getAttribute('data-category');
        const span = filter.querySelector('span');
        
        if (category === 'all') {
            span.textContent = translation.faq?.categories?.general || 'Toutes';
        } else {
            span.textContent = translation.faq?.categories?.[category] || category;
        }
    });
}

// Render FAQ items
function renderFAQ() {
    const faqList = document.getElementById('faqList');
    if (!faqList) return;
    
    faqList.innerHTML = '';
    
    if (filteredFAQ.length === 0) {
        faqList.innerHTML = `
            <div class="no-results">
                <h3>Aucun résultat trouvé</h3>
                <p>Essayez de modifier vos critères de recherche ou de contact direct.</p>
            </div>
        `;
        return;
    }
    
    filteredFAQ.forEach((item, index) => {
        const faqItem = createFAQItem(item, index);
        faqList.appendChild(faqItem);
    });
}

// Create FAQ item element
function createFAQItem(item, index) {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';
    faqItem.setAttribute('data-category', item.category);
    
    faqItem.innerHTML = `
        <button class="faq-question" data-faq="${index}">
            <span>${item.question}</span>
            <svg class="faq-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
        </button>
        <div class="faq-answer" id="answer-${index}">
            <p>${item.answer}</p>
        </div>
    `;
    
    return faqItem;
}

// Filter FAQ by category
function filterByCategory(category) {
    activeCategory = category;
    
    if (category === 'all') {
        filteredFAQ = [...faqData];
    } else {
        filteredFAQ = faqData.filter(item => item.category === category);
    }
    
    renderFAQ();
    updateActiveFilter();
}

// Search FAQ items
function searchFAQ(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredFAQ = activeCategory === 'all' ? [...faqData] : faqData.filter(item => item.category === activeCategory);
    } else {
        filteredFAQ = faqData.filter(item => {
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
            const matchesSearch = item.question.toLowerCase().includes(searchTerm) || 
                                item.answer.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
    }
    
    renderFAQ();
}

// Update active category filter
function updateActiveFilter() {
    document.querySelectorAll('.category-filter').forEach(filter => {
        filter.classList.remove('active');
        if (filter.getAttribute('data-category') === activeCategory) {
            filter.classList.add('active');
        }
    });
}

// Toggle FAQ answer
function toggleFAQAnswer(faqIndex) {
    const answer = document.getElementById(`answer-${faqIndex}`);
    const question = document.querySelector(`[data-faq="${faqIndex}"]`);
    
    if (!answer || !question) return;
    
    const isActive = answer.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-answer.active').forEach(activeAnswer => {
        activeAnswer.classList.remove('active');
    });
    
    document.querySelectorAll('.faq-question.active').forEach(activeQuestion => {
        activeQuestion.classList.remove('active');
    });
    
    // Toggle current FAQ item
    if (!isActive) {
        answer.classList.add('active');
        question.classList.add('active');
    }
}

// Helper function to get nested object value
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Initialize FAQ page
document.addEventListener('DOMContentLoaded', async () => {
    // Load FAQ data
    await loadFAQData();
    
    // Search functionality
    const searchInput = document.getElementById('faqSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchFAQ(e.target.value);
        });
    }
    
    // Category filter functionality
    document.querySelectorAll('.category-filter').forEach(filter => {
        filter.addEventListener('click', (e) => {
            e.preventDefault();
            const category = filter.getAttribute('data-category');
            if (category) {
                filterByCategory(category);
            }
        });
    });
    
    // FAQ item toggle functionality (event delegation)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.faq-question')) {
            const faqIndex = e.target.closest('.faq-question').getAttribute('data-faq');
            if (faqIndex) {
                toggleFAQAnswer(faqIndex);
            }
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close all FAQ items
            document.querySelectorAll('.faq-answer.active').forEach(answer => {
                answer.classList.remove('active');
            });
            document.querySelectorAll('.faq-question.active').forEach(question => {
                question.classList.remove('active');
            });
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Load translations and setup language selector
async function setupLanguageSelector() {
    // Load translations
    try {
        const response = await fetch('./js/translations.json');
        translations = await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
    
    // Set initial language
    changeLanguage(currentLanguage);
    
    // Language selector event listeners
    const langCurrent = document.getElementById('langCurrent');
    const languageDropdown = document.getElementById('languageDropdown');
    
    // Toggle dropdown
    if (langCurrent) {
        langCurrent.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            languageDropdown?.classList.toggle('active');
        });
    }
    
    // Language option clicks
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = option.getAttribute('data-lang');
            if (lang) {
                changeLanguage(lang);
                languageDropdown?.classList.remove('active');
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            languageDropdown?.classList.remove('active');
        }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            languageDropdown?.classList.remove('active');
        }
    });
}

// Initialize language selector
setupLanguageSelector();