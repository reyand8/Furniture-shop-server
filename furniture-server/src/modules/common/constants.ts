export const UUID_REGEX: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const FORBIDDEN_FIELDS_PROFILE: string[] = ['password', 'id', 'role', 'isActive'];

export const ERROR_MESSAGES = {
    NOT_FOUND_USER_PROFILE: 'User profile not found',
    NOT_FOUND_CONTACT_INFO: 'Contact-info not found',
    NOT_FOUND_DTO: 'DTO is empty or not found',
    NOT_FOUND_CATEGORY: 'Category not found',
    REQUIRED_USER_ID: 'User id is required',
    REQUIRED_USER_ID_AND_CONTACT_INFO_ID: 'User id and contact-info are required',
    REQUIRED_CATEGORY_NAME: 'Category name is required',
    REQUIRED_CATEGORY_ID: 'Category id is required',
    INVALID_CONTACT_INFO_ID: 'Invalid contact-info id format',
    INVALID_USER_ID: 'Invalid user id format',
    INVALID_CATEGORY_ID: 'Invalid category id format',
    ERROR_SERVER: 'Internal server error:',
};
