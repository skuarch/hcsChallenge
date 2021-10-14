import { environment } from "./environments.js"

export const getEnvironment = (env) => {
  return environment[env];
}
