// Copyright 2002-2015, University of Colorado Boulder

/**
 * A Scenery node that can be clicked upon to create a scenery node and a model element.
 *
 * The behavior that is sought after is
 * (1) when clicked upon, an additional scenery node (with no model element counterpart) is created and "jump".
 * (2) this additional node can be dragged onto the board but is subject to the some dragBounds
 * (3) when released the additional scenery node should 'disappeared' and be replaced by a model element (which itself is responsible for its view.
 * (4) the model element should be able to return to its 'destinationPosition', namely the position of the static scenery node
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChargedParticle = require( 'CHARGES_AND_FIELDS/charges-and-fields/model/ChargedParticle' );
  var ChargedParticleRepresentation = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ChargedParticleRepresentation' );
  var ElectricFieldSensorRepresentation = require( 'CHARGES_AND_FIELDS/charges-and-fields/view/ElectricFieldSensorRepresentation' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  //var ScreenView = require( 'JOIST/ScreenView' );
  var SensorElement = require( 'CHARGES_AND_FIELDS/charges-and-fields/model/SensorElement' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {Function} addModelElementToObservableArray - A function that add a modelElement to an Observable Array in the model
   * @param {ObservableArray} observableArray
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<Bounds2>} availableModelBoundsProperty - dragBounds for the moving view element
   * @param {Bounds2} enclosureBounds - bounds in the model coordinate frame of the charge and sensor enclosure
   * @param {Object} [options]
   * @constructor
   */
  function UserCreatorNode( addModelElementToObservableArray,
                            observableArray,
                            modelViewTransform,
                            availableModelBoundsProperty,
                            enclosureBounds,
                            options ) {

    //var self = this;

    // Call the super constructor
    Node.call( this, {
      // Show a cursor hand over the charge
      cursor: 'pointer'
    } );

    options = _.extend( {
      element: 'electricFieldSensor' // other valid inputs are 'positive' and 'negative'
    }, options );


    /**
     * Function that returns the view Node associated to options.element
     * @returns {Node}
     */
    function representationCreatorNode() {
      var representationNode;
      switch( options.element ) {
        case 'positive':
          representationNode = new ChargedParticleRepresentation( 1 );
          break;
        case 'negative':
          representationNode = new ChargedParticleRepresentation( -1 );
          break;
        case 'electricFieldSensor':
          representationNode = new ElectricFieldSensorRepresentation();
          break;
      }
      return representationNode;
    }

    /**
     * Function that returns the model element associated to options.element
     * @param {Vector2} initialModelPosition
     * @returns {ModelElement}
     */
    function modelElementCreator( initialModelPosition ) {
      var modelElement;

      switch( options.element ) {
        case 'positive':
          modelElement = new ChargedParticle( initialModelPosition, 1 );
          break;
        case 'negative':
          modelElement = new ChargedParticle( initialModelPosition, -1 );
          break;
        case 'electricFieldSensor':
          modelElement = new SensorElement( initialModelPosition );
          break;
      }
      return modelElement;
    }

    // this is where the center of 'this' is in the ScreenView reference frame
    var viewPosition = new Vector2( options.centerX, options.centerY );

    // Create and add two nodes: the first one contains the static representation of the node
    // whereas the second is the dynamic representation of the node (but with no model counterpart)

    var staticObject = new Node();
    this.addChild( staticObject );

    // offset between the  position of the static object and position of the movingObject after the tween animation
    // needed for the 'pop' effect
    var offset = new Vector2( 0, -20 ); // in view coordinate frame

    // Create and add a static view node
    staticObject.addChild( representationCreatorNode() );

    // let's make this node very easy to pick
    this.touchArea = staticObject.localBounds.dilated( 20 );

    // position for the moving object in model coordinate, note that the initial value will be reset right away by

    var movableDragHandler =
      new SimpleDragHandler(
        {
          modelElement: null,
          modelViewTransform: modelViewTransform,
          dragBounds: availableModelBoundsProperty.value,

          start: function( event ) {

            // Create the new model element.
            this.modelElement = modelElementCreator( modelViewTransform.viewToModelPosition( viewPosition.plus( offset ) ) );
            this.modelElement.destinationPosition = modelViewTransform.viewToModelPosition( viewPosition );
            this.modelElement.userControlled = true;
            this.modelElement.isActive = false;

            addModelElementToObservableArray( this.modelElement, observableArray );
          },

          translate: function( translationParams ) {
            var unconstrainedLocation = this.modelElement.position.plus( this.modelViewTransform.viewToModelDelta( translationParams.delta ) );
            var constrainedLocation = constrainLocation( unconstrainedLocation, availableModelBoundsProperty.value );
            this.modelElement.position = constrainedLocation;
          },

          end: function( event ) {
            this.modelElement.userControlled = false;
            if ( !enclosureBounds.containsPoint( this.modelElement.position ) ) {
              this.modelElement.isActive = true;
            }
            this.modelElement = null;
          }
        } );

    // Add the listener that will allow the user to click on this and create a model element, then position it in the model.
    this.addInputListener( movableDragHandler );

    /**
     * Constrains a location to some bounds.
     * It returns (1) the same location if the location is within the bounds
     * or (2) a location on the edge of the bounds if the location is outside the bounds
     * @param {Vector2} location
     * @param {Bounds2} bounds
     * @returns {Vector2}
     */
    var constrainLocation = function( location, bounds ) {
      if ( bounds.containsCoordinates( location.x, location.y ) ) {
        return location;
      }
      else {
        var xConstrained = Math.max( Math.min( location.x, bounds.maxX ), bounds.x );
        var yConstrained = Math.max( Math.min( location.y, bounds.maxY ), bounds.y );
        return new Vector2( xConstrained, yConstrained );
      }
    };


// Pass options through to parent.
    this.mutate( options );
  }

  return inherit( Node, UserCreatorNode );
} );
