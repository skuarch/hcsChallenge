export const environment = {
    local: {
        csvPathFile: './resources/data.csv',
        connectionUrl: 'mongodb://192.168.0.100:27017/hcs',
        databaseName: 'hcs'
    },
    test: {
        csvPathFile: './resources/data.csv',
        connectionUrl: 'mongodb://192.168.0.100:27017/hcs-test',
        databaseName: 'hcs-test'
    }
}