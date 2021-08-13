let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let request = require("request");
let cheerio = require("cheerio");
let scoreCardObj = require("./Scorecard");
let fs = require("fs");
let path = require("path");
let maindirPath = path.join(__dirname,"IPL");
dirCreater(maindirPath);

request(url, cb);

function cb(err,response,html){
    if(err){
        console.log(err);
    }else if(response.statusCode == 404){
        console.log("page not found");
    }else{
        // console.log(html);
        // console.log("html",);

        dataExtractor(html);
    }
}

function dataExtractor(html){
    let searchTool = cheerio.load(html);
    let anchorRep = searchTool('a[data-hover="View All Results"]');
    let link = anchorRep.attr("href");
    //console.log("Link",link);
    let fullMatchPageLink = `https://www.espncricinfo.com${link}`;
    //console.log("Link",fullMatchPageLink);
    request(fullMatchPageLink,allMatchPagecb);
}

function allMatchPagecb(err,response,html){
    if(err){
        console.log(err);
    }else if(response.statusCode == 404){
        console.log("page not found");
    }else{
        // console.log(html);
        // console.log("html",);

        getAllScoreCardLink(html);
    }
}
function getAllScoreCardLink(html){
    let searchTool = cheerio.load(html);
    let scorecardsArr = searchTool("a[data-hover='Scorecard']");
    for(let i = 0; i < scorecardsArr.length; i++){
        let link = searchTool(scorecardsArr[i]).attr("href");
        let fullAllmatchPageLink = `https://www.espncricinfo.com${link}`;
        //console.log(fullAllmatchPageLink);
        scoreCardObj.processSinglematch(fullAllmatchPageLink);
    }
}
function dirCreater(teamFolderPath){
    if(fs.existsSync(teamFolderPath) == false){
        fs.mkdirSync(teamFolderPath);
    }
}