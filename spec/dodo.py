def task_testIt():
    return {
        'actions': ['echo helloWorld > file.txt'],
        'file_dep': ['dodo.py'],
        'targets': ['file.txt'],
    }

def task_testIt_also():
    return {
        'actions': ['echo helloWorld > file.txt'],
        'file_dep': ['dodo.py'],
        'targets': ['file.txt'],
    }
