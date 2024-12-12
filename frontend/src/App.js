import React, { useState } from "react";
import ForecastChart from "./components/ForecastChart";
import ScheduleTable from "./components/ScheduleTable";

function App() {
  const [forecastData, setForecastData] = useState([]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Workforce Management Dashboard</h1>
      <ForecastChart setForecastData={setForecastData} />
      <ScheduleTable forecastData={forecastData} />
    </div>
  );
}

export default App;