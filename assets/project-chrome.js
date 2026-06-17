(function () {
    var script = document.currentScript;
    var projectName = script && script.getAttribute('data-project-name');
    if (!projectName) return;

    var style = document.createElement('style');
    style.textContent =
        '#project-nav-bar{position:sticky;top:0;z-index:50;margin-bottom:2rem;' +
        'background:#fff;border-bottom:1px solid #f3f4f6}' +
        '@media(prefers-color-scheme:dark){#project-nav-bar{background:#111827;border-bottom-color:#1f2937}}' +
        '#project-nav-bar nav{max-width:72rem;margin:0 auto;padding:1.25rem 1.5rem;' +
        'display:flex;gap:2rem;font-size:1.125rem;line-height:1.75rem;font-weight:500;color:#6b7280}' +
        '@media(prefers-color-scheme:dark){#project-nav-bar nav{color:#9ca3af}}' +
        '#project-nav-bar .nav-home{color:inherit;text-decoration:none;padding-bottom:.25rem;flex-shrink:0;' +
        'transition:color .15s}' +
        '#project-nav-bar .nav-home:hover{color:#111827}' +
        '@media(prefers-color-scheme:dark){#project-nav-bar .nav-home:hover{color:#fff}}' +
        '#project-nav-bar .nav-breadcrumb{display:flex;align-items:center;gap:.5rem;min-width:0;flex:1}' +
        '#project-nav-bar .nav-work{color:inherit;text-decoration:none;padding-bottom:.25rem;flex-shrink:0;' +
        'transition:color .15s}' +
        '#project-nav-bar .nav-work:hover{color:#111827}' +
        '@media(prefers-color-scheme:dark){#project-nav-bar .nav-work:hover{color:#fff}}' +
        '#project-nav-bar .nav-sep{color:#9ca3af;flex-shrink:0;user-select:none}' +
        '@media(prefers-color-scheme:dark){#project-nav-bar .nav-sep{color:#6b7280}}' +
        '#project-nav-bar .nav-current{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' +
        'color:#111827;border-bottom:2px solid #111827;padding-bottom:.25rem}' +
        '@media(prefers-color-scheme:dark){#project-nav-bar .nav-current{color:#fff;border-bottom-color:#fff}}' +
        '#project-back-btn{position:fixed;left:50%;z-index:40;display:inline-flex;align-items:center;gap:.5rem;' +
        'padding:.625rem 1.25rem;border-radius:9999px;font-size:.875rem;font-weight:500;text-decoration:none;' +
        'background:rgba(255,255,255,.92);color:#374151;border:1px solid #e5e7eb;' +
        'box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);' +
        'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);' +
        'transform:translateX(-50%) translateY(calc(-100% - 12px));opacity:0;pointer-events:none;' +
        'transition:transform .45s cubic-bezier(.34,1.56,.64,1),opacity .3s ease,box-shadow .2s ease}' +
        '@media(prefers-color-scheme:dark){#project-back-btn{background:rgba(31,41,55,.92);color:#e5e7eb;border-color:#374151}}' +
        '#project-back-btn:hover{color:#111827;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)}' +
        '@media(prefers-color-scheme:dark){#project-back-btn:hover{color:#fff}}' +
        '#project-back-btn.is-visible{transform:translateX(-50%) translateY(0);opacity:1;pointer-events:auto}';
    document.head.appendChild(style);

    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    var navBar = document.createElement('div');
    navBar.id = 'project-nav-bar';
    navBar.innerHTML =
        '<nav aria-label="Site">' +
        '<a href="index.html" class="nav-home">Home</a>' +
        '<div class="nav-breadcrumb" aria-label="Breadcrumb">' +
        '<a href="work.html" class="nav-work">Work</a>' +
        '<span class="nav-sep" aria-hidden="true">/</span>' +
        '<span class="nav-current" aria-current="page">' + escapeHtml(projectName) + '</span>' +
        '</div>' +
        '</nav>';

    var backBtn = document.createElement('a');
    backBtn.id = 'project-back-btn';
    backBtn.href = 'work.html';
    backBtn.setAttribute('aria-label', 'Back to project list');
    backBtn.innerHTML = '<span aria-hidden="true">&#8592;</span> Back';

    document.body.insertBefore(backBtn, script);
    document.body.insertBefore(navBar, backBtn);

    var scrollThreshold = 48;

    function positionBackButton() {
        backBtn.style.top = navBar.offsetHeight + 8 + 'px';
    }

    function updateBackButton() {
        if (window.scrollY > scrollThreshold) {
            backBtn.classList.add('is-visible');
        } else {
            backBtn.classList.remove('is-visible');
        }
    }

    positionBackButton();
    updateBackButton();

    window.addEventListener('resize', positionBackButton, { passive: true });
    window.addEventListener('scroll', updateBackButton, { passive: true });
})();
