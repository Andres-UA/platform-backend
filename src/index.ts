import app from './app';
import dotenv from 'dotenv';
import { startConnection } from './database';

dotenv.config();

async function main() {
  startConnection();
  await app.listen(app.get('port'));
  console.info('Server is running on port ', app.get('port'));
}

main();
