document.addEventListener('DOMContentLoaded', () => {

    function initOrderPage() {
        // --- DONNÉES DE L'APPLICATION AVEC ICÔNES MISES À JOUR ---
        const services = [
            { name: "Chemise & polo", price: 3000, icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-blue-500"><path d="M20.38 3.46 16 2a4 4 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>' },
            { name: "Pantalon & jeans & jupe", price: 4000, icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 21V9a2 2 0 012-2h8a2 2 0 012 2v12M10 3v4a2 2 0 002 2h0a2 2 0 002-2V3" /></svg>' },
            { name: "Robe femme", price: 5000, icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-blue-500"><path d="M13 3l-4 4L5 3l-2 2 4.5 4.5-2.5 9.5h14l-2.5-9.5L21 5l-2-2-4 4-4-4z"/></svg>' },
            { name: "Manteau homme/femme", price: 8000, icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>' },
            { name: "Pull & jacket", price: 6000, icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-blue-500"><path d="M20.38 3.46 16 2a4 4 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>' },
            { name: "Ensemble training", price: 8000, icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>' },
            { name: "Pagne", price: 6000, icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H5zM17 21a4 4 0 004-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2a2 2 0 002 2h9" /></svg>' },
            { name: "Rideaux (par m²)", price: 5000, icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>' },
            { name: "Draps (bonus taie d'oreiller)", price: 9000, icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-blue-500"><path d="M2 3v6a4 4 0 0 0 4 4h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a4 4 0 0 0-4 4H2z"/><path d="M22 17v-3H6a4 4 0 0 0-4 4v3H2"/><path d="M2 21v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1"/></svg>' }
        ];
        const deliveryCost = 6000;
        const deliveryFreeThreshold = 50000;
        const phoneNumber = "243995432688";

        let cart = {};

        // SÉLECTEURS DU DOM
        const serviceListContainer = document.getElementById('service-list');
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const subtotalEl = document.getElementById('subtotal');
        const deliveryFeeEl = document.getElementById('delivery-fee');
        const totalEl = document.getElementById('total');
        const orderButton = document.getElementById('order-button');
        const customerNameEl = document.getElementById('customer-name');
        const customerAddressEl = document.getElementById('customer-address');
        const formErrorEl = document.getElementById('form-error');

        if (!serviceListContainer) return;

        // Affiche la liste des services
        function renderServiceList() {
            serviceListContainer.innerHTML = services.map(service => `
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border border-gray-200 rounded-lg transition-all hover:shadow-md hover:border-blue-300">
                    <div class="flex items-center gap-4 flex-1">
                        <div class="bg-blue-50 rounded-full p-2">
                            ${service.icon}
                        </div>
                        <div>
                            <p class="font-bold text-base sm:text-lg text-gray-800">${service.name}</p>
                            <p class="text-blue-600 font-semibold">${service.price.toLocaleString('fr-FR')} FC</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 self-end sm:self-auto">
                        <button class="quantity-change bg-gray-200 rounded-full w-9 h-9 text-2xl font-bold text-gray-600 flex items-center justify-center transition hover:bg-gray-300" data-name="${service.name}" data-amount="-1">-</button>
                        <input type="number" value="0" min="0" class="quantity-input w-16 text-center font-bold text-lg bg-transparent" data-name="${service.name}" readonly>
                        <button class="quantity-change bg-blue-600 text-white rounded-full w-9 h-9 text-2xl font-bold flex items-center justify-center transition hover:bg-blue-700" data-name="${service.name}" data-amount="1">+</button>
                    </div>
                </div>
            `).join('');
        }

        // Met à jour le panier
        function updateCart(name, quantity) {
            if (quantity > 0) {
                const service = services.find(s => s.name === name);
                cart[name] = { price: service.price, quantity: quantity };
            } else {
                delete cart[name];
            }
            renderCart();
            updateTotals();
        }
        
        // Affiche le panier
        function renderCart() {
            if (Object.keys(cart).length === 0) {
                cartItemsContainer.innerHTML = '';
                emptyCartMessage.style.display = 'block';
                return;
            }

            emptyCartMessage.style.display = 'none';
            cartItemsContainer.innerHTML = Object.entries(cart).map(([name, item]) => `
                <div class="flex justify-between items-center text-md">
                    <div>
                        <p class="font-semibold text-gray-800">${name}</p>
                        <p class="text-sm text-gray-500">${item.quantity} x ${item.price.toLocaleString('fr-FR')} FC</p>
                    </div>
                    <span class="font-bold text-gray-800">${(item.quantity * item.price).toLocaleString('fr-FR')} FC</span>
                </div>
            `).join('');
        }
        
        // Met à jour les totaux
        function updateTotals() {
            const subtotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            const hasItems = subtotal > 0;
            let finalDeliveryCost = hasItems ? deliveryCost : 0;
            
            // Condition pour la livraison gratuite
            if (subtotal >= deliveryFreeThreshold) {
                finalDeliveryCost = 0;
            }

            const total = subtotal + finalDeliveryCost;

            subtotalEl.textContent = `${subtotal.toLocaleString('fr-FR')} FC`;
            if (hasItems && subtotal >= deliveryFreeThreshold) {
                 deliveryFeeEl.innerHTML = `<span class="text-green-600 font-bold">Offerte !</span>`;
            } else {
                 deliveryFeeEl.innerHTML = `${finalDeliveryCost.toLocaleString('fr-FR')} FC`;
            }
            totalEl.textContent = `${total.toLocaleString('fr-FR')} FC`;
            
            orderButton.disabled = !hasItems;
        }

        // Génère le message de commande pour WhatsApp
        function sendOrderToWhatsApp() {
            const customerName = customerNameEl.value.trim();
            const customerAddress = customerAddressEl.value.trim();

            if (!customerName || !customerAddress) {
                formErrorEl.classList.remove('hidden');
                customerNameEl.classList.add('border-red-500');
                customerAddressEl.classList.add('border-red-500');
                return;
            } else {
                formErrorEl.classList.add('hidden');
                customerNameEl.classList.remove('border-red-500');
                customerAddressEl.classList.remove('border-red-500');
            }

            if (Object.keys(cart).length === 0) return;

            let message = `*Nouvelle commande - Infini Pressing*\n\n`;
            message += `*Client :* ${customerName}\n`;
            message += `*Adresse :* ${customerAddress}\n\n`;
            message += "--- *Détails de la commande* ---\n";
            
            for (const name in cart) {
                message += `• ${cart[name].quantity}x *${name}*\n`;
            }
            
            message += "\n--- *Récapitulatif* ---\n";
            message += `*Sous-total* : ${subtotalEl.textContent}\n`;
            message += `*Livraison* : ${deliveryFeeEl.textContent.includes('Offerte') ? 'Offerte' : deliveryFeeEl.textContent}\n`;
            message += `*TOTAL À PAYER* : *${totalEl.textContent}*\n\n`;
            message += "Merci de confirmer la réception de ma commande.";

            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }

        // GESTIONNAIRES D'ÉVÉNEMENTS
        serviceListContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.quantity-change');
            if (button) {
                const name = button.dataset.name;
                const amount = parseInt(button.dataset.amount, 10);
                const input = serviceListContainer.querySelector(`.quantity-input[data-name="${name}"]`);
                
                let currentQuantity = parseInt(input.value, 10);
                let newQuantity = Math.max(0, currentQuantity + amount);
                
                input.value = newQuantity;
                updateCart(name, newQuantity);
            }
        });

        orderButton.addEventListener('click', sendOrderToWhatsApp);

        // INITIALISATION
        renderServiceList();
        updateTotals();
    }
    
    // Détecter si on est sur la page de commande pour l'initialiser
    if (document.getElementById('service-list')) {
        initOrderPage();
    }
});