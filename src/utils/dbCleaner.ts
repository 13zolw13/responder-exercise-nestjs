import { Connection, getConnection } from 'typeorm';

export class DatabaseCleaner {
  constructor(private readonly connection: Connection = getConnection()) {}

  public async cleanup() {
    const { connection } = this;
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Cleanup can only be used in test environment');
    }

    if (!connection.isConnected) {
      await connection.connect();
    }
    const entities = this.connection.entityMetadatas;
    for (const entity of entities) {
      const repository = this.connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName};`);
    }
  }
}
export const cleanupBeforeEachSpec = () =>
  beforeEach(() => new DatabaseCleaner().cleanup());
