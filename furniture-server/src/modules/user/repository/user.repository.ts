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

    createAndSave(data: Partial<UserEntity>): Promise<UserEntity> {
        const profileData: UserEntity = this.userRepo.create(data);
        return this.userRepo.save(profileData);
    }
}
