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
};// Cart Functionality
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
    initSearch();
    initWishlist(); // Add wishlist initialization
});
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
document.addEventListener('DOMContentLoaded', function() {
    // Debounce function for performance optimization
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Stock functionality
    const stockData = {
        'S': { total: 10, remaining: 3 },
        'M': { total: 10, remaining: 5 },
        'L': { total: 10, remaining: 8 },
        'XL': { total: 10, remaining: 2 }
    };

    const sizeButtons = document.querySelectorAll('.size-btn');
    const stockStatus = document.querySelector('.stock-status');
    const piecesLeft = document.querySelector('.pieces-left');
    const progressBar = document.querySelector('.stock-progress-bar');
    const hurryText = document.querySelector('.hurry-text');

    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            stockStatus.style.display = 'block';
            const size = this.textContent;
            const stock = stockData[size];
            const percentage = (stock.remaining / stock.total) * 100;
            
            piecesLeft.textContent = `${stock.remaining} pieces left`;
            progressBar.style.width = `${percentage}%`;
            
            // Update hurry text based on stock level
            if (stock.remaining <= 3) {
                hurryText.textContent = 'Hurry! Only few left';
                hurryText.style.color = '#ff4444';
            } else {
                hurryText.textContent = 'In Stock';
                hurryText.style.color = '#4CAF50';
            }
        });
    });

    // Quantity handlers with validation
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const qtyInput = document.getElementById('qtyInput');
    const MAX_QUANTITY = 10;

    function updateQuantityControls(value) {
        decreaseBtn.disabled = value <= 1;
        increaseBtn.disabled = value >= MAX_QUANTITY;
    }

    qtyInput.addEventListener('input', function() {
        let value = parseInt(this.value) || 1;
        value = Math.max(1, Math.min(value, MAX_QUANTITY));
        this.value = value;
        updateQuantityControls(value);
    });

    decreaseBtn.addEventListener('click', function() {
        let value = parseInt(qtyInput.value);
        if (value > 1) {
            qtyInput.value = value - 1;
            updateQuantityControls(value - 1);
        }
    });

    increaseBtn.addEventListener('click', function() {
        let value = parseInt(qtyInput.value);
        if (value < MAX_QUANTITY) {
            qtyInput.value = value + 1;
            updateQuantityControls(value + 1);
        }
    });

    // Add to cart with validation
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', function() {
        const selectedSize = document.querySelector('.size-btn.active');
        if (!selectedSize) {
            showMessage('Please select a size', 'error');
            return;
        }

        const size = selectedSize.textContent;
        const quantity = parseInt(qtyInput.value);
        const stock = stockData[size];

        if (quantity > stock.remaining) {
            showMessage(`Sorry, only ${stock.remaining} pieces available in size ${size}`, 'error');
            return;
        }

        const productData = {
            name: document.querySelector('.product-title').textContent,
            price: document.querySelector('.product-price').textContent,
            size: size,
            quantity: quantity,
            image: document.getElementById('productImage').src
        };

        showMessage('Product added to cart successfully!', 'success');
        console.log('Adding to cart:', productData);
    });

    // Message display functionality
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 10);

        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    // Expandable sections with smooth animations
    const allExpandableSections = document.querySelectorAll('.offers-content, .info-content');
    const allToggleButtons = document.querySelectorAll('.offers-toggle, .info-toggle');

    function closeAllSections() {
        allExpandableSections.forEach(section => {
            section.style.maxHeight = null;
            section.classList.remove('show');
        });
        allToggleButtons.forEach(button => {
            button.classList.remove('active');
        });
    }

    function toggleSection(button, content) {
        const wasActive = button.classList.contains('active');
        closeAllSections();
        
        if (!wasActive) {
            button.classList.add('active');
            content.classList.add('show');
            content.style.maxHeight = content.scrollHeight + "px";
        }
    }

    document.querySelectorAll('.info-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            toggleSection(this, this.nextElementSibling);
        });
    });

    const offersToggle = document.querySelector('.offers-toggle');
    const offersContent = document.querySelector('.offers-content');
    offersToggle.addEventListener('click', function() {
        toggleSection(this, offersContent);
    });

    // Recommended Products Slider with smooth scrolling
    const productContainer = document.querySelector('.recommended-products');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    let cardWidth = productCards[0].offsetWidth + 20;
    let scrollPosition = 0;
    let maxScroll = (productCards.length * cardWidth) - productContainer.offsetWidth;

    const updateNavButtons = debounce(() => {
        prevBtn.classList.toggle('disabled', scrollPosition <= 0);
        nextBtn.classList.toggle('disabled', scrollPosition >= maxScroll);
    }, 100);

    window.addEventListener('resize', debounce(() => {
        cardWidth = productCards[0].offsetWidth + 20;
        maxScroll = (productCards.length * cardWidth) - productContainer.offsetWidth;
        updateNavButtons();
    }, 250));

    nextBtn.addEventListener('click', () => {
        scrollPosition = Math.min(scrollPosition + cardWidth, maxScroll);
        productContainer.scroll({
            left: scrollPosition,
            behavior: 'smooth'
        });
        updateNavButtons();
    });

    prevBtn.addEventListener('click', () => {
        scrollPosition = Math.max(scrollPosition - cardWidth, 0);
        productContainer.scroll({
            left: scrollPosition,
            behavior: 'smooth'
        });
        updateNavButtons();
    });

    productContainer.addEventListener('scroll', debounce(() => {
        scrollPosition = productContainer.scrollLeft;
        updateNavButtons();
    }, 100));

    // Initialize
    updateNavButtons();
    updateQuantityControls(1);
});

// Image gallery functionality
function changeImage(src, thumbnail) {
    const mainImage = document.getElementById('productImage');
    mainImage.style.opacity = '0';
    setTimeout(() => {
        mainImage.src = src;
        mainImage.style.opacity = '1';
    }, 300);
    
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Delivery check functionality
document.getElementById('checkDelivery').addEventListener('click', function() {
    const pincode = document.getElementById('pincodeInput').value;
    const deliveryResult = document.getElementById('deliveryResult');
    
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
        deliveryResult.textContent = 'Please enter a valid 6-digit pincode';
        deliveryResult.className = 'delivery-result error';
        return;
    }

    // Simulate delivery check (replace with actual API call)
    setTimeout(() => {
        if (['400001', '400002', '400003'].includes(pincode)) {
            deliveryResult.textContent = 'Delivery available in your area! Estimated delivery in 3-5 working days.';
            deliveryResult.className = 'delivery-result success';
        } else {
            deliveryResult.textContent = 'Sorry, delivery is not available in your area.';
            deliveryResult.className = 'delivery-result error';
        }
    }, 500);
});

// Wishlist Functionality
function initWishlist() {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if current product is in wishlist
    const currentProduct = {
        id: 1, // You can set a proper product ID
        name: document.querySelector('.product-title').textContent,
        price: document.querySelector('.product-price').textContent,
        image: document.getElementById('productImage').src
    };
    
    function updateWishlistButton() {
        const isInWishlist = wishlist.some(item => item.id === currentProduct.id);
        if (isInWishlist) {
            wishlistBtn.classList.add('active');
            wishlistBtn.querySelector('i').className = 'fas fa-heart';
        } else {
            wishlistBtn.classList.remove('active');
            wishlistBtn.querySelector('i').className = 'far fa-heart';
        }
    }
    
    wishlistBtn.addEventListener('click', () => {
        const isInWishlist = wishlist.some(item => item.id === currentProduct.id);
        
        if (isInWishlist) {
            // Remove from wishlist
            wishlist = wishlist.filter(item => item.id !== currentProduct.id);
            showMessage('Product removed from wishlist', 'success');
        } else {
            // Add to wishlist
            wishlist.push(currentProduct);
            showMessage('Product added to wishlist', 'success');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistButton();
    });
    
    // Initialize button state
    updateWishlistButton();
}

// Initialize wishlist when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    initWishlist(); // Add wishlist initialization
});

