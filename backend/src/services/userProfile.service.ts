import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export class UserProfileService {
  //get user information
  async getUserProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        email: true,
        name: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  //update user information
  async updateUserProfile(userId: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
      },
    });
  }
  //delete user
  async deleteUserProfile(userId: string) {
    return prisma.user.delete({
      where: { id: userId },
    });
  }
}
