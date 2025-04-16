import { MigrationInterface, QueryRunner } from 'typeorm';


export class AddIsAvailableUpdateSizesInProducts1744799818459 implements MigrationInterface {

    name: string = 'AddIsAvailableUpdateSizesInProducts1744799818459';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sizes"`);

        await queryRunner.query(`
            ALTER TABLE "products" ADD "size" character varying(50) NOT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "products" ADD "isAvailable" boolean NOT NULL DEFAULT true
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "isAvailable"`);

        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sizes"`);

        await queryRunner.query(`ALTER TABLE "products" ADD "size" text array NOT NULL`);
    }
}
