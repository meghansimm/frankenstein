document.addEventListener('DOMContentLoaded', function() {
  const fadeDiv = document.getElementById('guide');
  const initialOpacity = 1; // Starting opacity
  const fadeStartScroll = 0; // Scroll position (in pixels) where fading begins
  const fadeEndScroll = 100; // Scroll position (in pixels) where fading ends (opacity becomes 0)

  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;

    if (scrollPosition >= fadeStartScroll && scrollPosition <= fadeEndScroll) {
      // Calculate opacity based on scroll position
      const opacity = initialOpacity - ((scrollPosition - fadeStartScroll) / (fadeEndScroll - fadeStartScroll));
      fadeDiv.style.opacity = opacity;
    } else if (scrollPosition > fadeEndScroll) {
      // Ensure opacity is 0 after fading ends
      fadeDiv.style.opacity = 0;
    } else {
      // Ensure opacity is 1 before fading starts
      fadeDiv.style.opacity = initialOpacity;
    }
  });
});