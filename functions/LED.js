const test=true;

const  gpio = !test ?require('gpio-jetson-tx1-tx2'):
{
    write:(pin,val,err)=>console.log(`pin ${pin} write ${val}`),
    read:(pin,mode,err)=>console.log(`pin ${pin} read on mode ${mode}`),
    export:(pin,err)=>console.log(`pin ${pin} exported`),
    direction:(pin,mode,err)=>console.log(`pin ${pin} set to ${mode} mode`)
};
const Path=require("../PathSetting");
const {Cmd} =require(`${Path.jsFolder}botHandler.js`);
const LedPings=[396,392,481,393];
class LED extends Cmd
{
    constructor(settingsManager,bot)
    {
        super(settingsManager,bot);
        this.name="led";
        this.defaultSetting.alias=["LED","l"];
        this.defaultSetting.op=true;
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.settingsProcess();
        this.initGpio();
        this.isShining=false;
    }
    initGpio()
    {
        let err=e=>console.log(e);
        for(let pin of LedPings)
        {
            gpio.export(pin,err)
            gpio.direction(pin,"out",err);
        }
    }
    clearGpio()
    {
        for(let pin of LedPings)
        {
            gpio.write(pin,false,err);
        }
    }

    onmessage(config)
    {
        let {cmd,args,msg,content,channel,author,member}=config;
        if(!this.verifys(msg))return;
        let bot=this.bot;
        let subCmd=args[0];
        let valMapping={
            on:true,
            off:false
        }
        switch(subCmd)
        {
            case "on":
            case "off":
                let pin=parseInt(args[1])-1;
                pin=LedPings[pin];
                gpio.write(pin,valMapping[subCmd]);
            break;
            case "shine":
            case "shining":
                if(this.isShining)break;
                this.isShining=true;
                let times=parseInt(args[1])*2;
                let light=false;

                let tid=setInterval(()=>
                {
                    if(times==0)
                    {
                        clearInterval(tid);
                        this.isShining=false;
                        return;
                    }
                        
                    for(let i=0;i<4;i++)
                    {
                        let pin=LedPings[i];
                        gpio.write(pin,light);
                        light=i==1?!light:light;
                        
                    }
                    console.log("\n");
                    times--;
                },1000);
            break;
        }
        this.tryDelete(msg);
    }
}

module.exports={LED};