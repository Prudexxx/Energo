// Гамбургер меню
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Блокируем прокрутку фона при открытом меню
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Закрытие меню при клике на ссылку
        const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Плавная прокрутка
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Обработка формы (отправка в Telegram)
class TelegramForm {
    constructor(formId, botToken, chatId) {
        this.form = document.getElementById(formId);
        this.botToken = botToken;
        this.chatId = chatId;
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            return;
        }
        
        this.sendToTelegram(formData);
    }
    
    getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };
    }
    
    validateForm(data) {
        if (!data.name) {
            this.showError('Пожалуйста, введите ваше имя');
            return false;
        }
        
        if (!data.phone) {
            this.showError('Пожалуйста, введите телефон');
            return false;
        }
        
        if (!data.message) {
            this.showError('Пожалуйста, введите сообщение');
            return false;
        }
        
        return true;
    }
    
    formatMessage(data) {
        return `
📋 <b>Новая заявка с сайта</b>

👤 <b>Имя:</b> ${this.escapeHtml(data.name)}\n
📞 <b>Телефон:</b> ${this.escapeHtml(data.phone)}\n
📧 <b>Email:</b> ${data.email ? this.escapeHtml(data.email) : 'Не указан'}\n
💬 <b>Сообщение:</b> ${this.escapeHtml(data.message)}\n

🕒 <b>Время:</b> ${new Date().toLocaleString()}
        `.trim();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    async sendToTelegram(formData) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.textContent = 'Отправка...';
            submitButton.disabled = true;
            
            const response = await axios.post(
                `https://api.telegram.org/bot${this.botToken}/sendMessage`,
                {
                    chat_id: this.chatId,
                    text: this.formatMessage(formData),
                    parse_mode: 'HTML'
                }
            );
            
            if (response.data.ok) {
                this.showSuccess('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                this.form.reset();
            } else {
                throw new Error(response.data.description);
            }
            
        } catch (error) {
            console.error('Telegram API Error:', error);
            this.showError('Ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    showError(message) {
        alert(message);
    }
    
    showSuccess(message) {
        alert(message);
    }
}

// Инициализация формы (ЗАМЕНИТЕ НА СВОИ ДАННЫЕ)
const telegramForm = new TelegramForm(
    'telegramForm',
    '8125210828:AAEsVy2i1tTP8RHniiTeCPwFYQIS6URb97Q',
    '421332431'
);