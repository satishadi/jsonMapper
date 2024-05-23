import React from 'react';
import {  Route, Link, Routes, BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import JsonMapper from './components/JsonMapper';
import JsonEditor from './components/JsonEditor';
import Home from './components/Home';



const App = () => {
  return (
    <BrowserRouter>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
       
          <div className="collapse navbar-collapse ml-auto" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link mx-2" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/json-editor">Json Editor</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/json-mapper">Json Mapper</Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container mt-3">
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route path="/json-editor" element={<JsonEditor/>} />
            <Route path="/json-mapper" element={<JsonMapper/>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
