/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Edit from './edit';
import icons from './icons';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createBlock } = wp.blocks;
const { RichText, getColorClassName, getFontSizeClass, InnerBlocks } = wp.blockEditor;
const { Button } = wp.components;


/**
 * Block constants
 */
const name = 'button';

const title = __( 'Button' );

const icon = icons.buttons;

const blockAttributes = {
    buttonLabel: {
        type: 'string',
        default: 'Sign up',
    },
    backgroundColor: {
        type: 'string',
    },
    textColor: {
        type: 'string',
    },
    customBackgroundColor: {
        type: 'string',
    },
    customTextColor: {
        type: 'string',
    },
};

const settings = {

    title: title,

    description: __( 'Child element of subscribe block.' ),

    attributes: blockAttributes,

    transforms: {},

    parent: [ 'coblocks/subscribe' ],

    edit: Edit,

    save( { attributes, className } ) {
        const {
            buttonLabel,
            backgroundColor,
            textColor,
            customBackgroundColor,
            customTextColor,
        } = attributes;

        const backgroundClass = getColorClassName( 'background-color', backgroundColor );
        const textClass = getColorClassName( 'color', textColor );

        const buttonClasses = classnames( 'sign-up-button', {
            'has-text-color': textColor || customTextColor,
            [ textClass ]: textClass,
            'has-background': backgroundColor || customBackgroundColor,
            [ backgroundClass ]: backgroundClass,
        } );

        const buttonStyles = {
            backgroundColor: backgroundClass ? undefined : customBackgroundColor,
            color: textClass ? undefined : customTextColor,
        };

        return (
            <Button
                className={buttonClasses}
                style={buttonStyles}
                >{buttonLabel}</Button>
        );
    },
};

export { name, title, icon, settings };
