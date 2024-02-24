import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from '../user/user.service';
import { ProjectUserModel } from './project-user.model';
import { ProjectModel } from './project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(ProjectModel)
    private readonly projectRepository: typeof ProjectModel,
    private readonly userService: UserService,
    @InjectModel(ProjectUserModel)
    private readonly projectUserRepository: typeof ProjectUserModel,
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

  async addUserToProject(project_id: string, userId: number) {
    const user = await this.userService.getUserById(userId);
    const project = await this.projectRepository.findByPk(project_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isUserExistInProject = await this.checkUserProjectExists(
      project.id,
      userId,
    );

    if (isUserExistInProject) {
      throw new NotFoundException('User already exists in the project');
    }

    await user.$add('projects', project.id);
  }

  async checkUserProjectExists(userId: number, project_id: number) {
    const project = await this.projectUserRepository.findOne({
      where: { user_id: userId, project_id },
    });

    return Boolean(project);
  }
}
