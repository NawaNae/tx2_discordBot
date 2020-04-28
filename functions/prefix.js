const Path=require("../PathSetting");
const {Cmd} =require(`${Path.jsFolder}botHandler.js`);
class Prefix extends Cmd
{
    constructor(settingsManager,botHandler)
    {
        super(settingsManager,botHandler);
        this.name="prefix";
        this.defaultSetting.op=true;
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.settingsProcess();
    }
    onmessage({cmd,args,msg})
    {
        if(!this.verifys(msg))return;
        let bot=this.bot;

        if(args[0])
        {    
            this.settingsManager.set("prefix",args[0]);
        }
        this.tryDelete(msg);
    }
}
module.exports=Prefix;