class LanguageManager {
    constructor() {
        this.currentLanguage = this.getBrowserLanguage();
        this.translations = {
            zh: window.zh,
            en: window.en
        };
        this.init();
    }

    getBrowserLanguage() {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage) {
            return savedLanguage;
        }
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('zh') ? 'zh' : 'en';
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('preferredLanguage', lang);
            this.updatePageContent();
            document.documentElement.lang = lang;
            this.updateCurrentLanguageDisplay();
        }
    }

    getTranslation(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }
        return value;
    }

    updatePageContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                element.value = translation;
            } else {
                element.textContent = translation;
            }
        });
    }

    updateCurrentLanguageDisplay() {
        const langText = document.querySelector('.lang-text');
        if (langText) {
            langText.textContent = this.currentLanguage === 'zh' ? '中文繁體' : 'English';
        }
    }

    init() {
        this.updatePageContent();
        document.documentElement.lang = this.currentLanguage;
        this.updateCurrentLanguageDisplay();
    }
}

// 创建全局实例
window.languageManager = new LanguageManager();

// 添加语言切换事件监听
document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.lang-option');
    langButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const lang = e.target.getAttribute('data-lang');
            window.languageManager.setLanguage(lang);
        });
    });
}); 