import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';


/**
 * Validates that the current property is less than or equal to the specified property.
 *
 * @param property - Property to compare with.
 * @param validationOptions - Optional validator settings.
 */
export function IsLessThanOrEqualTo(
    property: string,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsLessThanOrEqualTo',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(_: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    const currentValue = (args.object as any)[args.property];
                    if (currentValue != null && relatedValue != null) {
                        return typeof currentValue === 'number' &&
                            typeof relatedValue === 'number' &&
                            currentValue <= relatedValue;
                    }
                    return true;
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    return `${args.property} must be less than or equal to ${relatedPropertyName}`;
                },
            },
        });
    };
}