import { Sequelize } from 'sequelize';

// Config object with correct remote DB info
const config = {
  host: 'buyme-atharvkarbhari123-4347.l.aivencloud.com',
  port: 28041, // Add this line
  username: 'avnadmin',
  password: 'AVNS_T7UDJCo-JNd5BrHauZh',
  database: 'buyme',
  dialect: 'mysql' as const,
};

let sequelize: Sequelize | null = null;

// Loader function
export const sqlLoader = async (): Promise<void> => {
  try {
    sequelize = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port, // Pass port here
      dialect: config.dialect,
      logging: false, // Set to true if you want to see all SQL logs
    });

    await sequelize.authenticate();
    console.log('Connected to MySQL database via Sequelize');
  } catch (error) {
    console.error('Error connecting to MySQL with Sequelize:', error);
    throw error;
  }
};

// Getter function
export const getSQLConnection = (): Sequelize | null => {
  return sequelize;
};
