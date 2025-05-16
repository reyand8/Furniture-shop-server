import {
    Injectable,
    NotFoundException
} from '@nestjs/common';

import { UpdateUserDto } from './dto/updateUser.dto';
import { UserEntity } from '../../models/user/user.entity';
import { CreateContactInfoDto } from './dto/createСontactInfo.dto';
import { UpdateContactInfoDto } from './dto/updateContactInfo.dto';
import { ContactInfoEntity }  from '../../models/contact-info/contact-info.entity';
import {
    ERROR_MESSAGES,
} from '../../common/constants';
import {
    updateEntityWithDto,
    validateDtoNotEmpty,
} from '../../common/validation';
import { UserRepository } from './repository/user.repository';
import { ContactInfoRepository } from './repository/contactInfo.repository';
import { GetAllUsersDto } from './dto/getAllUsers.dto';
import { UpdateUserFieldsDto } from './dto/updateUserFields.dto';
import { IUserRegister } from '../auth/auth.interface';
import { GetContactInfoQueryDto } from './dto/getContactInfoQuery.dto';


const { NOT_FOUND_CONTACT_INFO, NOT_FOUND_USER_PROFILE } = ERROR_MESSAGES;

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly contactInfoRepository: ContactInfoRepository,
    ) {}

    /**
     * Retrieve all users by role.
     * Validates the requester's role and the provided DTO before querying the repository.
     *
     * @param getAllUsersDto - DTO containing filter criteria (e.g. role of users to fetch).
     * @returns A promise resolving to a list of users with partial information.
     * @throws ForbiddenException if access is not allowed.
     */
    async getAllUsers(
        getAllUsersDto: GetAllUsersDto
    ): Promise<Partial<UserEntity>[]> {
        validateDtoNotEmpty(getAllUsersDto);
        return this.userRepository.getAllUsers(getAllUsersDto.role);
    }

    /**
     * Updates selected fields (role and/or status) of a user by their ID.
     * This method assumes role-based access control is handled externally (e.g., by a controller or guard).
     *
     * @param userId - The ID of the user to update.
     * @param updateUserFieldsDto - DTO containing one or more fields to update (e.g., role, isActive).
     * @returns A promise that resolves to the updated user entity without the password field.
     * @throws NotFoundException if the user is not found.
     */
    async updateUserFields(
        userId: string,
        updateUserFieldsDto: UpdateUserFieldsDto
    ): Promise<Partial<UserEntity>> {
        const user: UserEntity | null = await this.userRepository.findBy('id', userId);
        if (!user) {
            throw new NotFoundException(NOT_FOUND_USER_PROFILE);
        }
        for (const key in updateUserFieldsDto) {
            if (updateUserFieldsDto[key] !== undefined) {
                user[key] = updateUserFieldsDto[key];
            }
        }
        const updatedUser: UserEntity = await this.userRepository.createAndSave(user);
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    /**
     * Creates a new user profile and saves it to the database.
     *
     * @param user - The user registration data used to create the profile.
     * @returns A promise that resolves to the newly created UserEntity.
     */
    async createProfile(user: IUserRegister): Promise<UserEntity> {
        return this.userRepository.createAndSave(user);
    }

    /**
     * Updates the given user's information with provided data.
     * Validates that the user exists and that the provided DTO is not empty.
     *
     * Throws NotFoundException if the user does not exist.
     *
     * @param user - The existing user entity to update
     * @param updateUserDto - DTO containing the fields to be updated
     * @returns The updated user entity
     */
    async updateProfile(
        user: UserEntity,
        updateUserDto: UpdateUserDto
    ): Promise<Partial<UserEntity>> {
        validateDtoNotEmpty(updateUserDto);
        const updateEntity: UserEntity =
            updateEntityWithDto(user, updateUserDto);

        const updatedProfile: UserEntity  =
            await this.userRepository.createAndSave(updateEntity);

        const { password, ...userWithoutPassword } = updatedProfile;
        return userWithoutPassword;
    }

    /**
     * Retrieves paginated contact information for a user based on the userId.
     * Validates the provided user ID before querying the database.
     *
     * Throws a BadRequestException if the user ID is invalid or if no contact information is found.
     *
     * @param userId - The ID of the user whose contact information is requested.
     * @param query - Query parameters including pagination settings (page and pageSize).
     * @returns An object containing a list of contact information associated with the user and the total number of pages.
     */
    async getContactInfo(
        userId: string,
        query: GetContactInfoQueryDto
    ): Promise<{ contactInfo: ContactInfoEntity[], totalPages: number }> {
        const { page, pageSize } = query;
        const skip: number = (page - 1) * pageSize;
        const [contactInfo, totalCount] = await this.contactInfoRepository.findAllPaginated(
            userId,
            skip,
            pageSize
        );
        return { contactInfo, totalPages: Math.ceil(totalCount / pageSize) };
    }

    /**
     * Creates a new contact information entry for a user.
     * Validates the provided user ID and the contact info DTO before proceeding.
     *
     * Throws BadRequestException if the user ID or DTO is invalid.
     *
     * @param createContactInfoDto - DTO containing the contact information data
     * @param userId - The ID of the user who the contact information belongs to
     * @returns The newly created contact information entity
     */
    async createContactInfo(
        createContactInfoDto: CreateContactInfoDto,
        userId: string): Promise<ContactInfoEntity> {
        validateDtoNotEmpty(createContactInfoDto);
        const user: {id: string} = { id: userId };
        return this.contactInfoRepository.createAndSave(createContactInfoDto, user);
    }

    /**
     * Retrieves contact information by contactInfoId and userId.
     * Validates both the contactInfoId and userId.
     *
     * Throws BadRequestException if either ID is invalid.
     * Throws NotFoundException if no matching contact information is found.
     *
     * @param contactInfoId - The ID of the contact information
     * @param userId - The ID of the user
     * @returns The contact information for the given contactInfoId and userId
     */
    async getContactInfoByIdAndUser(
        contactInfoId: string,
        userId: string
    ): Promise<ContactInfoEntity> {
        const contactInfo: ContactInfoEntity | null =
            await this.contactInfoRepository.findOneByIds(contactInfoId, userId);
        if (!contactInfo) {
            throw new NotFoundException(NOT_FOUND_CONTACT_INFO);
        }
        return contactInfo;
    }

    /**
     * Updates the contact information for a given contactInfoId and userId.
     * Validates the provided update DTO and applies changes to the contact info entity.
     *
     * Throws BadRequestException if any input is invalid.
     * Throws NotFoundException if the contact information does not exist or does not belong to the user.
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
        validateDtoNotEmpty(updateContactInfoDto);
        const contactInfo: ContactInfoEntity =
            await this.getContactInfoByIdAndUser(contactInfoId, userId);
        const validatedDto: ContactInfoEntity = updateEntityWithDto(contactInfo, updateContactInfoDto);
        return this.contactInfoRepository.createAndUpdate(validatedDto);
    }

    /**
     * Deletes a contact info record or marks it as inactive if it is associated with an order.
     *
     * If the contact info is used in an existing order, it will be deactivated rather than removed.
     *
     * @param contactInfoId - The ID of the contact info to be deleted or deactivated.
     * @param userId - The ID of the user who owns the contact info.
     * @returns A promise that resolves to void.
     */
    async deleteContactInfo(
        contactInfoId: string,
        userId: string
    ): Promise<void> {
        const contactInfo: ContactInfoEntity = await this.getContactInfoByIdAndUser(contactInfoId, userId);
        const isOrderExist: boolean = await this.contactInfoRepository.isContactInfoUsed(contactInfoId);
        if (isOrderExist) {
            contactInfo.isActive = false;
            await this.contactInfoRepository.createAndUpdate(contactInfo);
        } else {
            await this.contactInfoRepository.remove(contactInfo);
        }
    }

    /**
     * Finds a user by the specified field and value.
     * Throws a NotFoundException if the field or value is missing,
     * or if the user is not found.
     * Returns the user data excluding the password field.
     *
     * @param field - The field name to search by (e.g., 'email', 'id').
     * @param value - The value of the field to match.
     * @returns A UserEntity object
     */
    async findBy(field: string, value: string): Promise<UserEntity | null> {
        if (!field || !value) {
            throw new NotFoundException(NOT_FOUND_USER_PROFILE);
        }
        return this.userRepository.findBy(field, value);
    }
}