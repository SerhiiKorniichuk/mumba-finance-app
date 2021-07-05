<?php
namespace STO\Graphql\Schema\Types;

use Youshido\GraphQL\Type\ListType\ListType;
use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Object\ObjectType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ValidationResultType extends AbstractObjectType {
    public function build($config) {
        $config->addFields([
            'state'      => new IntType(),
            'delay'      => new IntType(),
        ]);
    }
}