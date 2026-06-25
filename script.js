// Password untuk lockscreen
const CORRECT_PASSWORD = '250626';
const WRONG_MESSAGE = 'jahat si ga hapal tanggal persabahatan';

// DOM Elements
const lockscreen = document.getElementById('lockscreen');
const mainContent = document.getElementById('mainContent');
const pinInput = document.getElementById('pinInput');
const pinDots = document.querySelectorAll('.pin-dot');
const pinBtns = document.querySelectorAll('.pin-btn');
const deleteBtn = document.getElementById('deleteBtn');
const errorMsg = document.getElementById('errorMsg');

let currentPin = '';
let attemptCount = 0;

// Event listeners untuk tombol angka
pinBtns.forEach(btn => {
    if (!btn.classList.contains('delete-btn')) {
        btn.addEventListener('click', () => {
            const value = btn.getAttribute('data-value');
            addPin(value);
        });
    }
});

// Delete button
deleteBtn.addEventListener('click', deleteLastPin);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (lockscreen.classList.contains('active')) {
        if (e.key >= '0' && e.key <= '9') {
            addPin(e.key);
        } else if (e.key === 'Backspace') {
            deleteLastPin();
        } else if (e.key === 'Enter') {
            checkPassword();
        }
    }
});

function addPin(value) {
    if (currentPin.length < 6) {
        currentPin += value;
        updatePinDisplay();
        
        // Auto check when 6 digits entered
        if (currentPin.length === 6) {
            setTimeout(checkPassword, 300);
        }
    }
}

function deleteLastPin() {
    currentPin = currentPin.slice(0, -1);
    updatePinDisplay();
    errorMsg.textContent = '';
}

function updatePinDisplay() {
    pinDots.forEach((dot, index) => {
        if (index < currentPin.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function checkPassword() {
    if (currentPin === CORRECT_PASSWORD) {
        unlockScreen();
    } else if (currentPin.length === 6) {
        // Wrong password
        attemptCount++;
        showError();
        
        // Clear after showing error
        setTimeout(() => {
            currentPin = '';
            updatePinDisplay();
        }, 500);
    }
}

function showError() {
    errorMsg.textContent = WRONG_MESSAGE;
    errorMsg.style.animation = 'none';
    
    // Trigger animation
    setTimeout(() => {
        errorMsg.style.animation = 'shake 0.3s ease';
    }, 10);
    
    // Shake the lock container
    const lockContainer = document.querySelector('.lock-container');
    lockContainer.style.animation = 'none';
    setTimeout(() => {
        lockContainer.style.animation = 'shake 0.3s ease';
    }, 10);
    
    // Red flash effect
    lockscreen.style.boxShadow = 'inset 0 0 30px rgba(255, 107, 157, 0.3)';
    setTimeout(() => {
        lockscreen.style.boxShadow = 'none';
    }, 300);
}

function unlockScreen() {
    // Success animation
    const lockContainer = document.querySelector('.lock-container');
    lockContainer.style.animation = 'bounceOut 0.5s ease';
    
    // Add bounce out animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounceOut {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                opacity: 0;
                transform: scale(0.95);
            }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        lockscreen.classList.remove('active');
        lockscreen.classList.add('hidden');
        mainContent.classList.add('visible');
        
        // Animate elements when content appears
        animateContentOnAppear();
    }, 500);
}

function animateContentOnAppear() {
    // Animate sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.intro-card, .memory-card, .promise-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Add ripple effect on button click
pinBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        // Add ripple styles if not already added
        if (!document.querySelector('style[data-ripple]')) {
            const style = document.createElement('style');
            style.setAttribute('data-ripple', 'true');
            style.textContent = `
                .pin-btn {
                    position: relative;
                    overflow: hidden;
                }
                .ripple {
                    position: absolute;
                    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: rippleEffect 0.6s ease-out;
                }
                @keyframes rippleEffect {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Initialize
console.log('🔒 Lockscreen initialized. Password: 250626');
console.log('💌 Website untuk Nadewa & Pat siap!');  

// Add subtle parallax effect on scroll
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const floatingElements = document.querySelectorAll('.floating-elements .float');
            floatingElements.forEach((el, index) => {
                el.style.transform = `translateY(${scrollY * (0.1 + index * 0.05)}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});