const scanf = require('scanf');
require('dotenv').config();

var shajs = require('sha.js');

const DBHandler = require('../lib/database');
const log = require('../lib/logger.js')();
const utils = require('../lib/utils');

(async() => {

    const collectionName = 'user';

    const DB = new DBHandler({
        url:process.env.mongodbConnection,
        database:process.env.mongodbDBName
    });

    const logger = log.startLogger({
        filepath: null,
        file: null,
        level: "debug",
        console: true
    });

    logger.info('Connecting to DB...')

    await DB.setup();

    logger.info('Connected to DB !');

    const dbClient = DB.getDB();

    const getUserName = async () => {

        await utils.wait(1);
        
        logger.info('Please input username');

        const username = scanf('%s');

        // check existance
        const existedUser = await dbClient
                .collection(collectionName)
                .find({username:username}).toArray();

        if(existedUser.length != 0){
            logger.info('The username is already taken !');
            return getUserName();
        } else if(username === null || username.length < 5) {
            logger.info('Username must container more than 4 characers.');
            return getUserName();
        }else {
            return username;
        }

    }

    const getNotEmpty = async (message) => {

        await utils.wait(1);
        
        logger.info(message);

        const text = scanf('%s');

        // check existance
        const existedUser = await dbClient
                .collection(collectionName)
                .find({username:username}).toArray();

        if(existedUser.length != 0){
            logger.info('This field cannot be empty.');
            return getNotEmpty();
        } 
        
        return text;

    }

    const username = await getUserName();

    logger.info('Your user name is ' + username);

    await utils.wait(1);
    logger.info('Please input password');

    const password = scanf('%s');

    const hash = shajs('sha256').update(password + process.env.cryptoSecret).digest('hex');

    await utils.wait(1);

    logger.info('Password hash is ' + hash);

    await utils.wait(1);

    const firstName = await getNotEmpty("Please input first name.");
    const lastName = await getNotEmpty("Please input last name.")
    const email = await getNotEmpty("Please input email.")
    const city = await getNotEmpty("Please input city.")
   
    await utils.wait(1);
    
    logger.info('Saving to DB');

    const insertResult = await dbClient.collection(collectionName).insertOne({
        username:username,
        password:hash,
        firstname:firstName,
        lastname:lastName,
        city:city,
        email:email,
        type:'admin',
        token:'',
        created:utils.now()
    });

    if(insertResult.insertedCount == 1){
        logger.info('User created');
    }else {
        logger.error('Failed to create user.');
    }

    process.exit(0);

})();


