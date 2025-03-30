document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const shippingForm = document.getElementById('shipping-form');
    const inputs = shippingForm.querySelectorAll('input[required]');
    const placeOrderBtn = document.querySelector('.place-order-btn');

    // Payment modal elements
    const selectPaymentBtn = document.getElementById('select-payment-btn');
    const paymentModal = document.getElementById('payment-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const paymentOptions = document.querySelectorAll('.payment-method-option');
    const allPaymentForms = [
        document.getElementById('upi-form'),
        document.getElementById('card-form'),
        document.getElementById('netbanking-form'),
        document.getElementById('cod-form')
    ];

    // Payment method elements
    const bankList = document.getElementById('bank-list');
    const bankLogos = document.querySelectorAll('.bank-logo');

    // Show payment modal
    selectPaymentBtn.addEventListener('click', function() {
        paymentModal.classList.add('active');
        setTimeout(() => {
            paymentModal.querySelector('.payment-modal-content').style.opacity = '1';
            paymentModal.querySelector('.payment-modal-content').style.transform = 'translateY(0)';
        }, 10);
    });

    // Close modal on clicking close button or outside
    function closeModal() {
        paymentModal.querySelector('.payment-modal-content').style.opacity = '0';
        paymentModal.querySelector('.payment-modal-content').style.transform = 'translateY(-20px)';
        setTimeout(() => {
            paymentModal.classList.remove('active');
        }, 300);
    }

    closeModalBtn.addEventListener('click', closeModal);
    paymentModal.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            closeModal();
        }
    });

    // Handle payment method selection
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const method = this.dataset.method;
            
            // Hide all payment forms
            allPaymentForms.forEach(form => {
                if (form) {
                    form.style.display = 'none';
                    form.classList.remove('active');
                }
            });
            bankList.style.display = 'none';

            // Show selected payment form
            if (method === 'netbanking') {
                bankList.style.display = 'grid';
            } else {
                const selectedForm = document.getElementById(method + '-form');
                if (selectedForm) {
                    selectedForm.style.display = 'block';
                    setTimeout(() => {
                        selectedForm.classList.add('active');
                    }, 10);
                }
                closeModal();
            }

            // Update button text unless it's net banking
            if (method !== 'netbanking') {
                updatePaymentButton(method);
                selectPaymentBtn.innerHTML = `
                    <i class="${getPaymentIcon(method)}"></i>
                    ${getPaymentText(method)}
                `;
            }
        });
    });

    // Handle bank selection
    bankLogos.forEach(logo => {
        logo.addEventListener('click', function() {
            // Remove selected class from all logos
            bankLogos.forEach(l => l.classList.remove('selected'));
            // Add selected class to clicked logo
            this.classList.add('selected');
            
            const bankName = this.dataset.bank;
            const netbankingForm = document.getElementById('netbanking-form');
            
            // Show netbanking form
            if (netbankingForm) {
                netbankingForm.style.display = 'block';
                setTimeout(() => {
                    netbankingForm.classList.add('active');
                }, 10);
            }
            
            // Update payment button
            selectPaymentBtn.innerHTML = `
                <i class="fas fa-university"></i>
                Pay with ${this.querySelector('span').textContent}
            `;
            updatePaymentButton('netbanking', this.querySelector('span').textContent);

            closeModal();
        });
    });

    function getPaymentIcon(method) {
        switch(method) {
            case 'upi': return 'fas fa-mobile-alt';
            case 'card': return 'fas fa-credit-card';
            case 'netbanking': return 'fas fa-university';
            case 'cod': return 'fas fa-money-bill-wave';
            default: return 'fas fa-wallet';
        }
    }

    function getPaymentText(method) {
        switch(method) {
            case 'upi': return 'UPI Payment';
            case 'card': return 'Credit/Debit Card';
            case 'netbanking': return 'Net Banking';
            case 'cod': return 'Cash on Delivery';
            default: return 'Select Payment Method';
        }
    }

    function updatePaymentButton(method, provider = '') {
        const button = document.querySelector('.place-order-btn');
        const total = document.querySelector('.price-row.total span:last-child').textContent;
        
        switch(method) {
            case 'upi':
                button.textContent = provider ? `Pay ${total} with ${provider}` : 'Pay with UPI';
                break;
            case 'card':
                button.textContent = `Pay ${total}`;
                break;
            case 'netbanking':
                button.textContent = provider ? `Pay ${total} using ${provider}` : 'Pay using Net Banking';
                break;
            case 'cod':
                button.textContent = 'Place Order (Cash on Delivery)';
                break;
            default:
                button.textContent = 'Place Order';
        }
    }

    // Validate phone number format
    const phoneInput = document.getElementById('phone');
    phoneInput?.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });

    // Validate PIN code
    const pincodeInput = document.getElementById('pincode');
    pincodeInput?.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 6) {
            this.value = this.value.slice(0, 6);
        }
    });

    // Format card number with spaces
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput?.addEventListener('input', function() {
        let value = this.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
        if (value.length > 16) {
            value = value.slice(0, 16);
        }
        this.value = value.replace(/(.{4})/g, '$1 ').trim();
    });

    // Format card expiry date (MM/YY)
    const cardExpiryInput = document.getElementById('cardExpiry');
    cardExpiryInput?.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 4) {
            value = value.slice(0, 4);
        }
        if (value.length >= 2) {
            let month = parseInt(value.slice(0, 2));
            if (month > 12) month = 12;
            if (month < 1) month = 1;
            month = month.toString().padStart(2, '0');
            this.value = month + (value.length > 2 ? '/' + value.slice(2) : '');
        } else {
            this.value = value;
        }
    });

    // Success popup elements
    const successPopup = document.getElementById('success-popup');
    const closePopupBtn = document.querySelector('.close-popup-btn');

    function showSuccessPopup() {
        // Generate random order ID
        const orderId = 'TN' + Math.random().toString(36).substr(2, 9).toUpperCase();
        document.getElementById('order-id').textContent = orderId;
        
        // Show popup with animation
        successPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Handle close popup button
    closePopupBtn.addEventListener('click', function() {
        successPopup.classList.remove('active');
        document.body.style.overflow = '';
        window.location.href = '/'; // Redirect to home page
    });

    // Form submission
    placeOrderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const errors = validateForm();
        
        if (errors.length === 0) {
            // Disable the button and show processing state
            this.disabled = true;
            const originalText = this.textContent;
            this.textContent = 'Processing...';
            this.style.backgroundColor = '#ccc';
            
            // Simulate payment processing
            setTimeout(() => {
                showSuccessPopup();
                
                // Reset button state
                this.disabled = false;
                this.textContent = originalText;
                this.style.backgroundColor = '#007bff';
            }, 2000);
        } else {
            showErrorPopup(errors);
        }
    });

    // Helper functions for validation
    function isValidUPIId(upiId) {
        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
        return upiRegex.test(upiId);
    }

    function validateCardDetails() {
        let isValid = true;
        const cardNumber = cardNumberInput.value.replace(/\s/g, '');
        const cardExpiry = cardExpiryInput.value;
        const cardCvv = document.getElementById('cardCvv').value;
        const cardName = document.getElementById('cardName').value;

        if (cardNumber.length !== 16) {
            cardNumberInput.style.borderColor = '#dc3545';
            isValid = false;
        }

        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            cardExpiryInput.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            const [month, year] = cardExpiry.split('/');
            const now = new Date();
            const currentYear = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1;
            
            if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                cardExpiryInput.style.borderColor = '#dc3545';
                isValid = false;
            }
        }

        if (cardCvv.length !== 3) {
            document.getElementById('cardCvv').style.borderColor = '#dc3545';
            isValid = false;
        }

        if (!cardName.trim()) {
            document.getElementById('cardName').style.borderColor = '#dc3545';
            isValid = false;
        }

        return isValid;
    }

    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#ddd';
            }
        });
    });

    // Product management
    const productsContainer = document.querySelector('.products-container');
    const products = document.querySelectorAll('.product-preview');
    
    // Store product base prices
    const productPrices = {
        1: 1999, // Black Cotton Dress
        2: 2499  // Floral Summer Dress
    };

    // Handle quantity changes for all products
    function updateQuantity(productElement, action) {
        const quantitySpan = productElement.querySelector('.quantity');
        let currentQty = parseInt(quantitySpan.textContent);
        
        if (action === 'increase') {
            currentQty = Math.min(currentQty + 1, 10);
        } else if (action === 'decrease') {
            currentQty = Math.max(currentQty - 1, 1);
        }

        quantitySpan.textContent = currentQty;
        
        // Update button states
        const decreaseBtn = productElement.querySelector('[data-action="decrease"]');
        const increaseBtn = productElement.querySelector('[data-action="increase"]');
        decreaseBtn.disabled = currentQty === 1;
        increaseBtn.disabled = currentQty === 10;

        // Update product price
        const productId = productElement.dataset.productId;
        const basePrice = productPrices[productId];
        const totalProductPrice = basePrice * currentQty;
        productElement.querySelector('.product-price').textContent = `₹${totalProductPrice.toLocaleString()}`;

        // Update total prices
        updateTotalPrices();
    }

    // Calculate and update total prices
    function updateTotalPrices() {
        let subtotal = 0;
        const shipping = 99;
        const discount = 200;

        // Calculate subtotal from all products
        products.forEach(product => {
            if (product.isConnected) { // Check if product is still in DOM
                const quantity = parseInt(product.querySelector('.quantity').textContent);
                const productId = product.dataset.productId;
                const basePrice = productPrices[productId];
                subtotal += basePrice * quantity;
            }
        });

        // Update price breakdown
        const subtotalElement = document.querySelector('.price-row:first-child span:last-child');
        const totalElement = document.querySelector('.price-row.total span:last-child');
        
        subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
        const total = subtotal + shipping - discount;
        totalElement.textContent = `₹${total.toLocaleString()}`;

        // Update COD message if exists
        const codMessage = document.querySelector('.cod-message p');
        if (codMessage) {
            codMessage.textContent = `Pay ₹${total.toLocaleString()} in cash when your order is delivered`;
        }

        // Update success popup total amount
        const successAmount = document.querySelector('.order-details p:last-child');
        successAmount.textContent = `Total Amount: ₹${total.toLocaleString()}`;

        // Update payment button text if card payment is selected
        const cardForm = document.getElementById('card-form');
        if (cardForm && cardForm.style.display === 'block') {
            document.querySelector('.place-order-btn').textContent = `Pay ₹${total.toLocaleString()}`;
        }
    }

    // Handle delete product
    function deleteProduct(productElement) {
        productElement.classList.add('removing');
        setTimeout(() => {
            productElement.remove();

            // Check if any products remain
            if (!productsContainer.hasChildNodes()) {
                const orderSummary = document.querySelector('.order-summary');
                orderSummary.innerHTML = `
                    <h2>Order Summary</h2>
                    <div class="checkout-empty-cart">
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added any items to your cart yet.</p>
                        <a href="/" class="checkout-continue-shopping">Continue Shopping</a>
                    </div>
                `;
            } else {
                // Update totals after deletion
                updateTotalPrices();
            }
        }, 300);
    }

    // Add event listeners for all products
    products.forEach(product => {
        const decreaseBtn = product.querySelector('[data-action="decrease"]');
        const increaseBtn = product.querySelector('[data-action="increase"]');
        const deleteBtn = product.querySelector('.delete-product');

        decreaseBtn.addEventListener('click', () => updateQuantity(product, 'decrease'));
        increaseBtn.addEventListener('click', () => updateQuantity(product, 'increase'));
        deleteBtn.addEventListener('click', () => deleteProduct(product));

        // Initialize button states
        const quantity = parseInt(product.querySelector('.quantity').textContent);
        decreaseBtn.disabled = quantity === 1;
        increaseBtn.disabled = quantity === 10;
    });

    // Initialize total prices
    updateTotalPrices();

    const errorPopup = document.getElementById('error-popup');
    const errorList = errorPopup.querySelector('.error-list');
    const closeErrorBtn = errorPopup.querySelector('.close-error-popup-btn');

    // Form validation function
    function validateForm() {
        const errors = [];
        
        // Validate shipping details
        inputs.forEach(input => {
            if (!input.value.trim()) {
                const label = input.nextElementSibling.textContent;
                errors.push({ field: label, message: `Please enter your ${label}` });
                input.style.borderColor = '#dc3545';
            } else {
                input.style.borderColor = '#ddd';
            }
        });

        // Validate payment method
        const selectedPaymentForm = Array.from(allPaymentForms).find(form => 
            form && form.style.display === 'block'
        );

        if (!selectedPaymentForm) {
            errors.push({ field: 'Payment Method', message: 'Please select a payment method' });
            selectPaymentBtn.style.borderColor = '#dc3545';
        } else {
            selectPaymentBtn.style.borderColor = '#ddd';
            
            // Validate payment details based on method
            if (selectedPaymentForm.id === 'upi-form') {
                const upiId = document.getElementById('upiId');
                if (!isValidUPIId(upiId.value)) {
                    errors.push({ field: 'UPI ID', message: 'Please enter a valid UPI ID' });
                    upiId.style.borderColor = '#dc3545';
                }
            } else if (selectedPaymentForm.id === 'card-form') {
                validateCardDetailsWithErrors(errors);
            } else if (selectedPaymentForm.id === 'netbanking-form') {
                const selectedBank = document.querySelector('.bank-logo.selected');
                if (!selectedBank) {
                    errors.push({ field: 'Net Banking', message: 'Please select a bank' });
                    document.getElementById('bank-list').style.borderColor = '#dc3545';
                }
            }
        }

        return errors;
    }

    // Enhanced card validation with error messages
    function validateCardDetailsWithErrors(errors) {
        const cardNumber = cardNumberInput.value.replace(/\s/g, '');
        const cardExpiry = cardExpiryInput.value;
        const cardCvv = document.getElementById('cardCvv').value;
        const cardName = document.getElementById('cardName').value;

        if (cardNumber.length !== 16) {
            errors.push({ field: 'Card Number', message: 'Please enter a valid 16-digit card number' });
            cardNumberInput.style.borderColor = '#dc3545';
        }

        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            errors.push({ field: 'Card Expiry', message: 'Please enter a valid expiry date (MM/YY)' });
            cardExpiryInput.style.borderColor = '#dc3545';
        } else {
            const [month, year] = cardExpiry.split('/');
            const now = new Date();
            const currentYear = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1;
            
            if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                errors.push({ field: 'Card Expiry', message: 'Card has expired' });
                cardExpiryInput.style.borderColor = '#dc3545';
            }
        }

        if (cardCvv.length !== 3) {
            errors.push({ field: 'CVV', message: 'Please enter a valid 3-digit CVV' });
            document.getElementById('cardCvv').style.borderColor = '#dc3545';
        }

        if (!cardName.trim()) {
            errors.push({ field: 'Card Name', message: 'Please enter the name on your card' });
            document.getElementById('cardName').style.borderColor = '#dc3545';
        }
    }

    // Show error popup with messages
    function showErrorPopup(errors) {
        errorList.innerHTML = errors.map(error => 
            `<p><i class="fas fa-exclamation-circle"></i> ${error.message}</p>`
        ).join('');
        
        errorPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close error popup
    closeErrorBtn.addEventListener('click', function() {
        errorPopup.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Click outside to close error popup
    errorPopup.addEventListener('click', function(e) {
        if (e.target === errorPopup) {
            errorPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    function updateCartDisplay() {
        const productsContainer = document.querySelector('.products-container');
        const products = productsContainer.querySelectorAll('.product-preview');
        const emptyCartElement = document.querySelector('.checkout-empty-cart');
        const priceBreakdown = document.querySelector('.price-breakdown');
        const placeOrderBtn = document.querySelector('.place-order-btn');
        const paymentSection = document.querySelector('.checkout-section:last-child');

        if (products.length === 0) {
            // Hide order summary elements
            if (productsContainer) productsContainer.style.display = 'none';
            if (priceBreakdown) priceBreakdown.style.display = 'none';
            if (placeOrderBtn) placeOrderBtn.style.display = 'none';
            if (paymentSection) paymentSection.style.display = 'none';
            
            // Show empty cart message with animation
            if (emptyCartElement) {
                emptyCartElement.style.display = 'block';
                emptyCartElement.style.opacity = '0';
                emptyCartElement.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    emptyCartElement.style.transition = 'all 0.5s ease';
                    emptyCartElement.style.opacity = '1';
                    emptyCartElement.style.transform = 'translateY(0)';
                }, 100);
            }
        } else {
            // Show order summary elements
            if (productsContainer) productsContainer.style.display = 'block';
            if (emptyCartElement) emptyCartElement.style.display = 'none';
            if (priceBreakdown) priceBreakdown.style.display = 'block';
            if (placeOrderBtn) placeOrderBtn.style.display = 'block';
            if (paymentSection) paymentSection.style.display = 'block';
        }
    }

    // Delete product functionality
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productElement = this.closest('.product-preview');
            if (productElement) {
                productElement.classList.add('removing');
                setTimeout(() => {
                    productElement.remove();
                    updateCartDisplay();
                    updateTotalPrices(); // Update prices after removing product
                }, 300);
            }
        });
    });

    // Initialize cart display on page load
    updateCartDisplay();

    // Continue shopping button click handler
    document.querySelector('.checkout-continue-shopping')?.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/';
    });
});
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