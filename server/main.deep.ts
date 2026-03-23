import { createWennDeepServerApp } from './app.deep';

const PORT = Number(process.env.PORT || 3001);
const app = createWennDeepServerApp();

app.listen(PORT, () => {
  console.log(`WENN deep server listening on port ${PORT}`);
});
