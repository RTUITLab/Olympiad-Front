# OlympiadApp


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
> baseUrl - url of running WebApp, when running locally it will likely be ```http://localhost:64800```
 
> recaptchaClientToken - **PUBLIC** token got when creating reCAPCTCHA v2

2. After running the site, you can execute ```npm start```. After this you can see the site in your browser on [localhost:4200](http://localhost:4200).