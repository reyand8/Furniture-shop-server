import { MigrationInterface, QueryRunner } from 'typeorm';


export class AddIsActiveUser1744365138439 implements MigrationInterface {
    name: string = 'AddIsActiveUser1744365138439';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN "isActive" boolean NOT NULL DEFAULT true
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "isActive"
        `);
    }
}
