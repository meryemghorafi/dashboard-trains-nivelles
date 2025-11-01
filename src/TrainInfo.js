// Importation des fonctions React nécessaires
import { useEffect, useState } from "react";

function TrainInfo() {
  // Déclaration des états (variables React)
  const [departures, setDepartures] = useState([]); // liste des départs
  const [arrivals, setArrivals] = useState([]); // liste des arrivées
  const [stats, setStats] = useState({ avgDelayNextHour: 0, cancelledPercentLast3h: 0 }); // statistiques
  const [loading, setLoading] = useState(true); // indicateur de chargement
  const [lastUpdate, setLastUpdate] = useState(null); // heure de la dernière mise à jour

  const STATION = "Nivelles"; // gare principale

  // useEffect = exécuter le code au chargement du composant
  useEffect(() => {
    // Fonction principale pour récupérer les données
    async function loadData() {
      setLoading(true); // affiche "chargement..."
      try {
        // URLs de l’API iRail (départs et arrivées)
        const depUrl = `https://api.irail.be/liveboard/?station=${STATION}&arrdep=departure&format=json`;
        const arrUrl = `https://api.irail.be/liveboard/?station=${STATION}&arrdep=arrival&format=json`;

        // On fait les 2 requêtes API en parallèle
        const [depRes, arrRes] = await Promise.all([fetch(depUrl), fetch(arrUrl)]);
        const depData = await depRes.json();
        const arrData = await arrRes.json();

        const now = Date.now(); // heure actuelle
        const twoHours = 2 * 60 * 60 * 1000; // 2 heures
        const oneHour = 60 * 60 * 1000; // 1 heure
        const threeHours = 3 * 60 * 60 * 1000; // 3 heures

        // Filtre pour ne garder que les trains vers Bruxelles ou Charleroi
        const isBruxellesOrCharleroi = (name) => {
          if (!name) return false;
          const lower = name.toLowerCase();
          return lower.includes("bruxelles") || lower.includes("brussel") || lower.includes("charleroi");
        };

        // Liste des départs dans les 2 prochaines heures
        const dep = (depData.departures?.departure || [])
          .filter((t) => t.time * 1000 > now && t.time * 1000 < now + twoHours) // dans les 2 prochaines heures
          .filter((t) => isBruxellesOrCharleroi(t.station) || isBruxellesOrCharleroi(t.direction)); // filtre des lignes

        // Liste des arrivées dans les 2 prochaines heures
        const arr = (arrData.arrivals?.arrival || [])
          .filter((t) => t.time * 1000 > now && t.time * 1000 < now + twoHours)
          .filter((t) => isBruxellesOrCharleroi(t.station) || isBruxellesOrCharleroi(t.direction));

        // Mise à jour des états
        setDepartures(dep);
        setArrivals(arr);

        // Calcul des statistiques :
        // Moyenne des retards sur la prochaine heure
        const nextHour = [
          ...dep.filter((t) => t.time * 1000 < now + oneHour),
          ...arr.filter((t) => t.time * 1000 < now + oneHour),
        ];

        const delays = nextHour.map((t) => (Number(t.delay) || 0) / 60); // secondes → minutes
        const avgDelay =
          delays.length > 0 ? (delays.reduce((a, b) => a + b, 0) / delays.length).toFixed(1) : "0.0";

        // Pourcentage de trains annulés sur les 3 dernières heures
        const recent = [
          ...dep.filter((t) => t.time * 1000 > now - threeHours),
          ...arr.filter((t) => t.time * 1000 > now - threeHours),
        ];

        const cancelled = recent.filter((t) => String(t.canceled) === "1").length;
        const cancelledPercent =
          recent.length > 0 ? ((cancelled / recent.length) * 100).toFixed(1) : "0.0";

        // Mise à jour des stats et de l’heure
        setStats({ avgDelayNextHour: avgDelay, cancelledPercentLast3h: cancelledPercent });
        setLastUpdate(new Date());
      } catch (e) {
        console.error("Erreur API iRail :", e);
      }
      setLoading(false);
    }

    // Exécuter la fonction immédiatement
    loadData();

    // Mettre à jour automatiquement toutes les 60 secondes
    const timer = setInterval(loadData, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Partie affichage HTML
  return (
    <div>
      <h2>🚉 Trains Bruxelles ↔ Nivelles ↔ Charleroi (prochaines 2 h)</h2>

      {/* Affiche l’heure de mise à jour */}
      {lastUpdate && (
        <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
          Dernière mise à jour : {lastUpdate.toLocaleTimeString()}
        </p>
      )}

      {loading && <p>Chargement...</p>}

      {/* Liste des départs */}
      <h3>Départs depuis Nivelles</h3>
      {departures.length === 0 ? (
        <p>Aucun départ trouvé.</p>
      ) : (
        <div className="train-list">
          {departures.map((t, i) => (
            <div
            key={i}
            className={`train-item ${
              t.canceled === "1"
                ? "cancelled" // 🔴 si annulé
                : Number(t.delay) / 60 > 5
                ? "late" // 🟠 si retard > 5 min
                : ""
            }`}
          >
              <p><strong>Destination :</strong> {t.station || t.direction}</p>
              <p><strong>Heure :</strong> {new Date(t.time * 1000).toLocaleTimeString()}</p>
              <p><strong>Retard :</strong> {Math.round(t.delay / 60)} min</p>
              <p><strong>Annulé :</strong> {t.canceled === "1" ? "Oui" : "Non"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Liste des arrivées */}
      <h3>Arrivées à Nivelles</h3>
      {arrivals.length === 0 ? (
        <p>Aucune arrivée trouvée.</p>
      ) : (
        <div className="train-list">
          {arrivals.map((t, i) => (
            <div
              key={i}
              className={`train-item ${Number(t.delay) / 60 > 5 ? "late" : ""}`}
            >
              <p><strong>Provenance :</strong> {t.station || t.direction}</p>
              <p><strong>Heure :</strong> {new Date(t.time * 1000).toLocaleTimeString()}</p>
              <p><strong>Retard :</strong> {Math.round(t.delay / 60)} min</p>
              <p><strong>Annulé :</strong> {t.canceled === "1" ? "Oui" : "Non"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Statistiques */}
      <div className="stats">
        <h3>📊 Statistiques</h3>
        <p>Retard moyen (1 h) : {stats.avgDelayNextHour} min</p>
        <p>Taux d’annulation (3 h) : {stats.cancelledPercentLast3h}%</p>
      </div>
    </div>
  );
}

export default TrainInfo;
