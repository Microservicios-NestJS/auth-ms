
import 'dotenv/config';
import * as joi  from 'joi';


interface EnvVars{
    PORT:number;

    NATS_SERVERS: string[];
    JWT_SECRETE:string;
}

const envScherma= joi.object({
    PORT:joi.number().required(),


    NATS_SERVERS:joi.array().items(joi.string()).required(),
    JWT_SECRETE:joi.string().required(),
})
.unknown(true);


const {error,value} =envScherma.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if(error){
    throw new Error(`config validation error ${error.message } `);

}

const envVars: EnvVars= value;

export const envs= {
    port:envVars.PORT,


    nats_servers:envVars.NATS_SERVERS,
    jwt_secrete:envVars.JWT_SECRETE,
}