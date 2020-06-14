'use babel';

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { EventEmitter } from 'events';

export function providePydoitBuilder() {

    return class PydoitBuildProvier extends EventEmitter {

        constructor(cwd) {
            super();
            this.cwd = cwd;
            this.dodo = ['dodo.py']; // will evolve for configuration, this is the default name in pydoit
        }

        getNiceName() {
            return 'Build with pydoit';
        }

        // Returns true if a dodo.py file was found in the cwd
        isEligible() {
            foundDodo = this.dodo.map(f => path.join(this.cwd, f)).filter(fs.existsSync);
            return (foundDodo.length > 0);
        }

        // Either returns all make tasks reported by `doit list`,
        // or an "empty" task wich just states that there were no tasks in the dodo.py
        settings() {
            const emptyTask = {
                exec: 'echo "There is no task in the dodo.py file(s)" && false',
                name: 'No tasks found in dodo.py',
                args: [],
                sh: true,
                errorMatch: []
            };

            const tasksListPromise = new Promise((resolve, reject) => {
                exec('doit list', { cwd: this.cwd, encoding: 'utf-8' }, (error, stdout, stderr) => {
                    if (error) {
                        throw error;
                    }
                    resolve(stdout ? stdout : stderr);
                });
            });

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            return tasksListPromise.then(tasksList => {
                return tasksList.toString('utf-8')
                    .split(/[\r\n]/)
                    .filter(line => /^[a-zA-Z0-9_]+\s*.*/.test(line))
                    .filter(onlyUnique)
                    .map(taskLine => taskLine.split(' ').shift())
                    .map(task => ({
                        name: `doit task: ${task}`,
                        atomCommandName: `doit:${task}`,
                        exec: 'doit',
                        args: [task],
                        cwd: this.cwd,
                        sh: false,
                        errorMatch: []  // TODO: Error matching
                    }));
            }).catch(e => [emptyTask]);
        }
    };
}
