const { MongoMemoryServer } = require('mongodb-memory-server');
console.log('Require successful');
MongoMemoryServer.create({
    binary: {
        version: '6.0.4', // Use a specific version to avoid downloading latest if connection is poor
        checkMD5: false
    }
}).then(mongod => {
    console.log('Created:', mongod.getUri());
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
