import chalk from "chalk";

import { exec, ExecException } from 'child_process';

const exec2Console = (error: ExecException | null, stdout: string, stderr: string) => {
    if(error) {
        console.error(error.message);
    } else {
        console.log(stdout);
        console.error(stderr);
    }
}

export const refreshYarn = async () => {
    console.log(`${chalk.yellow('refreshYarn')}`);

    try {
        exec('yarn install', exec2Console);
    } catch (yarnInitError) {
        console.error(`${chalk.redBright((yarnInitError as Error).message ?? yarnInitError)}`);
    }
}
