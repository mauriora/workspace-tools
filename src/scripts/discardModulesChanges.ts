import { ajvConsoleLogger, getArgs, isOptions } from '@mauriora/minimist-better-ajv-errors-cli';
import { Static, Type } from '@sinclair/typebox';
import chalk from 'chalk';
import prompts, { PromptObject } from 'prompts';
import simpleGit, { SimpleGit } from 'simple-git';

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

const restoreModules = async () => {
    console.log(`${chalk.yellow('Git submodules restore ...')}`);
    await git.subModule(["foreach", 'git restore --staged --worktree -- .'], (errorOutput, stdOut) => {
        if (stdOut) {
            console.log(stdOut);
        }
        if (errorOutput) {
            console.error(`${chalk.red(errorOutput.name)}: ${chalk.redBright(errorOutput.message)}`);
        }
    });
}


const main = async () => {
    const args: Args = getArgs();

    if (isOptions(args, ArgsSchema)) {
        const areYou = await prompts(ARE_YOU_SURE);

        if (areYou.sure) {
            try {
                restoreModules();
            } catch (unforcedError) {
                console.error(`${chalk.redBright((unforcedError as Error).message ?? unforcedError)}`);
            }
        }
    } else {
        ajvConsoleLogger(args, ArgsSchema);
    }
};

main();
