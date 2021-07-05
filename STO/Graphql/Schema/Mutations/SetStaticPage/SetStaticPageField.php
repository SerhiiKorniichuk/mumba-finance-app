<?php
namespace STO\Graphql\Schema\Mutations\SetStaticPage;

use STO\Graphql\Schema\Mutations\Validation\ValidationField;
use STO\Graphql\Schema\Mutations\Validation\ValidationInput;
use STO\Graphql\Schema\Queries\AdminAccess\AdminAccessField;
use STO\Graphql\Schema\Queries\Viewer\ViewerField;
use STO\Graphql\Utils\Exception;
use STO\Log\LogStorage;
use STO\Pages\PagesStorage;
use STO\Users\UsersStorage;

use STO\Utils\Phone;
use STO\Validation\ValidationService;
use STO\Validation\ValidationStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\BooleanType;
use Youshido\GraphQL\Type\Scalar\StringType;

class SetStaticPageField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }
    public function build(FieldConfig $config) {
        $config->addArguments([
            'input'         => new NonNullType(new SetStaticPageInput()),
        ]);
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $result = new AdminAccessField();
        $result->resolve($root, $params, $info);
        $input           = $params['input'];
        $page            = $input['page'];
        $title           = $input['title'];
        $content         = $input['content'];
        $metaTitle       = $input['metaTitle'];
        $metaDescription = $input['metaDescription'];
        $metaKeywords    = $input['metaKeywords'];

        if (!$metaTitle) {
            $metaTitle = $title;
        }

        if (!$title) {
            throw new Exception(Exception::TITLE_IS_REQUIRED);
        }

        if (!$content) {
            throw new Exception(Exception::CONTENT_IS_REQUIRED);
        }
        $pages = new PagesStorage();
        if (!$pages->set($page, $title, $content, $metaTitle, $metaDescription, $metaKeywords)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        return true;
    }
}