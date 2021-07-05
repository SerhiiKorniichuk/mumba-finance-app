<?php
namespace STO\Graphql\Schema\Mutations\ProfilePhotoDelete;

use STO\Graphql\Schema\Queries\Viewer\ViewerField;
use STO\Log\LogStorage;
use STO\ShortenUrl\ShortenUrlStorage;
use STO\Users\UsersStorage;
use STO\Utils\Upload;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use STO\Graphql\Utils\Exception;
use Youshido\GraphQL\Type\Scalar\BooleanType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ProfilePhotoDeleteField extends AbstractField {
    public function getType() {
        return new StringType();
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $viewer = new ViewerField();
        $user = $viewer->resolve([], [], $info);
        $users = new UsersStorage();
        if (!$users->updatePhoto($user['userId'], '')) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        if ($user['photo']) {
            Upload::getInstance()->deletePhoto($user['photo']);
        }
        $user['photo'] = '';
        $logs = new LogStorage();
        $logs->insert($user['userId'], LogStorage::TYPE_DELETE_PHOTO, 'Profile photo has been deleted');

        return $users->getPhoto($user);
    }
}
