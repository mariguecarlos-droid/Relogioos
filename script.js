// Simulação de Banco de Dados de Produtos
const products = [
    { id: 1, name: "RELOGIO SMARTWATCH HW16", price:100.00, image: "img/02.webp" },
    { id: 2, name: "RELOGIO DIGITAL INFANTIL FX-RD-02", price: 59.00, image: "img/03.webp" },
    { id: 3, name: "RELÓGIO SMART WATCH 46MM 2 PULSEIRAS WATCH 10 PRO", price: 120.00, image: "img/04.webp" },
    { id: 4, name: "ERELÓGIO SMART WATCH 46MM C/ CÂMERA E CHIP", price: 80.00, image: "img/05.webp" },
    { id: 5, name: "RELÓGIO SMART WATCH 42MM 2 PULSEIRAS WATCH 10 PRO", price: 189.00, image: "img/06.webp" },
    { id: 6, name: "SMARTWATCH TELA CURVA PEI-WAT3MINI PEINING", price: 130.00, image: "img/07.webp" },
    { id: 7, name: "RELOGIO SMARTWATCH PEINING PEI-WAT6", price: 79.00, image: "img/08.webp" },
    { id: 8, name: "RELOGIO SMARTWATCH PEINING PEI-T10", price: 129.00, image: "img/09.webp" },
    { id: 9, name: "RELOGIO SMARTWATCH PEINING PEI-WAT10", price: 110.00, image: "img/10.webp" },
    { id: 10, name: "RELOGIO SMARTWATCH PEINING PEI-WAT11", price: 109.00, image: "img/l02.webp" },
    { id: 11, name: "RELOGIO SMARTWATCH PEINING PEI-WAT12", price: 116.00, image: "img/l03.webp" },
    { id: 12, name: "RELOGIO SMARTWATCH PEINING PEI-WAT13", price: 165.00, image: "img/l04.webp" },
    { id: 13, name: "SMARTWATCH 10ª GERAÇÃO PEI-WAT4", price: 189.00, image: "img/l05.webp" },
    { id: 14, name: "RELOGIO SMARTWATCH PEINING PEI-WAT8", price: 270.00, image: "img/l08.webp" },
    { id: 15, name: "RELOGIO SMARTWATCH PEINING PEI-WAT9", price: 175.00, image: "img/l09.webp" }
];

// Estado do Carrinho
let cart = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});

// Renderizar Produtos na Tela
function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = products.map((product, index) => `
        <div class="product-card" style="animation-delay: ${index * 0.1}s">
            <div class="card-image-container">
                <span class="badge-offer">OFERTA</span>
                <span class="badge-free-shipping">FRETE GRÁTIS</span>
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="product-price">${formatCurrency(product.price)}</span>
                <button class="btn-add" onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
            </div>
        </div>
    `).join('');
}

// Adicionar ao Carrinho
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
    const formattedTotal = formatCurrency(total);
    cartTotal.innerText = formattedTotal;
    checkoutTotal.innerText = formattedTotal; // Atualiza também no modal de checkout

    // Renderiza lista
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span>${formatCurrency(item.price)}</span>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">Remover</button>
                </div>
            </div>
        `).join('');
    }
}

// Formatador de Moeda
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
    toggleCart(); // Fecha o carrinho
    document.getElementById('checkout-modal').classList.add('open');
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('open');
}

// Copiar Código Pix
function copyPix() {
    const pixCode = document.getElementById('pix-code');
    pixCode.select();
    document.execCommand("copy"); // Método antigo mas compatível, ou use navigator.clipboard
    alert("Código PIX copiado!");
}

// Buscar Endereço pelo CEP
async function buscarCep(cep) {
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

// ============================================================
// --- INTEGRAÇÃO ZEROONEPAY (PIX) ---
// ============================================================

async function processPayment() {
    const statusDiv = document.getElementById('gateway-status');
    const qrCodeImg = document.querySelector('.qr-code-placeholder img');
    const pixInput = document.getElementById('pix-code');
    
    // Captura dos Inputs
    const custName = document.getElementById('cust-name').value;
    const custEmail = document.getElementById('cust-email').value;
    const custCpf = document.getElementById('cust-cpf').value;
    const custPhone = document.getElementById('cust-phone').value;
    const custCep = document.getElementById('cust-cep').value;
    const custNumber = document.getElementById('cust-number').value;
    const custStreet = document.getElementById('cust-street').value;

    const totalPedido = cart.reduce((sum, item) => sum + item.price, 0);

    // Validações
    if (totalPedido <= 0) {
        alert("Carrinho vazio!");
        return;
    }
    if (!custName || !custEmail || !custCpf || !custPhone || !custCep || !custNumber || !custStreet) {
        alert("Por favor, preencha todos os dados (Nome, E-mail, CPF, Telefone e Endereço).");
        return;
    }

    // UI: Mostra carregando
    statusDiv.innerHTML = "Gerando PIX com ZeroOnePay...";
    statusDiv.style.color = "#d4af37";
    document.querySelector('.btn-confirm-payment').disabled = true;

    // DADOS DE CONFIGURAÇÃO (PREENCHA AQUI)
    const API_URL = 'https://api.zeroonepay.com.br/api/v1/transactions'; // Verifique a URL exata na doc
    const API_TOKEN = 'SEU_TOKEN_DA_ZEROONEPAY_AQUI'; 

    // Dados do Pedido
    const payload = {
        amount: Math.round(totalPedido * 100), // Geralmente em centavos (R$ 10,00 = 1000)
        payment_method: 'pix',
        items: cart.map(item => ({
            title: item.name,
            unit_price: Math.round(item.price * 100),
            quantity: 1
        })),
        customer: {
            name: custName,
            email: custEmail,
            document: custCpf.replace(/\D/g, '') // Remove pontos e traços, deixa só números
        }
    };

    try {
        /* 
           OBS: Como não temos o token real aqui, o fetch vai falhar se rodar agora.
           Estou simulando o sucesso no 'catch' para você ver o layout funcionando.
           Quando colocar o token, descomente o fetch real.
        */

        // --- CÓDIGO REAL (Descomente quando tiver o Token) ---
        /*
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            // Sucesso: Atualiza tela com QR Code e Copia e Cola
            qrCodeImg.src = data.pix_qr_code_url || data.qrcode_image; // Ajuste conforme retorno da API
            pixInput.value = data.pix_emv || data.payload; // O código 'copia e cola'
            
            statusDiv.innerHTML = "Aguardando pagamento...";
            statusDiv.style.color = "#28a745";
            
            // Iniciar verificação de status (polling)
            checkPaymentStatus(data.transaction_id); 
        } else {
            throw new Error(data.message || 'Erro ao criar transação');
        }
        */

        // --- SIMULAÇÃO PARA TESTE VISUAL (Remova em produção) ---
        console.log("Enviando para ZeroOnePay:", payload);
        setTimeout(() => {
            // Simulando resposta da API
            qrCodeImg.src = "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=ExemploPixZeroOnePay";
            pixInput.value = "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913RelogiosLoja6008Brasilia62070503***63041D3D";
            
            statusDiv.innerHTML = "QR Code gerado! Aguardando pagamento de " + custName;
            statusDiv.style.color = "#fff";
            document.querySelector('.btn-confirm-payment').style.display = 'none'; // Esconde botão após gerar
        }, 1500);
        // --------------------------------------------------------

    } catch (error) {
        console.error("Erro:", error);
        statusDiv.innerHTML = "Erro ao gerar PIX: " + error.message;
        statusDiv.style.color = "#ff4444";
        document.querySelector('.btn-confirm-payment').disabled = false;
    }
}

// Função Opcional: Verificar status do pagamento automaticamente
function checkPaymentStatus(transactionId) {
    // Implementar polling (verificar a cada 5s se o status mudou para 'paid')
    console.log("Iniciando verificação do ID:", transactionId);
}

// ============================================================
// --- WIDGET DE CHAT FLUTUANTE ---
// ============================================================

function toggleChatWidget() {
    const chatWindow = document.getElementById('chat-window');
    const notification = document.querySelector('.chat-notification');
    
    chatWindow.classList.toggle('active');
    
    // Esconde notificação ao abrir
    if (chatWindow.classList.contains('active') && notification) {
        notification.style.display = 'none';
    }
}

function handleChatKey(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    const chatMessages = document.getElementById('chat-messages');

    if (message !== "") {
        // 1. Adicionar mensagem do Usuário
        const userMsg = document.createElement('div');
        userMsg.classList.add('message', 'user');
        userMsg.innerHTML = `
            <p>${message}</p>
            <span class="time">${getCurrentTime()}</span>
        `;
        chatMessages.appendChild(userMsg);
        
        // Limpar input e rolar para baixo
        input.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 2. Simular resposta do Bot (Delay de 1.5s)
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.classList.add('message', 'bot');
            botMsg.innerHTML = `
                <p>Obrigado pelo seu contato! Um de nossos especialistas em relógios responderá em instantes.</p>
                <span class="time">${getCurrentTime()}</span>
            `;
            chatMessages.appendChild(botMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    }
}

function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}