// JavaScript for interactions

document.addEventListener('DOMContentLoaded', () => {
    const whatsappButton = document.querySelector('.contact-bar a');

    if (whatsappButton) {
        whatsappButton.addEventListener('click', (event) => {
            // The href already handles opening in a new tab, so no need to prevent default
            // or manually open a new window here unless more complex logic is needed.
            console.log('WhatsApp button clicked!');
        });
    }

    // Optional: Add hover effects for services and contact button
    const serviceItems = document.querySelectorAll('.service-list li');
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.textDecoration = 'underline';
        });
        item.addEventListener('mouseleave', () => {
            item.style.textDecoration = 'none';
        });
    });

    // Contact bar elevation on hover (CSS can handle this better with :hover)
    // For demonstration, if JS was strictly required:
    const contactBar = document.querySelector('.contact-bar');
    if (contactBar) {
        contactBar.addEventListener('mouseenter', () => {
            contactBar.style.boxShadow = '0 -5px 20px rgba(0, 0, 0, 0.2)';
        });
        contactBar.addEventListener('mouseleave', () => {
            contactBar.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
        });
    }
});