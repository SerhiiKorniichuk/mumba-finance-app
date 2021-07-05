<?php
namespace STO\Graphql;

use Youshido\GraphQL\Config\Schema\SchemaConfig;
use Youshido\GraphQL\Schema\AbstractSchema;
use STO\Graphql\Schema\Queries;
use STO\Graphql\Schema\Mutations;

class Schema extends AbstractSchema {
    public function getName($config) {
        return '';
    }
    public function build(SchemaConfig $config) {
        $config->getQuery()->addFields([
            new Queries\User\UserField(),
            new Queries\Viewer\ViewerField(),
            new Queries\Debug\DebugField(),
            new Queries\UserSearch\UserSearchField(),
            new Queries\GetStaticPage\GetStaticPageField(),
            new Queries\GetConfig\GetConfigField(),
            new Queries\Dashboard\DashboardField(),
            new Queries\Countries\CountriesField(),
        ]);
        $config->getMutation()->addFields([
            new Mutations\Login\LoginField(),
            new Mutations\Deactivate\DeactivateField(),
            new Mutations\Register\RegisterField(),
            new Mutations\Restore\RestoreField(),
            new Mutations\ChangePassword\ChangePasswordField(),
            new Mutations\Contacts\ContactsField(),
            new Mutations\ChangeInfo\ChangeInfoField(),
            new Mutations\ProfilePhotoUpload\ProfilePhotoUploadField(),
            new Mutations\ProfilePhotoDelete\ProfilePhotoDeleteField(),
            new Mutations\ChangeNotifications\ChangeNotificationsField(),
            new Mutations\ChangePhone\ChangePhoneField(),
            new Mutations\ChangeEmail\ChangeEmailField(),
            new Mutations\SetStaticPage\SetStaticPageField(),
            new Mutations\ChangeConfig\ChangeConfigField(),
            new Mutations\ChangeUserType\ChangeUserTypeField(),
            new Mutations\ChangeUserDeactivated\ChangeUserDeactivatedField(),
            new Mutations\UploadPhoto\UploadPhotoField(),
            new Mutations\Verification\VerificationField(),
            new Mutations\ChangeVerified\ChangeVerifiedField(),
        ]);
    }

}