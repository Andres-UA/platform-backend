import { connect } from 'mongoose';

export async function startConnection() {
  await connect(
    process.env.DB_CONNECT || 'mongodb://localhost/platform',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
  console.info('Database is connected');
}
