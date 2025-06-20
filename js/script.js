document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize counter observer
    initCounterAnimation();

    // Insurance popup handlers
    const verifyBtn = document.getElementById('verify-insurance-btn');
    const popup = document.getElementById('insurance-popup');
    const closeBtn = document.getElementById('close-popup');

    if (verifyBtn && popup && closeBtn) {
        verifyBtn.addEventListener('click', () => {
            popup.style.display = 'flex';
            setTimeout(() => popup.classList.add('show'), 10);
        });

        closeBtn.addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => popup.style.display = 'none', 300);
        });

        window.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('show');
                setTimeout(() => popup.style.display = 'none', 300);
            }
        });
    }

    // Load Calendly Widget
    loadCalendlyWidget();

    // Form submission popup handler
    const form = document.getElementById('consultation-form');
    const popup1 = document.getElementById('popup1');

    if (form && popup1) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(form);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        popup1.style.display = 'block';
                        form.reset();
                    } else {
                        alert("Something went wrong. Please try again.");
                    }
                })
                .catch(error => {
                    alert("Network error. Try again later.");
                });
        });
    }
});

// Counter animation setup
function initCounterAnimation() {
    const statContainer = document.querySelector('.stats-container');
    if (!statContainer) return;

    document.querySelectorAll('.stat-counter').forEach(counter => {
        counter.textContent = '0';
    });

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statContainer.classList.contains('counted')) {
                    startCounterAnimation();
                    statContainer.classList.add('counted');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        }
    );

    observer.observe(statContainer);
}

function startCounterAnimation() {
    const counters = document.querySelectorAll('.stat-counter');
    const duration = 1500;
    const start = performance.now();

    function animate(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target, 10) || 0;
            const value = Math.floor(progress * target);
            const suffix = counter.dataset.target === '50' ? 'K+' : '+';
            counter.textContent = value + (progress === 1 ? suffix : '');

            if (counter.parentElement) {
                counter.parentElement.classList.toggle('animating', progress < 1);
            }
        });

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// Load Calendly Widget
function loadCalendlyWidget() {
    // Only load if not already loaded
    if (window.CalendlyInitialized) return;
    window.CalendlyInitialized = true;

    var calendlyScript = document.createElement('script');
    calendlyScript.src = 'https://assets.calendly.com/assets/external/widget.js';
    calendlyScript.async = true;

    calendlyScript.onload = function () {
        // Initialize only once
        const calendlyEmbed = document.getElementById('calendly-embed');
        if (calendlyEmbed && !calendlyEmbed.hasChildNodes()) {
            Calendly.initInlineWidget({
                url: 'https://calendly.com/tibbi/30min?primary_color=288b84',
                parentElement: calendlyEmbed,
                prefill: {},
                utm: {}
            });
        }
    };

    document.head.appendChild(calendlyScript);
}
