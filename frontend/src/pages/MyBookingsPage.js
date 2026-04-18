import React, { useEffect, useState } from "react";
import { getAllBookings, cancelBooking } from "../services/api";
import MyBookingCard from "../Components/Booking/MyBookingCard";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getAllBookings().then(setBookings);
  }, []);

  const handleCancel = async (id) => {
    await cancelBooking(id);
    setBookings(prev =>
      prev.map(b => b.id === id ? { ...b, status: "CANCELLED" } : b)
    );
  };

  return (
  <div>

    <h2 style={{ marginBottom: "15px" }}>📅 My Bookings</h2>

    <div className="grid">
      {bookings.map(b => (
        <MyBookingCard
          key={b.id}
          booking={b}
          onCancel={handleCancel}
        />
      ))}
    </div>

  </div>
);
};

export default MyBookingsPage;