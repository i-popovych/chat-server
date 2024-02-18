import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { GroupModel } from '../group/group.model';

import { UserModel } from './user.model';
import { ProjectModel } from '../project/project.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private userRepository: typeof UserModel,
  ) {}

  async createUser(email: string, password: string) {
    return await this.userRepository.create({
      email,
      password,
    });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getAllGroupUsers(groupId: number) {
    return await this.userRepository.findAll({
      include: [GroupModel],
      where: { id: groupId },
    });
  }

  async getUsersProjects(userId: number) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = await this.userRepository.findOne({
      include: ProjectModel,
      where: { id: user.id },
    });

    return result.projects;
  }
}
