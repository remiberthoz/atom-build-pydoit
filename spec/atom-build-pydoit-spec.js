'use babel';

import fs from 'fs';
import path from 'path';
import { providePydoitBuilder } from '../lib/atom-build-pydoit';

describe('AtomBuildPydoit', () => {
    let directory;  // assigned by beforeEach() and removed by afterEach()
    let builder;  // constructed by beforeEach()
    const Builder = providePydoitBuilder();

    beforeEach(() => {
        tempDirPromise = new Promise((resolve, reject) => {
            fs.mkdtemp('atom-build-pydoit-spec-', (error, dir) => {
                if (error) {
                    throw error;
                }
                resolve(dir);
            });
        });

        waitsForPromise(() => {
            return tempDirPromise
                .then((dir) => (directory = `${dir}/`))
                .then((dir) => builder = new Builder(dir));
        });
    });

    function removeDirRec(dir) {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach(function(entry) {
                var entry_path = path.join(dir, entry);
                if (fs.lstatSync(entry_path).isDirectory()) {
                    removeDirRec(entry_path);
                } else {
                    fs.unlinkSync(entry_path);
                }
            });
            fs.rmdirSync(dir);
        }
    }
    afterEach(() => {
        removeDirRec(directory);
    })

    describe('when doit is done', () => {
        beforeEach(() => {
            fs.copyFileSync(`${__dirname}/dodo.py`, directory + 'dodo.py');
        });
        it('should be eligble', () => {
            expect(builder.isEligible(directory)).toBe(true);
        });
        it('should list the targets', () => {
            waitsForPromise(() => {
                return Promise.resolve(builder.settings(directory)).then((tasksList) => {
                    // ... the list should have the correct number of items
                    expect(tasksList.length).toBe(2);

                    // ... the task names should be correct
                    expect(tasksList[0].args).toEqual(['testIt']);
                    expect(tasksList[1].args).toEqual(['testIt_also']);
                })
            })
        })
    })

    describe('when dodo.py does not exist', () => {
        it('sould not be eligible', () => {
            expect(builder.isEligible(directory)).toBe(false);
        });
    });
})
