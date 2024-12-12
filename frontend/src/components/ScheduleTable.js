import React, { useState, useEffect } from 'react';
import { getSchedule } from '../services/api';

const ScheduleTable = ({ forecastData }) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [numAgents, setNumAgents] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Automatically generate schedule if forecast data changes
  useEffect(() => {
    if (forecastData && forecastData.length > 0) {
      handleGetSchedule();
    }
  }, [forecastData]);

  const handleGetSchedule = async () => {
    // Validate inputs
    if (numAgents < 1) {
      setError("Number of agents must be at least 1");
      return;
    }

    setIsLoading(true);
    setError(null);

    const data = { 
      forecasted_calls: forecastData.length > 0 
        ? forecastData 
        : [100, 150, 200, 180, 220],  // Fallback default
      num_agents: numAgents 
    };

    try {
      const schedule = await getSchedule(data);
      setScheduleData(schedule);
    } catch (error) {
      console.error("Error generating schedule:", error);
      setError(error.message || "Failed to generate schedule");
      setScheduleData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Staff Scheduling</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Agents
          </label>
          <input
            type="number"
            min="1"
            value={numAgents}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              setNumAgents(value);
            }}
            placeholder="Number of Agents"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="flex space-x-2">
        <button 
          onClick={handleGetSchedule} 
          className="flex-grow p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          disabled={isLoading || forecastData.length === 0}
        >
          {isLoading 
            ? "Generating Schedule..." 
            : forecastData.length === 0 
              ? "Generate Forecast First" 
              : "Generate Schedule"
          }
        </button>
      </div>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Schedule:</h3>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : scheduleData.length > 0 ? (
          <div className="grid grid-cols-5 gap-2">
            {scheduleData.map((week, index) => (
              <div 
                key={index} 
                className="bg-green-100 p-2 rounded text-center shadow-sm"
              >
                <span className="font-bold text-sm">Week {week.week}</span>
                <p className="text-green-800 font-semibold">
                  {week.agents_needed} agents
                </p>
                <p className="text-xs text-gray-600">
                  {week.forecasted_calls} calls
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            {forecastData.length === 0 
              ? "Generate forecast first" 
              : "No schedule generated"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ScheduleTable;