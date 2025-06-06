const { promises: Fs} = require("fs")
const Path = require('path');

async function mkdir(path){
    try{
        await Fs.mkdir(path, { recursive: true });
    }
    catch(err){}
}
async function copyDir(src, dest) {
    await mkdir(dest);
    let entries = await Fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = Path.join(src, entry.name);
        let destPath = Path.join(dest, entry.name);

        entry.isDirectory() ?
            await copyDir(srcPath, destPath) :
            await Fs.copyFile(srcPath, destPath);
    }
}
async function copyFile(src, dest) {    
    let dir = Path.dirname(dest);
    await mkdir(dir);
    await Fs.copyFile(src, dest);    
};
async function readFile(fileName) {
    let result = await Fs.readFile(fileName, 'utf8');
    return result;
}
async function writeFile(fileName, content) {
    try{
        let dir = Path.dirname(fileName);
        await mkdir(dir);
        await Fs.writeFile(fileName, content, 'utf8');
    }
    catch(err){}
}
function replaceAll(value, search, replace) {
    return value.split(search).join(replace);
}

async function bundle(){    
    // await copyDir(Path.resolve(__dirname, '../node_modules/@ijstech/components/dist'), Path.resolve(__dirname, '../dist/lib/components'));
    await copyFile(Path.resolve(__dirname, '../src/lib/typescript.js'), Path.resolve(__dirname, '../lib/lib/typescript.js'));
    await copyFile(Path.resolve(__dirname, '../src/lib/typescript.d.ts'), Path.resolve(__dirname, '../types/lib/typescript.d.ts'));
    // await copyFile(Path.resolve(__dirname, '../src/lib/tact-compiler/index.js'), Path.resolve(__dirname, '../lib/lib/tact-compiler.js'));
    // await copyFile(Path.resolve(__dirname, '../src/lib/tact-compiler/index.d.ts'), Path.resolve(__dirname, '../types/lib/tact-compiler.d.ts'));
    await copyFile(Path.resolve(__dirname, '../node_modules/@ijstech/components/types/index.d.ts'), Path.resolve(__dirname, '../dist/lib/components/index.d.ts'));
    // await copyFile(Path.resolve(__dirname, '../src/lib/tact-compiler/browser.js'), Path.resolve(__dirname, '../dist/lib/tact-compiler.js'));

    let typescript = await readFile(Path.resolve(__dirname, '../node_modules/typescript/lib/typescript.js'));
    // let compiler = await readFile(Path.resolve(__dirname, '../lib/tactLib.js'));

    let content = await readFile(Path.resolve(__dirname, '../dist/index.js'));
    content = replaceAll(content, '"./lib/typescript"', '"typescript"');
    // content = replaceAll(content, '"./lib/tact-compiler"', '"tact-compiler"');
    await writeFile(Path.resolve(__dirname, '../dist/index.js'), 
`define("typescript", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true }); 
    ${typescript} 
    exports.default = ts;
});

${content}`);

    content = await readFile(Path.resolve(__dirname, '../dist/index.d.ts'));
    content = replaceAll(content, '"./lib/typescript"', '"typescript"');

    let typescriptDts = await readFile(Path.resolve(__dirname, '../node_modules/typescript/lib/typescript.d.ts'));
    // let tactDts = await readFile(Path.resolve(__dirname, '../src/lib/tact-compiler/index.d.ts'));
    await writeFile(Path.resolve(__dirname, '../dist/index.d.ts'), 
`declare module "typescript" {
    ${typescriptDts}
};

${content}`);    
};

bundle();
