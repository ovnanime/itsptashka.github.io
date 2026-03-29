'use strict';

// ================================================
// 1. МОБИЛЬНОЕ МЕНЮ (САЙДБАР)
// ================================================
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { 
    sidebar.classList.toggle("active"); 
  });
}

// ================================================
// 2. МОДАЛЬНОЕ ОКНО (ФОТО И ОБОРУДОВАНИЕ)
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  const photoModal = document.getElementById('photo-modal');
  const photoOverlay = document.getElementById('photo-overlay');
  const photoCloseBtn = document.getElementById('photo-close-btn');

  if (photoModal) {
    const modalImgTag = photoModal.querySelector('img'); 
    const zoomTriggers = document.querySelectorAll('#avatar-zoom-btn, [data-zoom-img]');

    zoomTriggers.forEach(trigger => {
      trigger.addEventListener('click', function() {
        const img = this.querySelector('img'); 
        if (img) {
          modalImgTag.src = img.src; 
          modalImgTag.alt = img.alt;
          photoModal.classList.add('active'); 
        }
      });
    });

    photoCloseBtn.addEventListener('click', () => photoModal.classList.remove('active'));
    photoOverlay.addEventListener('click', () => photoModal.classList.remove('active'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') photoModal.classList.remove('active');
    });
  }
});

// ================================================
// 3. ФИЛЬТРЫ ПОРТФОЛИО И СОХРАНЕНИЕ ВКЛАДКИ
// ================================================
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all" || selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

if (filterBtn.length > 0) {
  const savedPortfolioTab = localStorage.getItem('activePortfolioTab') || 'демо';
  let lastClickedBtn = filterBtn[0];

  for (let i = 0; i < filterBtn.length; i++) {
    let btnValue = filterBtn[i].innerText.toLowerCase();
    filterBtn[i].classList.remove("active");

    if (btnValue === savedPortfolioTab) {
      filterBtn[i].classList.add("active");
      lastClickedBtn = filterBtn[i];
      filterFunc(btnValue);
    }

    filterBtn[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      localStorage.setItem('activePortfolioTab', selectedValue);
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  }
}

// ================================================
// 4. УМНАЯ ЛОГИКА СЛАЙДЕРА (СТРЕЛОЧКИ)
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.portfolio-slider');
  
  const updateArrows = (slider) => {
    const viewport = slider.querySelector('.slider-viewport');
    const prevBtn = slider.querySelector('.prev-arrow');
    const nextBtn = slider.querySelector('.next-arrow');
    
    if (!viewport || !prevBtn || !nextBtn) return;

    if (viewport.scrollWidth <= viewport.clientWidth + 5) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = viewport.scrollLeft > 5 ? 'flex' : 'none';
      const isAtEnd = viewport.scrollLeft >= (viewport.scrollWidth - viewport.clientWidth - 5);
      nextBtn.style.display = isAtEnd ? 'none' : 'flex';
    }
  };

  sliders.forEach(slider => {
    const viewport = slider.querySelector('.slider-viewport');
    const prevBtn = slider.querySelector('.prev-arrow');
    const nextBtn = slider.querySelector('.next-arrow');

    if (prevBtn && nextBtn && viewport) {
      viewport.addEventListener('scroll', () => updateArrows(slider));
      window.addEventListener('resize', () => updateArrows(slider));

      prevBtn.addEventListener('click', () => {
        viewport.scrollBy({ left: -viewport.offsetWidth, behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', () => {
        viewport.scrollBy({ left: viewport.offsetWidth, behavior: 'smooth' });
      });
    }
  });

  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => { sliders.forEach(slider => updateArrows(slider)); }, 50);
    });
  });

  setTimeout(() => { sliders.forEach(slider => updateArrows(slider)); }, 200);
});

// ================================================
// 5. ГЛАВНОЕ МЕНЮ: СОХРАНЕНИЕ АКТИВНОЙ СТРАНИЦЫ
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  const navigationLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');
  const savedPage = localStorage.getItem('activePage') || 'about';

  function setActivePage(target) {
    pages.forEach(page => page.classList.remove('active'));
    navigationLinks.forEach(link => link.classList.remove('active'));

    const activePage = document.querySelector(`[data-page="${target}"]`);
    const activeLink = document.querySelector(`[data-nav-link][data-target="${target}"]`);

    if (activePage) activePage.classList.add('active');
    if (activeLink) activeLink.classList.add('active');
  }

  setActivePage(savedPage);

  navigationLinks.forEach(link => {
    link.addEventListener('click', function () {
      const target = this.dataset.target;
      localStorage.setItem('activePage', target);
      setActivePage(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
