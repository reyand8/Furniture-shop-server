import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContactInfoEntity } from '../../../models/contact-info/contact-info.entity';


@Injectable()
export class ContactInfoRepository {
    constructor(
        @InjectRepository(ContactInfoEntity)
        private readonly contactInfoRepo: Repository<ContactInfoEntity>,
    ) {}

    createAndSave(
        data: Partial<ContactInfoEntity>,
        user: { id: string; }
    ): Promise<ContactInfoEntity> {
        const contactInfoData: ContactInfoEntity = this.contactInfoRepo.create({...data, user});
        return this.contactInfoRepo.save(contactInfoData);
    }

    createAndUpdate(
        data: Partial<ContactInfoEntity>
    ): Promise<ContactInfoEntity> {
        const contactInfoData: ContactInfoEntity = this.contactInfoRepo.create(data);
        return this.contactInfoRepo.save(contactInfoData);
    }

    findAll(userId: string): Promise<ContactInfoEntity[]> {
        return this.contactInfoRepo.find({ where: { user: { id: userId } } });
    }

    findOneByIds(
        contactInfoId: string,
        userId: string
    ): Promise<ContactInfoEntity | null> {
        return this.contactInfoRepo.findOne({
            where: {
                id: contactInfoId,
                user: { id: userId },
            },
        });
    }

    remove(contactInfo: ContactInfoEntity): Promise<ContactInfoEntity> {
        return this.contactInfoRepo.remove(contactInfo);
    }
}
