const login = async (email, password) => {
  console.log(email, password);

  try {
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email, // called this way because our database is expecting to see this name as an input
        password,
      },
    });

    console.log(result);
  } catch (err) {
    console.log(err.response.data);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.querySelector('#email');
  const password = document.querySelector('#password');

  login(email.value, password.value);
});
