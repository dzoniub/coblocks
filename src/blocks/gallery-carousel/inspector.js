/**
 * Internal dependencies
 */
import { title } from './'
import ResponsiveTabsControl from '../../components/responsive-tabs-control';
import SizeControl from '../../components/size-control';
import SliderPanel from '../../components/slider-panel';
import { BackgroundPanel } from '../../components/background';

/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Component, Fragment } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.blockEditor;
const { PanelBody, RangeControl, ToggleControl } = wp.components;

/**
 * Inspector controls
 */
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );
		this.setSizeControl = this.setSizeControl.bind( this );
		this.setRadiusTo = this.setRadiusTo.bind( this );
		this.setHeightTo = this.setHeightTo.bind( this );
		this.getColors = this.getColors.bind( this );
	}

	setRadiusTo( value ) {
		this.props.setAttributes( { radius: value } );
	}

	setSizeControl( value ) {
		this.props.setAttributes( { gridSize: value } );
	}

	setHeightTo( value ) {
		this.props.setAttributes( { height: value } );
	}

	getThumbnailNavigationHelp( checked ) {
		return checked ? __( 'Showing thumbnail navigation.' ) : __( 'Toggle to show thumbnails.' );
	}


	getResponsiveHeightHelp( checked ) {
		return checked ? __( 'Percentage based height is activated.' ) : __( 'Toggle for percentage based height.' );
	}

	getColors() {

		const {
			attributes,
			backgroundColor,
			captionColor,
			setBackgroundColor,
			setCaptionColor,
		} = this.props;

		const {
			backgroundImg,
			backgroundPadding,
			backgroundPaddingMobile,
			captions,
		} = attributes;

		const background = [
			{
				value: backgroundColor.color,
				onChange: ( nextBackgroundColor ) => {

					setBackgroundColor( nextBackgroundColor );

					// Add default padding, if they are not yet present.
					if ( ! backgroundPadding && ! backgroundPaddingMobile  ) {
						this.props.setAttributes( {
							backgroundPadding: 30,
							backgroundPaddingMobile: 30,
						} );
					}

					// Reset when cleared.
					if ( ! nextBackgroundColor && ! backgroundImg ) {
						this.props.setAttributes( {
							backgroundPadding: 0,
							backgroundPaddingMobile: 0,
						} );
					}
				},
				label: __( 'Background Color' ),
			},
		];

		const caption = [
			{
				value: captionColor.color,
				onChange: setCaptionColor,
				label: __( 'Caption Color' ),
			},
		];

		if ( captions ) {
			return background.concat( caption );
		} else {
			return background;
		}
	}

	render() {

		const {
			attributes,
			setAttributes,
			isSelected,
		} = this.props;

		const {
			align,
			gridSize,
			gutter,
			height,
			images,
			radius,
			thumbnails,
			responsiveHeight,
		} = attributes;

		return (
			isSelected && (
				<Fragment>
					<InspectorControls>
						<PanelBody
							title={
								// translators: %s: Block title
								sprintf( __( '%s Settings' ), title )
							}
						>
							<SizeControl { ...this.props }
								type={ 'grid' }
								label={ __( 'Size' ) }
								onChange={ this.setSizeControl }
								value={ gridSize }
								resetValue={ 'xlrg' }
							/>
							{ gridSize != null && ( align == 'wide' || align == 'full' ) &&
								<ResponsiveTabsControl { ...this.props }
									label={ __( 'Gutter' ) }
									max={ 20 }
								/>
							}
							{ gridSize != 'xlrg' && ! align &&
								<ResponsiveTabsControl { ...this.props }
									label={ __( 'Gutter' ) }
									max={ 20 }
								/>
							}
							{ !responsiveHeight &&
								<RangeControl
									label={ __( 'Height in pixels' ) }
									value={ height }
									onChange={ this.setHeightTo }
									min={ 200 }
									max={ 1000 }
									step={ 1 }
								/>
							}
							{ gutter > 0 && <RangeControl
								label={ __( 'Rounded Corners' ) }
								value={ radius }
								onChange={ this.setRadiusTo }
								min={ 0 }
								max={ 20 }
								step={ 1 }
							/> }
							<ToggleControl
								label={ __( 'Responsive Height' ) }
								checked={ !! responsiveHeight }
								onChange={ () => setAttributes( { responsiveHeight: ! responsiveHeight, className: !responsiveHeight ? 'responsive-height' : '' } ) }
								help={ this.getResponsiveHeightHelp }
							/>
							<ToggleControl
								label={ __( 'Thumbnail Navigation' ) }
								checked={ !! thumbnails }
								onChange={ () => setAttributes( { thumbnails: ! thumbnails } ) }
								help={ this.getThumbnailNavigationHelp }
							/>
						</PanelBody>
						<SliderPanel { ...this.props } />
						<BackgroundPanel { ...this.props }
		 					hasCaption={ true }
		 					hasOverlay={ true }
		 					hasGalleryControls={ true }
		 				/>
		 				<PanelColorSettings
							title={ __( 'Color Settings' ) }
							initialOpen={ false }
							colorSettings={ this.getColors() }
						/>
					</InspectorControls>
				</Fragment>
			)
		)
	}
};

export default Inspector;
