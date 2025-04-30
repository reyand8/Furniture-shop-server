import { MigrationInterface, QueryRunner } from 'typeorm';


export class CreateOrderDetails1743759389177 implements MigrationInterface {

    name: string = 'CreateOrderDetails1743759389177';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`
          CREATE TABLE "order_details" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "quantity" integer NOT NULL,
            "price" float NOT NULL,
            "product_id" uuid NOT NULL,
            "order_id" uuid NOT NULL,
            CONSTRAINT "PK_order_details_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_order_details_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_order_details_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
          )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order_details"`);
    }
}
