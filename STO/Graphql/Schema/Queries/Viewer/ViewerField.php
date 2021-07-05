<?php
namespace STO\Graphql\Schema\Queries\Viewer;

use STO\Graphql\Schema\Queries\User\UserField;
use STO\Graphql\Schema\Types\UserType;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use STO\Graphql\Utils\Exception;

class ViewerField extends AbstractField {
    public function getType() {
        return new NonNullType(new UserType());
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $container = $info->getExecutionContext()->getContainer();
        $user_id = (int)$container->get('userId');
        if (!$user_id) {
            throw new Exception(Exception::TOKEN_INCORRECT);
        }
        $controller = new UserField();
        return $controller->resolve([
            'userId' => $user_id,
        ], $params, $info);
    }
}