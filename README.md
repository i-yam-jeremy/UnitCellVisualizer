# UnitCellVisualizer

&nbsp;&nbsp;&nbsp;&nbsp;This is an open-source lattice structure and unit cell simulation. It is designed for use
in CHEM 124/127 at California Polytechnic State University, San Luis Obispo.
The simulation has multiple features to facilitate learning of concepts
in a lattice structures unit in a general chemistry course, such as generating
lattices for the 3 basic cubic types and a few ionic compounds, a visual
representation of how the unit cell makes the whole lattice, and coordination number views.
The simulation is designed to be easy to use and interesting to look at.
The simulation is written in JavaScript and uses WebGL to handle graphics.
The simulation is currently available at https://i-yam-jeremy.github.io/UnitCellVisualizer/ .

### Citation
Corbin Gruber, Alec James, Jeremy T. Berchtold, Zoe J. Wood, Gregory E. Scott, and Zahra Alghoul  
Journal of Chemical Education 2020 97 (7), 2020-2024  
DOI: [10.1021/acs.jchemed.9b01207](https://doi.org/10.1021/acs.jchemed.9b01207)

### Design Credit

- **Dr. Zahra Alghoul:** Initial specifications and chemistry knowledge.
- **Dr. Zoe Wood:** Graphics knowledge. Oversaw development on the simulation as part of
Corbin's senior project, as well as Alec's final project for Intro to Graphics.
- **Dr. Gregory Scott:** Oversaw Jeremy's work and contribued to the dissemination.
- **Corbin Gruber:** Initial simulation design. Lattice layering animation and unit
cell drawings for the 3 basic lattices. Inspection and translucency features.
Keystroke controls.
- **Alec James:** Updated Simulation design. Added in coordination number views.
Incorporated Sodium Chloride and Calcium Fluoride options. Updated UI to use
buttons on the screen, and dropdowns. Refactoring of code to make it easier to
add more lattices in the future.
- **Jeremy Berchtold:** Added HCP lattice. Improved UI/UX by using fullscreen
viewport with overlays. Reduced number of key commands and replaced with visual
controls to improve ease of use. Fixed FCC coloring to show layering along 111
 plane.

### Installation
```
git clone https://github.com/i-yam-jeremy/UnitCellVisualizer.git
cd UnitCellVisualizer
npm install
npm run-script build
```

The files `index.html`, `crystal.css`, and `dist/main.js` are the only files needed for the built project. Simply serve these on a web server.
