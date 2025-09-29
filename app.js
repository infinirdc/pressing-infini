// JavaScript for interactions - Infini Pressing

document.addEventListener('DOMContentLoaded', () => {
    // --- FONCTIONS COMMUNES ---
    
    /**
     * Initialise les interactions de la page d'accueil
     */
    function initHomePage() {
        const whatsappButton = document.querySelector('.contact-bar a');
        if (whatsappButton) {
            whatsappButton.addEventListener('click', (event) => {
                console.log('WhatsApp button clicked!');
            });
        }

        // Effets de survol pour les services
        const serviceItems = document.querySelectorAll('.service-list li');
        serviceItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.textDecoration = 'underline';
            });
            item.addEventListener('mouseleave', () => {
                item.style.textDecoration = 'none';
            });
        });

        // Barre de contact - effet d'élévation au survol
        const contactBar = document.querySelector('.contact-bar');
        if (contactBar) {
            contactBar.addEventListener('mouseenter', () => {
                contactBar.style.boxShadow = '0 -5px 20px rgba(0, 0, 0, 0.2)';
            });
            contactBar.addEventListener('mouseleave', () => {
                contactBar.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
            });
        }
    }

    /**
     * Initialise les interactions de la page de commande
     */
    function initOrderPage() {
        // --- DONNÉES DE L'APPLICATION ---
        const services = [
            { name: "Chemise & polo", price: 3000 },
            { name: "Pantalon & jeans & jupe", price: 4000 },
            { name: "Robe femme", price: 5000 },
            { name: "Manteau homme/femme", price: 8000 },
            { name: "Pull & jacket", price: 6000 },
            { name: "Ensemble training", price: 8000 },
            { name: "Pagne", price: 6000 },
            { name: "Rideaux (par m²)", price: 5000 },
            { name: "Draps (bonus taie d'oreiller)", price: 9000 }
        ];
        const deliveryCost = 6000;
        const phoneNumber = "243995432688"; // Numéro de téléphone pour WhatsApp

        // --- ÉTAT DU PANIER ---
        let cart = {};

        // --- SÉLECTEURS D'ÉLÉMENTS DU DOM ---
        const serviceListContainer = document.getElementById('service-list');
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const subtotalEl = document.getElementById('subtotal');
        const deliveryFeeEl = document.getElementById('delivery-fee');
        const totalEl = document.getElementById('total');
        const orderButton = document.getElementById('order-button');

        if (!serviceListContainer) return; // Si on n'est pas sur la page de commande, on sort

        /**
         * Affiche la liste des services disponibles dans la page.
         */
        function renderServiceList() {
            let html = '';
            services.forEach(service => {
                html += `
                    <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                            <p class="font-bold text-lg">${service.name}</p>
                            <p class="text-blue-500 font-semibold">${service.price.toLocaleString('fr-FR')} FC</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button class="quantity-change bg-gray-200 rounded-full w-8 h-8 text-xl font-bold text-gray-700 hover:bg-gray-300" data-name="${service.name}" data-amount="-1">-</button>
                            <input type="number" value="0" min="0" class="quantity-input w-16 text-center font-bold text-lg border-gray-300 rounded-md" data-name="${service.name}" readonly>
                            <button class="quantity-change bg-blue-500 text-white rounded-full w-8 h-8 text-xl font-bold hover:bg-blue-600" data-name="${service.name}" data-amount="1">+</button>
                        </div>
                    </div>
                `;
            });
            serviceListContainer.innerHTML = html;
        }

        /**
         * Met à jour le panier (ajout, modification, suppression d'articles).
         * @param {string} name - Le nom de l'article.
         * @param {number} quantity - La nouvelle quantité.
         */
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
        
        /**
         * Affiche les articles présents dans le panier.
         */
        function renderCart() {
            if (Object.keys(cart).length === 0) {
                cartItemsContainer.innerHTML = '';
                emptyCartMessage.style.display = 'block';
                return;
            }

            emptyCartMessage.style.display = 'none';
            let html = '';
            for (const name in cart) {
                const item = cart[name];
                html += `
                    <div class="flex justify-between items-center text-md">
                        <div>
                            <p class="font-semibold">${name}</p>
                            <p class="text-sm text-gray-600">${item.quantity} x ${item.price.toLocaleString('fr-FR')} FC</p>
                        </div>
                        <span class="font-bold">${(item.quantity * item.price).toLocaleString('fr-FR')} FC</span>
                    </div>
                `;
            }
            cartItemsContainer.innerHTML = html;
        }
        
        /**
         * Calcule et met à jour les totaux (sous-total, livraison, total).
         */
        function updateTotals() {
            let subtotal = 0;
            for (const name in cart) {
                subtotal += cart[name].price * cart[name].quantity;
            }
            
            const hasItems = subtotal > 0;
            const finalDeliveryCost = hasItems ? deliveryCost : 0;
            const total = subtotal + finalDeliveryCost;

            subtotalEl.textContent = `${subtotal.toLocaleString('fr-FR')} FC`;
            deliveryFeeEl.textContent = `${finalDeliveryCost.toLocaleString('fr-FR')} FC`;
            totalEl.textContent = `${total.toLocaleString('fr-FR')} FC`;
            
            // Activer ou désactiver le bouton de commande
            orderButton.disabled = !hasItems;
        }

        /**
         * Génère le message de commande pour WhatsApp et ouvre le lien.
         */
        function sendOrderToWhatsApp() {
            if (Object.keys(cart).length === 0) return;

            let message = "Bonjour Infini Pressing, je souhaite passer la commande suivante :\n\n";
            for (const name in cart) {
                const item = cart[name];
                message += `*${name}* : ${item.quantity}\n`;
            }
            
            message += "\n--------------------\n";
            message += `*Sous-total* : ${subtotalEl.textContent}\n`;
            message += `*Livraison* : ${deliveryFeeEl.textContent}\n`;
            message += `*TOTAL À PAYER* : *${totalEl.textContent}*\n\n`;
            message += "Merci !";

            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }

        // --- GESTIONNAIRES D'ÉVÉNEMENTS ---
        
        serviceListContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-change')) {
                const name = e.target.dataset.name;
                const amount = parseInt(e.target.dataset.amount, 10);
                const input = serviceListContainer.querySelector(`.quantity-input[data-name="${name}"]`);
                
                let currentQuantity = parseInt(input.value, 10);
                let newQuantity = Math.max(0, currentQuantity + amount);
                
                input.value = newQuantity;
                updateCart(name, newQuantity);
            }
        });

        orderButton.addEventListener('click', sendOrderToWhatsApp);

        // --- INITIALISATION ---
        renderServiceList();
    }

    // Déterminer quelle page est actuellement chargée
    const isOrderPage = document.getElementById('service-list') !== null;
    const isHomePage = document.querySelector('.contact-bar') !== null;

    // Initialiser les fonctionnalités appropriées
    if (isOrderPage) {
        initOrderPage();
    }
    
    if (isHomePage) {
        initHomePage();
    }
});