import chalk from 'chalk';
import { getArgs } from '../shared/args/clit';
import path from 'path';
import { Static, Type, } from '@sinclair/typebox';
import { isOptions } from '../shared/args/IsOptions';
import { ajvConsoleLogger } from '../shared/args/AjvLogger';
import simpleGit, { SimpleGit } from 'simple-git';
import { refreshYarn } from '../shared/refreshYarn';

const ArgsSchema = Type.Object(
    {
        _: Type.Array(
            Type.String(),
            {
                description: 'modules specified by location to be loaded. E.g. shared/Package-Tools',
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

const loadGitmodule = async (module: string) => {
    console.log(`${chalk.yellow('Load git module')} ${chalk.cyan(module)}`);
    const status = await git.subModule(["status", module]);
    console.log(`${chalk.yellow('Git submodules status')} ${chalk.cyan(module)}: ${status}`);

    try {
        const response = await git.submoduleInit(module);
        console.log(`${chalk.yellow('Git submodules init')} ${chalk.cyan(module)}: ${response}`);
        const update = await git.submoduleUpdate(module);
        console.log(`${chalk.yellow('Git submodules uppdate')} ${chalk.cyan(module)}: ${update}`);
    } catch (unforcedError) {
        console.log(`${chalk.redBright((unforcedError as Error).message ?? unforcedError)}`);
    }
}


const TRAILING_SLASH = /[\/\\]$/;

const loadModules = async (modules: string[]) => {
    console.log(`${chalk.yellow('Loading')} ${chalk.cyan(modules.length)} module${modules.length == 1 ? '' : 's'} ...`);

    for (const module of modules) {
        const cleanModulePath = path.normalize(module).replace(TRAILING_SLASH, '');

        await loadGitmodule(cleanModulePath);
    }
    await refreshYarn();
};

const main = () => {
    const args: Args = getArgs();

    if (isOptions(args, ArgsSchema)) {
        loadModules(args._);
    } else {
        ajvConsoleLogger(args, ArgsSchema);
    }
};

main();

