/* ==========================================================================
   Premium Portfolio Website Logic
   Focus: Theme Caching, Scroll Spy, Mobile Navigation, Interactive Filters,
          IntersectionObservers, Carousel Slider, Custom Form Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Dark & Light Theme Logic
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve previous setting or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // ==========================================
  // 2. Mobile Navigation Menu Drawer
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    const isOpened = menuToggle.classList.contains('open');
    menuToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', !isOpened);
    
    // Prevent background scrolling when menu is open
    document.body.style.overflow = isOpened ? 'auto' : 'hidden';
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = 'auto';
    });
  });

  // ==========================================
  // 3. Scroll Spy & Header Styling
  // ==========================================
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header styling on scroll
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Floating Back To Top button visibility
    if (scrollY > 600) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Scroll Spy: Highlight active header link
    let currentActiveSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentActiveSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll);
  // Run on load in case page starts scrolled
  handleScroll();

  // ==========================================
  // 4. Scroll Reveal Animations (IntersectionObserver)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================
  // 5. Skills Progress Indicator (IntersectionObserver)
  // ==========================================
  const progressBars = document.querySelectorAll('.progress-bar');

  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = targetWidth;
        observer.unobserve(bar); // Trigger once
      }
    });
  }, {
    threshold: 0.5
  });

  progressBars.forEach(bar => {
    progressObserver.observe(bar);
  });

  // ==========================================
  // 6. Portfolio Projects Filtering
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Set active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Reset scale/opacity for transitions
        card.style.display = 'none';
        
        if (filterValue === 'all' || category === filterValue) {
          // Re-enable item display and trigger CSS keyframe animation implicitly
          card.style.display = 'flex';
          card.style.animation = 'projectFadeIn 0.4s ease forwards';
        }
      });
    });
  });

  // ==========================================
  // 7. Testimonials Carousel / Slider
  // ==========================================
  const track = document.getElementById('testimonials-track');
  const slides = Array.from(track.children);
  const nextButton = document.getElementById('slider-next');
  const prevButton = document.getElementById('slider-prev');
  const dotsContainer = document.getElementById('slider-dots');
  
  let currentSlideIndex = 0;
  let autoplayTimer;

  // Generate indicator dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function goToSlide(index) {
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }
    
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
    currentSlideIndex = index;
  }

  nextButton.addEventListener('click', () => {
    goToSlide(currentSlideIndex + 1);
    resetAutoplay();
  });

  prevButton.addEventListener('click', () => {
    goToSlide(currentSlideIndex - 1);
    resetAutoplay();
  });

  // Autoplay function
  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      goToSlide(currentSlideIndex + 1);
    }, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Start initial autoplay loop
  startAutoplay();

  // ==========================================
  // 8. Contact Form Client-side Validation
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    // Clean previous classes and indicators
    formStatus.className = 'form-status';
    formStatus.innerText = '';
    
    let isValid = true;
    const inputs = [nameInput, emailInput, subjectInput, messageInput];
    
    inputs.forEach(input => {
      input.style.borderColor = 'var(--card-border)';
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ef4444';
      }
    });

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
      isValid = false;
      emailInput.style.borderColor = '#ef4444';
      formStatus.innerText = 'Please check email formatting.';
      formStatus.classList.add('error');
      return;
    }

    if (!isValid) {
      formStatus.innerText = 'Please complete all required fields.';
      formStatus.classList.add('error');
      return;
    }

    // Show mock loading states
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending Message...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
    
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
      
      formStatus.innerText = 'Thank you! Your message was delivered successfully.';
      formStatus.classList.add('success');
      
      // Reset form
      contactForm.reset();
    }, 1800);
  });

});
