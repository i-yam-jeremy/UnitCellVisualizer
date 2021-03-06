import {Shape} from '../graphics';
import {Crystal, CrystalType} from './crystal.js';
import {vec3} from '../gl-matrix';
import {HCPHighlightType} from '../lattices/hcpHighlightType.js';
import {ViewMode} from './viewMode.js';

import * as $ from 'jquery';

let Scene = {

    load : function(resourceDir, dispSelector) {

        // Setup meshes
        this.eighth.loadMesh(resourceDir + "eighth.obj");

        this.half.loadMesh(resourceDir + "half.obj");

        this.sphere.loadMesh(resourceDir + "sphere.obj");

        this.sixth.loadMesh(resourceDir + "sixth.obj");

        this.hcpLargeFraction.loadMesh(resourceDir + "hcp-large-fraction.obj");
        this.hcpSmallFraction.loadMesh(resourceDir + "hcp-small-fraction.obj");

        // Setup colors
        this.setupColors();

        var crystal;

        crystal = new Crystal(CrystalType.SIMPLE, this.eighth, null, this.half, this.sphere, null, null, this.colors);
        crystal.init();
        this.crystals.push(crystal);

        crystal = new Crystal(CrystalType.BODY, this.eighth, null, this.half, this.sphere, null, null, this.colors);
        crystal.init();
        this.crystals.push(crystal);

        crystal = new Crystal(CrystalType.FACE, this.eighth, null, this.half, this.sphere, null, null, this.colors);
        crystal.init();
        this.crystals.push(crystal);

        crystal = new Crystal(CrystalType.NaCl, this.eighth, null, this.half, this.sphere, null, null, this.colors);
        crystal.init();
        this.crystals.push(crystal);

        crystal = new Crystal(CrystalType.CaF2, this.eighth, null, this.half, this.sphere, null, null, this.colors);
        crystal.init();
        this.crystals.push(crystal);

        crystal = new Crystal(CrystalType.LEGEND, this.eighth, null, this.half, this.sphere, null, null, this.colors);
        crystal.init();
        this.crystals.push(crystal);

        crystal = new Crystal(CrystalType.HCP, null, this.sixth, null, this.sphere, this.hcpLargeFraction,
           this.hcpSmallFraction, this.colors, dispSelector);
        crystal.init();
        this.crystals.push(crystal);
    },

    setupColors : function() {
        this.colors["grey"] = vec3.fromValues(0.5, 0.5, 0.5);
        this.colors["red"] = vec3.fromValues(1.0, 0, 0);
        this.colors["green"] = vec3.fromValues(0, 1.0, 0);
        this.colors["forestGreen"] = vec3.fromValues(.1333, .543, .1333);
        this.colors["blue"] = vec3.fromValues(0, 0.7, 1.0);
        this.colors["orange"] = vec3.fromValues(1.0, 0.6, 0.2);
        this.colors["black"] = vec3.fromValues(0, 0, 0);
        this.colors["purple"] = vec3.fromValues(.578125, 0, .82421875);
        this.colors["white"] = vec3.fromValues(1, 1, 1);
    },

    nextCrystal : function() {
        this.whichCrystal = (this.whichCrystal + 1) % this.crystals.length;
    },

    prevCrystal: function() {
        this.whichCrystal = (this.whichCrystal == 0 ? this.crystals.length - 1 : this.whichCrystal - 1);
    },

    getCrystal : function() {
        return this.crystals[this.whichCrystal];
    },

    getCrystalName : function() {
        return this.getCrystal().getName();
    },

    draw : function(MV, prog) {
        return this.crystals[this.whichCrystal].draw(MV, prog);
    },

    expand : function() {
        for (var i = 0; i < this.crystals.length; i++) {
            this.crystals[i].expand();
        }
        $('#expansionSlider').val(this.crystals[this.whichCrystal].getExpansionParameter());
    },

    contract : function() {
        for (var i = 0; i < this.crystals.length; i++) {
            this.crystals[i].contract();
        }
        $('#expansionSlider').val(this.crystals[this.whichCrystal].getExpansionParameter());
    },

    toggleTranslucency : function() {
      this.translucent = !this.translucent;
    },

    toggleColor : function() {
        this.color++;
        if(this.color == 3) {
            this.color = 0;
        }
    },

    isLoaded : function() {
        return this.eighth.isLoaded() && this.half.isLoaded() && this.sphere.isLoaded();
    },

    goToCrystal : function(crystalType) {
        this.whichCrystal = crystalType;
        this.color = 0;
    },

    setHCPHighlightType : function(hcpHighlightType) {
      this.hcpHighlightType = hcpHighlightType;
    },

    setHCPRingVisible : function(ring, visible) {
      this.hcpRingsVisible[ring] = visible;
    },

    setHCPLevelVisible : function(level, visible) {
      this.hcpLevelsVisible[level] = visible;
    },

    setViewMode : function(viewMode) {
      this.viewMode = viewMode;
      for (const crystal of this.crystals) {
        crystal.resetExpansion();
      }
    },

    onExpansionSliderChange : function(t) {
      for (const crystal of this.crystals) {
        crystal.setExpansion(t);
      }
    },

    whichCrystal : 0,
    eighth : new Shape(),
    sixth : new Shape(),
    half : new Shape(),
    sphere : new Shape(),
    hcpLargeFraction: new Shape(),
    hcpSmallFraction: new Shape(),
    crystals : new Array(),
    colors : {},
    isCoord : false,
    color : 0,
    hcpHighlightType : HCPHighlightType.NONE,
    hcpRingsVisible : {0: true, 1: true, 2: true},
    hcpLevelsVisible : {'-1': true, 0: true, 1: true, 2: true},
    viewMode : ViewMode.LAYER,
    translucent: false,
};

export {Scene};
