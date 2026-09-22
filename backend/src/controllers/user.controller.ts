import { Request,Response,NextFunction } from "express";
import { userService } from "../services/user.service";

export const userController = {
    async register (req : Request, res: Response, next : NextFunction){
        try {
            const user = await userService.create(req.body)

            res.status(201).json({
                success : true,
                massage : 'user has already created',
                data : user
            })
            

        }catch(error){
            next(error);

        }
    }, 
    async getAll (req: Request, res : Response, next : NextFunction){
        try {

            const users = await userService.getAll(); 

            res.status(201).json({
                success : true , 
                massage : 'get all users successfully',
                data : users
            })

        }catch(error){
            next()
        }

    }
}