import { createWennCompleteServerApp } from './app.complete';

const PORT = Number(process.env.PORT || 3001);
const app = createWennCompleteServerApp();

app.listen(PORT, () => {
  console.log(`WENN complete server listening on port ${PORT}`);
});
