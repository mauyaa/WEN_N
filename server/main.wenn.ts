import { createWennServerApp } from './app.wenn';

const PORT = Number(process.env.PORT || 3001);
const app = createWennServerApp();

app.listen(PORT, () => {
  console.log(`WENN-first server listening on port ${PORT}`);
});
