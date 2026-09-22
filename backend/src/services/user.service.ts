import prisma from "../configs/pool-connection.config";
import bcrypt from 'bcrypt'
import {Roles} from "../../generated/prisma/client"
export const userService = {
    async create(
        data : {
            name : string;
            email : string;
            password : string;
            role : Roles[]


        } 
    ){
        const{...rest} = data;
        const hashedPassword = await bcrypt.hash(rest.password, 10)

        const newUser = await prisma.users.create({
            data:{
                ...rest , 
                password  : hashedPassword,

            }, select :  {
                id : true,
                email : true,
                role : true,

            } })
        return newUser
    },

    async getAll (){
        const getAll = await prisma.users.findMany({
            select : {
                id : true ,
                name : true,
                email : true,
                role : true
            }
        })
        return getAll
    }
}