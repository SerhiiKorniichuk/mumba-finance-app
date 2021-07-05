<?php
namespace STO\Graphql\Schema\Types;

use STO\Graphql\Schema\Queries\IsAdmin\IsAdminField;
use STO\Graphql\Schema\Queries\IsViewer\IsViewerField;
use STO\Graphql\Schema\Queries\Verified\VerifiedField;
use STO\Graphql\Schema\Queries\UserLogs\UserLogsField;
use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\BooleanType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;

class UserType extends AbstractObjectType {
    public function build($config) {
        $config->addFields([
            'userId'          => new IntType(),
            'firstName'       => new StringType(),
            'lastName'        => new StringType(),
            'deactivated'     => new IntType(),
            'lastVisit'       => new StringType(),
            'isOnline'        => new BooleanType(),
            'photo'           => new StringType(),
            'isViewer'        => new IsViewerField(),
            'isAdmin'         => new IsAdminField(),
            'sex'             => new IntType(),
            'bday'            => new IntType(),
            'bmonth'          => new IntType(),
            'byear'           => new IntType(),
            'username'        => new StringType(),
            'lastVisitIp'     => new StringType(),
            'isVerified'      => new BooleanType(),
            'notifyNews'      => new BooleanType(),
            'notifyIncoming'  => new BooleanType(),
            'obfuscatedPhone' => new StringType(),
            'obfuscatedEmail' => new StringType(),
            'email'           => new StringType(),
            'phone'           => new StringType(),
            'joinDate'        => new StringType(),
            'joinIp'          => new StringType(),
            'logs'            => new UserLogsField(),
            'country'         => new StringType(),
            'banDate'         => new StringType(),
            'verified'        => new VerifiedField(),
        ]);
    }
}