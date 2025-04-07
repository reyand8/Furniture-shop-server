import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContactInfo1743759389169 implements MigrationInterface {
    name: string = 'CreateContactInfo1743759389169';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "contact_info" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "phone" character varying(13) NOT NULL,
                "address" character varying(200) NOT NULL,
                "zipCode" character varying(30) NOT NULL,
                "city" character varying(100) NOT NULL,
                "region" character varying(100) NOT NULL,
                "country" character varying NOT NULL,
                "companyName" character varying(100),
                "companyTaxId" character varying(40),
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_contact_info_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_contact_info_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "contact_info"`);
    }
}
