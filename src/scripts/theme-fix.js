// Fix theme switcher to persist state
window.addEventListener('load', function() {
    // Override the setThemeMode function to add localStorage support
    const originalSetThemeMode = window.setThemeMode || function() {};
    
    window.setThemeMode = function(box, condition) {
        const html = document.querySelector('html');
        if (condition) {
            html.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
        
        // Update button states
        if (box && box.forEach) {
            box.forEach((el) => {
                el.setAttribute('data-mode', condition ? 'light' : 'dark');
            });
        }
    };
    
    // Check stored theme on load
    const storedTheme = localStorage.getItem('theme');
    const isDarkMode = storedTheme ? storedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeSwitchers = document.querySelectorAll('.theme-mode-switcher');
    
    window.setThemeMode(themeSwitchers, isDarkMode);
    
    // Re-attach click handlers with the new setThemeMode
    themeSwitchers.forEach((button) => {
        // Remove existing listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new listener
        newButton.addEventListener('click', () => {
            const darkMode = document.querySelector('html').classList.contains('dark-mode');
            window.setThemeMode(document.querySelectorAll('.theme-mode-switcher'), !darkMode);
        });
    });
});