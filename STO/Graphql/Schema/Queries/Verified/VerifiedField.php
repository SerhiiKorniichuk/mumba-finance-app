<?php
namespace STO\Graphql\Schema\Queries\Verified;

use STO\Graphql\Schema\Types\VerifiedType;
use STO\Users\UsersStorage;
use STO\Verification\VerificationStorage;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;

class VerifiedField extends AbstractField {
    public function getType() {
        return new VerifiedType();
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $container = $info->getExecutionContext()->getContainer();
        $is_admin = $container->get('userType') === UsersStorage::TYPE_ADMIN;
        $verification = new VerificationStorage();
        $row = $verification->getRow($root['userId']);
        return [
            'message'     => $row ? $row['message'] : '',
            'status'      => $row ? (int)$row['status'] : VerificationStorage::STATUS_NONE,
            'photos'      => $is_admin ? $row['photos'] : [],
        ];
    }
}