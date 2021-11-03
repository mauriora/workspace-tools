import chalk from "chalk";

import { exec, ExecException } from 'child_process';

export const refreshYarn = async () => {
    console.log(`${chalk.yellow('refreshYarn')}`);

    try {
        var child = exec('yarn install');
        child.stdout.pipe(process.stdout);
        child.stdin.pipe(process.stdin);
        child.stderr.pipe(process.stderr);

        await new Promise((r) =>
            child.on('exit', r )
        );
    } catch (yarnInitError) {
        console.error(`${chalk.redBright((yarnInitError as ExecException).message ?? yarnInitError)}`, yarnInitError);
    }
}
