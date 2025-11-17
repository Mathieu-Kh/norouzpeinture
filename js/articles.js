// ===========================
// Articles Page Functionality
// ===========================
let currentLanguage = localStorage.getItem('norouz-language') || 'fr';
let translations = {};

// Articles State
let articlesData = [];
let filteredArticles = [];
let activeCategory = 'all';
let featuredArticle = null;

// Load translations and articles data
async function loadArticlesData() {
    try {
        const response = await fetch('./js/translations.json');
        const data = await response.json();
        translations = data;
        articlesData = data[currentLanguage]?.articles?.items || [];
        filteredArticles = [...articlesData];
        
        // Set featured article (first one or most recent)
        featuredArticle = articlesData[0] || null;
        
        renderArticles();
        return true;
    } catch (error) {
        console.error('Error loading articles data:', error);
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
    updateArticlesContent();
    updateLanguageSelector();
    updateCategoryFilters();
    
    // Reload articles data for new language
    loadArticlesData();
}

// Update articles content (text elements)
function updateArticlesContent() {
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
    document.title = `Articles - ${translation.articles?.title || 'Conseils et Actualités'} | Norouz Peinture`;
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
            span.textContent = translation.articles?.latest || 'Tous les articles';
        } else {
            span.textContent = translation.articles?.categories?.[category] || category;
        }
    });
}

// Render featured article
function renderFeaturedArticle() {
    const featuredContainer = document.getElementById('featuredArticle');
    if (!featuredContainer || !featuredArticle) return;
    
    const readTimeText = translations[currentLanguage]?.articles?.minRead || 'min de lecture';
    const byText = translations[currentLanguage]?.articles?.by || 'Par';
    const onText = translations[currentLanguage]?.articles?.on || 'Le';
    const readMoreText = translations[currentLanguage]?.articles?.readMore || 'Lire la suite';
    const featuredText = translations[currentLanguage]?.articles?.featured || 'À la une';
    
    const formattedDate = formatDate(featuredArticle.date, currentLanguage);
    
    featuredContainer.innerHTML = `
        <div class="featured-card" onclick="openArticleModal('${featuredArticle.slug}')">
            <div class="featured-image">
                <div class="featured-badge">${featuredText}</div>
                🎨
            </div>
            <div class="featured-content">
                <div class="featured-category">${getCategoryName(featuredArticle.category)}</div>
                <h3 class="featured-title">${featuredArticle.title}</h3>
                <p class="featured-excerpt">${featuredArticle.excerpt}</p>
                <div class="featured-meta">
                    <span>${byText} ${featuredArticle.author}</span>
                    <span>${onText} ${formattedDate}</span>
                    <span>${featuredArticle.readTime} ${readTimeText}</span>
                </div>
                <button class="read-more-btn">
                    ${readMoreText}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// Render articles grid
function renderArticlesGrid() {
    const articlesContainer = document.getElementById('articlesGrid');
    if (!articlesContainer) return;
    
    if (filteredArticles.length === 0) {
        document.getElementById('noResults').style.display = 'block';
        articlesContainer.innerHTML = '';
        return;
    }
    
    document.getElementById('noResults').style.display = 'none';
    
    const readTimeText = translations[currentLanguage]?.articles?.minRead || 'min de lecture';
    const byText = translations[currentLanguage]?.articles?.by || 'Par';
    const onText = translations[currentLanguage]?.articles?.on || 'Le';
    
    articlesContainer.innerHTML = filteredArticles.map((article, index) => {
        // Skip featured article from grid
        if (featuredArticle && article.slug === featuredArticle.slug) {
            return '';
        }
        
        const formattedDate = formatDate(article.date, currentLanguage);
        
        return `
            <div class="article-card" onclick="openArticleModal('${article.slug}')">
                <div class="article-image">
                    <div class="article-category">${getCategoryName(article.category)}</div>
                    ${getCategoryIcon(article.category)}
                </div>
                <div class="article-content">
                    <h4 class="article-title">${article.title}</h4>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-meta">
                        <span>${byText} ${article.author}</span>
                        <span>${article.readTime} ${readTimeText}</span>
                    </div>
                    <div class="article-tags">
                        ${article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Render all articles
function renderArticles() {
    renderFeaturedArticle();
    renderArticlesGrid();
}

// Filter articles by category
function filterByCategory(category) {
    activeCategory = category;
    
    if (category === 'all') {
        filteredArticles = [...articlesData];
    } else {
        filteredArticles = articlesData.filter(article => article.category === category);
    }
    
    renderArticles();
    updateActiveFilter();
}

// Search articles
function searchArticles(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredArticles = activeCategory === 'all' ? [...articlesData] : articlesData.filter(article => article.category === activeCategory);
    } else {
        filteredArticles = articlesData.filter(article => {
            const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
            const matchesSearch = article.title.toLowerCase().includes(searchTerm) || 
                                article.excerpt.toLowerCase().includes(searchTerm) ||
                                article.content.toLowerCase().includes(searchTerm) ||
                                article.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            return matchesCategory && matchesSearch;
        });
    }
    
    renderArticles();
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

// Open article modal
function openArticleModal(slug) {
    const article = articlesData.find(a => a.slug === slug);
    if (!article) return;
    
    const modal = document.getElementById('articleModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalAuthor = document.getElementById('modalAuthor');
    const modalDate = document.getElementById('modalDate');
    const modalReadTime = document.getElementById('modalReadTime');
    const modalBody = document.getElementById('modalBody');
    
    const readTimeText = translations[currentLanguage]?.articles?.minRead || 'min de lecture';
    const byText = translations[currentLanguage]?.articles?.by || 'Par';
    const onText = translations[currentLanguage]?.articles?.on || 'Le';
    const formattedDate = formatDate(article.date, currentLanguage);
    
    modalTitle.textContent = article.title;
    modalCategory.textContent = getCategoryName(article.category);
    modalAuthor.textContent = `${byText} ${article.author}`;
    modalDate.textContent = `${onText} ${formattedDate}`;
    modalReadTime.textContent = `${article.readTime} ${readTimeText}`;
    modalBody.innerHTML = formatArticleContent(article.content);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close article modal
function closeArticleModal() {
    const modal = document.getElementById('articleModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Format article content
function formatArticleContent(content) {
    // Convert markdown-like content to HTML
    return content
        .replace(/## (.*?)(?=\n|$)/g, '<h2>$1</h2>')
        .replace(/### (.*?)(?=\n|$)/g, '<h3>$1</h3>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^\*(.*?)$/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>')
        .replace(/<li>/g, '<ul><li>')
        .replace(/<\/li>/g, '</li></ul>')
        .replace(/(<\/ul>\s*<ul>)/g, '')
        .replace(/^(?!<[h|u|l])/gm, '<p>')
        .replace(/(?![h|u|l]>$)/gm, '</p>');
}

// Get category name in current language
function getCategoryName(category) {
    const translation = translations[currentLanguage];
    return translation?.articles?.categories?.[category] || category;
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        guides: '📚',
        conseils: '💡',
        tendances: '🎨',
        maintenance: '🔧'
    };
    return icons[category] || '📝';
}

// Format date for current language
function formatDate(dateString, language) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    switch (language) {
        case 'en':
            return date.toLocaleDateString('en-US', options);
        case 'es':
            return date.toLocaleDateString('es-ES', options);
        case 'de':
            return date.toLocaleDateString('de-DE', options);
        default:
            return date.toLocaleDateString('fr-FR', options);
    }
}

// Helper function to get nested object value
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Initialize articles page
document.addEventListener('DOMContentLoaded', async () => {
    // Load articles data
    await loadArticlesData();
    
    // Search functionality
    const searchInput = document.getElementById('articlesSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchArticles(e.target.value);
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
    
    // Modal functionality
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeArticleModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeArticleModal);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeArticleModal();
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