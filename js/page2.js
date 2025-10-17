 
// ----------Toggle active underline on menu click  ------------------
const menuItems = document.querySelectorAll('.menu-item');

// mark current page
const currentPage = window.location.pathname.split("/").pop() || "page1.html";

menuItems.forEach(item => {
  const href = item.getAttribute("href");
  if (href === currentPage) {
    item.classList.add("current"); // default underline for current page
  }

  // click to activate other menu items
  item.addEventListener('click', () => {
    menuItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });

  // hover underline (skip current page)
  item.addEventListener('mouseenter', () => {
    if (!item.classList.contains('current') && !item.classList.contains('active')) {
      item.classList.add('hover-active');
    }
  });

  item.addEventListener('mouseleave', () => {
    item.classList.remove('hover-active');
  });
});	  
// ----------Toggle active underline on menu click  ------------------

//-----------search bar -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  if (!searchInput || !searchBtn) return;

  searchBtn.style.cursor = "pointer"; // make it clickable

  searchBtn.addEventListener("click", () => {
    const term = searchInput.value.trim();
    removeHighlights();
    if (term) highlightSearch(term);
  });
});

function highlightSearch(term) {
  const regex = new RegExp(term, "gi");
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const nodesToProcess = [];

  while (true) {
    const node = walker.nextNode();
    if (!node) break;
    if (node.parentNode.closest(".search-container")) continue;
    nodesToProcess.push(node);
  }

  nodesToProcess.forEach((textNode) => {
    const text = textNode.nodeValue;
    if (regex.test(text)) {
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      text.replace(regex, (match, offset) => {
        if (offset > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, offset)));
        }
        const span = document.createElement("span");
        span.className = "highlight";
        span.textContent = match;
        fragment.appendChild(span);
        lastIndex = offset + match.length;
      });

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      textNode.parentNode.replaceChild(fragment, textNode);
    }
  });
}

function removeHighlights() {
  document.querySelectorAll(".highlight").forEach(span => {
    span.replaceWith(document.createTextNode(span.textContent));
  });
}

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const term = searchInput.value.trim();
  removeHighlights();
  if (term) highlightSearch(term);
});

// Trigger search when pressing Enter
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent form submission if inside a form
    const term = searchInput.value.trim();
    removeHighlights();
    if (term) highlightSearch(term);
  }
});

//--------------end of search bar
document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
  const track = wrapper.querySelector('.carousel-track');
  const items = Array.from(wrapper.querySelectorAll('.carousel-item-wrapper'));
  const radios = Array.from(wrapper.querySelectorAll('.carousel-nav input'));
  const prevBtn = wrapper.querySelector('.carousel-arrow.left');
  const nextBtn = wrapper.querySelector('.carousel-arrow.right');
  const container = wrapper.querySelector('.carousel-container');

  const hoverOverlay = wrapper.querySelector('.hover-overlay');
  const hoverOverlayInner = wrapper.querySelector('.hover-overlay-inner');

  const itemSize = parseFloat(getComputedStyle(items[0]).width);
  const overlap = parseFloat(getComputedStyle(items[1]).marginLeft) * -1;
  const itemSpacing = itemSize - overlap;
  const total = items.length;

  let centerIndex = 0;

  function renderCarousel() {
    const leftIndex = (centerIndex - 1 + total) % total;
    const rightIndex = (centerIndex + 1) % total;

    // Reorder children
    track.innerHTML = "";
    [leftIndex, centerIndex, rightIndex].forEach(idx => {
      track.appendChild(items[idx]);
    });

    // Active class
    items.forEach(item => item.classList.remove('active'));
    items[centerIndex].classList.add('active');

    // Reset position
    track.style.transform = "translateX(0)";

    // Sync radios
    radios.forEach(r => r.checked = Number(r.dataset.index) === centerIndex);
  }

  function updateCarousel(newCenter) {
    centerIndex = (newCenter + total) % total;
    renderCarousel();
  }

  // Buttons
  prevBtn.addEventListener('click', () => updateCarousel(centerIndex - 1));
  nextBtn.addEventListener('click', () => updateCarousel(centerIndex + 1));

  // Radios
  radios.forEach(radio => {
    radio.addEventListener('click', () => {
      const idx = Number(radio.dataset.index);
      updateCarousel(idx);
    });
  });

  // Hover pop-out
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const rect = item.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      const top = rect.top - wrapperRect.top;
      const left = rect.left - wrapperRect.left;

      hoverOverlay.style.display = 'block';
      hoverOverlay.style.width = itemSize + 'px';
      hoverOverlay.style.height = itemSize + 'px';
      hoverOverlay.style.top = top - (itemSize * 0.25) + 'px';
      hoverOverlay.style.left = left - (itemSize * 0.25) + 'px';
      hoverOverlay.style.transform = 'scale(1.5)';

      hoverOverlayInner.style.backgroundImage =
        item.querySelector('.carousel-item-inner').style.backgroundImage;

      container.style.overflow = 'visible';
    });

    item.addEventListener('mouseleave', () => {
      hoverOverlay.style.display = 'none';
      hoverOverlay.style.transform = 'scale(1)';
      container.style.overflow = 'hidden';
    });
  });

  renderCarousel(); // initialize this wrapper
});


/*----------------------------------------------*/

    const globeIcon = document.getElementById('globeIcon');
    const langOptions = document.getElementById('langOptions');
    const langDivs = document.querySelectorAll('.language');

    // Toggle language menu
    globeIcon.addEventListener('click', () => {
      langOptions.style.display = langOptions.style.display === 'block' ? 'none' : 'block';
    });

    // Switch language
    langOptions.querySelectorAll('div').forEach(option => {
      option.addEventListener('click', () => {
        const selectedLang = option.getAttribute('data-lang');

        langDivs.forEach(div => div.classList.remove('active'));
        document.getElementById('lang-' + selectedLang).classList.add('active');

        langOptions.style.display = 'none';
      });
    });

    // Click outside closes menu
    document.addEventListener('click', function(e) {
      if (!globeIcon.contains(e.target) && !langOptions.contains(e.target)) {
        langOptions.style.display = 'none';
      }
    });