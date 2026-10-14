(function(){
var $=function(s){return document.querySelector(s)};
var root=document.documentElement;

// Dark / light mode
var themeBtn=$("#themeBtn");
function isDark(){var t=root.dataset.theme;return t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches}
function paint(){themeBtn.textContent=isDark()?"☀️":"🌙"}
themeBtn.onclick=function(){var n=isDark()?"light":"dark";root.dataset.theme=n;try{localStorage.setItem("theme",n)}catch(e){}paint()};
paint();

// Mobile menu
var links=$("#links"),menuBtn=$("#menuBtn");
menuBtn.onclick=function(){var o=links.classList.toggle("open");menuBtn.setAttribute("aria-expanded",o)};
links.addEventListener("click",function(e){if(e.target.tagName==="A"){links.classList.remove("open");menuBtn.setAttribute("aria-expanded","false")}});

// Active nav link on scroll
var navA=links.querySelectorAll("a");
var io=new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.isIntersecting){navA.forEach(function(a){a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id)})}})},{rootMargin:"-45% 0px -50% 0px"});
document.querySelectorAll("main section").forEach(function(s){io.observe(s)});

// Back to top
var top=$("#topBtn");
addEventListener("scroll",function(){top.classList.toggle("show",scrollY>600)},{passive:true});
$("#year").textContent=new Date().getFullYear();

// Projects from Python API + filter
var grid=$("#projectGrid"),filters=$("#filters"),all=[];
function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML}
function show(tag){
  var list=tag==="All"?all:all.filter(function(p){return p.tags.indexOf(tag)>-1});
  grid.innerHTML=list.map(function(p){return '<article class="card"><h3>'+esc(p.title)+'</h3><p>'+esc(p.desc)+
    '</p><div class="chips">'+p.tags.map(function(t){return '<span class="tag">'+esc(t)+'</span>'}).join("")+
    '</div><p style="margin-top:.8rem"><a class="btn" href="'+esc(p.link)+'" target="_blank" rel="noopener">View on GitHub</a></p></article>'}).join("");
}
fetch("/api/projects").then(function(r){return r.json()}).then(function(d){
  all=d;var tags=["All"];d.forEach(function(p){p.tags.forEach(function(t){if(tags.indexOf(t)<0)tags.push(t)})});
  filters.innerHTML=tags.map(function(t,i){return '<button class="'+(i?"":"on")+'">'+esc(t)+'</button>'}).join("");
  filters.onclick=function(e){if(e.target.tagName!=="BUTTON")return;
    filters.querySelectorAll("button").forEach(function(b){b.classList.remove("on")});
    e.target.classList.add("on");show(e.target.textContent)};
  show("All");
}).catch(function(){grid.innerHTML="<p>Could not load projects. Please refresh.</p>"});

// Contact form -> Python
var form=$("#contactForm"),st=$("#status");
form.addEventListener("submit",function(e){
  e.preventDefault();
  var btn=form.querySelector("button");btn.disabled=true;st.className="";st.textContent="Sending...";
  fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify(Object.fromEntries(new FormData(form)))})
  .then(function(r){return r.json()}).then(function(d){
    if(d.ok){st.className="ok";st.textContent="Message sent. Thank you!";form.reset()}
    else{st.className="err";st.textContent=d.error||"Something went wrong."}
  }).catch(function(){st.className="err";st.textContent="Network error. Please try again."})
  .finally(function(){btn.disabled=false});
});
})();
