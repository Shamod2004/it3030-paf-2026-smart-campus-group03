import React, { useState } from "react";
import { createBooking } from "../services/api";

const CreateBookingPage = ({ defaultEmail }) => {
  const [form, setForm] = useState({
    resourceName: "",
    userEmail: defaultEmail || "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBooking({ ...form, attendees: Number(form.attendees) });
    alert("Booking Created!");
  };

return (
  <div className="page-center">

    <div className="glass-form">

      <h2 className="form-title">✨ Create Booking</h2>

      <form onSubmit={handleSubmit} className="form-grid">

        {/* RESOURCE FIXED */}
        <select name="resourceName" value={form.resourceName} onChange={handleChange}>
          <option value="">Select Resource</option>
          <option>Auditorium</option>
          <option>Conference Room</option>
          <option>Sports Hall</option>
          <option>Lab 1</option>
          <option>Lab 2</option>
        </select>

        <input
          type="email"
          name="userEmail"
          value={form.userEmail}
          onChange={handleChange}
          placeholder="Email"
        />

        <input type="date" name="date" onChange={handleChange} />

        <div className="row">
          <input type="time" name="startTime" onChange={handleChange} />
          <input type="time" name="endTime" onChange={handleChange} />
        </div>

        <input
          type="number"
          name="attendees"
          onChange={handleChange}
          placeholder="Attendees"
        />

        <textarea
          name="purpose"
          onChange={handleChange}
          placeholder="Purpose"
        />

        <button className="btn-primary">
          Create Booking
        </button>

      </form>
    </div>
  </div>
);
};

export default CreateBookingPage;