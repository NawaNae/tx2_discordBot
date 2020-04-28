const Path=require("../PathSetting");
const {Cmd} =require(`${Path.jsFolder}botHandler.js`);
function opOperation(settingsManger,{cmd,args,msg},bot,operator="add")
{
    
    if (msg.mentions.users.size>0)
    for(let [key,value] of msg.mentions.users)
        settingsManger.manipulateArray("ops",key,operator);
    else
    {
        let user=bot.users.get(args[0]);
        if(user)
            settingsManger.manipulateArray("ops",args[0],operator);
    }
}
class Op extends Cmd
{
    constructor(settingsManager,botHandler)
    {
        super(settingsManager,botHandler);
        this.name="op";
        this.defaultSetting.op=true;
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.settingsProcess();
    }
    onmessage({cmd,args,msg})
    {
        if(!this.verifys(msg))return;
        opOperation(this.settingsManager,arguments[0],this.bot,"add");
        
    }
}
class Deop extends Cmd
{
    constructor(settingsManager,botHandler)
    {
        super(settingsManager,botHandler);
        this.name="deop";
        this.defaultSetting.op=true;
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.settingsProcess();
    }
    onmessage({cmd,args,msg})
    {
        if(!this.verifys(msg))return;
        opOperation(this.settingsManager,arguments[0],this.bot,"delete");
    }
}
module.exports={Op,Deop};