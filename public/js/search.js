document.addEventListener("DOMContentLoaded", function () {

  const whereBtn = document.getElementById("whereBtn");
  const dateBtn = document.getElementById("dateBtn");
  const guestBtn = document.getElementById("guestBtn");

  const destinationPanel = document.getElementById("destinationPanel");
  const guestPanel = document.getElementById("guestPanel");

  // ================= DESTINATION PANEL =================
  if (whereBtn && destinationPanel) {
    whereBtn.onclick = () => {
      destinationPanel.style.display =
        destinationPanel.style.display === "block" ? "none" : "block";
    };
  }

  document.querySelectorAll(".dest-item").forEach(item => {
    item.onclick = () => {
      document.getElementById("destinationText").innerText = item.innerText;
      document.getElementById("destinationInput").value = item.innerText;
      destinationPanel.style.display = "none";
    };
  });

  // ================= FLATPICKR =================
  if (typeof flatpickr !== "undefined") {

    const fp = flatpickr("#dateRange", {
      mode: "range",
      minDate: "today",
      animate: true,
      onClose: function (selectedDates, dateStr) {
        if (selectedDates.length === 2) {
          const checkIn = selectedDates[0];
          const checkOut = selectedDates[1];

          document.getElementById("dateText").innerText = dateStr;

          document.getElementById("checkinInput").value =
            checkIn.toISOString().split("T")[0];

          document.getElementById("checkoutInput").value =
            checkOut.toISOString().split("T")[0];
        }
      }
    });

    if (dateBtn) {
      dateBtn.onclick = () => {
        fp.open();
      };
    }
  }

  // ================= GUEST PANEL =================
  if (guestBtn && guestPanel) {
    guestBtn.onclick = () => {
      guestPanel.style.display =
        guestPanel.style.display === "block" ? "none" : "block";
    };
  }

  // ================= GUEST COUNTER =================
  window.changeGuest = function (type, amount) {

    let el = document.getElementById(type);
    let value = parseInt(el.innerText);
    value = Math.max(0, value + amount);
    el.innerText = value;

    let adults = parseInt(document.getElementById("adults").innerText);
    let children = parseInt(document.getElementById("children").innerText);

    let totalGuests = adults + children;

    document.getElementById("guestText").innerText =
      totalGuests > 0 ? `${totalGuests} guests` : "Add guests";

    document.getElementById("guestInput").value = totalGuests;
  };

});