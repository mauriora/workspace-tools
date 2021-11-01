import chalk from 'chalk';
import { getArgs } from '../shared/args/clit';
import path from 'path';
import { Static, Type, } from '@sinclair/typebox';
import { isOptions } from '../shared/args/IsOptions';
import { ajvConsoleLogger } from '../shared/args/AjvLogger';
import simpleGit, { SimpleGit } from 'simple-git';
import prompts, { PromptObject } from 'prompts';
import { refreshYarn } from '../shared/refreshYarn';

const ArgsSchema = Type.Object(
    {
        _: Type.Array(
            Type.String(),
            {
                description: 'modules specified by location to be unloaded. E.g. shared/Package-Tools',
                minItems: 1
            }
        )
    },
    {
        additionalProperties: false
    }
);

type Args = Static<typeof ArgsSchema>;

const git: SimpleGit = simpleGit();

const TRY_WITH_FORCE: PromptObject = {
            type: 'confirm',
            name: 'force',
            message: 'Do you want to try using -f (FORCE) ?',
            initial: true
        };

const deInitGitModule = async (module: string) => {
    const status = await git.subModule(["status", module]);
    console.log(`${chalk.yellow('Status')} ${chalk.cyan(module)}: ${status}`);

    try {
        const unforced = await git.subModule(["deinit", module]);
        console.log(`${chalk.yellow('Git submodules deinit')} ${chalk.cyan(module)}: ${unforced}`);

    } catch (unforcedError) {
        console.log(`${chalk.redBright((unforcedError as Error).message ?? unforcedError)}`);
        
        const use = await prompts(TRY_WITH_FORCE);

        if (use.force) {
            const forced = await git.subModule(["deinit", "--force", module]);
            console.log(`${chalk.yellow('Git submodules deinit forced')} ${chalk.cyan(module)}: ${forced}`);
        }
    }
}

const TRAILING_SLASH = /[\/\\]$/;

const unloadModules = async (modules: string[]) => {
    console.log(`${chalk.yellow('Unloading')} ${chalk.cyan(modules.length)} module${modules.length == 1 ? '' : 's'} ...`);

    for (const module of modules) {
        const cleanModulePath = path.normalize(module).replace(TRAILING_SLASH, '');

        await deInitGitModule(cleanModulePath);
    }
    await refreshYarn();
};

const main = () => {
    const args: Args = getArgs();

    if (isOptions(args, ArgsSchema)) {
        unloadModules(args._);
    } else {
        ajvConsoleLogger(args, ArgsSchema);
    }
};

main();

