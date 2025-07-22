// Supabase init - replace with your values
const SUPABASE_URL = "https://sqtizbrsjgjtlconmzcf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdGl6YnJzamdqdGxjb25temNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MjI2MzQsImV4cCI6MjA2MTQ5ODYzNH0.BY5_HiLu3Gt7sGylN5xC1UX7S2kiPe-FkOYcU166BdE";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dark mode toggle
const toggle = document.getElementById('mode-toggle');
toggle.addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
});
window.addEventListener('DOMContentLoaded', async () => {
  document.documentElement.setAttribute('data-theme', localStorage.getItem('theme')||'light');
  document.getElementById('ad-modal').classList.remove('active');
  const { data:{user} } = await supabaseClient.auth.getUser();
  if(user){ document.getElementById('auth').classList.add('hidden'); document.getElementById('app').classList.remove('hidden'); initApp(); }
});

// Initialize app
async function initApp(){
  document.getElementById('date').value = new Date().toISOString().split('T')[0];
  await loadHistory();
}

// Auth
async function login(){
  const email=document.getElementById('email').value, password=document.getElementById('password').value;
  const {error} = await supabaseClient.auth.signInWithPassword({email,password});
  if(error){alert(error.message);return;}
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  initApp();
}
async function signup(){
  const email=document.getElementById('email').value, password=document.getElementById('password').value;
  const {error} = await supabaseClient.auth.signUp({email,password});
  if(error){alert(error.message);return;}
  alert("Sign-up successful! Please confirm via email.");
}
async function logout(){
  await supabaseClient.auth.signOut();
  window.location.reload();
}

// Add exercise
function addExercise(){
  const container=document.getElementById('workout-area');
  const id=Date.now();
  const block=document.createElement('div');block.className='exercise-block';block.dataset.id=id;
  block.innerHTML=`
    <input type="text" placeholder="Exercise Name" class="input-field name">
    <div class="set-row">
      <input type="number" placeholder="Weight" class="input-field weight">
      <input type="number" placeholder="Reps" class="input-field reps">
      <select class="input-field type">
        <option>Standard</option><option>Drop Set</option><option>Super Set</option>
      </select>
      <textarea placeholder="Comment" class="input-field comment"></textarea>
      <button class="btn tertiary memo-btn" onclick="editMemo(${id})">Memo</button>
      <button class="btn primary complete-btn" onclick="saveSet(${id})">Save</button>
    </div>
  `;
  container.appendChild(block);
}

// Save set
async function saveSet(id){
  const block=document.querySelector(`[data-id="${id}"]`);
  const name=block.querySelector('.name').value, weight=+block.querySelector('.weight').value;
  const reps=+block.querySelector('.reps').value, type=block.querySelector('.type').value;
  const comment=block.querySelector('.comment').value; const date=document.getElementById('date').value;
  if(!name||!weight||!reps){alert('Fill required');return;}
  await supabaseClient.from('workout_sets').upsert({id,name,weight,reps,type,comment,date});
  loadHistory();
}

// Edit memo
async function editMemo(id){
  const {data}=await supabaseClient.from('workout_sets').select('memo').eq('id',id).single();
  const m=prompt('Memo:',data.memo||'');
  if(m!==null){ await supabaseClient.from('workout_sets').update({memo:m}).eq('id',id); loadHistory(); }
}

// Load history, summary, chart
async function loadHistory(){
  const date=document.getElementById('date').value;
  const {data:sets} = await supabaseClient.from('workout_sets').select('*').eq('date',date);
  renderSets(sets); renderSummary(sets); renderChart(sets);
}

// Render sets
function renderSets(sets){
  const c=document.getElementById('workout-area'); c.innerHTML='';
  sets.forEach(s=>{
    const b=document.createElement('div');b.className='exercise-block';
    b.innerHTML=`<div>${s.name} - ${s.weight}kg x ${s.reps} (${s.type})</div>
    <div>${s.comment||''}</div><div>Memo: ${s.memo||''}</div>`;
    c.appendChild(b);
  });
}

// Summary
function renderSummary(sets){
  const total=sets.length, volume=sets.reduce((a,s)=>a+s.weight*s.reps,0);
  document.getElementById('summary').innerHTML=`<div>Total Sets: <strong>${total}</strong></div>
  <div>Total Volume: <strong>${volume}</strong></div>`;
}

// Chart
function renderChart(sets){
  const ctx=document.getElementById('progress-chart').getContext('2d');
  const grouped={};
  sets.forEach(s=>{grouped[s.name]=(grouped[s.name]||[]).concat({x:s.date,y:s.weight});});
  const datasets=Object.keys(grouped).map(n=>({label:n,data:grouped[n],fill:false,borderWidth:2}));
  if(window.myChart)window.myChart.destroy();
  window.myChart=new Chart(ctx,{type:'line',data:{datasets},options:{scales:{x:{type:'time',time:{unit:'day'}},y:{beginAtZero:true}}}});
}
