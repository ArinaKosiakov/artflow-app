import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import bcrypt from "bcryptjs";

export class UserProfileService {
  //get user information
  async getUserProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
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
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  //update user password
  async updateUserPassword(userId: string, currentPassword: string, newPassword: string) {
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
  //delete user
  async deleteUserProfile(userId: string) {
    return prisma.user.delete({
      where: { id: userId },
    });
  }
}
