import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class ContentIdeasService {

    //get all content ideas 
    async getContentIdeas(userId: string){
        return prisma.contentIdea.findMany({
            where:{userId},
            orderBy:{createdAt: 'asc'}
        })
    }
    //get one content idea by id
    async getContentIdeaById(id: string, userId: string){
        return prisma.contentIdea.findFirst({
            where:{id, userId},
        })
    }
    //create a new content idea
    async createContentIdea(userId: string, data: Prisma.ContentIdeaUncheckedCreateInput){
        return prisma.contentIdea.create({
            data:{
                ...data,
                userId,
            }
        })
    }
    //update a content idea
    async updateContentIdea(id: string, userId: string, data: Prisma.ContentIdeaUpdateInput){
    await this.getContentIdeaById(id, userId);
    return prisma.contentIdea.update({
        where:{id, userId},
        data:{
            ...data,
        }
    })
    }
    //update toggle status (done)
    async toggleContentIdea(id: string, userId: string){
        const contentIdea = await this.getContentIdeaById(id, userId);
        return prisma.contentIdea.update({
            where:{id, userId},
            data:{
                done: {set: !contentIdea?.done},
            }
        })
    }
    //delete a content idea
    async deleteContentIdea(id: string, userId: string){
    return prisma.contentIdea.delete({
        where:{id, userId},
    })
    }
}