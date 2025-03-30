// ============================================
// Utility Functions
// ============================================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Global function to close sidebar
function closeSidebarMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }
}

// ============================================
// Navigation & Sidebar
// ============================================
const initNavigation = () => {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const sidebarDropdowns = document.querySelectorAll('.sidebar-dropdown');
    const sidebarLinks = document.querySelectorAll('.sidebar-dropdown-content a, .sidebar-footer .icon');

    const closeSidebarMenu = () => {
        sidebar.classList.remove('active');
    };

    sidebarToggle.addEventListener('click', () => sidebar.classList.add('active'));
    closeSidebar.addEventListener('click', closeSidebarMenu);

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            closeSidebarMenu();
        }
    });

    sidebarLinks.forEach(link => {
        link.addEventListener('click', closeSidebarMenu);
    });

    sidebarDropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.sidebar-item');
        const dropdownContent = dropdown.querySelector('.sidebar-dropdown-content');
        const toggleIcon = dropdownLink.querySelector('.sidebar-toggle-icon');

        dropdownLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close other dropdowns
            sidebarDropdowns.forEach(other => {
                if (other !== dropdown) {
                    const otherContent = other.querySelector('.sidebar-dropdown-content');
                    const otherIcon = other.querySelector('.sidebar-toggle-icon');
                    otherContent.classList.remove('active');
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-minus');
                        otherIcon.classList.add('fa-plus');
                    }
                }
            });

            // Toggle current dropdown
            dropdownContent.classList.toggle('active');
            if (toggleIcon) {
                toggleIcon.classList.toggle('fa-minus');
                toggleIcon.classList.toggle('fa-plus');
            }
        });
    });
};

// ============================================
// Hero Section Slider
// ============================================
const initHeroSlider = () => {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let isAnimating = false;
    let autoSlideInterval;

    const updateDots = (index) => {
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };

    const goToSlide = (index, smooth = true) => {
        if (isAnimating) return;
        isAnimating = true;

        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        currentSlide = index;
        slider.style.transition = smooth ? 'transform 0.7s ease' : 'none';
        slider.style.transform = `translateX(${-currentSlide * 100}%)`;
        updateDots(currentSlide);

        setTimeout(() => { isAnimating = false; }, 700);
    };

    // Initialize slider
    goToSlide(0, false);
    startAutoSlide();

    // Touch handling for hero slider
    let touchStartX = 0;
    let startTranslate = 0;

    const handleTouchStart = (e) => {
        clearInterval(autoSlideInterval);
        touchStartX = e.touches[0].clientX;
        startTranslate = -currentSlide * 100;
        slider.style.transition = 'none';
    };

    const handleTouchMove = (e) => {
        if (isAnimating) return;
        const touch = e.touches[0];
        const diff = (touch.clientX - touchStartX) / slider.offsetWidth * 100;
        const newTranslate = startTranslate + diff;
        
        if (newTranslate > 0 || newTranslate < -((slides.length - 1) * 100)) {
            slider.style.transform = `translateX(${newTranslate * 0.25}%)`;
        } else {
            slider.style.transform = `translateX(${newTranslate}%)`;
        }
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) > slider.offsetWidth / 4) {
            goToSlide(diff > 0 ? currentSlide - 1 : currentSlide + 1);
        } else {
            goToSlide(currentSlide);
        }
        startAutoSlide();
    };

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            if (!isAnimating) goToSlide(currentSlide + 1);
        }, 5000);
    }

    // Event listeners
    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchmove', handleTouchMove, { passive: true });
    slider.addEventListener('touchend', handleTouchEnd);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isAnimating) {
                clearInterval(autoSlideInterval);
                goToSlide(index);
                startAutoSlide();
            }
        });
    });
};

// ============================================
// Product Cards & Runway Section
// ============================================
const initProductCards = () => {
    // Pre-load secondary images
    const secondaryImages = document.querySelectorAll('.secondary-image');
    secondaryImages.forEach(img => {
        const tempImage = new Image();
        tempImage.src = img.src;
    });

    // Shop now buttons
    const shopNowButtons = document.querySelectorAll('.shop-now-btn');
    shopNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = e.target.closest('.product-card').querySelector('.product-name').textContent;
            console.log('Shop Now clicked for:', productName);
        });
    });

    // View all button
    const viewAllButton = document.querySelector('.view-all-btn');
    if (viewAllButton) {
        viewAllButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('View All products button clicked');
        });
    }
};

// ============================================
// Runway Slider
// ============================================
const initRunwaySlider = () => {
    const runwayTrack = document.querySelector('.runway-track');
    if (!runwayTrack) return;

    const runwayCards = document.querySelectorAll('.runway-card');
    const prevButton = document.querySelector('.runway-prev');
    const nextButton = document.querySelector('.runway-next');
    
    let currentIndex = 0;
    let cardWidth;
    let gap;
    let cardsPerView;

    const updateMeasurements = () => {
        const computedStyle = window.getComputedStyle(runwayTrack);
        gap = parseInt(computedStyle.gap);
        
        cardsPerView = window.innerWidth >= 1024 ? 4 : 
                       window.innerWidth >= 768 ? 3 : 2;
        
        cardWidth = (runwayTrack.offsetWidth - (gap * (cardsPerView - 1))) / cardsPerView;
    };

    const slideTo = (index) => {
        if (index < 0) index = 0;
        if (index > runwayCards.length - cardsPerView) {
            index = runwayCards.length - cardsPerView;
        }
        currentIndex = index;
        const offset = -(currentIndex * (cardWidth + gap));
        runwayTrack.style.transform = `translateX(${offset}px)`;

        prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentIndex >= runwayCards.length - cardsPerView ? '0.5' : '1';
    };

    // Event listeners
    prevButton?.addEventListener('click', () => currentIndex > 0 && slideTo(currentIndex - 1));
    nextButton?.addEventListener('click', () => currentIndex < runwayCards.length - cardsPerView && slideTo(currentIndex + 1));

    // Touch handling
    let touchStartX = 0;
    let startTranslate = 0;

    runwayTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        startTranslate = -currentIndex * (cardWidth + gap);
        runwayTrack.style.transition = 'none';
    });

    runwayTrack.addEventListener('touchmove', (e) => {
        const touchEndX = e.touches[0].clientX;
        const diff = touchEndX - touchStartX;
        const newTranslate = startTranslate + diff;
        
        if (newTranslate > 0 || newTranslate < -((runwayCards.length - cardsPerView) * (cardWidth + gap))) {
            runwayTrack.style.transform = `translateX(${newTranslate * 0.25}px)`;
        } else {
            runwayTrack.style.transform = `translateX(${newTranslate}px)`;
        }
    });

    runwayTrack.addEventListener('touchend', (e) => {
        runwayTrack.style.transition = 'transform 0.5s ease';
        const touchEndX = e.changedTouches[0].clientX;
        const movement = touchEndX - touchStartX;
        const moveThreshold = cardWidth / 3;

        if (Math.abs(movement) > moveThreshold) {
            if (movement > 0 && currentIndex > 0) {
                slideTo(currentIndex - 1);
            } else if (movement < 0 && currentIndex < runwayCards.length - cardsPerView) {
                slideTo(currentIndex + 1);
            }
        }
        slideTo(currentIndex);
    });

    // Initialize
    updateMeasurements();
    slideTo(0);
    window.addEventListener('resize', debounce(() => {
        updateMeasurements();
        slideTo(currentIndex);
    }, 250));
};

// ============================================
// Naari Section Slider
// ============================================
const initNaariSlider = () => {
    const naariTrack = document.querySelector('.naari-track');
    if (!naariTrack) return;

    const naariCards = document.querySelectorAll('.naari-card');
    const prevButton = document.querySelector('.naari-prev');
    const nextButton = document.querySelector('.naari-next');
    
    let currentIndex = 0;
    let cardWidth;
    let gap;
    let cardsPerView;
    
    const updateMeasurements = () => {
        const computedStyle = window.getComputedStyle(naariTrack);
        gap = parseInt(computedStyle.gap);
        
        if (window.innerWidth >= 1024) {
            cardsPerView = 4; // Desktop
        } else if (window.innerWidth >= 768) {
            cardsPerView = 3; // Tablet
        } else {
            cardsPerView = 2; // Mobile
        }
        
        cardWidth = (naariTrack.offsetWidth - (gap * (cardsPerView - 1))) / cardsPerView;
    };

    // Initial measurements
    updateMeasurements();
    
    // Update measurements on window resize
    window.addEventListener('resize', updateMeasurements);

    // Slide to position
    const slideTo = (index) => {
        if (index < 0) index = 0;
        if (index > naariCards.length - cardsPerView) {
            index = naariCards.length - cardsPerView;
        }
        currentIndex = index;
        const offset = -(currentIndex * (cardWidth + gap));
        naariTrack.style.transform = `translateX(${offset}px)`;

        // Update button states
        prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentIndex >= naariCards.length - cardsPerView ? '0.5' : '1';
    };

    // Navigation button handlers
    nextButton.addEventListener('click', () => {
        if (currentIndex < naariCards.length - cardsPerView) {
            slideTo(currentIndex + 1);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            slideTo(currentIndex - 1);
        }
    });

    // Initial slide setup
    slideTo(0);
};

// ============================================
// Features Section
// ============================================
const initFeatures = () => {
    const featuresTrack = document.querySelector('.features-track');
    if (!featuresTrack) return;

    const featureItems = document.querySelectorAll('.feature-item');
    const dotsContainer = document.querySelector('.features-dots');
    let currentIndex = 0;

    // Mobile/tablet view setup
    if (window.innerWidth <= 1023) {
        // Create navigation dots
        featureItems.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('features-dot');
            if (index === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.features-dot');
        featureItems[0].classList.add('active');

        const showFeature = (index) => {
            featureItems.forEach(item => item.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            featureItems[index].classList.add('active');
            dots[index].classList.add('active');
            currentIndex = index;
        };

        // Event listeners
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showFeature(index));
        });

        // Touch handling
        let touchStartX = 0;
        featuresTrack.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
        featuresTrack.addEventListener('touchend', e => {
            const swipeDistance = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0 && currentIndex > 0) {
                    showFeature(currentIndex - 1);
                } else if (swipeDistance < 0 && currentIndex < featureItems.length - 1) {
                    showFeature(currentIndex + 1);
                }
            }
        });
    }
};

// ============================================
// Customer Testimonials
// ============================================
const initTestimonials = () => {
    const customersTrack = document.querySelector('.customers-track');
    if (!customersTrack) return;

    const customerCards = document.querySelectorAll('.customer-card');
    const prevButton = document.querySelector('.customer-prev');
    const nextButton = document.querySelector('.customer-next');
    
    let currentIndex = 0;
    let autoSlide;
    
    const showTestimonial = (index) => {
        if (index < 0) index = customerCards.length - 1;
        if (index >= customerCards.length) index = 0;
        
        currentIndex = index;
        customersTrack.style.transform = `translateX(${-currentIndex * 100}%)`;
    };

    const startAutoSlide = () => {
        autoSlide = setInterval(() => showTestimonial(currentIndex + 1), 5000);
    };

    // Event listeners
    nextButton?.addEventListener('click', () => showTestimonial(currentIndex + 1));
    prevButton?.addEventListener('click', () => showTestimonial(currentIndex - 1));

    customersTrack.addEventListener('mouseenter', () => clearInterval(autoSlide));
    customersTrack.addEventListener('mouseleave', startAutoSlide);

    // Touch handling
    let touchStartX = 0;
    customersTrack.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
    customersTrack.addEventListener('touchend', e => {
        const swipeDistance = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(swipeDistance) > 50) {
            showTestimonial(swipeDistance > 0 ? currentIndex - 1 : currentIndex + 1);
        }
    });

    // Initialize
    showTestimonial(0);
    startAutoSlide();
};

// ============================================
// Form Validation and Popup Handling
// ============================================
function validateForm(event) {
    event.preventDefault();
    const emailInput = document.querySelector('.email-input');
    const popup = document.querySelector('.signup-popup');
    const overlay = document.querySelector('.popup-overlay');
    
    if (emailInput.value.trim() === '') {
        alert('Please enter your email address');
        return false;
    }

    // Show popup and overlay
    popup.classList.add('active');
    overlay.classList.add('active');
    
    // Reset form
    emailInput.value = '';
    
    return false;
}

// Close popup when clicking the close button or overlay
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.querySelector('.signup-popup');
    const overlay = document.querySelector('.popup-overlay');
    const closeBtn = document.querySelector('.popup-close');

    function closePopup() {
        popup.classList.remove('active');
        overlay.classList.remove('active');
    }

    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);
});

// ============================================
// Search Functionality
// ============================================
const initSearch = () => {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');
    const searchSuggestions = document.querySelector('.search-suggestions');
    const suggestionResults = document.querySelector('.suggestion-results');

    // Sample product data
    const products = [
        { name: 'Embroidered Kurti', category: 'Ethnic Wear' },
        { name: 'Designer Party Wear Suit', category: 'Party Wear' },
        { name: 'Floral Print Anarkali', category: 'Ethnic Wear' },
        { name: 'Wedding Collection Lehenga', category: 'Wedding Collection' },
        { name: 'Premium Designer Saree', category: 'Ethnic Wear' },
        { name: 'Stylish Cotton Salwar', category: 'Casual Wear' },
        { name: 'Printed Lehenga Set', category: 'Wedding Collection' },
        { name: 'Embellished Gown', category: 'Party Wear' }
    ];

    const openSearch = () => {
        searchOverlay.classList.add('active');
        setTimeout(() => searchInput.focus(), 300);
    };

    const closeSearch = () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchSuggestions.classList.remove('active');
    };

    const showSuggestions = (query) => {
        if (query.length < 1) {
            searchSuggestions.classList.remove('active');
            return;
        }

        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );

        suggestionResults.innerHTML = filteredProducts.length > 0 
            ? filteredProducts.map(product => `
                <a href="#" class="suggestion-item">
                    <i class="fas fa-search"></i>
                    <span>${product.name} <small>(${product.category})</small></span>
                </a>
            `).join('')
            : `<div class="suggestion-item"><span>No results found for "${query}"</span></div>`;
            
        searchSuggestions.classList.add('active');
    };

    // Event listeners
    searchInput.addEventListener('input', debounce(() => {
        showSuggestions(searchInput.value.trim());
    }, 300));

    searchToggle.addEventListener('click', openSearch);
    searchClose.addEventListener('click', closeSearch);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });

    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.search-container');
        if (!searchContainer.contains(e.target) && !searchToggle.contains(e.target)) {
            searchSuggestions.classList.remove('active');
        }
    });

    suggestionResults.addEventListener('click', (e) => {
        const suggestionItem = e.target.closest('.suggestion-item');
        if (suggestionItem) {
            e.preventDefault();
            searchInput.value = suggestionItem.querySelector('span').textContent;
            searchSuggestions.classList.remove('active');
            console.log('Searching for:', searchInput.value);
            setTimeout(closeSearch, 500);
        }
    });
};

// Footer Mobile Toggles
document.querySelectorAll('.footer-column .mobile-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const column = toggle.closest('.footer-column');
        const links = column.querySelector('.footer-links');
        
        // Close other columns first
        document.querySelectorAll('.footer-column').forEach(otherColumn => {
            if (otherColumn !== column && otherColumn.classList.contains('active')) {
                const otherLinks = otherColumn.querySelector('.footer-links');
                const otherIcon = otherColumn.querySelector('.mobile-toggle i');
                otherColumn.classList.remove('active');
                otherIcon.className = 'fas fa-plus';
                otherLinks.style.display = 'none';
            }
        });

        // Toggle current column
        const icon = toggle.querySelector('i');
        column.classList.toggle('active');
        
        // Toggle icon and links with animation
        if (column.classList.contains('active')) {
            icon.className = 'fas fa-minus';
            links.style.display = 'block';
            requestAnimationFrame(() => {
                links.style.maxHeight = links.scrollHeight + 'px';
                links.style.opacity = '1';
            });
        } else {
            icon.className = 'fas fa-plus';
            links.style.maxHeight = '0';
            links.style.opacity = '0';
            setTimeout(() => {
                if (!column.classList.contains('active')) {
                    links.style.display = 'none';
                }
            }, 300);
        }
    });
});

// Make the entire footer title clickable
document.querySelectorAll('.footer-title').forEach(title => {
    title.addEventListener('click', (e) => {
        // Only trigger if the click is on the title text, not the toggle button
        if (!e.target.classList.contains('mobile-toggle') && !e.target.closest('.mobile-toggle')) {
            const toggle = title.querySelector('.mobile-toggle');
            if (toggle) toggle.click();
        }
    });
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) { // Show button after scrolling 300px
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Cart Functionality
const cartIcon = document.querySelector('.nav-icons .fa-shopping-cart').parentElement;
const cartOverlay = document.querySelector('.cart-overlay');
const cartClose = document.querySelector('.cart-close');
const continueShopping = document.querySelector('.continue-shopping');
const cartContainer = document.querySelector('.cart-container');

function openCart() {
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add touch blocking for better mobile experience
    cartOverlay.style.touchAction = 'none';
    
    // Focus management for accessibility
    setTimeout(() => {
        cartClose.focus();
    }, 100);
}

function closeCart() {
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
    cartOverlay.style.touchAction = '';
}

// Handle cart icon click
cartIcon.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    openCart();
});

// Add mobile sidebar cart functionality
const mobileSidebarCartIcon = document.querySelector('.sidebar-footer .fa-shopping-cart').parentElement;

mobileSidebarCartIcon.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeSidebarMenu(); // Close the sidebar first
    openCart();
});

// Handle cart close button
cartClose.addEventListener('click', function(e) {
    e.preventDefault();
    closeCart();
});

// Handle continue shopping button
continueShopping.addEventListener('click', function(e) {
    e.preventDefault();
    closeCart();
});

// Close cart when clicking outside
cartOverlay.addEventListener('click', function(e) {
    if (e.target === cartOverlay) {
        closeCart();
    }
});

// Prevent touch events from propagating through the cart container
cartContainer.addEventListener('click', function(e) {
    e.stopPropagation();
});

// Handle touch events for mobile
let touchStartX = 0;
let touchEndX = 0;

cartOverlay.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
}, { passive: true });

cartOverlay.addEventListener('touchmove', function(e) {
    if (e.target === cartOverlay) {
        touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        // If swipe right, start closing the cart
        if (diff < -50) {
            e.preventDefault();
        }
    }
}, { passive: false });

cartOverlay.addEventListener('touchend', function(e) {
    if (e.target === cartOverlay) {
        const diff = touchStartX - touchEndX;
        
        // Close cart on right swipe
        if (diff < -50) {
            closeCart();
        }
    }
    
    // Reset values
    touchStartX = 0;
    touchEndX = 0;
});

// Handle escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartOverlay.classList.contains('active')) {
        closeCart();
    }
});

// Add focus trap for accessibility
function handleTabKey(e) {
    if (!cartOverlay.classList.contains('active')) return;

    const focusableElements = cartOverlay.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }
}

document.addEventListener('keydown', handleTabKey);

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroSlider();
    initProductCards();
    initRunwaySlider();
    initNaariSlider();
    initFeatures();
    initTestimonials();
    initSearch();
});