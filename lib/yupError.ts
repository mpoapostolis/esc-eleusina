export function getErrors(obj: Record<string, any>) {
  if (obj.errors)
    return {
      [obj.path]: obj.errors[0],
    };
  else return false;
}
