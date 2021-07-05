<?php
namespace STO\Graphql\Schema\Queries\User;

use STO\Graphql\Schema\Queries\AdminAccess\AdminAccessField;
use STO\Graphql\Schema\Types\UserType;
use STO\Users\UsersStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\NonNullType;
use STO\Graphql\Utils\Exception;

class UserField extends AbstractField {
    public function getType() {
        return new UserType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments([
            'userId' => new NonNullType(new IntType()),
        ]);
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $user_id = (int)$root['userId']?:$params['userId'];
        if (!$user_id) {
            throw new Exception(Exception::ENTER_USER_ID);
        }
        $container = $info->getExecutionContext()->getContainer();
        $auth_user_id = (int)$container->get('userId');
        $is_admin = (int)$container->get('userType') === UsersStorage::TYPE_ADMIN;
        if ($auth_user_id !== $user_id) {
            $result = new AdminAccessField();
            $is_admin = $result->resolve($root, $params, $info);
        }
        $users = new UsersStorage();
        $row = $users->getUser($user_id);
        if (!$row) {
            throw new Exception(Exception::USER_NOT_FOUND);
        }
        if (!$is_admin) {
            $row['email'] = $row['obfuscatedEmail'];
            $row['phone'] = $row['obfuscatedPhone'];
            $row['joinDate'] = 0;
            $row['lastVisitIp'] = '0.0.0.0';
            $row['joinIp'] = '0.0.0.0';
        }
        return $row;
    }
}