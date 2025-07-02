const appreciationMessages = [
  {
    quote: 'Inspirational, dedicated. We were lucky to have him.',
    source: 'Old boss (Giorgi)'
  },
  {
    quote: "I've learned more from Drew in the last year than I have in the rest of my education. His guidance is invaluable.",
    source: 'A Mentee (Alexandr)'
  },
  {
    quote: "I have watched Drew grow as a developer and I can't describe, how better he became. What took me 2 years, takes him 2 months",
    source: 'A Friend, Senior Fullstack Developer'
  },
  {
    quote: "Drew's vision and leadership have been the driving force behind our recent successes. An absolute pleasure to work with.",
    source: 'A Grateful Colleague (Brad)'
  },
  {
    quote: "His ability to solve complex problems under short time is simply unmatched. He's the calm in the storm",
    source: 'A Project Manager'
  },
  {
    quote: 'Always willing to lend a hand, no matter how busy he is. A true team player.',
    source: 'A colleague (Lisa)'
  }
];

function populateAppreciationWall() {
  const scrollerInner = document.getElementById('scroller-inner');
  // Duplicate messages for a seamless loop
  const messagesToDisplay = [...appreciationMessages, ...appreciationMessages];

  messagesToDisplay.forEach((msg) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'appreciation-item';
    messageElement.innerHTML = `
                        <p class="quote">"${msg.quote}"</p>
                        <p class="source">- ${msg.source}</p>
                    `;
    scrollerInner.appendChild(messageElement);
  });
}

// --- JAVASCRIPT FOR MANUAL AND AUTO SCROLLING ---
function initializeScroller() {
  const scroller = document.getElementById('scroller');
  if (!scroller) return;

  // Guard against starting if there's nothing to scroll
  if (scroller.scrollHeight <= scroller.clientHeight) {
    return;
  }

  let isHovering = false;
  let isInteracting = false;
  let inactivityTimer = null;
  const scrollSpeed = 0.4; // Adjust for desired speed

  function autoScroll() {
    // Pause auto-scrolling if user is hovering or has recently interacted
    if (!isHovering && !isInteracting) {
      scroller.scrollTop += scrollSpeed;
      // Check if we've scrolled to the halfway point (the start of the duplicated content)
      if (scroller.scrollTop >= scroller.scrollHeight / 2) {
        scroller.scrollTop = 0; // Reset to the top for a seamless loop
      }
    }
    requestAnimationFrame(autoScroll);
  }

  // Pause on hover
  scroller.addEventListener('mouseenter', () => {
    isHovering = true;
  });
  scroller.addEventListener('mouseleave', () => {
    isHovering = false;
  });

  // Pause on manual interaction (wheel or touch) and resume after a delay
  const onUserInteraction = () => {
    isInteracting = true;
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      isInteracting = false;
    }, 1000); // 3-second delay before resuming auto-scroll
  };

  scroller.addEventListener('wheel', onUserInteraction, { passive: true });
  scroller.addEventListener('touchstart', onUserInteraction, { passive: true });

  // Start the animation
  autoScroll();
}

// Populate the wall when the page loads, then initialize the scroller
document.addEventListener('DOMContentLoaded', () => {
  populateAppreciationWall();
  // FIX: Defer scroller initialization to the next frame to ensure
  // the browser has calculated the new scrollHeight.
  requestAnimationFrame(initializeScroller);
});
