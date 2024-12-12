import React, { useState } from 'react';
import ForecastChart from './components/ForecastChart';
import ScheduleTable from './components/ScheduleTable';
import './styles/App.css';

const App = () => {
  const [forecastData, setForecastData] = useState([]);

  return (
    <div className="App">
      {/* Header Section */}
      <header className="header">
        <h1>Toku Workforce management</h1>
      </header>

      {/* Main Content */}
      <div className="content">
        <ForecastChart setForecastData={setForecastData} />
        <ScheduleTable forecastData={forecastData} />
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2024 Toku. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
