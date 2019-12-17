import * as $ from 'jquery';

import {Camera, MatrixStack, Program, Shape} from './graphics';
import * as Lattices from './lattices';
import {Scene, User} from './UI';
import {initGL} from './webgl-utils.js';
import {HCPHighlightType} from './lattices/hcpHighlightType.js';
import {ViewMode} from './UI/viewMode.js';
import {CoordCheck} from './UI/CoordCheck.js';

var gl;
var prog;
var camera;
var sphere = new Shape();
var type = "";

function webGLStart() {

    // Initialize scene
    Scene.load("resources/", $('#displaySelector'));

    window.gl = initGL(); // sets up canvas element for webgl
    gl = window.gl;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.CULL_FACE);


    // Setup shader
    prog = new Program("shader-vs", "shader-fs");
    prog.load();
    prog.bind();
    prog.addHandle("vertPos", "attribute")
    prog.addHandle("vertNor", "attribute");
    prog.addHandle("P", "uniform");
    prog.addHandle("MV", "uniform");
    prog.addHandle("kdFront", "uniform");
    prog.addHandle("alpha", "uniform");

    // Setup camera
    camera = new Camera();
    camera.setAspect(1200.0 / 900.0);

    // Setup key events
    User.setup($('#displaySelector'), $('#crystalSelector'), camera);

    $('#aboutText').hide();
    $('#legendText').hide();
    tick();
}

function tick() {

    requestAnimFrame(tick);

    // configure gl viewport and clean buffers
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    var MV = new MatrixStack();
    var P = new MatrixStack();

    P.pushMatrix();
    camera.applyProjectionMatrix(P);

    MV.pushMatrix();
    camera.applyViewMatrix(MV, type);

    prog.bind();

    gl.uniformMatrix4fv(prog.getHandle("P"), false, P.top());
    MV.pushMatrix();
    type = Scene.draw(MV, prog);
    MV.popMatrix();

    prog.unbind();

    P.popMatrix();
    MV.popMatrix();

}

var instructions = "mouse : rotate view\n"
                 + "mouse + ctrl : zoom\n"
                 + "scroll : zoom\n"
                 + "shift (command on mac) + scroll: expand/contract\n"
                 + "'e' : expand\n"
                 + "'c' : contract\n"
                 + "'t' : toggle translucency\n"
                 + "'n' : toggle cell coloring\n"

function instruct() {
    alert(instructions);
}

function goToCrystal(crystalType) {
    if(crystalType == 5) {
        $('#legendText').show();
        $('#crystalSelector').val('-1');
        $('#displaySelector').hide();
    }
    else {
        $('#legendText').hide();
        $('#displaySelector').show();
    }
    Scene.goToCrystal(crystalType);
    document.getElementById("crystalType").innerHTML = Scene.getCrystalName();
}

function about() {
    if ($('#aboutText').is(":visible")) {
        $('#aboutText').hide();
        $('#simulation').show();
    } else {
        $('#aboutText').show();
        $('#simulation').hide();
    }
}

function changeCrystal(value) {
    goToCrystal(value);
    $('#singleViewMode').prop('disabled', (value == 6));
}

function amuse() {
    window.open('https://www.inorganicventures.com/fun-chemists');
}

function color() {
    Scene.toggleColor();
}

function setHCPMenusVisibility(visible) {
  if (visible) {
    $('#hcpHighlightTypeSelector').show();
    $('#hcpRingAndLevelSelector').show();
  } else {
    $('#hcpHighlightTypeSelector').hide();
    $('#hcpRingAndLevelSelector').hide();
  }
}

function onResize(canvas) {
  canvas.width = gl.viewportWidth = window.innerWidth;
  canvas.height = gl.viewportHeight = window.innerHeight;
  camera.setAspect(window.innerWidth / window.innerHeight);
}

$(document).ready(() => {
  setHCPMenusVisibility(false);

  $('#jokes').click(amuse);
  $('#instructions').click(instruct);
  $('#crystalSelector').change(() => {
    const crystalSelected = $('#crystalSelector').val();
    setHCPMenusVisibility(crystalSelected === '6' && Scene.viewMode == ViewMode.UNIT_CELL);
    changeCrystal(crystalSelected);
  });
  $('#legend').click(() => goToCrystal(5));
  $('#about').click(about);
  $('#return').click(about);
  $('#expansionSlider').on("input change", (e) => Scene.onExpansionSliderChange(e.target.value));
  $('#color').click(color);

  $('#hcpHighlightTypeHorizontal').change(() => Scene.setHCPHighlightType(HCPHighlightType.HORIZONTAL));
  $('#hcpHighlightTypeVertical').change(() => Scene.setHCPHighlightType(HCPHighlightType.VERTICAL));
  $('#hcpHighlightTypeNone').change(() => Scene.setHCPHighlightType(HCPHighlightType.NONE));

  $('#hcpShowRing-0').change(() => Scene.setHCPRingVisible(0, document.getElementById('hcpShowRing-0').checked));
  $('#hcpShowRing-1').change(() => Scene.setHCPRingVisible(1, document.getElementById('hcpShowRing-1').checked));
  $('#hcpShowRing-2').change(() => Scene.setHCPRingVisible(2, document.getElementById('hcpShowRing-2').checked));

  $('#hcpShowLevel--1').change(() => Scene.setHCPLevelVisible(-1, document.getElementById('hcpShowLevel--1').checked));
  $('#hcpShowLevel-0').change(() => Scene.setHCPLevelVisible(0, document.getElementById('hcpShowLevel-0').checked));
  $('#hcpShowLevel-1').change(() => Scene.setHCPLevelVisible(1, document.getElementById('hcpShowLevel-1').checked));
  $('#hcpShowLevel-2').change(() => Scene.setHCPLevelVisible(2, document.getElementById('hcpShowLevel-2').checked));

  $('#unitCellViewMode').change(() => {
    $('#expansionSlider').val(0);
    Scene.setViewMode(ViewMode.UNIT_CELL);
    setHCPMenusVisibility(Scene.whichCrystal === '6' && Scene.viewMode === ViewMode.UNIT_CELL);
  });
  $('#layerViewMode').change(() => {
    $('#expansionSlider').val(0);
    Scene.setViewMode(ViewMode.LAYER);
    setHCPMenusVisibility(Scene.whichCrystal === '6' && Scene.viewMode === ViewMode.UNIT_CELL);
  });
  $('#coordViewMode').change(() => {
    if (CoordCheck.checkCoord($('#crystalSelector').val())) {
      $('#expansionSlider').val(0);
      Scene.setViewMode(ViewMode.COORD);
      setHCPMenusVisibility(Scene.whichCrystal === '6' && Scene.viewMode === ViewMode.UNIT_CELL);
    }
    else {
      $('#coordViewMode').prop('checked', false);
      $('#expansionSlider').val(0);
      Scene.setViewMode(ViewMode.UNIT_CELL);
      setHCPMenusVisibility(Scene.whichCrystal === '6' && Scene.viewMode === ViewMode.UNIT_CELL);
      $('#unitCellViewMode').prop('checked', true);
    }
  });
  $('#singleViewMode').change(() => {
    $('#expansionSlider').val(0);
    Scene.setViewMode(ViewMode.SINGLE);
    setHCPMenusVisibility(Scene.whichCrystal === '6' && Scene.viewMode === ViewMode.UNIT_CELL);
  });

  webGLStart();

  let canvas = document.getElementById('canvas');
  onResize(canvas);
  window.addEventListener('resize', () => onResize(canvas));

  goToCrystal(2); // For development/fixing FCC
});
