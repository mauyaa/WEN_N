import { createWennFinalServerApp } from './app.final';

const PORT = Number(process.env.PORT || 3001);
const app = createWennFinalServerApp();

app.listen(PORT, () => {
  console.log(`WENN final server listening on port ${PORT}`);
});
