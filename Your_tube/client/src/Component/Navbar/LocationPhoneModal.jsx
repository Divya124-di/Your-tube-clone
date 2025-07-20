// LocationPhoneModal.jsx
import React, { useState } from "react";
import "./Modal.css"; // style as needed

const LocationPhoneModal = ({ onSubmit }) => {
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pincode || !phone) return alert("All fields required");
    onSubmit({ pincode, phone });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>🔐 Enter Location & Phone</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
};

export default LocationPhoneModal;
