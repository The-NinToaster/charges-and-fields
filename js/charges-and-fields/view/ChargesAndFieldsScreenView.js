//  Copyright 2002-2015, University of Colorado Boulder

/**
 * Main screen View of the Charges and Fields simulation
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ChargesAndFieldsColors = require( 'CHARGES_AND_FIELDS/charges-and-fields/ChargesAndFieldsColors' );
  var ChargesAndFieldsConstants = require( 'CHARGES_AND_FIELDS/charges-and-fields/ChargesAndFieldsConstants' );
  var ChargeAndSensorEnclosure = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ChargeAndSensorEnclosure' );
  var ChargedParticleNode = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ChargedParticleNode' );
  var ChargedParticleRepresentation = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ChargedParticleRepresentation' );
  var ControlPanel = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ControlPanel' );
  var ElectricFieldSensorNode = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ElectricFieldSensorNode' );
  var ElectricFieldSensorRepresentation = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ElectricFieldSensorRepresentation' );
  var ElectricPotentialSensorNode = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ElectricPotentialSensorNode' );
  var ElectricPotentialGridNode = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ElectricPotentialGridNode' );
  var ElectricPotentialGridWebGLNode = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ElectricPotentialGridWebGLNode' );
  var ElectricFieldGridNode = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ElectricFieldGridNode' );
  var EquipotentialLineNode = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/EquipotentialLineNode' );
  var ElectricFieldLineNode = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ElectricFieldLineNode' );
  var GridNode = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/GridNode' );
  //var HSlider = require( 'SUN/HSlider' );
  //var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var linear = require( 'DOT/Util' ).linear;
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Util = require( 'SCENERY/util/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  //var mockup01Image = require( 'image!CHARGES_AND_FIELDS/mockup01.png' );
  //var mockup02Image = require( 'image!CHARGES_AND_FIELDS/mockup02.png' );


  var MAX_ELECTRIC_FIELD_MAGNITUDE = 5; // electricField at which color will saturate to maxColor (in Volts/meter)
  var MAX_ELECTRIC_POTENTIAL = 40; // electric potential   (in volts) at which color will saturate to colorMax
  var MIN_ELECTRIC_POTENTIAL = -40; // electric potential   at which color will saturate to minColor

  var ELECTRIC_FIELD_LINEAR_FUNCTION = new LinearFunction( 0, MAX_ELECTRIC_FIELD_MAGNITUDE, 0, 1, true ); // true clamps the linear interpolation function;
  var ELECTRIC_POTENTIAL_NEGATIVE_LINEAR_FUNCTION = new LinearFunction( MIN_ELECTRIC_POTENTIAL, 0, 0, 1, true );  // clamp the linear interpolation function;
  var ELECTRIC_POTENTIAL_POSITIVE_LINEAR_FUNCTION = new LinearFunction( 0, MAX_ELECTRIC_POTENTIAL, 0, 1, true );  // clamp the linear interpolation function;
  /**
   *
   * @param {ChargesAndFieldsModel} model - main model of the simulation
   * @constructor
   */
  function ChargesAndFieldsScreenView( model ) {

    ScreenView.call( this, { renderer: 'svg', layoutBounds: new Bounds2( 0, 0, 1024, 618 ) } );

    // The origin of the model is sets in the middle of the scree. There are 5 meters across the height of the sim.
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( this.layoutBounds.width / 2, this.layoutBounds.height / 2 ),
      this.layoutBounds.height / ChargesAndFieldsConstants.HEIGHT );

    // Check to see if WebGL was prevented by a query parameter
    var allowWebGL = phet.chipper.getQueryParameter( 'webgl' ) !== 'false';
    var webGLSupported = Util.checkWebGLSupport( [ 'OES_texture_float' ] ) && allowWebGL;

    var electricPotentialGridNode;
    // Create the electric Potential grid node that displays an array of contiguous rectangles of changing colors
    // TODO: remove false
    if ( webGLSupported && false ) {
      electricPotentialGridNode = new ElectricPotentialGridWebGLNode(
        model,
        model.electricPotentialSensorGrid,
        model.on.bind( model ),
        this.getElectricPotentialColor.bind( this ),
        this.layoutBounds,
        modelViewTransform,
        model.isElectricPotentialGridVisibleProperty
      );
    }
    else {
      electricPotentialGridNode = new ElectricPotentialGridNode(
        model.electricPotentialSensorGrid,
        model.on.bind( model ),
        this.getElectricPotentialColor.bind( this ),
        this.layoutBounds,
        modelViewTransform,
        model.isElectricPotentialGridVisibleProperty
      );
    }

    // Create a grid of electric field arrow sensors
    var electricFieldGridNode = new ElectricFieldGridNode(
      model.electricFieldSensorGrid,
      model.on.bind( model ),
      this.getElectricFieldMagnitudeColor.bind( this ),
      modelViewTransform,
      model.isDirectionOnlyElectricFieldGridVisibleProperty,
      model.isElectricFieldGridVisibleProperty );

    // Create the scenery node responsible for drawing the equipotential lines
    var equipotentialLineNode = new EquipotentialLineNode(
      model.equipotentialLinesArray,
      modelViewTransform,
      model.isValuesVisibleProperty );

    // Create the scenery node responsible for drawing the electric field lines
    var electricFieldLineNode = new ElectricFieldLineNode(
      model.electricFieldLinesArray,
      modelViewTransform );

    // Create the draggable electric potential sensor node with a electric potential readout
    var electricPotentialSensorNode = new ElectricPotentialSensorNode(
      model.electricPotentialSensor,
      this.getElectricPotentialColor.bind( this ),
      model.clearEquipotentialLines.bind( model ),
      model.addElectricPotentialLine.bind( model ),
      modelViewTransform );


    // Create a visual grid with major and minor lines on the view
    var gridNode = new GridNode( modelViewTransform, model.isGridVisibleProperty, model.isValuesVisibleProperty );

    // Create the electric control panel on the upper right hand side
    var controlPanel = new ControlPanel(
      model.isElectricFieldGridVisibleProperty,
      model.isDirectionOnlyElectricFieldGridVisibleProperty,
      model.isElectricPotentialGridVisibleProperty,
      model.isValuesVisibleProperty,
      model.isGridVisibleProperty,
      model.isTapeMeasureVisibleProperty );

    // Create the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        measuringTape.reset();
      }
    } );

    // Create a draggable but dragBound Measuring Tape
    var tape_options = {
      dragBounds: this.layoutBounds.eroded( 5 ),
      modelViewTransform: modelViewTransform,
      basePositionProperty: new Property( new Vector2( 100, 100 ) )
    };

    // Create a measuring tape
    var measuringTape = new MeasuringTape( model.tapeMeasureUnitsProperty, model.isTapeMeasureVisibleProperty,
      tape_options );

    ChargesAndFieldsColors.link( 'measuringTapeText', function( color ) {
      measuringTape.textColor = color;
    } );

    // Create the layer where the charged Particles and electric Field Sensors will be placed.
    var draggableElementsLayer = new Node( { layerSplit: true } ); // Force the moving charged Particles and electric Field Sensors into a separate layer for performance reasons.

    // Create the charge and sensor enclosure (including the charges and sensors)

    var positiveChargedParticleRepresentation = new ChargedParticleRepresentation( 1 );
    var negativeChargedParticleRepresentation = new ChargedParticleRepresentation( -1 );
    var electricFieldSensorRepresentation = new ElectricFieldSensorRepresentation();

    var chargeAndSensorEnclosure = new ChargeAndSensorEnclosure(
      model.addUserCreatedModelElementToObservableArray.bind( model ),
      positiveChargedParticleRepresentation,
      negativeChargedParticleRepresentation,
      electricFieldSensorRepresentation,
      model.chargedParticles,
      model.electricFieldSensors,
      model.chargeAndSensorEnclosureBounds,
      modelViewTransform );

    // Handle the comings and goings of charged particles.
    model.chargedParticles.addItemAddedListener( function( addedChargedParticle ) {
      // Create and add the view representation for this chargedParticle.
      var chargedParticleNode = new ChargedParticleNode( addedChargedParticle, modelViewTransform );
      draggableElementsLayer.addChild( chargedParticleNode );

      // Add the removal listener for if and when this chargedParticle is removed from the model.
      model.chargedParticles.addItemRemovedListener( function removalListener( removedChargedParticle ) {
        if ( removedChargedParticle === addedChargedParticle ) {
          draggableElementsLayer.removeChild( chargedParticleNode );
          model.chargedParticles.removeItemRemovedListener( removalListener );
        }
      } );
    } );


    // Handle the comings and goings of charged particles.
    model.electricFieldSensors.addItemAddedListener( function( addedElectricFieldSensor ) {
      // Create and add the view representation for this electric Field Sensor
      var electricFieldSensorNode = new ElectricFieldSensorNode(
        addedElectricFieldSensor,
        model.addElectricFieldLine.bind( model ),
        modelViewTransform,
        model.isValuesVisibleProperty );
      draggableElementsLayer.addChild( electricFieldSensorNode );

      // Add the removal listener for if and when this chargedParticle is removed from the model.
      model.electricFieldSensors.addItemRemovedListener( function removalListener( removedElectricFieldSensor ) {
        if ( removedElectricFieldSensor === addedElectricFieldSensor ) {
          draggableElementsLayer.removeChild( electricFieldSensorNode );
          model.electricFieldSensors.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // layout the objects
    controlPanel.right = this.layoutBounds.maxX - 30;
    controlPanel.top = 30;
    gridNode.centerX = this.layoutBounds.centerX;
    gridNode.centerY = this.layoutBounds.centerY;
    resetAllButton.right = this.layoutBounds.maxX - 30;
    resetAllButton.bottom = this.layoutBounds.maxY - 20;


    this.addChild( electricPotentialGridNode ); // it is the bottom of the z-order
    this.addChild( gridNode ); //
    this.addChild( electricFieldGridNode );
    this.addChild( electricFieldLineNode );
    this.addChild( equipotentialLineNode );
    this.addChild( controlPanel );
    this.addChild( resetAllButton );
    this.addChild( chargeAndSensorEnclosure );

    this.addChild( draggableElementsLayer );
    this.addChild( electricPotentialSensorNode );
    this.addChild( measuringTape );

    //TODO: Delete when done with the layout
    ////////////////////////////////////////////////////////////////
    //Show the mock-up and a slider to change its transparency
    //////////////////////////////////////////////////////////////
    //var mockup01OpacityProperty = new Property( 0.0 );
    //var mockup02OpacityProperty = new Property( 0.0 );
    //
    //var image01 = new Image( mockup01Image, { pickable: false } );
    //var image02 = new Image( mockup02Image, { pickable: false } );
    //
    //image01.scale( this.layoutBounds.height / image01.height );
    //image02.scale( this.layoutBounds.height / image02.height );
    //
    //mockup01OpacityProperty.linkAttribute( image01, 'opacity' );
    //mockup02OpacityProperty.linkAttribute( image02, 'opacity' );
    //this.addChild( image01 );
    //this.addChild( image02 );
    //
    //this.addChild( new HSlider( mockup02OpacityProperty, { min: 0, max: 1 }, { top: 200, left: 20 } ) );
    //this.addChild( new HSlider( mockup01OpacityProperty, { min: 0, max: 1 }, { top: 300, left: 20 } ) );
    /////////////////////////////////////////////////////////////////////////

  }

  return inherit( ScreenView, ChargesAndFieldsScreenView, {

    /**
     * Function that returns a color string for a given value of the electricPotential.
     * The interpolation scheme is somewhat unusual in the sense that it is performed via a piecewise function
     * which relies on three colors and three electric potential anchors. It is essentially two linear interpolation
     * functions put end to end so that the entire domain is covered.
     *
     * @param {number} electricPotential
     * @param {Object} [options] - useful to set transparency
     * @returns {string} color -  e.g. 'rgba(255, 255, 255, 1)'
     */
    getElectricPotentialColor: function( electricPotential, options ) {

      var finalColor; // {string} e.g. 'rgba(0,0,0,1)'
      var distance; // {number}  between 0 and 1

      // for positive electric potential
      if ( electricPotential > 0 ) {

        distance = ELECTRIC_POTENTIAL_POSITIVE_LINEAR_FUNCTION( electricPotential ); // clamped linear interpolation function, output lies between 0 and 1;
        finalColor = this.interpolateRGBA(
          ChargesAndFieldsColors.electricPotentialGridZero, // {Color} color that corresponds to the Electric Potential being zero
          ChargesAndFieldsColors.electricPotentialGridSaturationPositive, // {Color} color of Max Electric Potential
          distance, // {number} distance must be between 0 and 1
          options );
      }
      // for negative (or zero) electric potential
      else {

        distance = ELECTRIC_POTENTIAL_NEGATIVE_LINEAR_FUNCTION( electricPotential ); // clamped linear interpolation function, output lies between 0 and 1;
        finalColor = this.interpolateRGBA(
          ChargesAndFieldsColors.electricPotentialGridSaturationNegative, // {Color} color that corresponds to the lowest (i.e. negative) Electric Potential
          ChargesAndFieldsColors.electricPotentialGridZero,// {Color} color that corresponds to the Electric Potential being zero zero
          distance, // {number} distance must be between 0 and 1
          options );
      }
      return finalColor;
    },

    /**
     * Function that returns a color that is proportional to the magnitude of electric Field.
     * The color interpolates between ChargesAndFieldsColors.electricFieldGridZero (for an
     * electric field of zero) and ChargesAndFieldsColors.electricFieldGridSaturation (which corresponds to an
     * electric field value of MAX_ELECTRIC_FIELD_MAGNITUDE).
     *
     * @param {number} electricFieldMagnitude - a non negative number
     * @param {Object} [options] - useful to set transparency
     * @returns {string} color - e.g. 'rgba(255, 255, 255, 1)'
     *
     */
    getElectricFieldMagnitudeColor: function( electricFieldMagnitude, options ) {

      // ELECTRIC_FIELD_LINEAR_FUNCTION is a clamped linear function
      var distance = ELECTRIC_FIELD_LINEAR_FUNCTION( electricFieldMagnitude ); // a value between 0 and 1

      return this.interpolateRGBA(
        ChargesAndFieldsColors.electricFieldGridZero,  // {Color} color that corresponds to zero electric Field
        ChargesAndFieldsColors.electricFieldGridSaturation, // {Color} color that corresponds to the largest electric field
        distance, // {number} distance must be between 0 and 1
        options );
    },

    /**
     * Function that interpolates between two color. The transparency can be set vis a default options
     * The function returns a string in order to minimize the number of allocations
     * @private
     * @param {Color} color1
     * @param {Color} color2
     * @param {number} distance - a value from 0 to 1
     * @param {Object} [options]
     * @returns {string} color - e.g. 'rgba(0,0,0,1)'
     */
    interpolateRGBA: function( color1, color2, distance, options ) {
      options = _.extend( {
        // defaults
        transparency: 1
      }, options );

      if ( distance < 0 || distance > 1 ) {
        throw new Error( 'distance must be between 0 and 1: ' + distance );
      }
      var r = Math.floor( linear( 0, 1, color1.r, color2.r, distance ) );
      var g = Math.floor( linear( 0, 1, color1.g, color2.g, distance ) );
      var b = Math.floor( linear( 0, 1, color1.b, color2.b, distance ) );
      return 'rgba(' + r + ',' + g + ',' + b + ',' + options.transparency + ')';
    }
  } );
} );