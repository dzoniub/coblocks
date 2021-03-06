<?php
/**
 * Crop system for the Advanced Image extension.
 *
 * @package CoBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Crops Images
 */
class CoBlocks_Crop_System
{
    const ORIGINAL_META_KEY = 'original-image-id';
    const CROP_META_KEY = 'crop-image-data';

    private static $instance;

    public static function instance()
    {
        if (empty(self::$instance)) {
            self::$instance = new CoBlocks_Crop_System();
        }

        return self::$instance;
    }

    public function registerEndpoints()
    {
        add_filter('ajax_query_attachments_args', array($this, 'hideCroppedFromLibrary'));
        add_action('wp_ajax_coblocks_system_crop', array($this, 'apiCrop'));
        add_action('wp_ajax_coblocks_system_original_image', array($this, 'getOriginalImage'));
    }

    public function hideCroppedFromLibrary($query)
    {
        $tag = get_term_by('slug', 'coblocks-cropped', 'post_tag');

        if (!empty($tag)) {
            $query['tag__not_in'][] = $tag->term_id;
        }

        return $query;
    }

    public function getOriginalImage()
    {
        if (!isset($_POST['id'])) {
            http_response_code(400);
            die();
        }

        $id = (int)$_POST['id'];

        $attachmentMeta = wp_get_attachment_metadata($id);

        if (isset($attachmentMeta[self::ORIGINAL_META_KEY])) {
            $originalImageId = $attachmentMeta[self::ORIGINAL_META_KEY];
        } else {
            $originalImageId = $id;
        }

        echo json_encode([
            'url' => wp_get_attachment_image_url($originalImageId, 'original'),
        ]);

        die();
    }

    public function apiCrop()
    {
        if (!isset($_POST['id']) || !isset($_POST['cropX']) || !isset($_POST['cropY']) || !isset($_POST['cropWidth']) || !isset($_POST['cropHeight']) || !isset($_POST['cropRotation'])) {
            http_response_code(400);
            die();
        }

        $newId = $this->imageMediaCrop(
            intval($_POST['id']),
            floatval($_POST['cropX']),
            floatval($_POST['cropY']),
            floatval($_POST['cropWidth']),
            floatval($_POST['cropHeight']),
            floatval($_POST['cropRotation'])
        );

        http_response_code(200);

        if ($newId !== null) {
            echo json_encode([
                'success' => true,
                'id'      => $newId,
                'url'     => wp_get_attachment_image_url($newId, 'original'),
            ]);
        } else {
            echo json_encode([
                'success' => false,
            ]);
        }

        die();
    }

    public function imageMediaCrop($id, $offsetX, $offsetY, $width, $height, $rotate)
    {
        require_once(ABSPATH.'wp-admin/includes/image.php');

        $attachmentMeta = wp_get_attachment_metadata($id);

        if (isset($attachmentMeta[self::ORIGINAL_META_KEY])) {
            $originalImageId = $attachmentMeta[self::ORIGINAL_META_KEY];
        } else {
            $originalImageId = $id;
        }

        $filePath = get_attached_file($originalImageId);

        if (empty($filePath)) {
            return null;
        }

        $imageEditor = wp_get_image_editor($filePath);
        $loaded      = $imageEditor->load();

        if (!$loaded) {
            return null;
        }

        $nR = (360 - round($rotate)) % 360;
        $sz = $imageEditor->get_size();

        if ($nR !== 0 && $nR !== 180) {
            $originalWidth = $sz['width'];
            $sz['width']   = $sz['height'];
            $sz['height']  = $originalWidth;
        }

        $nX = round($sz['width'] * $offsetX / 100);
        $nY = round($sz['height'] * $offsetY / 100);
        $nW = round($sz['width'] * $width / 100);
        $nH = round($sz['height'] * $height / 100);

        $newName  = 'crop-'.$nX.'-'.$nY.'-'.$nW.'-'.$nH.'-'.$nR.'-'.basename($filePath);
        $filename = rtrim(dirname($filePath), '/').'/'.$newName;

        $existingAttachment = get_page_by_title($newName, ARRAY_A, 'attachment');
        if (!empty($existingAttachment)) {
            return $existingAttachment['ID'];
        }

        if (!empty($nR)) {
            $imageEditor->rotate($nR);
        }
        $cropped = $imageEditor->crop($nX, $nY, $nW, $nH);

        if (!$cropped) {
            return null;
        }

        $savedImage = $imageEditor->save($filename);

        if ($savedImage instanceof WP_Error) {
            return null;
        }

        $filename = $savedImage['path'];
        $mimeType = $savedImage['mime-type'];

        $attachmentId = wp_insert_attachment(array(
            'guid'           => $filename,
            'post_mime_type' => $mimeType,
            'post_title'     => $newName,
            'post_content'   => '',
            'post_status'    => 'inherit'
        ), $filename, 0);

        $metadata                          = wp_generate_attachment_metadata($attachmentId, $filename);
        $metadata[self::ORIGINAL_META_KEY] = $originalImageId;
        $metadata[self::CROP_META_KEY]     = array(
            'offsetX'  => $offsetX,
            'offsetY'  => $offsetY,
            'width'    => $width,
            'height'   => $height,
            'rotation' => $rotate,
        );

        wp_update_attachment_metadata($attachmentId, $metadata);
        wp_set_post_tags($attachmentId, 'coblocks-cropped', true);

        return $attachmentId;
    }
}

CoBlocks_Crop_System::instance()->registerEndpoints();
