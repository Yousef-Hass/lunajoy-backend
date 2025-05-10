import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndDailyLogsTable1746819563897 implements MigrationInterface {
  name = 'CreateUserAndDailyLogsTable1746819563897';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "daily_logs" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "mood" integer NOT NULL, "anxietyLevel" integer, "sleepHours" double precision, "sleepQuality" character varying(50), "sleepDisturbances" text, "physicalActivityType" character varying(100), "physicalActivityDuration" integer, "socialInteractions" integer, "stressLevel" integer, "depressionSymptoms" text, "anxietySymptoms" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ea32d6160ba0b85cb14426c50b0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "google_id" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b" UNIQUE ("google_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "daily_logs" ADD CONSTRAINT "FK_28dc684c15a9369be262170f705" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "daily_logs" DROP CONSTRAINT "FK_28dc684c15a9369be262170f705"`
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "daily_logs"`);
  }
}
