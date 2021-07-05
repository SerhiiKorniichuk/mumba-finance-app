<?php
namespace STO\Graphql\Schema\Queries\AdminAccess;

use STO\Graphql\Schema\Queries\IsAdmin\IsAdminField;
use STO\Graphql\Schema\Queries\Viewer\ViewerField;
use STO\Users\UsersStorage;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use STO\Graphql\Utils\Exception;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class AdminAccessField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $container = $info->getExecutionContext()->getContainer();
        $user_id  = (int)$container->get('userId');
        $userType = (int)$container->get('userType');
        if (!$user_id) {
            throw new Exception(Exception::TOKEN_INCORRECT);
        }
        if ($userType !== UsersStorage::TYPE_ADMIN) {
            throw new Exception(Exception::SECURITY_ERROR);
        }
        return true;
    }
}