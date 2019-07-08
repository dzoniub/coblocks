const el = wp.element.createElement;
const {assign} = lodash;
const {createHigherOrderComponent} = wp.compose;
const {Fragment} = wp.element;
const {InspectorControls} = wp.editor;
const {PanelBody} = wp.components;
const {PanelRow} = wp.components;
const {PanelColumn} = wp.components;
const {TextControl} = wp.components;
const {ButtonGroup} = wp.components;
const {Button} = wp.components;
const {addFilter} = wp.hooks;
const {__} = wp.i18n;

const supportedBlocks = [
    'core/image',
];

const addPositioningControl = (settings, name) => {
    if (!supportedBlocks.includes(name)) {
        return settings;
    }

    settings.attributes = assign(settings.attributes, {
        cropX: {
            type: 'number',
            default: 0,
        },
        cropY: {
            type: 'number',
            default: 0,
        },
        cropWidth: {
            type: 'number',
            default: 100,
        },
        cropHeight: {
            type: 'number',
            default: 100,
        },
        cropRotation: {
            type: 'number',
            default: 0,
        }
    });

    return settings;
};

const positioningControl = createHigherOrderComponent((BlockEdit) => {
        return (props) => {
            // Do nothing if it's another block than our defined ones.
            if (!supportedBlocks.includes(props.name)) {
                return (
                    <BlockEdit {...props} />
                );
            }

            const {
                attributes,
                setAttributes
            } = props;

            const {cropX, cropY, cropWidth, cropHeight, cropRotation} = attributes;

            return (
                <Fragment>
                    <BlockEdit {...props} />
                    <InspectorControls>
                        <PanelBody title={__('Crop Settings')} initialOpen={false}>
                            <TextControl
                                label={__('Offset X (%)')}
                                value={cropX}
                                type={'number'}
                                min={0}
                                max={100}
                                onChange={(val) => setAttributes({cropX: val})}
                            />
                            <TextControl
                                label={__('Offset Y (%)')}
                                value={cropY}
                                type={'number'}
                                min={0}
                                max={100}
                                onChange={(val) => setAttributes({cropY: val})}
                            />
                            <TextControl
                                label={__('Width (%)')}
                                value={cropWidth}
                                type={'number'}
                                min={0}
                                max={100}
                                onChange={(val) => setAttributes({cropWidth: val})}
                            />
                            <TextControl
                                label={__('Height (%)')}
                                value={cropHeight}
                                type={'number'}
                                min={0}
                                max={100}
                                onChange={(val) => setAttributes({cropHeight: val})}
                            />
                            <ButtonGroup>
                                <Button
                                    isDefault
                                    isPrimary={cropRotation === 0}
                                    onClick={() => setAttributes({cropRotation: 0})}
                                >
                                    0°
                                </Button>
                                <Button
                                    isDefault
                                    isPrimary={cropRotation === 90}
                                    onClick={() => setAttributes({cropRotation: 90})}
                                >
                                    90°
                                </Button>
                                <Button
                                    isDefault
                                    isPrimary={cropRotation === 180}
                                    onClick={() => setAttributes({cropRotation: 180})}
                                >
                                    180°
                                </Button>
                                <Button
                                    isDefault
                                    isPrimary={cropRotation === 270}
                                    onClick={() => setAttributes({cropRotation: 270})}
                                >
                                    270°
                                </Button>
                            </ButtonGroup>
                        </PanelBody>
                    </InspectorControls>
                </Fragment>
            );
        };
    },
    'positioningControl'
);

addFilter('blocks.registerBlockType', 'coblocks/imagePositioning/attributes', addPositioningControl);
addFilter('editor.BlockEdit', 'coblocks/positioning', positioningControl);