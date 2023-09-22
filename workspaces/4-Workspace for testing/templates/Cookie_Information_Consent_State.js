___TERMS_OF_SERVICE___

By creating or modifying this file you agree to Google Tag Manager's Community
Template Gallery Developer Terms of Service available at
https://developers.google.com/tag-manager/gallery-tos (or such other URL as
Google may provide), as modified from time to time.


___INFO___

{
  "type": "MACRO",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "Cookie Information Consent State",
  "description": "Use with the Cookie Information CMP to signal the individual website user\u0027s consent state to tags that are setting cookies.",
  "containerContexts": [
    "WEB"
  ],
  "categories": [
    "TAG_MANAGEMENT",
    "PERSONALIZATION"
  ],
  "brand": {
    "displayName": "GunnarGriese",
    "id": "github.com_GunnarGriese"
  }
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "SELECT",
    "name": "consentType",
    "displayName": "Consent Type",
    "macrosInSelect": false,
    "selectItems": [
      {
        "value": "cookie_cat_necessary",
        "displayValue": "cookie_cat_necessary"
      },
      {
        "value": "cookie_cat_functional",
        "displayValue": "cookie_cat_functional"
      },
      {
        "value": "cookie_cat_statistic",
        "displayValue": "cookie_cat_statistic"
      },
      {
        "value": "cookie_cat_marketing",
        "displayValue": "cookie_cat_marketing"
      },
      {
        "value": "cookie_cat_unclassified",
        "displayValue": "cookie_cat_unclassified"
      }
    ],
    "simpleValueType": true,
    "valueValidators": [
      {
        "type": "NON_EMPTY"
      }
    ],
    "alwaysInSummary": true
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

const getCookieValues = require('getCookieValues');
const JSON = require('JSON');
const decodeUriComponent = require('decodeUriComponent');
const callInWindow = require('callInWindow');
const copyFromWindow = require('copyFromWindow');

const consentType = data.consentType;
const consentCookie = getCookieValues('CookieInformationConsent');

// If cookie present check for consent saved here
if (consentCookie.length > 0) {
  const parsedCookieValue = JSON.parse(decodeUriComponent(consentCookie[0]));
  const consentsApproved = parsedCookieValue.consents_approved; // Obtain consented categories
  if (consentsApproved.indexOf(consentType) >= 0) {
    return true;
  } else {
    return false;
  }
}

// Return API response (if no cookie present)
if (typeof copyFromWindow('CookieInformation') !== 'undefined'){
  const apiConsent = copyFromWindow('CookieInformation').getConsentGivenFor(consentType);
  return (typeof apiConsent !== 'undefined' ? true : false);
}

// Default return (no cookie, no API)
return false;


___WEB_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "access_globals",
        "versionId": "1"
      },
      "param": [
        {
          "key": "keys",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "CookieInformation"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "get_cookies",
        "versionId": "1"
      },
      "param": [
        {
          "key": "cookieAccess",
          "value": {
            "type": 1,
            "string": "specific"
          }
        },
        {
          "key": "cookieNames",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "CookieInformationConsent"
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios: []


___NOTES___

Created on 14/07/2022, 12:01:31


