async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
  location.reload();
}
async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);
  alert("Sign-up successful!");
}
async function logout() {
  await supabase.auth.signOut();
  location.reload();
}
function addExercise() {
  const container = document.getElementById('workout-area');
  const exercise = document.createElement('div');
  exercise.className = 'exercise-block';
  exercise.innerHTML = `
    <input type="text" placeholder="Exercise Name" class="input-field">
    <div class="set-row">
      <input type="number" placeholder="Weight" class="input-field">
      <input type="number" placeholder="Reps" class="input-field">
      <select class="input-field">
        <option>Standard</option>
        <option>Drop Set</option>
        <option>Super Set</option>
      </select>
      <textarea placeholder="Comment" class="input-field"></textarea>
      <button class="complete-btn" onclick="startRest(this)">✓</button>
    </div>
  `;
  container.appendChild(exercise);
}
function startRest(btn) {
  const modal = document.getElementById('ad-modal');
  const timerDisplay = document.getElementById('ad-timer');
  modal.classList.remove('hidden');
  let seconds = 120;

  const interval = setInterval(() => {
    const m = Math.floor(seconds / 60);
    const s = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `Rest: ${m}:${s}`;

    if (seconds-- <= 0) {
      clearInterval(interval);
      modal.classList.add('hidden');  // 確実に広告を閉じる処理
    }
  }, 1000);
}
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ad-modal').classList.add('hidden');  // 初期化時に広告を非表示に設定
});
