import zh from './zh.js';
import en from './en.js';

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLanguage') || 'zh';
        this.translations = {
            zh: zh,
            en: en
        };
        this.init();
    }

    getBrowserLanguage() {
        // 获取浏览器语言
        const browserLang = navigator.language || navigator.userLanguage;
        // 检查是否支持中文（包括简体中文和繁体中文）
        if (browserLang.startsWith('zh')) {
            return 'zh';
        }
        // 默认返回英文
        return 'en';
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            this.updatePageContent();
            // 保存语言选择到 localStorage
            localStorage.setItem('preferredLanguage', lang);
        }
    }

    getTranslation(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                console.warn(`Translation not found for key: ${key}`);
                return key; // 如果找不到翻译，返回原始键
            }
        }
        
        return value;
    }

    updatePageContent() {
        // 更新所有带有 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            // 如果是按钮或输入框，更新 value 属性
            if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                element.value = translation;
            } else {
                element.textContent = translation;
            }
        });

        // 更新页面语言属性
        document.documentElement.lang = this.currentLang === 'zh' ? 'zh-TW' : 'en';
    }

    init() {
        // 初始化语言
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'zh';
        this.setLanguage(savedLanguage);

        // 设置语言切换按钮事件
        const langBtn = document.querySelector('.lang-btn');
        const langDropdown = document.querySelector('.lang-dropdown');

        if (langBtn && langDropdown) {
            // 点击按钮时切换下拉菜单显示状态
            langBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('show');
            });

            // 点击下拉菜单选项时切换语言
            langDropdown.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    const lang = e.target.dataset.lang;
                    if (lang) {
                        this.setLanguage(lang);
                        langDropdown.classList.remove('show');
                    }
                }
            });

            // 点击页面其他地方时关闭下拉菜单
            document.addEventListener('click', (e) => {
                if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                    langDropdown.classList.remove('show');
                }
            });
        }

        // 添加联系我们模态窗口事件监听
        const contactLink = document.querySelector('.contact-link');
        const contactModal = document.getElementById('contactModal');
        const closeModal = document.querySelector('.close-modal');

        contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.style.display = 'block';
            // 添加 show 类来触发动画
            setTimeout(() => {
                contactModal.classList.add('show');
            }, 10);
        });

        closeModal.addEventListener('click', () => {
            const contactModal = document.getElementById('contactModal');
            contactModal.classList.remove('show');
            // 等待动画完成后隐藏模态窗口
            setTimeout(() => {
                contactModal.style.display = 'none';
            }, 300);
        });

        window.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove('show');
                // 等待动画完成后隐藏模态窗口
                setTimeout(() => {
                    contactModal.style.display = 'none';
                }, 300);
            }
        });
    }
}

export default new LanguageManager(); 