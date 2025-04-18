import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';


export class AddSuperAdmin1744996912411 implements MigrationInterface {
    name: string = 'AddSuperAdmin1744996912411';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword ='$2b$12$kAO3Fk478ZgDDCH61BZqHO/9ALCcn5SFhbTlTfQq/ZbBo7sCi3nMK';

        await queryRunner.query(`
      INSERT INTO "users" (
        id, "firstName", "lastName", email, password, "isActive", role, "createdAt", "updatedAt"
      ) VALUES (
        uuid_generate_v4(),
        'Super',
        'Admin',
        'superadmin@superadmin.com',
        '${hashedPassword}',
        true,
        'SUPER_ADMIN',
        now(),
        now()
      )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "users" WHERE email = 'superadmin@superadmin.com'
        `);
    }
}