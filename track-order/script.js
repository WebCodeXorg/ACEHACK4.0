// Mock database to simulate order data storage
const orderDatabase = {
    'ORD123456': {
        email: 'test@example.com',
        status: 2,
        orderDate: '2024-01-15',
        expectedDelivery: '2024-01-20',
        total: '₹2,499',
        items: [
            { name: 'Floral Print Dress', quantity: 1, price: '₹1,499' },
            { name: 'Cotton Palazzo', quantity: 1, price: '₹999' }
        ],
        address: '123 Main Street, Mumbai, Maharashtra, 400001',
        tracking: 'SHIP123456789'
    }
};

let statusService = null;

// Initialize event listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const trackButton = document.getElementById('trackButton');
    const loader = document.getElementById('loader');

    // Handle track button click event
    trackButton.addEventListener('click', async () => {
        // Get and sanitize input values
        const orderId = document.getElementById('orderId').value.trim();
        const email = document.getElementById('email').value.trim();
        
        // Reset previous results and errors
        resetUI();
        
        // Validate user inputs before proceeding
        if (!validateInputs(orderId, email)) return;
        
        // Show loading indicator while processing
        showLoader();
        
        // Simulate API delay (1.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Process the order tracking request
        processOrderTracking(orderId, email);
        
        // Hide loading indicator after processing
        hideLoader();
    });
});

/**
 * Resets the UI to its initial state
 * Clears previous errors and results
 */
function resetUI() {
    document.getElementById('error').style.display = 'none';
    document.getElementById('orderStatus').classList.add('hidden');
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
}

/**
 * Shows the loading spinner and disables the track button
 */
function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('trackButton').disabled = true;
}

/**
 * Hides the loading spinner and enables the track button
 */
function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('trackButton').disabled = false;
}

/**
 * Validates user input fields
 * @param {string} orderId - The order ID to validate
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if inputs are valid, false otherwise
 */
function validateInputs(orderId, email) {
    if (!orderId || !email) {
        showError('Please enter both Order ID and Email Address');
        return false;
    }
    return true;
}

/**
 * Processes the order tracking request and updates UI
 * @param {string} orderId - The order ID to track
 * @param {string} email - The associated email address
 */
function processOrderTracking(orderId, email) {
    const order = orderDatabase[orderId];
    
    if (!order || order.email !== email) {
        showError('Invalid Order ID or Email Address');
        return;
    }

    // Initialize status service
    statusService = new OrderStatusService();
    
    // Listen for status updates
    document.addEventListener('orderStatusChanged', handleStatusUpdate);
    
    // Start tracking
    statusService.startTracking(orderId);
    
    // Show initial state
    updateOrderStatus(order);
    updateOrderDetails(orderId, order);
    document.getElementById('orderStatus').classList.remove('hidden');
}

function handleStatusUpdate(event) {
    const { status, statusText, timestamp } = event.detail;
    
    // Update status steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index <= status) {
            step.classList.add('active');
            step.classList.add('status-update');
            setTimeout(() => {
                step.classList.remove('status-update');
            }, 1000);
        }
    });

    // Update status text
    const statusInfo = document.createElement('div');
    statusInfo.className = 'status-update-info';
    statusInfo.innerHTML = `${statusText} - ${timestamp}`;
    
    // Add status update to history
    const orderInfo = document.getElementById('orderInfo');
    orderInfo.insertBefore(statusInfo, orderInfo.firstChild);
}

// Cleanup when leaving page
window.addEventListener('beforeunload', () => {
    if (statusService) {
        statusService.stopTracking();
    }
});

/**
 * Displays error message to the user
 * @param {string} message - The error message to display
 */
function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/**
 * Updates the order status progress bar
 * @param {Object} order - The order object containing status
 */
function updateOrderStatus(order) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index <= order.status) {
            step.classList.add('active');
        }
    });
}

/**
 * Updates the order details section with order information
 * @param {string} orderId - The order ID
 * @param {Object} order - The order object containing details
 */
function updateOrderDetails(orderId, order) {
    const orderInfo = document.getElementById('orderInfo');
    orderInfo.innerHTML = `
        <div class="order-summary">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Order Date:</strong> ${order.orderDate}</p>
            <p><strong>Expected Delivery:</strong> ${order.expectedDelivery}</p>
            <p><strong>Total Amount:</strong> ${order.total}</p>
            <p><strong>Shipping Address:</strong> ${order.address}</p>
            <p><strong>Tracking Number:</strong> ${order.tracking}</p>
            <h3>Order Items:</h3>
            <ul>
                ${order.items.map(item => `
                    <li>${item.name} x ${item.quantity} - ${item.price}</li>
                `).join('')}
            </ul>
        </div>
    `;
}

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