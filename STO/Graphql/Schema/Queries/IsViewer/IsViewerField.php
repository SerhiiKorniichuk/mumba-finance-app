<?php
namespace STO\Graphql\Schema\Queries\IsViewer;

use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class IsViewerField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $container = $info->getExecutionContext()->getContainer();
        return $root['userId'] > 0 && (int)$root['userId'] === (int)$container->get('userId');
    }
}