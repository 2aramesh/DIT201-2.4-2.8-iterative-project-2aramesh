function daysInMonth(y, m){ return new Date(y, m + 1, 0).getDate(); }
function addMonthsClamp(d, n){
  const y = d.getFullYear(), m = d.getMonth() + n;
  const h = d.getHours(), mi = d.getMinutes(), s = d.getSeconds(), ms = d.getMilliseconds();
  const tmp = new Date(y, m, 1, h, mi, s, ms);
  const day = Math.min(d.getDate(), daysInMonth(tmp.getFullYear(), tmp.getMonth()));
  tmp.setDate(day);
  return tmp;
}

// Calendar-accurate months, days, hours until Dec 21 (00:00 local)
function datetimecalc(now = new Date()){
  let target = new Date(now.getFullYear(), 11, 6, 0, 0, 0, 0); // Dec=11
  if (now >= target) target = new Date(now.getFullYear() + 1, 11, 6, 0, 0, 0, 0);

  // count whole months
  let months = 0;
  let cursor = new Date(now);
  while (true){
    const next = addMonthsClamp(cursor, 1);
    if (next <= target){ months++; cursor = next; } else break;
  }

  // count whole days
  let days = 0;
  while (true){
    const next = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1,
                          cursor.getHours(), cursor.getMinutes(), cursor.getSeconds(), cursor.getMilliseconds());
    if (next <= target){ days++; cursor = next; } else break;
  }

  // remaining hours
  const diffMs = target - cursor;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  return {
    months: String(months).padStart(2, '0'),
    days:   String(days).padStart(2, '0'),
    hours:  String(hours).padStart(2, '0'),
  };
}
  
 function setDigits(prefix, value){ // value is "02", "15", etc.
  document.getElementById(prefix + "1").textContent = value[0];
  document.getElementById(prefix + "2").textContent = value[1];
}

function updateCountdown(){
  const { months, days, hours } = datetimecalc();
  setDigits("month", months);
  setDigits("day",   days);
  setDigits("hour",  hours);
}
// ----------Toggle active underline on menu click  ------------------
const menuItems = document.querySelectorAll('.menu-item');

// mark current page
const currentPage = window.location.pathname.split("/").pop() || "index.html";

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


//----------Flipcard -----------------------
updateCountdown();
setInterval(updateCountdown, 1000);
//----------Flipcard -----------------------

  function scrollDown() {
    window.scrollBy({
      top: window.innerHeight,  // scroll by one full screen
      behavior: "smooth"
    });
  }

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
    
    
function copyLink(element) {
  const linkToCopy = element.getAttribute('data-link');
  navigator.clipboard.writeText(linkToCopy)
    .then(() => {
      alert('✅ Link copied: ' + linkToCopy);
    })
    .catch(err => {
      console.error('Failed to copy link:', err);
    })
};

document.querySelectorAll('.read-more').forEach(button => {
  button.addEventListener('click', () => {
    // Get the next sibling .hidden-text
    const hiddenText = button.closest('.circle-button-wrapperind').nextElementSibling;
    
    if (hiddenText && hiddenText.classList.contains('hidden-text')) {
      hiddenText.classList.toggle('active'); // show/hide

      // Scroll into view smoothly
      hiddenText.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Toggle button text
      button.textContent = hiddenText.classList.contains('active') ? 'Read Less' : 'Read More';
    }
  });
});
