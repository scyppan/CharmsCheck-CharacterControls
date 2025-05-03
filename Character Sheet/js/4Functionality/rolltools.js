function randbetween(lo, hi) {
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function checkcritfail(rollval) {
    if (rollval == 1) { return "Crit Fail" }
    else if (rollval == 10) { return "Crit Success" }
    else {
        return "Normal";
    }
}

function showrollmodal(text) {
    let modal = document.getElementById('roll-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'roll-modal';
      Object.assign(modal.style, {
        position:        'fixed',
        bottom:          '20px',
        right:           '20px',
        backgroundColor: '#fff',
        padding:         '0.75rem 1rem',
        borderRadius:    '4px',
        boxShadow:       '0 2px 8px rgba(0,0,0,0.25)',
        fontFamily:      'sans-serif',
        fontSize:        '0.9rem',
        zIndex:          '1000'
      });
      document.body.appendChild(modal);
    }
    modal.textContent = text;
  }

  