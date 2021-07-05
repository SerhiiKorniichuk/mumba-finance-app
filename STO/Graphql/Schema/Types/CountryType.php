<?php
namespace STO\Graphql\Schema\Types;

use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Object\ObjectType;
use Youshido\GraphQL\Type\Scalar\BooleanType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\ListType\ListType;

class CountryType extends AbstractObjectType {
    public function build($config) {
        $config->addFields([
            'countryCode'   => new StringType(),
            'countryName'   => new StringType(),
        ]);
    }
}