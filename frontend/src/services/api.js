const BASE_URL = "http://localhost:8000";

// Function to get forecast data
export const getForecast = async (data) => {
  try {
    const payload = {
      num_weeks: data.end_week - data.start_week + 1
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
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const result = await response.json();
    return result.predictions;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
};

// Function to get schedule data
export const getSchedule = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const result = await response.json();
    return result.schedule;
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    throw error;
  }
};
