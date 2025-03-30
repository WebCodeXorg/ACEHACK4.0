/**
 * The Naari House - Login/Signup System JavaScript
 * This file handles all the interactive functionality including:
 * - Form toggling between login and signup
 * - Password validation and strength checking
 * - Success popup handling
 * - Hindi voice feedback system
 */

/**
 * Toggles between login, signup, and forgot password forms
 * @param {string} formType - Type of form to show ('login', 'signup', or 'forgot')
 */
function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotForm = document.getElementById('forgotPasswordForm');
    const buttons = document.querySelectorAll('.toggle-btn');
    
    // Hide all forms
    [loginForm, signupForm, forgotForm].forEach(form => form.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));
    
    // Show selected form
    switch(formType) {
        case 'login':
            loginForm.classList.add('active');
            buttons[0].classList.add('active');
            break;
        case 'signup':
            signupForm.classList.add('active');
            buttons[1].classList.add('active');
            break;
        case 'forgot':
            forgotForm.classList.add('active');
            break;
    }
}

// Firebase Configuration and Initialization
const firebaseConfig = {
    apiKey: "AIzaSyBSVYh42niUrPLoIEI4P02TaK_cRaNDO5Y",
    authDomain: "naari-house.firebaseapp.com",
    projectId: "naari-house",
    storageBucket: "naari-house.firebasestorage.app",
    messagingSenderId: "146293407270",
    appId: "1:146293407270:web:99b2570310728d9008b0e7",
    measurementId: "G-F1RXZBLXPQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Handle form submissions
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Login form submitted');
    console.log('Form structure:', this.innerHTML);
    
    // Use IDs to select the inputs
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    console.log('Email input found:', emailInput);
    console.log('Password input found:', passwordInput);
    
    // Check if inputs exist before accessing their values
    if (!emailInput || !passwordInput) {
        console.error('Input elements not found in the form');
        showPopup('Login Failed', 'Form inputs not found. Please try again.');
        return;
    }
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('Login successful:', userCredential.user);
        
        // Update last login timestamp in Firestore
        await db.collection('users').doc(userCredential.user.uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showPopup('Login Successful', 'Welcome back to The Naari House!');
        speakWelcomeMessage('हम आपका द नारी हाउस में स्वागत करते हैं');
        this.reset();
        
        // Redirect to home page after successful login
        setTimeout(() => { window.location.href = '../home/index.html'; }, 2000);
    } catch (error) {
        console.error('Login error:', error);
        showPopup('Login Failed', error.message);
        // Reset button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    if (!Object.values(requirements).every(req => req.valid)) {
        showPopup('Signup Failed', 'Please meet all password requirements');
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        return;
    }

    if (password !== confirmPassword) {
        showPopup('Signup Failed', 'Passwords do not match!');
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        return;
    }
    
    try {
        // Create user in Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Send email verification
        await userCredential.user.sendEmailVerification();
        
        // Store additional user data in Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            fullName: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            emailVerified: false
        });

        showPopup('Sign Up Successful', 'Welcome to The Naari House! Your account has been created successfully. Please check your email to verify your account.');
        this.reset();
        toggleForm('login');
    } catch (error) {
        console.error('Signup error:', error);
        showPopup('Signup Failed', error.message);
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending Reset Link...';
    submitBtn.disabled = true;
    
    try {
        // Check if email exists in Firebase Auth
        const methods = await auth.fetchSignInMethodsForEmail(email);
        if (methods.length === 0) {
            // Email doesn't exist, but don't reveal this for security reasons
            console.log('Email not found, but not revealing this to user');
        }
        
        await auth.sendPasswordResetEmail(email, {
            // URL to redirect to after password reset (optional)
            // url: window.location.origin + '/login.html',
            handleCodeInApp: false
        });
        
        showPopup('Reset Link Sent', 
            'We have sent password reset instructions to your email address. Please check your inbox.');
        this.reset();
        setTimeout(() => {
            closePopup();
            toggleForm('login');
        }, 3000);
    } catch (error) {
        console.error('Password reset error:', error);
        showPopup('Reset Failed', error.message);
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Add password visibility toggle functionality
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const input = this.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
});

// Password validation
const passwordInput = document.getElementById('signupPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const strengthBar = document.querySelector('.password-strength-bar');

const requirements = {
    length: { regex: /.{8,}/, valid: false },
    uppercase: { regex: /[A-Z]/, valid: false },
    lowercase: { regex: /[a-z]/, valid: false },
    number: { regex: /[0-9]/, valid: false },
    special: { regex: /[^A-Za-z0-9]/, valid: false }
};

/**
 * Updates the password strength indicator
 * @param {string} password - Current password value
 */
function updatePasswordStrength(password) {
    let strength = 0;
    const validRequirements = Object.values(requirements).filter(req => req.regex.test(password));
    strength = (validRequirements.length / Object.keys(requirements).length) * 100;

    strengthBar.style.width = strength + '%';
    strengthBar.className = 'password-strength-bar';
    
    // Set strength level classes
    if (strength <= 25) strengthBar.classList.add('weak');
    else if (strength <= 50) strengthBar.classList.add('medium');
    else if (strength <= 75) strengthBar.classList.add('strong');
    else strengthBar.classList.add('very-strong');
}

passwordInput.addEventListener('input', function() {
    const password = this.value;
    let validCount = 0;

    for (const [key, requirement] of Object.entries(requirements)) {
        const isValid = requirement.regex.test(password);
        requirement.valid = isValid;
        const element = document.getElementById(key);
        
        if (isValid) {
            element.classList.add('valid');
            element.classList.remove('invalid');
            element.querySelector('i').className = 'fas fa-check-circle';
            validCount++;
        } else {
            element.classList.add('invalid');
            element.classList.remove('valid');
            element.querySelector('i').className = 'fas fa-circle';
        }
    }

    updatePasswordStrength(password);

    // Update input group styling
    const inputGroup = this.parentElement;
    if (validCount === Object.keys(requirements).length) {
        inputGroup.classList.add('success');
        inputGroup.classList.remove('error');
    } else {
        inputGroup.classList.add('error');
        inputGroup.classList.remove('success');
    }
});

// Check password match
confirmPasswordInput.addEventListener('input', function() {
    const inputGroup = this.parentElement;
    if (this.value === passwordInput.value) {
        inputGroup.classList.add('success');
        inputGroup.classList.remove('error');
    } else {
        inputGroup.classList.add('error');
        inputGroup.classList.remove('success');
    }
});

// Popup functionality
function showPopup(title, message) {
    const popup = document.getElementById('successPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupMessage = document.getElementById('popupMessage');
    
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popup.classList.add('active');
}

/**
 * Closes the success popup
 */
function closePopup() {
    const popup = document.getElementById('successPopup');
    popup.classList.remove('active');
}

// Speech synthesis with Hindi female voice
 function speakWelcomeMessage(message) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.volume = 1;
    speech.rate = 0.9;
    speech.pitch = 1.1; // Balanced pitch for natural female voice
    speech.lang = 'hi-IN'; // Set language to Hindi

    // Function to find the best Hindi female voice
         function findHindiFemaleVoice(voices) {
        // Priority list for Hindi female voices
        const voicePriority = [
            { lang: 'hi-IN', gender: 'female' },
            { lang: 'hi', gender: 'female' },
            { lang: 'en-IN', gender: 'female' }, // Indian English as fallback
            { lang: 'hi-IN', gender: 'any' },    // Any Hindi voice as last resort
        ];

        for (const priority of voicePriority) {
            const matchingVoice = voices.find(voice => {
                const matchesLanguage = voice.lang.toLowerCase().includes(priority.lang.toLowerCase());
                const matchesGender = priority.gender === 'any' || 
                    (voice.name.toLowerCase().includes('female') || 
                     voice.name.toLowerCase().includes('mahila') ||
                     voice.name.toLowerCase().includes('lady'));
                return matchesLanguage && matchesGender;
            });
            
            if (matchingVoice) return matchingVoice;
        }

// Fallback to any female voice if no Hindi voice found
// Fallback to any female voice if no Hindi voice found
        return voices.find(voice => 
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('mahila') ||
            voice.name.toLowerCase().includes('lady')
        );
    }

    // Setup voice loading and speaking
    function setVoice() {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = findHindiFemaleVoice(voices);
        
        if (selectedVoice) {
            speech.voice = selectedVoice;
            console.log('Selected voice:', selectedVoice.name);
        }
    }

    // Handle voice loading
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = setVoice;
    }

// Try to set voice immediately
// Try to set voice immediately
    setVoice();
    
    // Cancel any previous speech
    window.speechSynthesis.cancel();

// Add a slight delay to ensure voice is loaded
    setTimeout(() => {
        window.speechSynthesis.speak(speech);
    }, 100);
}