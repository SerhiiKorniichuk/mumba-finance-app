<?php
namespace STO\Graphql\Schema\Queries\IsAdmin;

use STO\Users\UsersStorage;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class IsAdminField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $container = $info->getExecutionContext()->getContainer();
        return $root['userId'] > 0 && ((int)$root['userId'] === (int)$container->get('userId') || $container->get('userType') === UsersStorage::TYPE_ADMIN) && (int)$root['type'] === UsersStorage::TYPE_ADMIN;
    }
}