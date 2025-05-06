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
  alert("Sign-up successful! Please login.");
}

async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

window.addEventListener('DOMContentLoaded', async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    document.getElementById('auth').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
  }
});

async function saveWorkout() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Not logged in");

  const data = {
    user_id: user.id,
    date: document.getElementById('date').value,
    exercise: document.getElementById('exercise').value,
    weight: parseFloat(document.getElementById('weight').value),
    reps: parseInt(document.getElementById('reps').value),
    type: document.getElementById('type').value,
    comment: document.getElementById('comment').value,
  };

  const { error } = await supabase.from('workout_sets').insert([data]);
  if (error) return alert(error.message);
  alert("Workout set saved!");
}
