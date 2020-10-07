# OlympiadApp

[![Build Status](https://dev.azure.com/rtuitlab/RTU%20IT%20Lab/_apis/build/status/Olympiad/Olympiad-Front?branchName=master)](https://dev.azure.com/rtuitlab/RTU%20IT%20Lab/_build/latest?definitionId=122&branchName=master)

## Requirement
Node.js + NPM

How to run:

1. Run ```npm instal``` It will install all the dependencies in __node_modules__ folder.

2. Create the _environment.ts_ in _./src/environments_ folder. Fill it with the following:

```js
export const environment = {
    production: true,
    isAdmin: false,
    baseUrl: '',
    buildNumber: '',
    showResults: true,
    recaptchaClientToken: ''
};
```
> baseUrl - url of running WebApp, when running locally it will likely be ```http://localhost:5501```
 
> recaptchaClientToken - **PUBLIC** token got when creating reCAPCTCHA v2

2. After running the site, you can execute ```npm start```. After this you can see the site in your browser on [localhost:4200](http://localhost:4200).