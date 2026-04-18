import React, { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus } from "../services/api";
import AdminBookingCard from "../Components/Booking/AdminBookingCard";

const AdminBookingPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getAllBookings().then(setBookings);
  }, []);

  const handleApprove = async (id) => {
    await updateBookingStatus(id, "APPROVED");
    setBookings(prev =>
      prev.map(b => b.id === id ? { ...b, status: "APPROVED" } : b)
    );
  };

  const handleReject = async (id) => {
    await updateBookingStatus(id, "REJECTED");
    setBookings(prev =>
      prev.map(b => b.id === id ? { ...b, status: "REJECTED" } : b)
    );
  };

 return (
  <div>

    <h2 style={{ marginBottom: "15px" }}>🛠 Admin Panel</h2>

    <div className="grid">
      {bookings.map(b => (
        <AdminBookingCard
          key={b.id}
          booking={b}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>

  </div>
);
};

export default AdminBookingPage;