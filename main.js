/* ============================================================
   MUHAMMAD HASNAIN SIDDIQUI - Shared site behaviour
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ===== LOADER ===== */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('done'), 400);
    });
    // fallback in case load already fired
    setTimeout(() => loader.classList.add('done'), 2200);
  }

  /* ===== MOBILE MENU ===== */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      menuBtn.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.classList.remove('open');
    }));
  }

  /* Custom cursor is now handled purely via CSS (../images/cursor-arrow.png / cursor-hand.png) */

  /* ===== 3D TILT PORTRAIT ===== */
  const tiltCard = document.querySelector('.tilt-card');
  if (tiltCard && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const inner = tiltCard.querySelector('.tilt-card-inner');
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      inner.style.transform = `rotateY(${px * 16}deg) rotateX(${-py * 16}deg)`;
    });
    tiltCard.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  /* ===== CARD GLOW TRACKING ===== */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 100;
      const y = (e.clientY - rect.top) / rect.height * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  /* ===== SCROLL PROGRESS ===== */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    let ticking = false;
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ===== NAVBAR HIDE ON SCROLL ===== */
  let lastScroll = 0;
  const navbar = document.getElementById('navbar');
  if (navbar) {
    let navTicking = false;
    window.addEventListener('scroll', () => {
      if (navTicking) return;
      navTicking = true;
      requestAnimationFrame(() => {
        const cur = window.scrollY;
        if (cur > lastScroll && cur > 120) navbar.classList.add('hidden');
        else navbar.classList.remove('hidden');
        if (cur > 40) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        lastScroll = cur;
        navTicking = false;
      });
    }, { passive: true });
  }

  /* ===== FAQ ACCORDION ===== */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ===== THREE.JS GALAXY BACKGROUND ===== */
  if (window.THREE && document.getElementById('bg-canvas')) {
    const container = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particleCount = window.innerWidth < 768 ? 350 : 700;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const c1 = new THREE.Color('#4ecdc4'), c2 = new THREE.Color('#5b8db8'), c3 = new THREE.Color('#d4a84b');

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 35;
      const angle = Math.random() * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 8;
      positions[i*3] = Math.cos(angle) * radius + spread;
      positions[i*3+1] = (Math.random() - 0.5) * 15;
      positions[i*3+2] = Math.sin(angle) * radius + spread;
      const cc = Math.random();
      let mix;
      if (cc < 0.45) mix = c1.clone().lerp(c2, Math.random());
      else if (cc < 0.85) mix = c2.clone().lerp(c1, Math.random() * 0.4);
      else mix = c3.clone().lerp(c1, Math.random() * 0.3);
      colors[i*3] = mix.r; colors[i*3+1] = mix.g; colors[i*3+2] = mix.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.22, vertexColors: true, transparent: true, opacity: 0.45, depthWrite: false, sizeAttenuation: true });
    const galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);

    let mouseX3D = 0, mouseY3D = 0, time = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX3D = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY3D = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    (function animateScene() {
      requestAnimationFrame(animateScene);
      time += 0.001;
      galaxy.rotation.x += 0.0003;
      galaxy.rotation.y += 0.0005;
      galaxy.rotation.x += (mouseY3D * 0.01 - galaxy.rotation.x) * 0.01;
      galaxy.rotation.y += (mouseX3D * 0.01 - galaxy.rotation.y) * 0.01;
      const scale = 1 + Math.sin(time * 0.5) * 0.02;
      galaxy.scale.set(scale, scale, scale);
      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ===== SMOOTH SCROLL (Lenis) + GSAP ===== */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      const lenis = new Lenis({
        duration: 1.35,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
        infinite: false,
        autoResize: true,
      });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // Smooth anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const id = anchor.getAttribute('href');
          if (id.length > 1) {
            const target = document.querySelector(id);
            if (target) {
              e.preventDefault();
              lenis.scrollTo(target, { offset: -80, duration: 1.4 });
            }
          }
        });
      });
    }

    // Hero
    gsap.from('.hero-bg-text', { opacity: 0, scale: 1.4, duration: 1.8, ease: 'power4.out' });
    gsap.from('.hero-line', { opacity: 0, y: 50, stagger: 0.12, duration: 1, delay: 0.2, ease: 'power4.out' });
    gsap.from('.hero-sub', { opacity: 0, y: 30, duration: 1, delay: 0.6, ease: 'power3.out' });
    gsap.from('.hero-cta', { opacity: 0, y: 24, duration: 1, delay: 0.8, ease: 'power3.out' });

    // Generic reveal
    gsap.utils.toArray('.reveal').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        ease: 'power3.out'
      });
    });

    // Counters
    gsap.utils.toArray('.counter').forEach(counter => {
      const target = parseInt(counter.textContent, 10);
      if (!isNaN(target)) {
        gsap.from(counter, {
          textContent: 0, duration: 2.2, ease: 'power2.out', snap: { textContent: 1 },
          scrollTrigger: { trigger: counter, start: 'top 88%', toggleActions: 'play none none none' },
          onUpdate: function () { counter.textContent = Math.floor(counter.textContent) + (counter.dataset.suffix || ''); }
        });
      }
    });

    // Skill cubes
    gsap.utils.toArray('.skill-cube').forEach((cube, i) => {
      gsap.from(cube, {
        opacity: 0, scale: 0.5, rotationX: 160, duration: 1.1, delay: i * 0.12,
        scrollTrigger: { trigger: cube, start: 'top 85%', toggleActions: 'play none none none' },
        ease: 'back.out(1.6)'
      });
    });
  } else {
    // FIX: if GSAP/ScrollTrigger fail to load (CDN blocked, offline, ad-blocker, etc.)
    // every .reveal / .hero-line / .hero-sub / .hero-cta element was staying at
    // opacity:0 forever because nothing else ever revealed them - the whole page
    // could render blank. Fall back to plain CSS so content is always visible.
    document.querySelectorAll('.reveal, .hero-line, .hero-sub, .hero-cta, .skill-cube, .counter')
      .forEach(el => el.classList.add('visible'));
  }
});
