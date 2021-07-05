import gql from 'graphql-tag';

export const MUTATION_LOGIN = gql`mutation ($username: String!, $password: String!, $code: String, $resetCode: Boolean, $phoneCode: String, $phoneResend: Boolean) {
  login(input: {
    username: $username,
    password: $password,
    code: $code,
    resetCode: $resetCode
   }, validation: {
    phone: {code: $phoneCode, resend: $phoneResend}
  }) {
    step
    generatorImage
    generatorSecret
    accessToken {
        userId
        accessToken
    }
  }
}`;

export const MUTATION_SIGNUP = gql`mutation ($email: String!, $phone: String!, $emailCode: String,
 $phoneCode: String, $phoneResend: Boolean, $emailResend: Boolean,
  $firstName: String!,$lastName: String!, $sex: Int!, $bday: Int!, $bmonth: Int!, $byear: Int!,
   $username: String!, $password: String!, $passwordRepeat: String!) {
  register(input: {
        email: $email,
        phone: $phone,
        firstName: $firstName, 
        lastName: $lastName,
        username: $username,
        password: $password,
        passwordRepeat: $passwordRepeat, 
        sex: $sex, 
        bday: $bday,
        bmonth: $bmonth, 
        byear: $byear
    }, validation: {
    email: {code: $emailCode, resend: $emailResend}
    phone: {code: $phoneCode, resend: $phoneResend}
  }) {
    step
    validation {
     email {
      state
      delay
     }
     phone {
      state
      delay
     }
    }
  }
}`;

export const MUTATION_RESTORE = gql`mutation ($username: String!, $emailCode: String, $password: String, $passwordRepeat: String, $emailResend: Boolean) {
  restore(input: {
        username: $username,
        password: $password,
        passwordRepeat: $passwordRepeat, 
    }, validation: {
    email: {code: $emailCode, resend: $emailResend}
    })
}`;

export const MUTATION_CONTACTS = gql`mutation ($fullName: String!, $phone: String!, $email: String!, $comment: String!) {
  contacts(input: {fullName: $fullName, phone: $phone, email: $email, comment: $comment})
}`;


export const MUTATION_PROFILE_PHOTO_UPLOAD = gql`mutation ($file: Upload!) {
    profilePhotoUpload(file: $file)
}`;

export const MUTATION_PROFILE_PHOTO_DELETE = gql`mutation {profilePhotoDelete}`;

export const MUTATION_UPLOAD_PHOTO = gql`mutation ($file: Upload!) {
    uploadPhoto(file: $file)
}`;

export const MUTATION_CHANGE_PASSWORD = gql`mutation($oldPassword: String!, $newPassword: String!, $newPasswordRepeat: String!) {
  changePassword(input: {oldPassword: $oldPassword, newPassword: $newPassword, newPasswordRepeat: $newPasswordRepeat})
}`;


export const MUTATION_CHANGE_NOTIFICATIONS = gql`mutation($notifyIncoming: Boolean!, $notifyNews: Boolean!) {
  changeNotifications(input: {notifyIncoming: $notifyIncoming, notifyNews: $notifyNews})
}`;

export const MUTATION_CHANGE_INFO = gql`mutation ($firstName: String!, $lastName: String!, $bday: Int!, $bmonth: Int!, $byear: Int!, $sex:Int!, $code: String!) {
  changeInfo(input: {firstName: $firstName, lastName: $lastName, bday: $bday, bmonth: $bmonth, byear: $byear, sex: $sex, code: $code})
}`;

export const MUTATION_CHANGE_PHONE = gql`mutation ($phone: String!, $phoneCode: String, $phoneResend: Boolean) {
  changePhone(input: {phone: $phone}, validation: {phone: {code: $phoneCode, resend: $phoneResend}})
}`;

export const MUTATION_CHANGE_EMAIL = gql`mutation ($email: String!, $oldEmailCode: String, $oldEmailResend: Boolean, $emailCode: String, $emailResend: Boolean) {
  changeEmail(input: {email: $email}, validationOld: {email: {code: $oldEmailCode, resend: $oldEmailResend}}, validation: {email: {code: $emailCode, resend: $emailResend}})
}`;

export const MUTATION_CHANGE_CONFIG = gql`mutation ($siteName: String!, $metaKeywords: String!, $metaDescription: String!, $googleAnalytics: String!, $timeZone: String!) {
  changeConfig(input: {siteName: $siteName, metaKeywords: $metaKeywords, metaDescription: $metaDescription, googleAnalytics: $googleAnalytics, timeZone: $timeZone})
}`;


export const MUTATION_CHANGE_USER_TYPE = gql`mutation ($userId: Int!, $userType: Int!) {
  changeUserType(input: {userId: $userId, userType: $userType})
}`;

export const MUTATION_CHANGE_DEACTIVATED = gql`mutation ($userId: Int!, $deactivatedStatus: Int!, $banDate: String) {
  changeUserDeactivated(input: {userId: $userId, deactivatedStatus: $deactivatedStatus, banDate: $banDate})
}`;

export const MUTATION_SET_STATIC_PAGE = gql`mutation ($title: String!, $content: String!, $page: String!, $metaTitle: String!, $metaDescription: String!, $metaKeywords: String!) {
  setStaticPage(input: {title: $title, content: $content, page: $page, metaTitle: $metaTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords})
}`;

export const MUTATION_VERIFICATION = gql`mutation ($firstName: String!, $lastName: String!, $sex: Int!, $bday: Int!, $bmonth: Int!, $byear: Int!, $documentPhoto: String!, $selfiePhoto: String!, $country: String!) {
  verification(input: {firstName: $firstName, lastName: $lastName, sex: $sex, bday: $bday, bmonth: $bmonth, byear: $byear, documentPhoto: $documentPhoto, selfiePhoto: $selfiePhoto, country: $country})
}`;

export const MUTATION_CHANGE_VERIFIED = gql`mutation ($userId: Int!, $verifiedStatus: Int!, $message: String!) {
  changeVerified(input: {userId: $userId, verifiedStatus: $verifiedStatus, message: $message})
}`;

export const QUERY_EMAIL_NOTIFICATIONS = gql`query {
  viewer {
    notifyIncoming
    notifyNews
  } 
}`;

export const QUERY_SETTINGS = gql`query {
  viewer {
    userId
    firstName
    lastName
    deactivated
    lastVisit
    isOnline
    photo
    isViewer
    isAdmin
    sex
    bday
    bmonth
    byear
    username
    isVerified
    obfuscatedPhone
    obfuscatedEmail
    verified {
      message
      status
    }
  } 
}`;

export const QUERY_VIEWER = gql`query {
  viewer {
    userId
    firstName
    lastName
    deactivated
    lastVisit
    isOnline
    photo
    isViewer
    isAdmin
    sex
    bday
    bmonth
    byear
    username
    isVerified
    country
    verified {
      message
      status
    }
  } 
 countries {
    countryCode
    countryName
  }
}`;

export const QUERY_HEADER_INFO = gql`query {
  viewer {
    firstName
    lastName
    deactivated
    photo
    isAdmin
    username
    isVerified
  } 
}`;

export const QUERY_GET_CONFIG = gql`query {
  getConfig {
    siteName
    timeZone
    metaKeywords
    googleAnalytics
    metaDescription
  }
}`;

export const QUERY_STATIC_PAGE = gql`query($page: String!) {
  getStaticPage(page: $page) {
    title
    content
    metaDescription
    metaKeywords
    metaTitle
  } 
}`;

export const QUERY_USER_SEARCH = gql`query ($query: String, $limit: Int, $offset: Int, $verifyRequests: Boolean) {
  userSearch (query: $query, limit: $limit, offset: $offset, verifyRequests: $verifyRequests) {
    pagingInfo {
      offset
      limit
      totalCount
    }
    items {
      userId
      firstName
      lastName
      username
      isVerified
      joinDate
    }
  }
}`;

export const QUERY_REQUESTS_COUNT = gql`query {
  userSearch (limit: 0, offset: 0, verifyRequests: true) {
    pagingInfo {
      totalCount
    }
  }
}`;

export const QUERY_DASHBOARD = gql`query {
  dashboard {
    allUsersCount
    allTokensCount
    monthlyUsersCount
    soldTokensCount
    residueTokensCount
    receivedBtc
    receivedUsd
    receivedMoney
    usersChartData
  }
}`;



export const QUERY_VIEW_USER = gql`query ($userId: Int!, $offset: Int, $limit: Int, $query: String) {
  user(userId: $userId) {
    userId
    firstName
    lastName
    deactivated
    lastVisit
    isOnline
    photo
    isViewer
    isAdmin
    banDate
    sex
    bday
    bmonth
    byear
    lastVisitIp
    username
    isVerified
    notifyNews
    notifyIncoming
    email
    phone
    joinDate
    joinIp
    country
    verified {
      message
      status
      photos
    }
    userLogs(query: $query, limit: $limit, offset: $offset) {
      pagingInfo {
        offset
        limit
        totalCount
      }
      items {
        actionType
        actionComment
        ipAddress
        date
        browserVersion
        browser
        browserPlatform
        browserUserAgent
      }
    }
  }
  countries {
    countryCode
    countryName
  }
}`;