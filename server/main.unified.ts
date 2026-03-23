import { createWennUnifiedServerApp } from './app.unified';

const PORT = Number(process.env.PORT || 3001);
const app = createWennUnifiedServerApp();

app.listen(PORT, () => {
  console.log(`WENN unified server listening on port ${PORT}`);
});
