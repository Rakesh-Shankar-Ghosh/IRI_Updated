import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Client } from 'pg'; // Import the Client class

class ConfigService {
  static async getDbConfig(): Promise<TypeOrmModuleOptions> {
    // const client = new Client({
    //   host: 'localhost',
    //   port: 5432,
    //   user: 'postgres',
    //   password: 'django', // Replace with your actual password (store securely using environment variables)
    //   database: 'Iri',
    // });

    const client = new Client({
      host: process.env.HOST,
      port: process.env.PORT,
      user: process.env.USER,
      password: process.env.PASSWORD, // Replace with your actual password (store securely using environment variables)
      database: process.env.DATABASE,
    });
    try {
      await client.connect();
      console.log(
        'Successfully connected to PostgreSQL database',
        client.database,
      );

      return {
        type: 'postgres',
        host: client.host,
        port: client.port,
        username: client.user,
        password: client.password,
        database: client.database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true, // Set synchronize to false for production environments (recommended)
        logging: false,
      };
    } catch (error) {
      console.error('Failed to connect to PostgreSQL database:', error);

      throw new Error('Database connection failed');
    } finally {
      await client.end();
    }
  }
}

export default ConfigService;
