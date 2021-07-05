<?php
namespace STO\Graphql\Schema\Types;

use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ConfigType extends AbstractObjectType {
    public function build($config) {
        $config->addFields([
            'siteName'        => new NonNullType(new StringType()),
            'metaDescription' => new NonNullType(new StringType()),
            'metaKeywords'    => new NonNullType(new StringType()),
            'googleAnalytics' => new NonNullType(new StringType()),
            'timeZone'        => new NonNullType(new StringType()),
        ]);

    }
}