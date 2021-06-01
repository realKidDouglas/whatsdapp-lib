

export function downcast<T = never>(v: unknown) : T {
  return v as T;
}
