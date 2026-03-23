import { createServerApp } from './app';

const PORT = Number(process.env.PORT || 3001);
const app = createServerApp();

app.listen(PORT, () => {
  console.log(`WENN server listening on port ${PORT}`);
});
