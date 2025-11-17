// ===========================
// Navigation Toggle (Mobile)
// ===========================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===========================
// Sticky Header on Scroll
// ===========================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// ===========================
// Smooth Scrolling (backup)
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Contact Form Handling
// ===========================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Hide previous messages
    formSuccess.style.display = 'none';
    formError.style.display = 'none';
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.email || !data.phone || !data.message) {
        formError.style.display = 'flex';
        formError.textContent = 'Veuillez remplir tous les champs obligatoires.';
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        formError.style.display = 'flex';
        formError.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Veuillez entrer une adresse email valide.';
        return;
    }
    
    // Phone validation (French format)
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        formError.style.display = 'flex';
        formError.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Veuillez entrer un numéro de téléphone valide.';
        return;
    }
    
    try {
        // In production, this would send to a backend API
        // For now, we'll simulate a successful submission
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create mailto link as fallback
        const subject = `Demande de devis - ${data.service || 'Non spécifié'}`;
        const body = `
Nom: ${data.name}
Email: ${data.email}
Téléphone: ${data.phone}
Service: ${data.service || 'Non spécifié'}

Message:
${data.message}
        `;
        
        const mailtoLink = `mailto:mathieu@norouzpeinture.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Show success message
        formSuccess.style.display = 'flex';
        contactForm.reset();
        
        // Optional: Open email client
        // window.location.href = mailtoLink;
        
        // Log form data (for development)
        console.log('Form submitted:', data);
        
        // Scroll to success message
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        formError.style.display = 'flex';
        formError.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Une erreur s\'est produite. Veuillez réessayer ou nous contacter par téléphone.';
        console.error('Form submission error:', error);
    }
});

// ===========================
// Chatbot Functionality
// ===========================
const chatbot = document.getElementById('chatbot');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const quickReplies = document.querySelectorAll('.quick-reply');

// Toggle chatbot
chatbotToggle.addEventListener('click', () => {
    chatbot.classList.toggle('active');
});

chatbotClose.addEventListener('click', () => {
    chatbot.classList.remove('active');
});

// Quick reply responses
const responses = {
    "Quels sont vos tarifs ?": "Nos tarifs varient selon la nature et l'ampleur des travaux. Pour un devis personnalisé et gratuit, n'hésitez pas à nous contacter au +33 6 68 66 43 91 ou via le formulaire de contact. Nous nous déplaçons gratuitement pour évaluer vos besoins.",
    
    "Quelle est votre zone d'intervention ?": "Nous intervenons sur Angers et ses alentours dans un rayon de 50 km. Cela inclut les communes environnantes. N'hésitez pas à nous contacter pour vérifier si nous couvrons votre zone.",
    
    "Quels services proposez-vous ?": "Nous proposons une gamme complète de services :\n• Peinture intérieure et murale\n• Pose et dépose de papier peint\n• Pose de toile de verre\n• Réparation de dégâts des eaux\n• Peinture sur bois et métal\n• Teinture de bois\n\nConsultez notre section Services pour plus de détails !",
    
    "Comment obtenir un devis ?": "Pour obtenir un devis gratuit et sans engagement :\n1. Appelez-nous au +33 6 68 66 43 91\n2. Envoyez-nous un email à mathieu@norouzpeinture.fr\n3. Remplissez notre formulaire de contact\n\nNous vous répondrons rapidement et nous déplaçons gratuitement pour évaluer vos travaux."
};

// Handle quick replies
quickReplies.forEach(button => {
    button.addEventListener('click', () => {
        const question = button.getAttribute('data-reply');
        const answer = responses[question];
        
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'chatbot-message user';
        userMessage.innerHTML = `<p>${question}</p>`;
        chatbotMessages.appendChild(userMessage);
        
        // Add bot response after a delay
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chatbot-message bot';
            botMessage.innerHTML = `<p>${answer.replace(/\n/g, '<br>')}</p>`;
            chatbotMessages.appendChild(botMessage);
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 500);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    });
});

// ===========================
// Scroll Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.service-card, .portfolio-item, .contact-info, .contact-form-wrapper').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ===========================
// Portfolio Image Click (Lightbox)
// ===========================
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
            animation: fadeIn 0.3s ease-out;
        `;
        
        const lightboxImg = document.createElement('img');
        lightboxImg.src = img.src;
        lightboxImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;
        
        const lightboxTitle = document.createElement('div');
        lightboxTitle.textContent = title;
        lightboxTitle.style.cssText = `
            position: absolute;
            bottom: 40px;
            color: white;
            font-size: 24px;
            font-weight: 600;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        `;
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: white;
            color: #111827;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        `;
        
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.transform = 'scale(1.1)';
        });
        
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.transform = 'scale(1)';
        });
        
        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(lightboxTitle);
        lightbox.appendChild(closeButton);
        document.body.appendChild(lightbox);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Close on click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === closeButton) {
                lightbox.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = 'auto';
                }, 300);
            }
        });
        
        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                lightbox.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = 'auto';
                }, 300);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        
        document.addEventListener('keydown', handleEscape);
    });
});

// Add fadeIn/fadeOut animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===========================
// Loading State
// ===========================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===========================
// Multilingual System (i18n)
// ===========================
let currentLanguage = localStorage.getItem('norouz-language') || 'fr';
let translations = {};

// Load translations
async function loadTranslations() {
    try {
        const response = await fetch('./js/translations.json');
        translations = await response.json();
        return true;
    } catch (error) {
        console.error('Error loading translations:', error);
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
    updateContent();
    updateChatbotResponses();
    updateMetaTags(lang);
    updateLanguageSelector();
}

// Update all content on the page
function updateContent() {
    const translation = translations[currentLanguage];
    if (!translation) return;
    
    // Update navigation
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
    
    // Update form placeholders
    const formTranslations = translation.contact || {};
    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    const messageInput = document.querySelector('textarea[name="message"]');
    
    if (nameInput) nameInput.placeholder = formTranslations.name || '';
    if (emailInput) emailInput.placeholder = formTranslations.email || '';
    if (phoneInput) phoneInput.placeholder = formTranslations.phone || '';
    if (messageInput) messageInput.placeholder = formTranslations.message || '';
    
    // Update document title
    document.title = `Norouz Peinture - ${translation.hero?.title || 'Peinture Professionnelle'}`;
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

// Helper function to get nested object value
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Update meta tags for language
function updateMetaTags(lang) {
    // Update html lang attribute
    document.documentElement.lang = lang;
    
    // Update meta description if exists
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        const descriptions = {
            fr: 'Norouz Peinture - Votre spécialiste en peinture de bâtiment à Angers. Plus de 15 ans d\'expérience. Devis gratuit.',
            en: 'Norouz Peinture - Your building painting specialist in Angers. Over 15 years of experience. Free quote.',
            es: 'Norouz Peinture - Su especialista en pintura de edificios en Angers. Más de 15 años de experiencia. Presupuesto gratuito.',
            de: 'Norouz Peinture - Ihr Gebäudemaleister in Angers. Über 15 Jahre Erfahrung. Kostenloses Angebot.'
        };
        metaDescription.content = descriptions[lang] || descriptions.fr;
    }
}

// Update chatbot responses
function updateChatbotResponses() {
    const responses = {
        fr: {
            "Quels sont vos tarifs ?": "Nos tarifs varient selon la nature et l'ampleur des travaux. Pour un devis personnalisé et gratuit, n'hésitez pas à nous contacter au +33 6 68 66 43 91 ou via le formulaire de contact. Nous nous déplaçons gratuitement pour évaluer vos besoins.",
            
            "Quelle est votre zone d'intervention ?": "Nous intervenons sur Angers et ses alentours dans un rayon de 50 km. Cela inclut les communes environnantes. N'hésitez pas à nous contacter pour vérifier si nous couvrons votre zone.",
            
            "Quels services proposez-vous ?": "Nous proposons une gamme complète de services :\n• Peinture intérieure et murale\n• Pose et dépose de papier peint\n• Pose de toile de verre\n• Réparation de dégâts des eaux\n• Peinture sur bois et métal\n• Teinture de bois\n\nConsultez notre section Services pour plus de détails !",
            
            "Comment obtenir un devis ?": "Pour obtenir un devis gratuit et sans engagement :\n1. Appelez-nous au +33 6 68 66 43 91\n2. Envoyez-nous un email à mathieu@norouzpeinture.fr\n3. Remplissez notre formulaire de contact\n\nNous vous répondrons rapidement et nous déplaçons gratuitement pour évaluer vos travaux."
        },
        en: {
            "What are your rates?": "Our rates vary according to the nature and scope of work. For a personalized and free quote, don't hesitate to contact us at +33 6 68 66 43 91 or via the contact form. We travel free of charge to assess your needs.",
            
            "What is your service area?": "We operate in Angers and its surroundings within a 50 km radius. This includes surrounding municipalities. Don't hesitate to contact us to check if we cover your area.",
            
            "What services do you offer?": "We offer a complete range of services:\n• Interior and wall painting\n• Wallpaper installation and removal\n• Glass fiber fabric installation\n• Water damage repairs\n• Wood and metal painting\n• Wood staining\n\nCheck our Services section for more details!",
            
            "How to get a quote?": "To get a free and no-commitment quote:\n1. Call us at +33 6 68 66 43 91\n2. Send us an email to mathieu@norouzpeinture.fr\n3. Fill out our contact form\n\nWe will respond quickly and travel free of charge to assess your work."
        },
        es: {
            "¿Cuáles son sus tarifas?": "Nuestras tarifas varían según la naturaleza y el alcance del trabajo. Para un presupuesto personalizado y gratuito, no dude en contactarnos al +33 6 68 66 43 91 o a través del formulario de contacto. Nos desplazamos gratuitamente para evaluar sus necesidades.",
            
            "¿Cuál es su zona de intervención?": "Intervenimos en Angers y sus alrededores en un radio de 50 km. Esto incluye los municipios circundantes. No dude en contactarnos para verificar si cubrimos su zona.",
            
            "¿Qué servicios ofrecen?": "Ofrecemos una gama completa de servicios:\n• Pintura interior y de paredes\n• Instalación y retirada de papel pintado\n• Instalación de tela de fibra de vidrio\n• Reparación de daños por agua\n• Pintura en madera y metal\n• Tinte de madera\n\n¡Consulte nuestra sección de Servicios para más detalles!",
            
            "¿Cómo obtener un presupuesto?": "Para obtener un presupuesto gratuito y sin compromiso:\n1. Llámenos al +33 6 68 66 43 91\n2. Envíenos un email a mathieu@norouzpeinture.fr\n3. Complete nuestro formulario de contacto\n\nRespondemos rápidamente y nos desplazamos gratuitamente para evaluar su trabajo."
        },
        de: {
            "Was sind Ihre Preise?": "Unsere Preise variieren je nach Art und Umfang der Arbeiten. Für ein personalisiertes und kostenloses Angebot zögern Sie nicht, uns unter +33 6 68 66 43 91 oder über das Kontaktformular zu kontaktieren. Wir reisen kostenlos an, um Ihre Bedürfnisse zu bewerten.",
            
            "Was ist Ihr Einsatzgebiet?": "Wir sind in Angers und Umgebung in einem Umkreis von 50 km tätig. Dies umfasst umliegende Gemeinden. Zögern Sie nicht, uns zu kontaktieren, um zu prüfen, ob wir Ihr Gebiet abdecken.",
            
            "Welche Dienstleistungen bieten Sie an?": "Wir bieten eine vollständige Palette von Dienstleistungen:\n• Innen- und Wandmalerei\n• Tapetenanbringung und -entfernung\n• Glasfasergewebeanbringung\n• Wasserschädenreparatur\n• Malerei auf Holz und Metall\n• Holzbeizung\n\nSchauen Sie sich unseren Services-Bereich für weitere Details an!",
            
            "Wie bekomme ich ein Angebot?": "Um ein kostenloses und unverbindliches Angebot zu erhalten:\n1. Rufen Sie uns unter +33 6 68 66 43 91 an\n2. Senden Sie uns eine E-Mail an mathieu@norouzpeinture.fr\n3. Füllen Sie unser Kontaktformular aus\n\nWir antworten schnell und reisen kostenlos an, um Ihre Arbeit zu bewerten."
        }
    };
    
    // Update chatbot responses if function exists
    if (typeof window !== 'undefined' && window.chatbotResponses) {
        window.chatbotResponses = responses[currentLanguage] || responses.fr;
    }
}

// Language selector functionality
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize translations
    await loadTranslations();
    
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
                // Close dropdown
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
});

// ===========================
// Console Message
// ===========================
console.log('%c🎨 Norouz Peinture', 'font-size: 20px; font-weight: bold; color: #0057B7;');
console.log('%cSite web développé avec ❤️', 'font-size: 14px; color: #4B5563;');
console.log('%cPour toute demande: mathieu@norouzpeinture.fr', 'font-size: 12px; color: #9CA3AF;');
