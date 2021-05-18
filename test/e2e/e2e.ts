import o from 'ospec';

export async function run() : Promise<void> {
  /* eslint-disable */
  const files = require("fast-glob").sync("./*.spec.ts", {cwd: __dirname});
  for(let i = 0; i < files.length; i++) {
    console.log('file:', files[i]);
    await require('./' + files[i]).default();
  }

  o.run();
}
