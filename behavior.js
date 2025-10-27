
// === PROMOS ===

const promolist = {
  promos :  [ { code: "FLYHIGH", discount: 0.10}, 
          {code : "RACETOHEAVEN", discount: 0.20},
          {code : "SKYHIGH", discount: 0.15}
             ]
};

// === Sample flight data ===
const flights = {
  oneway: [
    { flightNo: "5J560", from: "Manila", to: "Cebu", time: "8:00 AM", date: "2025-10-20", price: 2500, seats: 20, hours: 1.5, fareType: "Promo Fare" },
    { flightNo: "PR312", from: "Manila", to: "Davao", time: "10:30 PM", date: "2025-10-21", price: 3200, seats: 15, hours: 2, fareType: "Regular" },
    { flightNo: "DG234", from: "Manila", to: "Bohol", time: "1:00 PM", date: "2025-10-22", price: 2800, seats: 12, hours: 1.25, fareType: "Promo Fare" },
    { flightNo: "5B520", from: "Davao", to: "Cebu", time: "7:00 AM", date: "2025-10-20", price: 2500, seats: 20, hours: 1.5, fareType: "Promo Fare" },
    { flightNo: "PR423", from: "Manila", to: "Iloilo", time: "10:30 PM", date: "2025-10-21", price: 3200, seats: 15, hours: 2, fareType: "Regular" },
    { flightNo: "DG253", from: "Iloilo", to: "Bohol", time: "3:00 PM", date: "2025-10-22", price: 2800, seats: 12, hours: 1.25, fareType: "Promo Fare" },
    { flightNo: "NX101", from: "Manila", to: "Cagayan De Oro", time: "6:15 AM", date: "2025-10-20", price: 3000, seats: 18, hours: 2.0, fareType: "Regular" },
    { flightNo: "AV202", from: "Manila", to: "Iloilo", time: "9:45 AM", date: "2025-10-23", price: 2700, seats: 10, hours: 1.75, fareType: "Promo Fare" },
    { flightNo: "CB305", from: "Cebu", to: "Bacolod", time: "2:30 PM", date: "2025-10-24", price: 2100, seats: 14, hours: 1.25, fareType: "Regular" },
    { flightNo: "CL410", from: "Clark", to: "Manila", time: "4:00 PM", date: "2025-10-20", price: 1200, seats: 25, hours: 0.75, fareType: "Promo Fare" },
    { flightNo: "PH550", from: "Manila", to: "Boracay", time: "12:30 PM", date: "2025-10-22", price: 3500, seats: 8, hours: 1.5, fareType: "Regular" }
  ],
  roundtrip: [
    { flightNo: "5J560", from: "Manila", to: "Cebu", depart: "2025-10-20", return: "2025-10-25", price: 4500, seats: 20, hours: 1.5, fareType: "Promo Fare" },
    { flightNo: "PR312", from: "Manila", to: "Davao", depart: "2025-10-21", return: "2025-10-26", price: 5200, seats: 15, hours: 2, fareType: "Regular" },
    { flightNo: "DG234", from: "Manila", to: "Bohol", depart: "2025-10-22", return: "2025-10-27", price: 4800, seats: 12, hours: 1.25, fareType: "Promo Fare" },
    { flightNo: "NX201", from: "Manila", to: "Cagayan De Oro", depart: "2025-10-20", return: "2025-10-24", price: 5800, seats: 16, hours: 2.0, fareType: "Regular" },
    { flightNo: "AV402", from: "Manila", to: "Iloilo", depart: "2025-10-23", return: "2025-10-28", price: 5100, seats: 10, hours: 1.75, fareType: "Promo Fare" },
    { flightNo: "CL510", from: "Clark", to: "Manila", depart: "2025-10-20", return: "2025-10-21", price: 2300, seats: 22, hours: 0.75, fareType: "Promo Fare" }
  ]
};

let selectedFlight = null;
let bookingInfo = {};
let bookedFlights = []; // store already selected flights

// === Handle Roundtrip visibility ===
document.querySelectorAll('input[name="flightType"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const isRoundTrip = document.querySelector('input[value="roundtrip"]').checked;
    document.getElementById('returnDateLabel').style.display = isRoundTrip ? 'block' : 'none';
  });
});

// === pagbutang ug info sa booking ===
document.getElementById('searchFlightBtn').addEventListener('click', () => {
  const from = document.getElementById('from').value.trim();
  const to = document.getElementById('to').value.trim();
  const flightType = document.querySelector('input[name="flightType"]:checked').value;
  const departDate = document.getElementById('departDate').value;
  const returnDate = document.getElementById('returnDate').value;
  const passengers = document.getElementById('passengers').value;

  if (!from || !to || !departDate) {
    alert("Please fill all required fields.");
    return;
  }

  bookingInfo = { from, to, flightType, departDate, returnDate, passengers };

  showStep('flight-section');
  displayFlights(flightType);
});

// === diri naka array ang flight or gi display depende sa condition ===
function displayFlights(type) {
  const list = document.getElementById('flightList');
  list.innerHTML = '';
  document.getElementById('toBillingBtn').style.display = 'none'; // hide billing btn first

  flights[type].forEach(f => {
    const matchesRoute =
      f.from.toLowerCase() === bookingInfo.from.toLowerCase() &&
      f.to.toLowerCase() === bookingInfo.to.toLowerCase();

    const matchesDate =
      type === 'roundtrip'
        ? f.depart === bookingInfo.departDate && f.return === bookingInfo.returnDate
        : f.date === bookingInfo.departDate;

    if (!matchesRoute || !matchesDate) return;

    const div = document.createElement('div');
    div.className = 'flight-item';
    div.innerHTML = `
      <p><strong>${f.flightNo}</strong> | ${f.from} → ${f.to}</p>
      <p>Date: ${type === 'roundtrip' ? `${f.depart} - ${f.return}` : f.date}</p>
      <p>Time: ${f.time || 'Varies'}</p>
      <p>Price: ₱${f.price}</p>
      <p>Seats: ${f.seats} | Hours: ${f.hours}</p>
      <p>Fare Type: ${f.fareType}</p>
      <button>Select</button>
    `;
    list.appendChild(div);

    // sya ang mo asikaso sa pagpili sa flight
    div.querySelector('button').addEventListener('click', () => {
      // removing the highlight
      document.querySelectorAll('.flight-item').forEach(item => item.classList.remove('selected'));

      // highlight selected
      div.classList.add('selected');

      // pagselect sa flight
      if (validateFlightSelection(f)) {
        selectedFlight = f;
        document.getElementById('toBillingBtn').style.display = 'block';
      }
    });
  });

  if (list.innerHTML === '') {
    list.innerHTML = `<p style="color:red;">No available flights found for your chosen details.</p>`;
  }
}

// === gi check kung naa bay seat ===
function validateFlightSelection(flight) {
  if (flight.seats <= 0) {
    alert(` No seats left for flight ${flight.flightNo}.`);
    return false;
  }
  selectedFlight = flight;
  return true;
}

// === set up sa payment ===
document.getElementById('toBillingBtn').addEventListener('click', () => {
  showStep('billing-section');

  const billDiv = document.getElementById('billingInfo');
  billDiv.innerHTML = `
    <h3>Selected Flight</h3>
    <p><strong>${selectedFlight.flightNo}</strong> | ${selectedFlight.from} → ${selectedFlight.to}</p>
    <p>Fare Type: ${selectedFlight.fareType}</p>
    <p>Base Price: ₱${selectedFlight.price}</p>
    <p>Seats Left: ${selectedFlight.seats}</p>
  `;

  updateBilling();
});

document.getElementById('classType').addEventListener('change', updateBilling);

function updateBilling() {
  const classType = document.getElementById('classType').value;
  let computedPrice = selectedFlight.price;

  if (classType === 'business') computedPrice += 1000;
  if (classType === 'first') computedPrice += 2000;

  bookingInfo.classType = classType;
  bookingInfo.computedFare = computedPrice;

  document.getElementById('computedFare').textContent =
    `Total Fare (${classType.toUpperCase()}): ₱${computedPrice.toLocaleString()}`;
}

// === ari na ibutang ang info sa mo sakay ===
document.getElementById('toPassengerBtnBilling').addEventListener('click', () => {
  showStep('passenger-section');

  const num = parseInt(bookingInfo.passengers);
  const formsDiv = document.getElementById('passengerForms');
  formsDiv.innerHTML = '';

  // === sa pag apply nis promocode
  const allowPromo = selectedFlight && selectedFlight.fareType === 'Promo Fare';
  const maxPromoFields = allowPromo ? Math.min(3, num) : 0;

   for (let i = 1; i <= num; i++) {
    formsDiv.innerHTML += `
      <div class="form-group">
        <h4>Passenger ${i}</h4>
        <input type="text" class="passengerName" placeholder="Full Name" required>
        <input type="number" class="passengerAge" placeholder="Age" required>
        ${i <= maxPromoFields ? `<input type="text" class="passengerPromo" placeholder="Promo code (optional)">` : ''}
      </div>
    `;
  }
});

document.getElementById('toSummaryBtn').addEventListener('click', () => {
  const names = [...document.querySelectorAll('.passengerName')].map(e => e.value.trim());
  const ages = [...document.querySelectorAll('.passengerAge')].map(e => e.value.trim());

  if (names.some(n => n === '') || ages.some(a => a === '' || a <= 0)) {
    alert("Please fill all passenger details correctly.");
    return;
  }

  bookingInfo.passengersData = names.map((name, i) => ({ name, age: ages[i] }));
  showStep('summary-section');

  const baseFare = bookingInfo.computedFare;
  const numPassengers = parseInt(bookingInfo.passengers);
  const promoLimit = 3; // == limit kung pila ang applicable sa promo
  let promoAppliedCount = 0;

  // gi scan niya kung valid promo then execute
  const promoInputs = [...document.querySelectorAll('.passengerPromo')].map(e => e.value.trim());

  // == validation sa flight kung promo fare then maapply ang discount
  const passengersWithPricing = bookingInfo.passengersData.map((p, idx) => {
    let fare = baseFare;
    let discount = 0;
    let promoCode = null;

    if (selectedFlight && selectedFlight.fareType === 'Promo Fare' && idx < promoInputs.length) {
      const code = promoInputs[idx];
      if (code && promoAppliedCount < promoLimit) {
        const matched = promolist.promos.find(x => x.code.toUpperCase() === code.toUpperCase());
        if (matched) {
          discount = Math.round(baseFare * matched.discount);
          fare = baseFare - discount;
          promoCode = matched.code;
          promoAppliedCount++;
        } else {
          promoCode = `INVALID (${code})`;
        }
      }
    }

    return {
      name: p.name,
      age: p.age,
      fare,
      discount,
      promoCode
    };
  });

  const totalFare = passengersWithPricing.reduce((s, p) => s + p.fare, 0);

  const s = document.getElementById('summaryDetails');
  s.innerHTML = `
    <h3>Flight Info</h3>
    <p>${selectedFlight.flightNo} - ${selectedFlight.from} → ${selectedFlight.to}</p>
    <p>Class Type: ${bookingInfo.classType.toUpperCase()}</p>
    <p>Price per Passenger (base): ₱${baseFare.toLocaleString()}</p>
    <h3>Passengers & Pricing</h3>
    <ul>
      ${passengersWithPricing.map((p, i) => `
        <li>
          ${p.name}, ${p.age} yrs —
          Fare: ₱${p.fare.toLocaleString()}
          ${p.discount > 0 ? `(Discount: -₱${p.discount.toLocaleString()} via ${p.promoCode})` : p.promoCode ? `(${p.promoCode})` : ''}
        </li>
      `).join('')}
    </ul>
    <p><strong>Total Fare: ₱${totalFare.toLocaleString()}</strong></p>
  `;
});

function findPromo(code) {
  if (!code) return null;
  return promolist.promos.find(p => p.code.toUpperCase() === code.toUpperCase()) || null;
}


// === Sa booking na diri ===
document.getElementById('bookNowBtn').addEventListener('click', () => {
  alert(" Booking successful! Thank you for choosing AirLines!");
  window.location.reload();
});


document.getElementById('backToBookingBtn').addEventListener('click', () => {
  showStep('booking-section');
});
document.getElementById('backToFlightBtnBilling').addEventListener('click', () => {
  showStep('flight-section');
});
document.getElementById('backToBillingBtn').addEventListener('click', () => {
  showStep('billing-section');
});
document.getElementById('backToPassengerBtn').addEventListener('click', () => {
  showStep('passenger-section');
});


function showStep(id) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
