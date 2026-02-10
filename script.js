/* ============================================
   오늘 한 줄 — Landing Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // Navigation scroll effect
  // ============================================
  const nav = document.getElementById('nav');

  const handleNavScroll = () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ============================================
  // Mobile menu toggle
  // ============================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
    });
  });

  // ============================================
  // Scroll-based animations (Intersection Observer)
  // ============================================
  const animateElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  animateElements.forEach((el) => observer.observe(el));

  // ============================================
  // Smooth scroll for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // Typing effect for mock card texts (subtle)
  // ============================================
  const mockCards = document.querySelectorAll('.mock-card');
  let currentCard = 0;

  const highlightCard = () => {
    mockCards.forEach(card => card.style.opacity = '0.7');
    if (mockCards[currentCard]) {
      mockCards[currentCard].style.opacity = '1';
      mockCards[currentCard].style.transition = 'opacity 0.5s ease';
    }
    currentCard = (currentCard + 1) % mockCards.length;
  };

  // Initialize all cards visible
  mockCards.forEach(card => {
    card.style.opacity = '1';
    card.style.transition = 'opacity 0.5s ease';
  });

  // Start subtle highlight animation after a delay
  setTimeout(() => {
    setInterval(highlightCard, 3000);
  }, 2000);

  // ============================================
  // Email subscription form
  // ============================================
  const emailForm = document.getElementById('emailForm');
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  const emailSubmitBtn = document.getElementById('emailSubmitBtn');
  const emailSuccess = document.getElementById('emailSuccess');
  const consentCheck = document.getElementById('consentCheck');
  const consentDetailBtn = document.getElementById('consentDetailBtn');
  const consentDetailBox = document.getElementById('consentDetailBox');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Toggle consent detail box
  consentDetailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    consentDetailBox.classList.toggle('show');
  });

  // Clear error on input
  emailInput.addEventListener('input', () => {
    emailError.textContent = '';
  });

  // Clear error when consent is checked
  consentCheck.addEventListener('change', () => {
    emailError.textContent = '';
  });

  emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Validation
    if (!email) {
      emailError.textContent = '이메일 주소를 입력해주세요.';
      emailInput.focus();
      return;
    }

    if (!validateEmail(email)) {
      emailError.textContent = '올바른 이메일 형식을 입력해주세요.';
      emailInput.focus();
      return;
    }

    // Consent check
    if (!consentCheck.checked) {
      emailError.textContent = '개인정보 수집·이용에 동의해주세요.';
      return;
    }

    // Check duplicate (from localStorage)
    const savedEmails = JSON.parse(localStorage.getItem('subscribedEmails') || '[]');
    if (savedEmails.includes(email)) {
      emailError.textContent = '이미 등록된 이메일이에요.';
      return;
    }

    // Show loading state
    emailSubmitBtn.classList.add('loading');
    emailError.textContent = '';

    // Call API to save email
    try {
      const response = await fetch('https://contact-capture.mirolab.kr/api/contacts', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ccs_eef21ae41ceee921081bf66b4990da2c21de1f0a0a746c13739b0c7564aa6edd',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: '',
          serviceName: '오늘 한 줄',
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      // Save to localStorage
      savedEmails.push(email);
      localStorage.setItem('subscribedEmails', JSON.stringify(savedEmails));

      // Show success
      emailForm.style.display = 'none';
      emailSuccess.classList.add('show');
    } catch (error) {
      emailError.textContent = '오류가 발생했어요. 잠시 후 다시 시도해주세요.';
    } finally {
      emailSubmitBtn.classList.remove('loading');
    }
  });
});
