# UnitCellVisualizer

This is an open-source lattice structure and unit cell simulation. It is designed for use
in CHEM 124/127 at California Polytechnic State University, San Luis Obispo.
The simulation has multiple features to facilitate learning of concepts
in a lattice structures unit in a general chemistry course, such as generating
lattices for the 3 basic cubic types and a few ionic compounds, a visual
representation of how the unit cell makes the whole lattice, and coordination number views.
The simulation is designed to be easy to use and interesting to look at.
The simulation is written in JavaScript and uses WebGL to handle graphics.
The simulation is currently available at http://atom.calpoly.edu/crystal .

### Design Credit

- **Dr. Zahra Alghoul:** Initial specifications and chemistry knowledge.
- **Dr. Zoe Wood:** Graphics knowledge. Oversaw development on the simulation as part of
Corbin's senior project, as well as Alec's final project for Intro to Graphics.
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
