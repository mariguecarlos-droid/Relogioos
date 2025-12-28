// OBS: A variável 'products' agora vem diretamente do HTML (gerada pelo Python)

// Estado do Carrinho
let cart = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Não precisamos mais de renderProducts() aqui, pois o Python já renderizou o HTML!
    updateCartUI();
    initTestimonialsCarousel();
    initBonusTimer();
});

// Adicionar ao Carrinho (ID vem do botão no HTML)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartUI();
        toggleCart(true); // Abre o carrinho automaticamente
    }
}

// Remover do Carrinho
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Atualizar UI do Carrinho
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total-price');
    const checkoutTotal = document.getElementById('checkout-total');

    // Atualiza contador
    cartCount.innerText = cart.length;

    // Calcula total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const formattedTotal = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    cartTotal.innerText = formattedTotal;
    if(checkoutTotal) checkoutTotal.innerText = formattedTotal;

    // Renderiza lista
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}"> <!-- Caminho da imagem já vem correto do Python -->
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span>${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">Remover</button>
                </div>
            </div>
        `).join('');
    }
}

// Controle do Modal do Carrinho
function toggleCart(forceOpen = false) {
    const overlay = document.getElementById('cart-overlay');
    if (forceOpen) {
        overlay.classList.add('open');
    } else {
        overlay.classList.toggle('open');
    }
}

// Controle do Modal de Checkout
function openCheckout() {
    if (cart.length === 0) {
        alert("Adicione itens ao carrinho antes de finalizar.");
        return;
    }
    toggleCart(); 
    document.getElementById('checkout-modal').classList.add('open');
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('open');
}

function copyPix() {
    const pixCode = document.getElementById('pix-code');
    pixCode.select();
    document.execCommand("copy");
    alert("Código PIX copiado!");
}

async function buscarCep(cep) {
    // ... lógica de CEP mantida ...
    cep = cep.replace(/\D/g, '');
    if (cep.length === 8) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                document.getElementById('cust-street').value = data.logradouro;
                document.getElementById('cust-neighborhood').value = data.bairro;
                document.getElementById('cust-city').value = data.localidade;
                document.getElementById('cust-state').value = data.uf;
                document.getElementById('cust-number').focus();
            } else {
                alert("CEP não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    }
}

async function processPayment() {
    alert("Processando pagamento... (Simulação)");
    // ... lógica de pagamento ...
}

// --- Chat Widget ---
function toggleChatWidget() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.toggle('active');
}
function handleChatKey(event) { if (event.key === 'Enter') sendChatMessage(); }
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if(message) {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML += `<div class="message user"><p>${message}</p><span class="time">Agora</span></div>`;
        input.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// --- Auto Scroll Avaliações ---
function initTestimonialsCarousel() {
    const carousel = document.getElementById('testimonials-carousel');
    if (!carousel) return;
    const items = Array.from(carousel.children);
    items.forEach(item => carousel.appendChild(item.cloneNode(true))); // Clone infinito
    
    let isPaused = false;
    carousel.addEventListener('mouseenter', () => isPaused = true);
    carousel.addEventListener('mouseleave', () => isPaused = false);
    
    function autoScroll() {
        if (!isPaused) {
            carousel.scrollLeft += 1;
            if (carousel.scrollLeft >= (carousel.scrollWidth / 2)) carousel.scrollLeft = 0;
        }
        requestAnimationFrame(autoScroll);
    }
    requestAnimationFrame(autoScroll);
}

// --- Alerta de Bônus (Timer) ---
let bonusInterval;
const BONUS_DURATION = 5 * 60; 

function initBonusTimer() {
    const alertBox = document.getElementById('bonus-alert');
    if (!alertBox) return;

    // Removemos a verificação de fechamento anterior para manter o loop
    // if (localStorage.getItem('bonusClosed_v2') === 'true') { ... }

    let endTime = localStorage.getItem('bonusEndTime_v2');
    const now = Math.floor(Date.now() / 1000);

    if (!endTime) {
        endTime = now + BONUS_DURATION;
        localStorage.setItem('bonusEndTime_v2', endTime);
    } else {
        endTime = parseInt(endTime, 10);
    }

    if (now > endTime) {
        resetBonusTimer(); // Reinicia se já passou do tempo
        return;
    }

    updateTimerDisplay(endTime - now);
    bonusInterval = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000);
        const remaining = endTime - currentTime;
        if (remaining <= 0) {
             resetBonusTimer(); // Reinicia quando chega a zero
        }
        else updateTimerDisplay(remaining);
    }, 1000);
}

function resetBonusTimer() {
    clearInterval(bonusInterval); // Limpa o intervalo atual
    localStorage.removeItem('bonusEndTime_v2'); // Remove o tempo antigo
    initBonusTimer(); // Reinicia o processo
}

function updateTimerDisplay(seconds) {
    const timerSpan = document.getElementById('bonus-timer');
    const progressBar = document.getElementById('bonus-progress');
    const container = document.querySelector('.bonus-timer-container');
    
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    timerSpan.innerText = `${m}:${s}`;
    
    const percent = (seconds / BONUS_DURATION) * 100;
    if (progressBar) progressBar.style.width = `${percent}%`;
    
    if (seconds < 60) container.classList.add('urgent');
    else container.classList.remove('urgent');
}

function expireBonus() {
    clearInterval(bonusInterval);
    const textDiv = document.querySelector('.bonus-text span');
    if(textDiv) textDiv.innerHTML = "Oferta expirada!";
    setTimeout(() => closeBonus(), 3000);
}

function closeBonus(animate = true) {
    const alertBox = document.getElementById('bonus-alert');
    if (alertBox) {
        if (animate) alertBox.classList.add('hidden');
        else alertBox.style.display = 'none';
    }
    localStorage.setItem('bonusClosed_v2', 'true');
    clearInterval(bonusInterval);
}
