import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { apihost, sockethost } from "./services/api";
import WholeApp from "./components/WholeApp";
import { io } from "socket.io-client";
import { AppProvider } from "./contexts/AppProvider";
import useLocalStorage from "./services/useLocalStorage";

axios.defaults.baseURL = apihost;
axios.defaults.withCredentials = false;
axios.interceptors.request.use(function (config) {
  const token = useLocalStorage("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

function App() {
  const [socket, setSocket] = useState();

  useEffect(() => {
    try {
      const newSocket = io(sockethost);
      setSocket(newSocket);
      return () => {
        newSocket?.close();
      };
    } catch (err) {
      return () => {};
    }
  }, []);

  return (
      <Router>
        <Routes>
          <Route exact path="/" element={<WholeApp socket={socket} />} />
          <Route exact path="/contacts" element={<WholeApp socket={socket} />} />
          <Route exact path="/:phone" element={<WholeApp socket={socket} />} />
          <Route exact path="*" element={<WholeApp socket={socket} />} />
        </Routes>
      </Router>
  );
}

export default App;
