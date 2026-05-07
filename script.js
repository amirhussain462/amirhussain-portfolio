// Premium Portfolio Interactions - Amir Hussain Shaik
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const button = document.querySelector('.mobile-menu-button');
  const menu = document.querySelector('.nav-links') || document.querySelector('.links');
  if (button && menu) {
    button.addEventListener('click', () => {
      menu.classList.toggle('open');
      button.setAttribute('aria-expanded', menu.classList.contains('open'));
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.classList.remove('open')));
  }
})();
