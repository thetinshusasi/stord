// Just a few helpers. Please ignore all of this.

/**
 * Returns true if the passed value is "plain" object, i.e. an object whose
 * prototype is the root `Object.prototype`. This includes objects created
 * using object literals, but not for instance for class instances.
 *
 * @param {any} value The value to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 *
 * @remarks Pulled from RTK's `isPlainObject`
 */
export function isPlainObject(value: unknown): value is object {
  if (typeof value !== "object" || value === null) return false;

  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;

  let baseProto = proto;
  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }

  return proto === baseProto;
}

export const toCamelCase = (text: string) => {
  return text.replace(/([-_][a-z])/gi, (s) => {
    return s.toUpperCase().replace("-", "").replace("_", "");
  });
};

export const convertSnakeToCamelCase = (obj: Record<string, any>) => {
  return Object.entries(obj).reduce(
    (acc: Record<string, unknown>, [key, value]) => {
      acc[toCamelCase(key)] = value;
      return acc;
    },
    {}
  );
};

export const convertSnakeToCamelCaseRecursive = (obj: Record<string, any>) => {
  return Object.entries(obj ?? {}).reduce(
    (acc: Record<string, unknown>, [key, value]) => {
      if (isPlainObject(value)) {
        acc[toCamelCase(key)] = convertSnakeToCamelCaseRecursive(value);
      } else {
        acc[toCamelCase(key)] = value;
      }
      return acc;
    },
    {}
  );
};
