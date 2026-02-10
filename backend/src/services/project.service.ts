import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class ProjectsService{

    //get all projects
    async getProjects(userId:string){
        return prisma.project.findMany({
            where:{userId},
            orderBy:{order: 'asc'}})
    }
    //get one projects
    async getProjectById(id:string, userId:string){
        return prisma.project.findFirst({
            where:{id, userId},
            include:{steps: {orderBy: {order: 'asc'}}}
        })
    }
    //create a projects
    async createProject(userId:string, data:Prisma.ProjectUncheckedCreateInput){
        return prisma.project.create({
            data:{
                ...data,
                userId,
            },
            include:{steps: true}
        })
    }
    //update a projects
    async updateProject(id:string, userId:string, data:Prisma.ProjectUpdateInput){
        await this.getProjectById(id, userId);
        return prisma.project.update({
            where:{id, userId},
            data:{
                ...data,
            },
            include:{steps: true}
        })
    }
    //delete a projects
    async deleteProject(id:string, userId:string){
        await this.getProjectById(id, userId)
        return prisma.project.delete({
            where:{id, userId}
        })
    }
    //update order (toggle step)
    async toggleStep(id:string, stepId:string, userId:string){
        const project = await this.getProjectById(id, userId);
        const step = project?.steps.find(step => step.id === stepId);
        return prisma.projectStep.update({
            where:{id: stepId},
            data:{done: !step?.done}
        })
    }
}