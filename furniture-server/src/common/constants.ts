export const ERROR_MESSAGES = {
    NOT_FOUND_JWT_KEY: 'JWT_SECRET_KEY is not defined',
    NOT_FOUND_USER_PROFILE: 'User profile not found',
    NOT_FOUND_CONTACT_INFO: 'Contact-info not found',
    NOT_FOUND_DTO: 'DTO is empty or not found',
    NOT_FOUND_CATEGORY: 'Category not found',
    NOT_FOUND_PRODUCT: 'Product not found',
    NOT_FOUND_PRODUCT_IDS: 'Product ids not found',
    NOT_FOUND_PRODUCT_IN_ORDER: 'One or more products were not found:',
    NOT_FOUND_ORDER: 'Order not found or does not belong to the user',

    REQUIRED_CATEGORY_NAME: 'Category name is required',
    REQUIRED_PRODUCT_TYPE: 'Product type is required',
    REQUIRED_PRODUCT_NAME: 'Product name is required',

    INVALID_PRODUCT_TYPE: 'Invalid product type',
    INVALID_CREDENTIALS: 'Invalid credentials',
    INVALID_REQUEST: 'Bad Request',

    ERROR_SERVER: 'Internal server error:',
    ERROR_CREATE_USER: 'Create user error',
    ERROR_PERMISSION_ORDER_UPDATE: 'You cannot perform this action',

    EXISTS_CATEGORY_NAME: 'Category name exists',
    EXISTS_EMAIL: 'This email is already in use',

    UNAVAILABLE_PRODUCTS: 'There are some unavailable products:',
    FORBIDDEN_ACCESS: 'Only super admin can perform this action',

    INACTIVE_USER_PROFILE: 'User profile is inactive',

    INVALID_PAGE: 'Page must be greater than 0',
    INVALID_PAGE_SIZE: 'Page size must be greater than 0',
    PAGE_GREATER_THAN_SIZE: 'Page cannot be greater than page size',
};
