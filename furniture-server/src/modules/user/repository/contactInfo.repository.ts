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
    async createAndSave(
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
    async createAndUpdate(
        data: Partial<ContactInfoEntity>
    ): Promise<ContactInfoEntity> {
        const contactInfoData: ContactInfoEntity = this.contactInfoRepo.create(data);
        return this.contactInfoRepo.save(contactInfoData);
    }

    /**
     * Retrieves a paginated list of active contact info records associated with a given user ID.
     * The records are ordered by creation date in descending order.
     *
     * @param userId - The ID of the user whose contact info records should be retrieved.
     * @param skip - The number of records to skip (for pagination).
     * @param take - The number of records to retrieve (for pagination).
     * @returns A promise that resolves to a tuple containing:
     *  - An array of `ContactInfoEntity` records.
     *  - The total number of contact info records available for the user.
     */
    async findAllPaginated(userId: string,
                           skip: number,
                           take: number
    ): Promise<[ContactInfoEntity[], number]> {
        return this.contactInfoRepo.findAndCount({
            where: {
                user: { id: userId },
                isActive: true,
            },
            skip,
            take,
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Finds a specific contact info record by its ID and associated user ID.
     *
     * @param contactInfoId - The ID of the contact info to retrieve.
     * @param userId - The ID of the user associated with the contact info.
     * @returns A promise that resolves to the matching ContactInfoEntity or null if not found.
     */
    async findOneByIds(
        contactInfoId: string,
        userId: string
    ): Promise<ContactInfoEntity | null> {
        return this.contactInfoRepo.findOne({
            where: {
                id: contactInfoId,
                user: { id: userId },
                isActive: true,
            },
        });
    }

    /**
     * Removes the specified contact info entity from the database.
     *
     * @param contactInfo - The contact info entity to be removed.
     * @returns A promise that resolves to the removed ContactInfoEntity.
     */
    async remove(contactInfo: ContactInfoEntity): Promise<ContactInfoEntity> {
        return this.contactInfoRepo.remove(contactInfo);
    }
}
