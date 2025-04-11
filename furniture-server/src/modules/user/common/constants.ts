export const UUID_REGEX: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const FORBIDDEN_FIELDS_PROFILE: string[] = ['password', 'id', 'role', 'isActive'];

export const NOT_FOUND_USER_PROFILE: string = 'User profile not found';

export const NOT_FOUND_USER_DTO: string = 'Updated data not found';

export const NOT_FOUND_CONTACT_INFO: string = 'Contact-info not found';

export const REQUIRED_USER_ID: string = 'User id is required';

export const REQUIRED_USER_ID_AND_CONTACT_INFO_ID: string = 'User id and contact-info are required';

export const INVALID_CONTACT_INFO_ID: string = 'Invalid contact-info id format';

export const INVALID_USER_ID: string = 'Invalid user id format';

export const ERROR_SERVER: string = 'Internal server error:'
