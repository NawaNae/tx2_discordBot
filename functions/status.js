const Path=require("../PathSetting");
const {Cmd} =require(`${Path.jsFolder}botHandler.js`);
class Status extends Cmd
{
    constructor(settingsManager,botHandler)
    {
        super(settingsManager,botHandler);
        this.name="status";
        this.botHandler=botHandler;
        this.defaultSetting.op=true;
        this.defaultSetting.alias=["s","st","sta","stat"];
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.settingsProcess();
    }
    onmessage({cmd,args,msg})
    {
        if(!this.verifys(msg))return;
        let bot=this.bot;
        let funcs=this.settingsManager.settings.functions;
        let filter=undefined;
        if(args.length>0)
            filter=args[0].split(",");
        let ans=`        \`status\`        
prefix:\`${this.settingsManager.settings.prefix}\`\n`;
        for(let func of this.botHandler.functions)
        {
            if(!filter)
                ans+=func.stausString;
            else if(filter.indexOf(func.name)!==-1)
                ans+=func.stausString;
        }
        for(;;)
        {
            let temp=ans.slice(0,1999);
            let lastNewline=temp.lastIndexOf("\n");
            if(lastNewline==-1)break;
            msg.channel.send(temp.slice(0,lastNewline));
            ans=ans.slice(lastNewline+1);
        }
        this.tryDelete(msg);
    }
}
module.exports=Status;