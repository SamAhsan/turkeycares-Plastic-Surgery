// ========================================
// PROFESSIONAL HEALTHCARE LANDING PAGE JS
// ========================================

// Detect iOS device
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// ========================================
// HERO WORD ROTATION ANIMATION
// ========================================
const changingWord = document.getElementById('changingWord');
if (changingWord) {
    const words = ['confidence', 'aesthetic', 'procedure', 'peace of mind'];
    let currentIndex = 0;

    function changeWord() {
        changingWord.style.opacity = '0';

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % words.length;
            changingWord.textContent = words[currentIndex];
            changingWord.style.opacity = '1';
        }, 400);
    }

    // Change word every 2 seconds
    setInterval(changeWord, 2000);
}

// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Navbar height
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ========================================
// CARD SLIDER FUNCTIONALITY
// ========================================

const cardsTrack = document.getElementById('cardsTrack');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');

if (cardsTrack && sliderPrev && sliderNext) {
    let currentIndex = 0;
    const cards = document.querySelectorAll('.checkup-card');
    const totalCards = cards.length;

    function getVisibleCards() {
        if (window.innerWidth >= 1200) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function getCardWidth() {
        // Get actual card width from DOM for accurate calculation
        if (cards.length > 0) {
            const cardElement = cards[0];
            const cardWidth = cardElement.getBoundingClientRect().width;
            // Get gap from cards-track
            const trackStyle = window.getComputedStyle(cardsTrack);
            const trackGap = parseFloat(trackStyle.gap) || 32;
            return cardWidth + trackGap;
        }
        return 320 + 32; // fallback
    }

    function updateSlider() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, totalCards - visibleCards);

        // Constrain current index
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        const cardWidth = getCardWidth();
        const offset = currentIndex * cardWidth;

        console.log('Slider update:', {
            currentIndex,
            offset,
            cardWidth,
            isIOS,
            totalCards,
            maxIndex
        });

        // Apply transform - same way for all devices
        requestAnimationFrame(() => {
            cardsTrack.style.webkitTransform = `translate3d(-${offset}px, 0, 0)`;
            cardsTrack.style.transform = `translate3d(-${offset}px, 0, 0)`;

            // Set transition
            cardsTrack.style.webkitTransition = '-webkit-transform 0.5s ease-out';
            cardsTrack.style.transition = 'transform 0.5s ease-out';
        });

        // Update button states
        sliderPrev.disabled = currentIndex === 0;
        sliderNext.disabled = currentIndex >= maxIndex;
    }

    sliderPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    sliderNext.addEventListener('click', () => {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, totalCards - visibleCards);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const cardsContainer = document.querySelector('.cards-container');
    if (cardsContainer) {
        cardsContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        cardsContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const visibleCards = getVisibleCards();
            const maxIndex = Math.max(0, totalCards - visibleCards);

            if (touchEndX < touchStartX - swipeThreshold && currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
            if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        }
    }

    // Update on window resize
    window.addEventListener('resize', () => {
        setTimeout(updateSlider, 50);
    });

    // Initialize
    if (isIOS) {
        // iOS needs multiple initialization attempts
        updateSlider();
        setTimeout(updateSlider, 100);
        setTimeout(updateSlider, 300);
        setTimeout(updateSlider, 500);
    } else {
        updateSlider();
        setTimeout(updateSlider, 100);
    }
}

// ========================================
// FLIP CARD FUNCTIONALITY
// ========================================
// Flip card works on hover for desktop
// Auto-flip on scroll for mobile

// Auto-flip cards on mobile when they come into view
const flipCards = document.querySelectorAll('.flip-card');

// iOS-specific flip card handler
function flipCardOnIOS(card, shouldFlip) {
    // Force style recalculation on iOS before changing class
    void card.offsetHeight;

    if (shouldFlip) {
        card.classList.add('flipped');
        // Use webkit transform for iOS
        card.style.webkitTransform = 'rotateY(180deg) translateZ(0)';
        card.style.transform = 'rotateY(180deg) translateZ(0)';
    } else {
        card.classList.remove('flipped');
        // Reset to initial position
        card.style.webkitTransform = 'rotateY(0deg) translateZ(0)';
        card.style.transform = 'rotateY(0deg) translateZ(0)';
    }

    // Force another reflow after transform
    void card.offsetHeight;
}

const flipObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && window.innerWidth <= 968) {
            const cardIndex = Array.from(flipCards).indexOf(entry.target);
            const delay = cardIndex * 200;

            // Add flipped class after a short delay for staggered effect
            setTimeout(() => {
                if (isIOS) {
                    flipCardOnIOS(entry.target, true);
                } else {
                    entry.target.classList.add('flipped');
                }
            }, delay);

            // Remove flipped class after 4 seconds to show front again
            setTimeout(() => {
                if (isIOS) {
                    flipCardOnIOS(entry.target, false);
                } else {
                    entry.target.classList.remove('flipped');
                }
            }, delay + 4000);
        }
    });
}, {
    threshold: isIOS ? 0.2 : 0.3,
    rootMargin: '0px'
});

flipCards.forEach(card => {
    flipObserver.observe(card);
});

// iOS fallback - also check on scroll
if (isIOS && flipCards.length > 0) {
    let flipCheckInterval = null;

    function checkFlipCardsVisibility() {
        flipCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;

            if (isVisible && !card.classList.contains('flip-triggered')) {
                card.classList.add('flip-triggered');
                const delay = index * 200;

                setTimeout(() => {
                    flipCardOnIOS(card, true);
                }, delay);

                setTimeout(() => {
                    flipCardOnIOS(card, false);
                }, delay + 4000);
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (!flipCheckInterval) {
            flipCheckInterval = setTimeout(() => {
                checkFlipCardsVisibility();
                flipCheckInterval = null;
            }, 100);
        }
    });

    // Check on load
    setTimeout(checkFlipCardsVisibility, 500);
}

// Tab switching for Why Turkey / Why Izmir
const whyTabs = document.querySelectorAll('.why-tab');
const whyContents = document.querySelectorAll('.why-content');

whyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');

        // Remove active class from all tabs and contents
        whyTabs.forEach(t => t.classList.remove('active'));
        whyContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');

        // Show corresponding content
        const targetContent = document.getElementById(targetTab + 'Content');
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// ========================================
// FAQ ACCORDION FUNCTIONALITY
// ========================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ========================================
// TESTS SECTION INTERACTIVE
// ========================================

const testCatItems = document.querySelectorAll('.test-cat-item');
const testDetailContents = document.querySelectorAll('.test-detail-content');

testCatItems.forEach(item => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');

        // Remove active class from all items
        testCatItems.forEach(cat => cat.classList.remove('active'));
        testDetailContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked item
        item.classList.add('active');

        // Show corresponding content
        const targetContent = document.querySelector(`.test-detail-content[data-category="${category}"]`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// ========================================
// PROCESS TIMELINE SCROLL ANIMATION
// ========================================

const processSection = document.querySelector('.process-section');
const processStepIndicators = document.querySelectorAll('.process-step-indicator');
const processProgressLine = document.getElementById('processProgressLine');

if (processSection && processProgressLine) {
    function updateProcessOnScroll() {
        const sectionRect = processSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionHeight = sectionRect.height;
        const windowHeight = window.innerHeight;

        // Calculate scroll progress (0 to 1)
        // Start when section enters viewport, complete when it reaches center
        const scrollProgress = Math.max(0, Math.min(1,
            (windowHeight - sectionTop) / (windowHeight + sectionHeight / 2)
        ));

        // Update progress line width (0% to 100%)
        const progressWidth = scrollProgress * 100;
        processProgressLine.style.width = progressWidth + '%';

        // Update step indicators based on progress
        const totalSteps = processStepIndicators.length;
        processStepIndicators.forEach((indicator, index) => {
            const stepThreshold = index / (totalSteps - 1);
            if (scrollProgress >= stepThreshold) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Listen to scroll events
    window.addEventListener('scroll', updateProcessOnScroll);
    // Initial check
    updateProcessOnScroll();
}

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: Unobserve after animation
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for scroll animations
const elementsToAnimate = document.querySelectorAll(`
    .glance-card,
    .checkup-card,
    .expert-card,
    .process-card,
    .longevity-content,
    .data-content,
    .section-header
`);

elementsToAnimate.forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
});

// ========================================
// VIDEO PLAY BUTTON
// ========================================

const playBtn = document.getElementById('playBtn');
if (playBtn) {
    playBtn.addEventListener('click', () => {
        // You can replace this with actual video player logic
        alert('Video player coming soon! This will showcase our advanced healthcare facilities and treatments.');
    });
}

// ========================================
// COUNTER ANIMATION FOR STATS
// ========================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.ceil(current) + element.dataset.suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + element.dataset.suffix;
        }
    };

    updateCounter();
}

// Animate hero stats on load
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const h3 = entry.target.querySelector('h3');
            const text = h3.textContent;
            const match = text.match(/(\d+)(K?\+?%?)/);

            if (match) {
                const num = parseInt(match[1]);
                const suffix = match[2];
                h3.dataset.suffix = suffix;
                h3.textContent = '0' + suffix;
                animateCounter(h3, num, 2000);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statObserver.observe(stat);
});

// ========================================
// PARALLAX EFFECT FOR HERO
// ========================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ========================================
// SMOOTH BUTTON HOVER EFFECTS
// ========================================

document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ========================================
// FORM VALIDATION (if needed in future)
// ========================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
}

// ========================================
// LAZY LOADING IMAGES (OPTIONAL)
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for scroll and resize events
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Apply debounce to resize
const debouncedResize = debounce(() => {
    if (cardsTrack && sliderPrev && sliderNext) {
        updateSlider();
    }
}, 250);

window.addEventListener('resize', debouncedResize);

// ========================================
// PAGE LOAD ANIMATIONS
// ========================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger hero animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
});

// ========================================
// PREVENT FLASH OF UNSTYLED CONTENT
// ========================================

document.documentElement.classList.add('js-enabled');

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Add keyboard navigation for slider
if (sliderPrev && sliderNext) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            sliderPrev.click();
        } else if (e.key === 'ArrowRight') {
            sliderNext.click();
        }
    });
}

// Focus management for mobile menu
if (hamburger && navMenu) {
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });
}

// ========================================
// CLICK TO ACTION TRACKING
// ========================================

document.querySelectorAll('.btn-primary, .nav-cta, .card-link').forEach(button => {
    button.addEventListener('click', function(e) {
        // Add analytics tracking here
        console.log('CTA clicked:', this.textContent);
    });
});

// ========================================
// COOKIE CONSENT (OPTIONAL)
// ========================================

// Add cookie consent logic here if needed

// ========================================
// CONSOLE LOG FOR DEVELOPERS
// ========================================

console.log('%cTurkyCares Healthcare', 'font-size: 24px; font-weight: bold; color: #3F4F44;');
console.log('%cYour health, illuminated. 🏥', 'font-size: 14px; color: #8E9775;');
console.log('%cDeveloped with care for premium healthcare experience', 'font-size: 12px; color: #666;');

// ========================================
// QUIZ INTAKE FORM FUNCTIONALITY
// ========================================

let currentQuizStep = 1;
const totalQuizSteps = 10;
const quizForm = document.getElementById('quizForm');
const quizProgressBar = document.getElementById('quizProgressBar');
const currentStepSpan = document.getElementById('currentStep');
const quizSuccess = document.getElementById('quizSuccess');

// Configuration - Replace with your Google Apps Script Web App URL
// Deploy your Google Apps Script and paste the URL below
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxpHlTs8ouleP5v8R440vLeRGV6tayKtLuYVGVaEl6Z7YKIlT1zKgdJNZ0jTH0Jt2SxWQ/exec'; // Paste your deployed web app URL here
// Example: 'https://script.google.com/macros/s/AKfycbxxxxxxxxx/exec'
const NOTIFICATION_EMAIL = 'samahsan540@gmail.com'; // Your email for notifications

function updateQuizProgress() {
    const progress = (currentQuizStep / totalQuizSteps) * 100;
    if (quizProgressBar) {
        quizProgressBar.style.width = progress + '%';
    }
    if (currentStepSpan) {
        currentStepSpan.textContent = currentQuizStep;
    }
}

function showStep(step) {
    const steps = document.querySelectorAll('.quiz-step');
    steps.forEach(s => s.classList.remove('active'));

    const targetStep = document.querySelector(`.quiz-step[data-step="${step}"]`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    updateQuizProgress();
}

function validateCurrentStep() {
    const currentStepEl = document.querySelector(`.quiz-step[data-step="${currentQuizStep}"]`);
    if (!currentStepEl) return true;

    // Check for required inputs in current step
    const requiredInputs = currentStepEl.querySelectorAll('input[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (input.type === 'radio') {
            const radioGroup = currentStepEl.querySelectorAll(`input[name="${input.name}"]`);
            const isChecked = Array.from(radioGroup).some(r => r.checked);
            if (!isChecked) {
                isValid = false;
            }
        } else if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    if (!isValid) {
        // Show subtle shake animation
        currentStepEl.style.animation = 'none';
        setTimeout(() => {
            currentStepEl.style.animation = 'shake 0.5s ease';
        }, 10);
    }

    return isValid;
}

function nextStep() {
    // Special handling for step 2 (Travel Commitment)
    if (currentQuizStep === 2) {
        const travelCommitment = document.querySelector('input[name="travelCommitment"]:checked');
        if (travelCommitment && travelCommitment.value === 'no') {
            // Show polite exit message
            alert('Thank you for your interest. Our services are currently available only for patients willing to travel to Türkiye. Please feel free to reach out if your plans change.');
            return;
        }
    }

    if (!validateCurrentStep()) {
        return;
    }

    if (currentQuizStep < totalQuizSteps) {
        currentQuizStep++;
        showStep(currentQuizStep);

        // Scroll to quiz container
        const quizContainer = document.querySelector('.quiz-container');
        if (quizContainer) {
            quizContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function prevStep() {
    if (currentQuizStep > 1) {
        currentQuizStep--;
        showStep(currentQuizStep);
    }
}

// Form submission
if (quizForm) {
    quizForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateCurrentStep()) {
            return;
        }

        // Collect form data
        const formData = new FormData(quizForm);
        const data = {
            timestamp: new Date().toISOString(),
            zipCode: formData.get('zipCode'),
            openToTravel: formData.get('openToTravel') === 'yes' ? 'Yes' : 'No',
            travelCommitment: formData.get('travelCommitment'),
            passportStatus: formData.get('passportStatus'),
            primaryArea: formData.get('primaryArea'),
            timeline: formData.get('timeline'),
            stayLength: formData.get('stayLength'),
            packagePreference: formData.get('packagePreference'),
            budget: formData.get('budget'),
            dateOfBirth: formData.get('dob'),
            readiness: formData.get('readiness'),
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        };

        // Show loading state
        const submitBtn = quizForm.querySelector('.quiz-btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            // Send to Google Apps Script webhook
            if (WEBHOOK_URL && !WEBHOOK_URL.includes('YOUR_GOOGLE_APPS_SCRIPT')) {
                // Create form data for Google Apps Script compatibility
                const formBody = new URLSearchParams();
                formBody.append('data', JSON.stringify(data));

                // Send using fetch with form data
                fetch(WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formBody
                });

                console.log('Quiz data submitted successfully:', data);
            } else {
                // If no webhook configured, log to console for testing
                console.log('Quiz submission data:', data);
                console.log('To save to Excel and receive email notifications, configure the WEBHOOK_URL in script.js');
            }

            // Hide form and show success
            document.querySelectorAll('.quiz-step').forEach(step => {
                step.classList.remove('active');
            });

            if (quizSuccess) {
                quizSuccess.classList.add('active');
            }

            // Update progress to 100%
            if (quizProgressBar) {
                quizProgressBar.style.width = '100%';
            }

        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('There was an error submitting your application. Please try again or contact us directly.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Add shake animation CSS dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .quiz-input.error {
        border-color: #e74c3c !important;
    }
`;
document.head.appendChild(shakeStyle);

// Initialize quiz
updateQuizProgress();