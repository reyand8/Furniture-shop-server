import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1743759389168 implements MigrationInterface {
    name: string = 'CreateUsers1743759389168';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TYPE "public"."users_role_enum" 
        AS ENUM('SUPER_ADMIN', 'ADMIN', 'USER')
    `);

        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "firstName" character varying(60) NOT NULL,
                "lastName" character varying(60) NOT NULL,
                "email" character varying(60) NOT NULL,
                "password" character varying NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER',
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}
