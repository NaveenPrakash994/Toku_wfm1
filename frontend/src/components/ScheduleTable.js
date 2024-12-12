import React, { useState, useEffect } from 'react';
import { getSchedule } from '../services/api';
import '../styles/ScheduleTable.css';

const ScheduleTable = ({ forecastData }) => {
    const [scheduleData, setScheduleData] = useState([]);
    const [numAgents, setNumAgents] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (forecastData && forecastData.length > 0) {
            handleGetSchedule();
        }
    }, [forecastData]);

    const handleGetSchedule = async () => {
        if (numAgents < 1) {
            setError("Number of agents must be at least 1");
            return;
        }

        setIsLoading(true);
        setError(null);

        const data = { 
            forecasted_calls: forecastData, 
            num_agents: numAgents 
        };

        try {
            const schedule = await getSchedule(data);
            setScheduleData(schedule);
        } catch (error) {
            setError(error.message || "Failed to generate schedule");
            setScheduleData([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="schedule-table">
            <h2>Staff Scheduling</h2>
            
            <div className="input-section">
                <label>Number of Agents</label>
                <input
                    type="number"
                    min="1"
                    value={numAgents}
                    onChange={(e) => setNumAgents(Math.max(1, Number(e.target.value)))}
                    disabled={isLoading}
                />
            </div>

            <button 
                onClick={handleGetSchedule} 
                disabled={isLoading || forecastData.length === 0}
                className="submit-button"
            >
                {isLoading 
                    ? "Generating Schedule..." 
                    : forecastData.length === 0 
                    ? "Generate Forecast First" 
                    : "Generate Schedule"
                }
            </button>

            {error && <div className="error-message">{error}</div>}

            <div className="schedule-results">
                {isLoading ? (
                    <div className="loading">
                        <div className="loading-spinner"></div>
                    </div>
                ) : scheduleData.length > 0 ? (
                    <div className="schedule-grid">
                        {scheduleData.map((week, index) => (
                            <div key={index} className="schedule-item">
                                <div className="schedule-item-header">Week {week.week}</div>
                                <div className="schedule-item-content">
                                    <p>
                                        <span>Agents Needed:</span> 
                                        {week.agents_needed}
                                    </p>
                                    <p>
                                        <span>Forecasted Calls:</span> 
                                        {week.forecasted_calls}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">No schedule generated</p>
                )}
            </div>
        </div>
    );
};

export default ScheduleTable;