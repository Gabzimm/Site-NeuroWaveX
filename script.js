// Estado do carrinho
let cart = [];
let pricingType = 'unique'; // 'unique' ou 'monthly'

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }
    
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (email) {
                alert('Obrigado por se inscrever! Você receberá nossas novidades.');
                newsletterForm.querySelector('input').value = '';
            }
        });
    }
    
    // Seleção de módulos no plano individual
    const checkboxes = document.querySelectorAll('.feature-selector input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateIndividualPrice);
    });
}

// Toggle menu mobile
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Alternar entre preços único/mensal
function togglePricing() {
    const toggle = document.getElementById('pricingToggle');
    pricingType = toggle.checked ? 'monthly' : 'unique';
    
    // Atualizar preços
    const individualPrice = document.getElementById('individualPrice');
    const completePrice = document.getElementById('completePrice');
    
    if (pricingType === 'monthly') {
        individualPrice.textContent = '9,90';
        completePrice.textContent = '24,90';
    } else {
        individualPrice.textContent = '29,90';
        completePrice.textContent = '62,90';
    }
    
    // Atualizar texto do período
    document.querySelectorAll('.period').forEach(period => {
        period.textContent = pricingType === 'monthly' ? '/ mês' : '/ único';
    });
}

// Calcular preço do plano individual
function updateIndividualPrice() {
    const checkboxes = document.querySelectorAll('.feature-selector input[type="checkbox"]');
    let total = 0;
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const priceText = checkbox.nextElementSibling.textContent;
            const priceMatch = priceText.match(/R\$ (\d+,\d+)/);
            if (priceMatch) {
                const price = parseFloat(priceMatch[1].replace(',', '.'));
                total += price;
            }
        }
    });
    
    const individualPrice = document.getElementById('individualPrice');
    individualPrice.textContent = total.toFixed(2).replace('.', ',');
}

// Adicionar ao carrinho
function addToCart(type) {
    let product;
    
    switch(type) {
        case 'individual':
            const checkboxes = document.querySelectorAll('.feature-selector input[type="checkbox"]:checked');
            if (checkboxes.length === 0) {
                alert('Selecione pelo menos um módulo!');
                return;
            }
            
            checkboxes.forEach(checkbox => {
                const label = checkbox.nextElementSibling.textContent;
                const priceMatch = label.match(/R\$ (\d+,\d+)/);
                if (priceMatch) {
                    const price = parseFloat(priceMatch[1].replace(',', '.'));
                    product = {
                        name: label.split('(+')[0].trim(),
                        price: price,
                        type: 'individual'
                    };
                    cart.push(product);
                }
            });
            break;
            
        case 'complete':
            product = {
                name: 'Pacote Completo NeuroWaveX',
                price: pricingType === 'monthly' ? 24.90 : 62.90,
                type: 'complete'
            };
            cart.push(product);
            break;
    }
    
    updateCartUI();
    openCart();
    showNotification('Produto adicionado ao carrinho!');
}

// Remover do carrinho
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Atualizar interface do carrinho
function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price;
        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Abrir/fechar carrinho
function openCart() {
    document.getElementById('cartModal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        closeCart();
    }
}

// Notificação
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animação
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth scroll para âncoras
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
            
            // Fechar menu mobile se aberto
            const navLinks = document.querySelector('.nav-links');
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Animar elementos ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observar elementos para animação
document.querySelectorAll('.product-card, .feature-item, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Estilo para notificação (adicionar dinamicamente)
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--gradient);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: var(--shadow);
        transform: translateX(150%);
        transition: transform 0.3s ease;
        z-index: 3000;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification i {
        font-size: 20px;
    }
    
    .empty-cart {
        text-align: center;
        padding: 40px 0;
        color: var(--gray);
    }
    
    .empty-cart i {
        font-size: 50px;
        margin-bottom: 15px;
        opacity: 0.5;
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .cart-item-info h4 {
        font-size: 14px;
        margin-bottom: 5px;
    }
    
    .cart-item-price {
        color: var(--accent);
        font-weight: 600;
    }
    
    .cart-item-remove {
        background: none;
        border: none;
        color: var(--danger);
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        transition: var(--transition);
    }
    
    .cart-item-remove:hover {
        background: rgba(237, 66, 69, 0.1);
    }
    
    /* Animações */
    .animated {
        animation: fadeUp 0.6s ease forwards;
    }
    
    @keyframes fadeUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);
