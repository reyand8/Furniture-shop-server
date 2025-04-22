import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';

import { UpdateUserDto } from './dto/updateUser.dto';
import { UserEntity } from '../../models/user/user.entity';
import { CreateContactInfoDto } from './dto/createСontactInfo.dto';
import { UpdateContactInfoDto } from './dto/updateContactInfo.dto';
import { ContactInfoEntity }  from '../../models/contact-info/contact-info.entity';
import {
    ERROR_MESSAGES,
    FORBIDDEN_FIELDS_PROFILE,
} from '../common/constants';
import {
    validateDtoFields,
    validateDtoNotEmpty,
    validateIds,
    validateProvidedId,
} from '../common/validation';
import { UserRepository } from './repository/user.repository';
import { ContactInfoRepository } from './repository/contactInfo.repository';


const { ERROR_SERVER, NOT_FOUND_CONTACT_INFO } = ERROR_MESSAGES;

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly contactInfoRepository: ContactInfoRepository,
    ) {}

    /**
     * Updates the given user's information with provided data.
     * Validates that the user exists and that the provided DTO is not empty.
     *
     * Throws NotFoundException if the user does not exist.
     * Throws InternalServerErrorException if an error occurs during the update process.
     *
     * @param user - The existing user entity to update
     * @param updateUserDto - DTO containing the fields to be updated
     * @returns The updated user entity
     */
    async updateProfile(
        user: UserEntity,
        updateUserDto: UpdateUserDto
    ): Promise<UserEntity> {
        validateDtoNotEmpty(updateUserDto);
        try {
            const updatedProfile: UserEntity =
                validateDtoFields(user, updateUserDto, FORBIDDEN_FIELDS_PROFILE);
            return this.userRepository.createAndSave(updatedProfile);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Retrieves contact information for a user based on userId.
     * Validates the provided user ID before querying the database.
     *
     * Throws BadRequestException if the user ID is invalid.
     * Throws InternalServerErrorException if an error occurs during the retrieval process.
     *
     * @param userId - The ID of the user whose contact information is requested
     * @returns A list of contact information associated with the user
     */
    async getContactInfo(userId: string): Promise<ContactInfoEntity[]> {
        validateProvidedId(userId);
        try {
            return this.contactInfoRepository.findAll(userId);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Creates a new contact information entry for a user.
     * Validates the provided user ID and the contact info DTO before proceeding.
     *
     * Throws BadRequestException if the user ID or DTO is invalid.
     * Throws InternalServerErrorException if an error occurs during creation or saving.
     *
     * @param createContactInfoDto - DTO containing the contact information data
     * @param userId - The ID of the user who the contact information belongs to
     * @returns The newly created contact information entity
     */
    async createContactInfo(
        createContactInfoDto: CreateContactInfoDto,
        userId: string): Promise<ContactInfoEntity> {
        validateProvidedId(userId);
        validateDtoNotEmpty(createContactInfoDto);
        try {
            const user: {id: string} = { id: userId }
            return this.contactInfoRepository.createAndSave(createContactInfoDto, user);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Retrieves contact information by contactInfoId and userId.
     * Validates both the contactInfoId and userId.
     *
     * Throws BadRequestException if either ID is invalid.
     * Throws NotFoundException if no matching contact information is found.
     * Throws InternalServerErrorException if an unexpected error occurs.
     *
     * @param contactInfoId - The ID of the contact information
     * @param userId - The ID of the user
     * @returns The contact information for the given contactInfoId and userId
     */
    async getContactInfoByIdAndUser(
        contactInfoId: string,
        userId: string
    ): Promise<ContactInfoEntity> {
        validateIds(contactInfoId, userId);
        try {
            const contactInfo: ContactInfoEntity | null =
                await this.contactInfoRepository.findOneByIds(contactInfoId, userId);
            if (!contactInfo) {
                throw new NotFoundException(NOT_FOUND_CONTACT_INFO);
            }
            return contactInfo;
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Updates the contact information for a given contactInfoId and userId.
     * Validates the provided update DTO and applies changes to the contact info entity.
     *
     * Throws BadRequestException if any input is invalid.
     * Throws NotFoundException if the contact information does not exist or does not belong to the user.
     * Throws InternalServerErrorException if an error occurs during the update process.
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
    ): Promise<ContactInfoEntity> {
        validateProvidedId(contactInfoId);
        validateDtoNotEmpty(updateContactInfoDto);
        try {
            const contactInfo: ContactInfoEntity =
                await this.getContactInfoByIdAndUser(contactInfoId, userId);
            const validatedDto: ContactInfoEntity = validateDtoFields(contactInfo, updateContactInfoDto);
            return await this.contactInfoRepository.createAndUpdate(validatedDto);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }

    /**
     * Deletes the contact information for a given contactInfoId and userId.
     * Validates both the contactInfoId and userId before proceeding.
     *
     * Throws BadRequestException if either ID is invalid.
     * Throws NotFoundException if the contact information is not found for the user.
     * Throws InternalServerErrorException if an error occurs during the deletion process.
     *
     * @param contactInfoId - The ID of the contact information to delete
     * @param userId - The ID of the user whose contact information is being deleted
     */
    async deleteContactInfo(
        contactInfoId: string,
        userId: string
    ): Promise<void> {
        validateProvidedId(contactInfoId);
        try {
            const contactInfo: ContactInfoEntity =
                await this.getContactInfoByIdAndUser(contactInfoId, userId);
            await this.contactInfoRepository.remove(contactInfo);
        } catch (error) {
            throw new InternalServerErrorException(ERROR_SERVER, error.message);
        }
    }
}