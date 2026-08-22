export function initBookingWidget() {
  const widget = document.querySelector('.booking-widget');
  if (!widget) return;

  const btnMinus = widget.querySelector('.stepper-minus');
  const btnPlus = widget.querySelector('.stepper-plus');
  const inputGuests = widget.querySelector('#guest-count');
  
  const inputCheckIn = widget.querySelector('#check-in');
  const inputCheckOut = widget.querySelector('#check-out');
  const btnWhatsApp = widget.querySelector('#btn-book-whatsapp');
  
  // Set minimum dates
  const today = new Date().toISOString().split('T')[0];
  if(inputCheckIn && inputCheckOut) {
     inputCheckIn.min = today;
     
     inputCheckIn.addEventListener('change', () => {
        if(inputCheckIn.value) {
            const minOut = new Date(inputCheckIn.value);
            minOut.setDate(minOut.getDate() + 1);
            inputCheckOut.min = minOut.toISOString().split('T')[0];
            
            if(inputCheckOut.value && inputCheckOut.value <= inputCheckIn.value) {
                inputCheckOut.value = inputCheckOut.min;
            }
        }
     });
  }

  // Stepper logic
  if(btnMinus && btnPlus && inputGuests) {
      btnMinus.addEventListener('click', (e) => {
          e.preventDefault();
          let val = parseInt(inputGuests.value) || 1;
          if (val > 1) {
              inputGuests.value = val - 1;
          }
      });

      btnPlus.addEventListener('click', (e) => {
          e.preventDefault();
          let val = parseInt(inputGuests.value) || 1;
          const max = parseInt(inputGuests.getAttribute('max')) || 10;
          if (val < max) {
              inputGuests.value = val + 1;
          }
      });
  }

  // WhatsApp Deep Link Generation
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      
      const checkIn = inputCheckIn ? inputCheckIn.value : '';
      const checkOut = inputCheckOut ? inputCheckOut.value : '';
      const guests = inputGuests ? inputGuests.value : '1';
      const roomName = widget.getAttribute('data-room-name') || 'a room';
      
      if (!checkIn || !checkOut) {
        alert('Please select check-in and check-out dates.');
        return;
      }
      
      const message = `Hi, I'm interested in booking ${roomName} for ${guests} guest(s) from ${checkIn} to ${checkOut}. Is it still available?`;
      const encodedMessage = encodeURIComponent(message);
      
      // WhatsApp number 0126183387 -> 60126183387
      const waNumber = '60126183387';
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
      
      window.open(waUrl, '_blank');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initBookingWidget();
});
