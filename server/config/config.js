// check env.
const env = process.env.NODE_ENV || 'development';
// fetch env. config
const config = require('./config.json');
const envConfig = config[env];
// add env. config values to process.env
Object.keys(envConfig).forEach(key => {
    if(process.env.NODE_ENV === 'production' && key == 'PORT') {
        // Uncomment below code when published for production
        // process.env[key] = envConfig[key];
    } else {
        process.env[key] = envConfig[key];
    }
});