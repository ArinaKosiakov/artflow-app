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
  // Normalize deadline to ISO-8601 DateTime (Prisma expects full datetime, frontend may send date-only)
  private normalizeDeadline(deadline: unknown): Date | undefined {
    if (deadline == null || deadline === "") return undefined;
    if (deadline instanceof Date) return deadline;
    const s = String(deadline).trim();
    if (!s) return undefined;
    // If date-only (YYYY-MM-DD), append time for ISO-8601
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return new Date(s + "T12:00:00.000Z");
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? undefined : d;
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
    const normalizedDeadline = this.normalizeDeadline(rest.deadline);
    const { deadline: _d, ...restWithoutDeadline } = rest;
    return prisma.project.create({
      data: {
        ...restWithoutDeadline,
        ...(normalizedDeadline !== undefined && {
          deadline: normalizedDeadline,
        }),
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
    const updateData = { ...data } as Record<string, unknown>;
    if ("deadline" in updateData && updateData.deadline !== undefined) {
      const normalized = this.normalizeDeadline(updateData.deadline);
      updateData.deadline = normalized ?? null;
    }
    return prisma.project.update({
      where: { id, userId },
      data: updateData as Prisma.ProjectUpdateInput,
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