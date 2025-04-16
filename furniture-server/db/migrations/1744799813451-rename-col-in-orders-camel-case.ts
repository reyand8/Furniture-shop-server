import { MigrationInterface, QueryRunner } from 'typeorm';


export class RenameColInOrdersCamelCase1744799813451 implements MigrationInterface {

    name: string = 'RenameColInOrdersCamelCase1744799813451';

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_user"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_contact_info"`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`
            ALTER TABLE "orders" RENAME COLUMN "contact_info_id" TO "contactInfoId"`
        );
        await queryRunner.query(`
            ALTER TABLE "orders"
                ADD CONSTRAINT "FK_orders_user"
                    FOREIGN KEY ("userId") REFERENCES "users"("id") 
                        ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "FK_orders_contact_info"
            FOREIGN KEY ("contactInfoId") REFERENCES "contact_info"("id") 
                ON DELETE NO ACTION ON UPDATE NO ACTION
        `);


        await queryRunner.query(`
            ALTER TABLE "order_details" DROP CONSTRAINT "FK_order_details_product"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_details" DROP CONSTRAINT "FK_order_details_order"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_details" RENAME COLUMN "product_id" TO "productId"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_details" RENAME COLUMN "order_id" TO "orderId"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_details"
            ADD CONSTRAINT "FK_order_details_product"
            FOREIGN KEY ("productId") REFERENCES "products"("id") 
                ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "order_details"
            ADD CONSTRAINT "FK_order_details_order"
            FOREIGN KEY ("orderId") REFERENCES "orders"("id") 
                ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order_details" DROP CONSTRAINT "FK_order_details_order"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_details" DROP CONSTRAINT "FK_order_details_product"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_details" RENAME COLUMN "productId" TO "product_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_details" RENAME COLUMN "orderId" TO "order_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_details"
                ADD CONSTRAINT "FK_order_details_product"
                    FOREIGN KEY ("product_id") REFERENCES "products"("id") 
                        ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "order_details"
                ADD CONSTRAINT "FK_order_details_order"
                    FOREIGN KEY ("order_id") REFERENCES "orders"("id") 
                        ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_contact_info"
        `);
        await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_user"
        `);
        await queryRunner.query(`
            ALTER TABLE "orders" RENAME COLUMN "contactInfoId" TO "contact_info_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "orders" RENAME COLUMN "userId" TO "user_id"
        `);
        await queryRunner.query(`
          ALTER TABLE "orders"
          ADD CONSTRAINT "FK_orders_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") 
              ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
          ALTER TABLE "orders"
          ADD CONSTRAINT "FK_orders_contact_info"
          FOREIGN KEY ("contact_info_id") REFERENCES "contact_info"("id") 
              ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
