import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'src/user/user.model';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { GroupUserModel } from './group-user.model';
import { GroupModel } from './group.model';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GroupModel)
    private readonly groupRepository: typeof GroupModel,
    @InjectModel(GroupUserModel)
    private readonly groupUserRepository: typeof GroupUserModel,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async createGroup(group_name: string, userId: number, projectId: number) {
    const isUserExistInProject =
      await this.projectService.checkUserProjectExists(userId, projectId);

    if (!isUserExistInProject) {
      throw new NotFoundException('User doesn not exist in the project');
    }

    const project = await this.projectService.getProjectById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const group = await this.groupRepository.create({
      group_name,
      project_id: project.id,
    });
    const user = await this.userService.getUserById(userId);
    const projectUsers =
      await this.projectService.getAllProjectUsers(projectId);

    const projectUsersIds = projectUsers.map((user) => user.id);

    await group.$set('users', user.id, { through: { isCreator: true } });
    await group.$set('users', projectUsersIds);

    return group;
  }

  async addUserToGroup(groupId: number, userId: number) {
    const group = await this.groupRepository.findByPk(groupId);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await group.$add('users', user.id);

    return group;
  }

  async getGroupByName(group_name: string, project_id: number) {
    return await this.groupRepository.findOne({
      where: { group_name, project_id },
    });
  }

  async getGroupUsers(groupId: number) {
    const res = await this.groupRepository.findByPk(groupId, {
      include: [UserModel],
    });

    const users = [];

    res.users.forEach((user) => {
      users.push(user);
    });

    return users;
  }

  async addUserByGroupName(
    userId: number,
    groupName: string,
    projectId: number,
  ) {
    const group = await this.getGroupByName(groupName, projectId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isUserExistInProject = this.projectService.checkUserProjectExists(
      userId,
      projectId,
    );
    if (!isUserExistInProject) {
      throw new HttpException(
        'User does not exist in the project',
        HttpStatus.BAD_REQUEST,
      );
    }

    await user.$add('groups', user.id);
  }

  async hasGroupUser(userId: number, groupId: number) {
    return await this.groupUserRepository.findOne({
      where: { user_id: userId, group_id: groupId },
    });
  }

  async getGroupById(groupId: number) {
    return await this.groupRepository.findByPk(groupId);
  }

  async getAllProjectGroup(userId: number, projectId: number) {
    const isUserExistInProject =
      await this.projectService.checkUserProjectExists(userId, projectId);

    if (!isUserExistInProject) {
      throw new NotFoundException('User does not exist in the project');
    }

    return await this.groupRepository.findAll({
      where: { project_id: projectId },
    });
  }

  async getAllUserGroup(userId: number, projectId: number) {
    const isUserExistInProject =
      await this.projectService.checkUserProjectExists(userId, projectId);

    if (!isUserExistInProject) {
      throw new NotFoundException('User does not exist in the project');
    }

    return await this.groupRepository.findAll({
      where: { project_id: projectId },
      include: [{ model: UserModel, where: { id: userId } }],
    });
  }
}
