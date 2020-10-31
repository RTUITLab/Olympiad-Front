var fs = require('fs');
if (process.argv.length % 2 != 0) {
    console.error("arguments number must be even");
    return;
}

const targetDir = "./src/environments/";

const configuration = {
    production: true,
    isAdmin: true,
    baseUrl: '',
    buildNumber: '',
    recaptchaClientToken: '',
    isTeacher: false,
    redirectUrl: '/teacher'
}

argsMap = process
    .argv
    .slice(2)
    .map((arg, index, array) => index % 2 === 0 ? {key: arg, value: array[index + 1]} : null  )
    .filter(a => a != null)
    .map(o => {o.key = o.key.substr(1); return o;})
    .reduce((v, current) => { v[current.key] = current.value; return v;}, configuration)

const configurationJson = JSON.stringify(argsMap, null, 2);
console.log("exported configuration is: " + configurationJson);


if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
}
fs.writeFileSync("./src/environments/environment.prod.ts", `export const environment = ${JSON.stringify(argsMap, null, 2)};`)
