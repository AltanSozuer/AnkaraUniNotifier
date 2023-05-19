import winston, {format, Logger} from 'winston'

function createLogger( filename: string) {
    return winston.createLogger({
        level: "debug",
        format: format.combine(
            format.errors({ stack: true }),
            format.timestamp({
                format: "DD-MM-YYYY HH:mm:ss"
            }),
            format.align(),
            format.printf(({timestamp, level, message, ...meta }) => {
                let logMsg = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
                if( Object.keys( meta ).length ){
                    logMsg += JSON.stringify( meta, null, 4 );
                }
                return logMsg;
            })
        ),
        transports: [
            new winston.transports.File({
                filename: `${filename}`,
                dirname: './logs'
            })
        ]
    })
}

function extractFileName( filePath: string ): string {
    return filePath.split("\\").pop()!.split('.')[0];
}


function createConventionalName (filename: string): string {
    const currDate = new Date();
    return `${currDate.getDate()}-${currDate.getMonth() +1 }-${currDate.getFullYear()}_${filename}.log`
}


export default function loggerFunc( filePath: string ): Logger{
    // extract filename from given filepath
    const extractedFile = extractFileName(filePath);
    // create conventional naming with date for log files
    const convFileName = createConventionalName( extractedFile );
    return createLogger(convFileName)
}