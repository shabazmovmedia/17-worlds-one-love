const field = document.getElementById("star-field");
const dialog = document.getElementById("star-dialog");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let selected = null;
const positions = [
  [13,28],[28,17],[43,28],[58,15],[75,20],[88,43],[70,48],[51,56],
  [32,48],[15,65],[29,79],[47,77],[64,72],[80,79],[90,62],[78,92]
];
const visitedKey = "17worlds-visited";
function getVisited(){try{return JSON.parse(localStorage.getItem(visitedKey)||"[]")}catch{return []}}
function saveVisited(n){const v=getVisited();if(!v.includes(n)){v.push(n);localStorage.setItem(visitedKey,JSON.stringify(v))}updateProgress()}
function updateProgress(){const v=getVisited();document.getElementById("progress-label").textContent=`${v.length} OF 16 WORLDS VISITED`;document.getElementById("progress-fill").style.width=(v.length/16*100)+"%";document.querySelectorAll(".star-node").forEach(b=>b.classList.toggle("visited",v.includes(Number(b.dataset.number))))}
function travel(dest, button){
  if(!dest.url){document.getElementById("dialog-status").textContent="This world is still being created. Its link will be added when it is published.";return}
  saveVisited(dest.number);
  const overlay=document.getElementById("travel-overlay");document.getElementById("travel-name").textContent=dest.name.toUpperCase();overlay.classList.add("active");overlay.setAttribute("aria-hidden","false");
  if(button){const r=button.getBoundingClientRect();const ship=document.getElementById("ship");ship.style.left=(r.left+r.width/2)+"px";ship.style.top=(r.top+r.height/2)+"px"}
  setTimeout(()=>{window.location.href=dest.url},reducedMotion?100:1150);
}
window.STAR_DESTINATIONS.forEach((dest,i)=>{
  const b=document.createElement("button");b.className="star-node";b.type="button";b.dataset.number=dest.number;b.style.left=positions[i][0]+"%";b.style.top=positions[i][1]+"%";
  b.setAttribute("aria-label",`Destination ${dest.number}: ${dest.name}`);
  b.innerHTML=`<span class="star-core"></span><span class="star-label">${dest.name}</span><span class="star-num">STAR ${String(dest.number).padStart(2,"0")}</span>`;
  b.addEventListener("click",()=>{selected=dest;document.getElementById("dialog-number").textContent=`DESTINATION ${String(dest.number).padStart(2,"0")}`;document.getElementById("dialog-title").textContent=dest.name;document.getElementById("dialog-description").textContent=dest.description;document.getElementById("dialog-status").textContent=dest.url?"This destination is ready to visit.":"This destination is still being prepared.";document.getElementById("launch-button").textContent=dest.url?"TRAVEL TO THIS STAR ↗":"STAR NOT PUBLISHED YET";dialog.showModal()});
  field.appendChild(b);
});
document.getElementById("launch-button").addEventListener("click",()=>selected&&travel(selected));
document.getElementById("dialog-close").addEventListener("click",()=>dialog.close());
document.getElementById("reset-progress").addEventListener("click",()=>{if(confirm("Reset your visited-star progress on this device?")){localStorage.removeItem(visitedKey);updateProgress()}});
function openMoon(){const moon=window.STAR_DESTINATIONS.find(s=>s.number===17);selected=moon;document.getElementById("dialog-number").textContent="FINAL DESTINATION · 17";document.getElementById("dialog-title").textContent="Our Moon";document.getElementById("dialog-description").textContent=moon.description;document.getElementById("dialog-status").textContent=moon.url?"The final destination is ready.":"The Moon is waiting to be published.";document.getElementById("launch-button").textContent=moon.url?"LAND ON THE MOON ↗":"MOON NOT PUBLISHED YET";dialog.showModal()}
document.getElementById("moon-destination").addEventListener("click",openMoon);
document.getElementById("moon-destination").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openMoon()}});
updateProgress();
