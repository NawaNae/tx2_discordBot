const Path=require("../PathSetting");
const {Cmd} =require(`${Path.jsFolder}botHandler.js`);
class Ping extends Cmd
{
    constructor(settingsManager,bot)
    {
        super(settingsManager,bot);
        this.name="ping";
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.defaultSetting.alias=["p","P"];
        this.settingsProcess();
    }
    onmessage({cmd,args,msg,channel})
    {
        if(!this.verifys(msg))return;
        let bot=this.bot;
        if(this.sendOrEdit(channel,`ping: *${bot.ping.toFixed()}ms*`))
            this.tryDelete(msg);
    }
}
module.exports=Ping;