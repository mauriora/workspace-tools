import chalk from 'chalk';
import { getArgs } from '../shared/args/clit';
import { Static, Type, } from '@sinclair/typebox';
import { isOptions } from '../shared/args/IsOptions';
import { ajvConsoleLogger } from '../shared/args/AjvLogger';
import simpleGit, { SimpleGit } from 'simple-git';
import prompts, { PromptObject } from 'prompts';

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
    await git.subModule(["foreach", 'git restore -- .'], (errorOutput, stdOut) => {
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
