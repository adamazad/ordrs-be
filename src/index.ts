import '@constants';
import { init, start } from './server';

(async () => {
  await init();
  await start();
})();
