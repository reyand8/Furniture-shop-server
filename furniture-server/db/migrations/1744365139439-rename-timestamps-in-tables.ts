import { MigrationInterface, QueryRunner } from 'typeorm';


export class RenameTimestampsInTables1744365139439 implements MigrationInterface {

    name: string = 'RenameTimestampsInTables1744365139439';

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "updated_at" TO "updatedAt"`);

        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "updated_at" TO "updatedAt"`);

        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "updated_at" TO "updatedAt"`);

        await queryRunner.query(`ALTER TABLE "order_details" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "order_details" RENAME COLUMN "updated_at" TO "updatedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "updatedAt" TO "updated_at"`);

        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "updatedAt" TO "updated_at"`);

        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "updatedAt" TO "updated_at"`);

        await queryRunner.query(`ALTER TABLE "order_details" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "order_details" RENAME COLUMN "updatedAt" TO "updated_at"`);
    }
}
