const Path=require("../PathSetting");
const {Cmd} =require(`${Path.jsFolder}botHandler.js`);
class Enable extends Cmd
{
    constructor(settingsManager,botHandler)
    {
        super(settingsManager,botHandler);
        this.name="enable";
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.defaultSetting.alias=["en","on"];
        this.defaultSetting.op=true;
        this.settingsProcess();
    }
    onmessage({cmd,args,msg})
    {
        if(!this.verifys(msg))return;
        let config=this.settingsManager.settings.functions;
        if(config[args[0]])
        {
            this.settingsManager.funcSet(`${args[0]}.enable`,true);
        }
        this.tryDelete(msg);
    }
}
class Disable extends Cmd
{
    constructor(settingsManager,botHandler)
    {
        super(settingsManager,botHandler);
        this.name="disable";
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.defaultSetting.alias=["de","off"];
        this.defaultSetting.op=true;
        this.settingsProcess();
    }
    onmessage({cmd,args,msg})
    {
        if(!this.verifys(msg))return;
        let bot=this.bot;
        let config=this.settingsManager.settings.functions;
        if(config[args[0]])
        {
            this.settingsManager.funcSet(`${args[0]}.enable`,false);
        }
    }
}
module.exports={Enable,Disable};