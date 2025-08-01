// Enhanced code block functionality
document.addEventListener('DOMContentLoaded', function() {
    // Wait for highlight.js to be available
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }
    // Enhanced copy code functionality
    function enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre');
        
        codeBlocks.forEach((pre) => {
            // Skip if already enhanced
            if (pre.querySelector('.code-copy-button')) return;
            
            const code = pre.querySelector('code');
            if (!code) return;
            
            // Detect language from class
            const languageClass = Array.from(code.classList).find(cls => cls.startsWith('language-'));
            const language = languageClass ? languageClass.replace('language-', '') : '';
            
            // Add language attribute for CSS
            if (language) {
                pre.setAttribute('data-language', language);
            }
            
            // Create enhanced copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'code-copy-button';
            copyButton.innerHTML = `
                <svg viewBox="0 0 16 16" fill="currentColor">
                    <path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path>
                    <path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
                </svg>
                <span>Copied!</span>
            `;
            
            // Add copy functionality
            copyButton.addEventListener('click', async () => {
                const textToCopy = code.textContent || code.innerText;
                
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    
                    // Show success state
                    copyButton.classList.add('copied');
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        copyButton.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                    
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    
                    try {
                        document.execCommand('copy');
                        copyButton.classList.add('copied');
                        setTimeout(() => {
                            copyButton.classList.remove('copied');
                        }, 2000);
                    } catch (err) {
                        console.error('Fallback copy failed:', err);
                    }
                    
                    document.body.removeChild(textArea);
                }
            });
            
            // Add button to pre element
            pre.style.position = 'relative';
            pre.appendChild(copyButton);
        });
    }
    
    // Add line numbers to code blocks (optional)
    function addLineNumbers() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach((code) => {
            const pre = code.parentElement;
            
            // Skip if already has line numbers or if explicitly disabled
            if (pre.classList.contains('line-numbers') || pre.classList.contains('no-line-numbers')) {
                return;
            }
            
            // Check if it's a multi-line code block
            const lines = code.textContent.split('\n');
            if (lines.length > 3) {
                pre.classList.add('line-numbers');
                
                // Wrap each line in a span for line numbering
                const formattedLines = lines.map(line => {
                    const span = document.createElement('span');
                    span.className = 'line';
                    span.textContent = line || '\n'; // Preserve empty lines
                    return span;
                });
                
                // Clear existing content and add formatted lines
                code.innerHTML = '';
                formattedLines.forEach(span => code.appendChild(span));
            }
        });
    }
    
    // Initialize enhancements
    enhanceCodeBlocks();
    
    // Optional: Add line numbers (comment out if not desired)
    // addLineNumbers();
    
    // Re-run enhancements when new content is loaded dynamically
    const observer = new MutationObserver((mutations) => {
        let shouldEnhance = false;
        
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && (node.matches('pre') || node.querySelector('pre'))) {
                        shouldEnhance = true;
                    }
                });
            }
        });
        
        if (shouldEnhance) {
            enhanceCodeBlocks();
            // addLineNumbers();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});