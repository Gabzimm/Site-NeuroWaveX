// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initStats();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        const purchaseModal = document.getElementById('purchaseModal');
        const confirmModal = document.getElementById('confirmModal');
        
        if (event.target === purchaseModal) {
            closePurchaseModal();
        }
        
        if (event.target === confirmModal) {
            closeConfirmModal();
        }
    });
}

// Estatísticas animadas
function initStats() {
    const stats = {
        activeUsers: 500,
        uptime: 99.9,
        support: 24,
        rating: 4.9
    };
    
    // Animar números
    animateCounter('activeUsers', stats.activeUsers, '+');
    animateCounter('uptime', stats.uptime, '%', 1);
    animateCounter('support', stats.support, '/7');
    animateCounter('rating', stats.rating, '', 1);
}

function animateCounter(elementId, finalValue, suffix = '', decimals = 0) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let startValue = 0;
    const duration = 2000;
    const increment = finalValue / (duration / 16);
    
    const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= finalValue) {
            element.textContent = finalValue.toFixed(decimals) + suffix;
            clearInterval(timer);
        } else {
            element.textContent = startValue.toFixed(decimals) + suffix;
        }
    }, 16);
}

// Modal de Compra
function openPurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Selecionar Plano
function selectPlan(planType) {
    let planInfo = {};
    
    switch(planType) {
        case 'basic':
            planInfo = {
                name: 'WaveX Básico',
                price: 'R$ 49,90',
                features: [
                    'Sistema de Tickets',
                    'Sistema de Sets',
                    'Controle Básico de Cargos',
                    'Suporte por Email'
                ]
            };
            break;
            
        case 'pro':
            planInfo = {
                name: 'WaveX Pro',
                price: 'R$ 89,90',
                features: [
                    'Sistema de Tickets Completo',
                    'Sistema de Sets Avançado',
                    'Controle Completo de Cargos',
                    'Sistema de Moderação',
                    'Dashboard Web',
                    'Suporte Prioritário'
                ]
            };
            break;
            
        case 'enterprise':
            planInfo = {
                name: 'WaveX Enterprise',
                price: 'R$ 149,90',
                features: [
                    'Todos os recursos Pro',
                    'Bot Personalizado',
                    'Hosting Incluso',
                    'Manutenção Mensal',
                    'Suporte Dedicado 24/7',
                    'Updates Ilimitados'
                ]
            };
            break;
    }
    
    // Fechar modal de compra
    closePurchaseModal();
    
    // Mostrar modal de confirmação
    showConfirmModal(planInfo);
}

// Modal de Confirmação
function showConfirmModal(planInfo) {
    const modal = document.getElementById('confirmModal');
    const content = document.getElementById('confirmContent');
    
    // Gerar conteúdo do plano selecionado
    let featuresHTML = '';
    planInfo.features.forEach(feature => {
        featuresHTML += `<p><i class="fas fa-check"></i> ${feature}</p>`;
    });
    
    content.innerHTML = `
        <div class="selected-plan">
            <h3>${planInfo.name}</h3>
            <div class="plan-price">
                <span class="amount">${planInfo.price}</span>
                <span class="period">/ único</span>
            </div>
            
            <div class="plan-features">
                ${featuresHTML}
            </div>
            
            <p class="plan-instructions">
                <i class="fas fa-info-circle"></i>
                Escolha como deseja finalizar sua compra:
            </p>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// WhatsApp e Discord
function openWhatsApp() {
    const message = encodeURIComponent("Olá! Gostaria de adquirir o WaveX Bot. Podemos conversar sobre os detalhes?");
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
}

function openDiscord() {
    window.open('https://discord.gg/seu-link', '_blank');
}

// Notificação
function showNotification(message, type = 'success') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Estilo da notificação
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100%);
            background: var(--gradient);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: var(--shadow);
            transition: transform 0.3s ease;
            z-index: 3000;
            font-weight: 500;
        }
        
        .notification.success {
            background: linear-gradient(135deg, var(--success), #2ECC71);
        }
        
        .notification.error {
            background: linear-gradient(135deg, var(--danger), #E74C3C);
        }
        
        .notification.show {
            transform: translateX(-50%) translateY(0);
        }
        
        .notification i {
            font-size: 20px;
        }
    `;
    
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }
    
    // Mostrar e depois remover
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Tecla ESC para fechar modais
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePurchaseModal();
        closeConfirmModal();
    }
});
