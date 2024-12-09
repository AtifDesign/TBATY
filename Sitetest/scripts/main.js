document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Mobile menu functionality
  const mobileMenu = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  mobileMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    // Add rotation animation to menu icon
    mobileMenu.style.transform = navMenu.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0)';
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.main-nav')) {
      navMenu.classList.remove('active');
    }
  });

  // Dropdown menu functionality
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const menu = dropdown.querySelector('.dropdown-menu');
    let timeoutId;

    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
      menu.style.display = 'block';
      requestAnimationFrame(() => {
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = 'translateY(0)';
      });
    });

    dropdown.addEventListener('mouseleave', () => {
      timeoutId = setTimeout(() => {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          if (menu.style.visibility === 'hidden') {
            menu.style.display = 'none';
          }
        }, 300);
      }, 100);
    });
  });

  // Wait for page load and add delay for hyperlink modification
  window.addEventListener('load', function() {
    setTimeout(() => {
      // Find and modify AoA website text in the specific description div
      const descriptionDiv = document.getElementById('sq_102_ariaDescription');
      if (descriptionDiv) {
        const span = descriptionDiv.querySelector('.sv-string-viewer');
        if (span && span.textContent.includes('AoA website')) {
          const text = span.textContent;
          const beforeText = text.substring(0, text.indexOf('AoA website'));
          const afterText = text.substring(text.indexOf('AoA website') + 'AoA website'.length);
          
          span.innerHTML = `${beforeText}<a href="https://associationofapprentices.org.uk/subscribe/apprentice-membership/" 
            target="_blank" style="color: #ff8c00; text-decoration: underline;">AoA website</a>${afterText}`;
        }
      }
    }, 1000); // 1 second delay
  });

  // Handle dropdown menus in mobile view
  if (window.innerWidth <= 767) {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdownMenu = toggle.nextElementSibling;
        dropdownMenu.classList.toggle('active');
        
        // Animate height
        if (dropdownMenu.classList.contains('active')) {
          dropdownMenu.style.height = dropdownMenu.scrollHeight + 'px';
        } else {
          dropdownMenu.style.height = '0';
        }
      });
    });
  }

  // Add Azure Application Insights tracking
  if (typeof appInsights !== 'undefined') {
    // Track page views
    appInsights.trackPageView();
    
    // Track custom events
    document.addEventListener('DOMContentLoaded', function() {
      // Track mobile menu interactions
      mobileMenu.addEventListener('click', () => {
        appInsights.trackEvent({name: 'MobileMenuToggle'});
        // Existing code...
      });
      
      // Track dropdown interactions
      dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          appInsights.trackEvent({name: 'DropdownToggle'});
          // Existing code...
        });
      });
    });
  }

  // Initial loading sequence with proper timing
  const animationSequence = () => {
    // 1. Logo animation (starts at 300ms)
    setTimeout(() => {
      document.querySelector('.logo').classList.add('visible');
    }, 300);

    // 2. Navigation links (starts at 800ms)
    setTimeout(() => {
      document.querySelectorAll('.nav-menu li').forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, index * 100); // Stagger each nav item by 100ms
      });
    }, 800);

    // 3. Section titles (starts at 1200ms)
    setTimeout(() => {
      document.querySelectorAll('section h1, section h2').forEach((title, index) => {
        setTimeout(() => {
          title.classList.add('visible');
        }, index * 200); // Stagger each title by 200ms
      });
    }, 1200);

    // 4. Content elements (starts at 1600ms)
    setTimeout(() => {
      document.querySelectorAll('.content-container > *').forEach((content, index) => {
        setTimeout(() => {
          content.classList.add('visible');
        }, index * 100); // Stagger each content element by 100ms
      });
    }, 1600);
  };

  // Start the animation sequence
  animationSequence();

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('fade-in')) {
          // Add delay for fade-in elements
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 200);
        } else {
          entry.target.classList.add('visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections and fade-in elements
  document.querySelectorAll('section, .fade-in').forEach(element => {
    observer.observe(element);
  });
}); 