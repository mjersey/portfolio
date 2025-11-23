// --- CONTACT MODAL LOGIC & FORM HANDLING ---

function initFormHandlers() {
    const contactModal = document.getElementById('contact-modal');
    const openContactBtn = document.getElementById('open-contact-btn');
    const closeContactBtn = document.getElementById('close-contact-modal');
    const contactModalContent = document.getElementById('contact-modal-content');

    if (openContactBtn && contactModal) {
        openContactBtn.addEventListener('click', () => {
            contactModal.classList.remove('hidden');
            setTimeout(() => {
                contactModalContent.classList.remove('scale-95', 'opacity-0');
                contactModalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        });
    }

    function closeContactModal() {
        if (contactModalContent) {
            contactModalContent.classList.remove('scale-100', 'opacity-100');
            contactModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                contactModal.classList.add('hidden');
            }, 300);
        }
    }

    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', closeContactModal);
    }
    
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) closeContactModal();
        });
    }
}

document.addEventListener('modalLoaded', initFormHandlers);
document.addEventListener('DOMContentLoaded', initFormHandlers);