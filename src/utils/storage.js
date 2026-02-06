const API_URL = 'http://localhost:3000/api/events';

// Convert to Async/Await pattern for API calls

export const fetchEvents = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch events');
        return await response.json();
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};

export const createEvent = async (event) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });
        if (!response.ok) throw new Error('Failed to create event');
        return await response.json(); // Returns updated list of events
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

export const updateEvent = async (updatedEvent) => {
    try {
        const response = await fetch(`${API_URL}/${updatedEvent.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEvent),
        });
        if (!response.ok) throw new Error('Failed to update event');
        return await response.json();
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

export const deleteEvent = async (eventId) => {
    try {
        const response = await fetch(`${API_URL}/${eventId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete event');
        return await response.json();
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};
