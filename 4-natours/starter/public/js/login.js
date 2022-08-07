import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  // console.log(email, password);

  try {
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email, // called this way because our database is expecting to see this name as an input
        password,
      },
    });

    if (result.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');

      window.setTimeout(() => {
        location.assign('/'); // ! in order to reload/load a page
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
