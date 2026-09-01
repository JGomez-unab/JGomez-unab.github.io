const navToggle=document.querySelector('.nav-toggle');const nav=document.querySelector('#site-nav');navToggle.addEventListener('click',()=>{const open=navToggle.getAttribute('aria-expanded')==='true';navToggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});const year=document.querySelector('#updated-year');if(year)year.textContent=new Date().getFullYear();

const leadAuthors={
  J17:'M. Bravo-López',J16:'C. Muñoz-Olivar',J14:'C. Muñoz-Olivar',J13:'B. Oliveira',
  J12:'J. S. Gómez',J11:'C. Muñoz-Olivar',J10:'R. Pérez',J9:'A. Navas',J8:'J. S. Gómez',
  J7:'M. Martínez-Gómez',J6:'E. Rute',J2:'J. S. Gómez',J1:'J. S. Gómez',
  C12:'D. Montoya',C11:'J. S. Gómez',C10:'N. Yasic',C9:'K. Chamorro-Caceres',
  C8:'S. Intriago',C7:'A. Navas',C6:'A. Navas',C5:'E. Espina',C4:'H. K. Morales-Paredes',
  C3:'J. S. Gómez',C2:'E. Espina',C1:'J. S. Gómez'
};

document.querySelectorAll('.bibliography > a, .bibliography > .citation').forEach((entry)=>{
  const id=entry.querySelector(':scope > span')?.textContent.trim();
  const details=entry.querySelector(':scope > div');
  if(!id||!details||!leadAuthors[id]||details.querySelector('em'))return;
  const author=document.createElement('em');author.textContent=`Lead author: ${leadAuthors[id]}`;
  const doi=details.querySelector('small');details.insertBefore(author,doi||null);
});

const homeFooter=document.querySelector('#home-footer');
if(homeFooter&&window.matchMedia('(pointer:fine)').matches&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
  window.addEventListener('pointermove',(event)=>{
    const position=Math.max(0,Math.min(1,event.clientX/window.innerWidth));
    homeFooter.style.setProperty('--panel-angle',`${-60+(position*120)}deg`);
    homeFooter.style.setProperty('--sun-shift',`${position*376}px`);
  });
  document.documentElement.addEventListener('mouseleave',()=>{
    homeFooter.style.setProperty('--panel-angle','-42deg');
    homeFooter.style.setProperty('--sun-shift','0px');
  });
}

document.querySelectorAll('.student-modal[data-profile]').forEach((studentModal)=>{
  const profile=studentModal.dataset.profile;
  document.querySelectorAll(`[data-student-profile="${profile}"]`).forEach((link)=>{
    link.addEventListener('click',(event)=>{
      if(typeof studentModal.showModal!=='function')return;
      event.preventDefault();
      studentModal.showModal();
    });
  });
  studentModal.querySelector('.student-modal-close')?.addEventListener('click',()=>studentModal.close());
  studentModal.querySelectorAll('a').forEach((link)=>link.addEventListener('click',()=>studentModal.close()));
  studentModal.addEventListener('click',(event)=>{
    if(event.target!==studentModal)return;
    const bounds=studentModal.getBoundingClientRect();
    const inside=event.clientX>=bounds.left&&event.clientX<=bounds.right&&event.clientY>=bounds.top&&event.clientY<=bounds.bottom;
    if(!inside)studentModal.close();
  });
});

const requestedProfile=new URLSearchParams(window.location.search).get('profile');
if(requestedProfile){
  const requestedModal=document.querySelector(`.student-modal[data-profile="${requestedProfile}"]`);
  if(requestedModal&&typeof requestedModal.showModal==='function')requestedModal.showModal();
}
