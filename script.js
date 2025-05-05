// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      console.error("Target element not found:", this.getAttribute("href"));
    }
  });
});

// Intersection Observer for fade-in animations
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".project-card").forEach((card) => {
    card.style.opacity = 0;
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
  });

  const sections = document.querySelectorAll(".hero, .projects");

  const revealSection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    threshold: 0.1,
  });

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
} else {
  console.error("IntersectionObserver is not supported by this browser.");
}

// Function to handle the logo animation
const handleLogoAnimation = () => {
  const logo = document.getElementById("logo");
  const slider = logo.querySelector(".slider");
  let lastScrollY = window.scrollY;
  let isHovered = false;

  // Initial animation
  setTimeout(() => {
    slider.classList.remove("folded");
  }, 500);

  // Scroll event handler
  window.addEventListener("scroll", () => {
    if (!isHovered) {
      // Only fold if not being hovered
      if (window.scrollY > lastScrollY) {
        // Scrolling down
        slider.classList.add("folded");
      } else {
        // Scrolling up
        slider.classList.remove("folded");
      }
    }
    lastScrollY = window.scrollY;
  });

  // Hover events
  logo.addEventListener("mouseenter", () => {
    isHovered = true;
    slider.classList.remove("folded");
  });

  logo.addEventListener("mouseleave", () => {
    isHovered = false;
    if (window.scrollY > 0) {
      slider.classList.add("folded");
    }
  });
};

// Dark mode functionality
const handleDarkModeToggle = () => {
  const themeToggle = document.getElementById("theme-toggle");

  // Check for saved theme preference or use device preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Set initial theme
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  // Toggle theme when button is clicked
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
};

// Add scroll progress indicator to the DOM
const addScrollProgressIndicator = () => {
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  // Update progress bar width based on scroll position
  window.addEventListener("scroll", () => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolledPercentage = (window.scrollY / scrollableHeight) * 100;
    progressBar.style.width = `${scrolledPercentage}%`;
  });
};

// Enhanced hover animations for navigation links
const enhanceNavLinks = () => {
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "translateY(-2px)";
    });

    link.addEventListener("mouseleave", () => {
      link.style.transform = "translateY(0)";
    });
  });
};

// Initialize the animation when the page loads
document.addEventListener("DOMContentLoaded", () => {
  handleLogoAnimation();
  handleDarkModeToggle();
  addScrollProgressIndicator();
  enhanceNavLinks();

  // Mobile navigation menu toggle
  const menuIcon = document.querySelector(".menu-icon");
  const navLinks = document.querySelector(".nav-links");

  if (menuIcon && navLinks) {
    menuIcon.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
});

// Lazy Loading Implementation
document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll("img.lazy");
  const lazyImageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.remove("lazy");
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  });

  lazyImages.forEach((img) => lazyImageObserver.observe(img));
});
