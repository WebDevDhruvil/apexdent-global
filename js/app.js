const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const toast=(m)=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),3200)};
const safe=(v,max=120)=>String(v||"").replace(/<[^>]*>/g,"").replace(/[<>"'`]/g,"").trim().slice(0,max);
const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const passOk=v=>/^(?=.*[A-Za-z])(?=.*\d).{8,72}$/.test(v);
const store={get(k,d=null){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){localStorage.setItem(k,JSON.stringify(v))}};
let currentUser=store.get("apex_session",null), authMode="login", booking={step:1,doctor:null,tz:null,date:null};
const doctors=[
 {id:"lin",name:"Dr. Lina Moreau",role:"Cosmetic & Restorative Dentistry",zone:"Europe / Paris"},
 {id:"rao",name:"Dr. Arjun Rao",role:"Implant & Reconstructive Dentistry",zone:"Asia / Dubai"},
 {id:"kim",name:"Dr. Hana Kim",role:"Orthodontics & Digital Planning",zone:"Asia / Seoul"}
];
const timezones=["GMT−05:00 — New York","GMT+00:00 — London","GMT+04:00 — Dubai","GMT+05:30 — Mumbai","GMT+08:00 — Singapore","GMT+09:00 — Tokyo"];
const treatments={
 cosmetic:{ey:"SIGNATURE SMILE",title:"Cosmetic Dentistry",text:"Digital smile design, ceramic veneers and minimally invasive aesthetic treatments planned with clinical detail.",price:"$1,800",note:"Final quote follows clinical assessment."},
 implants:{ey:"PRECISION RECONSTRUCTION",title:"Dental Implants",text:"Implant planning designed around bone health, function and a natural long-term result.",price:"$2,400",note:"Implant system and complexity affect final pricing."},
 ortho:{ey:"ALIGNMENT / DIGITAL",title:"Orthodontics",text:"Clear aligner pathways and specialist-led orthodontic planning for discreet, measurable movement.",price:"$2,900",note:"Estimate varies by treatment duration."},
 tele:{ey:"CARE WITHOUT BORDERS",title:"Global Teleconsultation",text:"A secure first conversation with a dental specialist before you travel or commit to a treatment plan.",price:"$95",note:"Consultation fee shown for demonstration purposes."}
};
function openModal(id){$(".modal-backdrop").classList.add("show");$$(".modal").forEach(m=>m.hidden=true);$(id).hidden=false}
function closeModal(){$(".modal-backdrop").classList.remove("show")}
$$("[data-close]").forEach(b=>b.onclick=closeModal);
$(".modal-backdrop").onclick=e=>{if(e.target==$(".modal-backdrop"))closeModal()};
function setDrawer(v){$("#drawer").classList.toggle("open",v);$("#backdrop").classList.toggle("show",v);$("#drawer").ariaHidden=String(!v);$("#menuBtn").ariaExpanded=String(v)}
$("#menuBtn").onclick=()=>setDrawer(true);$("#closeMenu").onclick=()=>setDrawer(false);$("#backdrop").onclick=()=>setDrawer(false);$$(".drawer a").forEach(a=>a.onclick=()=>setDrawer(false));

function renderAuth(){authMode="login";$("#authTitle").textContent="Welcome back.";$("#authSub").textContent="Sign in to view appointments and your patient profile.";$("#authSubmit").textContent="Sign in";$("#nameField").hidden=true;$("#authPassword").autocomplete="current-password";$("#authSwitch").textContent="New patient? Create an account";$("#authForm").reset();openModal("#authModal")}
$("#loginBtn").onclick=()=>currentUser?renderDashboard():renderAuth();
$("#authSwitch").onclick=()=>{authMode=authMode==="login"?"signup":"login";$("#authTitle").textContent=authMode==="login"?"Welcome back.":"Create your patient profile.";$("#authSub").textContent=authMode==="login"?"Sign in to view appointments and your patient profile.":"Your password is hashed with Web Crypto before browser storage.";$("#authSubmit").textContent=authMode==="login"?"Sign in":"Create account";$("#nameField").hidden=authMode==="login";$("#authSwitch").textContent=authMode==="login"?"New patient? Create an account":"Already registered? Sign in";$("#authForm").reset()};
async function hash(v){const data=new TextEncoder().encode(v),buf=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,"0")).join("")}
$("#authForm").onsubmit=async e=>{e.preventDefault();const email=safe($("#authEmail").value,120).toLowerCase(),pw=$("#authPassword").value,name=safe($("#authName").value,80);
 if(!emailOk(email)||!passOk(pw)||(authMode==="signup"&&!name)){toast("Please enter valid details. Password needs 8+ characters, letters and numbers.");return}
 const users=store.get("apex_users",{});const hp=await hash(pw);
 if(authMode==="signup"){if(users[email]){toast("An account already exists for this email.");return}users[email]={email,name,passwordHash:hp,createdAt:new Date().toISOString()};store.set("apex_users",users);currentUser=users[email];store.set("apex_session",currentUser);toast("Account created. Welcome to ApexDent.");closeModal();renderDashboard()}
 else {if(!users[email]||users[email].passwordHash!==hp){toast("Invalid email or password.");return}currentUser=users[email];store.set("apex_session",currentUser);toast("Secure session started.");closeModal()}
};
function bookingOpen(){booking={step:1,doctor:null,tz:null,date:null};openModal("#bookingModal");renderBooking()}
function renderBooking(){const c=$("#bookingContent");const step=booking.step;$(".steps").innerHTML=["Doctor","Timezone","Date","Confirm"].map((x,i)=>`<span class="${i+1===step?"active":""}">${String(i+1).padStart(2,"0")} ${x}</span>`).join("");
 if(step===1)c.innerHTML=`<p class="eyebrow">SELECT SPECIALIST</p><h2>Choose your doctor.</h2><div class="choice-grid">${doctors.map(d=>`<button class="choice" data-doc="${d.id}"><b>${d.name}</b><small>${d.role} · ${d.zone}</small></button>`).join("")}</div>`;
 if(step===2)c.innerHTML=`<p class="eyebrow">YOUR LOCAL TIME</p><h2>Choose a timezone.</h2><div class="choice-grid">${timezones.map(x=>`<button class="choice" data-tz="${x}"><b>${x.split(" — ")[0]}</b><small>${x.split(" — ")[1]}</small></button>`).join("")}</div><div class="booking-actions"><button class="btn btn-ghost" data-prev>Back</button></div>`;
 if(step===3)c.innerHTML=`<p class="eyebrow">PREFERRED DATE</p><h2>Pick your date.</h2><label>Appointment date<input id="dateInput" type="date" min="${new Date().toISOString().slice(0,10)}"></label><div class="booking-actions"><button class="btn btn-ghost" data-prev>Back</button><button class="btn btn-primary" id="dateNext">Continue</button></div>`;
 if(step===4)c.innerHTML=`<p class="eyebrow">FINAL REVIEW</p><h2>Confirm your slot.</h2><div class="dashboard-row"><b>${booking.doctor.name}</b><small>${booking.doctor.role}</small></div><div class="dashboard-row"><b>${booking.date}</b><small>${booking.tz}</small></div><p>By confirming, you agree this demonstration app will store the booking locally in your browser.</p><div class="booking-actions"><button class="btn btn-ghost" data-prev>Back</button><button class="btn btn-primary" id="confirmBooking">Confirm appointment</button></div>`;
 $$("[data-doc]").forEach(b=>b.onclick=()=>{booking.doctor=doctors.find(d=>d.id===b.dataset.doc);booking.step=2;renderBooking()});
 $$("[data-tz]").forEach(b=>b.onclick=()=>{booking.tz=b.dataset.tz;booking.step=3;renderBooking()});
 $$("[data-prev]").forEach(b=>b.onclick=()=>{booking.step=Math.max(1,booking.step-1);renderBooking()});
 $("#dateNext")?.addEventListener("click",()=>{const d=$("#dateInput").value;if(!d){toast("Choose a date first.");return}booking.date=d;booking.step=4;renderBooking()});
 $("#confirmBooking")?.addEventListener("click",()=>{if(!currentUser){toast("Please sign in before confirming your appointment.");closeModal();renderAuth();return}const all=store.get("apex_bookings",[]);const rec={id:crypto.randomUUID?.()||Date.now().toString(),email:currentUser.email,doctor:booking.doctor.name,role:booking.doctor.role,date:booking.date,tz:booking.tz,status:"Confirmed"};all.push(rec);store.set("apex_bookings",all);closeModal();toast("Appointment confirmed and saved locally.");renderDashboard()});
}
function renderDashboard(){if(!currentUser){renderAuth();return}const bs=store.get("apex_bookings",[]).filter(x=>x.email===currentUser.email);openModal("#dashboardModal");$("#dashboardContent").innerHTML=`<h2>${safe(currentUser.name||"Patient",80)}.</h2><p>${currentUser.email}</p><div class="dashboard-row"><b>Profile</b><small>Patient account · Secure local session</small></div><h3>Your appointments</h3>${bs.length?bs.map(x=>`<div class="dashboard-row"><b>${x.doctor}</b><small>${x.date} · ${x.tz}<br>${x.status} · ${x.role}</small></div>`).join(""):`<div class="dashboard-row"><b>No appointments yet.</b><small>Start a consultation to create your first booking.</small></div>`}<button class="btn btn-primary wide" id="dashBook">Book another appointment</button><button class="switch-link" id="logoutBtn">Sign out</button>`;$("#dashBook").onclick=bookingOpen;$("#logoutBtn").onclick=()=>{currentUser=null;localStorage.removeItem("apex_session");closeModal();toast("You have been signed out.")}}

function openBookingGuard(){if(currentUser)bookingOpen();else{toast("Sign in first to save an appointment.");renderAuth()}}
["#bookBtn","#heroBook","#drawerBook","#contactBook","#teleBtn","#treatBook"].forEach(s=>$(s).onclick=openBookingGuard);

$$(".treatment-tabs button").forEach(b=>b.onclick=()=>{ $$(".treatment-tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");const t=treatments[b.dataset.treatment];$("#treatEyebrow").textContent=t.ey;$("#treatTitle").textContent=t.title;$("#treatText").textContent=t.text;$("#treatPrice").textContent=t.price;$("#treatNote").textContent=t.note});

const consent=store.get("apex_consent",null);if(!consent)$("#cookieBanner").style.display="flex";else $("#cookieBanner").style.display="none";
function saveConsent(v){store.set("apex_consent",v);$("#cookieBanner").style.display="none";toast("Privacy preferences saved.")}
$("#acceptCookies").onclick=()=>saveConsent({essential:true,analytics:true,personalization:true});$("#declineCookies").onclick=()=>saveConsent({essential:true,analytics:false,personalization:false});$("#customCookies").onclick=()=>{const p=store.get("apex_consent",{analytics:false,personalization:false});$("#analyticsPref").checked=!!p.analytics;$("#personalPref").checked=!!p.personalization;openModal("#cookieModal")};$("#savePrefs").onclick=()=>{saveConsent({essential:true,analytics:$("#analyticsPref").checked,personalization:$("#personalPref").checked});closeModal()};

let idle;function resetIdle(){clearTimeout(idle);if(currentUser)idle=setTimeout(()=>{currentUser=null;localStorage.removeItem("apex_session");toast("Session expired for security. Please sign in again.")},30*60*1000)}["click","touchstart","keydown"].forEach(e=>document.addEventListener(e,resetIdle,{passive:true}));resetIdle();
