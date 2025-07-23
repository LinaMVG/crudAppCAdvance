const URL_BACK = '{{URL_BACK}}';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${URL_BACK}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message); // Aquí podrías redirigir a otra página
      window.location.href = 'index.html'; // Redirigir al index después del login exitoso
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
  }
});
