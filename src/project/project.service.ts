import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectModel } from './project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(ProjectModel) private projectRepository: typeof ProjectModel,
  ) {}

  async createProject(project_name: string, userId: number) {
    return await this.projectRepository.create({
      project_name,
      owner_id: userId,
      project_ref: 2,
    });
  }

  async getProjectNameByHash(project_ref: number) {
    const project = await this.projectRepository.findOne({
      where: { project_ref },
    });

    return project.project_name;
  }
}
