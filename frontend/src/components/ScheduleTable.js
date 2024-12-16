import React, { useState, useEffect } from 'react';
import { getSchedule } from '../services/api';
import '../styles/ScheduleTable.css';

const ScheduleTable = ({ forecastData }) => {
    const [scheduleData, setScheduleData] = useState([]);
    const [numAgents, setNumAgents] = useState(10);
    const [maxCallsPerAgent, setMaxCallsPerAgent] = useState(40);
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
        
        // Prepare the data with forecasted calls and number of agents
        const data = {
            forecasted_calls: forecastData,
            num_agents: numAgents,
            max_calls_per_agent: maxCallsPerAgent
        };
        
        try {
            // Call the API to generate schedule
            const schedule = await getSchedule(data);
            
            // Directly use the backend's scheduling results
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
                <div>
                    <label>Total Available Agents</label>
                    <input
                        type="number"
                        min="1"
                        value={numAgents}
                        onChange={(e) => setNumAgents(Math.max(1, Number(e.target.value)))}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label>Max Calls per Agent</label>
                    <input
                        type="number"
                        min="10"
                        value={maxCallsPerAgent}
                        onChange={(e) => setMaxCallsPerAgent(Math.max(10, Number(e.target.value)))}
                        disabled={isLoading}
                    />
                </div>
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
                        {scheduleData.map((block, index) => (
                            <div key={index} className="schedule-item">
                                <div className="schedule-item-header">Week {block.week} Shift {block.shift}</div>
                                <div className="schedule-item-content">
                                    <p>
                                        <span>Agents Needed:</span> 
                                        {block.agents_needed}
                                    </p>
                                    <p>
                                        <span>Forecasted Calls:</span> 
                                        {block.forecasted_calls}
                                    </p>
                                    <p>
                                        <span>Calls per Agent:</span> 
                                        {block.calls_per_agent}
                                    </p>
                                    <p>
                                        <span>Load Percentage:</span> 
                                        {block.load_percentage}%
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