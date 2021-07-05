<?php
namespace STO\Graphql\Schema\Queries\UserLogs;

use STO\Graphql\Schema\Queries\AdminAccess\AdminAccessField;
use STO\Graphql\Schema\Types\UserLogType;
use STO\Graphql\Schema\Types\UserType;
use STO\Graphql\Utils\PaginatedField;
use STO\Log\LogStorage;
use STO\Users\UsersStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class UserLogsField extends PaginatedField {

    public function getType() {
        return $this->getResultType(new UserLogType());
    }

    public function build(FieldConfig $config) {
        $this->addParams($config, [
            'query' => new StringType(),
        ]);
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $result = new AdminAccessField();
        $result->resolve($root, $params, $info);
        $options = ['userIds' => [$root['userId']]];
        $offset = 0;
        $limit = 10;
        if ($params['query']) {
            $options['query'] = $params['query'];
        }
        if ($params['limit'] > 0 && $params['limit'] <= 1000) {
            $limit = (int)$params['limit'];
        }
        if ($params['offset'] > 0) {
            $offset = (int)$params['offset'];
        }
        $logs = new LogStorage();
        $options['limit'] = $limit;
        $options['offset'] = $offset;
        [$count, $rows] = $logs->search($options);
        return $this->response($rows, $count, $limit, $offset);
    }
}