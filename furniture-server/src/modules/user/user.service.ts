import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateUserDto } from './dto/updateUser.dto';
import { UserEntity } from '../../models/user/user.entity';
import { CreateContactInfoDto } from './dto/createСontactInfo.dto';
import { UpdateContactInfoDto } from './dto/updateContactInfo.dto';
import { ContactInfo } from '../../models/contact-info/contact-info.entity';


const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

@Injectable()
export class UserService {
    constructor(
      @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
      @InjectRepository(ContactInfo) private contactInfoRepository: Repository<ContactInfo>,
    ) {}

    /**
     * Updates the given user's information with provided data.
     * Throws NotFoundException if the user does not exist.
     *
     * @param user - The existing user entity to update
     * @param updateUserDto - DTO containing the fields to be updated
     * @returns The updated user entity
     */
    async updateProfile(
        user: UserEntity,
        updateUserDto: UpdateUserDto): Promise<UserEntity> {
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const forbiddenFields: string[] = ['password', 'id', 'role'];
        this.updateUserData(user, updateUserDto, forbiddenFields);
        return this.userRepository.save(user);
    }

    /**
     * Retrieves contact information for a user based on userId.
     * Throws BadRequestException if the userId is invalid.
     *
     * @param userId - The ID of the user whose contact information is requested
     * @returns A list of contact information associated with the user
     */
    async getContactInfo(userId: string): Promise<ContactInfo[]> {
        this.validateUserId(userId);
        return this.contactInfoRepository.find({ where: { user: { id: userId } } });
    }

    /**
     * Creates a new contact information entry for a user.
     * Throws BadRequestException if the userId is invalid.
     *
     * @param createContactInfoDto - DTO containing the contact information data
     * @param userId - The ID of the user who the contact information belongs to
     * @returns The newly created contact information entity
     */
    async createContactInfo(
        createContactInfoDto: CreateContactInfoDto,
        userId: string): Promise<ContactInfo> {
        this.validateUserId(userId);
        const contactInfo: ContactInfo = this.contactInfoRepository.create({
            ...createContactInfoDto,
            user: { id: userId }
        });
        return await this.contactInfoRepository.save(contactInfo);
    }

    /**
     * Retrieves contact information by contactInfoId and userId.
     * Validates both IDs and ensures the contact info belongs to the user.
     * Throws BadRequestException for invalid inputs and NotFoundException if contact info not found.
     *
     * @param contactInfoId - The ID of the contact information
     * @param userId - The ID of the user
     * @returns The contact information for the given contactInfoId and userId
     */
    async getContactInfoByIdAndUser(contactInfoId: string, userId: string): Promise<ContactInfo> {
        this.validateIds(contactInfoId, userId);
        const contactInfo: ContactInfo | null = await this.contactInfoRepository.findOne({
            where: {
                id: contactInfoId,
                user: { id: userId },
            },
        });
        if (!contactInfo) {
            throw new NotFoundException(`ContactInfo not found`);
        }
        return contactInfo;
    }

    /**
     * Updates the contact information for a given contactInfoId and userId.
     * Uses shared validation logic to fetch the contact info.
     *
     * @param contactInfoId - The ID of the contact information to update
     * @param updateContactInfoDto - DTO containing the updated contact information
     * @param userId - The ID of the user whose contact information is being updated
     * @returns The updated contact information entity
     */
    async updateContactInfoById(
        contactInfoId: string,
        updateContactInfoDto: UpdateContactInfoDto,
        userId: string
    ): Promise<ContactInfo> {
        const contactInfo: ContactInfo =
            await this.getContactInfoByIdAndUser(contactInfoId, userId);
        this.updateUserData(contactInfo, updateContactInfoDto);
        return this.contactInfoRepository.save(contactInfo);
    }

    /**
     * Deletes the contact information for a given contactInfoId and userId.
     * Uses shared validation logic to ensure contact information exists for the user.
     *
     * @param contactInfoId - The ID of the contact information to delete
     * @param userId - The ID of the user whose contact information is being deleted
     */
    async deleteContactInfo(
        contactInfoId: string,
        userId: string
    ): Promise<void> {
        const contactInfo: ContactInfo =
            await this.getContactInfoByIdAndUser(contactInfoId, userId);
        await this.contactInfoRepository.remove(contactInfo);
    }

    /**
     * Validates the userId and throws BadRequestException if invalid.
     *
     * @param userId - The ID of the user to validate
     */
    private validateUserId(userId: string): void {
        if (!userId) {
            throw new BadRequestException('UserId is required');
        }
    }

    /**
     * Validates both contactInfoId and userId, checking that both are present and
     * the contactInfoId format is valid.
     * Throws BadRequestException if any validation fails.
     *
     * @param contactInfoId - The contact information ID to validate
     * @param userId - The user ID to validate
     */
    private validateIds(contactInfoId: string, userId: string): void {
        if (!contactInfoId || !userId) {
            throw new BadRequestException('ContactInfoId and userId are required');
        }
        if (!this.validateUUID(contactInfoId)) {
            throw new BadRequestException('Invalid contactInfoId format');
        }
    }

    /**
     * Validates a UUID format using a regular expression.
     *
     * @param uuid - The UUID string to validate
     * @returns True if the UUID format is valid, otherwise false
     */
    private validateUUID(uuid: string): boolean {
        return UUID_REGEX.test(uuid);
    }

    /**
     * Updates fields of an entity using a DTO, excluding forbidden fields like password, id, and role.
     *
     * @param entity - The entity to update
     * @param updateDto - The DTO containing fields to update
     * @param forbiddenFields - Array of field names that should not be updated
     */
    private updateUserData<T>(
        entity: T,
        updateDto: Partial<T>,
        forbiddenFields: string[] = []
    ): void {
        for (const key in updateDto) {
            if (updateDto[key] !== undefined && !forbiddenFields.includes(key)) {
                entity[key] = updateDto[key];
            }
        }
    }
}