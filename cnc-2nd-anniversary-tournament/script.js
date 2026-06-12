(function () {
    const storageKey = 'cnc-2nd-anniversary-language';
    const button = document.querySelector('[data-language-toggle]');
    const body = document.body;
    const html = document.documentElement;

    function applyLanguage(language) {
        const next = language === 'en' ? 'en' : 'ko';
        body.classList.toggle('lang-en', next === 'en');
        body.classList.toggle('lang-ko', next === 'ko');
        html.lang = next;
        try {
            localStorage.setItem(storageKey, next);
        } catch (e) {
            // Language persistence is optional.
        }
    }

    let initial = 'ko';
    try {
        const params = new URLSearchParams(window.location.search);
        initial = params.get('lang') || localStorage.getItem(storageKey) || initial;
    } catch (e) {}

    applyLanguage(initial);

    if (button) {
        button.addEventListener('click', function () {
            applyLanguage(body.classList.contains('lang-en') ? 'ko' : 'en');
        });
    }
})();
