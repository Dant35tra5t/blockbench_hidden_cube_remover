BBPlugin.register('hidden_cube_cleaner', {
    title: 'Hidden Cube Cleaner',
    author: 'Awesome_Dante',
    description: 'Removes cubes that are completely hidden inside other cubes. Use the tools menu icon to clean.',
    version: '1.0.0',
    variant: 'both',

    onload() {
        const action = new Action('clean_hidden_cubes', {
            name: 'Clean Hidden Cubes',
            description: 'Remove cubes that are fully enclosed by others',
            icon: 'fa-broom',
            click() {
                Undo.initEdit({elements: Cube.all, selection: true});
                
                const cubes = Cube.all.slice(); // get all cubes
                const hidden = findHiddenCubes(cubes);

                hidden.forEach(cube => cube.remove());
                
                Undo.finishEdit('Clean Hidden Cubes');
                Blockbench.showMessageBox({
                    title: 'Hidden Cube Cleaner',
                    message: `Removed ${hidden.length} hidden cube(s).`
                });
            }
        });
        MenuBar.addAction(action, 'tools');
    },

    onunload() {
        // Clean up
        if (MenuBar.menus.tools) {
            MenuBar.menus.tools.removeAction('clean_hidden_cubes');
        }
    }
});

function isInside(a, b) {
    // true if A is entirely within B
    return (
        a.from[0] >= b.from[0] && a.to[0] <= b.to[0] &&
        a.from[1] >= b.from[1] && a.to[1] <= b.to[1] &&
        a.from[2] >= b.from[2] && a.to[2] <= b.to[2]
    );
}

function findHiddenCubes(cubes) {
    const hidden = [];
    for (const c of cubes) {
        let contained = false;
        for (const other of cubes) {
            if (c === other) continue;
            if (isInside(c, other)) {
                contained = true;
                break;
            }
        }
        if (contained) hidden.push(c);
    }
    return hidden;

}
