import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class ContentIdeasService {
  private normalizeSaved(saved: unknown): Date | undefined {
    if (saved == null || saved === "") return undefined;
    if (saved instanceof Date) return saved;
    const s = String(saved).trim();
    if (!s) return undefined;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return new Date(s + "T12:00:00.000Z");
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? undefined : d;
  }

  // Normalize deadline to ISO-8601 DateTime (Prisma expects full datetime, frontend may send date-only)
  private normalizeDeadline(deadline: unknown): Date | undefined {
    if (deadline == null || deadline === "") return undefined;
    if (deadline instanceof Date) return deadline;
    const s = String(deadline).trim();
    if (!s) return undefined;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return new Date(s + "T12:00:00.000Z");
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? undefined : d;
  }

  //get all content ideas
  async getContentIdeas(userId: string) {
    return prisma.contentIdea.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }
  //get one content idea by id
  async getContentIdeaById(id: string, userId: string) {
    return prisma.contentIdea.findFirst({
      where: { id, userId },
    });
  }
  //create a new content idea
  async createContentIdea(
    userId: string,
    data: Prisma.ContentIdeaUncheckedCreateInput,
  ) {
    const input = { ...data } as Record<string, unknown>;
    const normalizedSaved = this.normalizeSaved(input.saved);
    const normalizedDeadline = this.normalizeDeadline(input.deadline);
    delete input.saved;
    delete input.deadline;
    return prisma.contentIdea.create({
      data: {
        ...input,
        ...(normalizedSaved !== undefined && { saved: normalizedSaved }),
        ...(normalizedDeadline !== undefined && { deadline: normalizedDeadline }),
        userId,
      } as Prisma.ContentIdeaUncheckedCreateInput,
      include: { user: { select: { id: true } } },
    });
  }
  //update a content idea
  async updateContentIdea(
    id: string,
    userId: string,
    data: Prisma.ContentIdeaUpdateInput,
  ) {
    await this.getContentIdeaById(id, userId);
    const updateData = { ...data } as Record<string, unknown>;
    if ("saved" in updateData && updateData.saved !== undefined) {
      const normalized = this.normalizeSaved(updateData.saved);
      if (normalized !== undefined) updateData.saved = normalized;
      else delete updateData.saved;
    }
    if ("deadline" in updateData && updateData.deadline !== undefined) {
      const normalized = this.normalizeDeadline(updateData.deadline);
      updateData.deadline = (normalized ?? null) as Date | null;
    }
    return prisma.contentIdea.update({
      where: { id, userId },
      data: updateData as Prisma.ContentIdeaUpdateInput,
    });
  }
  //update toggle status (done)
  async toggleContentIdea(id: string, userId: string) {
    const contentIdea = await this.getContentIdeaById(id, userId);
    return prisma.contentIdea.update({
      where: { id, userId },
      data: {
        done: { set: !contentIdea?.done },
      },
    });
  }
  //delete a content idea
  async deleteContentIdea(id: string, userId: string) {
    return prisma.contentIdea.delete({
      where: { id, userId },
    });
  }
}