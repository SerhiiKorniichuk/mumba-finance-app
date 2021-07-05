<?php
namespace STO\Graphql\Schema\Mutations\UploadPhoto;

use STO\Graphql\Schema\Inputs\Upload as UploadInput;
use STO\Graphql\Schema\Queries\Viewer\ViewerField;
use STO\Graphql\Utils\Exception;
use STO\Utils\Upload;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\Scalar\StringType;

class UploadPhotoField extends AbstractField {
    public function getType() {
        return new StringType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments(['file' => new UploadInput()]);
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $viewer = new ViewerField();
        $user = $viewer->resolve([], [], $info);
        $file = $params['file']['tmp_name'];
        if (!$file) {
            throw new Exception(Exception::FILE_IS_REQUIRED);
        }
        $photo_hash = Upload::getInstance()->savePhotoThumbnail($file, 1200, false);
        if (!$photo_hash) {
            throw new Exception(Exception::UNSUPPORTED_FILE_TYPE);
        }
        return Upload::getInstance()->getPhoto($photo_hash);
    }
}




