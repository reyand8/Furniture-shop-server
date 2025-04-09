import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateUserDto } from './dto/updateUser.dto';
import { UserEntity } from '../../models/user/user.entity';


@Injectable()
export class UserService {
    constructor(
      @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) {}

    /**
     * Updates the given user's information with provided data.
     * Throws NotFoundException if the user does not exist.
     *
     * @param user - The existing user entity to update
     * @param updateUserDto - DTO containing the fields to be updated
     * @returns The updated user entity
     */
    async update(user: UserEntity, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        if (!user) {
            throw new NotFoundException('User not found');
        }
        for (const key in updateUserDto) {
            if (updateUserDto[key] !== undefined) {
                user[key] = updateUserDto[key];
            }
        }
        return this.userRepository.save(user);
    }
}