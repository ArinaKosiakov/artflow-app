import { prisma } from '../config/database';

export class SettingsService {
  async getSettings(userId: string) {
    return prisma.userSettings.findUnique({
      where: { userId },
      select:{
        id: true,
        darkMode: true,
        language: true,        
      }
    });
  }

  async updateSettings(userId: string, settings: { darkMode: boolean, language: string }) {
    return prisma.userSettings.update({
      where: { userId },
      data: settings,
    });
  }

  async deleteSettings(userId: string) {
    return prisma.userSettings.delete({
      where: { userId },
    });
  }

}