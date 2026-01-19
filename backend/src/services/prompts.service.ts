import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class PromptService {
    //get all prompts for a user 

    async getPrompts(userId: string) {
        return prisma.prompt.findMany({
           where:{userId},
           include:{ user: {select:{id: true}} },
           orderBy:{createdAt: 'asc'}
        })}
    //get one prompt by id
    async getPromptById(id: string, userId: string) {
        return prisma.prompt.findFirst({
            where:{id, userId},
            include:{ user: {select:{id: true}} }
        })}
    //create a new prompt
    async createPrompt(userId:string, data:Prisma.PromptUncheckedCreateInput ){
        return prisma.prompt.create({
            data:{
                ...data,
                userId,
            },
            include:{ user: {select:{id: true}} }
        })}
    //update a prompt
    async updatePrompt(id: string, userId: string, data:Prisma.PromptUpdateInput){
        await this.getPromptById(id, userId);
        return prisma.prompt.update({
            where:{id, userId},
            data:{
                ...data,
            },
            include:{ user: {select:{id: true}} }
        })
    }
    //delete a prompt
    async deletePrompt(id: string, userId: string){
        await this.getPromptById(id, userId);
        return prisma.prompt.delete({
            where:{id, userId},
        })
    }
    //reorder prompts
  async reorderPrompts(
  userId: string,
  data: { id: string; order: number }[]
) {
  const updates = data.map(item =>
    prisma.prompt.update({
      where: {
        id: item.id,
        userId, // sicurezza extra
      },
      data: {
        order: item.order,
      },
    })
  )

  return prisma.$transaction(updates)
}

    //save a prompt
    async savePrompt(id: string, userId: string){
        return prisma.prompt.update({
            where:{id, userId},
            data:{saved: new Date()},
        })
    }
}