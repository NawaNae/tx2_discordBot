const Path=require("../PathSetting");
const {Cmd} =require(`${Path.jsFolder}botHandler.js`);
class Restart extends Cmd
{
    constructor(settingsManager,botHandler)
    {
        super(settingsManager,botHandler);
        this.name="restart";
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.defaultSetting.alias=["R"];
        this.defaultSetting.op=true;
        this.settingsProcess();
    }
    onmessage({cmd,args,msg})
    {
        if(!this.verifys(msg))return;
        this.tryDelete(msg);
        process.exit(1);
    }
}
module.exports=Restart;