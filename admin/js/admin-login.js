// Admin Login JavaScript - admin-login.js

// Demo kullanıcı bilgileri (gerçek uygulamada backend'den gelir)
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

// DOM elementleri
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const loginBtn = document.getElementById('loginBtn');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    // Önceden kaydedilmiş kullanıcı adını yükle
    loadRememberedUser();
    
    // Form submit event listener
    loginForm.addEventListener('submit', handleLogin);
    
    // Enter tuşu ile şifre alanından login
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    });
    
    // Input focus efektleri
    setupInputEffects();
    
    // Capslock uyarısı
    setupCapsLockWarning();
});

// Login form submit handler
async function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    // Validation
    if (!username || !password) {
        showError('Lütfen tüm alanları doldurun!');
        return;
    }
    
    // Loading state
    setLoadingState(true);
    hideError();
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check credentials
        if (username === adminCredentials.username && password === adminCredentials.password) {
            // Başarılı giriş
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('rememberedUser', username);
            } else {
                localStorage.removeItem('rememberedUser');
            }
            
            // Session oluştur
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminUser', username);
            sessionStorage.setItem('loginTime', new Date().toISOString());
            
            // Success animation
            showSuccessAnimation();
            
            // Dashboard'a yönlendir
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } else {
            // Hatalı giriş
            showError('Kullanıcı adı veya şifre hatalı!');
            shakeAnimation();
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
        setLoadingState(false);
    }
}

// Loading state
function setLoadingState(loading) {
    const loginText = loginBtn.querySelector('.login-text');
    const loginLoading = loginBtn.querySelector('.login-loading');
    
    if (loading) {
        loginText.classList.add('d-none');
        loginLoading.classList.remove('d-none');
        loginBtn.disabled = true;
        usernameInput.disabled = true;
        passwordInput.disabled = true;
    } else {
        loginText.classList.remove('d-none');
        loginLoading.classList.add('d-none');
        loginBtn.disabled = false;
        usernameInput.disabled = false;
        passwordInput.disabled = false;
    }
}

// Error gösterme
function showError(message) {
    errorMessage.textContent = message;
    errorAlert.classList.remove('d-none');
    errorAlert.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        errorAlert.style.animation = '';
    }, 500);
}

// Error gizleme
function hideError() {
    errorAlert.classList.add('d-none');
}

// Shake animasyonu
function shakeAnimation() {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        loginCard.style.animation = '';
    }, 500);
}

// Success animasyonu
function showSuccessAnimation() {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'success 0.8s ease-in-out';
    
    // Success icon ekle
    const loginLogo = document.querySelector('.login-logo');
    loginLogo.innerHTML = '<i class="fas fa-check"></i>';
    loginLogo.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
}

// Şifre görünürlük toggle
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Hatırlanan kullanıcıyı yükle
function loadRememberedUser() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        usernameInput.value = rememberedUser;
        rememberMeCheckbox.checked = true;
        passwordInput.focus();
    } else {
        usernameInput.focus();
    }
}

// Input efektleri
function setupInputEffects() {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Başlangıçta değer varsa focused class ekle
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// Caps Lock uyarısı
function setupCapsLockWarning() {
    let capsLockWarning = null;
    
    passwordInput.addEventListener('keypress', function(e) {
        const isCapsLock = e.getModifierState && e.getModifierState('CapsLock');
        
        if (isCapsLock && !capsLockWarning) {
            capsLockWarning = document.createElement('div');
            capsLockWarning.className = 'caps-lock-warning';
            capsLockWarning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Caps Lock açık!';
            this.parentElement.appendChild(capsLockWarning);
        } else if (!isCapsLock && capsLockWarning) {
            capsLockWarning.remove();
            capsLockWarning = null;
        }
    });
}

// Session kontrolü
function checkExistingSession() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = 'dashboard.html';
    }
}

// Sayfa görünürlük değiştiğinde kontrol et
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        checkExistingSession();
    }
});

// Başlangıçta session kontrolü
checkExistingSession();

// CSS animasyonları için gerekli style'lar
const additionalStyles = `
<style>
.caps-lock-warning {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #f39c12, #e67e22);
    color: white;
    padding: 0.5rem;
    border-radius: 0 0 8px 8px;
    font-size: 0.8rem;
    text-align: center;
    z-index: 10;
    animation: slideDown 0.3s ease;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes success {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.form-floating.focused > label {
    color: var(--secondary-color);
}

.form-floating.focused > .form-control {
    border-color: var(--secondary-color);
}
</style>
`;

// Additional styles'ı head'e ekle
document.head.insertAdjacentHTML('beforeend', additionalStyles);