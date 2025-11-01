import { useState, useEffect } from "react";
import "./App.css";
import TrainInfo from "./TrainInfo";

function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Mise à jour l’heure toutes les secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard">
      {/* En-tête */}
      <header className="header">
        <div className="left">
          <img src="/logoaff.png" alt="Affinitic Logo" className="logo" />
        </div>
        <div className="center">
          <h1> Trains – Nivelles</h1>
        </div>
        <div className="right">
          <p className="clock">{time}</p>
        </div>
      </header>

      {/* Informations sur les trains */}
      <TrainInfo />
    </div>
  );
}

export default App;
