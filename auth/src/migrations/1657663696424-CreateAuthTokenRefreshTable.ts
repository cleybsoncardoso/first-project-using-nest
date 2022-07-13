import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAuthTokenRefreshTable1657663696424
  implements MigrationInterface
{
  authTokenForeignKey = new TableForeignKey({
    columnNames: ['authTokenId'],
    referencedColumnNames: ['id'],
    referencedTableName: 'auth_tokens',
    onDelete: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'auth_refresh_tokens',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'authTokenId',
            type: 'varchar',
          },
          {
            name: 'revoked',
            type: 'boolean',
            default: false,
          },
          {
            name: 'expiredAt',
            type: 'timestamp',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'auth_refresh_tokens',
      this.authTokenForeignKey,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'auth_refresh_tokens',
      this.authTokenForeignKey,
    );
    await queryRunner.dropTable('auth_refresh_tokens');
  }
}
