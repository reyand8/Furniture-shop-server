import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrders1743759389175 implements MigrationInterface {
    name: string = 'CreateOrders1743759389175';

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
        CREATE TYPE "public"."orders_status_enum" AS ENUM(
        'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED'
      )
    `);

        await queryRunner.query(`
      CREATE TYPE "public"."orders_payment_method_enum" AS ENUM(
        'CREDIT_CARD', 'PAYPAL', 'CASH_ON_DELIVERY'
      )
    `);

        await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "status" "public"."orders_status_enum" NOT NULL DEFAULT 'PENDING',
                "paymentMethod" "public"."orders_payment_method_enum" NOT NULL DEFAULT 'CREDIT_CARD',
                "totalAmount" float NOT NULL,
                "notes" text,
                "user_id" uuid NOT NULL,
                "contact_info_id" uuid NOT NULL,
                CONSTRAINT "PK_orders_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_orders_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_orders_contact_info" FOREIGN KEY ("contact_info_id") REFERENCES "contact_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    }
}
