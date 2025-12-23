const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const telefono = formData.get('telefono');
        const message = formData.get('message');

        // Configuración para FormSubmit
        const data = {
            name: name,
            email: email,
            telefono: telefono,
            message: message,
            _subject: `alquiler ${name}`,
            _template: 'table', // Hace que el correo se vea ordenado
            _captcha: 'false'
        };

        fetch('https://formsubmit.co/ajax/departamentoaldipau@gmail.com', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                showCustomAlert('¡Gracias por tu mensaje! Te contactaremos pronto.');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente o contáctanos por WhatsApp.');
            })
            .finally(() => {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
    });
}


const lightbox = document.getElementById('lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const galleryItems = document.querySelectorAll('.gallery-item img');


let mediaItems = [];


galleryItems.forEach((img, index) => {
    mediaItems.push({
        type: 'image',
        src: img.src,
        alt: img.alt
    });


    img.addEventListener('click', () => {
        openLightbox(index);
    });

    img.style.cursor = 'pointer';
});


const videoElement = document.querySelector('.video-wrapper video source');
if (videoElement) {
    mediaItems.push({
        type: 'video',
        src: videoElement.src
    });
}

let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    const videoInLightbox = lightboxContent.querySelector('video');
    if (videoInLightbox) {
        videoInLightbox.pause();
    }
}

function updateLightboxContent() {
    lightboxContent.innerHTML = '';
    const item = mediaItems[currentIndex];

    if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt || 'Gallery Image';
        lightboxContent.appendChild(img);
    } else if (item.type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '80vh';
        const source = document.createElement('source');
        source.src = item.src;
        source.type = 'video/mp4';
        video.appendChild(source);
        lightboxContent.appendChild(video);
    }
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % mediaItems.length;
    updateLightboxContent();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    updateLightboxContent();
}

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});


function showCustomAlert(message) {
    const modal = document.getElementById('message-modal');
    const msgElement = document.getElementById('modal-message');
    const okBtn = document.getElementById('modal-ok-btn');

    if (modal && msgElement && okBtn) {
        msgElement.textContent = message;
        modal.classList.add('active');


        okBtn.onclick = function () {
            modal.classList.remove('active');
        };
    } else {
        alert(message);
    }
}
const videoPlayer = document.getElementById('video-player');
if (videoPlayer) {
    // Responsive Poster Logic
    function updatePoster() {
        if (window.innerWidth <= 768) {
            videoPlayer.poster = "imagenes/foto-ingreso.png";
        } else {
            videoPlayer.poster = "imagenes/cartel-mina.jpg";
        }
    }

    // Initial check and listener for resize
    updatePoster();
    window.addEventListener('resize', updatePoster);

    videoPlayer.addEventListener('click', function () {
        if (this.paused) {
            this.play();
            enterFullscreen(this);
        }
    });

    videoPlayer.addEventListener('play', function () {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            enterFullscreen(this);
        }
    });

    // Fullscreen exit handler
    function onFullscreenChange() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            // Exited fullscreen
            videoPlayer.pause();
            videoPlayer.load(); // Resets video to show poster
        }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);

    function enterFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen().catch(err => console.log('Fullscreen blocked:', err));
        } else if (element.webkitRequestFullscreen) { /* Safari */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE11 */
            element.msRequestFullscreen();
        }
    }
}
