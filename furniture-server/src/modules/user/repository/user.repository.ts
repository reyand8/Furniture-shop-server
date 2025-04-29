import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EUserRole, UserEntity } from '../../../models/user/user.entity';


@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    /**
     * Finds all users by role.
     * @param role - The role.
     * @returns A promise resolving to the UserEntity or null if not found.
     */
    async getAllUsers(role: EUserRole): Promise<Partial<UserEntity>[]>  {
        const users: UserEntity[] = await this.userRepo.find({
            where: { role: role },
        });
        return users.map(({ password, ...rest }: UserEntity): Partial<UserEntity> => rest);
    }

    /**
     * Finds a user by a dynamic field and its corresponding value.
     *
     * @param field - The name of the field to filter by (e.g., "email", "id").
     * @param value - The value to match against the specified field.
     * @returns A promise that resolves to the matching UserEntity or null if not found.
     */
    async findBy(field: string, value: string): Promise<UserEntity | null> {
        return this.userRepo.findOne({
            where: { [field]: value },
        });
    }

    /**
     * Creates a new user entity instance with the provided data
     * and saves it to the database.
     *
     * @param data - Partial user data to create the entity.
     * @returns A promise that resolves to the saved UserEntity.
     */
    async createAndSave(data: Partial<UserEntity>): Promise<UserEntity> {
        const profileData: UserEntity = this.userRepo.create(data);
        return this.userRepo.save(profileData);
    }
}
