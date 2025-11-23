// Initialize Icons
lucide.createIcons();

// --- DYNAMIC MODAL LOADER ---
document.addEventListener("DOMContentLoaded", function() {
    
    const accessKeyInput = document.getElementById('access-key-input');
    if(accessKeyInput) {
        accessKeyInput.value = '911b52c1-a58a-4c81-b52c-9693e967cf5b'; 
    }

    // 1. Profile Image HOVER Logic
    const profileContainer = document.getElementById('profile-container');
    const profileAvatar = document.getElementById('profile-avatar');
    
    if (profileContainer && profileAvatar) {
        profileContainer.addEventListener('mouseenter', function() {
            profileAvatar.src = 'side.png'; 
        });

        profileContainer.addEventListener('mouseleave', function() {
            profileAvatar.src = 'front.png';
        });
    }

    // 2. Email Modal Loader 
    fetch('email-modal.html')
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then(data => {
            const container = document.getElementById('email-modal-container');
            if(container) {
                container.innerHTML = data;
                lucide.createIcons();
                
                const event = new Event('modalLoaded');
                document.dispatchEvent(event);
            }
        })
        .catch(error => console.error('Error loading email modal:', error));

    // 3. Contact Modal Logic
    const openContactBtn = document.getElementById('open-contact-btn');
    const contactModal = document.getElementById('contact-modal');
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

        const closeContact = () => {
            contactModalContent.classList.remove('scale-100', 'opacity-100');
            contactModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                contactModal.classList.add('hidden');
            }, 300);
        };

        if (closeContactBtn) closeContactBtn.addEventListener('click', closeContact);
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) closeContact();
        });
    }
});


// --- CERTIFICATE MODAL LOGIC ---
const certModal = document.getElementById('cert-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const closeCertModalBtn = document.getElementById('close-cert-modal');
const certModalContent = document.getElementById('cert-modal-content');

function openModal(element) {
    const title = element.querySelector('h4').innerText;
    const imgSrc = element.querySelector('.full-img-src').innerText;
    
    modalTitle.innerText = title;
    modalImg.src = imgSrc;
    
    certModal.classList.remove('hidden');
    setTimeout(() => {
        certModalContent.classList.remove('scale-95', 'opacity-0');
        certModalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

window.openModal = openModal;

function closeCertModal() {
    certModalContent.classList.remove('scale-100', 'opacity-100');
    certModalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        certModal.classList.add('hidden');
    }, 300);
}

if (closeCertModalBtn) {
    closeCertModalBtn.addEventListener('click', closeCertModal);
}
if (certModal) {
    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) closeCertModal();
    });
}

// --- PAGINATION & FILTER LOGIC ---
const itemsPerPage = 6;
let currentPage = 1;
let currentFilter = 'all';

const prevBtn = document.getElementById('prev-certs-btn');
const nextBtn = document.getElementById('next-certs-btn');
const certItems = Array.from(document.querySelectorAll('.cert-item'));
const filterBtns = document.querySelectorAll('.filter-btn');

function updatePagination() {
    const filteredItems = certItems.filter(item => {
        return currentFilter === 'all' || item.dataset.year === currentFilter;
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    
    if (currentPage > totalPages) currentPage = 1;
    if (totalPages === 0) currentPage = 1;

    certItems.forEach(item => item.classList.add('hidden-slide'));

    filteredItems.forEach((item, index) => {
        const itemPage = Math.ceil((index + 1) / itemsPerPage);
        if (itemPage === currentPage) {
            item.classList.remove('hidden-slide');
            item.classList.remove('fade-in');
            void item.offsetWidth; // trigger reflow
            item.classList.add('fade-in');
        }
    });

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        prevBtn.classList.toggle('text-gray-600', currentPage === 1);
        prevBtn.classList.toggle('text-gray-400', currentPage !== 1);
        prevBtn.classList.toggle('hover:text-white', currentPage !== 1);
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages || totalPages === 0;
        nextBtn.classList.toggle('opacity-30', currentPage >= totalPages || totalPages === 0);
        nextBtn.classList.toggle('text-gray-600', currentPage >= totalPages || totalPages === 0);
        nextBtn.classList.toggle('text-gray-400', currentPage < totalPages);
        nextBtn.classList.toggle('hover:text-white', currentPage < totalPages);
    }
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
            b.classList.remove('bg-[#222]', 'text-white');
            b.classList.add('text-gray-400', 'hover:bg-[#222]');
        });
        btn.classList.add('bg-[#222]', 'text-white');
        btn.classList.remove('text-gray-400', 'hover:bg-[#222]');

        currentFilter = btn.dataset.filter;
        currentPage = 1;
        updatePagination();
    });
});

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const filteredCount = certItems.filter(item => currentFilter === 'all' || item.dataset.year === currentFilter).length;
        const totalPages = Math.ceil(filteredCount / itemsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updatePagination();
    const defaultBtn = document.querySelector('[data-filter="all"]');
    if(defaultBtn) {
        defaultBtn.classList.remove('text-gray-400');
        defaultBtn.classList.add('text-white');
    }
});

// --- ANIMATION OBSERVER ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));