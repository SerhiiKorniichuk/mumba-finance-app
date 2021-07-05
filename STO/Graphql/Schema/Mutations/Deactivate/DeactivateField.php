<?php
namespace STO\Graphql\Schema\Mutations\Deactivate;

use STO\Log\LogStorage;
use STO\Users\UsersStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use STO\Graphql\Utils\Exception;
use STO\Graphql\Schema\Queries\Viewer\ViewerField;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class DeactivateField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments(['input' => new NonNullType(new DeactivateInput())]);
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $viewer = new ViewerField();
        $user = $viewer->resolve([], [], $info);
        $user_id = $user['userId'];
        $password = $params['input']['password'];
        $users = new UsersStorage();
        if (!$users->validatePassword($user, $password)) {
            throw new Exception(Exception::PASSWORD_INCORRECT);
        }
        if (!$users->updateDeactivated($user_id, UsersStorage::DEACTIVATED_DEACTIVATED)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        $logs = new LogStorage();
        $logs->insert($user_id, LogStorage::TYPE_DEACTIVATE_PROFILE, 'Account has been deactivated');

        return true;
    }
}
