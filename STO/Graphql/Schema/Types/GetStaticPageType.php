<?php
namespace STO\Graphql\Schema\Types;

use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Object\ObjectType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\ListType\ListType;

class GetStaticPageType extends AbstractObjectType {
    public function build($config) {
        $config->addFields([
            'title'           => new StringType(),
            'content'         => new StringType(),
            'metaTitle'       => new StringType(),
            'metaDescription' => new StringType(),
            'metaKeywords'    => new StringType(),
        ]);
    }
}