<?php
namespace STO\Graphql\Schema\Mutations\SetStaticPage;

use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\StringType;

class SetStaticPageInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'page'            => new NonNullType(new StringType()),
            'title'           => new NonNullType(new StringType()),
            'content'         => new NonNullType(new StringType()),
            'metaTitle'       => new NonNullType(new StringType()),
            'metaDescription' => new NonNullType(new StringType()),
            'metaKeywords'    => new NonNullType(new StringType()),
        ]);
    }
}