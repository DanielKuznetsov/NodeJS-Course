import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
  try {
    const result = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
    });

    if (result.data.status === 'success') {
      showAlert('success', 'Data updated succesfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
