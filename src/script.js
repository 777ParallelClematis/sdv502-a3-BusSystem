export function initBookingForm() {
  const form = document.getElementById("bookingForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const destination = document.getElementById("destination").value;
    let seats = Math.floor(Number(document.getElementById("seats").value));
    const pricePerSeat = 10;
    if (name && destination && seats > 0) {
      const totalFare = seats * pricePerSeat;
      document.getElementById("message").innerText = `Booking confirmed for ${name} to ${destination}. Seats: ${seats}. Total fare: $${totalFare}.`;
    } else {
      document.getElementById("message").innerText = "Please fill in all fields correctly.";
    }
  });
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", initBookingForm);
}