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

// Initialize the animation when the page loads
document.addEventListener("DOMContentLoaded", () => {
  handleLogoAnimation();

  // Mobile navigation menu toggle
  const menuIcon = document.querySelector(".menu-icon");
  const navLinks = document.querySelector(".nav-links");

  if (menuIcon && navLinks) {
    menuIcon.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Form submission handling
  const form = document.querySelector(".contact-form");
  const successMessage = document.querySelector(".form-success");
  const errorMessage = document.querySelector(".form-error");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });
        if (response.ok) {
          if (successMessage) successMessage.style.display = "block";
          form.reset();
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        if (errorMessage) errorMessage.style.display = "block";
      }
    });
  }
});
