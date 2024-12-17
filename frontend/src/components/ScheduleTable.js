import React, { useState, useEffect } from 'react';
import { getSchedule } from '../services/api';
import '../styles/ScheduleTable.css';

const ScheduleTable = ({ forecastData }) => {
    const [scheduleData, setScheduleData] = useState([]);
    const [numAgents, setNumAgents] = useState('');
    const [maxCallsPerAgent, setMaxCallsPerAgent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleGetSchedule = async () => {
        // Validate inputs
        if (!forecastData || forecastData.length === 0) {
            setError("No forecast data available. Please generate forecast first.");
            return;
        }
        
        if (!numAgents || numAgents < 1) {
            setError("Number of agents must be at least 1");
            return;
        }
        
        if (!maxCallsPerAgent || maxCallsPerAgent < 10) {
            setError("Max calls per agent must be at least 10");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        // Prepare the data with forecasted calls and number of agents
        const data = {
            forecasted_calls: forecastData,
            num_agents: parseInt(numAgents),
            max_calls_per_agent: parseInt(maxCallsPerAgent)
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
                        placeholder="Number of agents"
                        value={numAgents}
                        onChange={(e) => setNumAgents(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label>Max Calls per Agent</label>
                    <input
                        type="number"
                        min="10"
                        placeholder="Maximum calls per agent"
                        value={maxCallsPerAgent}
                        onChange={(e) => setMaxCallsPerAgent(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <button 
                onClick={handleGetSchedule} 
                disabled={isLoading || !forecastData || forecastData.length === 0}
                className="submit-button"
            >
                {isLoading 
                    ? "Generating Schedule..." 
                    : !forecastData || forecastData.length === 0
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
                    <p className="text-center">
                        {!forecastData || forecastData.length === 0 
                            ? "Generate forecast data first" 
                            : "Click 'Generate Schedule' to create staff schedule"
                        }
                    </p>
                )}
            </div>
        </div>
    );
};

export default ScheduleTable;