export const validateArguments = () => {

    const filePath = process.argv[2];
    if (!filePath) {
        console.error('file name is incorrect, file name: ', filePath);
        console.log('run the following command: node index.js yourCsvFile.csv');
        process.exit(1);
    }

}

export const shutdownHook = mongo => {
    process.on('SIGTERM', () => {
        mongo.connection.close();
        console.log('\nSIGTERM signal received: closing mongo connections\n');        
    });
    
    process.on('SIGINT', () => {
        mongo.connection.close();
        console.log('\nSIGINT signal received: closing mongo connections\n')
        
    });    
    
    process.on('exit', () => {
        console.log('App is done!');
    });
}
