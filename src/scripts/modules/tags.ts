export const highlightActiveTags = () => {
  const tagLinks = document.querySelectorAll<HTMLAnchorElement>('.tags__list a');
  if (!tagLinks.length) {
    return;
  }

  const currentUrl = window.location.href;
  tagLinks.forEach((link) => {
    const isActive = link.href === currentUrl;
    link.setAttribute('data-active', isActive ? 'true' : 'false');
  });
};
