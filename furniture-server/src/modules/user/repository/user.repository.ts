import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../../../models/user/user.entity';


@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    /**
     * Creates a new user entity instance with the provided data
     * and saves it to the database.
     *
     * @param data - Partial user data to create the entity.
     * @returns A promise that resolves to the saved UserEntity.
     */
    createAndSave(data: Partial<UserEntity>): Promise<UserEntity> {
        const profileData: UserEntity = this.userRepo.create(data);
        return this.userRepo.save(profileData);
    }
}
