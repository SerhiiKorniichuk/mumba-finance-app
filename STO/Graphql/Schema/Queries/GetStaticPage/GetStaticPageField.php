<?php
namespace STO\Graphql\Schema\Queries\GetStaticPage;

use STO\Graphql\Schema\Types\GetStaticPageType;
use STO\Graphql\Utils\Exception;
use STO\Pages\PagesStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\StringType;

class GetStaticPageField extends AbstractField {

    public function build(FieldConfig $config) {
        $config->addArguments([
            'page' => new NonNullType(new StringType()),
        ]);
    }
    public function getType() {
        return new GetStaticPageType();
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $page = $params['page'];

        $pages = new PagesStorage();

        $result = $pages->getPage($page);
        if (!$result) {
            throw new Exception(Exception::PAGE_NOT_FOUND);
        }
        return $result;
    }
}