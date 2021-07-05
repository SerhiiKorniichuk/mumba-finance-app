<?php
namespace STO\Graphql\Schema\Mutations\ChangeUserDeactivated;

use STO\Graphql\Schema\Queries\AdminAccess\AdminAccessField;
use STO\Log\LogStorage;
use STO\Users\UsersStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use STO\Graphql\Utils\Exception;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class ChangeUserDeactivatedField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments(['input' => new NonNullType(new ChangeUserDeactivatedInput())]);
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $admin = new AdminAccessField();
        $admin->resolve([], [], $info);
        $input = $params['input'];
        $userId = $input['userId'];
        $banDate = strtotime($input['banDate']);
        $deactivatedStatus = (int)$input['deactivatedStatus'];
        if (!in_array($deactivatedStatus, [
            UsersStorage::DEACTIVATED_DELETED,
            UsersStorage::DEACTIVATED_BANNED,
            UsersStorage::DEACTIVATED_NONE,
        ])) {
            throw new Exception(Exception::INCORRECT_DEACTIVATED_TYPE);
        }
        $users = new UsersStorage();
        if ($deactivatedStatus === UsersStorage::DEACTIVATED_BANNED) {
            if (!$banDate) {
                throw new Exception(Exception::BAN_DATE_NOT_ENTERED);
            }
            if (!$users->updateBanDate($userId, $banDate)) {
                throw new Exception(Exception::INTERNAL_ERROR);
            }
        }
        if (!$users->updateDeactivated($userId, $deactivatedStatus)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        return true;
    }
}
