type FindValueByKeyInEntries<
  SearchedKey,
  // biome-ignore lint/suspicious/noExplicitAny: TypeScript utility types require any for flexibility
  TEntries extends ReadonlyArray<readonly [any, any]>,
> = TEntries[number] extends infer EntriesUnion
  ? EntriesUnion extends readonly [infer Key extends SearchedKey, infer Value]
    ? SearchedKey extends Key
      ? Value
      : never
    : never
  : never;

// biome-ignore lint/suspicious/noExplicitAny: TypeScript utility types require any for flexibility
type Entries<TObject> = TObject extends any
  ? { [TKey in keyof TObject]: readonly [TKey, TObject[TKey]] }[keyof TObject]
  : never;

interface ObjectConstructor {
  //  https://github.com/microsoft/TypeScript/issues/35745
  // biome-ignore lint/suspicious/noExplicitAny: TypeScript utility types require any for flexibility
  entries<TObject extends Readonly<Record<string, any>>>(
    o: TObject,
  ): ReadonlyArray<Exclude<Entries<TObject>, undefined>>;
  fromEntries<TValue, TKey extends string>(
    entries: Iterable<readonly [TKey, TValue]>,
  ): ReadonlyRecord<TKey, TValue>;
  // biome-ignore lint/suspicious/noExplicitAny: TypeScript utility types require any for flexibility
  fromEntries<TEntries extends ReadonlyArray<readonly [string, any]>>(
    entries: TEntries,
  ): Readonly<{ [k in TEntries[number][0]]: FindValueByKeyInEntries<k, TEntries> }>;
  keys<TKey extends string, TValue>(o: Readonly<Record<TKey, TValue>>): ReadonlyArray<TKey>;
}
