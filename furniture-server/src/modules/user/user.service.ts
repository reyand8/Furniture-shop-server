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
        this.updateUserData(user, updateUserDto);
        return this.userRepository.save(user);
    }

    /**
     * Updates user entity fields with provided DTO values,
     * excluding sensitive or restricted fields such as password, id, and role.
     *
     * @param user - The user entity to be updated.
     * @param updateUserDto - The DTO containing fields to update.
     */
    private updateUserData(user: UserEntity, updateUserDto: UpdateUserDto): void {
        const forbiddenFields: string[] = ['password', 'id', 'role'];
        for (const key in updateUserDto) {
            if (
                updateUserDto[key] !== undefined &&
                !forbiddenFields.includes(key)
            ) {
                user[key] = updateUserDto[key];
            }
        }
    }
}