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

const escapeHtml=(value)=>String(value??'').replace(/[&<>'"]/g,(character)=>({
  '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
})[character]);
const displayValue=(value)=>value===null||value===undefined||value===''?'To be added':escapeHtml(value);
const profilePhoto=(student,modal=false)=>student.photo
  ?`<img src="${escapeHtml(student.photo)}" alt="${escapeHtml(student.name)}">`
  :(modal?'Photo':'<span>Photo</span>');

function bindStudentModals(){
  document.querySelectorAll('.student-modal[data-profile]:not([data-modal-bound])').forEach((studentModal)=>{
    studentModal.dataset.modalBound='true';
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
}

function fact(label,value){return `<div><dt>${escapeHtml(label)}</dt><dd>${displayValue(value)}</dd></div>`}
function studentModal(student){
  const profile=student.profile||{};
  const facts=[
    profile.program&&fact('Program',profile.program),
    fact('Institution',profile.institution),
    fact('Research areas',profile.researchAreas?.length?profile.researchAreas.join(' · '):null),
    fact('Supervisor',profile.supervisor)
  ].filter(Boolean).join('');
  let education='';
  if(Object.hasOwn(student,'previousEducation')){
    const item=student.previousEducation||{};
    const degree=item.year?[item.degree,item.year].filter(Boolean).join(' · '):item.degree;
    education=`<p class="overline modal-section-title">Previous education</p><dl class="student-facts student-education">${fact('Degree',degree)}${fact('Institution',item.institution)}${fact('Distinction',item.distinction)}${fact('Thesis advisor',item.thesisAdvisor)}</dl>`;
  }
  const projects=(student.projects||[]).map((item)=>`<a class="student-project" href="${escapeHtml(item.url)}"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.program)} · View project →</span></a>`).join('');
  const publications=(student.publications||[]).map((item)=>`<a href="${escapeHtml(item.url)}"><span>${escapeHtml([item.label,item.year].filter(Boolean).join(' · '))}</span><strong>${escapeHtml(item.title)}</strong></a>`).join('');
  const development=(student.inDevelopment||[]).map((item)=>`<article><span>${escapeHtml([item.status,item.venue,item.year].filter(Boolean).join(' · '))}</span><strong>${escapeHtml(item.title)}</strong>${item.authors?`<small>${escapeHtml(item.authors)}</small>`:''}</article>`).join('');
  const supervision=(student.supervision||[]).map((item)=>`<article><span>${escapeHtml([item.role,item.year].filter(Boolean).join(' · '))}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml([item.degree,item.institution].filter(Boolean).join(' · '))}</small></article>`).join('');
  const work=[
    projects&&`<p class="modal-field-title">Projects</p>${projects}`,
    publications&&`<p class="modal-field-title">Publications</p><div class="student-publications">${publications}</div>`,
    development&&`<p class="modal-field-title">In development</p><div class="student-publications development-list">${development}</div>`,
    supervision&&`<p class="modal-field-title">Supervision</p><div class="student-publications development-list">${supervision}</div>`
  ].filter(Boolean).join('')||'<p class="empty-record">Projects and research outputs will be added here.</p>';
  return `<dialog class="student-modal" id="${escapeHtml(student.id)}-profile" data-profile="${escapeHtml(student.id)}" aria-labelledby="${escapeHtml(student.id)}-profile-title"><button class="student-modal-close" type="button" aria-label="Close ${escapeHtml(student.name)} profile">Close ×</button><div class="student-modal-header"><div class="student-modal-photo">${profilePhoto(student,true)}</div><div><p class="overline">${escapeHtml(student.role)}</p><h2 id="${escapeHtml(student.id)}-profile-title">${escapeHtml(student.name)}</h2><p>${escapeHtml(student.summary)}</p></div></div><div class="student-modal-content"><section><p class="overline">Profile</p><dl class="student-facts">${facts}</dl>${education}</section><section><p class="overline">${student.status==='current'?'Current work':'Research work'}</p>${work}</section></div></dialog>`;
}

function renderStudentDatabase(){
  const currentList=document.querySelector('#current-student-list');
  const alumniList=document.querySelector('#alumni-list');
  const modalContainer=document.querySelector('#student-modal-container');
  if(!currentList||!alumniList||!modalContainer)return;
  try{
    const {students}=window.STUDENT_DATABASE||{};
    if(!Array.isArray(students))throw new Error('Student database is unavailable');
    const current=students.filter((student)=>student.status==='current');
    const alumni=students.filter((student)=>student.status==='former');
    currentList.innerHTML=current.map((student)=>`<article class="member-card"><a class="member-photo" href="#${escapeHtml(student.id)}-profile" data-student-profile="${escapeHtml(student.id)}">${profilePhoto(student)}</a><div class="member-info"><p>${escapeHtml(student.role)}</p><h3><a href="#${escapeHtml(student.id)}-profile" data-student-profile="${escapeHtml(student.id)}">${escapeHtml(student.name)}</a></h3><span>${escapeHtml(student.summary)}</span></div></article>`).join('');
    alumniList.innerHTML=alumni.map((student)=>`<article><span>${escapeHtml(student.role)}</span><h3><a href="#${escapeHtml(student.id)}-profile" data-student-profile="${escapeHtml(student.id)}">${escapeHtml(student.name)}</a></h3><p>${escapeHtml(student.profile?.program||'Research alumnus')}</p><p>${escapeHtml(student.profile?.institution||'')}</p><a href="#${escapeHtml(student.id)}-profile" data-student-profile="${escapeHtml(student.id)}" aria-label="Open ${escapeHtml(student.name)} profile">↗</a></article>`).join('');
    modalContainer.innerHTML=students.map(studentModal).join('');
    document.querySelector('#current-student-count').textContent=`${String(current.length).padStart(2,'0')} members`;
    document.querySelector('#alumni-count').textContent=`${String(alumni.length).padStart(2,'0')} former members`;
    bindStudentModals();
    openRequestedStudentProfile();
  }catch(error){
    currentList.innerHTML='<p class="empty-record">Student data could not be loaded.</p>';
    alumniList.innerHTML='<p class="empty-record">Alumni data could not be loaded.</p>';
    console.error('Student database error:',error);
  }
}

bindStudentModals();
renderStudentDatabase();

document.querySelectorAll('[data-dialog-target]').forEach((trigger)=>{
  trigger.addEventListener('click',(event)=>{event.preventDefault();document.getElementById(trigger.dataset.dialogTarget)?.showModal()});
});
document.querySelectorAll('.publication-modal').forEach((publicationModal)=>{
  publicationModal.querySelector('.publication-modal-close')?.addEventListener('click',()=>publicationModal.close());
  publicationModal.addEventListener('click',(event)=>{
    const box=publicationModal.getBoundingClientRect();
    const inside=event.clientX>=box.left&&event.clientX<=box.right&&event.clientY>=box.top&&event.clientY<=box.bottom;
    if(!inside) publicationModal.close();
  });
});

function openRequestedStudentProfile(){
  const requestedProfile=new URLSearchParams(window.location.search).get('profile');
  if(!requestedProfile)return;
  const requestedModal=document.querySelector(`.student-modal[data-profile="${CSS.escape(requestedProfile)}"]`);
  if(requestedModal&&typeof requestedModal.showModal==='function'&&!requestedModal.open)requestedModal.showModal();
}
openRequestedStudentProfile();
