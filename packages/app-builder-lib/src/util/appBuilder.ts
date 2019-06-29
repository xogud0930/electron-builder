import { executeAppBuilder } from "builder-util"

export function executeAppBuilderAsJson<T>(args: Array<string>): Promise<T> {
  return executeAppBuilder(args)
    .then(rawResult => {
      try {
        return JSON.parse(rawResult) as T
      }
      catch (e) {
        throw new Error(`Cannot parse result: ${e.message}: "${rawResult}"`)
      }
    })
}

export function executeAppBuilderAndWriteJson(args: Array<string>, data: any): Promise<string> {
  return executeAppBuilder(args, childProcess => {
    childProcess.stdin!!.end(JSON.stringify(data))
  }, {stdio: ["pipe", "pipe", process.stdout]})
}

export function objectToArgs(to: Array<string>, argNameToValue: { [key: string]: string | null; }): void {
  for (const name of Object.keys(argNameToValue)) {
    const value = argNameToValue[name]
    if (value != null) {
      to.push(`--${name}`, value)
    }
  }
}
