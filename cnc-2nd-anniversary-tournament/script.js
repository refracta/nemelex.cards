(function () {
    const storageKey = 'cnc-2nd-anniversary-language';
    const button = document.querySelector('[data-language-toggle]');
    const body = document.body;
    const html = document.documentElement;

    function normalizeLanguage(language) {
        const value = String(language || '').toLowerCase();
        if (value === 'ko' || value.startsWith('ko-')) {
            return 'ko';
        }
        if (value === 'en' || value.startsWith('en-')) {
            return 'en';
        }
        return '';
    }

    function browserLanguage() {
        const languages = Array.isArray(navigator.languages) && navigator.languages.length
            ? navigator.languages
            : [navigator.language];
        for (const language of languages) {
            const normalized = normalizeLanguage(language);
            if (normalized) {
                return normalized;
            }
        }
        return 'ko';
    }

    function applyLanguage(language, persist) {
        const next = language === 'en' ? 'en' : 'ko';
        body.classList.toggle('lang-en', next === 'en');
        body.classList.toggle('lang-ko', next === 'ko');
        html.lang = next;
        if (!persist) {
            return;
        }
        try {
            localStorage.setItem(storageKey, next);
        } catch (e) {
            // Language persistence is optional.
        }
    }

    let initial = browserLanguage();
    let shouldPersist = false;
    try {
        const params = new URLSearchParams(window.location.search);
        const queryLanguage = normalizeLanguage(params.get('lang'));
        const storedLanguage = normalizeLanguage(localStorage.getItem(storageKey));
        if (queryLanguage) {
            initial = queryLanguage;
            shouldPersist = true;
        } else if (storedLanguage) {
            initial = storedLanguage;
        }
    } catch (e) {}

    applyLanguage(initial, shouldPersist);

    if (button) {
        button.addEventListener('click', function () {
            applyLanguage(body.classList.contains('lang-en') ? 'ko' : 'en', true);
        });
    }
})();
