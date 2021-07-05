<?php
namespace STO\Graphql\Schema\Queries\UserSearch;

use STO\Graphql\Schema\Queries\AdminAccess\AdminAccessField;
use STO\Graphql\Schema\Types\UserType;
use STO\Graphql\Utils\PaginatedField;
use STO\Users\UsersStorage;
use STO\Verification\VerificationStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class UserSearchField extends PaginatedField {

    public function getType() {
        return $this->getResultType(new UserType());
    }

    public function build(FieldConfig $config) {
        $this->addParams($config, [
            'query'          => new StringType(),
            'isOnline'       => new BooleanType(),
            'withPhoto'      => new BooleanType(),
            'verifyRequests' => new BooleanType()
        ]);
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $result = new AdminAccessField();
        $result->resolve($root, $params, $info);
        $options = [];
        $offset = 0;
        $limit = 10;
        if ($params['query']) {
            $options['query'] = $params['query'];
        }
        if ($params['isOnline']) {
            $options['online'] = 1;
        }
        if ($params['withPhoto']) {
            $options['photo'] = 1;
        }
        if ($params['withPhoto']) {
            $options['photo'] = 1;
        }
        if ($params['limit'] > 0 && $params['limit'] < 1000) {
            $limit = (int)$params['limit'];
        }
        if ($params['offset'] > 0) {
            $offset = (int)$params['offset'];
        }
        $users = new UsersStorage();
        $verification = new VerificationStorage();
        $options['limit'] = $limit;
        $options['offset'] = $offset;

        if ($params['verifyRequests']) {
            [$count, $user_ids] = $verification->getRequests($options['limit'], $options['offset']);
            if ($count) {
                $rows = $users->getUsers($user_ids);
            } else {
                $rows = [];
            }
        } else {
            [$count, $rows] = $users->search($options);
        }

        return $this->response($rows, $count, $limit, $offset);
    }
}