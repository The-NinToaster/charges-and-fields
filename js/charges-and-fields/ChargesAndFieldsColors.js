// Copyright 2002-2015, University of Colorado Boulder

/**
 * Location for all colors (especially those that could be tweaked)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var extend = require( 'PHET_CORE/extend' );
  var Color = require( 'SCENERY/util/Color' );
  var PropertySet = require( 'AXON/PropertySet' );

  var colors = {
    background: {
      default: new Color( 0, 0, 0 ),
      projector: new Color( 255, 255, 255 )
    },
    reversedBackground: {
      default: new Color( 255, 255, 255 ),
      projector: new Color( 0, 0, 0 )
    },
    controlPanelBorder: {
      default: new Color( 210, 210, 210 ),
      projector: new Color( 192, 192, 192 )
    },
    controlPanelFill: {
      default: new Color( 10, 10, 10 ),
      projector: new Color( 238, 238, 238 )
    },
    controlPanelText: {
      default: new Color( 229, 229, 126 ),
      projector: new Color( 0, 0, 0 )
    },
    enclosureText: {
      default: new Color( 255, 255, 255 ),
      projector: new Color( 0, 0, 0 )
    },
    enclosureFill: {
      default: new Color( 10, 10, 10 ),
      projector: new Color( 238, 238, 238 )
    },
    enclosureBorder: {
      default: new Color( 210, 210, 210 ),
      projector: new Color( 192, 192, 192 )
    },
    checkBox: {
      default: new Color( 230, 230, 230 ),
      projector: new Color( 0, 0, 0 )
    },
    checkBoxBackground: {
      default: new Color( 30, 30, 30 ),
      projector: new Color( 255, 255, 255 )
    },
    voltageLabel: {
      default: new Color( 255, 255, 255 ),
      projector: new Color( 0, 0, 0 )
    },
    equipotentialLine: {
      default: new Color( 50, 255, 100 ),
      projector: new Color( 0, 0, 0 )
    },
    measuringTapeText: {
      default: new Color( 255, 255, 255 ),
      projector: new Color( 0, 0, 0 )
    },
    electricFieldSensorCircleFill: {
      default: new Color( 255, 255, 0 ),
      projector: new Color( 255, 153, 0 )
    },
    electricFieldSensorCircleStroke: {
      default: new Color( 128, 120, 133 ),
      projector: new Color( 0, 0, 0 )
    },
    electricFieldSensorArrow: {
      default: new Color( 255, 0, 0 ),
      projector: new Color( 255, 0, 0 )
    },
    electricFieldSensorLabel: {
      default: new Color( 229, 229, 126 ),
      projector: new Color( 0, 0, 0 )
    },
    gridStroke: {
      default: new Color( 50, 50, 50 ),
      projector: new Color( 255, 204, 51 )
    },
    gridLengthScaleArrowStroke: {
      default: new Color( 255, 255, 255 ),
      projector: new Color( 255, 0, 0 )
    },
    gridLengthScaleArrowFill: {
      default: new Color( 255, 255, 255 ),
      projector: new Color( 255, 153, 0 )
    },
    gridTextFill: {
      default: new Color( 255, 255, 255 ),
      projector: new Color( 0, 0, 0 )
    },
    electricPotentialSensorCircleStroke: {
      default: new Color( 255, 255, 255 ),
      projector: new Color( 0, 0, 0 )
    },
    electricPotentialSensorCrosshairStroke: {
      default: new Color( 255, 255, 255 ),
      projector: new Color( 0, 0, 0 )
    },
    buttonBaseColor: {
      default: new Color( 200, 200, 200 ),
      projector: new Color( 200, 200, 200 )
    },
    electricPotentialPanelTitleText: {
      default: new Color( 255, 255, 255 ),
      projector: new Color( 255, 255, 255 )
    },
    electricPotentialSensorTextPanelTextFill: {
      default: new Color( 0, 0, 0 ),
      projector: new Color( 0, 0, 0 )
    },
    electricPotentialSensorTextPanelBorder: {
      default: new Color( 0, 0, 0 ),
      projector: new Color( 250, 250, 250 )
    },
    electricPotentialSensorTextPanelBackground: {
      default: new Color( 255, 255, 255 ),
      projector: new Color( 255, 255, 255 )
    },
    electricPotentialSensorBorder: {
      default: new Color( 210, 210, 210 ),
      projector: new Color( 150, 150, 150 )
    },
    electricPotentialSensorBackgroundFill: {
      default: new Color( 52, 50, 159 ),
      projector: new Color( 52, 60, 159 )
    },
    electricFieldGridSaturation: {
      default: new Color( 255, 255, 255 ),
      projector: new Color( 255, 0, 0 )
    },
    electricFieldGridZero: {
      default: new Color( 0, 0, 0 ),
      projector: new Color( 255, 255, 255 )
    },
    electricPotentialGridSaturationPositive: {
      default: new Color( 255, 0, 0 ),
      projector: new Color( 255, 0, 0 )
    },
    electricPotentialGridZero: {
      default: new Color( 0, 0, 0 ),
      projector: new Color( 255, 255, 255 )
    },
    electricPotentialGridSaturationNegative: {
      default: new Color( 0, 0, 255 ),
      projector: new Color( 0, 0, 255 )
    }

  };

  // initial properties object, to load into the PropertySet (so reset works nicely)
  var initialProperties = {};
  for ( var key in colors ) {
    initialProperties[ key ] = colors[ key ].default;
  }

  var ChargesAndFieldsColors = extend( new PropertySet( initialProperties ), {
    /*
     * Applies all colors for the specific named color scheme, ignoring colors that aren't specified for it.
     *
     * @param {string} profileName - one of 'default', 'basics' or 'projector'
     */
    applyProfile: function( profileName ) {
      assert && assert( profileName === 'default' || profileName === 'projector' );

      for ( var key in colors ) {
        if ( profileName in colors[ key ] ) {
          var oldColor = this[ key ];
          var newColor = colors[ key ][ profileName ];
          if ( !newColor.equals( oldColor ) ) {
            this[ key ] = newColor;
            reportColor( key );
          }
        }
      }
      this.trigger( 'profileChanged' );
    }
  } );

  /*---------------------------------------------------------------------------*
   * Iframe communication
   *----------------------------------------------------------------------------*/

  // sends iframe communication to report the current color for the key name
  function reportColor( key ) {
    var hexColor = ChargesAndFieldsColors[ key ].toNumber().toString( 16 );
    while ( hexColor.length < 6 ) {
      hexColor = '0' + hexColor;
    }

    window.parent && window.parent.postMessage( JSON.stringify( {
      type: 'reportColor',
      name: key,
      value: '#' + hexColor
    } ), '*' );
  }

  // initial communication
  for ( var colorName in colors ) {
    reportColor( colorName );
  }

  // receives iframe communication to set a color
  window.addEventListener( 'message', function( evt ) {
    var data = JSON.parse( evt.data );
    if ( data.type === 'setColor' ) {
      ChargesAndFieldsColors[ data.name ] = new Color( data.value );
    }
  } );

  return ChargesAndFieldsColors;
} );

