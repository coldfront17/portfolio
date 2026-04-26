document.addEventListener('DOMContentLoaded', function () {
    var style = document.createElement('style');
    style.textContent =
        '#lb-btn{position:relative;margin-top:1rem;width:3rem;height:3rem;font-size:1.25rem;' +
        'background:rgba(255,255,255,0.15);backdrop-filter:blur(4px);' +
        'color:#fff;border:none;border-radius:50%;cursor:pointer;' +
        'display:flex;align-items:center;justify-content:center;flex-shrink:0;}' +
        '@media(min-width:768px){#lb-btn{position:fixed;top:1.25rem;right:1.25rem;' +
        'width:2.5rem;height:2.5rem;font-size:1.1rem;margin-top:0;}}';
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.style.cssText =
        'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.80);z-index:9999;' +
        'flex-direction:column;align-items:center;justify-content:center;padding:1rem;';

    var img = document.createElement('img');
    img.style.cssText =
        'max-height:80vh;max-width:90vw;border-radius:0.75rem;object-fit:contain;' +
        'box-shadow:0 25px 50px rgba(0,0,0,0.5);display:block;cursor:zoom-out;';

    var btn = document.createElement('button');
    btn.id = 'lb-btn';
    btn.innerHTML = '&#x2715;';
    btn.setAttribute('aria-label', 'Close');

    overlay.appendChild(img);
    overlay.appendChild(btn);
    document.body.appendChild(overlay);

    function open(src, alt) {
        img.src = src;
        img.alt = alt || '';
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function close() {
        overlay.style.display = 'none';
        img.src = '';
        document.body.style.overflow = '';
    }

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
    });

    img.addEventListener('click', function (e) {
        e.stopPropagation();
        close();
    });

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        close();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
    });

    document.querySelectorAll('article img').forEach(function (el) {
        el.style.cursor = 'zoom-in';
        el.addEventListener('click', function () { open(el.src, el.alt); });
    });
});
