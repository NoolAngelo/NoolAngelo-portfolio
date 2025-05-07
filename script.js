// Utility functions
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

const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Smooth scroll for navigation links with improved performance
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const duration = 800; // ms
        const ease = easeOutQuart(Math.min(timeElapsed / duration, 1));
        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      requestAnimationFrame(animation);
    } else {
      console.error("Target element not found:", this.getAttribute("href"));
    }
  });
});

// Enhanced Intersection Observer for fade-in animations with optimized thresholds
if ("IntersectionObserver" in window) {
  const createIntersectionObserver = (options = {}) => {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      }
    );
  };

  const fadeObserver = createIntersectionObserver();
  const sectionObserver = createIntersectionObserver({ threshold: 0.1 });

  document
    .querySelectorAll(
      ".project-card, .skill-card, .testimonial-card, .process-step"
    )
    .forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition =
        "opacity 0.6s var(--transition-smooth), transform 0.6s var(--transition-smooth)";
      fadeObserver.observe(element);
    });

  document
    .querySelectorAll(
      ".hero, .projects, .testimonials, .skills-showcase, .process, .hire-me, .cta-section"
    )
    .forEach((section) => sectionObserver.observe(section));
} else {
  document
    .querySelectorAll(
      ".project-card, .skill-card, .hero, .projects, .testimonials, .process-step"
    )
    .forEach((el) => {
      el.classList.add("visible");
    });
}

// Enhanced scroll progress indicator with throttled updates for better performance
const handleScroll = throttle(() => {
  const scrollProgressBar = document.querySelector(".scroll-progress");
  if (scrollProgressBar) {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolledPercentage = (window.scrollY / scrollableHeight) * 100;
    scrollProgressBar.style.width = `${Math.min(scrolledPercentage, 100)}%`;
  }
}, 16);

window.addEventListener("scroll", handleScroll, { passive: true });

// Enhanced dark mode toggle with smooth transitions and user preference detection
const handleDarkModeToggle = () => {
  const themeToggle = document.getElementById("theme-toggle");
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  if (!metaThemeColor) {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#ffffff";
    document.head.appendChild(meta);
  }

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    if (metaThemeColor) {
      metaThemeColor.content = theme === "dark" ? "#181818" : "#ffffff";
    }

    document.body.classList.add("theme-transition");
  };

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDark) {
    setTheme("dark");
  } else {
    setTheme("light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      setTheme(newTheme);

      themeToggle.classList.add("theme-toggle-animation");
      setTimeout(() => {
        themeToggle.classList.remove("theme-toggle-animation");
      }, 500);
    });
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });
};

// Enhanced mobile navigation with accessibility improvements
const initMobileNavigation = () => {
  const menuIcon = document.querySelector(".menu-icon");
  const navLinks = document.querySelector(".nav-links");

  if (menuIcon && navLinks) {
    menuIcon.setAttribute("aria-expanded", "false");
    menuIcon.setAttribute("aria-controls", "nav-links");
    navLinks.setAttribute("id", "nav-links");

    menuIcon.addEventListener("click", () => {
      const isExpanded = menuIcon.getAttribute("aria-expanded") === "true";
      menuIcon.setAttribute("aria-expanded", !isExpanded);

      navLinks.classList.toggle("active");
      document.body.classList.toggle("menu-open");

      if (!isExpanded) {
        setTimeout(() => {
          navLinks.querySelector("a").focus();
        }, 100);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        document.body.classList.remove("menu-open");
        menuIcon.setAttribute("aria-expanded", "false");
        menuIcon.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (
        navLinks.classList.contains("active") &&
        !menuIcon.contains(e.target) &&
        !navLinks.contains(e.target)
      ) {
        navLinks.classList.remove("active");
        document.body.classList.remove("menu-open");
        menuIcon.setAttribute("aria-expanded", "false");
      }
    });

    navLinks.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && navLinks.classList.contains("active")) {
        const focusableElements = navLinks.querySelectorAll("a, button");
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }
};

// Enhanced project filtering with smooth animations
const initProjectFiltering = () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project-case");

  if (filterButtons.length && projects.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        projects.forEach((project) => {
          if (!project.dataset.height) {
            project.dataset.height = project.offsetHeight + "px";
          }

          if (
            filter === "all" ||
            project.getAttribute("data-category") === filter
          ) {
            project.style.display = "block";
            project.style.height = project.dataset.height;

            setTimeout(() => {
              project.style.opacity = "1";
              project.style.transform = "translateY(0)";
            }, 50 * Array.from(projects).indexOf(project));
          } else {
            project.style.opacity = "0";
            project.style.transform = "translateY(20px)";

            setTimeout(() => {
              project.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }
};

// Initialize all functionalities when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  handleDarkModeToggle();
  initMobileNavigation();
  initProjectFiltering();
  initLazyLoading();

  const skillCards = document.querySelectorAll(".skill-card");
  if (skillCards.length > 0) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              const card = entry.target;
              const progressBar = card.querySelector(".skill-progress");
              const percent = progressBar.style.width;

              progressBar.style.setProperty("--progress-width", percent);
              card.classList.add("animated");
            }, 150 * index);

            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    skillCards.forEach((card) => {
      skillObserver.observe(card);
    });
  }

  if ("IntersectionObserver" in window) {
    const lazyImages = document.querySelectorAll("img.lazy");

    if (lazyImages.length > 0) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;

              if (img.dataset.src) {
                const tempImg = new Image();
                tempImg.onload = () => {
                  img.src = img.dataset.src;
                  img.classList.add("lazy-loaded");
                };
                tempImg.src = img.dataset.src;

                delete img.dataset.src;
              }

              imageObserver.unobserve(img);
            }
          });
        },
        {
          rootMargin: "200px 0px",
          threshold: 0.01,
        }
      );

      lazyImages.forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      const criticalImages = document.querySelectorAll(
        'img[data-critical="true"]'
      );
      criticalImages.forEach((img) => {
        if (img.dataset.src) {
          const tempImg = new Image();
          tempImg.src = img.dataset.src;
        }
      });
    });
  }
});

// Add page transition effects for smoother navigation
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-transition");

  document.querySelectorAll("a").forEach((link) => {
    if (
      link.hostname === window.location.hostname &&
      !link.getAttribute("href").startsWith("#") &&
      link.getAttribute("target") !== "_blank"
    ) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute("href");

        document.body.classList.add("page-exit");

        setTimeout(() => {
          window.location.href = target;
        }, 300);
      });
    }
  });

  window.addEventListener("pageshow", () => {
    document.body.classList.add("page-enter");
  });
});

// Web vitals monitoring
window.addEventListener("load", () => {
  setTimeout(() => {
    const paintEntries = performance.getEntriesByType("paint");
    const fcp = paintEntries.find(
      (entry) => entry.name === "first-contentful-paint"
    );
    if (fcp) {
      console.log("First Contentful Paint:", Math.round(fcp.startTime), "ms");
    }

    if ("PerformanceObserver" in window) {
      let lcpValue = 0;
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        lcpValue = lastEntry.startTime;
        console.log("Largest Contentful Paint:", Math.round(lcpValue), "ms");
      });

      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

      setTimeout(() => {
        lcpObserver.disconnect();
      }, 5000);
    }
  }, 0);
});

// Enhanced lazy loading
const initLazyLoading = () => {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.add("lazy-loaded");
              imageObserver.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.01,
      }
    );

    document
      .querySelectorAll("img.lazy")
      .forEach((img) => imageObserver.observe(img));
  }
};
