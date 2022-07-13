import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAuthTokenTable1657658242951 implements MigrationInterface {
  userForeignKey = new TableForeignKey({
    columnNames: ['userId'],
    referencedColumnNames: ['id'],
    referencedTableName: 'users',
    onDelete: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'auth_tokens',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'userId',
            type: 'int',
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
    await queryRunner.createForeignKey('auth_tokens', this.userForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('auth_tokens', this.userForeignKey);
    await queryRunner.dropTable('auth_tokens');
  }
}
