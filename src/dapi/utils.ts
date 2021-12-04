//retry from: https://stackoverflow.com/questions/38213668/promise-retry-design-patterns#answer-70164259
type AnyFn = (...any: any[]) => any;
type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
//type DelayFn = (retry: number) => number;

//const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function retryFunctionXTimes<Fn extends AnyFn>(
  fn: Fn,
  maxRetries: number,
//  getDelay: DelayFn = () => 5000
) {
  let retries = 0;

  return async function wrapped(
    ...args: Parameters<Fn>
  ): Promise<Awaited<ReturnType<Fn>>> {
    try {
      return await fn(...args);
    } catch (e) {
      if (++retries > maxRetries){
          //throw if maxRetries was reached
          throw e;
      }

      //const delayTime = getDelay(retries);
      console.error(e);
      console.log(`Retry ${fn.name} ${retries} times`);// after delaying ${delayTime}ms`);
      //await delay(delayTime);
      return await wrapped(...args);
    }
  };
}