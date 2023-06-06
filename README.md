# Ankara Uni Notifier Backend Repo

This is backend repository of Ankara University Announcement Mobile Application.

### What is Ankara University Announcement Mobile Application ?

This is a mobile application that aims to gather all announcements from all faculty of Ankara University in one place and provide search mechanism to find intended announcements.

## Setup Guide
1. Please make sure that you have installed and did set up MongoDB database.

2. Install dependencies


``` bash
# Clone this repository via
https://github.com/AltanSozuer/AnkaraUniNotifier.git

# Install dependencies
cd AnkaraUniNotifier/ && npm install
```

3. You must create .env file named `.env.production` in project's parent dir to store secret keys, passwords, etc and also you must insert your following environment variables

```
//.env.production file


ENV=production
HOST=Your Host
PORT=Your port

// following variables for Gmail API
// more information about creating following variables
// https://developers.google.com/identity/openid-connect/openid-connect
// https://www.npmjs.com/package/googleapis

GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET
GMAIL_REDIRECT_URI
GMAIL_REFRESH_TOKEN
GMAIL_AUTH_TYPE=OAuth2
MAIL_SENDER=Your mail sender
MAIL_ADDRESS=Your mail sender mail address

// following variables for MongoDB
// more information about following variables https://mongoosejs.com/docs/connections.html
MONGO_HOST=Your MongoDB Host
MONGO_PORT=Your MongoDB Host
MONGO_DATABASE=Your MongoDB Database Name
MONGO_SERVER_SELECTION_TIMEOUT=MongoDB Selection Timeout


JWT_ACCESS_TOKEN_SECRET=Your secret token for generating Jwt access token
JWT_ACCESS_TOKEN_EXP=Your access token expire time

JWT_REFRESH_TOKEN_SECRET=Your secret token for generating Jwt refresh token
JWT_REFRESH_TOKEN_EXP=Your refresh token expire time
```

4. For running the server
``` bash
cd AnkaraUniNotifier/ && npm start
```

>**Warning** <br>
If there is an error during transpilation to javascript like

```
node_modules/@types/rimraf/index.d.ts:33:21 - error TS2694: Namespace '"C:/Users/user/AnkaraUniNotifier/node_modules/glob/dist/mjs/index"' has no exported member 'IOptions'.

33         glob?: glob.IOptions | false | undefined;
                       ~~~~~~~~


Found 1 error in node_modules/@types/rimraf/index.d.ts:33
```

> Please delete `node_modules/@types/rimraf` folder and rerun the project

>For more detail about this error [Stackoverflow](https://stackoverflow.com/questions/75890950/node-modules-minimatch-dist-cjs-index-has-no-exported-member-ioptions)

<br><br>
## Frontend Repository <br>
* [Ankara Uni Announcement App](https://github.com/AltanSozuer/AnkaraUniAnnouncementApp)