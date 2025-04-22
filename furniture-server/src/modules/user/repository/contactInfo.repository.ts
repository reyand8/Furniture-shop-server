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

    /**
     * Creates a new contact info entity with the provided data
     * and associates it with a user, then saves it to the database.
     *
     * @param data - Partial contact info data to create the entity.
     * @param user - The user object to associate with the contact info.
     * @returns A promise that resolves to the saved ContactInfoEntity.
     */
    createAndSave(
        data: Partial<ContactInfoEntity>,
        user: { id: string; }
    ): Promise<ContactInfoEntity> {
        const contactInfoData: ContactInfoEntity = this.contactInfoRepo.create({...data, user});
        return this.contactInfoRepo.save(contactInfoData);
    }

    /**
     * Creates or updates a contact info entity with the provided data.
     *
     * @param data - Partial contact info data to update or create the entity.
     * @returns A promise that resolves to the saved ContactInfoEntity.
     */
    createAndUpdate(
        data: Partial<ContactInfoEntity>
    ): Promise<ContactInfoEntity> {
        const contactInfoData: ContactInfoEntity = this.contactInfoRepo.create(data);
        return this.contactInfoRepo.save(contactInfoData);
    }

    /**
     * Retrieves all contact info records associated with a given user ID.
     *
     * @param userId - The ID of the user whose contact info should be retrieved.
     * @returns A promise that resolves to an array of ContactInfoEntity.
     */
    findAll(userId: string): Promise<ContactInfoEntity[]> {
        return this.contactInfoRepo.find({ where: { user: { id: userId } } });
    }

    /**
     * Finds a specific contact info record by its ID and associated user ID.
     *
     * @param contactInfoId - The ID of the contact info to retrieve.
     * @param userId - The ID of the user associated with the contact info.
     * @returns A promise that resolves to the matching ContactInfoEntity or null if not found.
     */
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

    /**
     * Removes the specified contact info entity from the database.
     *
     * @param contactInfo - The contact info entity to be removed.
     * @returns A promise that resolves to the removed ContactInfoEntity.
     */
    remove(contactInfo: ContactInfoEntity): Promise<ContactInfoEntity> {
        return this.contactInfoRepo.remove(contactInfo);
    }
}
