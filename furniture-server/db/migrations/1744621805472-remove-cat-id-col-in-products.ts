import { MigrationInterface, QueryRunner } from 'typeorm';


export class RemoveCatIdColInProducts1744621805472 implements MigrationInterface {

    name: string = 'RemoveCatIdColInProducts1744621805472';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "category_id"`);

        await queryRunner.query(`ALTER TABLE "products" ADD "categoryId" uuid`);

        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_category"
            FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_category"`);

        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "categoryId"`);

        await queryRunner.query(`ALTER TABLE "products" ADD "categoryId" uuid`);
    }
}
