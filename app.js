document.addEventListener('DOMContentLoaded', () => {
    
    // --- DONNÉES DES SERVICES AVEC CATÉGORIES (fusion des deux) ---
    const services = [
        { categories: ['homme'], name: "veste & pentalon veste", price: 7000, icon: '<img src="assets/suit-and-tie-outfit-svgrepo-com.svg" alt="veste" class="h-8 w-8 text-blue-500" />' },
        { categories: ['homme'], name: "Chemise & polo", price: 2000, icon: '<img src="assets/clo-polo-svgrepo-com.svg" alt="polo" class="h-8 w-8 text-blue-500" />' },
        { categories: ['homme'], name: "Pantalon & jeans", price: 3000, icon: '<img src="assets/pants-svgrepo-com.svg" alt="pantalon" class="h-8 w-8 text-blue-500" />' },
        { categories: ['femme'], name: "jupe et culotte", price: 2000, icon: '<img src="assets/skirt-svgrepo-com.svg" alt="jupe" class="h-8 w-8 text-blue-500" />' },
        { categories: ['femme'], name: "Robe ", price: 4000, icon: '<img src="assets/dress-4-svgrepo-com.svg" alt="robe" class="h-8 w-8 text-blue-500" />' },
        { categories: ['homme', 'femme'], name: "Pull & jacket", price: 4000, icon: '<img src="assets/sweater-svgrepo-com.svg" alt="pull" class="h-8 w-8 text-blue-500" />' },
        { categories: ['femme'], name: "Pagne", price: 5000, icon: '<img src="assets/pagne.svg" alt="pagne" class="h-8 w-8 text-blue-500" />' },
        { categories: ['homme', 'femme'], name: "Manteau homme/femme", price: 7000, icon: '<img src="assets/coat-svgrepo-com.svg" alt="manteau" class="h-8 w-8 text-blue-500" />' },
        { categories: ['homme', 'femme'], name: "Ensemble training", price: 5000, icon: '<img src="assets/tracksuit-svgrepo-com.svg" alt="training" class="h-8 w-8 text-blue-500" />' },
        { categories: ['homme', 'femme'], name: "chaussures", price: 7000, icon: '<img src="assets/shoes-shoe-svgrepo-com.svg" alt="chaussures" class="h-8 w-8 text-blue-500" />' },
        { categories: ['maison'], name: "Draps (bonus taie d'oreiller)", price: 3500, icon: '<img src="assets/bed-3-svgrepo-com.svg" alt="drap" class="h-8 w-8 text-blue-500" />' },
        { categories: ['maison'], name: "Rideaux (par m²)", price: 5000, icon: '<img src="assets/window-curtains-svgrepo-com.svg" alt="rideaux" class="h-8 w-8 text-blue-500" />' }
    ];
    
    // Constantes de l'ancien code
    const deliveryCost = 6000;
    const deliveryFreeThreshold = 50000;
    const phoneNumber = "243995432688";
    
    // Panier (avec sauvegarde localStorage du nouveau code)
    let cart = JSON.parse(localStorage.getItem('infiniCart')) || {};
    
    // --- LOGIQUE POUR LA PAGE D'ACCUEIL (ancien code) ---
    function initHomePage() {
        const tariffsContainer = document.getElementById('tariffs-list-container');
        if (!tariffsContainer) return;
        
        const column1 = document.createElement('div');
        column1.className = 'space-y-4';
        const column2 = document.createElement('div');
        column2.className = 'space-y-4';
        
        services.forEach((service, index) => {
            const itemHtml = `
                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span>${service.name}</span>
                    <span class="font-bold text-blue-700">${service.price.toLocaleString('fr-FR')} FC</span>
                </div>`;
            if (index < services.length / 2) {
                column1.innerHTML += itemHtml;
            } else {
                column2.innerHTML += itemHtml;
            }
        });
        
        tariffsContainer.innerHTML = '';
        tariffsContainer.appendChild(column1);
        tariffsContainer.appendChild(column2);
    }
    
    // --- LOGIQUE POUR LA PAGE DE COMMANDE (fusion des deux) ---
    function initOrderPage() {
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
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        if (!serviceListContainer) return;
        
        let currentFilter = 'all';
        
        // Fonction pour échapper les caractères spéciaux dans les noms
        function escapeServiceName(name) {
            return name.replace(/['"&<>]/g, '');
        }
        // Filtres
        if (filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => {
                        b.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
                        b.classList.add('bg-white', 'border-gray-200', 'text-gray-600');
                    });
                    btn.classList.remove('bg-white', 'border-gray-200', 'text-gray-600');
                    btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
                    renderServices(btn.dataset.category);
                    attachQuantityEvents();
                });
            });
        }
        // Affiche les services selon le filtre
        function renderServices(filter = 'all') {
            currentFilter = filter;
            const filtered = filter === 'all' ?
                services :
                services.filter(s => s.categories.includes(filter));
            
            serviceListContainer.innerHTML = filtered.map(service => {
                const qty = cart[service.name] ? cart[service.name].quantity : 0;
                const escapedName = escapeServiceName(service.name);
                
                return `
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
                        <input type="number" value="${qty}" min="0" class="quantity-input w-16 text-center font-bold text-lg bg-transparent" data-name="${service.name}" readonly>
                        <button class="quantity-change bg-blue-600 text-white rounded-full w-9 h-9 text-2xl font-bold flex items-center justify-center transition hover:bg-blue-700" data-name="${service.name}" data-amount="1">+</button>
                    </div>
                </div>`;
            }).join('');
        }
        
        // Met à jour le panier
        function updateCart(name, quantity) {
            const service = services.find(s => s.name === name);
            
            if (quantity > 0) {
                cart[name] = { price: service.price, quantity: quantity };
            } else {
                delete cart[name];
            }
            
            // Sauvegarde dans localStorage
            localStorage.setItem('infiniCart', JSON.stringify(cart));
            
            renderCart();
            updateTotals();
            
            // Mettre à jour l'affichage des quantités dans la liste des services
            const input = serviceListContainer.querySelector(`.quantity-input[data-name="${name}"]`);
            if (input) {
                input.value = quantity;
            }
        }
        
        // Affiche le panier
        function renderCart() {
            if (Object.keys(cart).length === 0) {
                if (cartItemsContainer) cartItemsContainer.innerHTML = '';
                if (emptyCartMessage) emptyCartMessage.style.display = 'block';
                return;
            }
            
            if (emptyCartMessage) emptyCartMessage.style.display = 'none';
            
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
            
            if (subtotal >= deliveryFreeThreshold) {
                finalDeliveryCost = 0;
            }
            
            const total = subtotal + finalDeliveryCost;
            
            if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString('fr-FR')} FC`;
            
            if (deliveryFeeEl) {
                if (hasItems && subtotal >= deliveryFreeThreshold) {
                    deliveryFeeEl.innerHTML = `<span class="text-green-600 font-bold">Offerte !</span>`;
                } else {
                    deliveryFeeEl.innerHTML = `${finalDeliveryCost.toLocaleString('fr-FR')} FC`;
                }
            }
            
            if (totalEl) totalEl.textContent = `${total.toLocaleString('fr-FR')} FC`;
            
            if (orderButton) orderButton.disabled = !hasItems;
        }
        
        // Génère le message de commande pour WhatsApp (ancien code)
        function sendOrderToWhatsApp() {
            const customerName = customerNameEl.value.trim();
            const customerAddress = customerAddressEl.value.trim();
            
            if (!customerName || !customerAddress) {
                if (formErrorEl) formErrorEl.classList.remove('hidden');
                customerNameEl.classList.add('border-red-500');
                customerAddressEl.classList.add('border-red-500');
                return;
            } else {
                if (formErrorEl) formErrorEl.classList.add('hidden');
                customerNameEl.classList.remove('border-red-500');
                customerAddressEl.classList.remove('border-red-500');
            }
            
            if (Object.keys(cart).length === 0) return;
            
            let message = `*Nouvelle commande - Infini Pressing*\n\n`;
            message += `*Client :* ${customerName}\n`;
            message += `*Adresse :* ${customerAddress}\n\n`;
            message += "--- *Détails de la commande* ---\n";
            
            for (const name in cart) {
                const item = cart[name];
                const itemTotal = item.quantity * item.price;
                message += `• ${item.quantity}x *${name}* (à ${item.price.toLocaleString('fr-FR')} FC) = ${itemTotal.toLocaleString('fr-FR')} FC\n`;
            }
            
            message += "\n--- *Récapitulatif* ---\n";
            message += `*Sous-total* : ${subtotalEl.textContent}\n`;
            message += `*Livraison* : ${deliveryFeeEl.textContent.includes('Offerte') ? 'Offerte' : deliveryFeeEl.textContent}\n`;
            message += `*TOTAL À PAYER* : *${totalEl.textContent}*\n\n`;
            message += "Merci de confirmer la réception de ma commande.";
            
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
        
        // Gestionnaires d'événements pour les boutons de quantité
        function attachQuantityEvents() {
            serviceListContainer.addEventListener('click', (e) => {
                const button = e.target.closest('.quantity-change');
                if (button) {
                    const name = button.dataset.name;
                    const amount = parseInt(button.dataset.amount, 10);
                    const input = serviceListContainer.querySelector(`.quantity-input[data-name="${name}"]`);
                    
                    if (!input) return;
                    
                    let currentQuantity = parseInt(input.value, 10);
                    let newQuantity = Math.max(0, currentQuantity + amount);
                    
                    updateCart(name, newQuantity);
                }
            });
        }
        
        // Gestionnaires pour les filtres
        if (filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
                    btn.classList.add('bg-blue-600', 'text-white');
                    renderServices(btn.dataset.category);
                    attachQuantityEvents();
                });
            });
        }
        
        // Gestionnaire pour le bouton de commande
        if (orderButton) {
            orderButton.addEventListener('click', sendOrderToWhatsApp);
        }
        
        // Initialisation
        renderServices();
        attachQuantityEvents();
        renderCart();
        updateTotals();
    }
    
    // --- LANCE LES FONCTIONS SELON LA PAGE ACTIVE ---
    if (document.getElementById('service-list')) {
        initOrderPage();
    }
    if (document.getElementById('tariffs-list-container')) {
        initHomePage();
    }
});