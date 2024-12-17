const BASE_URL = "http://localhost:8000";
export const getForecast = async (data) => {
  try {
    const payload = {
      start_week: data.start_week,
      end_week: data.end_week,
      num_weeks: data.end_week - data.start_week + 1 // Calculate the number of weeks
    };

    const response = await fetch(`${BASE_URL}/forecast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Full error response:', errorText); // Log the full error response
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Forecast response:', result);  // Log the response to inspect the structure
    return result.predictions;  // Return the predictions from the response
  } catch (error) {
    console.error("Error fetching forecast data:", error);  // Log the error
    throw error;  // Throw the error for further handling in the component
  }
};


export const getSchedule = async (data) => {
  try {
    const payload = {
      forecasted_calls: data.forecasted_calls,
      num_agents: data.num_agents,
      max_calls_per_agent: data.max_calls_per_agent || 40
    };

    const response = await fetch(`${BASE_URL}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Full error response:', errorText);
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Schedule response:', result);
    return result.schedule;
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    throw error;
  }
};