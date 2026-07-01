    document.querySelector('.sroll-banner .close-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        document.querySelector('.sroll-banner').style.display = 'none';
    });