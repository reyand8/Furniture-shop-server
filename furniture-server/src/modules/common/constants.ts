export const UUID_REGEX: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const FORBIDDEN_FIELDS_PROFILE: string[] = ['password', 'id', 'role', 'isActive'];

export const ERROR_MESSAGES = {
    NOT_FOUND_USER_PROFILE: 'User profile not found',
    NOT_FOUND_CONTACT_INFO: 'Contact-info not found',
    NOT_FOUND_DTO: 'DTO is empty or not found',
    NOT_FOUND_CATEGORY: 'Category not found',
    NOT_FOUND_PRODUCT: 'Product not found',
    NOT_FOUND_PRODUCT_IN_ORDER: 'One or more products were not found:',
    NOT_FOUND_ORDER: 'Order not found or does not belong to the user',

    REQUIRED_ID: 'Id is required',
    REQUIRED_USER_ID: 'User id is required',
    REQUIRED_USER_ID_AND_CONTACT_INFO_ID: 'User id and contact-info are required',
    REQUIRED_CATEGORY_NAME: 'Category name is required',
    REQUIRED_CATEGORY_ID: 'Category id is required',
    REQUIRED_PRODUCT_ID: 'Product id is required',
    REQUIRED_ORDER_ID: 'Order id is required',
    REQUIRED_PRODUCT_TYPE: 'Product type is required',
    REQUIRED_PRODUCT_NAME: 'Product name is required',

    INVALID_ID_FORMAT: 'Invalid id format',
    INVALID_CONTACT_INFO_ID: 'Invalid contact-info id format',
    INVALID_CONTACT_INFO: 'Invalid contact-info',
    INVALID_USER_ID: 'Invalid user id format',
    INVALID_CATEGORY_ID: 'Invalid category id format',
    INVALID_PRODUCT_ID: 'Invalid product id format',
    INVALID_ORDER_ID: 'Invalid order id format',
    INVALID_PRODUCT_TYPE: 'Invalid product type',
    INVALID_CREDENTIALS: 'Invalid credentials',

    ERROR_SERVER: 'Internal server error:',
    ERROR_PERMISSION_ORDER_UPDATE: 'You cannot perform this action',
    EXISTS_CATEGORY_NAME: 'Category name exists',
    UNAVAILABLE_PRODUCTS: 'There are some unavailable products:',

    INACTIVE_USER_PROFILE: 'User profile is inactive',

    INVALID_PAGE: 'Page must be greater than 0',
    INVALID_PAGE_SIZE: 'Page size must be greater than 0',
    PAGE_GREATER_THAN_SIZE: 'Page cannot be greater than page size',

    FORBIDDEN_ACCESS: 'Only super admin can perform this action',
};
