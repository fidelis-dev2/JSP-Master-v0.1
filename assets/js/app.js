
if(!window.Swal){ window.Swal = { fire: (...args)=>{ const first=args[0]; if(typeof first==='string') alert(first); else if(first?.title) alert(first.title); return Promise.resolve({isConfirmed:true}); } }; }
const state = {
  db: window.JSP_DB,
  loggedIn: false,
  activeModule: null,
  activeLink: 'dashboard',
  charts: {},
  asideHidden: false
};
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>'"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[m]));
function appRoot(){ return $('#app'); }
function init(){ renderLogin(); }

function renderLogin(){
  document.body.classList.remove('inside-app','aside-hidden');
  appRoot().innerHTML = `
  <main class="login-page">
    <section class="login-cover">
      <div class="cover-logo"><i class="fa-solid fa-laptop-code"></i></div>
      <h1>JSP Master</h1>
      <h2>Jakarta Tomcat Learning System</h2>
      <p>Jifunze JSP na Servlets kuanzia zero mpaka uweze kujenga CRUD, login, filters, JDBC, MVC na deployment kwa Tomcat.</p>
      <div class="cover-footer">© 2026 JSP Master. ${footerText()}</div>
    </section>
    <section class="login-card-wrap">
      <form class="login-card" id="loginForm">
        <div class="brand-badge"><i class="fa-solid fa-house-laptop"></i></div>
        <h2>Welcome Back</h2>
        <small>Sign in to continue to your learning dashboard</small>
        <div class="field"><i class="fa-regular fa-user"></i><input id="username" value="student" placeholder="Username or Phone" required></div>
        <div class="field"><i class="fa-solid fa-lock"></i><input id="password" value="1234" type="password" placeholder="Password" required></div>
        <div class="login-options"><label><input type="checkbox" checked> Remember me</label><a href="#" onclick="forgotPassword();return false">Forgot password?</a></div>
        <button class="btn-primary" style="width:100%" type="submit"><i class="fa-solid fa-right-to-bracket"></i> Sign In</button>
      </form>
    </section>
  </main>`;
  $('#loginForm').addEventListener('submit', e => {
    e.preventDefault();
    Swal.fire({icon:'success',title:'Login successful',text:'Karibu kwenye JSP & Servlets Masterclass.',timer:900,showConfirmButton:false});
    setTimeout(()=>{state.loggedIn=true;renderMainPage();},650);
  });
}
function forgotPassword(){
  Swal.fire({
    title:'Reset Password',
    width:520,
    showCancelButton:true,
    confirmButtonText:'Send Reset Link',
    cancelButtonText:'Cancel',
    customClass:{popup:'forgot-popup'},
    html:`
      <div class="forgot-popup">
        <div class="forgot-help"><i class="fa-solid fa-circle-info"></i> Weka email au namba ya simu. Kwenye static demo hii itaonyesha ujumbe; kwenye backend utaunganisha email/SMS reset.</div>
        <div class="field"><i class="fa-regular fa-envelope"></i><input id="resetContact" placeholder="Email or phone number" value="${esc(state.db.app.email)}"></div>
        <div class="field"><i class="fa-solid fa-paper-plane"></i><select id="resetMethod"><option value="email">Send by Email</option><option value="sms">Send by SMS</option><option value="both">Email and SMS</option></select></div>
      </div>`,
    focusConfirm:false,
    preConfirm:()=>{
      const contact = document.getElementById('resetContact').value.trim();
      const method = document.getElementById('resetMethod').value;
      if(!contact){ Swal.showValidationMessage('Weka email au phone number.'); return false; }
      return {contact, method};
    }
  }).then(res=>{
    if(res.isConfirmed){
      Swal.fire({icon:'success',title:'Reset request received',html:`A reset instruction will be sent to <b>${esc(res.value.contact)}</b> via <b>${esc(res.value.method)}</b>.<br><small>Static demo only: connect this to Servlet/email/SMS backend later.</small>`});
    }
  });
}


function topbar(){
  return `<header class="topbar">
    <div class="brand"><button class="side-toggle btn-outline" onclick="toggleSide()" title="Hide / Show Aside" aria-label="Hide or show aside menu"><i class="fa-solid fa-bars-staggered"></i></button><div class="brand-icon"><i class="fa-solid fa-house-laptop"></i></div><div><h3>${esc(state.db.app.name)}</h3><span>${esc(state.db.app.fullName)}</span></div></div>
    <div class="search-box"><i class="fa-solid fa-magnifying-glass"></i><input id="globalSearch" placeholder="Search lesson, servlet, JSP, JDBC..." onkeydown="if(event.key==='Enter') searchLessons(this.value)"><button class="btn-soft" onclick="searchLessons($('#globalSearch').value)">Search</button></div>
    <div class="userbar"><i class="fa-regular fa-bell"></i><div class="avatar">JS</div><div><b>Admin User</b><br><small>Administrator</small></div><button class="btn-outline" onclick="logout()"><i class="fa-solid fa-chevron-down"></i></button></div>
  </header>`;
}
function openModule(id){
  state.activeModule = state.db.modules.find(m=>m.id===id) || state.db.modules[0];
  state.activeLink='dashboard';
  renderWorkspace();
}
function renderWorkspace(){
  const m=state.activeModule || state.db.modules[0];
  appRoot().innerHTML = `<div class="app-shell">${topbar()}<div class="workspace"><aside id="sidePanel" class="side-panel">${sidePanel(m)}</aside><main class="content" id="contentArea"></main></div><footer class="footer">${footerText()}</footer></div>`;
  renderContent('dashboard');
}
function sidePanel(m){
  return `<div class="side-head"><div class="circle"><i class="fa-solid ${m.icon}"></i></div><div><b>${esc(m.name)}</b><br><small>${esc(m.short || 'Module')} lessons and practice</small></div></div><nav class="side-nav">${(state.db.links[m.id]||[]).map(l=>`<a href="#" data-link="${l.id}" onclick="renderContent('${l.id}');return false"><i class="fa-solid ${l.icon}"></i> ${esc(l.name)}</a>`).join('')}</nav><div class="back-card" onclick="renderMainPage()"><i class="fa-solid fa-arrow-left"></i><div>Main Page<br><small>Back to modules</small></div></div>`;
}
function toggleSide(){
  const panel = $('#sidePanel');
  if(!panel){ renderMainPage(); return; }
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  if(isMobile){
    panel.classList.toggle('show');
    document.body.classList.remove('aside-hidden');
    return;
  }
  state.asideHidden = !state.asideHidden;
  document.body.classList.toggle('aside-hidden', state.asideHidden);
}

function renderMainPage(){
  document.body.classList.add('inside-app');
  document.body.classList.remove('aside-hidden');
  appRoot().innerHTML = `<div class="app-shell">${topbar()}
    <section class="hero app-hero"><h1>Welcome Back, Developer 👋</h1><p>What would you like to learn today? Chagua module kama app icon, kisha soma lesson, copy code, angalia diagram na video ndani ya mfumo.</p><button class="btn-primary" onclick="openModule('start')"><i class="fa-solid fa-play"></i> Start Learning</button></section>
    <section class="apps-section">
      <div class="apps-title"><div><span class="pill"><i class="fa-solid fa-grip"></i> MAIN MODULES</span><h2>Learning Apps</h2><p>Muonekano wa vi-app: jina + FontAwesome icon kama dashboard uliyoonesha.</p></div><button class="btn-outline" onclick="forgotPassword()"><i class="fa-solid fa-unlock-keyhole"></i> Forgot Popup</button></div>
      <div class="module-grid app-grid">${state.db.modules.map(m=>moduleCard(m)).join('')}</div>
    </section>
    <footer class="footer">${footerText()}</footer>
  </div>`;
}

function moduleCard(m){ return `<button type="button" class="module-card app-tile" onclick="openModule('${m.id}')" aria-label="Open ${esc(m.name)} module"><span class="module-icon app-icon"><i class="fa-solid ${m.icon}"></i></span><span class="app-name">${esc(m.name)}</span></button>`; }

function setActiveLink(id){
  $$('.side-nav a').forEach(a=>a.classList.toggle('active',a.dataset.link===id));
  if(window.matchMedia('(max-width: 900px)').matches){
    $('#sidePanel')?.classList.remove('show');
  }
}
function pageTitle(id){ return id.split('-').map(w=>w ? w[0].toUpperCase()+w.slice(1) : '').join(' '); }
function pageHead(title, sub='Jifunze hatua kwa hatua kwa mifano ya code inayoweza kufanywa.'){ return `<div class="crumb">Home › ${state.activeModule ? esc(state.activeModule.name) : 'Search'} › ${esc(title)}</div><div class="page-head"><div><h2>${esc(title)}</h2><p>${esc(sub)}</p></div><button class="btn-outline" onclick="renderMainPage()"><i class="fa-solid fa-arrow-left"></i> Back to Modules</button></div>`; }
function frameHero(title, desc, image){ return `<div class="frame-hero" style="background-image:url('${image || 'assets/img/module-side-banner.svg'}')"><h2>${esc(title)}</h2><p>${esc(desc)}</p></div>`; }
function kpis(){ const s=state.db.stats; return `<section class="kpi-grid"><div class="kpi"><i class="fa-solid fa-layer-group"></i><div><small>Modules</small><b>${s.modules}</b></div></div><div class="kpi"><i class="fa-solid fa-book-open"></i><div><small>Lessons</small><b>${s.lessons}</b></div></div><div class="kpi"><i class="fa-solid fa-video"></i><div><small>Videos</small><b>${s.videos}</b></div></div><div class="kpi"><i class="fa-solid fa-code"></i><div><small>Code Examples</small><b>${s.codeExamples}</b></div></div><div class="kpi"><i class="fa-solid fa-diagram-project"></i><div><small>Projects</small><b>${s.projects}</b></div></div><div class="kpi"><i class="fa-solid fa-image"></i><div><small>Diagrams</small><b>${s.diagrams}</b></div></div></section>`; }

function renderContent(linkId){
  state.activeLink = linkId; setActiveLink(linkId);
  let html=''; const lesson = state.db.lessons.find(l=>l.id===linkId);
  if(linkId==='dashboard') html = dashboardContent(state.activeModule);
  else if(lesson) html = lessonView(lesson);
  else if(linkId==='video-library' || linkId==='playlist') html = videoLibrary();
  else if(linkId==='watch-progress') html = progressView();
  else if(linkId==='final-project') html = finalProject();
  else if(linkId==='lesson-archive') html = archiveView();
  else if(linkId.includes('code-lab')) html = codeLab(linkId);
  else if(linkId.includes('quiz')) html = quizView(linkId);
  else html = genericView(linkId);
  $('#contentArea').innerHTML = html;
  afterRender(linkId);
}
function dashboardContent(m){
  const moduleLessons = state.db.lessons.filter(l=>l.module===m.id).slice(0,6);
  return `${pageHead('Dashboard','Overview ya module hii na links za kuanza haraka.')}${frameHero(m.name,m.description,m.image)}${kpis()}
  <div class="quick-actions"><button class="quick" onclick="renderContent('${moduleLessons[0]?.id || 'video-library'}')"><i class="fa-solid fa-play"></i>Start Lesson</button><button class="quick" onclick="renderContent('${m.id}-code-lab')"><i class="fa-solid fa-code"></i>Code Lab</button><button class="quick" onclick="renderContent('${m.id}-quiz')"><i class="fa-solid fa-circle-question"></i>Quiz</button><button class="quick" onclick="renderContent('video-library')"><i class="fa-solid fa-video"></i>Videos</button><button class="quick" onclick="renderContent('final-project')"><i class="fa-solid fa-diagram-project"></i>Project</button><button class="quick" onclick="Swal.fire('Saved','Progress saved locally.','success')"><i class="fa-solid fa-floppy-disk"></i>Save</button></div>
  <section class="chart-grid"><div class="panel"><div class="panel-head"><h3>Learning Roadmap</h3><span class="pill"><i class="fa-solid fa-route"></i> Step by step</span></div><canvas id="lineChart" height="120"></canvas></div><div class="panel"><div class="panel-head"><h3>Topic Distribution</h3><span class="pill"><i class="fa-solid fa-chart-pie"></i> Mastery</span></div><canvas id="pieChart" height="170"></canvas></div></section>
  <section class="panel"><div class="panel-head"><h3>Lessons in this frame</h3><a class="open-link" onclick="searchLessons('${m.name}')">Search more</a></div><div class="cards-grid">${moduleLessons.map(lessonCard).join('')}</div></section>`;
}
function lessonCard(l){ return `<article class="lesson-card"><span class="pill"><i class="fa-solid fa-book"></i> ${esc(l.module)}</span><h4>${esc(l.title)}</h4><p>${esc(l.subtitle)}</p><button class="btn-primary" onclick="renderContent('${l.id}')">Open Lesson</button></article>`; }

function cleanYoutubeUrl(src){
  const fallback = 'https://www.youtube.com/embed/videoseries?list=PLGt1lxwGVOI6s2QXLp0foEeMfy9Iul2SS';
  let raw = String(src || fallback).trim();
  raw = raw.replace('https://youtu.be/', 'https://www.youtube.com/embed/');
  raw = raw.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');
  raw = raw.replace('https://youtube.com/watch?v=', 'https://www.youtube.com/embed/');
  raw = raw.replace('https://www.youtube.com/shorts/', 'https://www.youtube.com/embed/');
  raw = raw.replace('https://youtube.com/shorts/', 'https://www.youtube.com/embed/');
  try{
    const u = new URL(raw, window.location.href);
    if(u.hostname.includes('youtube.com') && u.pathname === '/watch'){
      const id = u.searchParams.get('v');
      if(id) return buildYoutubeEmbed('https://www.youtube.com/embed/' + id, u.searchParams);
    }
    return buildYoutubeEmbed(u.toString(), u.searchParams);
  }catch(e){
    return buildYoutubeEmbed(fallback, new URLSearchParams());
  }
}
function buildYoutubeEmbed(base, params){
  const url = new URL(base, window.location.href);
  url.hostname = url.hostname.replace('youtube.com', 'youtube-nocookie.com');
  url.protocol = 'https:';
  url.searchParams.set('rel','0');
  url.searchParams.set('modestbranding','1');
  url.searchParams.set('playsinline','1');
  url.searchParams.set('enablejsapi','1');
  url.searchParams.set('widget_referrer', window.location.href.split('#')[0]);
  if(location.protocol === 'http:' || location.protocol === 'https:'){
    url.searchParams.set('origin', location.origin);
  }
  return url.toString();
}
function youtubeFrame(src, title='YouTube lesson'){
  const safeTitle = esc(title);
  const safeSrc = esc(cleanYoutubeUrl(src));
  const isFileMode = location.protocol === 'file:';
  const fileWarning = isFileMode ? `<div class="youtube-warning"><i class="fa-solid fa-triangle-exclamation"></i><div><b>Usitest kwa double click / file://</b><span>Kwa GitHub Pages video zitaplay ndani ya website kwa sababu site itakuwa na HTTPS origin/referrer. Kwa local test tumia VS Code Live Server au python -m http.server.</span></div></div>` : '';
  return `<div class="youtube-wrap">${fileWarning}<iframe src="${safeSrc}" title="${safeTitle}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
}
function youtubeId(src){
  try{
    const u = new URL(String(src || ''), window.location.href);
    if(u.pathname.includes('/embed/')) return u.pathname.split('/embed/')[1].split('/')[0];
    if(u.hostname.includes('youtu.be')) return u.pathname.replace('/','').split('?')[0];
    if(u.searchParams.get('v')) return u.searchParams.get('v');
  }catch(e){}
  return '';
}
function youtubeThumb(src){
  const id = youtubeId(src);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : 'assets/img/final-project.svg';
}
function youtubeExternal(src){
  const id = youtubeId(src);
  return id ? `https://www.youtube.com/watch?v=${id}` : String(src || '#');
}

function lessonView(l){ return `${pageHead(l.title,l.subtitle)}${frameHero(l.title,l.concept,l.diagram)}
  <section class="panel"><div class="panel-head"><h3>1. Explanation ya mtoto</h3><span class="pill">Zero → Hero</span></div><p>${esc(l.concept)}</p><div class="note"><b>Kumbuka:</b> Tomcat 10+ hutumia <b>jakarta.*</b>. Usichanganye na <b>javax.*</b> kwenye project mpya ya Jakarta.</div></section>
  <section class="panel"><div class="panel-head"><h3>2. Picha/Diagram kubwa</h3><button class="btn-soft" onclick="markDone('${l.id}')">Mark Done</button></div><img class="diagram" src="${l.diagram}" alt="${esc(l.title)} diagram"></section>
  <section class="panel video-box"><div class="panel-head"><h3>3. Video ya YouTube ndani ya mfumo</h3><span class="pill"><i class="fa-brands fa-youtube"></i> YouTube Embed</span></div>${youtubeFrame(l.video, l.title)}<p class="video-note">Video hii ni YouTube embed inayocheza ndani ya mfumo. Ukiupload GitHub Pages, inatumia HTTPS origin/referrer sahihi.</p></section>
  <section class="panel"><div class="panel-head"><h3>4. Objectives</h3></div><ul class="steps">${l.objectives.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>
  <section class="panel"><div class="panel-head"><h3>5. Code Examples</h3><span class="pill">Copy and practice</span></div>${l.codeKeys.map(k=>codeBlock(k, state.db.codes[k] || '// Code example not found')).join('')}</section>
  <section class="panel"><div class="panel-head"><h3>6. Practice</h3><button class="btn-primary" onclick="Swal.fire('Practice','${esc(l.practice)}','success')">Show Task</button></div><ul class="steps">${l.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="note">${esc(l.practice)}</p></section>
  <section class="panel"><div class="panel-head"><h3>7. Quiz</h3></div><ul class="steps">${l.quiz.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`; }
function codeBlock(name, code){ return `<div class="code-wrap"><div class="code-head"><span>${esc(name)}</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div><pre><code>${esc(code)}</code></pre></div>`; }
function codeLab(id){ const m = state.activeModule?.id || 'start'; const moduleLessons = state.db.lessons.filter(l=>l.module===m).slice(0,4); return `${pageHead('Code Lab','Hapa unaandika code kwa kufuata mifano ya module hii.')}${frameHero('Code Practice Lab','Copy code, paste kwenye IDE, run Tomcat, rekebisha error moja moja.',state.activeModule?.image)}<section class="panel"><h3>Recommended examples</h3>${moduleLessons.flatMap(l=>l.codeKeys).slice(0,5).map(k=>codeBlock(k,state.db.codes[k])).join('')}</section><section class="panel"><h3>Lab checklist</h3><ul class="steps"><li>Create Maven WAR project.</li><li>Use jakarta.servlet imports only.</li><li>Create servlet route using @WebServlet.</li><li>Forward data to JSP inside WEB-INF/views.</li><li>Deploy on Tomcat and test in browser.</li></ul></section>`; }
function quizView(id){ return `${pageHead('Quiz & Practice','Maswali ya kujipima kabla hujaenda module inayofuata.')}${frameHero('Mastery Check','Ukijibu haya bila kuangalia video, umeanza kuwa untouchable.',state.activeModule?.image)}<section class="panel"><ul class="steps"><li>Eleza tofauti ya Servlet na JSP kwa sentensi 2.</li><li>Kwa nini Controller isiwe JSP?</li><li>Andika import sahihi ya HttpServlet kwenye Jakarta.</li><li>Utafanya nini ukipata HTTP 404?</li><li>Utafanya nini ukipata JSP compile error?</li></ul><button class="btn-primary" onclick="Swal.fire('Good','Endelea na code lab.','success')">I can answer</button></section>`; }
function videoLibrary(){ return `${pageHead('YouTube Video Library','Video ni YouTube embeds lakini zinaplay ndani ya mfumo kupitia iframe iliyorekebishwa kwa GitHub Pages.')}${frameHero('YouTube Lessons Embedded','Master player inabaki ndani ya website; cards chini ni playlist ya kuchagua video bila kutoka kwenye system.', 'assets/img/final-project.svg')}<section class="panel"><div id="masterVideo">${youtubeFrame(state.db.videos[0].src, state.db.videos[0].title)}</div><p class="video-note">GitHub Pages / HTTPS mode: video zinaplay ndani ya page. Kama video fulani imezuiwa na mmiliki wake, badilisha link yake kwenye assets/js/db.js.</p></section><section class="panel"><div class="video-grid">${state.db.videos.map(v=>`<article class="lesson-card video-card"><button class="video-thumb" onclick="playMaster('${v.src}','${esc(v.title)}')" style="background-image:url('${youtubeThumb(v.src)}')"><span><i class="fa-solid fa-play"></i></span></button><h4>${esc(v.title)}</h4><p>${esc(v.topic)}</p><div class="video-actions"><button class="btn-primary" onclick="playMaster('${v.src}','${esc(v.title)}')"><i class="fa-solid fa-play"></i> Play inside</button></div></article>`).join('')}</div></section>`; }
function playMaster(src,title){ const box=$('#masterVideo'); if(box){ box.innerHTML = youtubeFrame(cleanYoutubeUrl(src) + (cleanYoutubeUrl(src).includes('?') ? '&' : '?') + 'autoplay=1', title); window.scrollTo({top:90,behavior:'smooth'}); } Swal.fire({toast:true,position:'top-end',icon:'success',title:'Playing '+title,showConfirmButton:false,timer:1200}); }
function progressView(){ const done = JSON.parse(localStorage.getItem('jsp_done')||'[]'); return `${pageHead('Watch Progress','Progress inahifadhiwa kwenye browser localStorage.')}${kpis()}<section class="panel"><h3>Completed lessons: ${done.length}</h3><p>${done.length ? done.map(esc).join(', ') : 'Bado hujamark lesson yoyote kuwa done.'}</p><button class="btn-outline" onclick="localStorage.removeItem('jsp_done');renderContent('watch-progress')">Reset Progress</button></section>`; }
function finalProject(){ return `${pageHead('Full Student CRUD Project','Project kamili ipo ndani ya folder examples/student-crud-jakarta.')}${frameHero('Final CRUD Project','Login, session, filter, JSP views, DAO, JDBC and MySQL schema.', 'assets/img/final-project.svg')}<section class="panel"><h3>Folder structure</h3><div class="folder-note">examples/student-crud-jakarta/<br>├─ pom.xml<br>├─ database/schema.sql<br>├─ src/main/java/tz/shotto/learn/config/DB.java<br>├─ src/main/java/tz/shotto/learn/dao/StudentDAO.java<br>├─ src/main/java/tz/shotto/learn/servlet/*.java<br>└─ src/main/webapp/WEB-INF/views/*.jsp</div></section><section class="panel"><h3>How to run</h3><ul class="steps"><li>Create MySQL database using database/schema.sql.</li><li>Open project in IDE as Maven project.</li><li>Update DB.java username/password.</li><li>Run mvn clean package.</li><li>Deploy generated WAR to Tomcat 10.1+.</li></ul></section>${codeBlock('pom.xml',state.db.codes.pom)}${codeBlock('DB.java',state.db.codes.jdbc)}${codeBlock('StudentDAO sample',state.db.codes.dao)}`; }
function archiveView(){ return `${pageHead('120 Lessons Archive','Lesson files za ziada zimewekwa kwenye folder lessons/.')}${frameHero('Lesson Archive','Chagua lesson file hapa chini, itaonekana ndani ya frame hii.', 'assets/img/learning-hero.svg')}<section class="panel"><div class="cards-grid">${Array.from({length:120},(_,i)=>i+1).map(n=>`<article class="lesson-card"><h4>Archive Lesson ${String(n).padStart(3,'0')}</h4><p>Static lesson page copied from previous master website.</p><button class="btn-primary" onclick="openArchive(${n})">Open in frame</button></article>`).join('')}</div></section><section class="panel"><iframe id="archiveFrame" class="archive-frame" src="lessons/lesson-001.html"></iframe></section>`; }
function openArchive(n){ const f=$('#archiveFrame'); if(f){ f.src = `lessons/lesson-${String(n).padStart(3,'0')}.html`; f.scrollIntoView({behavior:'smooth'}); } }
function genericView(id){ return `${pageHead(pageTitle(id),'Content inabadilika kulingana na link ya sidebar.')}${frameHero(pageTitle(id),'Frame hii iko tayari kuunganishwa na backend au kuongeza content nyingine.',state.activeModule?.image)}<section class="panel"><div class="empty-state"><i class="fa-solid fa-layer-group" style="font-size:44px;color:var(--pink)"></i><h3>${pageTitle(id)}</h3><p>This page is ready. Link content is changing correctly inside the uploaded template frame.</p><button class="btn-primary" onclick="Swal.fire('Done','Demo action completed successfully.','success')">Run Demo Action</button></div></section>`; }
function searchLessons(q){ q=String(q||'').trim().toLowerCase(); if(!q){ Swal.fire('Search','Andika neno kama servlet, jsp, jdbc, login, tomcat.','info'); return; } const results = state.db.lessons.filter(l => [l.title,l.subtitle,l.module,l.concept].join(' ').toLowerCase().includes(q)); state.activeModule = state.activeModule || state.db.modules[0]; if(!$('#contentArea')){ openModule('start'); } $('#contentArea').innerHTML = `${pageHead('Search Results',`Found ${results.length} lesson(s) for "${q}"`)}<section class="panel"><div class="cards-grid">${results.slice(0,24).map(lessonCard).join('') || '<p>No result found.</p>'}</div></section>`; setActiveLink(''); }
function markDone(id){ const arr=JSON.parse(localStorage.getItem('jsp_done')||'[]'); if(!arr.includes(id)) arr.push(id); localStorage.setItem('jsp_done',JSON.stringify(arr)); Swal.fire('Saved','Lesson marked as done.','success'); }
function copyCode(btn){ const code = btn.closest('.code-wrap').querySelector('code').innerText; navigator.clipboard?.writeText(code).then(()=>Swal.fire({toast:true,position:'top-end',icon:'success',title:'Code copied',showConfirmButton:false,timer:1200})).catch(()=>{ const t=document.createElement('textarea'); t.value=code; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); Swal.fire('Copied','Code copied.','success'); }); }
function afterRender(id){ if($('#lineChart')) drawLine(); if($('#pieChart')) drawPie(); setActiveLink(id); }
function drawLine(){ const ctx=$('#lineChart'); if(!ctx || !window.Chart) return; new Chart(ctx,{type:'line',data:{labels:['Tools','Servlet','JSP','MVC','JDBC','Security','Deploy'],datasets:[{label:'Mastery path',data:[10,25,40,55,70,85,100],tension:.4,fill:true}]},options:{plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>v+'%'}}}}}); }
function drawPie(){ const ctx=$('#pieChart'); if(!ctx || !window.Chart) return; new Chart(ctx,{type:'doughnut',data:{labels:['Servlets','JSP','Database','Security','Deploy'],datasets:[{data:[25,22,23,15,15]}]},options:{plugins:{legend:{position:'right'}}}}); }
function logout(){ Swal.fire({title:'Logout?',text:'Do you want to leave the class?',icon:'question',showCancelButton:true,confirmButtonText:'Logout'}).then(r=>{ if(r.isConfirmed) renderLogin(); }); }
window.addEventListener('load', init);
