// Admin Dashboard JavaScript - admin-dashboard.js

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Session kontrolü
    checkAdminSession();
    
    // Kullanıcı adını yükle
    loadUserInfo();
    
    // İstatistikleri yükle
    loadDashboardStats();
    
    // Responsive sidebar setup
    setupResponsiveSidebar();
});

// Session kontrolü
function checkAdminSession() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'index.html';
        return;
    }
}

// Kullanıcı bilgilerini yükle
function loadUserInfo() {
    const adminUser = sessionStorage.getItem('adminUser');
    if (adminUser) {
        document.getElementById('adminUsername').textContent = adminUser;
    }
}

// Dashboard istatistiklerini yükle
function loadDashboardStats() {
    // Gerçek uygulamada API'den gelecek veriler
    const stats = {
        totalPosts: 15,
        totalViews: 2847,
        totalComments: 98,
        todayVisitors: 142
    };
    
    // Animasyonlu sayaç efekti
    animateCounter('totalPosts', stats.totalPosts);
    animateCounter('totalViews', stats.totalViews);
    animateCounter('totalComments', stats.totalComments);
    animateCounter('todayVisitors', stats.todayVisitors);
}

// Sayaç animasyonu
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const startValue = 0;
    const duration = 1500;
    const increment = targetValue / (duration / 16);
    let currentValue = startValue;
    
    const counter = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= targetValue) {
            element.textContent = targetValue.toLocaleString('tr-TR');
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString('tr-TR');
        }
    }, 16);
}

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
    
    // Sidebar dışına tıklandığında kapat
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !e.target.closest('.sidebar-toggle')) {
            sidebar.classList.remove('show');
        }
    });
}

// Responsive sidebar setup
function setupResponsiveSidebar() {
    // Pencere boyutu değiştiğinde kontrol et
    window.addEventListener('resize', function() {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth > 768) {
            sidebar.classList.remove('show');
        }
    });
}

// Çıkış işlemi
function logout() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        // Session temizle
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminUser');
        sessionStorage.removeItem('loginTime');
        
        // Login sayfasına yönlendir
        window.location.href = 'index.html';
    }
}

// Otomatik çıkış (2 saat sonra)
function setupAutoLogout() {
    const loginTime = sessionStorage.getItem('loginTime');
    if (loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const diffHours = (now - loginDate) / (1000 * 60 * 60);
        
        if (diffHours >= 2) {
            alert('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
            logout();
        }
    }
}

// Her 5 dakikada bir otomatik çıkış kontrolü
setInterval(setupAutoLogout, 5 * 60 * 1000);

// Sayfa görünürlük değiştiğinde kontrol et
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        setupAutoLogout();
    }
});

// Hızlı işlem butonları için hover efekti
document.addEventListener('DOMContentLoaded', function() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

// Stats kartları için hover efekti
document.addEventListener('DOMContentLoaded', function() {
    const statsCards = document.querySelectorAll('.stats-card');
    
    statsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Bildirimler için basit toast sistemi
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
        ${message}
    `;
    
    document.body.appendChild(toast);
    
    // Animasyon
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 3 saniye sonra kaldır
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Toast CSS'i dinamik olarak ekle
const toastStyles = `
<style>
.toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border-left: 4px solid var(--secondary-color);
    transform: translateX(100%);
    transition: all 0.3s ease;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    max-width: 300px;
}

.toast-notification.show {
    transform: translateX(0);
}

.toast-notification.toast-success {
    border-left-color: var(--success-color);
    color: var(--success-color);
}

.toast-notification.toast-error {
    border-left-color: var(--danger-color);
    color: var(--danger-color);
}

.toast-notification.toast-info {
    border-left-color: var(--secondary-color);
    color: var(--secondary-color);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', toastStyles);

// Hoş geldin mesajı
setTimeout(() => {
    const adminUser = sessionStorage.getItem('adminUser');
    showToast(`Hoş geldin ${adminUser}!`, 'success');
}, 1000);