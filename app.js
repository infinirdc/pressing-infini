document.addEventListener('DOMContentLoaded', () => {
    // --- DONNÉES DES SERVICES AVEC CATÉGORIES ---
    const services = [
        { categories: ['homme'], name: "veste & pentalon veste", price: 7000, icon: '<img src="assets/suit-and-tie-outfit-svgrepo-com.svg" alt="veste" class="h-8 w-8 text-blue-500" />' },
        { categories: ['homme'], name: "Chemise & polo", price: 2000, icon: '<img src="assets/clo-polo-svgrepo-com.svg" alt="polo" class="h-8 w-8 text-blue-500" />' },
        { categories: ['homme'], name: "Pantalon & jeans", price: 3000, icon: '<img src="assets/pants-svgrepo-com.svg" alt="pantalon" class="h-8 w-8 text-blue-500" />' },
        { categories: ['femme'], name: "jupe et culotte", price: 2000, icon: '<img src="assets/skirt-svgrepo-com.svg" alt="jupe" class="h-8 w-8 text-blue-500" />' },
        { categories: ['femme'], name: "Robe ", price: 4000, icon: '<img src="assets/dress-4-svgrepo-com.svg" alt="robe" class="h-8 w-8 text-blue-500" />' },
        { categories: ['homme', 'femme'], name: "Pull & jacket", price: 4000, icon: '<img src="assets/sweater-svgrepo-com.svg" alt="pull" class="h-8 w-8 text-blue-500" />' },
        { categories: ['femme'], name: "Pagne", price: 5000, icon: '<img src="assets/pagne.svg" alt="pagne" class="h-8 w-8 text-blue-500" /> ' },
        { categories: ['homme', 'femme'], name: "Manteau homme/femme", price: 7000, icon: '<img src="assets/coat-svgrepo-com.svg" alt="manteau" class="h-8 w-8 text-blue-500" />' },
        { categories: ['homme', 'femme'], name: "Ensemble training", price: 5000, icon: '<img src="assets/tracksuit-svgrepo-com.svg" alt="training" class="h-8 w-8 text-blue-500" />' },
        { categories: ['homme', 'femme'], name: "chaussures", price: 7000, icon: '<img src="assets/shoes-shoe-svgrepo-com.svg" alt="chaussures" class="h-8 w-8 text-blue-500" />' },
        { categories: ['maison'], name: "Draps (bonus taie d'oreiller)", price: 3500, icon: '<img src="assets/bed-3-svgrepo-com.svg" alt="drap" class="h-8 w-8 text-blue-500" />' },
        { categories: ['maison'], name: "Rideaux (par m²)", price: 5000, icon: '<img src="assets/window-curtains-svgrepo-com.svg" alt="rideaux" class="h-8 w-8 text-blue-500" />' }
    ];

    // Récupération du panier sauvegardé ou vide
    let cart = JSON.parse(localStorage.getItem('infiniCart')) || {};

    function initOrderPage() {
        const serviceListContainer = document.getElementById('service-list');
        const cartItemsContainer = document.getElementById('cart-items');
        const subtotalEl = document.getElementById('subtotal');
        const deliveryFeeEl = document.getElementById('delivery-fee');
        const totalEl = document.getElementById('total');
        const orderButton = document.getElementById('order-button');
        const filterBtns = document.querySelectorAll('.filter-btn');

        if (!serviceListContainer) return;

        // Affiche les services selon le filtre
        function renderServices(filter = 'all') {
    // On filtre en vérifiant si la catégorie demandée est incluse dans le tableau 'categories' de l'objet
        const filtered = filter === 'all' 
            ? services 
            : services.filter(s => s.categories.includes(filter));
    
        serviceListContainer.innerHTML = filtered.map(service => {
            const qty = cart[service.name] ? cart[service.name].quantity : 0;
            return `
            <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-3 transition-all hover:border-blue-300">
                <div class="flex items-center gap-4">
                    <div class="bg-blue-50 p-2 rounded-lg">${service.icon}</div>
                    <div>
                        <p class="font-bold text-gray-800 text-sm sm:text-base">${service.name}</p>
                        <p class="text-blue-600 font-medium">${service.price.toLocaleString()} FC</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <button onclick="changeQty('${service.name}', -1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold">-</button>
                    <span id="qty-${service.name}" class="font-bold w-6 text-center">${qty}</span>
                    <button onclick="changeQty('${service.name}', 1)" class="w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-bold">+</button>
                </div>
            </div>`;
        }).join('');
}


        // Gérer le changement de quantité
        window.changeQty = (name, delta) => {
            const service = services.find(s => s.name === name);
            let currentQty = cart[name] ? cart[name].quantity : 0;
            let newQty = Math.max(0, currentQty + delta);

            if (newQty > 0) {
                cart[name] = { price: service.price, quantity: newQty };
            } else {
                delete cart[name];
            }

            localStorage.setItem('infiniCart', JSON.stringify(cart));
            
            // Mise à jour visuelle immédiate
            const qtyLabel = document.getElementById(`qty-${name}`);
            if (qtyLabel) qtyLabel.innerText = newQty;
            
            updateCartUI();
        };

        // Mettre à jour le résumé du panier
        function updateCartUI() {
            const items = Object.entries(cart);
            let subtotal = 0;

            if (items.length === 0) {
                cartItemsContainer.innerHTML = '<p class="text-gray-400 text-center py-4">Votre panier est vide</p>';
            } else {
                cartItemsContainer.innerHTML = items.map(([name, data]) => {
                    subtotal += data.price * data.quantity;
                    return `
                    <div class="flex justify-between text-sm mb-2 border-b border-gray-50 pb-1">
                        <span class="text-gray-600">${name} x${data.quantity}</span>
                        <span class="font-semibold">${(data.price * data.quantity).toLocaleString()} FC</span>
                    </div>`;
                }).join('');
            }

            const delivery = (subtotal >= 30000 || subtotal === 0) ? 0 : 5000;
            subtotalEl.innerText = `${subtotal.toLocaleString()} FC`;
            deliveryFeeEl.innerText = delivery === 0 ? "Offerte" : `${delivery.toLocaleString()} FC`;
            totalEl.innerText = `${(subtotal + delivery).toLocaleString()} FC`;
            orderButton.disabled = subtotal === 0;
        }

        // Filtres
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
                btn.classList.add('bg-blue-600', 'text-white');
                renderServices(btn.dataset.category);
            });
        });

        // Envoi WhatsApp
        window.sendOrder = () => {
            const name = document.getElementById('customer-name').value;
            const addr = document.getElementById('customer-address').value;
            if (!name || !addr) return alert("Veuillez remplir vos coordonnées.");

            let msg = `*COMMANDE INFINI PRESSING*\n\n*Client:* ${name}\n*Adresse:* ${addr}\n\n*Articles:*\n`;
            Object.entries(cart).forEach(([n, d]) => msg += `- ${n} x${d.quantity}\n`);
            msg += `\n*TOTAL:* ${totalEl.innerText}`;

            window.open(`https://wa.me/243995432688?text=${encodeURIComponent(msg)}`, '_blank');
        };

        renderServices();
        updateCartUI();
    }

    initOrderPage();
});
