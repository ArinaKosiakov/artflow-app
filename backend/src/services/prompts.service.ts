import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class PromptService {
  // Normalize date to ISO-8601 DateTime (Prisma expects full datetime, frontend may send date-only or omit)
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

  //get all prompts for a user

  async getPrompts(userId: string) {
    return prisma.prompt.findMany({
      where: { userId },
      include: { user: { select: { id: true } } },
      orderBy: { createdAt: "asc" },
    });
  }
  //get one prompt by id
  async getPromptById(id: string, userId: string) {
    return prisma.prompt.findFirst({
      where: { id, userId },
      include: { user: { select: { id: true } } },
    });
  }
  //create a new prompt
  async createPrompt(userId: string, data: Prisma.PromptUncheckedCreateInput) {
    const input = { ...data } as Record<string, unknown>;
    const normalizedSaved = this.normalizeSaved(input.saved);
    delete input.saved;
    return prisma.prompt.create({
      data: {
        ...input,
        ...(normalizedSaved !== undefined && { saved: normalizedSaved }),
        userId,
      } as Prisma.PromptUncheckedCreateInput,
      include: { user: { select: { id: true } } },
    });
  }
  //update a prompt
  async updatePrompt(
    id: string,
    userId: string,
    data: Prisma.PromptUpdateInput,
  ) {
    await this.getPromptById(id, userId);
    const updateData = { ...data } as Record<string, unknown>;
    if ("saved" in updateData && updateData.saved !== undefined) {
      const normalized = this.normalizeSaved(updateData.saved);
      if (normalized !== undefined) updateData.saved = normalized;
      else delete updateData.saved;
    }
    return prisma.prompt.update({
      where: { id, userId },
      data: updateData as Prisma.PromptUpdateInput,
      include: { user: { select: { id: true } } },
    });
  }
  //delete a prompt
  async deletePrompt(id: string, userId: string) {
    await this.getPromptById(id, userId);
    return prisma.prompt.delete({
      where: { id, userId },
    });
  }
  //reorder prompts
  async reorderPrompts(userId: string, data: { id: string; order: number }[]) {
    const updates = data.map((item) =>
      prisma.prompt.update({
        where: {
          id: item.id,
          userId, // sicurezza extra
        },
        data: {
          order: item.order,
        },
      }),
    );

    return prisma.$transaction(updates);
  }
}