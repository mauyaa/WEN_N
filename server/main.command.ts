import { createWennCommandServerApp } from './app.command';

const PORT = Number(process.env.PORT || 3001);
const app = createWennCommandServerApp();

app.listen(PORT, () => {
  console.log(`WENN command server listening on port ${PORT}`);
});
