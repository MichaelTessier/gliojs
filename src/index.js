var glio = require('./glio');

glio.init(
  [ 'top', function () {
      alert('this is top.');
    }
  ],
  [ 'top-left', function () {
      alert('this is top-left');
    }
  ],
  [ 'top-right', function () {
      alert('this is top-right');
    }
  ],
  [ 'bottom-left', function () {
      alert('this is bottom-left');
    }
  ],
  [ 'bottom-right', function () {
      alert('this is bottom-right'); 
    }
  ] 
);