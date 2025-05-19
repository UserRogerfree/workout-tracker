// Supabase initialization
const SUPABASE_URL = "https://sqtizbrsjgjtlconmzcf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdGl6YnJzamdqdGxjb25temNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MjI2MzQsImV4cCI6MjA2MTQ5ODYzNH0.BY5_HiLu3Gt7sGylN5xC1UX7S2kiPe-FkOYcU166BdE";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
  location.reload();
}

async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) return alert(error.message);
  alert("Sign-up successful!");
}

async function logout() {
  await supabaseClient.auth.signOut();
  location.reload();
}

function addExercise() {
  const container = document.getElementById('workout-area');
  const exercise = document.createElement('div');
  exercise.className = 'exercise-block';
  exercise.innerHTML = `
    <input type="text" placeholder="Exercise Name" class="input-field">
    <div class="set-row">
      <input type="number" placeholder="Weight (kg)" class="input-field">
      <input type="number" placeholder="Reps" class="input-field">
      <select class="input-field">
        <option>Standard</option>
        <option>Drop Set</option>
        <option>Super Set</option>
      </select>
      <textarea placeholder="Comment" class="input-field"></textarea>
      <button class="complete-btn action-btn" onclick="startRest(this)">✓</button>
    </div>
  `;
  container.appendChild(exercise);
}

function startRest(btn) {
  const modal = document.getElementById('ad-modal');
  const timerDisplay = document.getElementById('ad-timer');
  modal.classList.add('active');
  let seconds = 120;
  const interval = setInterval(() => {
    const m = Math.floor(seconds / 60);
    const s = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `Rest: ${m}:${s}`;
    if (seconds-- <= 0) {
      clearInterval(interval);
      modal.classList.remove('active');
      btn.focus();
    }
  }, 1000);
}

window.addEventListener('DOMContentLoaded', async () => {
  // Ensure ad modal is hidden
  document.getElementById('ad-modal').classList.remove('active');
  // Authentication check
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (user) {
    document.getElementById('auth').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
  }
});
