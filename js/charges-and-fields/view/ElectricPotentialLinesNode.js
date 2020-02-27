// Copyright 2015-2019, University of Colorado Boulder

/**
 * Scenery Node responsible for layering ElectricPotentialLineView related Nodes.
 * @author Martin Veillette (Berea College)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import chargesAndFields from '../../chargesAndFields.js';
import ElectricPotentialLineView from './ElectricPotentialLineView.js';

// if set to true will show the (model and view) positions use in the calculation of the electric potential lines
const IS_DEBUG = phet.chipper.queryParameters.dev;

class ElectricPotentialLinesNode extends Node {

  /**
   * @param {ObservableArray.<ElectricPotentialLine>} electricPotentialLineGroup - array of models of electricPotentialLine
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} areValuesVisibleProperty - control the visibility of the voltage labels
   * @param {Tandem} tandem
   */
  constructor( electricPotentialLineGroup, modelViewTransform, areValuesVisibleProperty, tandem ) {

    // call the super constructor
    super( { tandem: tandem } );

    // Create and add the parent node for all the lines (paths)
    const pathsNode = new Node();
    this.addChild( pathsNode );

    // Create and add the parent node for the circles (used in DEBUG mode)
    let circlesNode;
    if ( IS_DEBUG ) {
      circlesNode = new Node();
      this.addChild( circlesNode );
    }

    // Create and add the parent node for the label nodes
    const labelsNode = new Node();
    this.addChild( labelsNode );

    const electricPotentialLineViewGroup = new PhetioGroup( ( tandem, electricPotentialLine ) => {
      return new ElectricPotentialLineView( electricPotentialLine, modelViewTransform, tandem );
    }, [ electricPotentialLineGroup.archetype ], {
      tandem: tandem.createTandem( 'electricPotentialLineViewGroup' ),
      phetioType: PhetioGroupIO( ReferenceIO )
    } );
    this.electricPotentialLineViews = electricPotentialLineViewGroup;

    // Monitor the electricPotentialLineArray and create a path and label for each electricPotentialLine
    electricPotentialLineGroup.addMemberCreatedListener( function updateView( electricPotentialLine ) {
      const electricPotentialLineView = electricPotentialLineViewGroup.createCorrespondingGroupMember( electricPotentialLine, electricPotentialLine );

      pathsNode.addChild( electricPotentialLineView.path );
      labelsNode.addChild( electricPotentialLineView.voltageLabel );

      // add the circles and text
      if ( IS_DEBUG ) {
        circlesNode.addChild( electricPotentialLineView.circles );
      }

      const modelDisposeListener = () => electricPotentialLineViewGroup.disposeMember( electricPotentialLineView );
      electricPotentialLine.disposeEmitter.addListener( modelDisposeListener );

      // try again next time we changed
      electricPotentialLine.chargeChangedEmitter.addListener( function chargeChangedListener() {

        // tear down and recreate the view on change
        modelDisposeListener();
        updateView( electricPotentialLine );

        electricPotentialLine.disposeEmitter.removeListener( modelDisposeListener );
        electricPotentialLine.chargeChangedEmitter.removeListener( chargeChangedListener );
      } );
    } );

    // Control the visibility of the value (voltage) labels
    // no need to unlink present for the lifetime of the sim
    areValuesVisibleProperty.linkAttribute( labelsNode, 'visible' );
  }
}

chargesAndFields.register( 'ElectricPotentialLinesNode', ElectricPotentialLinesNode );
export default ElectricPotentialLinesNode;