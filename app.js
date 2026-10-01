document.documentElement.classList.add('js');
const hero=document.querySelector('.hero'),far=document.querySelector('.far'),mid=document.querySelector('.middle'),front=document.querySelector('.front'),title=document.querySelector('.climb'),button=document.querySelector('.motion');
const brandBands=[...document.querySelectorAll('.brand-band')];
const detailImages=[...document.querySelectorAll('.feature-art img,.grip-art img')];
const preference=matchMedia('(prefers-reduced-motion: reduce)');let queued=false,paused=false;
function paint(){queued=false;const r=hero.getBoundingClientRect();// Keep parallax active for the full visible exit, without pinning the hero.
const travel=Math.max(1,r.height);const p=preference.matches||paused?0:Math.max(0,Math.min(1,-r.top/travel));const mobile=innerWidth<701;far.style.transform=`translate3d(0,${p*travel*.22}px,0) scale(${1.04+p*.03})`;mid.style.transform=`translate3d(0,${-p*(mobile?95:160)}px,0)`;front.style.transform=`translate3d(0,${-p*(mobile?200:330)}px,0) scaleX(-1)`;title.style.transform=`translate3d(0,${p*travel*.65}px,0)`;
const off=preference.matches||paused;
brandBands.forEach(band=>{const box=band.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight-box.top)/(innerHeight+box.height)));band.firstElementChild.style.transform=`translate3d(${off?0:(progress-.5)*240*Number(band.dataset.direction)}px,0,0)`});
detailImages.forEach(img=>{const box=img.closest('section').getBoundingClientRect();if(off){img.style.transform='none';return}if(box.bottom>0&&box.top<innerHeight){const progress=Math.max(0,Math.min(1,(innerHeight-box.top)/(innerHeight+box.height)));img.style.transform=`translate3d(0,${(progress-.5)*(mobile?12:24)}px,0) scale(${1.02+progress*(mobile?.06:.10)})`}});
document.documentElement.style.setProperty('--reading-progress',`${Math.min(100,100*scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))}%`);
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(paint)}}
function state(){let off=preference.matches||paused;document.body.classList.toggle('motion-off',off);button.textContent=off?'Ruch: wyłączony':'Ruch: włączony';button.setAttribute('aria-pressed',String(off));button.disabled=preference.matches;schedule()}
button.addEventListener('click',()=>{paused=!paused;state()});addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);preference.addEventListener('change',state);state();
// Observe individual content items instead of hiding whole columns.
document.querySelectorAll('.body-copy,.feature-copy,.pause-copy').forEach(el=>el.classList.remove('reveal'));
const groups=['.body-copy','.feature-copy','.pause-copy','.principles','.kit-grid','.closing-bottom'];
groups.forEach(selector=>document.querySelectorAll(selector).forEach(group=>[...group.children].forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--reveal-delay',`${Math.min(i,3)*75}ms`)})));
document.querySelectorAll('.label,.decision-heading>p,.route,.closing>.eyebrow').forEach(el=>el.classList.add('reveal'));
document.querySelectorAll('.climb span').forEach((el,i)=>{el.classList.add('hero-enter');el.style.setProperty('--reveal-delay',`${180+i*110}ms`)});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.addEventListener('focusin',event=>{let el=event.target;while(el&&el!==document.body){if(el.classList.contains('reveal'))el.classList.add('visible');el=el.parentElement}});

// Keep touch scrolling native; arrows and keyboard move one complete card.
const track=document.querySelector('.video-carousel');
if(track){
 const prev=document.querySelector('.carousel-prev'),next=document.querySelector('.carousel-next');
 const videos=[...track.querySelectorAll('video')];
 const update=()=>{prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2};
 const move=direction=>{const card=track.querySelector('.video-card');track.scrollBy({left:direction*(card.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap)),behavior:preference.matches||paused?'instant':'smooth'})};
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowLeft'?-1:1)}});
 track.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(track);update();
 videos.forEach(video=>video.addEventListener('play',()=>videos.forEach(other=>{if(other!==video)other.pause()})));
 const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)entry.target.pause()}),{threshold:0});
 videos.forEach(video=>visibility.observe(video));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(video=>video.pause())});
}
