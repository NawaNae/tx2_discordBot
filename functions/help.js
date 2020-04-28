const Path=require("../PathSetting");
const {Cmd} =require(`${Path.jsFolder}botHandler.js`);
class Help extends Cmd
{
    constructor(settingsManager,botHandler)
    {
        super(settingsManager,botHandler);
        this.name="help";
        this.defaultSetting.alias=["?"];
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.settingsProcess();
    }
    onmessage({cmd,args,msg,author})
    {
        if(!this.verifys(msg))return;
        let bot=this.bot;
        let user=author;
        let filter;
        if(args.length>0)
            filter=args[0].split(",");
        let ans="    `help`\n\n";
        ans+=`prefix : \`${this.settingsManager.settings.prefix}\`\n    _All commands should start with prefix_\n\n`;
        for(let func of this.botHandler.functions)
        {
            if(func.opVerify(user))
            {
                if(!filter)
                    ans+=func.helpString;
                else if(filter.indexOf(func.name)!==-1)
                    ans+=func.helpString;
            }
        }
        for(;;)
        {
            let temp=ans.slice(0,1999);
            let lastNewline=temp.lastIndexOf("\n");
            if(lastNewline==-1)break;
            let snd=temp.slice(0,lastNewline)
            msg.channel.send(snd);
            ans=ans.slice(lastNewline+1);
        }
        this.tryDelete(msg);
        
    }
}
module.exports=Help;