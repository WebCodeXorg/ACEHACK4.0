document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabLinks = document.querySelectorAll('.profile-nav li');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all tabs
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            link.classList.add('active');
            const tabId = link.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Profile image upload
    const profilePic = document.getElementById('profilePic');
    const defaultIcon = document.querySelector('.default-profile-icon');
    const editOverlay = document.querySelector('.edit-overlay');

    editOverlay.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePic.src = e.target.result;
                    profilePic.style.display = 'block';
                    defaultIcon.style.display = 'none';
                    saveProfileImage(file);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });

    // Real-time update for username and email
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const headerUsername = document.querySelector('.user-name');
    const headerEmail = document.querySelector('.user-email');

    fullNameInput.addEventListener('input', (e) => {
        headerUsername.textContent = e.target.value;
    });

    emailInput.addEventListener('input', (e) => {
        headerEmail.textContent = e.target.value;
    });

    // Form submission handling
    const profileForm = document.querySelector('.profile-form');
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            dob: document.getElementById('dob').value
        };
        saveProfileData(formData);
    });

    // Address management
    const addAddressBtn = document.querySelector('.btn-add-address');
    const addressList = document.querySelector('.address-list');

    addAddressBtn.addEventListener('click', () => {
        showAddressModal();
    });

    // Edit and Delete address buttons
    addressList.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit')) {
            const addressCard = e.target.closest('.address-card');
            editAddress(addressCard);
        } else if (e.target.classList.contains('btn-delete')) {
            const addressCard = e.target.closest('.address-card');
            deleteAddress(addressCard);
        }
    });

    // Notification toggles
    const notificationToggles = document.querySelectorAll('.notification-settings input');
    notificationToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            updateNotificationPreference(e.target.nextElementSibling.textContent, e.target.checked);
        });
    });

    // Settings form submission
    const settingsForm = document.querySelector('.settings-form');
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show confirmation modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Save Settings</h3>
                <p class="delete-message">Are you sure you want to save these changes?</p>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel">Cancel</button>
                    <button type="button" class="btn-save">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle cancel
        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            modal.remove();
        });

        // Handle save
        modal.querySelector('.btn-save').addEventListener('click', () => {
            const currentPassword = settingsForm.querySelector('input[placeholder="Current Password"]').value;
            const newPassword = settingsForm.querySelector('input[placeholder="New Password"]').value;
            const confirmPassword = settingsForm.querySelector('input[placeholder="Confirm New Password"]').value;

            // Validate passwords
            if (newPassword !== confirmPassword) {
                showToast('New passwords do not match!');
                modal.remove();
                return;
            }

            if (currentPassword && newPassword && confirmPassword) {
                // Simulate API call to update password
                console.log('Updating password...');
                showToast('Settings saved successfully!');
                
                // Clear password fields after successful update
                settingsForm.querySelectorAll('input[type="password"]').forEach(input => {
                    input.value = '';
                });
            }
            modal.remove();
        });
    });

    // Mock functions for API calls
    function saveProfileImage(file) {
        // Simulate API call
        console.log('Saving profile image:', file.name);
        showToast('Profile picture updated successfully!');
    }

    function saveProfileData(data) {
        // Simulate API call
        console.log('Saving profile data:', data);
        showToast('Profile information saved successfully!');
    }

    function showAddressModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Add New Address</h3>
                <form id="addressForm">
                    <div class="form-group">
                        <label for="addressType">Address Type</label>
                        <select id="addressType" required>
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="streetAddress">Street Address</label>
                        <input type="text" id="streetAddress" required>
                    </div>
                    <div class="form-group">
                        <label for="apartment">Apartment/Suite (Optional)</label>
                        <input type="text" id="apartment">
                    </div>
                    <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" id="city" required>
                    </div>
                    <div class="form-group">
                        <label for="state">State</label>
                        <input type="text" id="state" required>
                    </div>
                    <div class="form-group">
                        <label for="zipcode">ZIP Code</label>
                        <input type="text" id="zipcode" required>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel">Cancel</button>
                        <button type="submit" class="btn-save">Save Address</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal on cancel
        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            modal.remove();
        });

        // Handle form submission
        modal.querySelector('#addressForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const addressData = {
                type: modal.querySelector('#addressType').value,
                street: modal.querySelector('#streetAddress').value,
                apartment: modal.querySelector('#apartment').value,
                city: modal.querySelector('#city').value,
                state: modal.querySelector('#state').value,
                zipcode: modal.querySelector('#zipcode').value
            };

            addNewAddress(addressData);
            modal.remove();
        });
    }

    function addNewAddress(data) {
        const addressCard = document.createElement('div');
        addressCard.className = 'address-card';
        addressCard.innerHTML = `
            <div class="address-type">${data.type}</div>
            <p>${data.street}</p>
            ${data.apartment ? `<p>${data.apartment}</p>` : ''}
            <p>${data.city}, ${data.state} ${data.zipcode}</p>
            <div class="address-actions">
                <button class="btn-edit">Edit</button>
                <button class="btn-delete">Delete</button>
            </div>
        `;

        // Insert the new address card before the add button
        const addressList = document.querySelector('.address-list');
        addressList.insertBefore(addressCard, addressList.querySelector('.btn-add-address'));
        
        showToast('Address added successfully!');
    }

    function editAddress(addressCard) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        // Get current address details
        const type = addressCard.querySelector('.address-type').textContent;
        const paragraphs = addressCard.querySelectorAll('p');
        const street = paragraphs[0].textContent;
        const apartment = paragraphs.length === 3 ? paragraphs[1].textContent : '';
        const cityStateZip = (paragraphs.length === 3 ? paragraphs[2] : paragraphs[1]).textContent;
        const [city, stateZip] = cityStateZip.split(',');
        const [state, zipcode] = stateZip.trim().split(' ');

        modal.innerHTML = `
            <div class="modal-content">
                <h3>Edit Address</h3>
                <form id="editAddressForm">
                    <div class="form-group">
                        <label for="addressType">Address Type</label>
                        <select id="addressType" required>
                            <option value="Home" ${type === 'Home' ? 'selected' : ''}>Home</option>
                            <option value="Office" ${type === 'Office' ? 'selected' : ''}>Office</option>
                            <option value="Other" ${type === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="streetAddress">Street Address</label>
                        <input type="text" id="streetAddress" required value="${street}">
                    </div>
                    <div class="form-group">
                        <label for="apartment">Apartment/Suite (Optional)</label>
                        <input type="text" id="apartment" value="${apartment}">
                    </div>
                    <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" id="city" required value="${city}">
                    </div>
                    <div class="form-group">
                        <label for="state">State</label>
                        <input type="text" id="state" required value="${state}">
                    </div>
                    <div class="form-group">
                        <label for="zipcode">ZIP Code</label>
                        <input type="text" id="zipcode" required value="${zipcode}">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel">Cancel</button>
                        <button type="submit" class="btn-save">Save Changes</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal on cancel
        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            modal.remove();
        });

        // Handle form submission
        modal.querySelector('#editAddressForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const addressData = {
                type: modal.querySelector('#addressType').value,
                street: modal.querySelector('#streetAddress').value,
                apartment: modal.querySelector('#apartment').value,
                city: modal.querySelector('#city').value,
                state: modal.querySelector('#state').value,
                zipcode: modal.querySelector('#zipcode').value
            };

            updateAddress(addressCard, addressData);
            modal.remove();
        });
    }

    function updateAddress(addressCard, data) {
        addressCard.innerHTML = `
            <div class="address-type">${data.type}</div>
            <p>${data.street}</p>
            ${data.apartment ? `<p>${data.apartment}</p>` : ''}
            <p>${data.city}, ${data.state} ${data.zipcode}</p>
            <div class="address-actions">
                <button class="btn-edit">Edit</button>
                <button class="btn-delete">Delete</button>
            </div>
        `;
        showToast('Address updated successfully!');
    }

    function deleteAddress(addressCard) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content delete-confirmation">
                <h3>Delete Address</h3>
                <p class="delete-message">Are you sure you want to delete this address?</p>
                <div class="modal-actions">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-confirm-delete">Delete</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal on cancel
        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            modal.remove();
        });

        // Handle delete confirmation
        modal.querySelector('.btn-confirm-delete').addEventListener('click', () => {
            addressCard.remove();
            modal.remove();
            showToast('Address deleted successfully!');
        });
    }

    function updateNotificationPreference(type, enabled) {
        // Simulate API call
        console.log('Updating notification preference:', type, enabled);
        showToast(`${type} ${enabled ? 'enabled' : 'disabled'} successfully!`);
    }

    // Toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Add styles for toast
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = 'var(--primary-color)';
        toast.style.color = 'white';
        toast.style.padding = '1rem 2rem';
        toast.style.borderRadius = '5px';
        toast.style.animation = 'slideIn 0.5s ease, fadeOut 0.5s ease 2.5s';
        toast.style.zIndex = '1000';

        // Add keyframes for toast animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Remove toast after animation
        setTimeout(() => {
            toast.remove();
            style.remove();
        }, 3000);
    }

    // Wishlist button redirect
    const addWishlistBtn = document.querySelector('.btn-add-wishlist');
    if (addWishlistBtn) {
        addWishlistBtn.addEventListener('click', () => {
            window.location.href = '/'; // Redirect to home page
        });
    }
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

// Logout functionality
const logoutBtn = document.querySelector('.btn-logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content delete-confirmation">
                <h3>Logout</h3>
                <p class="delete-message">Are you sure you want to logout?</p>
                <div class="modal-actions">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-confirm-delete">Logout</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle cancel
        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            modal.remove();
        });

        // Handle confirm logout
        modal.querySelector('.btn-confirm-delete').addEventListener('click', () => {
            // Add your logout logic here (e.g., clear session, redirect)
            window.location.href = '../login/index.html'; // Redirect to login page
        });
    });
}