<?php
namespace STO\Graphql\Schema\Types;

use Youshido\GraphQL\Type\ListType\ListType;
use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;

class VerifiedType extends AbstractObjectType {
    public function build($config) {
        $config->addFields([
            'message'     => new StringType(),
            'status'      => new IntType(),
            'photos'      => new ListType(new StringType()),
        ]);
    }
}