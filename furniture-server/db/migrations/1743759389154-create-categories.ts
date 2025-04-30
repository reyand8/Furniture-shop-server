import { MigrationInterface, QueryRunner } from 'typeorm';


export class CreateCategories1743759389154 implements MigrationInterface {
    name: string = 'CreateCategories1743759389154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_8b5f9fbc6a56c8c70bc56d94c92" UNIQUE ("name"),
                CONSTRAINT "PK_ba6fa7fa3cf218ea4b55fd7d35d" PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "categories";
        `);
    }
}
