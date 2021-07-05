<?php
namespace STO\Graphql\Schema\Mutations\ChangeConfig;

use STO\Config\ConfigStorage;
use STO\Graphql\Schema\Queries\AdminAccess\AdminAccessField;
use STO\Graphql\Utils\Exception;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class ChangeConfigField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }

    public function build(FieldConfig $config) {
        $config->addArguments([
            'input'         => new NonNullType(new ChangeConfigInput()),
        ]);
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $result = new AdminAccessField();
        $result->resolve($root, $params, $info);
        $input = $params['input'];

        $config = new ConfigStorage();
        $is_changed = $config->setConfig(ConfigStorage::NAME_MAIN, [
            'siteName'        => $input['siteName'],
            'metaDescription' => $input['metaDescription'],
            'metaKeywords'    => $input['metaKeywords'],
            'googleAnalytics' => $input['googleAnalytics'],
            'timeZone'        => $input['timeZone'],
        ]);
        if (!$is_changed) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        return true;
    }
}