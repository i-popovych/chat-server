import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectModel } from './project.model';
import { UserService } from '../user/user.service';
import { UserModel } from '../user/user.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(ProjectModel)
    private readonly projectRepository: typeof ProjectModel,
    private readonly userService: UserService,
  ) {}

  async createProject(project_name: string, userId: number) {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = await this.projectRepository.create({
      project_name,
    });

    await user.$add('projects', project.id, { through: { is_owner: true } });

    return project;
  }

  async getProjectById(projectId: number) {
    const project = await this.projectRepository.findByPk(projectId);

    return project;
  }

  async addUserToProject(
    project_id: number,
    userId: number,
    addedUserId: number,
  ) {
    const user = await this.userService.getUserById(userId);
    const addedUser = await this.userService.getUserById(addedUserId);

    if (!user || !addedUser) {
      throw new NotFoundException('User not found');
    }

    const isUserExistInProject = await this.checkUserProjectExists(
      project_id,
      userId,
    );

    if (!isUserExistInProject) {
      throw new NotFoundException('User already exists in the project');
    }
    const project = await this.projectRepository.findByPk(project_id);

    await addedUser.$add('projects', project.id);
  }

  async checkUserProjectExists(project_id: number, userId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: project_id },
      include: { model: UserModel, where: { id: userId } },
    });

    return Boolean(project);
  }
}
