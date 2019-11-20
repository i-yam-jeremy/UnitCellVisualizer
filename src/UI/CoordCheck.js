// checks that students determined a lattice's coordination number on their own
import {CrystalType} from './crystal.js';
import {Scene} from './scene.js';

function verify(msg, correctVal) {
    const input = window.prompt(msg);
    return input == correctVal;
}

function verifyIonic(msgCat, msgAn, correctCat, correctAn) {
    const cation = window.prompt(msgCat);
    const anion = window.prompt(msgAn);
    return cation == correctCat && anion == correctAn;
};

const CoordCheck = {
  checkCoord: function(crystal) {
    let success;
    if(crystal == CrystalType.SIMPLE) {
      success = verify('What is the coordination number for the SC lattice?', 6);
    }
    else if(crystal == CrystalType.BODY) {
      success = verify('What is the coordination number for the BCC lattice?', 8);
    }
    else if(crystal == CrystalType.FACE) {
      success = verify('What is the coordination number for the FCC lattice?', 12);
    }
    else if(crystal == CrystalType.NaCl) {
      success = verifyIonic('What is the coordination number for the sodium ions?',
                            'What is the coordination number for the chloride ions?',
                            6, 6);
    }
    else if(crystal == CrystalType.CaF2) {
      success = verifyIonic('What is the coordination number for the calcium ions?',
                            'What is the coordination number for the fluoride ions?',
                            8, 4);
    }
    else if (crystal == CrystalType.HCP) {
      success = verify('What is the coordination number for the HCP lattice?', 12);
    }

    if(success) {
      alert("You're correct. Good job!")
    }
    else {
      alert('Sorry, that\'s incorrect...look closer at the lattice and try again!');
    }

  }
};

export {CoordCheck};
