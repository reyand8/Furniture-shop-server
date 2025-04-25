import { MigrationInterface, QueryRunner } from 'typeorm';


export class AddIsActiveProductsCategories1744996913811 implements MigrationInterface {
    name: string = 'AddIsActiveProductsCategories1744996913811';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "products"
            ADD "isActive" boolean NOT NULL DEFAULT true
    `);
        await queryRunner.query(`
            ALTER TABLE "categories"
            ADD "isActive" boolean NOT NULL DEFAULT true
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "products"
            DROP COLUMN "isActive"
    `);
        await queryRunner.query(`
            ALTER TABLE "categories"
            DROP COLUMN "isActive"
    `);
    }
}
