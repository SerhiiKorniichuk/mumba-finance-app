<?php
namespace STO\Graphql\Schema\Mutations\ChangePassword;

use STO\Graphql\Schema\Queries\Viewer\ViewerField;
use STO\Log\LogStorage;
use STO\Users\UsersStorage;
use STO\Graphql\Utils\Exception;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class ChangePasswordField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments(['input' => new NonNullType(new ChangePasswordInput())]);
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $viewer = new ViewerField();
        $user = $viewer->resolve([], [], $info);
        $user_id = $user['userId'];
        $params = $params['input'];
        $old_password = $params['oldPassword'];
        $new_password = $params['newPassword'];
        $new_password_repeat = $params['newPasswordRepeat'];
        $users = new UsersStorage();
        if (!$users->validatePassword($user, $old_password)) {
            throw new Exception(Exception::OLD_PASSWORD_INCORRECT);
        }
        if (!$users->isCorrectPassword($new_password)) {
            throw new Exception(Exception::PASSWORD_LENGTH_MINIMUM);
        }
        if ($new_password_repeat !== $new_password) {
            throw new Exception(Exception::PASSWORDS_NOT_MATCH);
        }
        if ($old_password === $new_password) {
            throw new Exception(Exception::PASSWORD_ALREADY_USED);
        }
        if (!$users->updatePassword($user_id, $new_password)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        $logs = new LogStorage();
        $logs->insert($user_id, LogStorage::TYPE_CHANGE_PASSWORD, 'Password has been changed');
        return true;
    }
}

