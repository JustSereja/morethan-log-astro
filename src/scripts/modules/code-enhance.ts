declare global {
  interface Window {
    hljs?: {
      highlightAll(): void;
    };
  }
}

const CODE_SELECTOR = 'pre';
const COPY_BUTTON_CLASS = 'code-copy-button';

let observer: MutationObserver | null = null;
let initialized = false;

const highlightCodeBlocks = () => {
  if (window.hljs && typeof window.hljs.highlightAll === 'function') {
    window.hljs.highlightAll();
  }
};

const createCopyButton = (code: HTMLElement) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = COPY_BUTTON_CLASS;
  button.innerHTML = `
<svg viewBox="0 0 16 16" fill="currentColor">
  <path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path>
  <path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
</svg>
<span>Copied!</span>`;

  button.addEventListener('click', async () => {
    const textToCopy = code.textContent ?? '';

    try {
      await navigator.clipboard.writeText(textToCopy);
      button.classList.add('copied');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        button.classList.add('copied');
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }

      document.body.removeChild(textArea);
    }

    window.setTimeout(() => {
      button.classList.remove('copied');
    }, 2000);
  });

  return button;
};

const enhanceCodeBlocks = () => {
  const blocks = document.querySelectorAll<HTMLElement>(CODE_SELECTOR);

  blocks.forEach((pre) => {
    if (pre.dataset.enhanced === 'true') {
      return;
    }

    const code = pre.querySelector<HTMLElement>('code');
    if (!code) {
      return;
    }

    const languageClass = Array.from(code.classList).find((cls) => cls.startsWith('language-'));
    if (languageClass) {
      const language = languageClass.replace('language-', '');
      pre.setAttribute('data-language', language);
    }

    const button = createCopyButton(code);
    pre.style.position = 'relative';
    pre.appendChild(button);
    pre.dataset.enhanced = 'true';
  });
};

const observeDynamicContent = () => {
  if (observer) {
    return;
  }

  observer = new MutationObserver((mutations) => {
    const shouldEnhance = mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some((node) => {
        if (node.nodeType !== 1) {
          return false;
        }

        const element = node as Element;
        return element.matches?.(CODE_SELECTOR) || element.querySelector?.(CODE_SELECTOR);
      }),
    );

    if (shouldEnhance) {
      highlightCodeBlocks();
      enhanceCodeBlocks();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

export const initCodeEnhance = () => {
  if (typeof window === 'undefined') {
    return;
  }

  highlightCodeBlocks();
  enhanceCodeBlocks();

  if (!initialized) {
    initialized = true;
    observeDynamicContent();
  }
};

export const resetCodeEnhance = () => {
  initialized = false;
  if (observer) {
    observer.disconnect();
    observer = null;
  }
};
