// Copyright 2002-2015, University of Colorado Boulder

/**
 * View for the electric potential Field Node that displays a two dimensional grid of rectangles
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var ChargesAndFieldsConstants = require( 'CHARGES_AND_FIELDS/charges-and-fields/ChargesAndFieldsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var ELECTRIC_POTENTIAL_SENSOR_SPACING = ChargesAndFieldsConstants.ELECTRIC_POTENTIAL_SENSOR_SPACING;

  /**
   *
   * @param {Array.<StaticSensorElement>} electricPotentialGrid
   * @param {Function} getColorElectricPotential - A function that maps a color to a value of the electric potential
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} isVisibleProperty
   * @constructor
   */
  function ElectricPotentialFieldNode( electricPotentialGrid, getColorElectricPotential, modelViewTransform, isVisibleProperty ) {

    var electricPotentialFieldNode = this;
    // Call the super constructor
    CanvasNode.call( this );

    // find the distance between two adjacent sensors in view coordinates.
    var unitDistance = modelViewTransform.modelToViewDeltaX( ELECTRIC_POTENTIAL_SENSOR_SPACING );
    electricPotentialGrid.forEach( function( electricPotentialSensor ) {
      var positionInModel = electricPotentialSensor.position;
      var positionInView = modelViewTransform.modelToViewPosition( positionInModel );
      var rect = new Rectangle( 0, 0, unitDistance, unitDistance, { center: positionInView } );
      electricPotentialFieldNode.addChild( rect );

      electricPotentialSensor.electricPotentialProperty.link( function( electricPotential ) {
        var specialColor = getColorElectricPotential( positionInModel, electricPotential );
        rect.fill = specialColor;
        rect.stroke = specialColor;
      } );

    } );

    isVisibleProperty.link( function( isVisible ) {
      electricPotentialFieldNode.visible = isVisible;
    } );

  }

  return inherit( CanvasNode, ElectricPotentialFieldNode );
} );