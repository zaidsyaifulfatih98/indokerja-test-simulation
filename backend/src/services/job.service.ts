import prisma from "../configs/pool-connection.config";
import { JobTypes } from "../../generated/prisma/client";
import { connect } from "http2";

export const jobServices ={
    async create (
        data : {
            title : string ;
            description : string;
            requarements : string;
            location : string;
            salary_min : number;
            salary_max : number;
            job_type : JobTypes;
            
        }
    ){
        const{...rest} = data 

        const newJobs = await prisma.users.create({
            data : {
                ...rest ,
                user : {connect : { id : userId}}

            }, select : {

            }
        })


    }
}