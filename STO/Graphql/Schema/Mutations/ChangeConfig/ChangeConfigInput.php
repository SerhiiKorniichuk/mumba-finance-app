<?php
namespace STO\Graphql\Schema\Mutations\ChangeConfig;

use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ChangeConfigInput extends AbstractInputObjectType {
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
