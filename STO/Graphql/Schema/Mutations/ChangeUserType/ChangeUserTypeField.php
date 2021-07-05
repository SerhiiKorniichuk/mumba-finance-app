<?php
namespace STO\Graphql\Schema\Mutations\ChangeUserType;

use STO\Graphql\Schema\Queries\AdminAccess\AdminAccessField;
use STO\Log\LogStorage;
use STO\Users\UsersStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use STO\Graphql\Utils\Exception;
use STO\Graphql\Schema\Queries\Viewer\ViewerField;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class ChangeUserTypeField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments(['input' => new NonNullType(new ChangeUserTypeInput())]);
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $admin = new AdminAccessField();
        $admin->resolve([], [], $info);
        $input = $params['input'];
        $userId = $input['userId'];
        $userType = (int)$input['userType'];
        if (!in_array($userType, [
            UsersStorage::TYPE_ADMIN,
            UsersStorage::TYPE_USER,
        ])) {
            throw new Exception(Exception::INCORRECT_DEACTIVATED_TYPE);
        }
        $users = new UsersStorage();
        if (!$users->updateType($userId, $userType)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        return true;
    }
}
