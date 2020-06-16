const scanf = require('scanf');
const fs = require('fs');
const path = require('path');
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

    const csvFilePath = path.join(__dirname, '../../' ,'data/users.csv')
    const contents = fs.readFileSync(csvFilePath, 'utf8');

    const lines = contents.split('\n');

    await Promise.all( lines.map(async (line) =>  {

        const cols = line.split(',');

        console.log(cols);

        const email = cols[0];
        const password = cols[1];
        const username = cols[0];
        const firstName = cols[2];
        const lastName = cols[3];
        const city = cols[4];

        // check existance
        const existedUser = await dbClient
            .collection(collectionName)
            .find({username:username}).toArray();

        if(existedUser.length != 0){
            logger.info('The username is already taken !');
            return;
        } 
        
        const hash = shajs('sha256').update(password + process.env.cryptoSecret).digest('hex');

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
       
        }
        
        await utils.wait(1);
       
    }))
    
    console.log('sss');
    
    process.exit(0);

})();


