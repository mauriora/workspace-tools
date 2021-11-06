import chalk from 'chalk';
import { getArgs } from '../shared/args/clit';
import { Static, Type, } from '@sinclair/typebox';
import { isOptions } from '../shared/args/IsOptions';
import { ajvConsoleLogger } from '../shared/args/AjvLogger';
import simpleGit, { ResetMode, SimpleGit } from 'simple-git';
import prompts, { PromptObject } from 'prompts';
import path from 'path';

const ArgsSchema = Type.Object(
    {
        _: Type.Array(
            Type.String(),
            {
                description: 'modules specified by location changes to be discarded. E.g. shared/Package-Tools',
                maxItems: 0
            }
        )
    },
    {
        additionalProperties: false
    }
);

type Args = Static<typeof ArgsSchema>;

const git: SimpleGit = simpleGit();

const ARE_YOU_SURE: PromptObject = {
    type: 'confirm',
    name: 'sure',
    message: 'Are you sure want to discard the changes in all sub modules ?',
    initial: false
};

const resetModule = async (folder: string) => {
    console.log(`${chalk.yellow('Git reset submodule')} ${chalk.magenta(folder)} ...`);
    const moduleGit = simpleGit(folder);

    await moduleGit.reset(ResetMode.HARD, ['HEAD^'], (errorOutput, stdOut) => {
        if (stdOut) {
            console.log(stdOut);
        }
        if (errorOutput) {
            console.error(`folder: ${chalk.red(errorOutput.name)}: ${chalk.redBright(errorOutput.message)}`);
        }
    });
}

const getAhead = async () => {
    const status = await git.status();
    const modifiedModules = status.modified.filter(modified => modified.includes('/'));
    const files = [];
    const modules = [];

    for (const modifiedModule of modifiedModules) {
        const moduleGit = simpleGit(modifiedModule);
        const status = await moduleGit.status();
        const moduleFiles = status.modified.map(file => path.join(modifiedModule, file));

        if (status.ahead) {
            modules.push(modifiedModule);
            files.push(
                modifiedModule,
                ...moduleFiles
            );
        }
    }

    return {files, modules};
}

const main = async () => {
    const args: Args = getArgs();

    if (isOptions(args, ArgsSchema)) {
        const modified = await getAhead();
        console.log(`Modified modules:\n  ${chalk.redBright(modified.files.join('\n  '))}`);

        const areYou = await prompts(ARE_YOU_SURE);

        if (areYou.sure) {
            try {
                for (const folder of modified.modules) {
                    resetModule(folder);
                }

            } catch (unforcedError) {
                console.error(`${chalk.redBright((unforcedError as Error).message ?? unforcedError)}`);
            }
        }
    } else {
        ajvConsoleLogger(args, ArgsSchema);
    }
};

main();
