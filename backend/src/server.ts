import { app } from './app.js';
import { env } from '@/config/env.config.js';

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
  console.log(`Swagger Docs available at http://localhost:${env.PORT}/api/docs`);
});
