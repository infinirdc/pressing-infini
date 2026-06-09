/**
 * Initialisation globale de l'application Infini Pressing.
 * Gère le splash screen, le catalogue, le panier et la commande WhatsApp.
 */
document.addEventListener('DOMContentLoaded', () => {
    const services = [
        { id: 'costume', categories: ['homme'], name: 'Costume veste et pantalon', price: 7000, icon: 'assets/suit-and-tie-outfit-svgrepo-com.svg', alt: 'Costume' },
        { id: 'chemise-polo', categories: ['homme'], name: 'Chemise ou polo', price: 2000, icon: 'assets/clo-polo-svgrepo-com.svg', alt: 'Chemise' },
        { id: 'pantalon-jeans', categories: ['homme'], name: 'Pantalon ou jeans', price: 3000, icon: 'assets/pants-svgrepo-com.svg', alt: 'Pantalon' },
        { id: 'jupe-culotte', categories: ['femme'], name: 'Jupe ou culotte', price: 2000, icon: 'assets/skirt-svgrepo-com.svg', alt: 'Jupe' },
        { id: 'robe', categories: ['femme'], name: 'Robe', price: 4000, icon: 'assets/dress-4-svgrepo-com.svg', alt: 'Robe' },
        { id: 'pull-veste', categories: ['homme', 'femme'], name: 'Pull ou veste légère', price: 4000, icon: 'assets/sweater-svgrepo-com.svg', alt: 'Pull' },
        { id: 'pagne', categories: ['femme'], name: 'Pagne', price: 5000, icon: 'assets/pagne.svg', alt: 'Pagne' },
        { id: 'manteau', categories: ['homme', 'femme'], name: 'Manteau homme ou femme', price: 7000, icon: 'assets/coat-svgrepo-com.svg', alt: 'Manteau' },
        { id: 'training', categories: ['homme', 'femme'], name: 'Ensemble training', price: 5000, icon: 'assets/tracksuit-svgrepo-com.svg', alt: 'Training' },
        { id: 'chaussures', categories: ['homme', 'femme'], name: 'Chaussures', price: 7000, icon: 'assets/shoes-shoe-svgrepo-com.svg', alt: 'Chaussures' },
        { id: 'draps', categories: ['maison'], name: "Draps avec taie d'oreiller", price: 3500, icon: 'assets/bed-3-svgrepo-com.svg', alt: 'Draps' },
        { id: 'rideaux', categories: ['maison'], name: 'Rideaux par m²', price: 5000, icon: 'assets/window-curtains-svgrepo-com.svg', alt: 'Rideaux' }
    ];

    const deliveryCost = 6000;
    const deliveryFreeThreshold = 50000;
    const phoneNumber = '243995432688';
    const currencyFormatter = new Intl.NumberFormat('fr-FR');
    let cart = JSON.parse(localStorage.getItem('infiniCartV2')) || {};

    function formatPrice(amount) {
        return `${currencyFormatter.format(amount)} FC`;
    }

    function getService(id) {
        return services.find((service) => service.id === id);
    }

    function saveCart() {
        localStorage.setItem('infiniCartV2', JSON.stringify(cart));
    }

    function getSubtotal() {
        return Object.entries(cart).reduce((sum, [id, item]) => {
            const service = getService(id);
            return service ? sum + service.price * item.quantity : sum;
        }, 0);
    }

    function getDeliveryFee(subtotal) {
        if (subtotal <= 0 || subtotal >= deliveryFreeThreshold) return 0;
        return deliveryCost;
    }

    function handleSplashScreen() {
        const splash = document.getElementById('splash-screen');
        if (!splash) return;

        if (sessionStorage.getItem('splashShown')) {
            splash.style.display = 'none';
            return;
        }

        sessionStorage.setItem('splashShown', '1');
        setTimeout(() => {
            splash.classList.add('hidden');
            setTimeout(() => {
                splash.style.display = 'none';
            }, 450);
        }, 1200);
    }

    function initHomePage() {
        const tariffsContainer = document.getElementById('tariffs-list-container');
        if (!tariffsContainer) return;

        tariffsContainer.innerHTML = services.map((service) => {
            const categories = service.categories.map((category) => category[0].toUpperCase() + category.slice(1)).join(' / ');
            return `
                <article class="tariff-card">
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <span class="tariff-icon"><img src="${service.icon}" alt="" loading="lazy"></span>
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">${categories}</p>
                                <h3 class="mt-1 text-lg font-extrabold text-slate-900">${service.name}</h3>
                            </div>
                        </div>
                        <p class="shrink-0 text-lg font-black text-blue-700">${formatPrice(service.price)}</p>
                    </div>
                    <a href="commande.html?service=${encodeURIComponent(service.id)}" class="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700">
                        Commander cet article
                    </a>
                </article>
            `;
        }).join('');
    }

    function initOrderPage() {
        const serviceListContainer = document.getElementById('service-list');
        if (!serviceListContainer) return;

        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const subtotalEl = document.getElementById('subtotal');
        const deliveryFeeEl = document.getElementById('delivery-fee');
        const deliveryNoteEl = document.getElementById('delivery-note');
        const totalEl = document.getElementById('total');
        const orderButton = document.getElementById('order-button');
        const confirmation = document.getElementById('order-confirmation');
        const clearCartButton = document.getElementById('clear-cart-button');
        const editOrderButton = document.getElementById('edit-order-button');
        const customerNameEl = document.getElementById('customer-name');
        const customerPhoneEl = document.getElementById('customer-phone');
        const customerAddressEl = document.getElementById('customer-address');
        const customerAreaEl = document.getElementById('customer-area');
        const customerSlotEl = document.getElementById('customer-slot');
        const customerNoteEl = document.getElementById('customer-note');
        const filterBtns = document.querySelectorAll('.filter-btn');

        const requestedServiceId = new URLSearchParams(window.location.search).get('service');
        if (requestedServiceId && getService(requestedServiceId) && !cart[requestedServiceId]) {
            cart[requestedServiceId] = { quantity: 1 };
            saveCart();
        }

        function renderServices(filter = 'all') {
            const filtered = filter === 'all' ? services : services.filter((service) => service.categories.includes(filter));
            serviceListContainer.innerHTML = filtered.map((service) => {
                const qty = cart[service.id]?.quantity || 0;
                return `
                    <article class="service-row">
                        <div class="flex flex-1 items-center gap-4">
                            <span class="service-icon"><img src="${service.icon}" alt="${service.alt}" loading="lazy"></span>
                            <div>
                                <h3 class="text-base font-extrabold text-slate-900 sm:text-lg">${service.name}</h3>
                                <p class="font-bold text-blue-700">${formatPrice(service.price)}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 self-end sm:self-auto">
                            <button class="quantity-change quantity-btn bg-slate-100 text-slate-700 hover:bg-slate-200" data-id="${service.id}" data-amount="-1" aria-label="Retirer ${service.name}">-</button>
                            <input type="number" value="${qty}" min="0" class="quantity-input w-14 bg-transparent text-center text-lg font-black" data-id="${service.id}" readonly aria-label="Quantité ${service.name}">
                            <button class="quantity-change quantity-btn bg-blue-600 text-white hover:bg-blue-700" data-id="${service.id}" data-amount="1" aria-label="Ajouter ${service.name}">+</button>
                        </div>
                    </article>
                `;
            }).join('');
            updateQuantityInputs();
        }

        function updateCart(id, quantity) {
            if (!getService(id)) return;
            if (quantity > 0) {
                cart[id] = { quantity };
            } else {
                delete cart[id];
            }
            saveCart();
            renderCart();
            updateTotals();
            updateQuantityInputs();
            confirmation?.classList.add('hidden');
        }

        function updateQuantityInputs() {
            document.querySelectorAll('.quantity-input').forEach((input) => {
                input.value = cart[input.dataset.id]?.quantity || 0;
            });
        }

        function renderCart() {
            const entries = Object.entries(cart).filter(([id]) => getService(id));
            if (!entries.length) {
                if (cartItemsContainer) cartItemsContainer.innerHTML = '';
                if (emptyCartMessage) {
                    emptyCartMessage.style.display = 'block';
                    cartItemsContainer?.appendChild(emptyCartMessage);
                }
                return;
            }

            if (emptyCartMessage) emptyCartMessage.style.display = 'none';
            cartItemsContainer.innerHTML = entries.map(([id, item]) => {
                const service = getService(id);
                const itemTotal = service.price * item.quantity;
                return `
                    <div class="flex items-start justify-between gap-4 rounded-2xl bg-stone-50 p-3">
                        <div>
                            <p class="font-bold text-slate-900">${service.name}</p>
                            <p class="text-sm text-slate-500">${item.quantity} x ${formatPrice(service.price)}</p>
                        </div>
                        <span class="font-extrabold text-slate-900">${formatPrice(itemTotal)}</span>
                    </div>
                `;
            }).join('');
        }

        function updateTotals() {
            const subtotal = getSubtotal();
            const deliveryFee = getDeliveryFee(subtotal);
            const total = subtotal + deliveryFee;

            if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
            if (deliveryFeeEl) deliveryFeeEl.textContent = deliveryFee === 0 && subtotal > 0 ? 'Offerte' : formatPrice(deliveryFee);
            if (totalEl) totalEl.textContent = formatPrice(total);
            if (orderButton) orderButton.disabled = subtotal <= 0;

            if (deliveryNoteEl) {
                if (subtotal <= 0) {
                    deliveryNoteEl.textContent = 'Livraison offerte dès 50 000 FC.';
                } else if (subtotal >= deliveryFreeThreshold) {
                    deliveryNoteEl.textContent = 'Bonne nouvelle : la collecte et la livraison sont offertes.';
                } else {
                    deliveryNoteEl.textContent = `Ajoutez ${formatPrice(deliveryFreeThreshold - subtotal)} pour obtenir la livraison offerte.`;
                }
            }
        }

        function validateCustomerFields() {
            const requiredFields = [
                [customerNameEl, 'votre nom complet'],
                [customerPhoneEl, 'votre numéro de téléphone'],
                [customerAddressEl, 'votre adresse de récupération'],
                [customerAreaEl, 'votre commune ou quartier'],
                [customerSlotEl, 'le créneau souhaité']
            ];

            const missing = requiredFields.find(([field]) => !field?.value.trim());
            if (missing) {
                alert(`Veuillez renseigner ${missing[1]}.`);
                missing[0].focus();
                return false;
            }
            return true;
        }

        function sendOrder() {
            if (!Object.keys(cart).length || !validateCustomerFields()) return;

            const subtotal = getSubtotal();
            const deliveryFee = getDeliveryFee(subtotal);
            const total = subtotal + deliveryFee;

            let message = '*Nouvelle commande - Infini Pressing*\\n\\n';
            message += `*Client :* ${customerNameEl.value.trim()}\\n`;
            message += `*Téléphone :* ${customerPhoneEl.value.trim()}\\n`;
            message += `*Adresse :* ${customerAddressEl.value.trim()}\\n`;
            message += `*Commune / quartier :* ${customerAreaEl.value.trim()}\\n`;
            message += `*Créneau souhaité :* ${customerSlotEl.value.trim()}\\n`;
            if (customerNoteEl.value.trim()) {
                message += `*Note :* ${customerNoteEl.value.trim()}\\n`;
            }

            message += '\\n--- *Détails de la commande* ---\\n';
            Object.entries(cart).forEach(([id, item]) => {
                const service = getService(id);
                if (!service) return;
                message += `• ${item.quantity}x *${service.name}* (${formatPrice(service.price)}) = ${formatPrice(service.price * item.quantity)}\\n`;
            });

            message += '\\n--- *Récapitulatif* ---\\n';
            message += `*Sous-total* : ${formatPrice(subtotal)}\\n`;
            message += `*Collecte et livraison* : ${deliveryFee === 0 ? 'Offerte' : formatPrice(deliveryFee)}\\n`;
            message += `*TOTAL À PAYER* : *${formatPrice(total)}*\\n\\n`;
            message += 'Merci.';

            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
            confirmation?.classList.remove('hidden');
        }

        serviceListContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.quantity-change');
            if (!button) return;
            const currentQuantity = cart[button.dataset.id]?.quantity || 0;
            updateCart(button.dataset.id, Math.max(0, currentQuantity + Number(button.dataset.amount)));
        });

        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                filterBtns.forEach((button) => button.classList.remove('active'));
                btn.classList.add('active');
                renderServices(btn.dataset.category);
            });
        });

        orderButton?.addEventListener('click', sendOrder);
        clearCartButton?.addEventListener('click', () => {
            cart = {};
            saveCart();
            renderServices(document.querySelector('.filter-btn.active')?.dataset.category || 'all');
            renderCart();
            updateTotals();
            confirmation?.classList.add('hidden');
        });
        editOrderButton?.addEventListener('click', () => confirmation?.classList.add('hidden'));

        renderServices();
        renderCart();
        updateTotals();
    }

    handleSplashScreen();
    initHomePage();
    initOrderPage();
});
