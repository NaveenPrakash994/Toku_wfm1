import React, { useState } from 'react';
import { getForecast } from '../services/api';

const ForecastChart = ({ setForecastData }) => {
  const [startWeek, setStartWeek] = useState(1);
  const [endWeek, setEndWeek] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localForecastData, setLocalForecastData] = useState([]);

  const handleGetForecast = async () => {
    // Validate input
    if (endWeek < startWeek) {
      setError("End week must be greater than or equal to start week");
      return;
    }

    setIsLoading(true);
    setError(null);

    const data = {
      start_week: Number(startWeek),
      end_week: Number(endWeek)
    };

    try {
      const predictions = await getForecast(data);

      if (Array.isArray(predictions)) {
        // Round predictions to whole numbers
        const roundedPredictions = predictions.map(pred => Math.round(pred));
        
        setForecastData(roundedPredictions);
        setLocalForecastData(roundedPredictions);
      } else {
        throw new Error("Received invalid prediction format");
      }
    } catch (error) {
      console.error("Forecast request error:", error);
      setError(error.message || "Failed to fetch forecast");
      setForecastData([]);
      setLocalForecastData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Workforce Forecast</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Week</label>
          <input
            type="number"
            min="1"
            value={startWeek}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              setStartWeek(value);
            }}
            placeholder="Start Week"
            disabled={isLoading}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Week</label>
          <input
            type="number"
            min="1"
            value={endWeek}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              setEndWeek(value);
            }}
            placeholder="End Week"
            disabled={isLoading}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={handleGetForecast}
        disabled={isLoading}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        {isLoading ? "Loading Forecast..." : "Get Forecast"}
      </button>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Predictions:</h3>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : localForecastData.length > 0 ? (
          <div className="grid grid-cols-5 gap-2">
            {localForecastData.map((prediction, index) => (
              <div
                key={index}
                className="bg-blue-100 p-2 rounded text-center shadow-sm"
              >
                <span className="font-bold text-sm">Week {index + 1}</span>
                <p className="text-blue-800 font-semibold">{prediction}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No predictions available</p>
        )}
      </div>
    </div>
  );
};

export default ForecastChart;