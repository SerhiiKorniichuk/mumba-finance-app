<?php
namespace STO\Graphql\Schema\Mutations\ProfilePhotoUpload;

use STO\Graphql\Schema\Inputs\Upload as UploadInput;
use STO\Graphql\Schema\Queries\Viewer\ViewerField;
use STO\Graphql\Utils\Exception;
use STO\Log\LogStorage;
use STO\Users\UsersStorage;
use STO\Utils\Upload;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\Scalar\StringType;

class ProfilePhotoUploadField extends AbstractField {
    public function getType() {
        return new StringType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments(['file' => new UploadInput()]);
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $viewer = new ViewerField();
        $user = $viewer->resolve([], [], $info);
        $users = new UsersStorage();
        $file = $params['file']['tmp_name'];

        if (!$file) {
            throw new Exception(Exception::FILE_IS_REQUIRED);
        }
        $photo_hash = Upload::getInstance()->savePhotoThumbnail($file);
        if (!$photo_hash) {
            throw new Exception(Exception::UNSUPPORTED_FILE_TYPE);
        }
        $result = $users->updatePhoto($user['userId'], $photo_hash);
        if (!$result) {
            Upload::getInstance()->deletePhoto($photo_hash);
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        $result = $users->updatePhoto($user['userId'], $photo_hash);
        if (!$result) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        if ($user['photo']) {
            Upload::getInstance()->deletePhoto($user['photo']);
        }
        $user = $users->getUser($user['userId']);
        $logs = new LogStorage();
        $logs->insert($user['userId'], LogStorage::TYPE_CHANGE_PHOTO, 'Profile photo has been changed');
        return $user['photo'];
    }
}




