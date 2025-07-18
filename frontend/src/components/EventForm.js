import React, { useState, useEffect } from 'react';
import './EventForm.css';

const EventForm = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  const fetchEvents = async () => {
    try {
      // Use absolute path now that backend CORS is configured
      const res = await fetch('https://eventplannerfunctions-tan.azurewebsites.net/api/EventFunction');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: eventName,
      date: eventDate,
      location,
    };

    try {
      const res = await fetch('https://eventplannerfunctions-tan.azurewebsites.net/api/EventFunction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newEvent = await res.json();
        setEvents((prev) => [...prev, newEvent]);
        setMessage('Event created successfully!');
        setEventName('');
        setEventDate('');
        setLocation('');
      } else {
        const errorText = await res.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="event-container">
      <h1>Create an Event</h1>
      <form className="event-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button type="submit">Create Event</button>
      </form>
      {message && <p className="message">{message}</p>}
      <h2>Upcoming Events</h2>
      <ul className="event-list">
        {events.map((ev) => (
          <li key={ev.id} className="event-item">
            <span className="event-name">{ev.name}</span>
            <span className="event-date">{new Date(ev.date).toLocaleDateString()}</span>
            <span className="event-location">{ev.location}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventForm; 