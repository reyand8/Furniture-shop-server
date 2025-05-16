import { MigrationInterface, QueryRunner } from 'typeorm';


export class AddIsActiveContactInfo1744996963811 implements MigrationInterface {

    name: string = 'AddIsActiveContactInfo1744996963811';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "contact_info"
            ADD "isActive" boolean NOT NULL DEFAULT true
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "contact_info"
            DROP COLUMN "isActive"
    `);
    }
}
