// !@MAIN FILE

import '@babel/polyfill'; // a package that makes new features of JS to work in old browsers
import { login, logout } from './login';

// DOM ELEMENTS
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');

// VALUES

// DELEGATION
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);
