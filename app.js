document.addEventListener('DOMContentLoaded', () => {

    // --- DONNÉES DE L'APPLICATION AVEC ICÔNES MISES À JOUR ---
    // Cette constante est maintenant la source unique pour les tarifs sur tout le site.
    const services = [
        { name: "veste & pentalon veste", price: 7000, icon: '<img src="assets/suit-and-tie-outfit-svgrepo-com.svg" alt="polo" class="h-8 w-8 text-blue-500" />' },
        { name: "Chemise & polo", price: 2000, icon: '<img src="assets/clo-polo-svgrepo-com.svg" alt="polo" class="h-8 w-8 text-blue-500" />' },
        { name: "Pantalon & jeans", price: 3000, icon: '<img src="assets/pants-svgrepo-com.svg" alt="pentalon" class="h-8 w-8 text-blue-500" />' },
        { name: "jupe et culotte", price: 2000, icon: '<img src="assets/skirt-svgrepo-com.svg" alt="jupe" class="h-8 w-8 text-blue-500" />' },
        { name: "Robe ", price: 4000, icon: '<img src="assets/dress-4-svgrepo-com.svg" alt="robe" class="h-8 w-8 text-blue-500" />' },
        { name: "Pull & jacket", price: 4000, icon: '<img src="assets/sweater-svgrepo-com.svg" alt="pull" class="h-8 w-8 text-blue-500" />' },
        { name: "Pagne", price: 5000, icon: '<img src="assets/pagne.svg" alt="training" class="h-8 w-8 text-blue-500" /> ' },
        { name: "Manteau homme/femme", price: 7000, icon: '<img src="assets/coat-svgrepo-com.svg" alt="training" class="h-8 w-8 text-blue-500" />' },
        { name: "Ensemble training", price: 5000, icon: '<img src="assets/tracksuit-svgrepo-com.svg" alt="training" class="h-8 w-8 text-blue-500" />' },
        { name: "chaussures", price: 7000, icon: '<img src="assets/shoes-shoe-svgrepo-com.svg" alt="polo" class="h-8 w-8 text-blue-500" />' },
        { name: "Draps (bonus taie d'oreiller)", price: 3500, icon: '<img src="assets/bed-3-svgrepo-com.svg" alt="drap" class="h-8 w-8 text-blue-500" />' },
        { name: "Rideaux (par m²)", price: 5000, icon: '<img src="assets/window-curtains-svgrepo-com.svg" alt="rideaux" class="h-8 w-8 text-blue-500" />' }
    ];

    const deliveryCost = 6000;
    const deliveryFreeThreshold = 50000;
    const phoneNumber = "243995432688";

    // --- LOGIQUE POUR LA PAGE D'ACCUEIL ---
    function initHomePage() {
        const tariffsContainer = document.getElementById('tariffs-list-container');
        if (!tariffsContainer) return;

        // Regroupe les articles par prix pour un affichage plus propre si nécessaire,
        // ou simplement les afficher tous. Ici nous les divisons en deux colonnes.
        const allTariffsHtml = services.map(service => `
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span>${service.name}</span>
                <span class="font-bold text-blue-700">${service.price.toLocaleString('fr-FR')} FC</span>
            </div>
        `).join('');

        tariffsContainer.innerHTML = `
            <div class="space-y-4">${allTariffsHtml.slice(0, allTariffsHtml.length / 2)}</div>
            <div class="space-y-4">${allTariffsHtml.slice(allTariffsHtml.length / 2)}</div>
        `;
        
        // Alternative plus simple si l'ordre n'importe pas :
        // tariffsContainer.innerHTML = services.map(service => `...`).join('');
        // Le CSS `grid-cols-2` s'occupera de la mise en page.
        // Pour ce cas, on garde la division manuelle pour un meilleur équilibre.
        
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

        tariffsContainer.innerHTML = ''; // Vide le conteneur
        tariffsContainer.appendChild(column1);
        tariffsContainer.appendChild(column2);
    }

    // --- LOGIQUE POUR LA PAGE DE COMMANDE ---
    function initOrderPage() {
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
    
    // --- LANCE LES FONCTIONS SELON LA PAGE ACTIVE ---
    if (document.getElementById('service-list')) {
        initOrderPage();
    }
    if (document.getElementById('tariffs-list-container')) {
        initHomePage();
    }
});
