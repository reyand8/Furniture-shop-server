import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentStatusInOrders1744896518436 implements MigrationInterface {

    name: string = 'AddPaymentStatusInOrders1744896518436';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."orders_payment_status_enum" AS ENUM(
                'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "orders"
            ADD COLUMN "paymentStatus" "public"."orders_payment_status_enum" NOT NULL DEFAULT 'PENDING'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "orders"
            DROP COLUMN "paymentStatus"
        `);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_status_enum"`);
    }
}
