document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const img = new Image();
    img.src = "SistemaContable/frontend/scripts/images/baseIndex.png";
    img.style.position = 'fixed';
    img.style.top = '0';
    img.style.left = '0';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.zIndex = '-1';
    img.style.objectFit = 'cover';
    body.appendChild(img);
});