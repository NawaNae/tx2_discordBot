const Path=require("../PathSetting");
const {Cmd} =require(`${Path.jsFolder}botHandler.js`);
class Set extends Cmd
{
    constructor(settingsManager,bot)
    {
        super(settingsManager,bot);
        this.name="set";
        this.defaultSetting.alias=["S"];
        this.defaultSetting.op=true;
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.settingsProcess();
    }
    onmessage({cmd,args,msg})
    {
        if(!this.verifys(msg))return;
        let bot=this.bot;
        let func=args[0],key=`functions.${func}.${args[1]}`;
        let config=this.settingsManager.settings.functions;
        if(!config[func])
        {
            msg.channel.send(`no such a function name is called ${func}`);
            return ;
        }
        let val=args[2];
        if(args[3]=="int")
            val=parseInt(val);
        else if(args[3]=="float")
            val=parseFloat(val);
        else if(args[3]=="bool"||args[3]=="boolean")
            val=val=="true"?true:false;
        this.settingsManager.set(key,val);
        this.tryDelete(msg);
    }
}
module.exports=Set;