import { MigrationInterface, QueryRunner } from 'typeorm';


export class CreateProducts1743759389160 implements MigrationInterface {
    name: string = 'CreateProducts1743759389160';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."products_type_enum" AS ENUM('FURNITURE', 'DECOR', 'ACCESSORIES')`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying(100) NOT NULL,
                "description" character varying(500) NOT NULL,
                "price" double precision NOT NULL,
                "discountPrice" double precision,
                "currency" character varying(20) NOT NULL,
                "images" text array NOT NULL,
                "type" "public"."products_type_enum" NOT NULL,
                "sizes" text array NOT NULL,
                "color" character varying(50),
                "isBestSeller" boolean NOT NULL DEFAULT false,
                "category_id" uuid NOT NULL,
                CONSTRAINT "PK_d8f75f8e7e93e51b33f0e493f4e" PRIMARY KEY ("id"),
                CONSTRAINT "FK_67d0516c5290f1a9be97e42d95c" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_type_enum"`);
    }
}
