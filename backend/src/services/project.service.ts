import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class ProjectsService {
  //get all projects (include steps for list view)
  async getProjects(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { order: "asc" },
      include: { steps: { orderBy: { order: "asc" } } },
    });
  }
  //get one projects
  async getProjectById(id: string, userId: string) {
    return prisma.project.findFirst({
      where: { id, userId },
      include: { steps: { orderBy: { order: "asc" } } },
    });
  }
  //create a projects (accepts steps array from frontend and maps to Prisma nested create)
  async createProject(userId: string, data: any) {
    const { steps: stepsInput, ...rest } = data;
    const stepsPayload = Array.isArray(stepsInput)
      ? {
          create: stepsInput.map(
            (s: { text: string; done?: boolean }, i: number) => ({
              text: s.text,
              done: s.done ?? false,
              order: i,
            }),
          ),
        }
      : undefined;
    return prisma.project.create({
      data: {
        ...rest,
        userId,
        ...(stepsPayload ? { steps: stepsPayload } : {}),
      },
      include: { steps: true },
    });
  }
  //update a projects
  async updateProject(
    id: string,
    userId: string,
    data: Prisma.ProjectUpdateInput,
  ) {
    await this.getProjectById(id, userId);
    return prisma.project.update({
      where: { id, userId },
      data: {
        ...data,
      },
      include: { steps: true },
    });
  }
  //delete a projects
  async deleteProject(id: string, userId: string) {
    await this.getProjectById(id, userId);
    return prisma.project.delete({
      where: { id, userId },
    });
  }
  //update order (toggle step)
  async toggleStep(id: string, stepId: string, userId: string) {
    const project = await this.getProjectById(id, userId);
    const step = project?.steps.find((step) => step.id === stepId);
    return prisma.projectStep.update({
      where: { id: stepId },
      data: { done: !step?.done },
    });
  }
}