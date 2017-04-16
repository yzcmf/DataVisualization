import React from 'react';
import ReactDOM from 'react-dom';


import postcss from 'postcss';
import sass from './styles/styles.scss';
import App from './components/App.jsx';



const canvas = document.getElementById('app');

ReactDOM.render(
    <App/>, canvas);
